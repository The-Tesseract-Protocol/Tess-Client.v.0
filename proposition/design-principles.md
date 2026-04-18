---
description: >-
  It is essential to define the principles that shape this system. These
  principles are not optional preferences they are constraints derived from real
  institutions
icon: '2'
cover: ../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
metaLinks:
  alternates:
    - /broken/spaces/HJ9mgOsZHf67ghIAEI2U/pages/hyUfvGkca5XCz7LQMpzb
---

# Design Principles

{% stepper %}
{% step %}
### Privacy Is Not Anonymity

The first and most important distinction:

> **This system does not aim to make institutions anonymous.**\
> **It aims to make their operations confidential.**

Institutions do not want to hide _who they are_.\
They want to hide _what they are doing_.

This means:

* Identities may be known internally.
* Authorisation must be attributable.
* Audits must be possible.
* Disclosure must be selective, not absolute.

Any system that destroys attribution entirely is unusable for institutional finance.

**Design consequence:**\
We optimise for **confidentiality with accountability**, not complete deniability.
{% endstep %}

{% step %}
### Public Settlement, Private Operations

Stellar’s public ledger is a feature, not a flaw.

We explicitly preserve:

* Public settlement
* Deterministic finality
* Verifiable balances
* Non-custodial fund control

What must _not_ be public is:

* business intent
* recipient lists
* payroll structures
* grant allocation logic
* approval workflows
* internal governance

**Design consequence:**\
The ledger records _settlement_, while _operations live elsewhere_.
{% endstep %}

{% step %}
### Delegation Is a First-Class Requirement

Institutional payments are never executed by a single key holder.

Real-world flows involve:

* spending limits
* approval hierarchies
* batch execution
* scheduled payments
* separation of duties

Privacy systems that assume a single actor with full authority are structurally incompatible with institutional use.

**Design consequence:**\
Delegation, limits, and role separation are core primitives not add-ons.
{% endstep %}

{% step %}
### Auditability Is Mandatory, Not Optional

Institutions must be able to answer:

* Who authorised this payment?
* Under what mandate?
* At what time?
* For what purpose?
* Was it within approved limits?

This must be provable **after the fact**, sometimes years later.

Any system that treats auditability as an external concern is non-viable.

**Design consequence:**\
The system must generate **tamper-evident, institution-readable records** for every action.
{% endstep %}

{% step %}
### Selective Disclosure Beats Absolute Secrecy

Privacy requirements differ by audience:

* The public should see almost nothing.
* Internal teams should see everything.
* Auditors should see what they are authorised to see.
* Regulators should see what is legally required.

This cannot be achieved with “all-or-nothing” privacy.

**Design consequence:**\
Privacy controls are **key-based and permissioned**, not global.
{% endstep %}

{% step %}
### No Bearer Secrets, No Irrecoverable State

Institutions cannot accept systems where:

* losing a secret means losing funds
* expiry windows permanently lock value
* recovery is impossible
* operational mistakes are catastrophic

These risks are acceptable for individuals.\
They are unacceptable for institutions.

**Design consequence:**\
Authority is recoverable, revocable, and bounded.\
No single secret controls irreversible outcomes.
{% endstep %}

{% step %}
### Minimal On-Chain Complexity

Stellar’s execution environment has real constraints:

* instruction limits
* storage rent
* footprint size
* long-term maintainability

This system explains _why_ it avoids:

* unbounded state growth
* heavy cryptographic circuits
* complex on-chain privacy logic

**Design consequence:**\
The chain enforces **balances and authorisation**, not business logic.
{% endstep %}

{% step %}
### Trust Is Explicit, Not Hidden

Purely trustless systems are powerful but not always appropriate.

This design assumes:

* identifiable operators
* auditable services
* economic incentives
* contractual accountability

What matters is that trust assumptions are:

* explicit
* limited in scope
* technically enforceable
* auditable

**Design consequence:**\
We design for **bounded trust**, not blind trust.
{% endstep %}

{% step %}
### Stellar-Native by Design

This system is designed _for Stellar_, not adapted to it.

That means:

* alignment with Stellar’s institutional user base
* compatibility with Soroban’s execution model
* integration with Stellar assets and rails
* predictable costs and performance

**Design consequence:**\
Every architectural decision is evaluated against Stellar’s ecosystem and adoption goals.
{% endstep %}

{% step %}
### Design Summary

The system is guided by the following non-negotiable principles:

* Confidential, not anonymous
* Delegated, not individual
* Auditable, not opaque
* Public settlement, private operations
* Selective disclosure
* Recoverable authority
* Minimal on-chain state
* Explicit trust assumptions
* Stellar-first architecture

These principles define the solution space.
{% endstep %}
{% endstepper %}
