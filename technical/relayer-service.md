---
icon: '5'
cover: ../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
---

# Relayer Service

The Relayer is the **validation and intent layer**. It receives encrypted withdrawal requests from institutions, validates signatures, checks withdrawal power on IDM, creates Withdrawal-Intents on-chain (audit trail), forwards valid requests to Distributor, and maintains institution-readable encrypted audit logs.

Relayer keys are managed by DFNS HSM - never stored in service memory.

***

### Role & Architecture <a href="#role--architecture" id="role--architecture"></a>

<figure><img src="../.gitbook/assets/Screenshot 2026-01-29 at 12.56.05.png" alt="" width="322"><figcaption></figcaption></figure>

***

### DFNS Integration <a href="#dfns-integration" id="dfns-integration"></a>

Key Storage & Access

* Public Key: Known and shared with institutions.
* Private Key: Securely stored within the DFNS HSM vault.
* Security Guarantee: The private key never enters the Relayer service memory.

***

### Decryption Workflow

When the Relayer requires a decrypted payload, the process follows these steps:

1. Relayer: Sends a request to the HSM via `GET /dfns/decrypt(encrypted_payload)`.
2.  DFNS: Executes the decryption internally:

    Decrypt(C, K\_{priv}) = M
3. DFNS: Returns the plaintext payload back to the Relayer.
4. Relayer: Processes the plaintext data.
5. Status: Relayer never holds the private key. ✅

***

### Functional Overview:

{% stepper %}
{% step %}
### receive\_withdrawal\_request(encrypted\_payload) → intent\_id

**What it does**: Receive and validate withdrawal request.

**Input payload** (encrypted):

```json
{
  "intent_id": "intent_001",
  "H_encrypted": "encrypted_hash_xyz",
  "requested_amount": 100000,
  "public_key_ephemeral": "pub_key_...",
  "signature": "sig_...",
  "timestamp": 1706460735
   ...
}
```

**Processing**:

1. `decrypted = DFNS.decrypt(encrypted_payload, relayer_private_key)`
2. `pub_key_ephemeral = decrypted.public_key_ephemeral` (in memory)
3. Verify signature with `pub_key_ephemeral`
4. `ephemeral_H_encrypted = encrypt(H_encrypted, pub_key_ephemeral))`;&#x20;
5. `power = IDM.get_withdrawal_power(ephemeral_H_encrypted)`; check sufficient
6. `IDM.create_withdrawal_intent(...)`​
7. Delete `pub_key_ephemeral` from memory&#x20;
8. Log encrypted with `institution_public_key`
9. Forward to Distributor

**Returns**: `intent_id` (on-chain confirmation).

**Invariants**:

* Signature must be valid
* Power must exist and be sufficient
* Intent must not already exist
* Not expired

**Privacy**: Ephemeral key never persisted, audit logs encrypted, recipients remain encrypted.

***
{% endstep %}

{% step %}
### Encrypted Audit Logs

**What Relayer logs**:

{% code overflow="wrap" expandable="true" %}
```json
{
  "intent_id": "intent_001",
  "H_encrypted": "ephemeral_H_encrypted",
  "requested_amount": 100000,
  "validation_status": "APPROVED",
  "validation_timestamp": 1706460735,
  "power_remaining_before": 500000,
  "power_remaining_after": 400000,
  "validation_details": {
    "signature_verified": true,
    "power_sufficient": true,
    "intent_created": true
  }
}
```
{% endcode %}

All encrypted with `institution_public_key`.

**Institution decrypts**: Sees exact validation steps. Cannot decrypt other institutions' logs.
{% endstep %}
{% endstepper %}
