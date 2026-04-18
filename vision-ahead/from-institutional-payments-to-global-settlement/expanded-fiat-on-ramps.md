---
description: Next-Generation Anchor Networks
icon: '3'
cover: ../../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
---

# Expanded Fiat On-Ramps

MVP supports XLM and some other core assets. Future version expands to multi-currency fiat on-ramps via regional anchor partnerships (USD, EUR, GBP, JPY, INR, SGD, AED, MXN, BRL).

***

### The Problem: Geographic & Currency Lock-In

#### MVP Constraint

In its initial phase:

* Institutions must already hold XLM, **or**
* Rely on limited USD/EUR Stellar anchors, **or**
* Use centralised exchanges (counterparty + FX risk)

**Result:**\
Non-USD institutions face unnecessary conversion steps, delays, and cost leakage.

***

#### Real-World Friction

**India (Remittance Operator)**

* Receives: INR
* Required path today:\
  `INR → USD → XLM → Settlement`
* 2–3 FX hops
* 5–8% total cost
* Hours of latency

**Europe (Vendor Payments)**

* Holds: EUR
* Required path today:\
  `EUR → USD stablecoin → XLM → Settlement`
* Still inefficient
* 3–5% cost

At institutional scale, this is **structurally unviable**.

***

### Why Multi-Currency Is Non-Negotiable

Institutional payment flows are inherently local:

* **Asia:** INR, SGD, PHP, IDR
* **Middle East:** AED, SAR
* **Europe:** EUR, GBP
* **LatAm:** MXN, BRL
* **Global:** USD

Institutions do not want FX exposure.\
They want to **deposit, account, and reconcile in their home currency**.

***

### The Vision: Regional Anchor Network <a href="#the-vision-regional-anchor-network" id="the-vision-regional-anchor-network"></a>

#### Architecture: Federated Anchors by Region

<figure><img src="../../.gitbook/assets/Screenshot 2026-01-29 at 18.33.46.png" alt=""><figcaption></figcaption></figure>

### Tier 1 Regional Anchors

| Region           | Anchor                                       | Currencies              | Status      | Timeline  |
| ---------------- | -------------------------------------------- | ----------------------- | ----------- | --------- |
| **Americas**     | Existing (Stellar Anchor Network)            | USD, MXN, BRL           | Live        | Month 4   |
| **Europe**       | SatoshiPay or Stellar Anchor Network partner | EUR, GBP, CHF           | Partnership | Month 5   |
| **Asia-Pacific** | Amber Group (Singapore), Binance (regional)  | INR, SGD, AED, JPY, THB | Negotiation | Month 6   |
| **LatAm**        | Stellar Anchor Network partners              | MXN, BRL, COP, ARS      | Partnership | Month 4-5 |
| **Africa**       | TBA (Remittance focus)                       | ZAR, GHS, KES, NGN      | Vision      | Month 8+  |

<details>

<summary><strong>Partnership Model: Revenue Sharing</strong></summary>

The Tess model shifts the economic paradigm from high-margin, low-volume retail transactions to low-margin, high-volume institutional flows. By reducing friction and cost, the ecosystem captures a larger share of global liquidity.

***

#### Traditional vs. Tess Partnership Model

| **Feature**       | **Traditional Anchor Model** | **Tess Partnership Model** |
| ----------------- | ---------------------------- | -------------------------- |
| Institutional Fee | 1.5% – 2.5%                  | 0.5% – 1.0%                |
| Revenue Stream    | Fragmented / Transactional   | Integrated / Volume-based  |
| Infrastructure    | Manual / Custom builds       | Plug-and-play via Tess     |
| Incentive         | Low (Low margin/high ops)    | High (Low ops/high volume) |

***

#### Fee Breakdown ($1M Deposit Example)

Using a 0.5% total fee structure for an Indian Rupee (INR) anchor:

