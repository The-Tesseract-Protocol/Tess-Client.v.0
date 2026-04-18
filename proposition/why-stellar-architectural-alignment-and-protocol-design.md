---
icon: '5'
cover: ../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
metaLinks:
  alternates:
    - /broken/spaces/HJ9mgOsZHf67ghIAEI2U/pages/GpKiOS1vOP1UxPYhkcXU
---

# Why Stellar: Architectural Alignment & Protocol Design

Tesseract is **designed for Stellar by construction**, not ported onto it.\
The architecture accepts Stellar’s constraints and turns them into strengths.

**Core thesis**\
&#xNAN;_&#x50;ublic settlement + private operations + bounded on-chain state_\
_= institutional-grade infrastructure that scales sustainably._

***

### 1. Why Stellar for Institutional Settlement

Stellar is uniquely suited for **regulated, real-world payments**.

It provides:

* Deterministic finality (\~6 seconds)
* Predictable, low fees
* Mature fiat on/off-ramps (anchors)
* A compliance-friendly ecosystem
* Proven production usage by institutions and NGOs

#### The Institutional Problem on Stellar

Stellar’s public ledger exposes:

* Payroll structures
* Vendor relationships
* Grant strategies
* Treasury movements

This transparency is a **feature** for settlement, but a **blocker** for institutions running sensitive operations.

#### The Tesseract Solution

Tesseract separates **operations from settlement**:

<figure><img src="../.gitbook/assets/Screenshot 2026-01-30 at 10.50.37.png" alt="" width="563"><figcaption></figcaption></figure>

This is **not a privacy chain**.\
It is an **institutional confidentiality layer** over Stellar settlement.

***

### 2. Designing Within Soroban’s Constraints

Any viable Stellar architecture must respect Soroban’s structural limits:

#### Non-Negotiable Constraints

* Bounded compute per transaction
* Explicit read/write footprints
* No iteration over on-chain state
* Persistent storage incurs ongoing rent
* Archived state must be restored explicitly

These constraints do **not** disappear with Protocol 25 (X-Ray).

#### Design Implication

State must be:

* **Bounded** (fixed maximum size)
* **Minimal** (small data structures)
* **Episodic** (temporary, TTL-based)

Architectures that grow state with usage are **structurally incompatible** with Stellar.

***

### 3. Why UTXO / Nullifier Privacy Pools Fail on Stellar

UTXO-style privacy systems rely on:

* Ever-growing nullifier sets
* Merkle tree updates per withdrawal
* Iteration over large on-chain state
* Heavy per-transaction proof verification

This model works on Ethereum.\
It fails on Stellar for structural reasons.

| Issue                  | Ethereum   | Stellar             |
| ---------------------- | ---------- | ------------------- |
| Unbounded state growth | Tolerable  | ❌ Fatal             |
| Merkle tree updates    | Feasible   | ❌ Exceeds footprint |
| Nullifier sets         | Acceptable | ❌ No iteration      |
| Rent economics         | One-time   | ❌ Permanent         |
| Restoration cost       | Low risk   | ❌ DoS vector        |

**Even with X-Ray**, these problems remain.

**Conclusion**\
Nullifier-based privacy pools are fundamentally incompatible with Stellar.

***

### 4. Why the Tesseract Architecture Fits Soroban

Tesseract moulds everything Soroban has to offer, within the boundaries that needs to be restricted .

#### Explicitly Avoided

* UTXOs and nullifiers
* Merkle trees
* Global indexes
* Recursive proofs
* Unbounded persistent state

#### Used Instead

* Fixed-size withdrawal power per institution
* TTL-based intent lifecycle
* Invoice-based settlement records
* Off-chain encryption for sensitive data
* Batched enforcement (many withdrawals, one check)
* Channel accounts for parallelism (no extra state)

#### Resulting Properties

| Property               | Outcome                        |
| ---------------------- | ------------------------------ |
| On-chain state growth  | Bounded                        |
| Rent exposure          | Stable                         |
| Compute predictability | High                           |
| Failure recovery       | Graceful                       |
| Scaling factor         | Institutions, not transactions |

***

### 5. Why Not Account Abstraction

Ethereum-style account abstraction pushes business logic on-chain.

On Stellar, this results in:

* Exposed governance structures
* Complex contracts
* Larger attack surface
* Incompatibility with existing wallets
* Persistent state growth

Tesseract does the opposite:

```
Business logic off-chain
        ↓
Minimal on-chain enforcement
        ↓
Public settlement only
```

This preserves confidentiality, simplicity, and compatibility.

***

### 6. Architectural Comparison on Stellar

| Architecture        | State Growth | Rent Risk | Complexity | Institutional Fit | Stellar Fit |
| ------------------- | ------------ | --------- | ---------- | ----------------- | ----------- |
| UTXO Pools          | Unbounded    | Toxic     | High       | Poor              | ❌           |
| Nullifier Mixers    | Unbounded    | Toxic     | Very High  | Poor              | ❌           |
| Account Abstraction | Growing      | Moderate  | Very High  | Limited           | ⚠️          |
| **Tesseract**       | Bounded      | Stable    | Moderate   | Excellent         | ✅           |

***

### 7. Why This Matters for Stellar Adoption

Without confidential operations:

* Treasury is risky
* Payroll is a data honey-pot
* Vendor networks leak intelligence
* Institutional adoption stalls

With Tesseract:

* Institutions can use Stellar **without exposing internal operations**
* Settlement remains public and auditable
* Compliance is strengthened, not weakened

**Outcome**\
Stellar becomes viable for institutional finance at scale.

***

### 8. Alignment with Stellar Community Foundation Goals

| SCF Objective             | Tesseract Contribution                |
| ------------------------- | ------------------------------------- |
| Institutional adoption    | Removes confidentiality barrier       |
| Real-world payments       | Treasury, payroll, grants, vendors    |
| Ecosystem reuse           | SDP, TSS, DFNS, Anchors ._etc_ reused |
| No protocol forks         | Zero changes required                 |
| Transparency + compliance | Public settlement + private ops       |

***

<p align="center"><strong>Why Stellar</strong><br><em>Because Stellar already solves settlement.</em><br><em>Tesseract solves everything institutions need around it.</em></p>
