---
description: From HSM Trust to Mathematical Proof
icon: '1'
cover: ../../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
---

# Zero-Knowledge Protocol Evolution

Our MVP relies on HSM trust model. Future versions eliminate human/operator trust entirely via zero-knowledge proofs and Soroban's Protocol 25 advanced cryptography.

***

### The Problem: MVP Trust Model Dependency <a href="#the-problem-mvp-trust-model-dependency" id="the-problem-mvp-trust-model-dependency"></a>

<figure><img src="../../.gitbook/assets/Screenshot 2026-01-29 at 17.01.27.png" alt=""><figcaption></figcaption></figure>

_**Critical Question: How do institutions verify payment distribution happened correctly without trusting any operator?**_

### Why ZK Changes Everything

Core Concept

> Zero-Knowledge Proof (ZKP): "I can prove statement X is true without revealing the data that makes X true."

***

### Proof & Validation Layers

The system utilises ZKPs to decouple transaction validity from sensitive data exposure:

* Relayer (Authorisation Proof):
  * Proves: "This withdrawal request is authorised by a valid institution."
  * Hides: Institution identity, specific recipient lists, and individual amounts.
* Distributor (Settlement Proof):
  * Proves: "These 100 recipients were successfully funded according to the batch manifest."
  * Hides: Recipient names and individual wallet addresses.
* Ledger (Public Verification):
  * Records: A verifiable "Success" state.
  * Hides: All sensitive underlying data.

***

### Paradigm Shift

The integration of ZKPs transforms the platform's security model:

* Legacy Model: Trust that humans/admins follow internal rules.
* ZKP Model: Math proves that rules were followed via cryptographic verification.

***

## Zero-Knowledge Proof Flows

The system uses zero-knowledge proofs to enable private withdrawal authorization and verifiable settlement without revealing institutional identity, secret keys, or recipient data.

Two independent proof flows exist:

1. **Authorization Proof** - proves control over withdrawal power
2. **Settlement Proof** - proves correct execution of payments



<details>

<summary><strong>ZK-Backed Authorisation: Withdrawal Intent Flow</strong></summary>

Authorisation proofs allow an institution to prove control over a withdrawal power identifier (`H_encrypted`) without revealing the underlying secret key or wallet identity.

***

### Problem Definition

The institution must prove:

> “I control withdrawal power `H_encrypted` and am authorised to request a withdrawal.”

Without revealing:

* Secret key
* Wallet address
* Institutional identity
* Internal authorisation logic

Authorisation is based purely on mathematical proof.

***

### Step 1: Proof Generation (Client-Side)

The institution generates a zero-knowledge proof locally.

#### Public Inputs

```
H_encrypted: Field
requested_amount: Field
```

#### Private Witness

```
secret_key: Field
institution_params: Field
```

***

### Circuit Constraints

The circuit enforces proof of withdrawal power ownership.

#### Constraint 1: Withdrawal power ownership

```
computed_H =
    Poseidon(secret_key, institution_params)

assert(computed_H == H_encrypted)
```

This proves the institution controls the withdrawal power.

***

#### Constraint 2: Amount validity

```
assert(requested_amount > 0)
```

This prevents invalid withdrawal requests.

***

#### Proof Output

```
proof π
```

**Properties**

| Parameter       | Value        |
| --------------- | ------------ |
| Proof size      | \~256 bytes  |
| Generation time | 5–30 seconds |
| Generated       | Client-side  |

***

### Step 2: Submit Withdrawal Request

The institution submits the withdrawal request to the Relayer.

```rust
POST /withdrawal-request

{
  H_encrypted: "0x7a8b9c0d...",
  requested_amount: 100,
  recipients_encrypted: [...],
  proof: π
}
```

No identity information or wallet signature is required.

Authorisation relies solely on the zero-knowledge proof.

***

### Step 3: Relayer Verification

The Relayer verifies the withdrawal request.

```rust
async function processWithdrawalRequest(request) {

  const withdrawal_power =
      await idm.getWithdrawalPower(request.H_encrypted)

  if (!withdrawal_power)
      throw Error("Withdrawal power not found")

  if (withdrawal_power.remaining_amount <
      request.requested_amount)
      throw Error("Insufficient balance")

  const valid =
      await verifyBN254Proof(
          request.proof,
          [
            request.H_encrypted,
            request.requested_amount
          ]
      )

  if (!valid)
      throw Error("Invalid authorization proof")

  const intent_id =
      await idm.createWithdrawalIntent({
          H_encrypted: request.H_encrypted,
          requested_amount: request.requested_amount,
          recipients_encrypted: request.recipients_encrypted,
          authorization_proof: request.proof,
          status: "PENDING",
          created_at: now()
      })

  return intent_id
}
```

**Verification time:** < 5 ms

***

### Step 4: On-Chain State Creation

After verification, a withdrawal intent is stored.

```rust
WithdrawalIntent {
  intent_id: "intent_123",
  H_encrypted: Field,
  requested_amount: u64,
  recipients_encrypted: Bytes,
  authorization_proof: Proof,
  status: PENDING,
  created_at: Timestamp
}
```

This intent authorizes the Distributor to execute settlement.

***

### Privacy and Security Properties

#### Relayer Can See

* Withdrawal power identifier
* Requested amount
* Encrypted recipient payload
* Proof validity

#### Relayer Cannot See

* Secret key
* Wallet address
* Institution identity
* Recipient identities

***

### Security Guarantees