* Total Institution Cost: $5,000 (0.50%)
* Tesseract Revenue: $2,500 (0.25%) -_Covers privacy infra & dev_
* Stellar Ecosystem: $1,000 (0.10%) - _Supports network growth_
* Anchor Margin: $1,500 (0.15%) -_Sustainable profit for fiat-to-XLM rail_

***

#### Revenue Projections: Scaling the Network

As the number of anchors and the volume of managed funds grow, the "Tess Commission" creates a high-margin, sustainable revenue stream independent of market volatility.

| **Stage** | **Network Size** | **Monthly Deposit Volume** | **Tess Monthly Revenue** | **Tess Annual Revenue** |
| --------- | ---------------- | -------------------------- | ------------------------ | ----------------------- |
| Seed      | 5 Anchors        | $10M                       | $25,000                  | $300,000                |
| Growth    | 10 Anchors       | $50M                       | $125,000                 | $1.5M                   |
| Expansion | 25 Anchors       | $250M                      | $625,000                 | $7.5M                   |
| Dominance | 50 Anchors       | $500M                      | $1.25M                   | $15M                    |
| Maturity  | 100 Anchors      | $1B                        | $2.5M                    | $30M                    |

***

#### Why this works for Anchors

* Lower Operations: Tess handles the encryption, batching, and settlement logic.
* Volume over Margin: A 0.15% margin on $1B is significantly more profitable than a 2% margin on $10M.
* Network Effect: As more institutions use the Tess Relayer, the demand for local fiat anchors increases, creating a natural funnel for anchor growth.

</details>

### Currency-Specific Anchor Strategies <a href="#currency-specific-anchor-strategies" id="currency-specific-anchor-strategies"></a>

<details>

<summary><strong>USD Anchor (Americas): Existing, Proven</strong></summary>

The current MVP utilizes the Stellar Anchor Network for USD operations. To support multinational corporations and high-volume remittance, the platform is evolving into a multi-rail architecture optimized for cost, speed, and regulatory compliance.

***

#### Ingress & Settlement Channels

| **Channel**         | **Mechanism**                  | **Target Audience**                 |
| ------------------- | ------------------------------ | ----------------------------------- |
| Traditional Banking | ACH, FedWire, SWIFT            | Corporations & Payroll Providers    |
| Stablecoin Bridges  | USDC (ETH/Polygon) → Stellar   | DAOs & Web3 Treasuries              |
| Exchange Liquidity  | Kraken / Coinbase Institutions | High-frequency Remittance Operators |

***

#### Performance & Speed Benchmarks

* Bank Transfers (24 Hours): Reliable next-day settlement for large-scale treasury moves via standard banking rails.
* Stablecoin Bridges (5–10 Minutes): Atomic cross-chain swaps move liquidity onto Stellar without centralized exchange exposure.
* Crypto Exchanges (1–5 Minutes): Instant liquidity for institutions maintaining pre-funded balances on integrated platforms.

***

#### Core Strategic Use Cases

* US Remittance Operators: Competing with legacy providers by bypassing intermediary bank fees through direct anchor-to-anchor settlement.
* Multinational Corporations: Managing fragmented liquidity via negotiated wholesale rates, enabling million-dollar treasury moves at a fraction of standard SWIFT costs.

***

#### Strategic Objectives

* Wholesale Rate Negotiation: As institutional volume exceeds $10M/month, Tess initiates direct negotiations with anchors to lower the fee floor below 0.5%.
* Direct Bank Integration: Transitioning from third-party anchors to direct bank-to-ledger APIs for "Prime" institutional clients to further reduce hop-counts

</details>

<details>

<summary><strong>EUR Anchor (Europe): New, Regulated</strong></summary>

Europe presents a unique regulatory landscape defined by strict banking and data privacy standards. By partnering with established fintech anchors like SatoshiPay and Wirex Europe, the platform navigates these complexities while offering localized liquidity rails.

***

