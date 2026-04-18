---
icon: medal
cover: ../../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
metaLinks: {}
---

# Why do we need Tess?

## Institutions on a Glass Ledger

Public blockchains were designed to make money _**transparent**_.\
Institutions are designed to make money _**accountable** but **confidential**_.

This mismatch is the core problem.

Stellar offers fast settlement, predictable fees ( one of the lowest in the industry ), and a growing smart-contract ecosystem. Yet for institutions, foundations, DAOs, payroll operators, fintechs, custodians - **using Stellar directly for real financial operations presents some hurdles**, not because of performance or reliability, but because **every operational detail becomes public by default**.

Let's explain why that is frowned on in practice, and why existing “privacy” solutions do not solve the real institutional problem.\
\
&#xNAN;_&#x45;ffective confidentiality is not about obscuring responsibility it is about shielding legitimate activity from unwanted eyes so institutions can function efficiently, competitively, and within the rules._

***

### 1.1 Public Ledgers Are Operationally Hostile to Institutions

On Stellar, every transaction permanently reveals:

* who paid whom
* how much was paid
* when it was paid
* how balances evolve over time

This transparency is valuable for open systems.\
For institutions, it is **operationally dangerous**.

#### What External Observers Can Infer

Even without privileged access, a third party can reconstruct:

* **payroll structures** (team size, compensation bands, payment cadence)
* **vendor relationships** (recurring suppliers, service providers)
* **treasury behaviour** (runway, burn rate, reallocation decisions)
* **grant strategies** (who receives funding, how often, in what size), <sub>etc</sub>

None of this requires breaking cryptography.\
It emerges naturally from transaction graphs.

For institutions, this is not theoretical risk. It is **competitive exposure**, **reputational risk**, and in some jurisdictions, **a compliance liability**.

***

### 1.2 The Institutional Privacy Paradox

Institutions operate under a paradox:

* They **must** be auditable.
* They **cannot** be fully transparent.

Regulators, auditors, boards, and internal stakeholders need _complete visibility_.\
The general public does not.

Today, institutions are forced into one of two bad choices:

1. **Use public chains directly** and leak sensitive financial information.
2. **Move operations off-chain**, sacrificing programmability, composability, and on-chain guarantees.

Neither option supports serious on-chain adoption.

What institutions actually need is not anonymity, but **confidentiality with control**.

***

### 1.3 Why Existing Privacy Approaches Don’t Fit

Several classes of solutions attempt to “add privacy” to public blockchains. None align with institutional reality.

<details>

<summary><strong>Privacy Pools &#x26; Mixers</strong></summary>

Mixer-style systems focus on cryptographic unlinkability through bearer secrets and one-time spend semantics.

They work well for individuals seeking anonymity.

They fail institutionally because:

* there is no native delegation or approval model
* bearer secrets introduce irreversible loss risk
* auditability is intentionally destroyed
* selective disclosure is impossible
* integration with payroll, grants, or treasury workflows is impractical

Institutions cannot operate core financial flows on systems that cannot explain _who authorized what_.

</details>

<details>

<summary><strong>Multi-sig &#x26; Account Abstractions</strong></summary>

Multi-signature accounts improve control and governance.

They do nothing for privacy.

* all counterparties remain public
* internal approval structure is exposed
* transaction graphs remain trivially analysable

Multi-sig solves _authorisation_, not _confidentiality_.

</details>

<details>

<summary><strong>Payment-Rail Privacy Layers ( UTXO's )</strong></summary>

UTXO-based private payment rails improve transaction-level privacy.

However, they are primarily designed for:

* peer-to-peer payments
* individual wallets
* payment anonymity

They do not natively support:

* structured delegation
* internal audit trails
* institutional reconciliation
* compliance-driven disclosure

They solve _how payments move_, not _how institutions operate_.

</details>

### 1.4 The Real Gap: Confidential Operations, Public Settlement

Institutions do not want to disappear.

They want their **operations** to disappear from public view.

What they require is a missing middle layer:

* Public settlement for finality and trust
* Confidential operational data for protection
* Delegation and role-based controls
* Deterministic auditability
* Selective, permissioned disclosure

In other words:

> **A system where money settles on a public ledger,**\
> **but the business logic, intent, and internal flows remain confidential.**

This is not a privacy pool.\
It is a **confidential execution layer for institutional payments**.

***

### 1.5 Formal Problem Statement

> **How can institutions use Stellar for real-world financial operations such as payroll, grants, vendor payments, treasury management&#x20;**_**etc**_**&#x20;without exposing sensitive financial relationships and internal workflows on a public ledger, while preserving auditability, delegation, and compliance.**

