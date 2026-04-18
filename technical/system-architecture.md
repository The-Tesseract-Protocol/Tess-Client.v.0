---
description: >-
  This section describes the overall architecture of the Tesseract Confidential
  Payments Service and explains how its components work together to deliver
  confidential operations on top of public set
icon: '1'
cover: ../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
metaLinks:
  alternates:
    - /broken/spaces/HJ9mgOsZHf67ghIAEI2U/pages/chIptEYPy8Y6EOA16mMz
---

# System Architecture

> **Separation of concerns.** On-chain components handle settlement, policy enforcement and public state. Off-chain components handle confidential operations, business logic, key management, and encrypted auditability.

***

#### High‑Level Architecture

<figure><img src="../.gitbook/assets/Screenshot 2026-01-28 at 21.56.20.png" alt=""><figcaption></figcaption></figure>

***

#### Component reference

|          Component         |                              Primary responsibilities                             |        Location        | Operator          |
| :------------------------: | :-------------------------------------------------------------------------------: | :--------------------: | ----------------- |
| Institution UI (Dashboard) |     Deposit, create withdrawal requests, view encrypted logs, manage approvals    |      Client (Web)      | Institution       |
|  Privy / Freighter Wallet  |                      Sign requests, provide user key material                     | Client (Browser / HSM) | Institution       |
|    DFNS HSM Integration    |                  Key custody, secret S backup, emergency recovery                 |   External custodian   | DFNS              |
|       Relayer Service      | Verify signatures, create on‑chain Withdrawal-Intents, write encrypted audit logs |   Server (Off‑chain)   | Platform operator |
|     Distributor Service    |    Execute SDP payments, produce settlement proofs, submit on‑chain settlements   |   Server (Off‑chain)   | Platform operator |
|   Pool Contract (Soroban)  |        Aggregate balance tracking, pool accounting, settlement enforcement        |        On‑chain        | Protocol          |
|   IDM Contract (Soroban)   |  Withdrawal power management, intent lifecycle, multi‑sig coordination, recovery  |        On‑chain        | Protocol          |
|       Stellar Ledger       |               Final settlement; public records for SDP transactions               |   On‑chain (Stellar)   | Protocol          |

***

### System Components & Responsibilities

#### [Institution UI / Wallets](wallet-integration.md)

* Create withdrawal requests and sign intent payloads.
* Read and decrypt audit records for compliance and reconciliation.
* Never reveal recipient or invoice metadata to on-chain contracts.
* Maintain custody of institutional approval keys and policy configuration.

#### [DFNS HSM](dfns-hsm-integration.md)

* Secure storage of master and recovery secrets.
* Threshold signing coordination and emergency recovery key custody.
* Provides cryptographic isolation for institutional private material.
* Acts only as a signing oracle; has no visibility into business metadata.

#### [Relayer](relayer-service.md)

* Verifies intent authenticity and institutional authorisation.
* Materialises WithdrawalIntent objects on-chain.
* Maintains encrypted off-chain logs (requests, approvals, execution traces).
* Forwards encrypted recipient and payment instructions to the Distributor.

#### [Distributor](distributor-service.md)

* Consumes encrypted recipient batches from the Relayer.
* Constructs and executes Stellar SDP batch payments.
* Generates cryptographic settlement proofs.
* Submits settlement evidence and finalisation transactions on-chain.

#### [Pool](pool-contract.md) & [IDM](idm-contract.md) Contracts

* Enforce aggregate balance integrity and withdrawal power.
* Maintain intent lifecycle and approval policies.
* Provide on-chain verification hooks for distributor settlement.
* Expose only minimal observables; all business-sensitive metadata remains off-chain.

***

### On-Chain Contracts

#### Pool Contract

* Tracks aggregate pool balances.
* Enforces net-settlement constraints and double-spend prevention.
* Validates distributor settlement proofs.
* Emits minimal events required for reconciliation and safety monitoring.

#### IDM Contract (Intent, Delegation, Management)

* Stores withdrawal power as secret-derived commitments (hashes).
* Maintains WithdrawalIntent state machine:\
  `Created → Approved → Settled → Recovered`.
* Enforces multi-signature approval thresholds.
* Provides fast emergency recovery primitives.
* Exposes verification hooks for distributor settlement finality.

***

### Operational Data & Privacy Model

#### Encrypted Business Metadata

* Recipient lists, invoices, and execution logs are encrypted off-chain.
* Decrypt-able only by authorised institutional operators or custodial HSMs.
* Never written in plaintext to the public ledger.

#### Secret-Derived On-Chain State

* Withdrawal power represented as hash commitments.
* No secret reconstruction possible from on-chain data.
* Intent–institution linkage is computationally hidden without cooperation.

#### Observable Ledger Artifacts

* Pool deposits, balances, and settlement transactions are public.
* SDP recipients are unlinkable to originating institutions by default.
* No deterministic mapping between deposits and outbound payments.

#### Auditing

* Relayer and Distributor persist encrypted audit trails.
* Institutions can perform forensic and regulatory review by decrypting logs.
* On-chain data provides verifiable settlement anchors without exposing context.

***

### End-to-End Flow

1. Institution deposits XLM into the Pool via Dashboard / Wallet.
2. Institution creates and signs a Withdrawal Request.
3. Relayer verifies signatures and records a WithdrawalIntent on-chain.
4. Encrypted recipient batch is forwarded to the Distributor.
5. Distributor executes SDP payments and generates settlement proofs.
6. Distributor submits settlement evidence and finalises on-chain.
7. Recipients receive public Stellar payments.
8. Encrypted execution and audit logs are stored for compliance.

***

### Key Privacy Properties

#### Separation of Value and Metadata

* Value settlement is public and verifiable.
* Business context remains encrypted and off-chain.

#### Commitment-Based Control

* Withdrawal authority enforced via hash commitments.
* Secrets never touch the ledger.

#### Encrypted Auditability

* Full compliance and forensic capability without public disclosure.

#### Minimal On-Chain Surface

* Contracts expose only state required for safety, policy enforcement, and settlement verification.



***
