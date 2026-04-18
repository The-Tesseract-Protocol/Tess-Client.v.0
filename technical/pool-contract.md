---
icon: '2'
cover: ../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
metaLinks:
  alternates:
    - /broken/spaces/HJ9mgOsZHf67ghIAEI2U/pages/2w81oPABMW6K5dLItqN6
---

# Pool Contract

The Pool Contract is the simplest but most critical component, it maintains the aggregate balance of all asset ( for which the contract is configured ) deposited by institutions and enforces the invariant that total withdrawals never exceed total deposits. It acts as the settlement surface for public value flows while remaining institution-agnostic.

No institution identity is stored here, deposits are recorded as anonymous amounts only.

***

### Purpose <a href="#purpose" id="purpose"></a>

The Pool receives deposits from institutions , reserves funds for pending settlements, and finalizes withdrawals after Distributor execution. It enforces value conservation across all institutions collectively:

```
Total Deposits ≥ Total Withdrawals at all times
```

***

### Data Structures <a href="#data-structures" id="data-structures"></a>

{% code expandable="true" %}
```rust
pub struct PoolState {
    /// Total XLM in pool (sum of all deposits)
    pub total_balance: i128,
    
    /// List of deposits (timestamp, amount)
    /// Used for audit trail and transparency
    pub deposits: Vec<(u64, i128)>,
    
    /// List of pending withdrawals (invoice_id, amount)
    /// Used to prevent overdrafts
    pub pending_withdrawals: Vec<(Bytes, i128)>,
}

pub struct Invoice {
    pub invoice_id: Bytes,              // Unique settlement proof ID
    pub H_encrypted: Bytes,             // Reference to withdrawal power (encrypted)
    pub requested_amount: i128,         // Amount authorized
    pub settlement_proof: Bytes,        // Hash of actual settlement
    pub executed_at: u64,               // Block height when settled
}
```
{% endcode %}

***

### Key Invariant <a href="#key-invariant" id="key-invariant"></a>

```rust
Total Withdrawals ≤ Total Deposits
Σ(pending_withdrawals) + Σ(settled_withdrawals) ≤ total_balance
```

Violations are impossible due to Soroban invariants enforced at the contract level.

***



### Functional Overview

{% stepper %}
{% step %}
### deposit(amount) → transaction\_hash

**What it does**: Accepts asset from institutions into the pool.

**Parameters**:

* `amount`: XLM to deposit (must be > 0)​

**Returns**: On-chain acknowledgment (amount added to `total_balance`).

**Invariants**:

* Amount must be positive
* Pool balance increases atomically
* No institution identity stored&#x20;

<details>

<summary><strong>Example</strong>:</summary>

The Funding Cycle When an institution commits capital to the protocol, the system records the transaction across the following state variables:

1. Liquidity Injection: The institution deposits 1M XLM into the smart contract vault.
2. Global State Update: `Pool.total_balance` increments by 1M, updating the available liquidity pool in real-time.
3. Historical Tracking: A new entry is appended to the ledger: `deposits.push((block_height, 1M))`. This anchors the deposit to a specific immutable point in time.
4. Operational Readiness: The pool is now authorized to lend this specific liquidity to the SDP Distributor for disbursement.

</details>

**Privacy**: No institution identifier attached
{% endstep %}

{% step %}
### reserve\_for\_settlement(invoice\_id, amount) → reserved

**What it does**: Reserves funds for upcoming settlement (called by Distributor before executing SDP batch).

**Parameters**:

* `invoice_id`: Settlement identifier​
* `amount`: XLM to reserve

**Returns**: Confirmation that funds are reserved (frozen from other use).

**Invariants**:

* Amount ≤ available balance
* Cannot double-reserve same invoice
* Prevents pool overdraft

<details>

<summary><strong>Example</strong>:</summary>

The Settlement Safeguard

When the Distributor initiates a batch withdrawal, the liquidity pool transitions from "Available" to "Reserved" to ensure transactional integrity.

1. Reservation: The pool executes `Pool.reserve_for_settlement(invoice_001, 100K)`. This earmarks the specific amount for the pending batch.
2. Queueing: The transaction is added to the system state: `pending_withdrawals.push((invoice_001, 100K))`.
3. Concurrency Control: The 100K XLM is immediately frozen. It remains in the pool but is excluded from "Available Liquidity," preventing any risk of double-spending or over-leveraging during the settlement window.

***

#### Transaction State Transition

<table data-header-hidden><thead><tr><th width="104.40625"></th><th width="263.8203125"></th><th></th></tr></thead><tbody><tr><td><strong>State</strong></td><td><strong>Logic</strong></td><td><strong>Effect</strong></td></tr><tr><td>Available</td><td><code>total_balance - reserved</code></td><td>Liquidity ready for new requests.</td></tr><tr><td>Reserved</td><td><code>amount == withdrawal_request</code></td><td>Funds locked to <code>invoice_id</code>.</td></tr><tr><td>Settled</td><td><code>total_balance -= amount</code></td><td>Funds moved to recipients; lock released.</td></tr></tbody></table>

</details>
{% endstep %}

{% step %}
### settle\_withdrawal(invoice\_id, settlement\_proof) → settled

**What it does**: Finalises withdrawal settlement (called after SDP batch executes successfully).

**Parameters**:

* `invoice_id`: Settlement identifier
* `settlement_proof`: Hash of actual recipients/amounts (from Distributor)

**Returns**: Confirmation that withdrawal is finalised.

**Invariants**:

* Invoice must exist in pending\_withdrawals
* Amount must not exceed pool balance
* Settlement is final (irreversible)

<details>

<summary><strong>Example</strong>:</summary>

Closing the Transaction Loop

Once the Distributor successfully completes the disbursement via the Stellar Disbursement Platform (SDP), the pool state is updated to reflect the permanent movement of funds.

1. Settlement Call: The Distributor triggers `Pool.settle_withdrawal(invoice_001, hash_xyz)`. This links the internal invoice to the on-chain transaction hash.
2. Queue Clearance: The entry is purged from the state: `pending_withdrawals.remove(invoice_001)`. This releases the temporary lock on the system resources.
3. Balance Finalization: The pool executes `total_balance -= 100K`. The reduction is now permanent and reflects the actual capital outflow.
4. Audit Archiving: The finalized invoice, including its cryptographic proof, is moved to long-term storage for institutional reporting and regulatory audits.

***

#### State Resolution Table

| **Component**           | **Action**           | **Final State**  |
| ----------------------- | -------------------- | ---------------- |
| Pending Queue           | Remove `invoice_001` | Clean            |
| Liquidity Pool          | Subtract `100K`      | Updated Balance  |
| Audit Log               | Append `hash_xyz`    | Verifiable       |
| Double-Spend Protection | Release Lock         | Safety Confirmed |

</details>
{% endstep %}
{% endstepper %}

### Storage <a href="#storage" id="storage"></a>

**Key Format**:

```
pool_state:PoolState → Singleton (one per pool)
invoices:(invoice_id) → Invoice (ledger of all settlements)
```

**Why no institution tracking**:

* Deposits linked only to amounts + timestamps
* No institution\_id stored
* Withdrawal power is separately encrypted (H\_encrypted)
* No correlation possible&#x20;

***
