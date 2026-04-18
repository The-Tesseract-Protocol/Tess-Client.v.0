---
description: 'Liquidity Management & Protocol Automation:'
icon: '4'
cover: ../../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
---

# Self-Healing Pools via SoroSwap

MVP relies on manual liquidity management. Future versions automates pool rebalancing via SoroSwap integration and Soroban smart contracts, enabling self-healing pools and dynamic fee optimization.

***

### 1. The Vision: Automated Liquidity Management <a href="#the-vision-automated-liquidity-management" id="the-vision-automated-liquidity-management"></a>

#### Architecture: Self-Healing Pools via SoroSwap

<div data-with-frame="true"><figure><img src="../../.gitbook/assets/Screenshot 2026-01-29 at 18.46.04.png" alt="" width="260"><figcaption></figcaption></figure></div>

### 2. Ideal vs Actual: Real-Time Drift Detection

<div data-with-frame="true"><figure><img src="../../.gitbook/assets/Screenshot 2026-01-29 at 18.46.53.png" alt=""><figcaption></figcaption></figure></div>

<details>

<summary><strong>Details</strong></summary>

To maintain a healthy liquidity profile, institutions can define an Ideal Pool Composition. The Tess Protocol monitors these allocations in real-time, automatically triggering rebalancing via SoroSwap (Stellar's native AMM) whenever the "Drift" exceeds a predefined tolerance.

***

#### 1. Institutional Configuration

The institution sets its target liquidity weights based on its global disbursement needs.

| **Asset Class**           | **Ideal Target** | **Tolerance** | **Purpose**                        |
| ------------------------- | ---------------- | ------------- | ---------------------------------- |
| USD-stables (USDC)        | 40%              | ±5%           | Primary US/Global settlement rail. |
| XLM (Stellar Native)      | 30%              | ±5%           | Universal bridge and network fees. |
| EUR-stables (EURC)        | 20%              | ±5%           | European region disbursements.     |
| Other Assets (XSGD, etc.) | 10%              | ±5%           | Regional niche market liquidity.   |

***

#### 2. Drift Detection & Trigger

The system continuously audits the pool state. If an asset moves outside its tolerance window, an Atomic Rebalancing Transaction is queued.

Real-Time State Example:

* USDC: 45% (+5% Drift - At Limit)
* EURC: 18% (-2% Drift)
* XLM: 27% (-3% Drift)
* XSGD: 10% (Target)

Result: The excess 5% in USDC triggers an automatic rebalancing event to replenish the lagging XLM and EURC reserves.

***

#### 3. Rebalancing Execution Flow

| **Step**        | **Action**       | **Technical Detail**                                                                     |
| --------------- | ---------------- | ---------------------------------------------------------------------------------------- |
| 1. Optimization | Query SoroSwap   | Evaluates current liquidity depth and slippage for USDC/XLM and USDC/EURC pools.         |
| 2. Calculation  | Optimal Swap     | Identifies the most efficient route to move 30K USDC into the target assets.             |
| 3. Execution    | Atomic Swap      | Executes the trade on-chain. Fee: \~0.3% (compared to \~5.0% for manual/OTC desk moves). |
| 4. Verification | Post-State Check | Confirms the new balance (e.g., 270K USDC, 165K XLM, 165K EURC) matches the target.      |
| 5. Finalization | Ledger Event     | Emits an immutable, auditable event log on the Stellar ledger.                           |

***

#### 4. Impact Summary

* Zero Management: The institution sets the policy once; the protocol handles the execution.
* Cost Efficiency: Using automated on-chain liquidity pools provides up to 90% savings on rebalancing costs compared to manual treasury operations.
* Transparency: Every swap is backed by a transaction hash, providing a clear audit trail for regulators and internal finance teams.

</details>

### Tess Integration with [SoroSwap](https://soroswap.finance/)

<div data-with-frame="true"><figure><img src="../../.gitbook/assets/Screenshot 2026-01-29 at 18.50.11.png" alt=""><figcaption></figcaption></figure></div>

<details>

<summary><strong>Details</strong></summary>

#### Architecture: Automated Liquidity Rebalancing

The Tess Pool Contract on Soroban acts as the autonomous engine for treasury management. By interfacing directly with SoroSwap, the protocol ensures that institutional liquidity is always optimized for upcoming disbursements without manual intervention.

***

#### 1. Core Governance: Tess Pool Contract

The smart contract serves as the continuous monitor for the institution's on-chain assets.

* Real-Time Monitoring: Tracks balances across all supported assets (USDC, EURC, XLM).
* Drift Detection: Compares current holdings against the "Ideal Ratio" defined during setup.
* Logic Trigger: Initiates a rebalancing sequence the moment an asset breaches its defined tolerance.

***

#### 2. Intelligence Layer: SoroSwap Interface

Once triggered, the system moves from monitoring to execution through the SoroSwap interface.

* Liquidity Query: Scans available pools to determine depth (e.g., checking the 10M USDC/XLM and 5M USDC/EURC pools).
* Optimal Routing: Calculates the path with the lowest slippage.
  * Direct Path: USDC $$ $\rightarrow$ $$ XLM (0.3% fee).
  * Multi-Hop: USDC $$ $\rightarrow$ $$ EURC $$ $\rightarrow$ $$ XLM (0.6% fee).
  * Decision: The system selects the direct path to maximize capital efficiency.

***

#### 3. Atomic Execution: The Rebalancing Loop

The transition of funds happens in a single, atomic transaction to ensure safety.

1. Relayer Approval: The Relayer validates that the swap aligns with the institution's preset authorization parameters.
2. SoroSwap Execution: Performs the trade (e.g., 30K USDC $$ $\rightarrow$ $$ 23.7K XLM) directly on the Stellar ledger.
3. Pool Update: The contract balance updates immediately (USDC decreases, XLM increases).
4. Fee Efficiency: The entire rebalance costs only 90 USDC (0.3%), protecting the institution from the high fees of traditional OTC or manual desk moves.

***

#### System Impact

* Uninterrupted Distribution: Recipients continue to receive payments while the pool rebalances in the background.
* Mathematical Precision: Rebalancing is based on real-time market depth, not human estimation.
* Immutable Trail: Every swap, route calculation, and fee payment is recorded on-chain, providing a 100% transparent audit trail.

</details>

### Multi-Asset Settlement Mechanics <a href="#multi-asset-settlement-mechanics" id="multi-asset-settlement-mechanics"></a>

#### Settlement Flow: Automated Currency Conversion

<div data-with-frame="true"><figure><img src="../../.gitbook/assets/Screenshot 2026-01-29 at 18.52.47.png" alt=""><figcaption></figcaption></figure></div>

<details>

<summary><strong>Details</strong></summary>

#### Multi-Currency Global Disbursement Workflow

This scenario demonstrates the end-to-end lifecycle of an institutional payment run. By leveraging the Tess Settlement Algorithm, the protocol optimizes for low fees, rapid settlement, and recipient preference across diverse geographic regions.

***

#### Phase 1: Liquidity Ingress (Day 1)

The institution funds its pool via regulated regional anchors. These anchors act as the gateway between legacy banking (ACH, SEPA, UPI) and the Stellar ledger.

| **Deposit Source** | **Fiat Amount** | **On-Chain Asset**    | **Value (USD)** |
| ------------------ | --------------- | --------------------- | --------------- |
| US Anchor          | $500,000 USD    | 500K USDC             | $500,000        |
| EU Anchor          | €200,000 EUR    | 200K EURC             | \~$216,000      |
| India Anchor       | ₹5,000,000 INR  | 60K USDC              | $60,000         |
| Total Pool         | —               | 560K USDC + 200K EURC | \~$776,000      |

***

#### Phase 2: Distribution Analysis (Day 2)

The institution initiates a withdrawal intent for 1,000 recipients. The Tess algorithm analyzes the geographic distribution to determine the most efficient asset allocation.

* US (300): Optimized for USDC (Native USD stablecoin).
* EU (200): Optimized for EURC (Native Euro stablecoin).
* Asia/LatAm/Mixed (500): Optimized for XLM (Stellar’s native bridge asset for easy regional conversion).

***

#### Phase 3: Automated Rebalancing (SoroSwap)

The algorithm detects that while the pool is well-funded in USDC and EURC, it lacks native XLM for the Asia/LatAm disbursements.

1. Inventory Check: 560K USDC total. _Need 500K for US; 60K remaining._
2. Trade Trigger: 60K USDC $$ $\rightarrow$ $$ SoroSwap $$ $\rightarrow$ $$ 47.5K XLM.
3. Cost Efficiency: The 0.3% fee (180 USDC) is significantly lower than traditional currency exchange spreads (3–7%).
4. Final Inventory: 500K USDC, 200K EURC, and 47.5K XLM ready for disbursement.

***

#### Phase 4: High-Velocity Settlement

The Distributor executes the payments in parallel batches. By using Batch Aggregation, the protocol collapses 1,000 individual payments into just 10 Stellar transactions (100 operations each).

* Batch Time: \~6 seconds to reach ledger finality.
* Network Cost: \~10 XLM (less than $1 USD at current prices).
* Non-Repudiation: The system generates a Settlement Proof—a cryptographic hash linking the encrypted recipient intents to the immutable on-chain transaction hashes.

***

#### The Final Result: Efficiency & Impact

| **Metric**       | **Traditional Global Wire (SWIFT)**  | **Tess Protocol**                   |
| ---------------- | ------------------------------------ | ----------------------------------- |
| Total Fees       | $25,000 – $50,000 (3%–7%)            | \~$181 USD (0.02% of total)         |
| Settlement Speed | 3–5 Business Days                    | 6 Seconds                           |
| Data Privacy     | PII shared across intermediary banks | PII stays encrypted (ZK-ready)      |
| Audit Status     | Manual reconciliation required       | Real-time, immutable, and auditable |

</details>



<details>

<summary><strong>Slippage Optimisation: Multi-Hop vs Direct Swaps</strong></summary>

Tess employs a sophisticated routing engine to ensure that institutional liquidity is moved with maximum capital efficiency. By analyzing all available SoroSwap liquidity pools, the protocol identifies the path of least resistance, minimizing slippage and maximizing output.

***

#### 1. Pathfinding Scenario: EURC to XLM

In high-volume environments, a direct trade is not always the most efficient. Tess compares direct vs. multi-hop routes in real-time.

| **Metric** | **Option 1: Direct Swap** | **Option 2: Multi-Hop (EURC → USDC → XLM)**           |
| ---------- | ------------------------- | ----------------------------------------------------- |
| Path       | EURC/XLM                  | EURC $$ $\rightarrow$ $$ USDC $$ $\rightarrow$ $$ XLM |
| Pool Depth | 100K EURC / 80K XLM       | Deep: 100K EURC/108K USDC + 200K USDC/160K XLM        |
| Slippage   | 2.1%                      | 1.2%                                                  |
| Output     | 38.1K XLM                 | 39.8K XLM                                             |
| Net Gain   | —                         | +1.7K XLM (\~4.5% Improvement)                        |

The Decision: The algorithm selects the Multi-Hop route. While it requires an extra transaction, the gas costs on Stellar are negligible compared to the significant gain in asset output.

***

#### 2. Slippage Tolerance Settings

Institutions maintain control over their execution risk by selecting a Slippage Mode that aligns with their treasury policy.

| **Mode**     | **Max Slippage** | **Max Fee** | **Use Case**                                                  |
| ------------ | ---------------- | ----------- | ------------------------------------------------------------- |
| Conservative | 0.5%             | 0.75%       | Large treasury moves where price impact must be minimal.      |
| Balanced     | 2.0%             | 0.75%       | Standard operating mode for most institutional distributions. |
| Aggressive   | 5.0%             | 0.75%       | High-volume flows or fast-moving market conditions.           |

***

#### 3. Protocol Enforcement & Safeguards

The Tess Protocol acts as a safety layer, enforcing these limits at the smart contract level:

* Hard Limits: If the "Best Route" still exceeds the institution's maximum slippage (e.g., a 3% slippage route in 2% Conservative mode), the rebalancing is delayed until liquidity depth improves.
* Liquidity Registry: The protocol maintains a real-time registry of all SoroSwap pools to ensure routing calculations are based on the latest on-chain state.
* Auditability: The specific route taken, the slippage incurred, and the final execution price are recorded on the Stellar ledger, providing 100% transparency for internal auditors

</details>

<details>

<summary><strong>Governance: Protecting Pool Health</strong></summary>

To ensure institutional-grade stability, the Tess Pool Contract on Soroban enforces a strict set of programmatic rules. these safeguards are designed to mitigate market manipulation, prevent technical exploits, and protect against extreme volatility.

***

#### 1. On-Chain Protocol Rules

These constraints are hard-coded into the smart contract to govern routine operations without manual intervention.

| **Safeguard**    | **Technical Constraint**                   | **Rationale**                                                                  |
| ---------------- | ------------------------------------------ | ------------------------------------------------------------------------------ |
| Frequency Limit  | Max 4 rebalances/hr; 15-min min. interval. | Mitigates sandwich attacks and prevents rapid re-entrancy/flash loan exploits. |
| Slippage Ceiling | Max 5% per swap; 10% total daily cost.     | Protects the treasury from market manipulation and poor execution pricing.     |
| Asset Diversity  | Max 70% concentration; Min 5% floor.       | Ensures the pool remains liquid and prevents over-exposure to a single asset.  |
| Fee Bounds       | 0.1% Min – 2.0% Max.                       | Prevents extreme price adjustments during high-volatility events.              |
| Change Rate      | Max 5% ratio change per rebalance.         | Smooths out rebalancing moves to prevent sudden liquidity shocks.              |

#### 2. Emergency Circuit Breaker

In the event of a significant market crisis—such as a stablecoin de-pegging—the protocol transitions from autonomous to manual oversight.

Trigger Mechanism:

* Condition: An asset price deviates by >10% from its baseline across two consecutive price feeds.
* Immediate Action: Automatic Pause. All automated rebalancing is suspended instantly.
* Notification: Critical alerts are dispatched to both Tesseract Governance and the Institution’s treasury team.

Manual Intervention Options:

* Resume: If the deviation is identified as a temporary oracle glitch or a "flash crash."
* Halt: Total suspension of withdrawals if an underlying asset (e.g., EURC) is genuinely compromised.
* Recovery: Transition to a manual settlement plan—prioritizing security over speed until market stability returns.

***

#### 3. Strategic Rationale

The architecture is built on the principle of "Defense in Depth":

* Prevent Cascade Failures: By stopping automated trading during a crisis, the system prevents a "death spiral" where bad rebalancing leads to further imbalance and panic.
* Institutional Protection: Ensures no hidden losses occur from automated logic during unpredictable black-swan events.
* Human-in-the-Loop: While automation handles the 99% of standard operations, the protocol acknowledges that systemic crises require human judgment and intervention.

</details>

### Economic Impact

Automation enables:

* Flat operational cost at any scale
* Lower slippage and tighter spreads
* Predictable margins for the protocol
* Lower fees for institutions

Most importantly - **volume no longer increases complexity**.

***

> Institutions do not manage pools.\
> They use settlement infrastructure that manages itself.
