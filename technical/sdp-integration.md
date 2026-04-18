---
icon: '4'
cover: ../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
---

# SDP Integration

The SDP Unit integrates \
&#xNAN;_&#x52;elayer (validation),_ \
_Distributor (execution),_ \
_TSS (ordering), and channel accounts (parallelisation)._ \
\
However, stock Stellar Disbursement Platform has critical limitations that Tess addresses. This page explains how SDP works, where it bottlenecks, and how Tess optimizes for institutional-scale throughput.

***

### Exploring SDP:

_Our findings and limitations_

{% tabs %}
{% tab title="Executive Summary" %}
The Stellar Disbursement Platform (SDP) operates on a "One Payment = One Transaction" model rather than utilising Stellar's capacity for operation batching (100 operations/tx). This design, combined with synchronous polling and channel-account-bound parallelism, significantly throttles throughput.

Current analysis indicates the system operates at **\~1% of theoretical capacity**. Scaling requires increasing the number of channel accounts, but this approach introduces severe database contention and rate-limiting risks.
{% endtab %}

{% tab title="Core Bottleneck: The "One-to-One" Mapping" %}
The primary limitation is the hardcoded 1:1 relationship between payments and Stellar transactions.

Evidence: Payment Dispatcher Logic

File: internal/services/paymentdispatchers/stellar\_payment\_dispatcher.go:58-83

{% code expandable="true" %}
```go
func (s *StellarPaymentDispatcher) sendPaymentsToTSS(ctx context.Context, sdpDBTx, tssDBTx db.DBTransaction, tenantID string, pendingPayments []*data.Payment) error {
    var transactions []txSubStore.Transaction
    for _, payment := range pendingPayments {  // ← LOOP: Each payment becomes ONE transaction
        // ... parsing code ...
        transaction := txSubStore.Transaction{
            ExternalID:  payment.ID,
            AssetCode:   payment.Asset.Code,
            AssetIssuer: payment.Asset.Issuer,
            Amount:      amount,
            Destination: payment.ReceiverWallet.StellarAddress,
            Memo:        memo.Value,
            MemoType:    memo.Type,
            TenantID:    tenantID,
        }
        transactions = append(transactions, transaction)  // ← One payment = one transaction
    }
```
{% endcode %}

Evidence: Transaction Construction

File: internal/transactionsubmission/transaction\_worker.go:530-542

{% code expandable="true" %}
```go
paymentTx, err := txnbuild.NewTransaction(
    txnbuild.TransactionParams{
        SourceAccount: &txnbuild.SimpleAccount{
            AccountID: txJob.ChannelAccount.PublicKey,
            Sequence:  horizonAccount.Sequence,
        },
        Operations: []txnbuild.Operation{
            &txnbuild.Payment{  // ← ONLY ONE OPERATION
                SourceAccount: distributionAccount.Address,
                Amount:        strconv.FormatFloat(txJob.Transaction.Amount, 'f', 6, 32),
                Destination:   txJob.Transaction.Destination,
                Asset:         asset,
            },
        },
```
{% endcode %}

**Conclusion:** Each transaction contains exactly **1 payment operation** (the Stellar protocol max of 100). This is the primary bottleneck.
{% endtab %}

{% tab title="Parallelism Constraints (Sequential Processing)" %}
Parallel processing is strictly limited by the number of available "Channel Accounts." The system uses a synchronous locking mechanism that pairs one channel account to one transaction.

Evidence: Bundle Creation Logic

File: internal/transactionsubmission/store/channel\_transaction\_bundle.go:106-129

{% code overflow="wrap" expandable="true" %}
```go
// STEP 3: lock channel accounts and transactions, and build the bundle slice:
bundleLen := len(unlockedChannelAccounts)  // ← LIMITED by available channel accounts
bundles := make([]*ChannelTransactionBundle, bundleLen)
for i := 0; i < bundleLen; i++ {
    chAcc := &unlockedChannelAccounts[i]
    var lockedChAcc *ChannelAccount
    lockedChAcc, err = m.channelAccountModel.Lock(ctx, dbTx, chAcc.PublicKey, int32(currentLedgerNumber), int32(lockToLedgerNumber))
    // ...

    bundles[i] = &ChannelTransactionBundle{
        ChannelAccount:          *lockedChAcc,
        Transaction:             *lockedTx,  // ← 1:1 mapping
        LockedUntilLedgerNumber: lockToLedgerNumber,
    }
}
```
{% endcode %}

