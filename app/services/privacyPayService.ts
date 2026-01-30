/**
 * Privacy Pay Service
 *
 * Handles deposit transactions (on-chain) and withdrawal requests (API + encryption)
 */

import {
  Keypair,
  rpc,
  TransactionBuilder,
  Account,
  nativeToScVal,
  Contract,
  Networks,
} from '@stellar/stellar-sdk';
import nacl from 'tweetnacl';
import { HybridCryptoUtil } from '@/app/utils/hybrid-crypto.util';

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
  SOROBAN_RPC_URL: process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org',
  NETWORK_PASSPHRASE: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || Networks.TESTNET,
  TREASURY_CONTRACT_ID: process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ID || '',
  IDM_CONTRACT_ID: process.env.NEXT_PUBLIC_IDM_CONTRACT_ID || '',
  ASSET_ADDRESS: process.env.NEXT_PUBLIC_ASSET_ADDRESS || '',
  RELAYER_URL: process.env.NEXT_PUBLIC_RELAYER_URL || 'http://localhost:3000/api/relayer',
  DISTRIBUTOR_RSA_PUBLIC_KEY: process.env.NEXT_PUBLIC_DISTRIBUTOR_RSA_PUBLIC_KEY || '',
  RELAYER_NACL_PUBLIC_KEY: process.env.NEXT_PUBLIC_RELAYER_NACL_PUBLIC_KEY || '',
};

const BASE_FEE = '100';

// ============================================================================
// Types
// ============================================================================

export interface DepositParams {
  depositorAddress: string;
  hashLN: string;
  amount: number; // in USDC (will be converted to stroops)
}

export interface DepositResult {
  success: boolean;
  txXdr?: string;
  txHash?: string;
  identity?: string;
  error?: string;
}

export interface WithdrawParams {
  hashLN: string;
  recipients: Record<string, string>; // address -> amount as string
  senderPublicKey: string; // Stellar address (G... format)
  senderRawPublicKey: Uint8Array; // Raw 32-byte public key for backend compatibility
}

export interface WithdrawResult {
  success: boolean;
  requestId?: string;
  jobId?: string;
  senderIdentity?: string;
  error?: string;
}

