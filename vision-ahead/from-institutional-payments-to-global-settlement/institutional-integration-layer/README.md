---
description: ERP Connectors & Enterprise Tooling
icon: '2'
cover: ../../../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
---

# Institutional Integration Layer

MVP is a standalone payment system. Future versions integrate into existing institutional software (SAP, NetSuite, QuickBooks, Workday) so institutions don't learn new tools, they use tools they already have.

<details>

<summary><strong>The Problem: Institutional Software Fragmentation</strong></summary>

#### 1. **Origin**: Legacy ERP/Accounting Silos

The finance team manages the "Source of Truth" in systems like SAP, NetSuite, or QuickBooks.

* _Data Held_: Recipient identities, precise payment amounts, and internal approval status.
* _Governance_: Existing 2-of-3 or executive sign-off workflows are locked inside these systems.

#### 2. The "**CSV Bridge**" (High-Friction Manual Work)

To move data from the ERP to the payment layer, teams must manually export and format data.

* _Formatting_: Converting accounting entries into specific withdrawal request formats.
* _Training Burden_: Staff must learn to navigate the Tess Dashboard, a completely separate tool.
* _Verification_: Manual line-by-line checks to ensure the CSV hasn't corrupted data during the export.

#### 3. **Execution**: Disconnected Processing

Once uploaded, Tess processes the withdrawal as an isolated event.

* _Context Gap_: The system cannot see _why_ a payment is happening (e.g., distinguishing between an invoice and aid).
* _Workflow Gap_: Internal ERP approvals don't carry over; the system essentially asks for approval twice.
* _Data Bloat_: Creates a parallel set of records that do not talk to the original ledger.

#### 4. **The Reconciliation Loop**

After the transaction is settled on-chain, the work isn't over.

* _Cross-Referencing_: Finance must manually match Tess settlement proofs back to the original ERP entries.
* _Audit Trail_: Manual updates to accounting records to reflect "Paid" status.
* _Risk_: High probability of human error, missing entries, or duplicate payments.

***

#### The Economic Impact

| **Metric**      | **Manual (Current)**          | **Goal (Target)**              |
| --------------- | ----------------------------- | ------------------------------ |
| Processing Time | 4-6 hours per 1000 recipients | Minutes                        |
| Data Integrity  | Manual/Error-prone            | Cryptographically Verified     |
| Workflow        | Fragmented & Duplicate        | Unified Single Source of Truth |
| Reconciliation  | Manual cross-referencing      | Automated API feedback         |

</details>

### The Vision: Tess as Middleware Layer <a href="#the-vision-arc-as-middleware-layer" id="the-vision-arc-as-middleware-layer"></a>

<figure><img src="../../../.gitbook/assets/Screenshot 2026-01-29 at 17.24.20.png" alt="" width="563"><figcaption></figcaption></figure>

<details>

<summary><strong>The Automated Future: Integrated Sync &#x26; Settlement</strong></summary>

Workflow Overview

> Finance System → Tess Encrypted Sync → Settlement → Audit Dashboard

#### Step 1: Connector Configuration (One-Time Setup)

The institution links their existing "Source of Truth" to the platform:

* SAP: Syncs employee records directly from the PA (Personnel Administration) table.
* NetSuite: Pulls vendor data from Accounts Payable.
* Workday: Syncs beneficiary lists from the Benefits system.
* Result: Tess is now context-aware and knows exactly where to pull recipient data.

#### Step 2: Native Execution (No New Tools)

The finance team stays within their familiar environment:

* Action: Approve "10K Salaries" in SAP using existing internal workflows.
* Automation: The system automatically generates a withdrawal request.
* Security: The request is encrypted so only the Relayer can decrypt it.
* Sync: Data flows to Tess via API, zero manual CSV work.
* Visibility: SAP displays the status: _"Pending Distributor execution."_

#### Step 3: Invisible Settlement

Tess handles the heavy lifting in the background:

* Validation: Relayer verifies the request (utilising ZK Proofs in Phase 3).
* Execution: Distributor processes payments via encrypted recipient sync.
* Settlement: Immutable record is written to the Stellar Ledger.
* Feedback Loop: A webhook notifies the ERP: _"Payment executed, settlement proof: xyz."_

#### Step 4: Localised Audit & Reconciliation

Full transparency without compromising privacy:

* Audit Dashboard: Finance accesses encrypted logs showing recipient hashes.
* On-Client Decryption: Using the Institution Key (which never leaves the local device), hashes are resolved to names.
* Reconciliation: Automatic alignment between SAP → Tess → Stellar.

***

#### Efficiency Comparison

| **Metric**            | **Manual (CSV)**         | **Integrated (Tess Sync)** |
| --------------------- | ------------------------ | -------------------------- |
| Time (50K Recipients) | \~200+ Hours             | < 10 Minutes               |
| Effort                | Manual formatting/upload | Fully Automatic            |
| Risk                  | Human error/Data leakage | End-to-end Encryption      |
| Source of Truth       | Fragmented/Duplicate     | Unified (ERP-driven)       |



</details>

### Connector Ecosystem: Enterprise Software Integration <a href="#connector-ecosystem-enterprise-software-integratio" id="connector-ecosystem-enterprise-software-integratio"></a>

### Planned Supported Systems&#x20;

