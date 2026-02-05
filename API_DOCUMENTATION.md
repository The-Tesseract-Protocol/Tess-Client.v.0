# Tesseract Client API & Service Documentation

This document details the API endpoints, service flows, and schemas used in the Tesseract Client for Privacy Pay and Batch Payments. It is intended to guide the creation of simulation scripts for testing and development.

## 1. Configuration & Environment

The services rely on the following environment variables. Ensure these are set in your simulation environment.

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SOROBAN_RPC_URL` | Stellar Soroban RPC endpoint | `https://soroban-testnet.stellar.org` |
| `NEXT_PUBLIC_NETWORK_PASSPHRASE` | Stellar Network Passphrase | `Test SDF Network ; September 2015` |
| `NEXT_PUBLIC_BACKEND_URL` | URL for the Treasury Backend | `http://localhost:3001` |
| `NEXT_PUBLIC_RELAYER_URL` | URL for the Privacy Relayer | `http://localhost:3002` |
| `NEXT_PUBLIC_TREASURY_CONTRACT_ID` | Soroban Contract ID for Treasury | `C...` |
| `NEXT_PUBLIC_DISTRIBUTOR_RSA_PUBLIC_KEY` | Public Key for encryption (Distributor) | `-----BEGIN PUBLIC KEY...` |
| `NEXT_PUBLIC_RELAYER_NACL_PUBLIC_KEY` | NaCl Public Key for encryption (Relayer) | `Base64String` |

---

## 2. Privacy Pay Service (`privacyPayService.ts`)

Handles privacy-preserving deposits and withdrawals via a hybrid on-chain/off-chain architecture.

### 2.1. Deposit Flow

**Sequence:**
1.  **Generate HashLN:** Create a unique hash from `LedgerNumber + WalletNonce`.
2.  **Derive Identity:** `SHA256(HashLN + DepositorAddress)`.
3.  **Build Transaction:** Create a Soroban `deposit` transaction.
4.  **Submit Transaction:** Send signed transaction to Stellar RPC.
5.  **Notify Backend:** Send metadata to the backend for indexing.

#### API: Notify Backend
*   **Method:** `POST`
*   **URL:** `{BACKEND_URL}/api/treasury/deposit/notify`
*   **Headers:** `Content-Type: application/json`

**Request Body Schema:**
```json
{
  "depositorHash": "string (hex, SHA256 of depositor public key)",
  "hashLN": "string (hex, 32 chars)",
  "depositorPublicKey": "string (G...)",
  "amount": "number",
  "expectedIdentity": "string (base64, derived identity)",
  "txHash": "string (hex, Stellar transaction hash)",
  "token": "string (e.g., 'usdc')",
  "assetContractId": "string (C...)",
  "tokenPriceUsd": "number",
  "depositValueUsd": "number"
}
```

**Response (Success):**
*   **Status:** `200 OK`
*   **Body:** `string` (e.g., "Notification processed")

