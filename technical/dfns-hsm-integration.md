---
icon: '7'
cover: ../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
---

# DFNS-HSM Integration

**Hybrid model** where institutions manage Secret S (generate locally, optional DFNS backup), while platform stores Relayer/Distributor keys in DFNS Hardware Security Modules. DFNS provides encryption, rotation, and compliance logging.

Private keys never leave HSM or touch service memory.

***

### Phase 1: Deposit (Institution Generates S)

<figure><img src="../.gitbook/assets/Screenshot 2026-01-29 at 13.10.26.png" alt="" width="332"><figcaption></figcaption></figure>

**Privacy**: S never sent to platform, H\_encrypted opaque, async prevents correlation.

### Phase 2: Withdrawal (Ephemeral Key)

<figure><img src="../.gitbook/assets/Screenshot 2026-01-29 at 13.12.15.png" alt="" width="271"><figcaption></figcaption></figure>

**Privacy**: Ephemeral key never persisted, DFNS handles all decryption.

### DFNS Vault (HSM-backed)

Secure Asset Management

* Institutional Secrets Registry: Encrypted backups of sensitive institutional data.
* Platform Keys: Contains `relayer_private_key` and `distributor_private_key`. These remain exclusively within the HSM boundary.
* Key Rotation Logs: Immutable records of cryptographic lifecycle events.

***

### DFNS API Interface

The following endpoints manage the interaction between the services and the HSM:

| **Endpoint**  | **Action** | **Logic**                                  |
| ------------- | ---------- | ------------------------------------------ |
| `/encrypt`    | Encryption | `(plaintext, public_key) → ciphertext`     |
| `/decrypt`    | Decryption | `(ciphertext, private_key_id) → plaintext` |
| `/rotate_key` | Lifecycle  | `(key_id, new_key) → status`               |
| `/audit_log`  | Governance | `(key_id) → access_history`                |

***



### Key Lifecycle & Rotation Management

Initial Provisioning

* Generation: RSA 4096-bit keypair generated within a secure environment.
* Storage: Private key is injected directly into the DFNS HSM.
* Distribution: Public key is exported and shared with authorized institutions.

***

### Rotation Protocol (Every 90 Days)

To maintain cryptographic hygiene, the system follows a structured 90-day cycle:

* Generation: Provision a new RSA 4096-bit keypair.
* HSM Integration: Securely store the new private key in DFNS.
* Legacy Support: Archive the old key to allow decryption of legacy payloads during the transition.
* Notification: Proactively push the new public key to all integrated institutions.
* Security Buffer: Implement a 7-day timelock before the new key becomes the primary for encryption.
* Continuity: Designed for zero downtime; both keys remain active for decryption until the cutover is complete.

### Institution Secrets (Optional Backup)

<figure><img src="../.gitbook/assets/Screenshot 2026-01-29 at 13.15.10.png" alt="Institution generates S locally  Backup to DFNS: ├─ DFNS.backup_secret(S, institution_id) ├─ DFNS encrypts/stores S_encrypted ├─ Returns backup_key_id (institution stores locally)  Recovery (lost S): ├─ Institution authenticates to DFNS (2FA) ├─ DFNS returns S over secure channel └─ Institution regains access"><figcaption></figcaption></figure>

***

### DFNS Compliance & Security <a href="#dfns-compliance--security" id="dfns-compliance--security"></a>

**Audit Logging**: All operations logged (decrypt, encrypt, rotation) for 7 years. Institutions request reports for their keys.

**HSM Protections**:

* Keys never leave HSM
* Operations inside HSM
* 2FA + device access
* Tamper-evident logs
* Automatic 90-day rotation