| System               | Type           | Connector           | Use Case                                      |
| -------------------- | -------------- | ------------------- | --------------------------------------------- |
| **SAP ECC/S4**       | ERP            | RFC + REST          | Payroll, vendor payments, FI reconciliation   |
| **NetSuite**         | Cloud ERP      | SuiteScript 2.0 API | Accounting, AP/AR, multi-subsidiary           |
| **QuickBooks**       | SMB Accounting | QuickBooks API      | Small business payroll, expense reimbursement |
| **Workday**          | HCM            | Workday API         | Employee data, benefits, compensation         |
| **Salesforce**       | CRM            | Apex + Flow         | Commission payments, vendor management        |
| **Workato**          | iPaaS          | Connector Platform  | Custom workflows, legacy system bridges       |
| **Custom Databases** | Any            | JDBC/REST           | Proprietary systems, home-grown solutions     |

<details>

<summary><strong>Connector Architecture Example: SAP Integration</strong></summary>

<figure><img src="../../../.gitbook/assets/Screenshot 2026-01-29 at 17.34.39.png" alt=""><figcaption></figcaption></figure>



</details>

<details>

<summary><strong>NetSuite Integration Example</strong></summary>

<figure><img src="../../../.gitbook/assets/Screenshot 2026-01-30 at 11.16.50.png" alt="" width="563"><figcaption></figcaption></figure>

</details>



### Key Benefits of Institutional Integration Layer <a href="#key-benefits-of-institutional-integration-layer" id="key-benefits-of-institutional-integration-layer"></a>

{% tabs %}
{% tab title="For Finance Teams" %}
### Efficiency & Impact Analysis

The implementation of connectors transforms the operational burden of high-volume payments from a manual bottleneck into an automated background process.

***

#### Comparative Performance Metrics

| **Feature**       | **Legacy Workflow (Manual)**         | **Integrated Workflow (Connectors)** |
| ----------------- | ------------------------------------ | ------------------------------------ |
| Throughput        | 2-3 hours per 1,000 recipients       | 5 minutes per 1,000 recipients       |
| Data Integrity    | 3–5% Error Rate (Human typos)        | <0.1% Error Rate (API validation)    |
| Operational Focus | Fragmented (SAP + Dashboard + Excel) | Unified (Native SAP/ERP environment) |
| Compliance        | Manual, retrospective reconciliation | Proactive, audit-ready settlement    |

***

#### Key Transformations

* From Fragmented to Middleware: The Tess dashboard moves from being a "destination tool" that requires staff training to "transparent middleware" that runs invisibly behind your existing ERP.
* From Typo-Prone to Validated: By eliminating the CSV export/import loop, the risk of "fat-finger" errors or corrupted data during reformatting is virtually removed.
* From Manual to Audit-Ready: Reconciliation happens in real-time. Instead of a team spending days matching bank statements to spreadsheets, the system provides an immutable cryptographic link between the original invoice and the Stellar transaction hash.
{% endtab %}

{% tab title="For Compliance Officers" %}
### Audit & Compliance Transformation

The shift from manual oversight to an automated, ledger-backed system fundamentally changes the governance profile of institutional payments.

***

#### Comparison of Audit Workflows

| **Capability**       | **Manual Audit (Before)**                                | **Automated Audit (After)**                                |
| -------------------- | -------------------------------------------------------- | ---------------------------------------------------------- |
| Audit Process        | Manual cross-referencing of SAP, Tess, and bank records. | One-click "Generate Audit Report" via the Tess dashboard.  |
| Reconciliation       | \~40 hours/month of intensive manual labor.              | Instant & Automatic; SAP, Tess, and Stellar stay aligned.  |
| Regulatory Reporting | Custom data extraction; high risk of reporting errors.   | Template-based, auto-generated reports from ledger data.   |
| Trust Model          | Fragmented; relies on SAP and Tess operators.            | Unified; the Stellar ledger is the single source of truth. |

***

#### Key Improvements

* Operational Efficiency: By reducing reconciliation from a week-long monthly task to a background process, the finance team can pivot from "data entry" to "financial strategy."
* Data Fidelity: Reports are no longer subject to human interpretation or extraction errors. They are pulled directly from the immutable records of the Stellar Ledger.
* Simplified Compliance: Regulators receive data that is cryptographically linked to the original approval in the ERP, making the audit trail transparent and verifiable without exposing sensitive recipient PII.
{% endtab %}

{% tab title="For Security/Audit Teams" %}
### Security & Forensics Consolidation

The integration of Privy and Stellar collapses fragmented security silos into a unified, high-integrity governance model.

***

#### Security Architecture Evolution

| **Feature**    | **Fragmented Model (Before)**                          | **Unified Model (After)**                                       |
| -------------- | ------------------------------------------------------ | --------------------------------------------------------------- |
| Audit Trails   | Scattered across SAP, Tess, and Stellar; hard to sync. | Linked Narrative: One ID connects SAP → Tess → Stellar.         |
| Access Control | Multiple systems and keys; revocation is a nightmare.  | Privy Centric: All keys managed via a single OAuth login.       |
| Key Ownership  | Ambiguous; unclear who holds which credentials.        | Transparent: Institution holds keys; Privy manages storage.     |
| Forensics      | Near-impossible to reconstruct events accurately.      | Full Reconstruction: Timestamps, signatures, and ledger proofs. |

***

#### Institutional Governance Improvements

* Unified Identity: By using Privy, you eliminate "shadow access." When an employee leaves, revoking their OAuth access automatically secures their ability to sign or view sensitive data across the entire stack.
* The "Single Narrative" Trail: Forensic analysis no longer requires manual log stitching. Every transaction on the Stellar ledger carries a cryptographic link back to the original internal approval, providing a clear map of _who_ authorized _what_ and _when_.
* Immutable Forensics: Because the final proof is anchored on the Stellar ledger, the evidence of payment is tamper-proof. Even if an internal database were compromised, the on-chain record remains the definitive source for auditors
{% endtab %}
{% endtabs %}
