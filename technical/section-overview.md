---
description: >-
  Before a great conquest one needs direction. This pages will describe the
  complete layout of the  Technical section.
icon: layer-plus
cover: ../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
---

# Section Overview

This section defines the complete technical specification for Tesseract. It describes all on-chain contracts, off-chain services, integrations, and workflows required to deliver institutional-grade confidential cross-border, bulk payments on Stellar.

The system is designed around **public** settlement and private operations, on-chain components enforce balances and limits, while off-chain components implement business logic, privacy, and coordination

***

### Scope of this section <a href="#scope-of-this-section" id="scope-of-this-section"></a>

This section covers:

* [System-wide architecture](system-architecture.md) and data flows.&#x20;
* On-chain Soroban contracts: [Pool](pool-contract.md) and [IDM](idm-contract.md).
* Off-chain services: [SDP](sdp-integration.md) unit, [Relayer](relayer-service.md), [Distributor](distributor-service.md), [DFNS](dfns-hsm-integration.md) integration.
* [Wallet](wallet-integration.md) and UX integration for institutional flows.
* [Multi-sig and recovery mechanics.](multi-sig-and-recovery.md)
* [Anchor](anchor-integration-and-bridge.xyz.md), fiat integration and Stellar integration details .

Each page can be read independently, but they compose into a single architecture: deposits create withdrawal power, withdrawal intents drive batched execution, and invoices plus settlement proofs provide auditability.

***

### On-chain vs off-chain responsibilities <a href="#on-chain-vs-off-chain-responsibilities" id="on-chain-vs-off-chain-responsibilities"></a>

At a high level:

* On-chain (Soroban, Stellar):
  * Enforces conservation of value in the Pool Contract.
  * Tracks withdrawal power, intents, multi-sig state, and recovery status in the IDM Contract.
  * Records public settlement of deposits and recipient payments on the Stellar ledger.
* Off-chain (services and infrastructure):
  * Validates withdrawal requests and maintains encrypted audit logs in the Relayer.
  * Executes batch disbursements, generates settlement proofs, and logs executions in the Distributor.
  * Manages institutional secrets and platform keys via DFNS HSM where used.
  * Handles wallet connectivity, UX flows, and integration with Anchor/fiat rails when enabled.

This separation ensures that all value movement and limits are enforceable and transparent on-chain, while sensitive business logic and identities remain encrypted and institution-controlled off-chain.

***