export interface PrivacyPayDeposit {
  hashLN: string;
  identity: string;
  amount: number;
  txHash: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface PrivacyPayWithdrawal {
  requestId: string;
  jobId?: string;
  hashLN: string;
  totalAmount: number;
  recipients: Record<string, string>;
  timestamp: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  txHash?: string;
  senderIdentity?: string;
}

export interface PrivacyPaySession {
  walletAddress: string;
  deposits: Record<string, PrivacyPayDeposit>;
  withdrawals: Record<string, PrivacyPayWithdrawal>;
}

// ============================================================================
// Base64 Utility Functions
// ============================================================================

function encodeBase64(arr: Uint8Array): string {
  return btoa(String.fromCharCode(...arr));
}

function decodeBase64(s: string): Uint8Array {
  return Uint8Array.from(atob(s), c => c.charCodeAt(0));
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate hashLN from ledger number and wallet nonce
 * hashLN = SHA256(L || N) truncated to 32 hex chars
 */
export async function generateHashLN(ledgerNumber: number, walletNonce: number): Promise<string> {
  const combined = `${ledgerNumber}${walletNonce}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(combined);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.slice(0, 32);
}

/**
 * Derive identity from hashLN and depositor address
 * Matches the Treasury contract logic
 */
export async function deriveIdentity(hashLN: string, depositorAddress: string): Promise<string> {
  const combined = hashLN + depositorAddress;
  const encoder = new TextEncoder();
  const data = encoder.encode(combined);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  // Use first 16 bytes as identity (matches contract)
  const identity = btoa(String.fromCharCode(...hashArray.slice(0, 16)));
  return identity;
}

/**
 * Get current ledger number from Stellar
 */
export async function getCurrentLedger(): Promise<number> {
  const rpcServer = new rpc.Server(CONFIG.SOROBAN_RPC_URL);
  const health = await rpcServer.getHealth();
  return health.latestLedger;
}

/**
 * Generate a random nonce for the wallet
 */
export function generateWalletNonce(): number {
  return Math.floor(Math.random() * 1000000000);
}

// ============================================================================
// Deposit Functions (On-Chain)
// ============================================================================

/**
 * Check if account exists and has sufficient balance
 */
export async function checkAccountStatus(address: string): Promise<{
  exists: boolean;
  hasAsset: boolean;
  balance?: number;
  error?: string;
}> {
  try {
    const rpcServer = new rpc.Server(CONFIG.SOROBAN_RPC_URL);

    // Check if account exists
    try {
      await rpcServer.getAccount(address);
    } catch (e: any) {
      if (e.message?.includes('Not Found') || e.code === 404) {
        return { exists: false, hasAsset: false, error: 'Account does not exist. Please fund your wallet first.' };
      }
      throw e;
    }

    // For now, just return exists = true
    // TODO: Add asset balance check if needed
    return { exists: true, hasAsset: true };
  } catch (error: any) {
    return { exists: false, hasAsset: false, error: error.message };
  }
}

/**
 * Build deposit transaction for signing with Freighter
 */
export async function buildDepositTransaction(params: DepositParams): Promise<string> {
  const { depositorAddress, hashLN, amount } = params;

  if (!CONFIG.TREASURY_CONTRACT_ID || !CONFIG.ASSET_ADDRESS) {
    throw new Error('Missing required contract IDs. Check environment variables.');
  }

  // Log hashLN details to verify format
  console.log('[PrivacyPay Deposit] hashLN:', hashLN);
  console.log('[PrivacyPay Deposit] hashLN type:', typeof hashLN);
  console.log('[PrivacyPay Deposit] hashLN length:', hashLN.length);
  console.log('[PrivacyPay Deposit] Building deposit transaction:', {
    depositorAddress,
    hashLN,
    amount,
    treasuryContract: CONFIG.TREASURY_CONTRACT_ID,
    assetAddress: CONFIG.ASSET_ADDRESS,
    networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
  });

  const rpcServer = new rpc.Server(CONFIG.SOROBAN_RPC_URL);

  // Check account status first
  const accountStatus = await checkAccountStatus(depositorAddress);
  if (!accountStatus.exists) {
    throw new Error(accountStatus.error || 'Account does not exist');
  }

  // Load account from Stellar
  const account = await rpcServer.getAccount(depositorAddress);
  console.log('[PrivacyPay] Account loaded, sequence:', account.sequenceNumber());

  // Create treasury contract instance
  const treasuryContract = new Contract(CONFIG.TREASURY_CONTRACT_ID);

  // Convert amount to stroops (7 decimals)
  const amountInStroops = Math.floor(amount * 10_000_000);
  console.log('[PrivacyPay] Amount in stroops:', amountInStroops);

  // Build transaction
  const transaction = new TransactionBuilder(
    new Account(depositorAddress, account.sequenceNumber()),
    {
      fee: BASE_FEE,
      networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
    }
  )
    .addOperation(
      treasuryContract.call(
        'deposit',
        nativeToScVal(depositorAddress, { type: 'address' }),
        nativeToScVal(hashLN, { type: 'string' }),
        nativeToScVal(amountInStroops, { type: 'i128' })
      )
    )
    .setTimeout(30)
    .build();

  console.log('[PrivacyPay] Transaction built, simulating...');

  // Simulate to get resource requirements
  const simulateResponse = await rpcServer.simulateTransaction(transaction);

  console.log('[PrivacyPay] Simulation response:', JSON.stringify(simulateResponse, null, 2));

  if (rpc.Api.isSimulationError(simulateResponse)) {
    // Extract more detailed error info
    const errorDetails = (simulateResponse as any).error || 'Unknown simulation error';
    console.error('[PrivacyPay] Simulation error details:', errorDetails);
    throw new Error(`Simulation failed: ${errorDetails}`);
  }

  // Assemble with simulation results
  const preparedTx = rpc.assembleTransaction(transaction, simulateResponse).build();
  console.log('[PrivacyPay] Transaction assembled successfully');

  // Return XDR for Freighter to sign
  return preparedTx.toXDR();
}

/**
 * Submit signed transaction to Stellar
 */
export async function submitDepositTransaction(signedTxXdr: string): Promise<DepositResult> {
  try {
    const rpcServer = new rpc.Server(CONFIG.SOROBAN_RPC_URL);

    // Reconstruct transaction from XDR
    const transaction = TransactionBuilder.fromXDR(signedTxXdr, CONFIG.NETWORK_PASSPHRASE);

    // Submit
    const sendResponse = await rpcServer.sendTransaction(transaction);

    if (sendResponse.status === 'ERROR') {
      return {
        success: false,
        error: `Transaction failed: ${JSON.stringify(sendResponse)}`,
      };
    }

    // Wait for confirmation
    let getResponse = await rpcServer.getTransaction(sendResponse.hash);
    let attempts = 0;
    const maxAttempts = 30;

    while (
      getResponse.status === rpc.Api.GetTransactionStatus.NOT_FOUND &&
      attempts < maxAttempts
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      getResponse = await rpcServer.getTransaction(sendResponse.hash);
      attempts++;
    }

    if (getResponse.status === rpc.Api.GetTransactionStatus.SUCCESS) {
      return {
        success: true,
        txHash: sendResponse.hash,
      };
    } else {
      return {
        success: false,
        txHash: sendResponse.hash,
        error: `Transaction failed with status: ${getResponse.status}`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================================================
// Withdrawal Functions (API + Encryption)
// ============================================================================

/**
 * Encrypt recipients payload with Distributor's RSA public key
 * Uses hybrid AES-256-CBC + RSA encryption (supports up to ~133 recipients)
 */
async function encryptForDistributor(
  recipients: Record<string, string>
): Promise<string> {
  const distributorPublicKeyPem = CONFIG.DISTRIBUTOR_RSA_PUBLIC_KEY;

  if (!distributorPublicKeyPem) {
    throw new Error('Distributor RSA public key not configured');
  }

  // Use hybrid encryption utility
  const result = await HybridCryptoUtil.encryptPayload(
    recipients,
    distributorPublicKeyPem
  );

  console.log(
    `🔐 Hybrid encryption: ${result.metadata.recipients} recipients, ${result.metadata.payloadSize} bytes`
  );

  return result.encrypted;
}

/**
 * NaCl box encryption for relayer
 * Uses tweetnacl for proper authenticated encryption
 */
function encryptForRelayer(
  hashLN: string,
  totalAmount: number,
  encryptedD: string,
  senderPublicKeyBase64: string  // Base64-encoded raw public key (32 bytes)
): string {
  const relayerPublicKeyBase64 = CONFIG.RELAYER_NACL_PUBLIC_KEY;

  if (!relayerPublicKeyBase64) {
    throw new Error('Relayer NaCl public key not configured');
  }

  // Decode relayer's public key
  const relayerPublicKey = decodeBase64(relayerPublicKeyBase64);

  const requestId = crypto.randomUUID();
  const timestamp = Date.now();

  // Create inner payload (matches backend test format)
  const innerPayload = {
    requestId,
    hashLN,
    totalAmount,
    encryptedD,
    senderPublicKey: senderPublicKeyBase64,  // Base64 raw key for backend
    timestamp,
  };

  // Log the exact payload being sent to relayer
  console.log('[PrivacyPay Relayer Payload] hashLN in payload:', innerPayload.hashLN);
  console.log('[PrivacyPay Relayer Payload] Full payload (pre-encryption):', {
    requestId: innerPayload.requestId,
    hashLN: innerPayload.hashLN,
    totalAmount: innerPayload.totalAmount,
    senderPublicKey: innerPayload.senderPublicKey,
    timestamp: innerPayload.timestamp,
  });

  const innerPayloadStr = JSON.stringify(innerPayload);
  const innerPayloadBytes = new TextEncoder().encode(innerPayloadStr);

  // Generate ephemeral keypair for this request
  const ephemeralKeypair = nacl.box.keyPair();

  // Generate random nonce
  const nonce = nacl.randomBytes(nacl.box.nonceLength);

  // Encrypt with NaCl box
  const encryptedBox = nacl.box(
    innerPayloadBytes,
    nonce,
    relayerPublicKey,
    ephemeralKeypair.secretKey
  );

  // Construct wire format: [EphemeralPublicKey(32)] + [Nonce(24)] + [Ciphertext]
  const wireFormat = new Uint8Array(
    ephemeralKeypair.publicKey.length + nonce.length + encryptedBox.length
  );
  wireFormat.set(ephemeralKeypair.publicKey, 0);
  wireFormat.set(nonce, ephemeralKeypair.publicKey.length);
  wireFormat.set(encryptedBox, ephemeralKeypair.publicKey.length + nonce.length);

  return encodeBase64(wireFormat);
}

/**
 * Submit withdrawal request to Relayer
 */
export async function submitWithdrawal(params: WithdrawParams): Promise<WithdrawResult> {
  try {
    const { hashLN, recipients, senderRawPublicKey } = params;

    // Log hashLN to verify it matches deposit format exactly
    console.log('[PrivacyPay Withdraw] hashLN:', hashLN);
    console.log('[PrivacyPay Withdraw] hashLN type:', typeof hashLN);
    console.log('[PrivacyPay Withdraw] hashLN length:', hashLN.length);

    // Calculate total amount
    const totalAmount = Object.values(recipients).reduce(
      (sum, amt) => sum + parseFloat(amt),
      0
    );

    // Encrypt inner layer (for Distributor) with hybrid encryption
    const encryptedD = await encryptForDistributor(recipients);

    // Encrypt outer layer (for Relayer)
    // Send base64-encoded raw public key (matches backend test format)
    const senderPublicKeyBase64 = encodeBase64(senderRawPublicKey);
    const encryptedPayload = encryptForRelayer(
      hashLN,
      totalAmount,
      encryptedD,
      senderPublicKeyBase64  // Base64 raw key
    );

    // Submit to Relayer
    const response = await fetch(`${CONFIG.RELAYER_URL}/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payload: encryptedPayload,
      }),
    });

    const responseData = await response.json();
    console.log('[PrivacyPay Withdraw] Relayer response:', JSON.stringify(responseData));

    if (!response.ok) {
      return {
        success: false,
        error: `Relayer rejected withdrawal: ${response.status} - ${JSON.stringify(responseData)}`,
      };
    }

    // Map response fields — relayer may use withdrawalRequestId/_id instead of requestId/jobId
    const requestId = responseData.requestId || responseData.withdrawalRequestId || responseData._id || responseData.jobId;
    const jobId = responseData.jobId || responseData.withdrawalRequestId || responseData._id;

    return {
      success: true,
      requestId,
      jobId,
      senderIdentity: responseData.senderIdentity,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Check job statuses from the Relayer
 */
export async function checkJobStatuses(jobIds: string[]): Promise<{
  jobs: Array<{
    jobId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    txHash?: string;
  }>;
}> {
  try {
    const response = await fetch(`${CONFIG.RELAYER_URL}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobIds }),
    });

    if (!response.ok) {
      throw new Error(`Failed to check job statuses: ${response.status}`);
    }

    const data = await response.json();
    const rawJobs = Array.isArray(data) ? data : data.jobs || [];

    // Group by withdrawalRequestId to aggregate status per withdrawal
    const grouped: Record<string, any[]> = {};
    for (const job of rawJobs) {
      const key = job.withdrawalRequestId || job._id;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(job);
    }

    const jobs = Object.entries(grouped).map(([requestId, groupJobs]) => {
      const allSuccess = groupJobs.every((j: any) => j.status === 'SUCCESS');
      const anyFailed = groupJobs.some((j: any) => j.status === 'FAILED');
      const anyProcessing = groupJobs.some((j: any) => j.status === 'PROCESSING');

      const status: 'pending' | 'processing' | 'completed' | 'failed' =
        allSuccess ? 'completed' :
        anyFailed ? 'failed' :
        anyProcessing ? 'processing' : 'pending';

      // Pick the first available txHash from the group
      const completedJob = groupJobs.find((j: any) => j.stellarTransactionHash);

      return {
        jobId: requestId,
        status,
        txHash: completedJob?.stellarTransactionHash,
      };
    });

    return { jobs };
  } catch (error: any) {
    console.error('Error checking job statuses:', error);
    return { jobs: [] };
  }
}

// ============================================================================
// Session Management (localStorage)
// ============================================================================

const STORAGE_KEY = 'tesseract_privacy_pay';

/**
 * Get session for a wallet address
 */
export function getSession(walletAddress: string): PrivacyPaySession {
  if (typeof window === 'undefined') {
    return { walletAddress, deposits: {}, withdrawals: {} };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { walletAddress, deposits: {}, withdrawals: {} };
  }

  try {
    const sessions: Record<string, PrivacyPaySession> = JSON.parse(stored);
    return sessions[walletAddress] || { walletAddress, deposits: {}, withdrawals: {} };
  } catch {
    return { walletAddress, deposits: {}, withdrawals: {} };
  }
}

/**
 * Save session for a wallet address
 */
function saveSession(session: PrivacyPaySession): void {
  if (typeof window === 'undefined') return;

  const stored = localStorage.getItem(STORAGE_KEY);
  let sessions: Record<string, PrivacyPaySession> = {};

  if (stored) {
    try {
      sessions = JSON.parse(stored);
    } catch {
      sessions = {};
    }
  }

  sessions[session.walletAddress] = session;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

/**
 * Save a deposit to session
 */
export function saveDeposit(walletAddress: string, deposit: PrivacyPayDeposit): void {
  const session = getSession(walletAddress);
  session.deposits[deposit.hashLN] = deposit;
  saveSession(session);
}

/**
 * Get all deposits for a wallet
 */
export function getDeposits(walletAddress: string): PrivacyPayDeposit[] {
  const session = getSession(walletAddress);
  return Object.values(session.deposits).sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Save a withdrawal to session
 */
export function saveWithdrawal(walletAddress: string, withdrawal: PrivacyPayWithdrawal): void {
  const session = getSession(walletAddress);
  session.withdrawals[withdrawal.requestId] = withdrawal;
  saveSession(session);
}

/**
 * Get all withdrawals for a wallet
 */
export function getWithdrawals(walletAddress: string): PrivacyPayWithdrawal[] {
  const session = getSession(walletAddress);
  return Object.values(session.withdrawals).sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Update deposit status
 */
export function updateDepositStatus(
  walletAddress: string,
  hashLN: string,
  status: PrivacyPayDeposit['status'],
  txHash?: string
): void {
  const session = getSession(walletAddress);
  if (session.deposits[hashLN]) {
    session.deposits[hashLN].status = status;
    if (txHash) {
      session.deposits[hashLN].txHash = txHash;
    }
    saveSession(session);
  }
}

/**
 * Update withdrawal status
 */
export function updateWithdrawalStatus(
  walletAddress: string,
  requestId: string,
  status: PrivacyPayWithdrawal['status']
): void {
  const session = getSession(walletAddress);
  if (session.withdrawals[requestId]) {
    session.withdrawals[requestId].status = status;
    saveSession(session);
  }
}

/**
 * Update withdrawal by jobId — sets status, and optionally txHash
 */
export function updateWithdrawalByJobId(
  walletAddress: string,
  jobId: string,
  status: PrivacyPayWithdrawal['status'],
  txHash?: string
): void {
  const session = getSession(walletAddress);
  // Match by jobId or by requestId (withdrawalRequestId from API may map to either)
  const withdrawal = Object.values(session.withdrawals).find(
    w => w.jobId === jobId || w.requestId === jobId
  );

  if (withdrawal) {
    withdrawal.status = status;
    if (txHash) {
      withdrawal.txHash = txHash;
    }
    session.withdrawals[withdrawal.requestId] = withdrawal;
    saveSession(session);
  }
}
