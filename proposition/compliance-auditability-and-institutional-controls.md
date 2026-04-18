---
description: >-
  This section explains how the system satisfies institutional compliance
  requirements without sacrificing confidentiality, and why it is fundamentally
  different from privacy pools, mixers, or anonymity
icon: '4'
cover: ../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
metaLinks:
  alternates:
    - /broken/spaces/HJ9mgOsZHf67ghIAEI2U/pages/QLhCuqrNmUlITk4eBKKK
---

# Compliance, Auditability & Institutional Controls

**Core principle**\
Public settlement does not require public operations.\
Auditability does not require public disclosure.

Tesseract is designed to meet **institutional compliance requirements** while preserving operational confidentiality. It enables regulators, auditors, and internal stakeholders to verify correctness, authorisation, and conservation of funds **without exposing sensitive business activity on a public ledger**.

***

### 1. Why Tess Is Not a Mixer

Tesseract is **not** a privacy pool, mixer, or anonymity protocol. It is institutional settlement infrastructure.

| Dimension          | Privacy Mixers                | Tesseract                      |
| ------------------ | ----------------------------- | ------------------------------ |
| Primary goal       | Anonymity                     | Institutional confidentiality  |
| Secrets            | Bearer secrets (irreversible) | Delegated, revocable authority |
| Link breaking      | Nullifiers / UTXOs            | Preserved internal audit trail |
| Auditability       | Destroyed by design           | Preserved privately            |
| Delegation         | Not supported                 | First-class                    |
| Authorization      | Single actor                  | Multi-party approval           |
| Compliance posture | Adversarial                   | Explicitly aligned             |

**Conclusion**\
Mixers remove attribution entirely. Institutions cannot operate systems that cannot explain **who authorised what**. Tess preserves attribution privately while removing unnecessary public visibility.

***

### 2. What Is Public vs What Is Private

#### Always Public

* Settlement transactions on Stellar
* Amounts transferred
* Ledger timestamps and finality

#### Always Private

* Business intent and rationale
* Recipient groupings and structures
* Spending patterns and cadence
* Internal authorisation workflows

**Result**\
Money movement is transparent.\
Operational logic remains confidential.

***

### 3. MVP Compliance Model

Tesseract’s MVP compliance model is built around **encrypted, institution-controlled auditability**.

#### Encrypted Audit Logs

For every critical action, Tess generates audit records that are:

* Encrypted with the institution’s public key
* Append-only and tamper-evident
* Cryptographically bound to on-chain settlement events
* Readable only by authorised parties

Logs are generated for:

* Creation of withdrawal authority
* Validation of withdrawal requests
* Execution and settlement of payments
* Updates to remaining withdrawal limits

#### What Institutions Can Prove

Using their own keys, institutions can demonstrate:

* Who authorised each action
* That spending limits were respected
* That off-chain intent matched on-chain settlement
* Conservation of funds (no over-withdrawal)
* A complete, replayable payment history

**Without exposing** strategy, recipient structure, or internal governance.

This mirrors existing institutional audit practice, with stronger cryptographic guarantees and public settlement finality.

***

### 4. Selective Disclosure Model

Different stakeholders require different visibility. Tess supports **permissioned, scoped disclosure**.

| Stakeholder       | Visibility                             |
| ----------------- | -------------------------------------- |
| Public            | Settlement transactions only           |
| Institution       | Full encrypted audit logs              |
| Internal auditors | Full logs + authorisation context      |
| External auditors | Scoped, read-only access               |
| Regulators        | Case-specific, permissioned disclosure |
| Distributors      | Execution invoices only                |

**Disclosure is always**:

* Permissioned (key-based)
* Revocable (keys can be rotated)
* Auditable (disclosure events logged)
* Scoped (only relevant transactions)
* Time-limited

Privacy is the default. Disclosure is explicit.

***

### 5. Delegation Without Loss of Accountability

Delegation is unavoidable in institutional finance. Tess ensures delegation does **not** erase traceability.

#### Attribution Is Preserved

For every withdrawal:

* Authorisation is signed by an approved party
* The request is timestamped and recorded
* Limits are enforced at execution
* Settlement is finalised publicly on Stellar

Institutions can always answer:

* **Who authorised this?**
* **Under what mandate and limits?**
* **For what amount?**
* **When did it settle?**
* **What was the outcome?**

Without revealing business strategy or internal decision structure.

***

### 6. Failure Handling & Dispute Safety

#### Service Failure

* Relayer failure does not affect funds or withdrawal authority
* Distributor failure results in no settlement, funds remain safe
* Requests can be retried without loss or ambiguity

#### Partial Execution

If execution completes only partially:

* Only executed amounts are settled
* Withdrawal authority is reduced proportionally
* Remaining authority is preserved for retry
* Audit logs reflect actual execution, not intent

#### Dispute Resolution

Encrypted logs provide:

* Non-repudiation (signature-based authorisation)
* Deterministic event ordering
* Full historical reconstruction

This is essential for legal disputes, insurance claims, and institutional risk management.

***

### 7. Compliance Summary

| Capability                  | Tess Provides                       |
| --------------------------- | ----------------------------------- |
| Public settlement           | Stellar ledger finality             |
| Operational confidentiality | Encrypted off-chain operations      |
| Auditability                | Institution-controlled logs         |
| Conservation guarantees     | Enforced withdrawal limits          |
| Delegated authorisation     | Multi-party, traceable approvals    |
| Selective disclosure        | Permissioned, scoped access         |
| Failure safety              | Non-custodial, replayable execution |

***

### 8. Why This Model Works

Institutions do not need anonymous money.\
They need **confidential operations with provable correctness**.

Tesseract provides:

* Transparency where required (settlement)
* Privacy where necessary (operations)
* Deterministic accounting
* Delegated, auditable control

It avoids:

* Anonymity systems that destroy accountability
* Bearer secrets with irreversible loss risk
* Public exposure of operational intelligence
* Opaque settlement models

***

#### Takeaway

Tesseract aligns with how institutions already operate -\
but upgrades that model with **public settlement, cryptographic auditability, and selective disclosure**.

<p align="center">Compliance is not weakened by privacy.<br>It is strengthened by correctness.</p>