#### API: Fetch Deposits
*   **Method:** `GET`
*   **URL:** `{BACKEND_URL}/api/treasury/deposits?depositorHash={depositorHash}`
*   **Query Params:**
    *   `depositorHash`: Hex string (SHA256 of depositor's public key).

**Response Schema:**
```json
{
  "deposits": [
    {
      "hashLN": "string",
      "expectedIdentity": "string",
      "amount": "string (numeric)",
      "currentBalance": "string (numeric)",
      "txHash": "string",
      "status": "pending" | "confirmed" | "failed",
      "token": "string",
      "createdAt": "string (ISO date)"
    }
  ]
}
```

### 2.2. Withdrawal Flow

**Sequence:**
1.  **Prepare Payload:** Map recipients (`address: amount`).
2.  **Encrypt (Inner):** Encrypt payload with **Distributor's RSA Key** (AES-256-CBC + RSA).
3.  **Encrypt (Outer):** Encrypt payload with **Relayer's NaCl Key** (Curve25519 Box).
4.  **Submit:** Send encrypted blob to Relayer.
5.  **Poll Status:** Check status using the returned `requestId`.

#### API: Submit Withdrawal
*   **Method:** `POST`
*   **URL:** `{RELAYER_URL}/withdraw`
*   **Headers:** `Content-Type: application/json`

**Request Body Schema:**
```json
{
  "payload": "string (Base64 encoded encrypted blob)"
}
```
*Note: The `payload` contains the double-encrypted data including `requestId`, `hashLN`, `totalAmount`, `encryptedD` (inner payload), `senderPublicKey`, and `token`.*

**Response Schema:**
```json
{
  "requestId": "string (UUID)",
  "jobId": "string (UUID, alias for requestId)",
  "senderIdentity": "string (Derived Identity)"
}
```

#### API: Check Job Status
*   **Method:** `POST`
*   **URL:** `{RELAYER_URL}/status`
*   **Headers:** `Content-Type: application/json`

**Request Body Schema:**
```json
{
  "jobIds": ["string", "string"]
}
```

**Response Schema:**
```json
[
  {
    "withdrawalRequestId": "string",
    "status": "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED",
    "stellarTransactionHash": "string (optional)",
    "error": "string (optional)"
  }
]
```

---

## 3. Bulk Payment Service (`bulkPaymentService.ts`)

Handles batch payments using Soroban smart contracts (`orchestrator` and `worker` contracts). This service interacts primarily with the **Stellar RPC**, not a custom REST API.

### 3.1. Batch Payment Flow

**Sequence:**
1.  **Validation:** Check recipient addresses and amounts.
2.  **Batching:** Split recipients into chunks of ~19 (max per contract call).
3.  **Build Auth Tree:**
    *   Construct a tree of `SorobanAuthorizedInvocation` objects.
    *   **Root:** Orchestrator contract (`orchestrate_payments`).
    *   **Level 2:** Worker contracts (`batch_pay`).
    *   **Level 3:** Token contract (`transfer`).
4.  **Sign:** Sign the `AuthEntry` with the user's wallet (Freighter/Keypair).
5.  **Submit:** Send the transaction containing the `invokeHostFunction` operation.

### 3.2. Simulation Requirements

To simulate a bulk payment, your script must:
1.  **Load Contracts:** Have the IDs for Orchestrator and Workers (defined in `CONFIG`).
2.  **Build XDR:** Use `@stellar/stellar-sdk` to construct the `SorobanAuthorizationEntry`.
3.  **Sign XDR:**
    *   Compute the **HashID Preimage** of the auth entry.
    *   Sign the hash with the user's Keypair.
    *   Attach the signature to the auth entry.
4.  **Submit:** Construct a transaction calling the host function with the signed auth entry.

---

## 4. Simulation Script Guidelines

To build a script that acts as a real user:

### 4.1. Prerequisites
*   Node.js environment.
*   `@stellar/stellar-sdk` installed.
*   `tweetnacl` (for Relayer encryption).
*   A valid Stellar Testnet account with XLM (use Friendbot).

### 4.2. User Simulation State
Maintain a simple state object for each "user":
```typescript
interface SimUser {
  keypair: Keypair;
  deposits: Array<{ hashLN: string; amount: number }>;
  nonce: number; // Incrementing wallet nonce
}
```

### 4.3. Rate Limiting
*   **RPC:** Limit to ~1-2 requests/sec per user to avoid 429s.
*   **Relayer:** Sequential requests are recommended (wait for status=SUCCESS before next withdrawal).

### 4.4. Error Handling
*   **RPC 504 (Timeout):** Retry the transaction simulation/submission with exponential backoff.
*   **Relayer 400:** Check encryption keys and payload format.
*   **Transaction Fails:** Check `result_codes` in the Stellar response (e.g., `tx_bad_auth` means signature issues).

---

## 5. Quick Reference: Endpoints

| Service | Method | Path | Description |
| :--- | :--- | :--- | :--- |
| **Backend** | POST | `/api/treasury/deposit/notify` | Notify of new deposit |
| **Backend** | GET | `/api/treasury/deposits` | Get deposit history |
| **Relayer** | POST | `/withdraw` | Submit withdrawal request |
| **Relayer** | POST | `/status` | Check withdrawal status |
| **Stellar RPC** | POST | `/` (JSON-RPC) | `getHealth`, `getAccount`, `sendTransaction`, `simulateTransaction` |
