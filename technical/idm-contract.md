---
description: Institutional Deposit Manager
icon: '3'
cover: ../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
---

# IDM Contract

The IDM Contract is the core of the Tess system. It tracks withdrawal power (encrypted), withdrawal intents (audit trail), multi-sig approvals, and recovery mechanisms. Institutions control access via secret-derived encrypted hashes (`H_encrypted`), with zero PII stored on-chain.

This contract implements principles 2.3 (delegation), 2.6 (no irrecoverable state), and 2.4 (auditability).

***

### Core Concept <a href="#core-concept-encrypted-hash" id="core-concept-encrypted-hash"></a>

<h3 id="core-concept-encrypted-hash" align="center">Encrypted Hash</h3>

<figure><img src="../.gitbook/assets/Screenshot 2026-01-28 at 22.31.58.png" alt="" width="373"><figcaption></figcaption></figure>



**Why this works**:

* `H_encrypted` is opaque (cannot be reversed to S)
* Institution is the only holder of private\_key
* No institution identifier needed
* Withdrawal power is linked to S (only institution can access)
* On-chain has ZERO PII

***

### Data Structures <a href="#data-structures" id="data-structures"></a>

{% code expandable="true" %}
```rust
pub struct WithdrawalPower {
    /// Encrypted hash of secret S
    pub H_encrypted: Bytes,
    
    /// How much XLM can still be withdrawn
    pub remaining_amount: i128,
    
    /// When this power was created (for audit)
    pub created_at: u64,
    
    /// Lifecycle lock (prevents simultaneous withdrawals)
    pub lifecycle_lock: bool,
    pub lock_expires_at: Option<u64>,
}

pub struct WithdrawalIntent {
    /// Unique intent identifier
    pub intent_id: Bytes,
    
    /// Reference to withdrawal power (encrypted hash)
    pub H_encrypted: Bytes,
    
    /// How much was requested
    pub requested_amount: i128,
    
    /// Relayer's signature (proof of request)
    pub relayer_signature: Bytes,
    
    /// Status: 0=PENDING, 1=EXECUTED, 2=FAILED, 3=EXPIRED
    pub status: u32,
    
    /// Hash of actual settlement (from Distributor)
    pub settlement_proof: Option<Bytes>,
    
    /// When it was created and executed
    pub created_at: u64,
    pub executed_at: Option<u64>,
    pub expires_at: u64,
}

pub struct DelegatedWithdrawal {
    /// Unique request identifier
    pub request_id: Bytes,
    
    /// Reference to withdrawal power
    pub H_encrypted: Bytes,
    
    /// How much requested
    pub required_amount: i128,
    
    /// Approval count (current)
    pub approval_count: u32,
    
    /// Threshold required
    pub threshold: u32,
    
    /// Status: 0=PENDING, 1=APPROVED, 2=REJECTED
    pub status: u32,
    
    /// Lifecycle
    pub created_at: u64,
    pub expires_at: u64,
    // NO approver identities stored ✅
}

pub struct RecoveryRequest {
    /// Unique recovery identifier
    pub recovery_id: Bytes,
    
    /// Which secret to recover
    pub H_encrypted: Bytes,
    
    /// Status: 0=PENDING, 1=APPROVED, 2=EXECUTED
    pub recovery_status: u32,
    
    /// 24-hour timelock
    pub initiated_at: u64,
    pub can_execute_at: u64,
    
    /// Recovery outcome
    pub execution_status: bool,
    // NO contact identities stored ✅
}
```
{% endcode %}

<details>

<summary><strong>Phase 0: Deposit and Sync</strong></summary>

### Step 1: Create Deposit Commitment

Before depositing, the wallet generates a cryptographic commitment.

```javascript
commitment = Poseidon(master_secret, deposit_address, nonce)
```

**Private inputs (kept secret)**

* `master_secret`: User’s root secret
* `deposit_address`: Address used to deposit funds
* `nonce`: Random value ensuring uniqueness

**Public output**

* `commitment`: 32-byte hash representing the deposit

Example:

```javascript
commitment = 0x4f3a2b1c5d6e7f8a...
```

This commitment hides the secret inputs and cannot be reversed.

***

### Step 2: Submit Deposit Transaction

The user deposits funds into the pool and includes the commitment in the transaction memo.

```rust
Transaction:
  from:   GABC...        (public)
  to:     GPOOL123...    (public pool)
  amount: 100 XLM        (public)
  memo:   0x4f3a2b1c...  (commitment)
```

The relayer indexes this commitment:

```javascript
indexed_commitments[commitment] = {
    amount: 100,
    claimed: false
}
```

The relayer stores only the commitment and amount. It cannot determine the secret inputs.

***

### Step 3: Generate Zero-Knowledge Proof

Later, the user generates a zero-knowledge proof showing ownership of the commitment.

**Public inputs (visible to relayer)**

```rust
commitment:   0x4f3a2b1c...
H_encrypted:  0x7a8b9c0d...
amount:       100
```

**Private witness (never revealed)**

```rust
master_secret
deposit_address
nonce
```

***

### Step 4: Zero-Knowledge Circuit Constraints

The proof enforces the following constraints.

#### Constraint 1: Commitment correctness