#### Ingress & Settlement Channels

| **Channel**             | **Mechanism**             | **Advantage**                                                           |
| ----------------------- | ------------------------- | ----------------------------------------------------------------------- |
| SEPA Transfers          | Standard EU Bank Rails    | The most common and trusted method for Euro-zone business transactions. |
| EURC Stablecoin         | Circle-issued / Regulated | A MiCA-compliant, Euro-backed stablecoin for rapid on-chain settlement. |
| Local Bank Partnerships | Revolut / Wise Model      | High-speed, low-fee transfers utilizing local banking infrastructure.   |

***

#### Performance & Speed Benchmarks

* SEPA (1–2 Days): Reliable, standard processing time for traditional EU bank-to-bank transfers.
* EURC (5 Minutes): Near-instant settlement via stablecoin bridges, bypassing traditional banking hours.
* Fintech Apps (Instant): Immediate execution through embedded wallets and direct API integrations.

***

#### Compliance & Governance Framework

* PSD2 Regulations: Utilizing Open Banking protocols to streamline payment initiation while adhering to EU financial data rules.
* GDPR Adherence: Ensuring all recipient data is encrypted at the source; the system remains auditable without compromising individual privacy.
* AML/CFT Oversight: A tiered responsibility model where Anchors manage KYC/Identity, while ARC ensures transaction confidentiality and protocol integrity.

***

#### Targeted Use Cases

* EU Corporations: Streamlining high-volume payroll and vendor payments across the Euro-zone.
* NGOs: Facilitating international aid distribution with speed, transparency, and lower intermediary costs.

</details>

<details>

<summary><strong>INR Anchor (Asia): Emerging, High-Volume</strong></summary>

Expanding into India requires a strategy that respects strict Reserve Bank of India (RBI) foreign exchange regulations and capital controls. The Tess model circumvents these hurdles by keeping Indian Rupee (INR) transactions localized, using the Stellar ledger only for the high-speed settlement layer.

***

#### The "Localized Liquidity" Model

To comply with forex limitations, INR never physically leaves the country on-chain. Instead, a "Mirror Settlement" approach is used.

* Step 1: The sender transfers INR to a regulated Indian Anchor account via local rails.
* Step 2: The Anchor verifies identity (KYC) and holds the INR locally.
* Step 3: A liquidity bridge triggers an equivalent deposit of USD/USDC on the Stellar network.
* Step 4: Tess facilitates the final settlement for the institution in minutes, bypassing the high fees of the SWIFT network.

***

#### Performance & Ingress Channels

| **Channel**  | **Mechanism**              | **Settlement Speed**      |
| ------------ | -------------------------- | ------------------------- |
| UPI          | Unified Payments Interface | \~30 Seconds (Instant)    |
| NEFT / RTGS  | Standard Bank Transfer     | 1–2 Hours (Banking hours) |
| Fintech Apps | PhonePe / Google Pay       | Instant (API-integrated)  |
| Tess Total   | End-to-End Flow            | 5–10 Minutes              |

***

#### Regulatory & Market Dynamics

* RBI Compliance: All Indian anchors must be licensed entities (e.g., AD-II category). This ensures the "On-Ramp" is fully regulated.
* Data Sovereignty: While anchors handle Tier 1 KYC, Tess ensures recipient privacy. Sensitive individual data is not broadcast on the ledger or shared with central regulators unless legally required.
* Cost Disruption: \* Traditional: 5–10% fees (SWIFT/Middlemen).
  * Tess: <1% total cost (Anchor fee + Stellar transaction).

***

#### High-Impact Use Cases

* Global Remittance: Capturing a share of India’s $120B annual remittance market—the largest in the world.
* Multinational Payroll: Enabling global firms to pay thousands of Indian employees instantly via UPI without the complexity of traditional forex wire transfers.
* Diaspora Payments: Providing a low-cost, transparent alternative for the millions of Indians living abroad.

