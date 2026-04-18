---
icon: '9'
cover: ../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
---

# Anchor Integration & Bridge.xyz

Anchors (SEP-24) and Bridge (bridge.xyz) enable institutions to acquire on‑chain assets (fiat → XLM via Anchor, multi‑currency via Bridge). While the core MVP operates in XLM and core Stellar assets only, the platform needs to provide support for an increasing range of assets in the ecosystem.

***

### Quick diagram - system role

<figure><img src="../.gitbook/assets/Screenshot 2026-01-29 at 13.55.06.png" alt=""><figcaption></figcaption></figure>

***

### 1. Anchors - Fiat On‑Ramp (SEP‑24)

#### 1.1 Role and flow

**SEP‑24** is Stellar’s interactive fiat on/off‑ramp standard. Typical flows for an institution:

<figure><img src="../.gitbook/assets/Screenshot 2026-01-29 at 13.56.05.png" alt=""><figcaption></figcaption></figure>

Both Anchor and direct XLM deposit paths terminate in:

```
Pool.deposit() → IDM withdrawal power creation
```

#### 1.2 Dashboard integration (Anchor)

* **Option 1:** "Deposit XLM" - institution already holds XLM.
* **Option 2:** "Bridge fiat via Anchor" - redirect to Anchor widget, Anchor handles KYC/banking and credits XLM to the institution account.

Both options converge on `Pool.deposit()` and the standard ARC SDP flow.

***

### 2. Bridge.xyz - Multi‑Currency Payment Infrastructure

> Bridge (bridge.xyz) is a stablecoin payment platform that provides global virtual accounts, custody, and orchestration APIs for stablecoins (USDC/USDT/EUR stablecoins). It enables institutions to receive, custody, convert and move stablecoins without routing through centralized exchanges.&#x20;

#### 2.1 Key capabilities (Bridge)

* Receive stablecoins via on‑ramps (fiat → USDC) and direct stablecoin rails.
* Provision virtual accounts with local bank details (USD, EUR, MXN).
* Custody stablecoin balances in secure wallets.
* Issue branded stablecoins (optional).
* Provide orchestration APIs for programmatic deposit/withdrawal flows.

**Key distinction from Anchor:** Anchor focuses on fiat → XLM on‑ramps (SEP‑24). Bridge provides direct, global stablecoin infrastructure and virtual accounts to receive fiat and stablecoins at scale.

#### 2.2 Institutional value proposition

* Receive USDC/USDT globally without intermediary exchanges.
* Manage multiple currency virtual accounts (USD/EUR/MXN) for global senders.
* Custodial holding of stablecoins with auditable balances.
* Reduce conversion and reconciliation friction by integrating with Tess.

#### 2.3 Simplified architecture (Bridge → Tess)

<figure><img src="../.gitbook/assets/Screenshot 2026-01-29 at 13.59.37.png" alt="" width="260"><figcaption></figcaption></figure>

**Bridge components relevant to Tesseract:**

| Component           |                              Role in Tess | Benefit                                     |
| ------------------- | ----------------------------------------: | ------------------------------------------- |
| Orchestration API   | Receive/send stablecoins programmatically | Direct stablecoin inflow and notifications  |
| Virtual accounts    |            Local bank details for senders | Global reach without separate banking setup |
| Custody wallets     |                  Hold stablecoin balances | Secure, auditable custody before conversion |
| Issuance (optional) |             Branded stablecoins / rewards | On‑chain incentive mechanics                |

***

### 3. Dashboard integration (Unified UX)

Dashboard options for an institution:

* **Deposit XLM** - immediate, minimal path (MVP).
* **Bridge fiat via Anchor** - Post MVP build
* **Receive stablecoins via Bridge** -  View virtual accounts, balances, custody status, convert → deposit to Pool.

Flow summary shown in dashboard:

1. Select deposit method (XLM | Anchor | Bridge)
2. If Anchor/Bridge, redirect to respective widget or show Bridge virtual account details
3. Confirm funds credited
4. Execute `Pool.deposit(amount)`
5. Tess issues IDM withdrawal power and schedules confidential distribution via SDP

***

### 5. Why Bridge matters (problem vs solution)

**Problem (without Bridge):**

* Institutions receiving cross‑border USD/EUR must coordinate bank transfers or use multiple exchanges. This introduces counterparty risk, manual reconciliation, and operational latency.

**Solution (with Bridge):**

* Virtual accounts accept local deposits from senders.
* Bridge converts or custody stablecoins and exposes balances via API.
* Institution deposits (or converts) into Tess and uses SDP for confidential batch distribution.

Result: atomic‑style flows, fewer intermediaries, lower operational friction.

***

### 6. Benefits (high level)

#### For Tess

* Multi‑currency settlement options (XLM, stablecoins, RWAs).
* Reduced operational friction by avoiding CEXs for asset ingress.
* Virtual accounts unlock global senders without direct banking relationship.
* Custody integration provides auditability and compliance signals.

#### For Stellar & Bridge

* Showcases Stellar as a settlement layer for institutional stablecoin flows.
* Bridge gains access to confidential distribution rails (Tess) for payroll, vendor payments, and grants use cases.

***