* **Line 98:** Fetches exactly `len(unlockedTransactions)` channel accounts.
* **Line 107:** Creates bundles only for the **minimum** of (transactions, channel\_accounts).
* Each channel account is paired with exactly **ONE** transaction.

Evidence: Worker Execution

File: internal/transactionsubmission/manager.go:178-196

```go
for _, job := range jobs {
    worker, err := NewTransactionWorker(/* ... */)
    // ...
    txJob := TxJob(*job)
    go worker.Run(ctx, &txJob)  // ← Each goroutine processes ONE transaction
}
```

**Bottleneck Summary:**

1. **Channel Count:** Parallelism is capped by `num-channel-accounts` (Default: 2).
2. **Rate Limiter:** Parallelism is further capped by `DefaultBundlesSelectionLimit` (8) during congestion.
{% endtab %}

{% tab title="Further Limitations" %}
### Polling & Timing Limitations

The architecture imposes hard limits on how frequently the system attempts to process payments.

Evidence: Polling Interval Floor

File: internal/transactionsubmission/manager.go:51-52

```go
if so.QueuePollingInterval < 6 {
    return fmt.Errorf("queue polling interval must be greater than 6 seconds")
}
```

* **Minimum Interval:** 6 seconds.

Evidence: The Ticker Loop

File: internal/transactionsubmission/manager.go:149-164

{% code overflow="wrap" expandable="true" %}
```go
ticker := time.NewTicker(m.pollingInterval)  // ← Default: 6 seconds
defer ticker.Stop()

for {
    select {
    // ...
    case <-ticker.C:
        log.Ctx(ctx).Debug("Loading transactions from database...")
        jobs, err := m.loadReadyForProcessingBundles(ctx)  // ← Fetches limited bundles
```
{% endcode %}

Evidence: Rate Limiter Constants

File: internal/transactionsubmission/engine/tx\_processing\_limiter.go:10-13

```go
const (
    DefaultBundlesSelectionLimit         = 8  // ← MAX 8 transactions per poll
    IndeterminateResponsesToleranceLimit = 10
    MinutesInWindow                      = 3
)
```

Evidence: Rate Limiting Application

File: internal/transactionsubmission/manager.go:211

{% code overflow="wrap" expandable="true" %}
```go
chTxBundles, err := m.chTxBundleModel.LoadAndLockTuples(ctx, currentLedgerNumber, lockToLedgerNumber, m.txProcessingLimiter.LimitValue())
```
{% endcode %}

* `LimitValue()` returns either:
  * `CurrNumChannelAccounts` (Configured value, default 2).
  * `DefaultBundlesSelectionLimit` (8) during congestion.
* **Result:** At most **8 transactions** are loaded per poll during congestion, even if you have 10 channel accounts.

***

### Batch Size Constraints

File: `internal/scheduler/jobs/stellar_payment_to_submitter_job.go:20`

```go
const (
    stellarPaymentToSubmitterJobName   = "stellar_payment_to_submitter_job"
    stellarPaymentToSubmitterBatchSize = 100  // ← Only 100 payments queued at a time
)
```

This job runs periodically and queues only **100 payments** at a time into the Transaction Submission Service (TSS).
{% endtab %}
{% endtabs %}

<details>

<summary><strong>Why Tess Extends SDP</strong></summary>

<table><thead><tr><th>Limitation</th><th>Stock SDP</th><th width="227.0284423828125">Tess</th><th>Impact</th></tr></thead><tbody><tr><td><strong>Operations per Tx</strong></td><td>1 (hardcoded)</td><td>100 (Stellar protocol max)</td><td>100x potential throughput</td></tr><tr><td><strong>Withdrawal Power Integration</strong></td><td>Not integrated</td><td>Linked to IDM contract</td><td>Auditability + limits enforcement</td></tr><tr><td><strong>Intent-Based Execution</strong></td><td>Direct payment model</td><td>WithdrawalIntent on-chain</td><td>Audit trail + settlement proof</td></tr><tr><td><strong>Settlement Proofs</strong></td><td>None (fire-and-forget)</td><td><code>hash(recipients, amounts)</code></td><td>Non-repudiation + institution verification</td></tr><tr><td><strong>Recipient Confidentiality</strong></td><td>Visible to all operators</td><td>Encrypted (institution key)</td><td>Privacy preservation</td></tr><tr><td><strong>Parallel Batch Processing</strong></td><td>Strictly sequential per account</td><td>TSS + batch aggregation</td><td>Better ordering guarantees</td></tr><tr><td><strong>Institution Correlation</strong></td><td>Implicit via SDP operations</td><td>Zero institution data in SDP</td><td>Operational privacy</td></tr></tbody></table>



