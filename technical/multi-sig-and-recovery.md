---
icon: bring-front
cover: ../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
---

# Multi-Sig & Recovery

**Multi-sig**: Off-chain approvals with on-chain status (DelegatedWithdrawal). No approver identities stored on-chain.

**Recovery**: Off-chain quorum approvals + 24h time-lock (RecoveryRequest). No contact identities on-chain. Secret rotation without fund loss.

Implements principles 2.3 (delegation first-class) and 2.6 (no irrecoverable state).

***

### Multi-Sig: DelegatedWithdrawal <a href="#multi-sig-delegatedwithdrawal" id="multi-sig-delegatedwithdrawal"></a>

```rust
pub struct DelegatedWithdrawal {
    pub request_id: Bytes,
    pub H_encrypted: Bytes,
    pub required_amount: i128,
    pub approval_count: u32,     // Current count (off-chain updated)
    pub threshold: u32,          // Required approvals
    pub status: u32,             // PENDING → APPROVED → EXECUTED
    pub created_at: u64,
    pub expires_at: u64,
    // NO approver identities ✅
}
```

**Flow**:

1. Backend: `create_delegated_withdrawal(H_encrypted, 500K, threshold=2)`
2. Off-chain: Collect signatures from CFO/Treasurer (encrypted logs)
3. Backend updates `approval_count=2 >= threshold` → status=APPROVED
4. `execute_delegated_withdrawal()` → creates WithdrawalIntent (normal flow)

**Privacy**: On-chain sees only count/threshold; institution decrypts approver details.

***

### Recovery: RecoveryRequest <a href="#recovery-recoveryrequest" id="recovery-recoveryrequest"></a>

```rust
pub struct RecoveryRequest {
    pub recovery_id: Bytes,
    pub H_encrypted: Bytes,      // Secret to recover
    pub recovery_status: u32,    // PENDING → APPROVED → EXECUTED
    pub initiated_at: u64,
    pub can_execute_at: u64,     // +24h timelock
    pub execution_status: bool,
    // NO contact identities ✅
}
```

**Flow** (lost secret scenario):

1. Backend: `initiate_recovery(recovery_id, H_encrypted)` → time-lock starts
2. Off-chain: 2-of-3 contacts approve (encrypted logs)
3. After 24h: `execute_recovery(recovery_id, new_H_encrypted)`
4. IDM: Delete old power, create new power (same amount)​

**Security**: Timelock + quorum prevents hasty exploitation.

***

### Auditability <a href="#auditability" id="auditability"></a>

**Institution decrypts off-chain logs**:

* Multi-sig: CFO approved t1, Treasurer t2
* Recovery: Legal approved t1, Board t2, 24h time-lock

**On-chain**: Only status/counts visible (opaque).

