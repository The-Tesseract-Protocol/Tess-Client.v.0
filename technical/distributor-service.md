---
icon: '6'
cover: ../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
---

# Distributor Service

The Distributor is the **execution layer**.\
\
It receives validated withdrawal intents from Relayer, decrypts recipient lists (Distributor key only), executes SDP batch payments, generates cryptographic settlement proofs, settles withdrawals on IDM, and maintains encrypted execution logs. \
\
Distributor keys managed by DFNS HSM - never stored in service memory.

***

### Role & Architecture <a href="#role--architecture" id="role--architecture"></a>

<figure><img src="../.gitbook/assets/Screenshot 2026-01-29 at 13.05.52.png" alt="" width="370"><figcaption></figcaption></figure>

***

### DFNS Integration <a href="#dfns-integration" id="dfns-integration"></a>

#### **Key Storage & Security**

* Public Key: Known; used by the Relayer to encrypt outgoing payloads.
* Private Key: Securely isolated within the DFNS HSM vault.
* Security Guarantee: The private key never touches the Distributor service memory.

***

### Decryption & Execution Workflow

The Distributor follows this secure handshake to access recipient data:

1. Distributor: Initiates a request to the HSM: `GET /dfns/decrypt(recipients_encrypted)`.
2. DFNS: Performs decryption using the protected key
3. DFNS: Returns the plaintext recipients list to the Distributor.
4. Distributor: Uses the plaintext to execute the SDP batch.
5. Status: Distributor never holds the private key.&#x20;

***

### Functional Overview:

{% stepper %}
{% step %}
### execute\_withdrawal\_batch(intents) → Vec\<invoice\_id>

**What it does**: Execute batch of withdrawal intents via SDP.

**Processing**:

1. **Validate intents**: Check PENDING, not expired, lock IN\_PROGRESS.
2. **Decrypt recipients**: `DFNS.decrypt(recipients_encrypted)` for each.
3. **Build SDP batch**: Payments list, TSS sequence.
4. **Execute via SDP**: Submit transactions, get tx hashes.
5. **Generate settlement\_proof**: `hash(recipients + amounts + tx_timestamps)`.
6. **Settle on IDM**: `IDM.execute_withdrawal(intent_id, settlement_proof)`.
7. **Log encrypted**: Recipients, amounts, txs (institution\_public\_key).

**Returns**: `Vec<invoice_id>` (settlement receipts).

**Invariants**:

* All intents exist and PENDING
* Recipients are valid Stellar addresses
* Total amount matches intent
* SDP execution atomic

**Privacy**: Recipients visible only during execution, encrypted in logs.
{% endstep %}

{% step %}
### Encrypted Execution Logs

**What Distributor logs**:

{% code overflow="wrap" expandable="true" %}
```json
{
  "invoice_id": "inv_001",
  "intent_id": "intent_001",
  "H_encrypted": "encrypted_hash_xyz",
  "settlement_proof": "hash_xyz",
  "execution_timestamp": 1706460800,
  "recipients": [{"address": "GAAAA...", "amount": 50000}],
  "transaction_hashes": ["abc123"],
  "execution_status": "SUCCESS"
}
```
{% endcode %}

Encrypted with `institution_public_key`.

**Institution verifies**:

* Decrypts logs → sees recipients/txs
* Computes `hash(actual_recipients)` == on-chain `settlement_proof`&#x20;
{% endstep %}
{% endstepper %}

***