```javascript
computed_commitment =
    Poseidon(master_secret, deposit_address, nonce)

assert(computed_commitment == commitment)
```

This proves the user knows the secret values used to create the deposit commitment.

***

#### Constraint 2: Withdrawal identifier derivation

```javascript
h = Poseidon(master_secret, deposit_address)

computed_H_encrypted =
    Encrypt(h, deposit_address)

assert(computed_H_encrypted == H_encrypted)
```

This proves the withdrawal identifier was derived from the same secret.

***

#### Constraint 3: Secret consistency

Both constraints must use the same:

* master\_secret
* deposit\_address
* nonce

This prevents forgery.

***

### Step 5: Submit Proof to Relayer

The user submits:

```rust
commitment
H_encrypted
amount
proof π
```

Proof size:

```
~256 bytes
```

***

### Step 6: Relayer Verification

The relayer performs the following verification:

```javascript
if (
    commitment exists in indexed_commitments &&
    indexed_commitments[commitment].claimed == false &&
    indexed_commitments[commitment].amount == amount &&
    Verify(proof π, public_inputs) == true
) {
    indexed_commitments[commitment].claimed = true

    WithdrawalPower[H_encrypted] = amount
}
```

Verification confirms:

* The commitment exists
* The commitment is unclaimed
* The proof is valid
* The prover knows the commitment secret

Verification does not reveal:

* master\_secret
* deposit\_address
* nonce

***

### Result

After successful verification:

* The commitment is marked as claimed
* The withdrawal identifier receives authorisation
* The relayer confirms ownership without knowing the depositor identity

This completes the private deposit → zero-knowledge verification flow and then proceeds to the withdrawal power creation phase.

</details>

<details>

<summary><strong>Phase 1: Basic Withdrawal Flow</strong></summary>

### **create\_withdrawal\_power(H\_encrypted, amount) → withdrawn\_power\_id**

**Called by**: Backend (async after deposit).



**On-chain storage**:

```rust
withdrawal_power[H_encrypted] = WithdrawalPower {
    H_encrypted,
    remaining_amount: amount,
    created_at: now,
    lifecycle_lock: false,
}
```

**Invariants**:

* `H_encrypted` must not already exist
* `amount > 0`
* Pool must have sufficient balance

***

### create\_withdrawal\_intent(intent\_id, H\_encrypted, requested\_amount, relayer\_signature) → intent\_id

**Called by**: Relayer service.

**On-chain storage**:

{% code overflow="wrap" expandable="true" %}
```rust
withdrawal_intent[(H_encrypted, intent_id)] = WithdrawalIntent {
    intent_id,
    H_encrypted,
    requested_amount,
    relayer_signature,
    status: 0, // PENDING
    settlement_proof: None,
    created_at: now,
    executed_at: None,
    expires_at: now + 7_days,
}
```
{% endcode %}

**Validations**:

* withdrawal\_power\[H\_encrypted] exists
* withdrawal\_power\[H\_encrypted].remaining\_amount >= requested\_amount
* intent\_id not already used
* Not expired

***

### execute\_withdrawal(intent\_id, H\_encrypted, settlement\_proof) → invoice\_id

**Called by**: Distributor service (async + delay after SDP batch).

**On-chain updates**:

{% code overflow="wrap" expandable="true" %}
```rust
// Update intent
withdrawal_intent[(H_encrypted, intent_id)].status = 1; // EXECUTED
withdrawal_intent[(H_encrypted, intent_id)].settlement_proof = Some(settlement_proof);
withdrawal_intent[(H_encrypted, intent_id)].executed_at = Some(now);

// Decrease withdrawal power
withdrawal_power[H_encrypted].remaining_amount -= requested_amount;

// Create invoice
invoice[invoice_id] = Invoice { ... };
```
{% endcode %}

**Invariants**:

* Intent must exist and be PENDING
* Intent must not be expired
* Withdrawal power must exist and have sufficient funds​
* Settlement is final (irreversible)

</details>

<details>

<summary><strong>Phase 2: Multi-Sig &#x26; Recovery</strong></summary>

### create\_delegated\_withdrawal / execute\_delegated\_withdrawal

Creates multi-sig request with threshold, updates approval count off-chain, executes when threshold met. No approver identities on-chain.

### initiate\_recovery / execute\_recovery

Initiates secret recovery with 24-hour time-lock, executes with new secret after quorum. No contact identities on-chain.

### Storage Schema <a href="#storage-schema" id="storage-schema"></a>

```rust
withdrawal_power: Map<H_encrypted, WithdrawalPower>
withdrawal_intent: Map<(H_encrypted, intent_id), WithdrawalIntent>
delegated_withdrawal: Map<(H_encrypted, request_id), DelegatedWithdrawal>
recovery_request: Map<recovery_id, RecoveryRequest>
invoice: Map<invoice_id, Invoice>
```

All keys are opaque hashes or unique IDs, no addresses or PII.

***

### Query Functions  <a href="#query-functions-read-only" id="query-functions-read-only"></a>

* `get_withdrawal_power(H_encrypted)` – Current remaining power.
* `get_withdrawal_intents(H_encrypted)` – All intents for secret.
* `verify_settlement_proof(intent_id, H_encrypted, claimed_proof)` – Cryptographic verification.

</details>

