---
description: >-
  This section demonstrates how institutions use the system in real-world
  scenarios.
icon: '3'
cover: ../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
metaLinks:
  alternates:
    - /broken/spaces/HJ9mgOsZHf67ghIAEI2U/pages/me6yZVyMhXtkC6A7OVPS
---

# Institutional Use Cases

Tesseract enables institutions to execute **real financial operations on Stellar,** treasury management, payroll, grants, vendor payments, and DAO operations _etc_ without exposing sensitive operational data on a public ledger.

Each use case follows the same core pattern:

**Institution-private operations + public settlement finality**

***

### Use Case Comparison

| Metric           | Tess (Today)                      | SWIFT               | Public Crypto   | Private Banks       |
| ---------------- | --------------------------------- | ------------------- | --------------- | ------------------- |
| **Cost**         | <$0.01 / tx                       | $50–300 / tx        | $0.01–10 / tx   | $25–100 / tx        |
| **Speed**        | \~6 seconds                       | 3–5 days            | Seconds–minutes | 1–3 days            |
| **Privacy**      | Institution-private operations    | Institution-private | Fully public    | Institution-private |
| **Transparency** | Public settlement proof           | Opaque              | Fully public    | Opaque              |
| **Auditability** | Encrypted, institution-controlled | Bank reports        | On-chain only   | Bank reports        |
| **Programmable** | Yes (institution-controlled)      | No                  | Limited         | Limited             |

**Key takeaway**: Tess combines the settlement guarantees of public blockchains with the confidentiality and controls institutions require.

***

### Core Institutional Use Cases

#### 1. Institutional Treasury Management

**Scenario**\
An institution holds treasury funds on Stellar with strict internal controls and withdrawal limits.

**How it works**

* Funds are deposited to a shared settlement pool
* Withdrawal rights are created and internally governed
* Treasury actions are authorised privately
* Settlements execute publicly on Stellar

**Outcome**

* Non-custodial treasury control
* No public exposure of strategy or timing
* Full internal auditability

***

#### 2. Payroll Distribution

**Scenario**\
Recurring employee or contractor payments with compensation confidentiality.

**How it works**&#x20;

* Payroll budget is allocated internally
* Recipient lists and amounts remain private
* Payments are executed in batches
* Settlement finality is public and verifiable

**Outcome**

* No public payroll graph
* No employer–employee linkage on-chain
* Deterministic, auditable payroll execution

***

#### 3. Grant Disbursement Programs

**Scenario**\
Foundations distribute grants in tranches tied to milestones.

**How it works (conceptual)**

* Grant budget is allocated once
* Each tranche is authorised independently
* Execution is auditable without revealing strategy
* Final settlement is publicly provable

**Outcome**

* Transparent execution without governance leakage
* Strong accountability to boards and donors
* No exposure of long-term funding plans

***

#### 4. Vendor & Service Provider Payments

**Scenario**\
Institutions pay vendors for infrastructure, legal, or operational services.

**How it works**

* Budgets are managed internally
* Individual invoices are authorized privately
* Payments settle publicly without revealing patterns
* Audit trails remain institution-controlled

**Outcome**

* Vendor relationships stay confidential
* Pricing and cadence are protected
* Competitive intelligence is not leaked

***

#### 5. DAO & Multi-Signer Operations

**Scenario**\
DAOs require multi-party approval and execution without exposing governance details.

**How it works**

* Governance decisions occur off-chain or privately
* Threshold approvals are enforced
* Execution settles publicly
* Internal governance remains opaque to observers

**Outcome**

* Flexible governance models
* Deterministic execution
* Privacy until settlement

***

### What Is Public vs What Is Private

#### Always Public

* Settlement transactions on Stellar
* Amounts transferred
* Ledger timestamps and finality

#### Always Private

* Business intent and strategy
* Recipient groupings and structures
* Authorisation workflows
* Internal governance and approvals

This separation is deliberate: **settlement is transparent; operations are confidential**.

***

### Operational Guarantees

| Guarantee             | Enforced By            |
| --------------------- | ---------------------- |
| No over-withdrawal    | Withdrawal limits      |
| No double execution   | Intent lifecycle       |
| Public settlement     | Stellar ledger         |
| Private auditability  | Encrypted logs         |
| Failure recovery      | Time-bounded execution |
| Non-custodial control | Institution-held keys  |

***

### Summary

Tesseract allows institutions to use Stellar for **real financial operations** without accepting the operational risks of full public transparency.

It does not hide money.\
It hides **how institutions operate**, while keeping **settlement public, auditable, and final**.

***
