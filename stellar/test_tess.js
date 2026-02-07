/**
 * TESSERACT ADVANCED TRAFFIC SIMULATOR (Real-World Emulation)
 *
 * FEATURES:
 * 1. Realistic User Sessions: Agents come online for 5-10 mins.
 * 2. Traffic Patterns: Low baseline (10-20 daily visitors) + Random Bursts (4-5 concurrent).
 * 3. Asset Logic:
 *    - XLM Deposits: 48 - 5000.
 *    - USDC Deposits: 90% (1-20), 10% (1-100).
 * 4. Fixed Recipients: Loads public/upload.csv for Batch/Withdrawal destinations.
 * 5. Autonomous Recovery: Self-healing agents (Janitor).
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const {
    rpc,
    Keypair,
    TransactionBuilder,
    Account,
    Contract,
    nativeToScVal,
    Networks,
    Operation,
    TimeoutInfinite,
    Horizon,
    Address,
    xdr,
    scValToNative,
    hash
} = require('@stellar/stellar-sdk');
const nacl = require('tweetnacl');
const naclUtil = require('tweetnacl-util');
const crypto = require('crypto');

// Load .env from project root
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// --- CONFIGURATION ---
const CONFIG = {
    RPC_URL: process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org',
    HORIZON_URL: 'https://horizon-testnet.stellar.org',
    NETWORK_PASSPHRASE: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
    TREASURY_ID: process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ID,
    USDC_ID: process.env.NEXT_PUBLIC_ASSET_ADDRESS_USDC,
    USDC_ISSUER: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
    BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000',
    RELAYER_URL: process.env.NEXT_PUBLIC_RELAYER_URL || 'http://localhost:3000/api/relayer',
    DISTRIBUTOR_RSA_KEY: process.env.NEXT_PUBLIC_DISTRIBUTOR_RSA_PUBLIC_KEY,
    RELAYER_NACL_KEY: process.env.NEXT_PUBLIC_RELAYER_NACL_PUBLIC_KEY,

    // Batch Payment Config
    ORCHESTRATOR_ID: 'CBYD7XCJH6RCA27AXXJDO3ARZHQJIW5BYEHAUKJ7QS6NQMLIQ2KMJ3K2',
    XLM_SAC: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    WORKER_CONTRACTS: [
        'CA46744JXE6PUFP2E4G26QKBG3DTA3RIGGWGTP2QIEKZ6U3CQ3LKM7SH',
        'CAWHF5NQMVED6ANSUMG3OXEMWQHOX2K53VSOK5FO3MMMG7Y5YMFMZABZ',
        'CC6VG5BLTU4SIZQAFOQZOIOEKLQAR2NYTMPOLZVULK7ZHYUTE7YKORPJ',
        'CCOV6M4AEP7TGZ3NIMFGUXMWO3TXSWHSHDGGMIYNN7QM2COM7ITEJBMU',
        'CDWIM6L5FKT3PQ7PCM5UFUIWPS22YVQWUMIMPKLPKBVFUKD5JJUQNH27',
        'CD236CW2YLUXXWK4WT6BRDKMDDCKZKPU5RJRSVL64H6XZLXEU3UZ73GF',
        'CB7O7WGBXMVGES75LSLVC277YIHVHGO75RN7YJELE7IQ2664TMZ4OLG6',
        'CBAUCRBOPXN33TIUIMBCQ2BPWPA446IWMK32KYO43RGOLG3KPBE3L5J2',
        'CCM6WJHG6CDN7YCR4BVSFKJVQEOW5BA6IHH6RSXX5QRPLNS7E4UL4SLN',
        'CBHRLC3IY6OIOGTU4E737IKPWV46N43NLTJX2ZIYGK7ZI6B4TRL7HIIC',
        'CC6N434Q5GH4TIN4NVXK7FWZHLEAAC3MIZATRHT3YK2VEAVK3GKW62CE',
        'CBGMTVKUULAVZ3UJQMJ74SISODP5FV5W2UGSWXHYGXUAYGLMXTM3QKHH',
        'CBCWTKVJEVDNYLMK7PD5VU67IX46BPCSOH75EINCF4MIYJW7HUF2O7P6',
        'CCNZ753NQBP67AZSYCQNLCVW56ZAY36AQMTNOBI2WKLP4GNR5ARBRIES',
        'CAEPOYMB33T6MQXNA2C5HLXNCKHLC5RCMF7EFCMPB3M2764RRUACC2E6',
        'CCJYOSKABCA4XDATIPB4BJI63GQ25AMGXFQSY6KSZ3AMCWAD6OF4L3RW',
        'CBEJCOJBK5QWHSOPLZY6OGY2446JXC5UJG2565NAQNP2BBY3WSRWZD57',
        'CB2TXKCIFCITSG4QICQAWJ4GPVJ6YBVBKBPTEAA5IDHL2QKHZ7FCLGNK',
        'CCTMP2VNVVSABI7J2L442KTBLRHYAMVIB632UTBZYZDMV3RIGU4OUBBY',
        'CBFYQMR7BY7CANCIWJEAL7LYVURWUIKZZZFM3FR2B765HZKTGYLEYLWW',
    ],

    // Thresholds
    MIN_XLM: 20,      
    MIN_USDC: 10,     
    REFILL_USDC: "50", 
    BASE_FEE: '100',
};

// Validate Config
function validateConfig() {
    const missing = [];
    if (!CONFIG.TREASURY_ID) missing.push('TREASURY_ID');
    if (!CONFIG.USDC_ID) missing.push('USDC_ID');
    if (!CONFIG.DISTRIBUTOR_RSA_KEY) missing.push('DISTRIBUTOR_RSA_KEY');
    if (!CONFIG.RELAYER_NACL_KEY) missing.push('RELAYER_NACL_KEY');

    if (missing.length > 0) {
        console.error("❌ CRITICAL: Missing Env Variables:", missing);
        process.exit(1);
    }
}
validateConfig();

const server = new rpc.Server(CONFIG.RPC_URL);
const horizonServer = new Horizon.Server(CONFIG.HORIZON_URL);

// --- LOAD DATA ---
const accounts = JSON.parse(fs.readFileSync(path.join(__dirname, 'accounts.json'), 'utf8'));
const masterAccount = JSON.parse(fs.readFileSync(path.join(__dirname, 'master_account.json'), 'utf8'));
const masterKp = Keypair.fromSecret(masterAccount.secret_key);

// Load CSV Recipients
const csvPath = path.resolve(__dirname, '../public/upload.csv');
let fixedRecipients = [];
try {
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    fixedRecipients = csvContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
            const [address, amount] = line.split(',');
            return { address, amount: parseFloat(amount) };
        });
    console.log(`📋 Loaded ${fixedRecipients.length} fixed recipients from CSV.`);
} catch (e) {
    console.error("❌ Failed to load upload.csv:", e.message);
    process.exit(1);
}

// --- UTILS ---
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const sha256 = (data) => crypto.createHash('sha256').update(data).digest('hex');

function weightedRandomAmount(min, max, skew = 2) {
    let u = Math.random();
    let v = Math.pow(u, skew);
    let val = min + (max - min) * v;
    return Math.floor(val);
}

// --- ENCRYPTION HELPERS ---
const encodeBase64 = (arr) => Buffer.from(arr).toString('base64');
const decodeBase64 = (str) => Buffer.from(str, 'base64');

async function encryptForDistributor(recipients) {
    const payloadStr = JSON.stringify(recipients);
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
    let encryptedPayload = cipher.update(payloadStr, 'utf8');
    encryptedPayload = Buffer.concat([encryptedPayload, cipher.final()]);

    let pem = CONFIG.DISTRIBUTOR_RSA_KEY.replace(/\\n/g, '\n');
    const base64Body = pem.replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '').replace(/\s/g, '');
    const keyBuffer = Buffer.from(base64Body, 'base64');
    const keyObject = crypto.createPublicKey({ key: keyBuffer, format: 'der', type: 'spki' });

    const encryptedKey = crypto.publicEncrypt({ key: keyObject, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' }, aesKey);
    const keySizeBuf = Buffer.alloc(4);
    keySizeBuf.writeUInt32BE(encryptedKey.length, 0);

    return Buffer.concat([keySizeBuf, encryptedKey, iv, encryptedPayload]).toString('base64');
}

function encryptForRelayer(hashLN, totalAmount, encryptedD, senderRawPublicKey, token = 'usdc') {
    const relayerPublicKey = naclUtil.decodeBase64(CONFIG.RELAYER_NACL_KEY);
    const requestId = crypto.randomUUID();
    const timestamp = Date.now();
    const innerPayload = { requestId, hashLN, totalAmount, encryptedD, senderPublicKey: encodeBase64(senderRawPublicKey), token, timestamp };
    const innerPayloadBytes = naclUtil.decodeUTF8(JSON.stringify(innerPayload));
    const ephemeralKeypair = nacl.box.keyPair();
    const nonce = nacl.randomBytes(nacl.box.nonceLength);
    const encryptedBox = nacl.box(innerPayloadBytes, nonce, relayerPublicKey, ephemeralKeypair.secretKey);
    const wireFormat = new Uint8Array(ephemeralKeypair.publicKey.length + nonce.length + encryptedBox.length);
    wireFormat.set(ephemeralKeypair.publicKey, 0);
    wireFormat.set(nonce, ephemeralKeypair.publicKey.length);
    wireFormat.set(encryptedBox, ephemeralKeypair.publicKey.length + nonce.length);
    return naclUtil.encodeBase64(wireFormat);
}

// --- MAINTENANCE ---
async function checkAndRefill(user) {
    const kp = Keypair.fromSecret(user.secret_key);
    try {
        const account = await horizonServer.loadAccount(kp.publicKey());
        let xlmBal = 0, usdcBal = 0;
        account.balances.forEach(b => {
            if (b.asset_type === 'native') xlmBal = parseFloat(b.balance);
            if (b.asset_code === 'USDC') usdcBal = parseFloat(b.balance);
        });

        if (xlmBal < CONFIG.MIN_XLM) {
            console.log(`[🔧 Janitor] ${user.index} low XLM (${xlmBal}). Friendbotting...`);
            await axios.get(`https://friendbot.stellar.org/?addr=${kp.publicKey()}`);
            await sleep(3000);
        }
        if (usdcBal < CONFIG.MIN_USDC) {
            console.log(`[🔧 Janitor] ${user.index} low USDC (${usdcBal}). Refilling...`);
            await refillUsdcFromMaster(kp.publicKey());
        }
        return true;
    } catch (e) {
        if (e.message?.includes('404')) {
            console.log(`[🔧 Janitor] New account ${user.index}. Funding...`);
            await axios.get(`https://friendbot.stellar.org/?addr=${kp.publicKey()}`);
            await sleep(3000);
            return true;
        }
        return false;
    }
}

async function refillUsdcFromMaster(destination) {
    try {
        const sourceAccount = await server.getAccount(masterKp.publicKey());
        const { Asset } = require('@stellar/stellar-sdk');
        const usdcAsset = new Asset('USDC', CONFIG.USDC_ISSUER);
        const tx = new TransactionBuilder(sourceAccount, { fee: CONFIG.BASE_FEE, networkPassphrase: CONFIG.NETWORK_PASSPHRASE })
            .addOperation(Operation.payment({ destination, asset: usdcAsset, amount: CONFIG.REFILL_USDC }))
            .setTimeout(30).build();
        tx.sign(masterKp);
        await server.sendTransaction(tx);
    } catch (e) { console.error(`[Janitor] Master refill failed: ${e.message}`); }
}

async function trackAnalytics(event) {
    try {
        await axios.post(`${CONFIG.BACKEND_URL}/api/analytics/update`, { ...event, timestamp: Date.now(), platform: 'simulation_agent' });
    } catch (e) {}
}

// --- ACTIONS ---

async function performDeposit(user) {
    const kp = Keypair.fromSecret(user.secret_key);
    
    // Asset Logic: 
    // Randomly pick token. 
    // But since XLM is readily available (48-5000) and USDC is limited (20 faucet), 
    // we lean towards XLM or ensure USDC stays small.
    // User requested: XLM 48-5000. USDC 90% (1-20), 10% (1-100).
    const isUsdc = Math.random() < 0.3; // 30% USDC, 70% XLM (Adjustable)
    let amount = 0;

    if (isUsdc) {
        if (Math.random() < 0.9) amount = weightedRandomAmount(1, 20, 1);
        else amount = weightedRandomAmount(20, 100, 1);
    } else {
        amount = weightedRandomAmount(48, 5000, 2);
    }

    const tokenSymbol = isUsdc ? 'usdc' : 'xlm';
    const tokenContractId = isUsdc ? CONFIG.USDC_ID : CONFIG.XLM_SAC;

    // HashLN
    const hashLN = sha256(`${Math.floor(Date.now()/5000)}${Math.random()}`).slice(0, 32);
    const identityCombined = hashLN + kp.publicKey();
    const idHash = crypto.createHash('sha256').update(identityCombined).digest();
    const expectedIdentity = idHash.subarray(0, 16).toString('base64');

    console.log(`[${user.index}] 🏦 Deposit: ${amount} ${tokenSymbol.toUpperCase()}`);

    try {
        const account = await server.getAccount(kp.publicKey());
        const contract = new Contract(CONFIG.TREASURY_ID);
        const tx = new TransactionBuilder(account, { fee: CONFIG.BASE_FEE, networkPassphrase: CONFIG.NETWORK_PASSPHRASE })
            .addOperation(contract.call('deposit', 
                nativeToScVal(kp.publicKey(), { type: 'address' }),
                nativeToScVal(hashLN, { type: 'string' }),
                nativeToScVal(BigInt(Math.floor(amount * 1e7)), { type: 'i128' }),
                nativeToScVal(tokenContractId, { type: 'address' })
            )).setTimeout(30).build();

        const simRes = await server.simulateTransaction(tx);
        if (rpc.Api.isSimulationError(simRes)) throw new Error(`Sim error`);
        const preparedTx = rpc.assembleTransaction(tx, simRes).build();
        preparedTx.sign(kp);
        const sendRes = await server.sendTransaction(preparedTx);
        
        if (sendRes.status === 'ERROR') throw new Error(`Tx Error`);

        // Wait for confirmation logic omitted for brevity, assuming success if no error thrown immediately or waiting a bit
        await sleep(2000);

        await axios.post(`${CONFIG.BACKEND_URL}/api/treasury/deposit/notify`, {
            depositorHash: sha256(kp.publicKey()), hashLN, depositorPublicKey: kp.publicKey(),
            amount: Number(amount), expectedIdentity, txHash: sendRes.hash, token: tokenSymbol,
            assetContractId: tokenContractId, tokenPriceUsd: isUsdc ? 1.0 : 0.12,
            depositValueUsd: Number(amount) * (isUsdc ? 1.0 : 0.12)
        });
        await trackAnalytics({ action: 'deposit', amount: Number(amount), token: tokenSymbol.toUpperCase(), tx_hash: sendRes.hash, contract_address: CONFIG.TREASURY_ID, wallet_address: kp.publicKey() });
        return true;
    } catch (e) {
        console.error(`[${user.index}] ❌ Deposit Failed: ${e.message}`);
        return false;
    }
}

async function performWithdraw(user, visitedDeposits = new Set()) {
    const kp = Keypair.fromSecret(user.secret_key);
    try {
        const depositorHash = sha256(kp.publicKey());
        const res = await axios.get(`${CONFIG.BACKEND_URL}/api/treasury/deposits?depositorHash=${depositorHash}`).catch(() => ({ data: { deposits: [] } }));
        const deposits = (res.data.deposits || [])
            .filter(d => d.status?.toLowerCase() === 'confirmed' && !visitedDeposits.has(d.hashLN));

        if (deposits.length === 0) {
            console.log(`[${user.index}] No deposits (or all used). Doing Deposit -> Wait 5m -> Withdraw.`);
            if (await performDeposit(user)) {
                console.log(`[${user.index}] Deposit made. Waiting 5 minutes for settlement...`);
                await sleep(5 * 60 * 1000); // Wait 5 minutes
                return performWithdraw(user, visitedDeposits);
            }
            return false;
        }

        const deposit = deposits[Math.floor(Math.random() * deposits.length)];
        visitedDeposits.add(deposit.hashLN);

        const maxWithdraw = parseFloat(deposit.currentBalance || deposit.amount);
        const token = deposit.token || 'usdc';

        if (maxWithdraw < 1) return false; // Dust

        // Select Recipients from CSV
        // Randomly pick 1 to 5 recipients
        const numRecipients = Math.floor(Math.random() * 5) + 1;
        const selectedRecipients = [];
        const shuffled = fixedRecipients.sort(() => 0.5 - Math.random());
        for (let i = 0; i < numRecipients; i++) selectedRecipients.push(shuffled[i]);

        // Distribute Amount
        // Withdraw random % of available
        const withdrawAmount = maxWithdraw * (0.5 + Math.random() * 0.4); // 50-90%
        const share = withdrawAmount / numRecipients;

        const recipientsMap = {};
        selectedRecipients.forEach(r => recipientsMap[r.address] = share.toFixed(2));
        const finalTotal = Object.values(recipientsMap).reduce((a,b) => a + parseFloat(b), 0);

        console.log(`[${user.index}] 🕵️ Withdraw: ${finalTotal.toFixed(2)} ${token.toUpperCase()} to ${numRecipients} CSV recipients.`);

        const encryptedD = await encryptForDistributor(recipientsMap);
        const payload = encryptForRelayer(deposit.hashLN, finalTotal, encryptedD, kp.rawPublicKey(), token);
        const wRes = await axios.post(`${CONFIG.RELAYER_URL}/withdraw`, { payload });
        
        const reqId = wRes.data.requestId || wRes.data.jobId || wRes.data.withdrawalRequestId || wRes.data._id;
        console.log(`[${user.index}] 🚀 Withdraw Submitted: ${reqId}`);
        await trackAnalytics({ action: 'withdrawal_request', amount: finalTotal, token: token.toUpperCase(), count: numRecipients, wallet_address: kp.publicKey() });
        return true;
    } catch (e) {
        console.error(`[${user.index}] ❌ Withdraw Failed: ${e.message}`);
        return false;
    }
}

async function performBatchPay(user) {
    const kp = Keypair.fromSecret(user.secret_key);
    
    let recipientAddresses = [];
    let amounts = [];
    let numRecipients = 0;

    // 80% chance to use Fixed CSV recipients
    if (Math.random() < 0.8) {
        const maxRecipients = Math.min(20, fixedRecipients.length); // Limit batch size
        numRecipients = Math.floor(Math.random() * maxRecipients) + 1;
        const shuffled = fixedRecipients.sort(() => 0.5 - Math.random()).slice(0, numRecipients);

        recipientAddresses = shuffled.map(r => r.address);
        amounts = shuffled.map(r => BigInt(Math.floor(r.amount * 1e7))); // Use CSV amount directly
        console.log(`[${user.index}] ⚡ Batch Pay (CSV): ${numRecipients} recipients.`);
    } else {
        // 20% Random from accounts.json (10-69 recipients, 1-20 XLM)
        numRecipients = Math.floor(Math.random() * (69 - 10 + 1)) + 10;
        const shuffled = accounts.sort(() => 0.5 - Math.random()).slice(0, numRecipients);
        
        recipientAddresses = shuffled.map(a => a.public_key);
        amounts = recipientAddresses.map(() => {
            const val = weightedRandomAmount(1, 20, 1);
            return BigInt(Math.floor(val * 1e7));
        });
        console.log(`[${user.index}] ⚡ Batch Pay (Random Accounts): ${numRecipients} recipients.`);
    }

    try {
        console.log(`[${user.index}]    Building Batch Transaction...`);
        
        // Chunking Logic (Max 19 per batch to match Client SAFE_LIMITS)
        const MAX_PER_BATCH = 19;
        const batches = [];
        for (let i = 0; i < recipientAddresses.length; i += MAX_PER_BATCH) {
            batches.push({
                recipients: recipientAddresses.slice(i, i + MAX_PER_BATCH),
                amounts: amounts.slice(i, i + MAX_PER_BATCH)
            });
        }

        console.log(`[${user.index}]    Split ${recipientAddresses.length} recipients into ${batches.length} batches.`);

        const batchMapEntries = [];
        const batchSubInvocations = [];

        for (const batch of batches) {
            const workerContract = CONFIG.WORKER_CONTRACTS[Math.floor(Math.random() * CONFIG.WORKER_CONTRACTS.length)];
            
            // Level 3: Transfer Invocations
            const transferInvocations = batch.recipients.map((r, i) => {
                return new xdr.SorobanAuthorizedInvocation({
                    function: xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(
                        new xdr.InvokeContractArgs({
                            contractAddress: new Address(CONFIG.XLM_SAC).toScAddress(),
                            functionName: 'transfer',
                            args: [
                                new Address(kp.publicKey()).toScVal(),
                                new Address(r).toScVal(),
                                nativeToScVal(batch.amounts[i], { type: 'i128' }),
                            ],
                        })
                    ),
                    subInvocations: [],
                });
            });

            // Level 2: Worker Invocation
            const workerInvocation = new xdr.SorobanAuthorizedInvocation({
                function: xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(
                    new xdr.InvokeContractArgs({
                        contractAddress: new Address(workerContract).toScAddress(),
                        functionName: 'batch_pay',
                        args: [
                            new Address(kp.publicKey()).toScVal(),
                            xdr.ScVal.scvVec(batch.recipients.map(r => new Address(r).toScVal())),
                            xdr.ScVal.scvVec(batch.amounts.map(a => nativeToScVal(a, { type: 'i128' }))),
                            new Address(CONFIG.XLM_SAC).toScVal(),
                        ],
                    })
                ),
                subInvocations: transferInvocations,
            });
            batchSubInvocations.push(workerInvocation);

            // Batch Map Entry for Orchestrator Args
            const batchEntry = xdr.ScVal.scvMap([
                new xdr.ScMapEntry({ key: xdr.ScVal.scvSymbol('amounts'), val: xdr.ScVal.scvVec(batch.amounts.map(a => nativeToScVal(a, { type: 'i128' }))) }),
                new xdr.ScMapEntry({ key: xdr.ScVal.scvSymbol('recipients'), val: xdr.ScVal.scvVec(batch.recipients.map(r => new Address(r).toScVal())) }),
                new xdr.ScMapEntry({ key: xdr.ScVal.scvSymbol('worker_contract'), val: new Address(workerContract).toScVal() }),
            ]);
            batchMapEntries.push(batchEntry);
        }

        // Level 1: Root Invocation
        const rootInvocation = new xdr.SorobanAuthorizedInvocation({
            function: xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(
                new xdr.InvokeContractArgs({
                    contractAddress: new Address(CONFIG.ORCHESTRATOR_ID).toScAddress(),
                    functionName: 'orchestrate_payments',
                    args: [
                        new Address(kp.publicKey()).toScVal(),
                        xdr.ScVal.scvVec(batchMapEntries), // Pass all batch maps
                        new Address(CONFIG.XLM_SAC).toScVal(),
                    ],
                })
            ),
            subInvocations: batchSubInvocations, // Include all worker invocations
        });

        // Sign & Submit
        const latestLedger = await server.getLatestLedger();
        const expiration = latestLedger.sequence + 100;
        const nonce = BigInt(latestLedger.sequence);
        const networkId = hash(Buffer.from(CONFIG.NETWORK_PASSPHRASE));
        
        const preimage = new xdr.HashIdPreimageSorobanAuthorization({
            networkId, nonce: xdr.Int64.fromString(nonce.toString()), signatureExpirationLedger: expiration, invocation: rootInvocation
        });
        const signature = kp.sign(hash(xdr.HashIdPreimage.envelopeTypeSorobanAuthorization(preimage).toXDR()));
        
        const authEntry = new xdr.SorobanAuthorizationEntry({
            credentials: xdr.SorobanCredentials.sorobanCredentialsAddress(new xdr.SorobanAddressCredentials({
                address: new Address(kp.publicKey()).toScAddress(), nonce: xdr.Int64.fromString(nonce.toString()), signatureExpirationLedger: expiration,
                signature: xdr.ScVal.scvVec([xdr.ScVal.scvMap([
                    new xdr.ScMapEntry({ key: xdr.ScVal.scvSymbol('public_key'), val: xdr.ScVal.scvBytes(kp.rawPublicKey()) }),
                    new xdr.ScMapEntry({ key: xdr.ScVal.scvSymbol('signature'), val: xdr.ScVal.scvBytes(signature) })
                ])])
            })), rootInvocation
        });

        // Use USER account for submission
        console.log(`[${user.index}]    Loading user account sequence...`);
        const userAccountLive = await server.getAccount(kp.publicKey());
        const tx = new TransactionBuilder(userAccountLive, { fee: (2000 + numRecipients*100).toString(), networkPassphrase: CONFIG.NETWORK_PASSPHRASE })
            .addOperation(Operation.invokeHostFunction({ func: xdr.HostFunction.hostFunctionTypeInvokeContract(rootInvocation.function().contractFn()), auth: [authEntry] }))
            .setTimeout(60).build();

        console.log(`[${user.index}]    Simulating transaction...`);
        const simRes = await server.simulateTransaction(tx);
        if (rpc.Api.isSimulationError(simRes)) throw new Error(`Batch Sim failed: ${JSON.stringify(simRes)}`);
        
        const preparedTx = rpc.assembleTransaction(tx, simRes).build();
        preparedTx.sign(kp); // User pays fees and signs
        
        console.log(`[${user.index}]    Submitting transaction...`);
        const sendRes = await server.sendTransaction(preparedTx);

        if (sendRes.status === 'ERROR') throw new Error('Tx Error');
        console.log(`[${user.index}] 🚀 Batch Done: ${sendRes.hash}`);
        await trackAnalytics({ action: 'batch_execution', amount: numRecipients, token: 'XLM', count: numRecipients, wallet_address: kp.publicKey(), tx_hash: sendRes.hash, contract_address: CONFIG.ORCHESTRATOR_ID });
        return true;
    } catch (e) {
        console.error(`[${user.index}] ❌ Batch Failed: ${e.message}`);
        return false;
    }
}

// --- SIMULATION CONTROLLER ---

class TrafficController {
    constructor() {
        this.totalVisitorsToday = 0;
        this.activeSessions = 0;
        this.activeAgents = new Set(); // Track busy agents
    }

    async start() {
        console.log("🚦 STARTING TRAFFIC CONTROLLER (REAL USER MODE)");
        console.log("   - Robust concurrency enabled");
        console.log("   - Active Agent Tracking enabled");
        
        // Spawn one immediately to verify logic
        this.spawnUser();

        // Main Loop
        while (true) {
            // Real Mode: 10 to 90 minutes wait
            const nextWait = weightedRandomAmount(10 * 60 * 1000, 1.5 * 60 * 60 * 1000, 1);
            console.log(`[Traffic] ⏳ Waiting ${(nextWait/1000/60).toFixed(2)} minutes for next visitor...`);
            await sleep(nextWait);

            // Determine Event Type
            const isBurst = Math.random() < 0.3; // 30% chance of burst
            
            if (isBurst) {
                const burstSize = Math.floor(Math.random() * 2) + 4; // 4-5 users
                console.log(`[Traffic] 🔥 BURST! Spawning ${burstSize} users.`);
                this.spawnBurst(burstSize);
            } else {
                console.log(`[Traffic] 👤 Single visitor entering.`);
                this.spawnUser();
            }
        }
    }

    spawnUser() {
        // Pick an inactive agent
        const available = accounts.filter(a => !this.activeAgents.has(a.public_key));
        if (available.length === 0) {
            console.log("[Traffic] ⚠️ All agents busy. Skipping spawn.");
            return;
        }

        const agent = available[Math.floor(Math.random() * available.length)];
        this.activeAgents.add(agent.public_key);
        
        // Run session (non-blocking) and clean up when done
        this.runUserSession(agent).finally(() => {
            this.activeAgents.delete(agent.public_key);
            console.log(`[Traffic] Agent ${agent.index} session cleanup complete.`);
        });
        return;
    }

    spawnBurst(count) {
        console.log(`[Traffic] Preparing burst of ${count} users...`);
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.spawnUser();
            }, Math.random() * 10000); // Stagger entries by 0-10s
        }
        return;
    }

    async runUserSession(agent) {
        const sessionId = Math.random().toString(36).substring(7);
        console.log(`[Session ${sessionId}] Agent ${agent.index} started session. (Active Agents: ${this.activeAgents.size})`);
        
        // 1. Check Funds
        await checkAndRefill(agent);

        // 2. Determine Duration (5-10 mins)
        const duration = weightedRandomAmount(5 * 60 * 1000, 10 * 60 * 1000, 1);
        const endTime = Date.now() + duration;

        // 3. Determine Actions (2-3 actions)
        const actionCount = Math.floor(Math.random() * 2) + 1;
        const visitedDeposits = new Set();
        
        for (let i = 0; i < actionCount; i++) {
            if (Date.now() > endTime) break;

            // Pick Action
            const rand = Math.random();
            if (rand < 0.4) await performDeposit(agent);
            else if (rand < 0.7) await performWithdraw(agent, visitedDeposits);
            else await performBatchPay(agent);

            await sleep(60 * 1000);
            
            await performWithdraw(agent, visitedDeposits);

            await sleep(60 * 1000);
            
            await performBatchPay(agent);

            // Wait between actions (random slice of remaining time)
            const remaining = Math.max(0, endTime - Date.now());
            if (remaining > 5000) {
                const wait = Math.random() * (remaining / 2);
                console.log(`[Session ${sessionId}] Agent ${agent.index} sleeping for ${(wait/1000).toFixed(1)}s before next action...`);
                await sleep(wait);
            }
        }

        console.log(`[Session ${sessionId}] Agent ${agent.index} ending session. Goodbye!`);
    }
}

// Start
const controller = new TrafficController();
controller.start();