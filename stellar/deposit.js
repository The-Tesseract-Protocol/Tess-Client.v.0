/**
 * TESSERACT: MASS DEPOSIT SCRIPT (XLM)
 * * Executes a 1000 XLM deposit for all 70 accounts in accounts.json.
 * * PRE-REQUISITES:
 * 1. Ensure .env is populated.
 * 2. Ensure accounts.json exists.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const {
    rpc,
    Keypair,
    TransactionBuilder,
    Contract,
    nativeToScVal,
    Operation,
    Horizon,
    Address,
    scValToNative,
    hash
} = require('@stellar/stellar-sdk');
const crypto = require('crypto');

// Load .env from project root
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// --- CONFIGURATION ---
const CONFIG = {
    RPC_URL: process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org',
    HORIZON_URL: 'https://horizon-testnet.stellar.org',
    NETWORK_PASSPHRASE: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
    TREASURY_ID: process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ID,
    // Using XLM SAC Address for the deposit asset
    XLM_SAC: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000',

    BASE_FEE: '100',
    DEPOSIT_AMOUNT: 1000, // Fixed amount
    MIN_REQUIRED_XLM: 1005 // 1000 for deposit + 5 buffer for fees
};

// Initialize RPC and Horizon Servers
const server = new rpc.Server(CONFIG.RPC_URL);
const horizonServer = new Horizon.Server(CONFIG.HORIZON_URL);

// --- LOAD ACCOUNTS ---
const accounts = JSON.parse(fs.readFileSync(path.join(__dirname, 'accounts.json'), 'utf8'));
console.log(`🤖 Loaded ${accounts.length} Accounts`);

// --- UTILS ---
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const sha256 = (data) => crypto.createHash('sha256').update(data).digest('hex');

// --- GAS CHECKER ---
async function ensureFunds(user) {
    const kp = Keypair.fromSecret(user.secret_key);

    try {
        const account = await horizonServer.loadAccount(kp.publicKey());
        let xlmBal = 0;

        account.balances.forEach(b => {
            if (b.asset_type === 'native') xlmBal = parseFloat(b.balance);
        });

        // Check if account has enough for the 1000 XLM deposit + Gas
        if (xlmBal < CONFIG.MIN_REQUIRED_XLM) {
            console.log(`[⛽ Funding] ${user.index} has ${xlmBal} XLM. Calling Friendbot...`);
            await axios.get(`https://friendbot.stellar.org/?addr=${kp.publicKey()}`);
            console.log(`[⛽ Funding] Funded ${user.index}. Waiting 5s for ledger...`);
            await sleep(5000);
            return true;
        }

        return true;
    } catch (e) {
        if (e.message && e.message.includes('404')) {
            console.log(`[⛽ Funding] Account ${user.index} not found. creating via Friendbot...`);
            await axios.get(`https://friendbot.stellar.org/?addr=${kp.publicKey()}`);
            await sleep(5000);
            return true;
        }
        console.error(`[⛽ Funding] Check failed for ${user.index}:`, e.message);
        return false;
    }
}

// --- DEPOSIT FUNCTION ---
async function performDepositXLM(user) {
    const kp = Keypair.fromSecret(user.secret_key);
    const amount = CONFIG.DEPOSIT_AMOUNT;

    // HashLN Generation
    const ledgerNumber = Math.floor(Date.now() / 5000);
    const nonce = Math.floor(Math.random() * 1000000);
    const combined = `${ledgerNumber}${nonce}`;
    const hashLN = sha256(combined).slice(0, 32);

    // Identity Derivation
    const identityCombined = hashLN + kp.publicKey();
    const idHash = crypto.createHash('sha256').update(identityCombined).digest();
    const expectedIdentity = idHash.subarray(0, 16).toString('base64');

    console.log(`[${user.index}] 🏦 Depositing ${amount} XLM...`);

    try {
        // Reload account to get fresh sequence number
        const account = await server.getAccount(kp.publicKey());
        const contract = new Contract(CONFIG.TREASURY_ID);

        // Convert 1000 XLM to Stroops (7 decimals)
        const amountInStroops = BigInt(Math.floor(amount * 1e7));

        const tx = new TransactionBuilder(account, {
            fee: CONFIG.BASE_FEE,
            networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
        })
            .addOperation(
                contract.call(
                    'deposit',
                    nativeToScVal(kp.publicKey(), { type: 'address' }),
                    nativeToScVal(hashLN, { type: 'string' }),
                    nativeToScVal(amountInStroops, { type: 'i128' }),
                    // Passing XLM SAC Address instead of USDC ID
                    new Address(CONFIG.XLM_SAC).toScVal()
                )
            )
            .setTimeout(30)
            .build();

        // Simulate
        const simRes = await server.simulateTransaction(tx);
        if (rpc.Api.isSimulationError(simRes)) throw new Error(`Sim failed: ${simRes.error}`);

        // Assemble & Sign
        const preparedTx = rpc.assembleTransaction(tx, simRes).build();
        preparedTx.sign(kp);

        // Submit
        const sendRes = await server.sendTransaction(preparedTx);
        if (sendRes.status === 'ERROR') throw new Error(`Tx Error: ${JSON.stringify(sendRes)}`);

        // Wait for Confirmation
        let status = 'NOT_FOUND';
        let retries = 0;
        while (status === 'NOT_FOUND' && retries < 20) {
            await sleep(1000);
            const getRes = await server.getTransaction(sendRes.hash);
            status = getRes.status;
            retries++;
        }

        if (status !== 'SUCCESS') throw new Error(`Tx Failed or Timed Out: ${status}`);

        console.log(`[${user.index}] ✅ Deposit Confirmed! Tx: ${sendRes.hash}`);

        // Notify Backend (Tesseract Protocol)
        // Updated token to 'xlm' and assetContractId to XLM_SAC
        await axios.post(`${CONFIG.BACKEND_URL}/api/treasury/deposit/notify`, {
            depositorHash: sha256(kp.publicKey()),
            hashLN: hashLN,
            depositorPublicKey: kp.publicKey(),
            amount: Number(amount),
            expectedIdentity: expectedIdentity,
            txHash: sendRes.hash,
            token: 'xlm',
            assetContractId: CONFIG.XLM_SAC,
            tokenPriceUsd: 0.12, // Approximate price for logging
            depositValueUsd: Number(amount) * 0.12
        });

    } catch (e) {
        console.error(`[${user.index}] ❌ Deposit Failed: ${e.message}`);
    }
}

// --- MAIN EXECUTION ---
async function main() {
    console.log("--- STARTING 1000 XLM DEPOSITS FOR 70 ACCOUNTS ---");

    for (const user of accounts) {
        // 1. Ensure they have enough XLM (1000 + gas)
        await ensureFunds(user);

        // 2. Perform Deposit
        await performDepositXLM(user);

        // Optional: Small sleep between accounts to avoid RPC rate limits
        await sleep(500);
    }

    console.log("--- ALL OPERATIONS COMPLETE ---");
}

main();