</details>

<details>

<summary><strong>SGD/AED Anchor (Southeast Asia &#x26; GCC): Growing</strong></summary>

Expanding into Singapore (SGD) and the United Arab Emirates (AED) positions the platform within the world’s most advanced fintech hubs. These markets serve as strategic anchors for Asia-Pacific operations and Middle Eastern trade finance.

***

#### Regional Infrastructure & Integration

| **Region**      | **Strategic Advantages**                                       | **Partner Ecosystem**                                   |
| --------------- | -------------------------------------------------------------- | ------------------------------------------------------- |
| Singapore (SGD) | Tech-friendly MAS regulation; FAST same-day settlement system. | Wise, OKX Singapore, and regional HQ corporate banks.   |
| UAE (AED)       | Regulated hubs (ADGM/DIFC); focus on Digital Dirham (CBDC).    | Emirates Islamic, First Abu Dhabi Bank (FAB), and ADIB. |

***

#### Ingress Channels & Performance

* Singapore SGD: Utilizes the FAST (Fast and Secure Transfers) system for reliable same-day settlement across a mature fintech landscape.
* UAE AED: Leverages domestic banking rails and regulated fintech hubs for rapid 1–2 hour internal transfers.
* Tess Settlement: Regardless of the origin, the end-to-end settlement on the Stellar ledger is finalized in \~5 minutes.

***

#### Core Institutional Use Cases

**Singapore: Asia-Pacific Corporate Hub**

* VC & Startup Payroll: Streamlining salary disbursements for venture-backed firms and regional headquarters.
* Treasury Management: Moving capital efficiently between Singaporean HQs and satellite offices across Southeast Asia.

**UAE: GCC Trade Finance**

* Cross-Border Trade: Facilitating high-value B2B payments within the Gulf Cooperation Council (GCC) trade corridors.
* Digital Dirham Readiness: Positioning for future integration with the UAE’s CBDC (Digital Dirham) to enable instant, sovereign-backed settlement.

</details>

### Multi-Currency Pool Design: Fungible Settlement <a href="#multi-currency-pool-design-fungible-settlement" id="multi-currency-pool-design-fungible-settlement"></a>

<details>

<summary><strong>How Multi-Currency Works in Tess</strong></summary>

<div data-with-frame="true"><figure><img src="../../.gitbook/assets/Screenshot 2026-01-30 at 11.28.04.png" alt="" width="563"><figcaption></figcaption></figure></div>

</details>

### Speed & Cost Comparison <a href="#speed--cost-comparison" id="speed--cost-comparison"></a>

### Traditional vs Tess Multi-Currency

| Scenario                                     | Traditional                                                | ARC Phase 2+                                         | Improvement              |
| -------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------- | ------------------------ |
| **Indian operator → USD recipients**         | INR → SWIFT → USD (2-5 days, 5-8% cost)                    | INR → Anchor → XLM (5-10 min, <1% cost)              | 100x faster, 8x cheaper  |
| **EU corp → Asia vendors**                   | EUR → SWIFT → USD → Crypto → XLM (3-5 days, 3-5% cost)     | EUR → Anchor → XLM (1-2 min, <1% cost)               | 100x faster, 5x cheaper  |
| **Multinational payroll (mixed currencies)** | Multiple SWIFT + local banks (3-5 days, varies by country) | Mixed currencies → Pool → XLM (6 sec, <1% cost)      | 100x faster, 90% cheaper |
| **NGO (aid, 10 countries)**                  | 10 bank wires (10-20 days, $2-5K fees)                     | Single pool, 10 country distribution (6 sec, \~$100) | 100x faster, 99% cheaper |

### Regulatory & Compliance: Multi-Currency Considerations <a href="#regulatory--compliance-multi-currency-consideratio" id="regulatory--compliance-multi-currency-consideratio"></a>

<details>

<summary><strong>Anchor Regulation</strong></summary>

The Tess Protocol operates as a specialized orchestration layer that delegates primary regulatory compliance to licensed regional anchors. This ensures that every transaction follows local laws while maintaining the privacy and efficiency of the Stellar network.

***

#### Regional Compliance Requirements

| **Jurisdiction**    | **Regulatory Bodies & Frameworks**                                                                              |
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| United States (USD) | FinCEN (AML/CFT), OCC (Banking), SEC (Securities compliance), and State Money Transmitter Licenses (MTL).       |
| Europe (EUR)        | PSD2 (Open Banking), GDPR (Data Privacy), EBA (AML/Fintech), and individual National Regulators.                |
| India (INR)         | RBI (Reserve Bank of India), FEMA (Forex Management), SEBI (Financial markets), and specific State Regulations. |
| Singapore & UAE     | MAS (Singapore), SCA (UAE), and Free Zone authorities like DIFC and ADGM.                                       |

***

#### Tess Protocol Responsibilities

To maintain institutional-grade integrity, Tess enforces a strict operational boundary regarding compliance and data governance:

* Regulated Partnerships: Tess integrates exclusively with anchors that hold valid licenses in their respective jurisdictions.
* Immutable Audit Trails: Every disbursement generates a permanent, cryptographically verifiable record on the Stellar ledger for future audits.
* Regulatory Support: The protocol provides the tools necessary to fulfill regulatory inquiries, provided the initiating institution grants explicit consent.
* Delegated KYC: Tess does not perform KYC directly. Instead, it relies on the robust, Tier 1 Identity Verification already performed by regulated entry/exit anchors.

</details>

<details>

<summary><strong>AML/CFT in Multi-Currency Environment</strong></summary>

Tess addresses the risk of money laundering and "structuring" by providing a transparent, immutable audit trail that links legacy fiat systems with blockchain settlement. The protocol separates identity management (handled by regulated anchors) from transactional privacy (handled by Tess), ensuring compliance without compromising data security.

***

#### Multi-Layered AML Safeguards

| **Safeguard**            | **Technical Implementation**                                       | **Regulatory Value**                                                                        |
| ------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Immutable Ledger         | Every transaction is recorded on the Stellar blockchain.           | Permanent, tamper-proof history of all funds moving through the system.                     |
| Institutional Linking    | Deposits are cryptographically tied to a KYC-verified institution. | Eliminates anonymous "shadow" deposits into the protocol pool.                              |
| On-Chain Tracking        | SoroSwap conversions (e.g., EURC to USDC) are fully logged.        | Prevents "layering" by providing a clear path of currency transformations.                  |
| Privacy-Preserving Audit | PII remains encrypted while financial flows stay visible.          | Allows regulators to verify _volume_ and _flow_ without accessing sensitive recipient data. |

***

#### Regulatory Audit Workflow

In the event of a compliance review, the system provides a clear roadmap for investigators:

1. Flow Analysis: A regulator requests the history of INR deposits for a specific institution.
2. Ledger Query: Tess provides the `Pool.deposit` logs from the Stellar ledger, showing every INR-anchor interaction with precise timestamps and amounts.
3. Entity Verification: The regulator queries the Indian Anchor for the KYC records associated with those deposits (fulfilling the anchor's regulatory mandate).
4. Settlement Confirmation: The regulator verifies the final XLM settlement on the public ledger to ensure funds reached the intended destinations.

***

#### The "Separation of Concerns" Model

* Tess Protocol: Manages the cryptographic proofs and ensures the Recipient Names stay encrypted and private.
* Regulated Anchors: Maintain the legal responsibility for Sender KYC and fiat-to-crypto compliance.
* Regulators: Gain the ability to verify the Macro Flow of funds and audit the system's integrity via the public ledger.
* Institutions: Maintain a Full-Visibility Dashboard, holding the decryption keys to see every recipient, amount, and transaction hash.

</details>
