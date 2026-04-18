---
description: >-
  "It's not where you take things from - it's where you take them to." –
  Jean-Luc Godard
icon: medal
cover: ../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
---

# Stellar Integration Points

Tess is not a system deployed _on top of Stellar_.\
It is a product **composed from Stellar-native primitives**, intentionally aligned with how the ecosystem already works.

The goal is not novelty.\
The goal is **institutional adoption without breaking transparency, compliance, or ecosystem norms**.

***

### Core Positioning: Extend, Don’t Replace

Tess deliberately avoids introducing new infrastructure where Stellar already provides a trusted primitive.

#### What Tess Does **Not** Introduce

* No custom rollup
* No alternative settlement layer
* No forked protocol logic
* No proprietary wallet or custody stack
* No opaque off-chain settlement rails

#### What Tess **Builds With**

* Soroban smart contracts for enforceable limits
* Extending Stellar Disbursement Platform for execution
* Extending Channel accounts for throughput
* Existing wallet infrastructure for authorisation
* DFNS for institution-grade key security
* Anchors and Bridge for regulated asset ingress
* [SoroSwap](../vision-ahead/from-institutional-payments-to-global-settlement/self-healing-pools-via-soroswap.md) ( \*_planned post MVP integration for liquidity and pool management )_

**Outcome**: Tess behaves like a natural extension of Stellar, not a parallel system.

***

### The Integration Surface

This is the _integration footprint_, not the implementation.

#### Soroban

Used as an **enforcement layer**, not a business logic engine.\
It anchors limits, intent state, and recovery guarantees on-chain.

***

#### Stellar Disbursement Platform (SDP)

Used as the **execution substrate** for payments.\
Tess does not replace SDP, it coordinates around it.

<details>

<summary><strong>Details</strong></summary>

**Role**\
Execution engine for recipient payments.

**Usage**

* Executes recipient payments on Stellar
* Handles transaction construction and submission
* Provides production-proven payout logic

**Tesseract extensions**

* Batch up to **100 operations per transaction**
* Bind execution to on-chain `WithdrawalIntent` and `Invoice`
* Encrypt coordination data (recipients, metadata)
* Generate settlement proofs for non-repudiation

**Why it matters**

* Reuses infrastructure already trusted by institutions
* Achieves institutional throughput without re-engineering payouts

</details>

→ [_Execution binding and batching are detailed later._](../technical/sdp-integration.md)

***

#### Channel Accounts And TSS ( _transaction submission service_ )

Used to **scale throughput without growing on-chain state**.\
This follows Stellar best practices for high-volume payment systems, integrated with the extension of SDP.

<details>

<summary><strong>Details</strong></summary>

_Channel Accounts_

**Role**\
Horizontal execution scaling.

**How they work**

* One channel = one batch transaction
* Multiple channels execute in parallel
* Each batch contains up to 100 operations

**Benefits**

* Parallelism without additional on-chain state
* No ledger bloat (fewer transactions, more operations)
* Failure isolation between batches

**Why it matters**

* Enables hundreds–thousands of recipients per cycle
* Aligns with Stellar best practices for high-volume payments<br>

_TSS_

**Role**\
Deterministic ordering and batching coordinator.

**Provides**

* FIFO / priority ordering
* Sequencing guarantees across batches
* Conflict avoidance under concurrency

**Used to**

* Order `WithdrawalIntent`s before execution
* Assign batches to channel accounts
* Prevent race conditions and double execution
* Reduce timing-based information leakage

**Why it matters**

* Deterministic execution is required for auditability
* Achieves ordering without on-chain complexity

</details>

***

#### Wallet Ecosystem (Privy, Freighter, Wallet Kit)

Used as the **authorisation interface**.\
Institutions keep custody. Tess never introduces a new wallet abstraction.

<details>

<summary><strong>Details</strong></summary>

_(Privy, Freighter, Stellar Wallet Kit)_

**Role**\
Institution authorisation interface.

**Supports**

* Privy (embedded, flagship UX)
* Freighter (power users)
* Wallet Kit (fallback, hardware, mobile)

**Used for**

* Signing withdrawal requests
* Proving authorisation
* Non-custodial institutional control

**Why it matters**

* No custom wallet required
* Institutions retain full key custody
* Native compatibility with Stellar ecosystem

</details>

→ [_Signature flows and UX integration are technical topics._](../technical/wallet-integration.md)

***

#### DFNS (Key Management & HSM)

Used wherever **institutional-grade security is mandatory**:

* Platform operational keys
* Optional institutional secret backup
* Auditable key lifecycle management

DFNS is not a convenience dependency, it is a **compliance and risk requirement**.

→ [_Key isolation and trust boundaries are covered technically._](../technical/dfns-hsm-integration.md)

***

#### Anchors & Bridge

Used strictly for **asset ingress and egress**, not settlement logic.

* Anchors: regulated fiat on/off-ramps
* Bridge: stablecoin and treasury flows

Tess remains **asset-agnostic** and **exchange-independent**.

<details>

<summary><strong>Details</strong></summary>

**Role**\
Asset ingress, not settlement logic.

**Used for**

* Fiat → XLM on-ramps (SEP-24 Anchors)
* Stablecoin custody and conversion (Bridge)
* Multi-currency treasury flows

**Why it matters**

* Keeps Tesseract asset-agnostic
* Leverages regulated ecosystem partners
* Avoids CEX dependency

</details>

→ [_Anchor's and Bridge Integration_](../technical/anchor-integration-and-bridge.xyz.md)_._

→ [_Multi-asset flows are discussed in future-facing technical sections._](../vision-ahead/from-institutional-payments-to-global-settlement/expanded-fiat-on-ramps.md)

***

### Why This Matters

Most payment systems force institutions into a trade-off:

* Transparency **or** privacy
* Compliance **or** cryptographic guarantees
* Scale **or** auditability

Tess avoids that trade-off **by composing Stellar primitives correctly**.

* Public settlement stays public
* Confidential operations stay private
* Limits are enforced by protocol
* Verification remains universal

The _how_ is non-trivial, and intentionally deferred.

***

#### Final Takeaway

Tess does not ask Stellar to change.\
It changes **how institutions can safely use Stellar**.

That is the integration story.