| Property                | Description                                      |
| ----------------------- | ------------------------------------------------ |
| Zero-knowledge          | Secret key never revealed                        |
| Soundness               | Proof cannot be forged                           |
| Authorisation integrity | Only valid controllers can authorize withdrawals |
| Privacy                 | Institution remains anonymous                    |
| Non-repudiation         | Proof stored permanently                         |

</details>

<details>

<summary><strong>ZK-Backed Settlement: Invoice Flow</strong></summary>

Settlement proofs allow the Distributor to prove correct payment execution without revealing recipient identities publicly.

***

### Problem Definition

The Distributor must prove:

> “The Stellar transaction executed exactly matches the encrypted withdrawal instructions.”

Without revealing:

* Recipient identities
* Individual payment mappings
* Internal recipient data

***

### Step 1: Execute Stellar Transaction

The Distributor decrypts recipients and executes payment.

```rust
recipients = decrypt(intent.recipients_encrypted)

tx = buildBatchTransaction(recipients)

result = submitTransaction(tx)

tx_hash = result.hash
```

Example transaction:

```rust
TX_stellar_abc123

Payments:
40 XLM
30 XLM
30 XLM

Total: 100 XLM
```

***

### Step 2: Generate Settlement Proof

#### Public Inputs

```
H_encrypted: Field
tx_hash: Field
total_amount: Field
merkle_root: Field
```

#### Private Witness

```
recipients: List
amounts: List
addresses: List
```

***

### Circuit Constraints

#### Constraint 1: Total amount correctness

```
assert(sum(amounts) == total_amount)
```

***

#### Constraint 2: Recipient commitment integrity

```rust
leaves =
  Poseidon(recipients[i], amounts[i])

computed_root =
  MerkleRoot(leaves)

assert(computed_root == merkle_root)
```

***

#### Constraint 3: Stellar transaction binding

```rust
for each payment:
  assert(operation.destination == address)
  assert(operation.amount == amount)
```

***

#### Constraint 4: Payload integrity

```rust
assert(
  Hash(recipients_encrypted)
  ==
  intent.payload_hash
)
```

***

#### Proof Output

```
proof π
```

**Properties**

| Parameter       | Value         |
| --------------- | ------------- |
| Proof size      | \~256 bytes   |
| Generation time | 10–60 seconds |

***

### Step 3: Submit Settlement Proof

```rust
POST /settlement-proof

{
  intent_id: "intent_123",
  H_encrypted: "...",
  tx_hash: "...",
  total_amount: 100,
  merkle_root: "...",
  proof: π
}
```

***

### Step 4: Relayer Verification

The Relayer verifies the transaction and proof.

```rust
async function verifySettlement(settlement) {

  intent =
      await idm.getWithdrawalIntent(
          settlement.intent_id
      )

  stellar_tx =
      await horizon.getTransaction(
          settlement.tx_hash
      )

  valid =
      await verifyBN254Proof(
          settlement.proof,
          [
            settlement.H_encrypted,
            hash(settlement.tx_hash),
            settlement.total_amount,
            settlement.merkle_root
          ]
      )

  if (!valid)
      throw Error("Invalid settlement proof")

  await idm.createInvoice({
      intent_id: settlement.intent_id,
      H_encrypted: settlement.H_encrypted,
      tx_hash: settlement.tx_hash,
      settlement_proof: settlement.proof,
      merkle_root: settlement.merkle_root,
      total_amount: settlement.total_amount,
      status: "SETTLED"
  })

  await idm.decrementWithdrawalPower(
      settlement.H_encrypted,
      settlement.total_amount
  )
}
```

Verification confirms:

* Transaction execution
* Payment integrity
* Instruction correctness

***

### Final On-Chain State

```rust
Invoice {
  invoice_id: ID,
  intent_id: ID,
  H_encrypted: Field,
  settlement_proof: Proof,
  merkle_root: Field,
  tx_hash: Hash,
  total_amount: u64,
  status: SETTLED
}
```

### Privacy and Security Properties

#### Relayer Can See

* Transaction hash
* Total amount
* Proof validity

#### Relayer Cannot See

* Recipient identities
* Recipient mappings
* Internal recipient data

***

### Security Guarantees

| Property        | Description                           |
| --------------- | ------------------------------------- |
| Privacy         | Recipient identities hidden           |
| Integrity       | Settlement cryptographically verified |
| Binding         | Proof tied to Stellar transaction     |
| Non-repudiation | Permanent settlement proof            |
| Auditability    | Institution can verify payments later |

</details>

#### Why Not MVP With ZK?

**Question**: Why not build ZK-based from start (Phase 1)?

**Answers**:

**1. Development Velocity**

* _Constraint_: ZK circuits typically add 6+ months to the development lifecycle.
* _Approach_: Launch the MVP without ZK to focus on core institutional confidentiality and rapid market entry.

**2. Risk Mitigation**

* _Constraint_: ZK bugs and cryptographic vulnerabilities can be catastrophic and difficult to patch.
* _Approach_: MVP establishes the functional system. The ZK layer is introduced only after the foundational infrastructure is battle-tested.

**3. Regulatory Alignment**

* _Constraint_: Regulators are currently comfortable with HSM trust models (audited, centralised security), ZK proofs are still seen as novel and complex.
* _Approach_: Use the MVP to educate regulators and build trust via established HSM standards before transitioning to advanced cryptography.

**4. Network Readiness**

* _Constraint_: Stellar Protocol 25 (optimising ZK/privacy primitives) is not yet mature in early 2026.
* _Approach_: The MVP remains compatible with Protocol 20+, reserving future performance privacy features once the network stabilises.

***
