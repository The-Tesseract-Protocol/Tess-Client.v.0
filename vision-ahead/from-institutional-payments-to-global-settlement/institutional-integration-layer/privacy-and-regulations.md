---
icon: trillium
cover: ../../../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
---

# Privacy & Regulations

## On-Client Decryption Dashboard

#### Solving the Institutional Privacy Paradox

Institutions require **full visibility** into settlements for audit, compliance, and operations.\
At the same time, they must ensure **sensitive payment data never exists in plaintext on third-party servers**.

This creates a fundamental constraint:

* Visibility is mandatory
* Server-side decryption is unacceptable

Tesseract resolves this by **moving decryption to the institution’s client**, not the platform.

***

### Core Principle

> **Encrypted at rest. Decrypted only at the edge. Never stored in plaintext.**

All sensitive settlement data remains encrypted on Tesseract infrastructure.\
Decryption occurs **only inside the institution’s browser**, using keys the platform never accesses.

***

### High-Level Architecture

<figure><img src="../../../.gitbook/assets/Screenshot 2026-01-29 at 17.46.44.png" alt=""><figcaption></figcaption></figure>

***

### Data Ownership Model

#### Server (Never Sees Plaintext)

Stores only:

* Withdrawal IDs and timestamps
* Encrypted recipient hashes and amounts
* Zero-knowledge proofs
* Stellar transaction references

Cannot:

* Decrypt recipients
* View amounts per recipient
* Detect when decryption occurs

#### Institution Client (Full Control)

* Holds private keys (Privy / hardware wallet)
* Performs decryption locally
* Renders human-readable settlement details
* Controls export and sharing

***

### Decryption Flow (Step-by-Step)

<figure><img src="../../../.gitbook/assets/Screenshot 2026-01-29 at 17.48.26.png" alt="" width="563"><figcaption></figcaption></figure>

***

### Export & Sharing Controls

Exports are **explicit, local, and user-initiated**:

* CSV download (local machine)
* PDF audit report
* Secure sharing with external auditors (key-based)

The platform:

* Does not track exports
* Does not retain decrypted artifacts
* Cannot infer what was viewed or shared

***

### Privacy Guarantees

#### The Platform Never Knows

* Recipient identities
* Wallet addresses
* Invoice references
* Whether decryption occurred

#### The Institution Controls

* When decryption happens
* Who can decrypt (key access)
* What data is shared externally
* Audit report generation

This is **privacy by construction**, not policy.

***

## Compliance & Audit Reporting

#### Immutable Audit Chain

Every report links three layers:

1. **ERP Approval**\
   (e.g. SAP approval ID, approver, timestamp)
2. **Withdrawal Intent**\
   (on-chain reference, encrypted metadata, ZK proof)
3. **Stellar Settlement**\
   (public transaction hash, ledger timestamp)

<figure><img src="../../../.gitbook/assets/Screenshot 2026-01-30 at 10.13.23.png" alt="" width="563"><figcaption></figcaption></figure>

***

### Auditor Verification Model

Auditors can independently verify:

* Approval → Withdrawal linkage
* Settlement proof integrity
* Stellar transaction finality

No reliance on:

* Tesseract operator attestations
* Internal logs
* Manual reconciliation

Trust anchor = **public ledger + cryptography**.

***

### Regulatory Reporting

Institutions can generate regulator-specific reports by:

* Decrypting data locally
* Aggregating required fields
* Exporting only mandated disclosures

Regulators receive:

* Aggregated volumes
* Jurisdictional summaries
* Transaction proofs (if requested)

They do **not** receive:

* Full recipient lists by default
* Internal business metadata

***

### Why This Matters

This model achieves something traditional systems cannot:

* Full institutional visibility
* Zero server-side plaintext exposure
* Independent auditability
* Regulatory compatibility

It allows institutions to say:

> “We can see everything.\
> You can verify everything.\
> No intermediary ever sees what they shouldn’t.”

That is the foundation for **confidential, verifiable, institutional-grade settlement**.