</details>

### Tess Optimizations: Transforming the SDP

Tess introduces a high-performance architectural layer that re-engineers the Stellar Disbursement Platform (SDP) for institutional scale. By moving from a "one-by-one" submission model to an aggregated, parallelized system, Tess achieves a \~12.5x throughput improvement while hardening privacy and auditability.

***

#### 1. Batch Aggregation: 100x Ledger Efficiency

Standard SDP instances submit one transaction per payment. Tess aggregates these into a single Stellar transaction containing up to 100 operations (the network's maximum).

* Stock SDP: 100 payments → 100 transactions → 100 ledger submissions.
* Tess Unit: 100 payments → 1 transaction → 1 ledger submission.
* Result: A 100x reduction in ledger load and a massive decrease in transaction fees per recipient.

#### 2. TSS Ordering: Deterministic Priority

The Transaction Submission Service (TSS) solves the "out-of-order" problem by enforcing a FIFO (First-In-First-Out) priority based on timestamps before batching.

1. Ingest: Receives unordered intents (e.g., A at 14:32:10, B at 14:32:20, C at 14:32:15).
2. Sort: Re-orders intents chronologically: A → C → B.
3. Batch: Fills the first batch with A and C, then B in the next.
4. Result: Prevents double-spending conflicts and provides a clean, auditable timeline.

#### 3. Parallel Batching with Channel Accounts

Tess maximizes throughput by distributing batches across multiple Channel Accounts simultaneously.

* Configuration: 10 Channels | Batch Size: 10.
* Execution: 100 intents are split into 10 batches. Each batch is assigned a unique channel and submitted in parallel.
* Throughput Comparison:
  * Stock SDP (10 Channels): \~13 recipients/s.
  * Tess (10 Channels): \~167 recipients/s.

#### 4. Settlement Proofs: Cryptographic Binding

Tess eliminates the "fire-and-forget" risk of legacy systems by generating a unique `settlement_proof` for every batch.

* Logic: `hash(recipient_data + amounts + stellar_tx_hashes)`.
* Verification: Institutions can decrypt local logs and re-compute the hash to verify it matches the on-chain proof.
* Outcome: Guaranteed non-repudiation—the Distributor cannot claim it paid Alice if the cryptographic proof doesn't align.

***

#### 5. Multi-Layered Privacy (Zero-Knowledge Context)

Tess ensures that no single service has a full view of the transaction lifecycle.

| **Service** | **Sees...**                     | **Cannot See...**                |
| ----------- | ------------------------------- | -------------------------------- |
| Relayer     | Institution ID, Total Amount    | Recipient Names/Addresses        |
| Distributor | Recipient List                  | Institution Identity (Opaque ID) |
| Ledger      | Encrypted Proofs, Public Hashes | Any Sensitive PII                |

***

### Tess SDP Unit Architecture  <a href="#arc-sdp-unit-architecture-revised" id="arc-sdp-unit-architecture-revised"></a>

<figure><img src="../.gitbook/assets/Screenshot 2026-01-30 at 11.05.40.png" alt="" width="312"><figcaption></figcaption></figure>

<details>

<summary><strong>Description</strong></summary>

#### Phase 1: Institutional Entry

The Institution initiates the process by sending two distinct data packets to ensure maximum privacy:

* Encrypted Payload: Contains metadata (amounts, authorization) encrypted for the Relayer.
* Recipients\_Encrypted: The sensitive PII list, encrypted specifically for the Distributor.

#### Phase 2: Validation & Routing (The Relayer)

The Relayer acts as the gateway and validator without ever seeing the recipient list:

* Decryption: Interfaces with the DFNS HSM to decrypt the operational payload.
* Signature Verification: Checks the ephemeral signature in memory only.
* Policy Check: Queries the Identity Management (IDM) layer for `withdrawal_power`.
* Intent Creation: Records a formal `WithdrawalIntent` on the IDM and logs an encrypted audit trail.
* Passing: Forwards the still-encrypted recipient list to the next stage.

#### Phase 3: The Engine (TSS & Channel Accounts)

The Transaction Submission Service (TSS) and Channel Accounts provide the high-performance scaling:

* TSS Ordering: Enforces FIFO (First-In-First-Out) priority to prevent double-spends and ensure deterministic auditing.
* Batching: Groups individual intents into optimized clusters (e.g., 10–100 per batch).
* Parallelization: Distributes batches across 10 to 1,000 parallel Channel Accounts, allowing the system to handle massive throughput simultaneously.

#### Phase 4: Execution & Proof (The Distributor)

The Distributor performs the final cryptographic and on-chain tasks:

* Decryption: Accesses the DFNS HSM to finally reveal the recipient names/addresses.
* Construction: Builds a single Stellar transaction with up to 100 operations (Batch Aggregation).
* Execution: Submits the atomic transaction to the Stellar Network.
* Non-Repudiation: Generates a `settlement_proof` (hash of recipients + amounts) to bind the execution to the request.
* Settlement: Closes the loop by calling `IDM.execute_withdrawal()`.

#### Phase 5: Ledger & Finality

The Stellar Blockchain serves as the immutable settlement layer:

* Immutable Ledger: Stores the permanent record of the disbursement.
* Speed: Achieves finality in 3–5 seconds per batch.
* Privacy: While recipient payments are public on-chain, the institution’s identity remains opaque through the Tess privacy layer.

***

#### Summary of System Integrity

| **Layer**   | **Responsibility** | **Security Property**                    |
| ----------- | ------------------ | ---------------------------------------- |
| Relayer     | Authorisation      | PII Blindness (Cannot see recipients)    |
| TSS         | Optimisation       | Concurrency Control (Prevents conflicts) |
| Distributor | Disbursement       | Non-Repudiation (Proves execution)       |
| Stellar     | Settlement         | Immutability (Permanent proof)           |



</details>

### Throughput Comparison: Stock SDP vs Tess  <a href="#throughput-comparison-stock-sdp-vs-arc" id="throughput-comparison-stock-sdp-vs-arc"></a>

(_\*theoretical max_)

| Metric                       | Stock SDP (Default) | Stock SDP (Optimized\*) | Tess SDP Unit                 |
| ---------------------------- | ------------------- | ----------------------- | ----------------------------- |
| **Operations per Tx**        | 1                   | 1                       | 100                           |
| **Channel Accounts**         | 2                   | 10                      | 10-1000                       |
| **Transactions per Poll**    | min(2,8)=2          | min(10,8)=8             | \~100 (with TSS batching)     |
| **Poll Interval**            | 6s                  | 6s                      | 6s                            |
| **Recipients per Poll**      | 2                   | 8                       | \~1000 (100 ops × 10 batches) |
| **Recipients per Second**    | 0.33                | 1.33                    | **\~167**                     |
| **1000 Recipients Complete** | 50 minutes          | 12.5 minutes            | **6 seconds**                 |

_\*Stock SDP optimized = 10 channels (maximum practical before Horizon rate limiting)._

***

### Scaling Considerations <a href="#scaling-considerations" id="scaling-considerations"></a>

#### Channel Account Limits & Infrastructure Risks

**Theoretical Maximum**: 1000 channel accounts (Stellar SDP code).

**Practical Maximum** (based on infrastructure):

| Infrastructure                | Recommended Channels | Expected Throughput |
| ----------------------------- | -------------------- | ------------------- |
| Public Horizon (rate limited) | 10-20                | 1.67-3.33 tx/s      |
| Private Horizon (small)       | 50-100               | 8.33-16.67 tx/s     |
| Private Horizon (large)       | 200-500              | 33.33-83.33 tx/s    |
| Extreme (fully tuned)         | 1000                 | 166.67 tx/s (burst) |

**Risks at 1000 channels**:

1. Database contention (1000 locks/poll)
2. Go-routine explosion (1000 go-routines spawned every 6s)
3. Horizon HTTP 429 (rate limiting)

**MVP Recommendation**: Start with 50-100 channels, scale to 500+ post-audit.

***

#### Integration Points: Tess SDP ↔ IDM <a href="#integration-points-arc-sdp--idm" id="integration-points-arc-sdp--idm"></a>

#### Relayer → IDM

<figure><img src="../.gitbook/assets/Screenshot 2026-01-30 at 00.52.52.png" alt=""><figcaption></figcaption></figure>

#### Distributor → IDM&#x20;

<figure><img src="../.gitbook/assets/Screenshot 2026-01-30 at 00.53.36.png" alt=""><figcaption></figcaption></figure>

***

#### Data Flow: Complete Batch Withdrawal (Example: 10 Recipients) <a href="#data-flow-complete-batch-withdrawal-example-10-rec" id="data-flow-complete-batch-withdrawal-example-10-rec"></a>

<figure><img src="../.gitbook/assets/Screenshot 2026-01-30 at 00.54.38.png" alt=""><figcaption></figcaption></figure>

<details>

<summary><strong>Tess Transaction Lifecycle: End-to-End Governance</strong></summary>

#### 1. Intent Initialisation (Identity Management)

The Relayer establishes the legal and financial intent before any funds move.

* Relayer Action: Calls `IDM.create_withdrawal_intent`.
  * Data: `intent_id`, `H_encrypted` (Institution tag), `requested_amount`, and a `relayer_signature`.
* IDM State: Stores the intent in a PENDING state.
* Auditability: The Relayer writes an encrypted audit log using the `institution_public_key`, ensuring the institution can later verify the Relayer acted on its behalf.

#### 2. The Batch Execution & Settlement Flow

The Distributor closes the loop by providing immutable proof of payment back to the IDM.

* Distributor Action: For every intent in a processed batch, it calls `IDM.execute_withdrawal`.
* Cryptographic Binding: It submits the `settlement_proof` (the hash of all recipients and amounts in that specific batch).
* IDM Atomic Updates:
  * Sets `intent.status = EXECUTED`.
  * Attaches the `settlement_proof` to the record.
  * Balance Deduction: `remaining_amount` for that institution is decremented.
  * Invoice Generation: An immutable settlement receipt is created.

***

#### 3. Step-by-Step Scenario: 10 Recipient Disbursement

**Step 1: Institution Initiation**

The institution creates 10 distinct withdrawal payloads to ensure granular tracking.

* Encryption: Recipients are encrypted for the Distributor; operational metadata is encrypted for the Relayer.

**Step 2: Relayer Validation**

The Relayer decrypts the metadata via DFNS, verifies ephemeral signatures, checks available `withdrawal_power`, and registers 10 PENDING intents on the IDM.

**Step 3: TSS Ordering**

The Transaction Submission Service collects the 10 intents, sorts them by timestamp to prevent sequence conflicts, and assigns them to a single batch for Channel Account 1.

**Step 4: Distributor Execution**

The Distributor reveals the recipients using its DFNS key, constructs a single Stellar transaction with 10 Payment operations, and submits it.

* Proof Generation: `settlement_proof = hash([Alice:50K:tx_xyz, Bob:50K:tx_xyz, ...])`.

**Step 5: Final IDM Settlement**

The Distributor updates all 10 intents on the IDM with the same `settlement_proof`. The institution's global balance is updated, and 10 invoices are archived.

**Step 6: Post-Payment Audit**

Weeks later, the institution performs an audit:

1. Check IDM: Verifies all 10 intents are `EXECUTED`.
2. Verify Proof: Decrypts local Distributor logs and re-hashes the recipient list.
3. Match: If `hash(actual) == settlement_proof`, execution is verified.
4. Confirm Ledger: Cross-references the transaction hash on the Stellar ledger for finality.

***

#### System Summary

| **Phase**   | **Core Security Property** | **Verification Method**      |
| ----------- | -------------------------- | ---------------------------- |
| Relayer     | Authorisation Integrity    | IDM `WithdrawalIntent`       |
| Distributor | Execution Integrity        | `settlement_proof` Hash      |
| IDM         | Financial Integrity        | Balance Tracking & Invoicing |
| Stellar     | Settlement Finality        | Immutable Ledger Entry       |



</details>

#### Why Batch Aggregation Matters <a href="#why-batch-aggregation-matters" id="why-batch-aggregation-matters"></a>

**Without batching** (Stock SDP):

* 1000 recipients = 1000 transactions = 1000 ledger entries
* Ledger bloat + high fees + slow finality

**With batching** (Tess):

* 1000 recipients = 10 transactions (100 ops each) = 10 ledger entries
* 100x less ledger impact + 100x fewer fees + same finality (6s)
