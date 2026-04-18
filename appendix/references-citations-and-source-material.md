---
icon: lightbulb
cover: ../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
---

# References, Citations, and Source Material

**Purpose**\
This appendix provides a **complete, auditable list of all external references** used across the Tesseract GitBook: protocol specifications, Stellar documentation, blogs, benchmarking research, GitHub repositories, and ecosystem integrations.\
It is designed so reviewers can independently verify **every technical, economic, and architectural claim**.\
\
**Scope**: Stellar protocol, Soroban, SDP, Protocol 25 (X-Ray), SLPs, CAPs, ecosystem tooling, and SCF Integration sources

***

### A. Stellar Core & Protocol Documentation

#### A.1 Core Stellar Fundamentals

* **Fees, Resource Limits & Metering**\
  [https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering](https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering)\
  &#xNAN;_&#x55;sed for_: transaction fee modeling, Soroban resource accounting
* **Operations & Transactions**\
  [https://developers.stellar.org/docs/learn/fundamentals/transactions/operations-and-transactions](https://developers.stellar.org/docs/learn/fundamentals/transactions/operations-and-transactions)\
  &#xNAN;_&#x55;sed for_: operation batching, transaction structure
* **List of Operations**\
  [https://developers.stellar.org/docs/learn/fundamentals/transactions/list-of-operations](https://developers.stellar.org/docs/learn/fundamentals/transactions/list-of-operations)\
  &#xNAN;_&#x55;sed for_: payment operation limits, batching feasibility
* **Transaction & Ledger Resource Limits**\
  [https://developers.stellar.org/docs/networks/resource-limits-fees](https://developers.stellar.org/docs/networks/resource-limits-fees)\
  &#xNAN;_&#x55;sed for_: throughput ceilings, ledger-wide constraints
* **Protocol Upgrade History**\
  [https://stellar.org/protocol-upgrades](https://stellar.org/protocol-upgrades)\
  &#xNAN;_&#x55;sed for_: protocol availability timelines

***

### B. Soroban Smart Contracts

* **Soroban Overview & Limits**\
  [https://developers.stellar.org/docs/build/smart-contracts](https://developers.stellar.org/docs/build/smart-contracts)\
  &#xNAN;_&#x55;sed for_: contract execution limits, one-contract-op-per-tx constraint
* **Soroban Fee Model**\
  [https://developers.stellar.org/docs/build/smart-contracts/fees](https://developers.stellar.org/docs/build/smart-contracts/fees)\
  &#xNAN;_&#x55;sed for_: cost modeling in MVP and Phase 2+

***

### C. Stellar Ledger Protocols (SLPs)

#### C.1 SLP-0001 — Ledger Limits

* **Specification**\
  [https://github.com/stellar/stellar-protocol/blob/master/limits/slp-0001.md](https://github.com/stellar/stellar-protocol/blob/master/limits/slp-0001.md)

**Key citations used**:

* “A transaction may contain a maximum of 100 operations.”
* “A ledger may contain up to \~1000 operations total.”

_Used for_: batching strategy, SDP limitation analysis

***

#### C.2 SLP-0004 — Increase Ledger Wide Limits for Soroban

* **Discussion & Accepted Proposal**\
  [https://github.com/orgs/stellar/discussions/1850](https://github.com/orgs/stellar/discussions/1850)\
  **Specification**\
  [https://github.com/stellar/stellar-protocol/blob/master/limits/slp-0004.md](https://github.com/stellar/stellar-protocol/blob/master/limits/slp-0001.md) \
  &#xNAN;_( 0001, 0002, 0003 ) are present in same directory with these slugs_
*   **Metadata**

    ```
    SLP: 0004
    Status: Accepted
    Created: 2026-01-12
    ```

_Used for_:

* Expanded Soroban instruction limits (100M → 400M)
* Footprint expansion (100 → 200 entries)
* Reduced Soroban non-refundable fees
* Parallel apply threads

_Explicitly not used for_: payment throughput assumptions

***

### D. Capability Protocols (CAPs)

#### D.1 CAP-0039 — Smart Contracts

* **Status**: Adopted
* **Relevance**: 1 Soroban invocation per transaction

***

#### D.2 CAP-0074 — BN254 Elliptic Curve (Protocol 25)

* **Host Functions**:
  * `bn254_g1_add`
  * `bn254_g1_mul`
  * `bn254_multi_pairing_check`

_Used for_: on-chain ZK proof verification

***

#### D.3 CAP-0075 — Poseidon Hash Function (Protocol 25)

* **Function**: `poseidon_hash(bytes) → bytes32`

_Used for_: ZK-friendly hashing, settlement commitments

***

### E. Protocol 25 (X-Ray) References

* **Announcement**\
  [https://stellar.org/blog/developers/announcing-stellar-x-ray-protocol-25](https://stellar.org/blog/developers/announcing-stellar-x-ray-protocol-25)
* **Mainnet Launch**\
  [https://stellar.org/blog/ecosystem/stellar-xray-privacy-upgrade-live](https://stellar.org/blog/ecosystem/stellar-xray-privacy-upgrade-live)\
  &#xNAN;_(January 22, 2026)_
* **Stellar Core Release**\
  stellar-core v25.x

_Used for_: ZK feasibility, timeline gating of privacy features

***

### F. Benchmarking & Throughput Research

#### F.1 Stellar Supercluster

* **Throughput Measurement Methodology**\
  [https://github.com/stellar/supercluster/blob/main/doc/measuring-transaction-throughput.md](https://github.com/stellar/supercluster/blob/main/doc/measuring-transaction-throughput.md)

_Used for_: realistic TPS and ledger-close assumptions

***

#### F.2 Lumenauts Research

* **Boosting TPS with Channel Accounts**\
  [https://www.lumenauts.com/blog/boosting-tps-with-stellar-channels](https://www.lumenauts.com/blog/boosting-tps-with-stellar-channels)
* **How Many TPS Can Stellar Process?**\
  [https://www.lumenauts.com/blog/how-many-transactions-per-second-can-stellar-process](https://www.lumenauts.com/blog/how-many-transactions-per-second-can-stellar-process)

**Quoted insight**:

> “A transaction may contain up to 100 operations, so sending one operation per transaction is inefficient.”

_Used for_: channel + batching justification

***

### G. Stellar Disbursement Platform (SDP)

#### G.1 Official Documentation

* **SDP Docs**\
  [https://developers.stellar.org/platforms/stellar-disbursement-platform](https://developers.stellar.org/platforms/stellar-disbursement-platform)
* **Backend Repository**\
  [https://github.com/stellar/stellar-disbursement-platform-backend](https://github.com/stellar/stellar-disbursement-platform-backend)
* **Frontend Repository**\
  [https://github.com/stellar/stellar-disbursement-platform-frontend](https://github.com/stellar/stellar-disbursement-platform-frontend)

***

#### G.2 Code-Level Citations (SDP Limitations)

* `stellar_payment_dispatcher.go` — 1 payment → 1 transaction
* `transaction_worker.go` — single operation per tx
* `tx_processing_limiter.go` — hard cap of 8 tx per poll
* `channel_transaction_bundle.go` — 1:1 channel-to-tx binding

_Used for_: empirical analysis of SDP throughput ceilings

***

### H. Horizon, SDKs, and Tooling

* **Horizon API Reference**\
  [https://developers.stellar.org/apis/horizon/reference](https://developers.stellar.org/apis/horizon/reference)
* **Stellar Laboratory**\
  [https://developers.stellar.org/docs/tools/lab/transactions](https://developers.stellar.org/docs/tools/lab/transactions)
* **Go SDK (txnbuild)**\
  [https://github.com/stellar/go/tree/master/txnbuild](https://github.com/stellar/go/tree/master/txnbuild)
* **JavaScript SDK**\
  [https://www.npmjs.com/package/@stellar/stellar-sdk](https://www.npmjs.com/package/@stellar/stellar-sdk)

_Used for_: transaction construction, audit verification, explorer links

***

### I. Liquidity, Swaps, and DeFi (Phase-Gated)

* **Soroswap Docs & API**\
  [https://docs.soroswap.finance](https://docs.soroswap.finance/)\
  [https://api.soroswap.finance/docs](https://api.soroswap.finance/docs)
* **Aquarius Protocol**\
  [https://docs.aqua.network](https://docs.aqua.network/)
* **Stellar Broker**\
  [https://github.com/stellar-broker/client](https://github.com/stellar-broker/client)

_Used for_: future automated liquidity management (Phase 3+)

***

### J. Wallets, Custody, and Key Management

* **Freighter Wallet**\
  [https://developers.stellar.org/docs/build/guides/freighter](https://developers.stellar.org/docs/build/guides/freighter)
* **Stellar Wallets Kit**\
  [https://stellarwalletskit.dev](https://stellarwalletskit.dev/)
* **Privy**\
  [https://docs.privy.io](https://docs.privy.io/)
* **DFNS (WaaS & HSM)**\
  [https://docs.dfns.co](https://docs.dfns.co/)\
  [https://www.dfns.co/article/introducing-hsm](https://www.dfns.co/article/introducing-hsm)

_Used for_: client-side signing, decryption, institutional custody models

***

### K. Anchors & Fiat On/Off-Ramps

* **Stellar Anchor Platform**\
  [https://developers.stellar.org/platforms/anchor-platform](https://developers.stellar.org/platforms/anchor-platform)
* **MoneyGram on Stellar**\
  [https://developer.moneygram.com](https://developer.moneygram.com/)
* **Bridge**\
  [https://apidocs.bridge.xyz](https://apidocs.bridge.xyz/)
* **BlindPay**\
  [https://www.blindpay.com/docs/getting-started/overview](https://www.blindpay.com/docs/getting-started/overview)
* **Mercuryo**\
  [https://developers.mercuryo.io](https://developers.mercuryo.io/)
* **Abroad Finance**\
  [https://www.abroad.finance](https://www.abroad.finance/)

_Used for_: multi-currency roadmap, compliance boundaries

***

### L. SCF Integration Track Sources

* **SCF Integration Track Overview**\
  [https://communityfund.stellar.org](https://communityfund.stellar.org/)
* **Rotating Integration List**\
  (as provided by SCF documentation and GitBook excerpts)

_Used for_: eligibility justification and ecosystem alignment

***

### M. Citation Policy Applied

* Protocol limits → **SLPs / CAPs only**
* Performance → **published benchmarks only**
* Integrations → **public docs only**
* Future features → **explicitly phase-scoped**
* No private claims, no unverifiable assumptions

***

### N. Blogs

* [https://stellar.org/blog/foundation-news/the-interoperability-imperative-how-traditional-payment-networks-and-open-protocols-will-finally-work-together](https://stellar.org/blog/foundation-news/the-interoperability-imperative-how-traditional-payment-networks-and-open-protocols-will-finally-work-together)
* [https://stellar.org/blog/developers/financial-privacy](https://stellar.org/blog/developers/financial-privacy)
* [https://stellar.org/blog/developers/5-real-world-zero-knowledge-use-cases](https://stellar.org/blog/developers/5-real-world-zero-knowledge-use-cases)
* [https://stellar.org/blog/ecosystem/prototyping-privacy-pools-on-stellar](https://stellar.org/blog/ecosystem/prototyping-privacy-pools-on-stellar)
* [https://stellar.org/blog/developers/stellar-x-ray-protocol-25-upgrade-guide](https://stellar.org/blog/developers/stellar-x-ray-protocol-25-upgrade-guide)
* [https://stellar.org/blog/ecosystem/u-s-bank-is-testing-custom-stablecoin-issuance-on-the-stellar-network](https://stellar.org/blog/ecosystem/u-s-bank-is-testing-custom-stablecoin-issuance-on-the-stellar-network)
* [https://fincrimecentral.com/eu-privacy-coins-anonymous-crypto-ban-2027/](https://fincrimecentral.com/eu-privacy-coins-anonymous-crypto-ban-2027/)
* [https://scanx.trade/stock-market-news/currency/india-bans-privacy-cryptocurrencies-over-money-laundering-concerns/30589471](https://scanx.trade/stock-market-news/currency/india-bans-privacy-cryptocurrencies-over-money-laundering-concerns/30589471)
*   [https://finance.yahoo.com/news/dubai-regulator-bans-privacy-tokens-135037499.html](https://finance.yahoo.com/news/dubai-regulator-bans-privacy-tokens-135037499.html)<br>

    1. EU Privacy Coin Ban Details: [https://fincrimecentral.com/eu-privacy-coins-anonymous-crypto-ban-2027/](https://fincrimecentral.com/eu-privacy-coins-anonymous-crypto-ban-2027/)
    2. EU AMLR Framework: [https://phemex.com/news/article/eu-to-ban-privacy-coins-and-enforce-crypto-id-verification-by-2027-34341](https://phemex.com/news/article/eu-to-ban-privacy-coins-and-enforce-crypto-id-verification-by-2027-34341)
    3. India FIU Ban: [https://scanx.trade/stock-market-news/currency/india-bans-privacy-cryptocurrencies-over-money-laundering-concerns/30589471](https://scanx.trade/stock-market-news/currency/india-bans-privacy-cryptocurrencies-over-money-laundering-concerns/30589471)
    4. Dubai DFSA Ban: [https://finance.yahoo.com/news/dubai-regulator-bans-privacy-tokens-135037499.html](https://finance.yahoo.com/news/dubai-regulator-bans-privacy-tokens-135037499.html)
    5. Privacy Coins General Overview: [https://www.chainalysis.com/blog/privacy-coins-anonymity-enhanced-cryptocurrencies/](https://www.chainalysis.com/blog/privacy-coins-anonymity-enhanced-cryptocurrencies/)
    6. Regional Ban Status: [https://flashift.app/blog/are-privacy-coins-still-viable-under-stricter-regulations-in-2025/](https://flashift.app/blog/are-privacy-coins-still-viable-under-stricter-regulations-in-2025/)

    \
    \
    ... _etc_

### Appendix Status

This appendix is intended to be **exhaustive**.\
All links were verified as accessible on **January 30, 2026**.\
Any future GitBook revisions must update this appendix if new external sources are introduced.
