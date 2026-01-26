module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[next]/internal/font/google/lexend_tera_c343b42e.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "lexend_tera_c343b42e-module__33zOOW__className",
  "variable": "lexend_tera_c343b42e-module__33zOOW__variable",
});
}),
"[next]/internal/font/google/lexend_tera_c343b42e.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/lexend_tera_c343b42e.module.css [app-ssr] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Lexend Tera', 'Lexend Tera Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[project]/app/components/Fonts.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/lexend_tera_c343b42e.js [app-ssr] (ecmascript)");
;
;
}),
"[next]/internal/font/google/lexend_tera_c343b42e.js [app-ssr] (ecmascript) <export default as lexendTera>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "lexendTera",
    ()=>__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/lexend_tera_c343b42e.js [app-ssr] (ecmascript)");
}),
"[project]/app/services/bulkPaymentService.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BulkPaymentService",
    ()=>BulkPaymentService,
    "SAFE_LIMITS",
    ()=>SAFE_LIMITS,
    "bulkPaymentService",
    ()=>bulkPaymentService
]);
(()=>{
    const e = new Error("Cannot find module '@stellar/stellar-sdk'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
// ==================== CONFIGURATION ====================
const CONFIG = {
    TESTNET: {
        RPC_URL: 'https://soroban-testnet.stellar.org',
        HORIZON_URL: 'https://horizon-testnet.stellar.org',
        NETWORK_PASSPHRASE: Networks.TESTNET,
        ORCHESTRATOR_CONTRACT: 'CBYD7XCJH6RCA27AXXJDO3ARZHQJIW5BYEHAUKJ7QS6NQMLIQ2KMJ3K2',
        XLM_SAC: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC'
    },
    MAINNET: {
        RPC_URL: 'https://soroban-rpc.stellar.org',
        HORIZON_URL: 'https://horizon.stellar.org',
        NETWORK_PASSPHRASE: Networks.PUBLIC,
        ORCHESTRATOR_CONTRACT: '',
        XLM_SAC: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA'
    }
};
// Worker contracts for batch processing (20 available)
const WORKER_CONTRACTS = {
    worker1: 'CA46744JXE6PUFP2E4G26QKBG3DTA3RIGGWGTP2QIEKZ6U3CQ3LKM7SH',
    worker2: 'CAWHF5NQMVED6ANSUMG3OXEMWQHOX2K53VSOK5FO3MMMG7Y5YMFMZABZ',
    worker3: 'CC6VG5BLTU4SIZQAFOQZOIOEKLQAR2NYTMPOLZVULK7ZHYUTE7YKORPJ',
    worker4: 'CCOV6M4AEP7TGZ3NIMFGUXMWO3TXSWHSHDGGMIYNN7QM2COM7ITEJBMU',
    worker5: 'CDWIM6L5FKT3PQ7PCM5UFUIWPS22YVQWUMIMPKLPKBVFUKD5JJUQNH27',
    worker6: 'CD236CW2YLUXXWK4WT6BRDKMDDCKZKPU5RJRSVL64H6XZLXEU3UZ73GF',
    worker7: 'CB7O7WGBXMVGES75LSLVC277YIHVHGO75RN7YJELE7IQ2664TMZ4OLG6',
    worker8: 'CBAUCRBOPXN33TIUIMBCQ2BPWPA446IWMK32KYO43RGOLG3KPBE3L5J2',
    worker9: 'CCM6WJHG6CDN7YCR4BVSFKJVQEOW5BA6IHH6RSXX5QRPLNS7E4UL4SLN',
    worker10: 'CBHRLC3IY6OIOGTU4E737IKPWV46N43NLTJX2ZIYGK7ZI6B4TRL7HIIC',
    worker11: 'CC6N434Q5GH4TIN4NVXK7FWZHLEAAC3MIZATRHT3YK2VEAVK3GKW62CE',
    worker12: 'CBGMTVKUULAVZ3UJQMJ74SISODP5FV5W2UGSWXHYGXUAYGLMXTM3QKHH',
    worker13: 'CBCWTKVJEVDNYLMK7PD5VU67IX46BPCSOH75EINCF4MIYJW7HUF2O7P6',
    worker14: 'CCNZ753NQBP67AZSYCQNLCVW56ZAY36AQMTNOBI2WKLP4GNR5ARBRIES',
    worker15: 'CAEPOYMB33T6MQXNA2C5HLXNCKHLC5RCMF7EFCMPB3M2764RRUACC2E6',
    worker16: 'CCJYOSKABCA4XDATIPB4BJI63GQ25AMGXFQSY6KSZ3AMCWAD6OF4L3RW',
    worker17: 'CBEJCOJBK5QWHSOPLZY6OGY2446JXC5UJG2565NAQNP2BBY3WSRWZD57',
    worker18: 'CB2TXKCIFCITSG4QICQAWJ4GPVJ6YBVBKBPTEAA5IDHL2QKHZ7FCLGNK',
    worker19: 'CCTMP2VNVVSABI7J2L442KTBLRHYAMVIB632UTBZYZDMV3RIGU4OUBBY',
    worker20: 'CBFYQMR7BY7CANCIWJEAL7LYVURWUIKZZZFM3FR2B765HZKTGYLEYLWW'
};
const SAFE_LIMITS = {
    MAX_RECIPIENTS_PER_BATCH: 19,
    MAX_TOTAL_RECIPIENTS: 80,
    MAX_BATCHES: 5,
    FEE_BUFFER_MULTIPLIER: 2.0,
    STROOPS_PER_XLM: 10_000_000n
};
class BulkPaymentService {
    server;
    networkPassphrase;
    orchestratorContract;
    xlmSac;
    workerContracts;
    constructor(network = 'testnet'){
        const config = network === 'mainnet' ? CONFIG.MAINNET : CONFIG.TESTNET;
        this.server = new SorobanRpc.Server(config.RPC_URL, {
            allowHttp: true
        });
        this.networkPassphrase = config.NETWORK_PASSPHRASE;
        this.orchestratorContract = config.ORCHESTRATOR_CONTRACT;
        this.xlmSac = config.XLM_SAC;
        this.workerContracts = Object.values(WORKER_CONTRACTS);
    }
    // ==================== PUBLIC METHODS ====================
    /**
     * Validates and creates batches from a list of recipients
     * Returns error if validation fails
     */ validateAndCreateBatches(recipients) {
        // Validate recipient count
        if (recipients.length === 0) {
            return {
                error: 'No recipients provided'
            };
        }
        if (recipients.length > SAFE_LIMITS.MAX_TOTAL_RECIPIENTS) {
            return {
                error: `Maximum ${SAFE_LIMITS.MAX_TOTAL_RECIPIENTS} recipients per transaction. You provided ${recipients.length}.`
            };
        }
        // Validate addresses and amounts
        for(let i = 0; i < recipients.length; i++){
            const r = recipients[i];
            // Validate address format (basic check)
            if (!r.address || r.address.length !== 56 || !r.address.startsWith('G')) {
                return {
                    error: `Invalid Stellar address at row ${i + 1}: ${r.address}`
                };
            }
            // Validate amount
            if (r.amount <= 0n) {
                return {
                    error: `Amount must be positive at row ${i + 1}`
                };
            }
        }
        // Create batches
        const batches = [];
        const recipientsPerBatch = [];
        for(let i = 0; i < recipients.length; i += SAFE_LIMITS.MAX_RECIPIENTS_PER_BATCH){
            const batchRecipients = recipients.slice(i, i + SAFE_LIMITS.MAX_RECIPIENTS_PER_BATCH);
            const workerIndex = batches.length % this.workerContracts.length;
            batches.push({
                workerContractId: this.workerContracts[workerIndex],
                recipients: batchRecipients.map((r)=>r.address),
                amounts: batchRecipients.map((r)=>r.amount)
            });
            recipientsPerBatch.push(batchRecipients.length);
        }
        const totalAmount = recipients.reduce((sum, r)=>sum + r.amount, 0n);
        return {
            batches,
            stats: {
                totalRecipients: recipients.length,
                totalAmount,
                batchCount: batches.length,
                recipientsPerBatch
            }
        };
    }
    /**
     * Builds the 3-level authorization tree for orchestrated payments
     * This is the key function that enables SINGLE SIGNATURE for all batches
     */ async buildAuthTree(userPublicKey, batches) {
        // Get current ledger for nonce and expiration
        const ledgerResponse = await this.server.getLatestLedger();
        const currentLedger = ledgerResponse.sequence;
        const expirationLedger = currentLedger + 1000; // ~83 minutes validity
        const nonce = BigInt(currentLedger);
        // Build Level 3: Token transfer sub-invocations for each batch
        const batchSubInvocations = batches.map((batch)=>{
            // Build transfer invocations (Level 3)
            const transferInvocations = batch.recipients.map((recipient, i)=>{
                return new xdr.SorobanAuthorizedInvocation({
                    function: xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(new xdr.InvokeContractArgs({
                        contractAddress: new Address(this.xlmSac).toScAddress(),
                        functionName: 'transfer',
                        args: [
                            new Address(userPublicKey).toScVal(),
                            new Address(recipient).toScVal(),
                            nativeToScVal(batch.amounts[i], {
                                type: 'i128'
                            })
                        ]
                    })),
                    subInvocations: []
                });
            });
            // Build Level 2: Worker batch_pay invocation
            return new xdr.SorobanAuthorizedInvocation({
                function: xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(new xdr.InvokeContractArgs({
                    contractAddress: new Address(batch.workerContractId).toScAddress(),
                    functionName: 'batch_pay',
                    args: [
                        new Address(userPublicKey).toScVal(),
                        xdr.ScVal.scvVec(batch.recipients.map((r)=>new Address(r).toScVal())),
                        xdr.ScVal.scvVec(batch.amounts.map((a)=>nativeToScVal(a, {
                                type: 'i128'
                            }))),
                        new Address(this.xlmSac).toScVal()
                    ]
                })),
                subInvocations: transferInvocations
            });
        });
        // Build Level 1: Orchestrator root invocation
        // Convert batches to BatchConfig ScVal format
        const batchesScVal = xdr.ScVal.scvVec(batches.map((batch)=>xdr.ScVal.scvMap([
                new xdr.ScMapEntry({
                    key: xdr.ScVal.scvSymbol('worker_contract'),
                    val: new Address(batch.workerContractId).toScVal()
                }),
                new xdr.ScMapEntry({
                    key: xdr.ScVal.scvSymbol('recipients'),
                    val: xdr.ScVal.scvVec(batch.recipients.map((r)=>new Address(r).toScVal()))
                }),
                new xdr.ScMapEntry({
                    key: xdr.ScVal.scvSymbol('amounts'),
                    val: xdr.ScVal.scvVec(batch.amounts.map((a)=>nativeToScVal(a, {
                            type: 'i128'
                        })))
                })
            ])));
        const rootInvocation = new xdr.SorobanAuthorizedInvocation({
            function: xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(new xdr.InvokeContractArgs({
                contractAddress: new Address(this.orchestratorContract).toScAddress(),
                functionName: 'orchestrate_payments',
                args: [
                    new Address(userPublicKey).toScVal(),
                    batchesScVal,
                    new Address(this.xlmSac).toScVal()
                ]
            })),
            subInvocations: batchSubInvocations
        });
        // Build the authorization entry with credentials placeholder
        const authEntry = new xdr.SorobanAuthorizationEntry({
            credentials: xdr.SorobanCredentials.sorobanCredentialsAddress(new xdr.SorobanAddressCredentials({
                address: new Address(userPublicKey).toScAddress(),
                nonce: xdr.Int64.fromString(nonce.toString()),
                signatureExpirationLedger: expirationLedger,
                signature: xdr.ScVal.scvVoid()
            })),
            rootInvocation: rootInvocation
        });
        // Compute the hash payload that needs to be signed
        const networkId = hash(Buffer.from(this.networkPassphrase));
        const hashIdPreimage = xdr.HashIdPreimage.envelopeTypeSorobanAuthorization(new xdr.HashIdPreimageSorobanAuthorization({
            networkId: networkId,
            nonce: xdr.Int64.fromString(nonce.toString()),
            signatureExpirationLedger: expirationLedger,
            invocation: rootInvocation
        }));
        const authPayload = hash(hashIdPreimage.toXDR());
        return {
            authEntry,
            authPayload,
            expirationLedger,
            nonce
        };
    }
    /**
     * Signs the authorization entry with the wallet's signing function
     * Returns the signed auth entry ready for transaction submission
     */ async signAuthEntry(authEntry, userPublicKey, signFunction, authPayload) {
        // Get the signature from the wallet
        const signature = await signFunction(authPayload);
        // Build the signature ScVal
        const signatureScVal = xdr.ScVal.scvMap([
            new xdr.ScMapEntry({
                key: xdr.ScVal.scvSymbol('public_key'),
                val: xdr.ScVal.scvBytes(Keypair.fromPublicKey(userPublicKey).rawPublicKey())
            }),
            new xdr.ScMapEntry({
                key: xdr.ScVal.scvSymbol('signature'),
                val: xdr.ScVal.scvBytes(signature)
            })
        ]);
        // Create new credentials with the signature
        const credentials = authEntry.credentials();
        const addressCreds = credentials.address();
        const signedCredentials = xdr.SorobanCredentials.sorobanCredentialsAddress(new xdr.SorobanAddressCredentials({
            address: addressCreds.address(),
            nonce: addressCreds.nonce(),
            signatureExpirationLedger: addressCreds.signatureExpirationLedger(),
            signature: signatureScVal
        }));
        return new xdr.SorobanAuthorizationEntry({
            credentials: signedCredentials,
            rootInvocation: authEntry.rootInvocation()
        });
    }
    /**
     * Submits the signed authorization entry as a transaction
     * Returns the transaction result
     */ async submitTransaction(signedAuthEntry, serviceSecretKey) {
        const serviceKeypair = Keypair.fromSecret(serviceSecretKey);
        const serviceAddress = serviceKeypair.publicKey();
        // Load service account
        let serviceAccount;
        try {
            serviceAccount = await this.server.getAccount(serviceAddress);
        } catch (e) {
            return {
                success: false,
                error: `Failed to load service account: ${serviceAddress}. Ensure it is funded.`
            };
        }
        // Extract the invoke contract args from the auth entry
        const rootInvocation = signedAuthEntry.rootInvocation();
        const invokeContractArgs = rootInvocation.function().contractFn();
        // Create the host function
        const hostFunction = xdr.HostFunction.hostFunctionTypeInvokeContract(invokeContractArgs);
        // Create the invoke operation
        const invokeOp = Operation.invokeHostFunction({
            func: hostFunction,
            auth: [
                signedAuthEntry
            ]
        });
        // Build transaction for simulation
        const simTx = new TransactionBuilder(serviceAccount, {
            fee: '100',
            networkPassphrase: this.networkPassphrase
        }).addOperation(invokeOp).setTimeout(60).build();
        // Simulate
        const simResponse = await this.server.simulateTransaction(simTx);
        if (SorobanRpc.Api.isSimulationError(simResponse)) {
            return {
                success: false,
                error: `Simulation failed: ${simResponse.error}`
            };
        }
        // Build final transaction with resource data
        const sorobanData = simResponse.transactionData?.build();
        const feeWithBuffer = Math.ceil(parseInt(simResponse.minResourceFee || '0') * SAFE_LIMITS.FEE_BUFFER_MULTIPLIER);
        // Reload account for correct sequence number
        serviceAccount = await this.server.getAccount(serviceAddress);
        const finalTx = new TransactionBuilder(serviceAccount, {
            fee: feeWithBuffer.toString(),
            networkPassphrase: this.networkPassphrase
        }).setSorobanData(sorobanData).addOperation(invokeOp).setTimeout(90).build();
        // Sign with service key (pays fees)
        finalTx.sign(serviceKeypair);
        // Submit
        const sendResponse = await this.server.sendTransaction(finalTx);
        if (sendResponse.status !== 'PENDING') {
            return {
                success: false,
                error: `Transaction submission failed. Status: ${sendResponse.status}`
            };
        }
        // Wait for confirmation
        let txStatus = await this.server.getTransaction(sendResponse.hash);
        let attempts = 0;
        const maxAttempts = 30;
        while(txStatus.status === 'NOT_FOUND' && attempts < maxAttempts){
            await new Promise((resolve)=>setTimeout(resolve, 1000));
            txStatus = await this.server.getTransaction(sendResponse.hash);
            attempts++;
        }
        if (txStatus.status === 'SUCCESS') {
            return {
                success: true,
                hash: sendResponse.hash,
                ledger: txStatus.ledger
            };
        }
        return {
            success: false,
            error: `Transaction failed with status: ${txStatus.status}`,
            hash: sendResponse.hash
        };
    }
    // ==================== UTILITY METHODS ====================
    /**
     * Converts XLM to stroops
     */ static xlmToStroops(xlm) {
        const xlmNum = typeof xlm === 'string' ? parseFloat(xlm) : xlm;
        return BigInt(Math.floor(xlmNum * Number(SAFE_LIMITS.STROOPS_PER_XLM)));
    }
    /**
     * Converts stroops to XLM
     */ static stroopsToXlm(stroops) {
        return (Number(stroops) / Number(SAFE_LIMITS.STROOPS_PER_XLM)).toFixed(7);
    }
    /**
     * Parses CSV content into payment recipients
     * Expected format: address,amount (amount in XLM)
     */ static parseCSV(csvContent) {
        const lines = csvContent.trim().split('\n');
        const recipients = [];
        const warnings = [];
        // Skip header if present
        let startLine = 0;
        const firstLine = lines[0].toLowerCase();
        if (firstLine.includes('address') || firstLine.includes('recipient') || firstLine.includes('amount')) {
            startLine = 1;
        }
        for(let i = startLine; i < lines.length; i++){
            const line = lines[i].trim();
            if (!line) continue;
            const parts = line.split(',').map((p)=>p.trim());
            if (parts.length < 2) {
                return {
                    error: `Invalid format at line ${i + 1}: expected "address,amount"`
                };
            }
            const address = parts[0];
            const amountStr = parts[1];
            // Parse amount (assuming XLM)
            const amount = parseFloat(amountStr);
            if (isNaN(amount) || amount <= 0) {
                return {
                    error: `Invalid amount at line ${i + 1}: ${amountStr}`
                };
            }
            // Warn about very small amounts
            if (amount < 0.0000001) {
                warnings.push(`Very small amount at line ${i + 1}: ${amountStr} XLM`);
            }
            recipients.push({
                address,
                amount: BulkPaymentService.xlmToStroops(amount)
            });
        }
        if (recipients.length === 0) {
            return {
                error: 'No valid recipients found in CSV'
            };
        }
        return {
            recipients,
            warnings
        };
    }
    /**
     * Gets the orchestrator contract address
     */ getOrchestratorContract() {
        return this.orchestratorContract;
    }
    /**
     * Gets the XLM SAC address
     */ getXlmSac() {
        return this.xlmSac;
    }
    /**
     * Gets the RPC server instance
     */ getServer() {
        return this.server;
    }
}
const bulkPaymentService = new BulkPaymentService('testnet');
}),
"[project]/app/components/batch-payments/RecipientsInput.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RecipientsInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$bulkPaymentService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/bulkPaymentService.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function RecipientsInput({ recipients, onRecipientsChange, disabled = false }) {
    const [dragActive, setDragActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [inputMode, setInputMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('manual');
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Generate unique ID
    const generateId = ()=>`${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    // Validate a single recipient
    const validateRecipient = (address, amount)=>{
        if (!address.trim()) {
            return {
                isValid: false,
                error: 'Address required'
            };
        }
        if (address.length !== 56 || !address.startsWith('G')) {
            return {
                isValid: false,
                error: 'Invalid Stellar address'
            };
        }
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            return {
                isValid: false,
                error: 'Invalid amount'
            };
        }
        return {
            isValid: true
        };
    };
    // Add empty recipient row
    const addRecipient = ()=>{
        if (recipients.length >= __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$bulkPaymentService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SAFE_LIMITS"].MAX_TOTAL_RECIPIENTS) return;
        const newRecipient = {
            id: generateId(),
            address: '',
            amount: '',
            isValid: false
        };
        onRecipientsChange([
            ...recipients,
            newRecipient
        ]);
    };
    // Update recipient
    const updateRecipient = (id, field, value)=>{
        const updated = recipients.map((r)=>{
            if (r.id !== id) return r;
            const newAddress = field === 'address' ? value : r.address;
            const newAmount = field === 'amount' ? value : r.amount;
            const validation = validateRecipient(newAddress, newAmount);
            return {
                ...r,
                [field]: value,
                isValid: validation.isValid,
                error: validation.error
            };
        });
        onRecipientsChange(updated);
    };
    // Remove recipient
    const removeRecipient = (id)=>{
        if (recipients.length <= 1) return;
        onRecipientsChange(recipients.filter((r)=>r.id !== id));
    };
    // Handle CSV file upload
    const handleFileUpload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((file)=>{
        const reader = new FileReader();
        reader.onload = (e)=>{
            const content = e.target?.result;
            const lines = content.trim().split('\n');
            // Skip header if present
            let startLine = 0;
            const firstLine = lines[0].toLowerCase();
            if (firstLine.includes('address') || firstLine.includes('recipient')) {
                startLine = 1;
            }
            const newRecipients = [];
            for(let i = startLine; i < lines.length && newRecipients.length < __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$bulkPaymentService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SAFE_LIMITS"].MAX_TOTAL_RECIPIENTS; i++){
                const line = lines[i].trim();
                if (!line) continue;
                const parts = line.split(',').map((p)=>p.trim());
                if (parts.length >= 2) {
                    const address = parts[0];
                    const amount = parts[1];
                    const validation = validateRecipient(address, amount);
                    newRecipients.push({
                        id: generateId(),
                        address,
                        amount,
                        isValid: validation.isValid,
                        error: validation.error
                    });
                }
            }
            if (newRecipients.length > 0) {
                onRecipientsChange(newRecipients);
                setInputMode('csv');
            }
        };
        reader.readAsText(file);
    }, [
        onRecipientsChange
    ]);
    // Handle drag events
    const handleDrag = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };
    const handleDrop = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };
    // Clear all and reset
    const clearAll = ()=>{
        onRecipientsChange([
            {
                id: generateId(),
                address: '',
                amount: '',
                isValid: false
            }
        ]);
        setInputMode('manual');
    };
    const validCount = recipients.filter((r)=>r.isValid).length;
    const totalAmount = recipients.filter((r)=>r.isValid).reduce((sum, r)=>sum + parseFloat(r.amount), 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex bg-white/5 rounded-lg p-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setInputMode('manual'),
                                    className: `px-3 py-1.5 text-sm rounded-md transition-all ${inputMode === 'manual' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`,
                                    disabled: disabled,
                                    children: "Manual Entry"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                    lineNumber: 180,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>fileInputRef.current?.click(),
                                    className: `px-3 py-1.5 text-sm rounded-md transition-all ${inputMode === 'csv' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`,
                                    disabled: disabled,
                                    children: "Upload CSV"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                    lineNumber: 191,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                            lineNumber: 179,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-white/50",
                        children: [
                            validCount,
                            "/",
                            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$bulkPaymentService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SAFE_LIMITS"].MAX_TOTAL_RECIPIENTS,
                            " recipients"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                        lineNumber: 205,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                lineNumber: 177,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/20 hover:border-white/30'} ${disabled ? 'opacity-50 pointer-events-none' : ''}`,
                onDragEnter: handleDrag,
                onDragLeave: handleDrag,
                onDragOver: handleDrag,
                onDrop: handleDrop,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: fileInputRef,
                        type: "file",
                        accept: ".csv,.txt",
                        onChange: (e)=>e.target.files?.[0] && handleFileUpload(e.target.files[0]),
                        className: "hidden",
                        disabled: disabled
                    }, void 0, false, {
                        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                        lineNumber: 222,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-10 h-10 mx-auto mb-3 text-white/30",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 1.5,
                            d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        }, void 0, false, {
                            fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                            lineNumber: 232,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                        lineNumber: 231,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-white/60 mb-1",
                        children: [
                            "Drag and drop CSV file here, or",
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>fileInputRef.current?.click(),
                                className: "text-blue-400 hover:text-blue-300",
                                disabled: disabled,
                                children: "browse"
                            }, void 0, false, {
                                fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                lineNumber: 236,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                        lineNumber: 234,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-white/40",
                        children: "Format: address,amount (amount in XLM)"
                    }, void 0, false, {
                        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                        lineNumber: 244,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                lineNumber: 211,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-black/20 rounded-xl border border-white/10 overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-[1fr_120px_40px] gap-2 px-4 py-3 bg-white/5 border-b border-white/10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs font-medium text-white/60 uppercase tracking-wider",
                                children: "Recipient Address"
                            }, void 0, false, {
                                fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                lineNumber: 251,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs font-medium text-white/60 uppercase tracking-wider",
                                children: "Amount (XLM)"
                            }, void 0, false, {
                                fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                lineNumber: 254,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                                fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                lineNumber: 257,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                        lineNumber: 250,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-h-[320px] overflow-y-auto",
                        children: recipients.map((recipient, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `grid grid-cols-[1fr_120px_40px] gap-2 px-4 py-2 border-b border-white/5 ${!recipient.isValid && (recipient.address || recipient.amount) ? 'bg-red-500/5' : ''}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: recipient.address,
                                                onChange: (e)=>updateRecipient(recipient.id, 'address', e.target.value),
                                                placeholder: "G...",
                                                className: `w-full bg-transparent border-0 text-sm font-mono text-white placeholder-white/30 focus:outline-none focus:ring-0 ${!recipient.isValid && recipient.address ? 'text-red-400' : ''}`,
                                                disabled: disabled
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                                lineNumber: 273,
                                                columnNumber: 17
                                            }, this),
                                            recipient.error && recipient.address && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute -bottom-4 left-0 text-xs text-red-400",
                                                children: recipient.error
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                                lineNumber: 284,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                        lineNumber: 272,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        step: "0.0000001",
                                        min: "0",
                                        value: recipient.amount,
                                        onChange: (e)=>updateRecipient(recipient.id, 'amount', e.target.value),
                                        placeholder: "0.00",
                                        className: "w-full bg-transparent border-0 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-0",
                                        disabled: disabled
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                        lineNumber: 291,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>removeRecipient(recipient.id),
                                        className: "flex items-center justify-center text-white/30 hover:text-red-400 transition-colors",
                                        disabled: disabled || recipients.length <= 1,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-4 h-4",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M6 18L18 6M6 6l12 12"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                                lineNumber: 309,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                            lineNumber: 308,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                        lineNumber: 303,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, recipient.id, true, {
                                fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                lineNumber: 263,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                        lineNumber: 261,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 py-3 border-t border-white/10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: addRecipient,
                            disabled: disabled || recipients.length >= __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$bulkPaymentService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SAFE_LIMITS"].MAX_TOTAL_RECIPIENTS,
                            className: "flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors disabled:opacity-30",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-4 h-4",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M12 4v16m8-8H4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                        lineNumber: 324,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                    lineNumber: 323,
                                    columnNumber: 13
                                }, this),
                                "Add Recipient"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                            lineNumber: 318,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                        lineNumber: 317,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                lineNumber: 248,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-white/40 mb-1",
                                children: "Valid Recipients"
                            }, void 0, false, {
                                fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                lineNumber: 334,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-lg font-semibold text-white",
                                children: [
                                    validCount,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-white/40",
                                        children: [
                                            "/",
                                            recipients.length
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                        lineNumber: 337,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                lineNumber: 335,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                        lineNumber: 333,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-white/40 mb-1",
                                children: "Total Amount"
                            }, void 0, false, {
                                fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                lineNumber: 341,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-lg font-semibold text-white",
                                children: [
                                    totalAmount.toFixed(2),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-white/40",
                                        children: " XLM"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                        lineNumber: 344,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                lineNumber: 342,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                        lineNumber: 340,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-white/40 mb-1",
                                children: "Batches"
                            }, void 0, false, {
                                fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                lineNumber: 348,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-lg font-semibold text-white",
                                children: Math.ceil(validCount / __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$bulkPaymentService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SAFE_LIMITS"].MAX_RECIPIENTS_PER_BATCH) || 0
                            }, void 0, false, {
                                fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                                lineNumber: 349,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                        lineNumber: 347,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                lineNumber: 332,
                columnNumber: 7
            }, this),
            recipients.length >= __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$bulkPaymentService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SAFE_LIMITS"].MAX_TOTAL_RECIPIENTS - 10 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-4 h-4 text-yellow-400",
                        fill: "currentColor",
                        viewBox: "0 0 20 20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            fillRule: "evenodd",
                            d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
                            clipRule: "evenodd"
                        }, void 0, false, {
                            fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                            lineNumber: 359,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                        lineNumber: 358,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm text-yellow-200",
                        children: [
                            "Approaching limit: Maximum ",
                            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$bulkPaymentService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SAFE_LIMITS"].MAX_TOTAL_RECIPIENTS,
                            " recipients per transaction"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                        lineNumber: 361,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                lineNumber: 357,
                columnNumber: 9
            }, this),
            recipients.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: clearAll,
                disabled: disabled,
                className: "text-sm text-white/40 hover:text-white transition-colors",
                children: "Clear all recipients"
            }, void 0, false, {
                fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
                lineNumber: 369,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/batch-payments/RecipientsInput.tsx",
        lineNumber: 175,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/components/batch-payments/AuthTreeVisualization.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AuthTreeVisualization
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const ANIMATION_DURATION_MS = 15000; // Base animation duration
const MIN_EXTENSION_MS = 3000; // Minimum extra time if success comes early
function AuthTreeVisualization({ batches, isProcessing, isComplete, transactionHash }) {
    const [animationProgress, setAnimationProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [currentPhase, setCurrentPhase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('idle');
    const animationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const startTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const successTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Build the tree structure
    const buildTree = ()=>{
        const workers = batches.map((batch, index)=>{
            const transfers = Array.from({
                length: batch.recipientCount
            }, (_, i)=>({
                    id: `transfer-${index}-${i}`,
                    label: `Transfer ${i + 1}`,
                    type: 'transfer',
                    status: 'pending'
                }));
            return {
                id: `worker-${index}`,
                label: `Worker ${index + 1}`,
                type: 'worker',
                children: transfers,
                status: 'pending'
            };
        });
        return {
            id: 'orchestrator',
            label: 'Orchestrator',
            type: 'orchestrator',
            children: workers,
            status: 'pending'
        };
    };
    const tree = buildTree();
    const totalNodes = 1 + batches.length + batches.reduce((sum, b)=>sum + b.recipientCount, 0);
    // Animation logic
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isProcessing && !startTimeRef.current) {
            startTimeRef.current = Date.now();
            setCurrentPhase('building');
            const animate = ()=>{
                const now = Date.now();
                const elapsed = now - (startTimeRef.current || now);
                let duration = ANIMATION_DURATION_MS;
                // If we got success early, extend the animation gracefully
                if (successTimeRef.current) {
                    const timeAtSuccess = successTimeRef.current - (startTimeRef.current || now);
                    const remainingAtSuccess = 1 - timeAtSuccess / ANIMATION_DURATION_MS;
                    if (remainingAtSuccess > 0.1) {
                        // Extend to finish smoothly
                        duration = timeAtSuccess + MIN_EXTENSION_MS + remainingAtSuccess * MIN_EXTENSION_MS;
                    }
                }
                const progress = Math.min(elapsed / duration, 1);
                setAnimationProgress(progress);
                // Update phases
                if (progress < 0.3) {
                    setCurrentPhase('building');
                } else if (progress < 0.5) {
                    setCurrentPhase('signing');
                } else if (progress < 0.95) {
                    setCurrentPhase('submitting');
                } else {
                    setCurrentPhase('complete');
                }
                if (progress < 1) {
                    animationRef.current = requestAnimationFrame(animate);
                }
            };
            animationRef.current = requestAnimationFrame(animate);
        }
        return ()=>{
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [
        isProcessing
    ]);
    // Handle early success
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isComplete && !successTimeRef.current) {
            successTimeRef.current = Date.now();
        }
    }, [
        isComplete
    ]);
    // Reset on new processing
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isProcessing && !isComplete) {
            startTimeRef.current = null;
            successTimeRef.current = null;
            setAnimationProgress(0);
            setCurrentPhase('idle');
        }
    }, [
        isProcessing,
        isComplete
    ]);
    // Calculate node status based on progress
    const getNodeStatus = (nodeIndex, totalBeforeNode)=>{
        const nodeProgress = totalBeforeNode / totalNodes;
        if (animationProgress >= nodeProgress + 1 / totalNodes) {
            return 'complete';
        } else if (animationProgress >= nodeProgress) {
            return 'active';
        }
        return 'pending';
    };
    const phaseLabels = {
        idle: 'Ready to process',
        building: 'Building Authorization Tree...',
        signing: 'Awaiting Signature...',
        submitting: 'Submitting Transaction...',
        complete: 'Transaction Complete'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold text-white",
                        children: "Authorization Tree"
                    }, void 0, false, {
                        fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            currentPhase !== 'idle' && currentPhase !== 'complete' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-2 h-2 rounded-full bg-blue-500 animate-pulse"
                            }, void 0, false, {
                                fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                                lineNumber: 162,
                                columnNumber: 13
                            }, this),
                            currentPhase === 'complete' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-2 h-2 rounded-full bg-green-500"
                            }, void 0, false, {
                                fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                                lineNumber: 165,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-white/60",
                                children: phaseLabels[currentPhase]
                            }, void 0, false, {
                                fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this),
            currentPhase !== 'idle' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-1 bg-white/10 rounded-full overflow-hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out",
                        style: {
                            width: `${animationProgress * 100}%`
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                        lineNumber: 175,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                    lineNumber: 174,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                lineNumber: 173,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TreeNode, {
                            label: "Orchestrator",
                            sublabel: "orchestrate_payments()",
                            status: getNodeStatus(0, 0),
                            isRoot: true
                        }, void 0, false, {
                            fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                            lineNumber: 187,
                            columnNumber: 11
                        }, this),
                        batches.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative w-full mt-4 mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute left-1/2 transform -translate-x-1/2 w-px h-6 bg-white/20"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                                    lineNumber: 197,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute top-6 left-1/2 transform -translate-x-1/2 w-[80%] h-px bg-white/20"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                                    lineNumber: 198,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                            lineNumber: 196,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap justify-center gap-4 w-full",
                            children: batches.map((batch, workerIndex)=>{
                                const nodesBeforeWorker = 1 + workerIndex * (1 + Math.max(...batches.map((b)=>b.recipientCount)));
                                const workerStatus = getNodeStatus(workerIndex + 1, nodesBeforeWorker / totalNodes);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-px h-4 bg-white/20"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                                            lineNumber: 211,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TreeNode, {
                                            label: `Worker ${workerIndex + 1}`,
                                            sublabel: `batch_pay() - ${batch.recipientCount} transfers`,
                                            status: workerStatus
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                                            lineNumber: 213,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-3 flex flex-wrap justify-center gap-1 max-w-[120px]",
                                            children: Array.from({
                                                length: batch.recipientCount
                                            }, (_, i)=>{
                                                const transferNodeIndex = nodesBeforeWorker + 1 + i;
                                                const transferStatus = getNodeStatus(transferNodeIndex, transferNodeIndex / totalNodes);
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `w-2 h-2 rounded-full transition-all duration-300 ${transferStatus === 'complete' ? 'bg-green-500' : transferStatus === 'active' ? 'bg-blue-500 animate-pulse' : 'bg-white/20'}`,
                                                    title: `Transfer ${i + 1}`
                                                }, i, false, {
                                                    fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                                                    lineNumber: 225,
                                                    columnNumber: 25
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                                            lineNumber: 220,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, workerIndex, true, {
                                    fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                                    lineNumber: 209,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                            lineNumber: 203,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                    lineNumber: 186,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                lineNumber: 184,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-2xl font-semibold text-white",
                                children: batches.length
                            }, void 0, false, {
                                fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                                lineNumber: 249,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-white/40",
                                children: "Batches"
                            }, void 0, false, {
                                fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                                lineNumber: 250,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                        lineNumber: 248,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-2xl font-semibold text-white",
                                children: batches.reduce((sum, b)=>sum + b.recipientCount, 0)
                            }, void 0, false, {
                                fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                                lineNumber: 253,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-white/40",
                                children: "Recipients"
                            }, void 0, false, {
                                fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                                lineNumber: 256,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                        lineNumber: 252,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-2xl font-semibold text-white",
                                children: "1"
                            }, void 0, false, {
                                fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                                lineNumber: 259,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-white/40",
                                children: "Signature"
                            }, void 0, false, {
                                fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                                lineNumber: 260,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                        lineNumber: 258,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                lineNumber: 247,
                columnNumber: 7
            }, this),
            transactionHash && currentPhase === 'complete' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-green-400 mb-1",
                        children: "Transaction Hash"
                    }, void 0, false, {
                        fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                        lineNumber: 267,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-white font-mono truncate",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: `https://stellar.expert/explorer/testnet/tx/${transactionHash}`,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "hover:text-blue-400 transition-colors",
                            children: transactionHash
                        }, void 0, false, {
                            fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                            lineNumber: 269,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                        lineNumber: 268,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                lineNumber: 266,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
        lineNumber: 156,
        columnNumber: 5
    }, this);
}
function TreeNode({ label, sublabel, status, isRoot }) {
    const statusStyles = {
        pending: 'border-white/20 bg-black/40',
        active: 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20',
        complete: 'border-green-500 bg-green-500/10'
    };
    const iconStyles = {
        pending: 'text-white/40',
        active: 'text-blue-400',
        complete: 'text-green-400'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative px-4 py-3 rounded-xl border transition-all duration-300 ${statusStyles[status]} ${isRoot ? 'min-w-[200px]' : 'min-w-[140px]'}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `transition-colors duration-300 ${iconStyles[status]}`,
                    children: status === 'complete' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-4 h-4",
                        fill: "currentColor",
                        viewBox: "0 0 20 20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            fillRule: "evenodd",
                            d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                            clipRule: "evenodd"
                        }, void 0, false, {
                            fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                            lineNumber: 315,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                        lineNumber: 314,
                        columnNumber: 13
                    }, this) : status === 'active' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-4 h-4 animate-spin",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                className: "opacity-25",
                                cx: "12",
                                cy: "12",
                                r: "10",
                                stroke: "currentColor",
                                strokeWidth: "4"
                            }, void 0, false, {
                                fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                                lineNumber: 319,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                className: "opacity-75",
                                fill: "currentColor",
                                d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            }, void 0, false, {
                                fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                                lineNumber: 320,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                        lineNumber: 318,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-4 h-4 rounded-full border border-current"
                    }, void 0, false, {
                        fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                        lineNumber: 323,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                    lineNumber: 312,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm font-medium text-white",
                            children: label
                        }, void 0, false, {
                            fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                            lineNumber: 328,
                            columnNumber: 11
                        }, this),
                        sublabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs text-white/40 font-mono",
                            children: sublabel
                        }, void 0, false, {
                            fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                            lineNumber: 330,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
                    lineNumber: 327,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
            lineNumber: 310,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/batch-payments/AuthTreeVisualization.tsx",
        lineNumber: 305,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/batch-payments/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BatchPayments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Fonts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/app/components/Fonts.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__lexendTera$3e$__ = __turbopack_context__.i("[next]/internal/font/google/lexend_tera_c343b42e.js [app-ssr] (ecmascript) <export default as lexendTera>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$batch$2d$payments$2f$RecipientsInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/batch-payments/RecipientsInput.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$batch$2d$payments$2f$AuthTreeVisualization$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/batch-payments/AuthTreeVisualization.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$bulkPaymentService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/bulkPaymentService.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function BatchPayments() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [recipients, setRecipients] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: '1',
            address: '',
            amount: '',
            isValid: false
        }
    ]);
    const [txStatus, setTxStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        state: 'idle',
        message: 'Ready to process payments'
    });
    const [walletConnected, setWalletConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [walletAddress, setWalletAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    // Compute valid recipients and batches
    const validRecipients = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>recipients.filter((r)=>r.isValid), [
        recipients
    ]);
    const batchInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const count = validRecipients.length;
        if (count === 0) return [];
        const batches = [];
        for(let i = 0; i < count; i += __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$bulkPaymentService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SAFE_LIMITS"].MAX_RECIPIENTS_PER_BATCH){
            batches.push({
                workerIndex: batches.length,
                recipientCount: Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$bulkPaymentService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SAFE_LIMITS"].MAX_RECIPIENTS_PER_BATCH, count - i)
            });
        }
        return batches;
    }, [
        validRecipients
    ]);
    const totalAmount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return validRecipients.reduce((sum, r)=>sum + parseFloat(r.amount), 0);
    }, [
        validRecipients
    ]);
    // Connect wallet (mock for demo - replace with actual Freighter integration)
    const connectWallet = async ()=>{
        try {
            // Check if Freighter is available
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            else {
                // Demo mode - generate mock address
                const mockAddress = 'GDEMO' + 'X'.repeat(51);
                setWalletAddress(mockAddress);
                setWalletConnected(true);
                setTxStatus({
                    state: 'idle',
                    message: 'Demo mode: Freighter not detected. Install Freighter wallet for real transactions.'
                });
            }
        } catch (error) {
            console.error('Wallet connection error:', error);
            setTxStatus({
                state: 'error',
                message: 'Failed to connect wallet',
                error: error.message
            });
        }
    };
    // Disconnect wallet
    const disconnectWallet = ()=>{
        setWalletConnected(false);
        setWalletAddress('');
        setTxStatus({
            state: 'idle',
            message: 'Ready to process payments'
        });
    };
    // Execute batch payment
    const executeBatchPayment = async ()=>{
        if (validRecipients.length === 0) {
            setTxStatus({
                state: 'error',
                message: 'No valid recipients',
                error: 'Add at least one valid recipient'
            });
            return;
        }
        if (!walletConnected) {
            setTxStatus({
                state: 'error',
                message: 'Wallet not connected',
                error: 'Please connect your wallet first'
            });
            return;
        }
        try {
            setTxStatus({
                state: 'preparing',
                message: 'Building authorization tree...'
            });
            // Simulate the auth tree building process
            // In production, this would call the actual BulkPaymentService
            await new Promise((resolve)=>setTimeout(resolve, 2000));
            setTxStatus({
                state: 'signing',
                message: 'Awaiting wallet signature...'
            });
            // Simulate signing delay
            await new Promise((resolve)=>setTimeout(resolve, 3000));
            setTxStatus({
                state: 'submitting',
                message: 'Submitting transaction to network...'
            });
            // Simulate transaction submission
            await new Promise((resolve)=>setTimeout(resolve, 5000));
            // Mock success
            const mockHash = 'a'.repeat(64);
            setTxStatus({
                state: 'success',
                message: 'Transaction successful!',
                hash: mockHash
            });
        } catch (error) {
            setTxStatus({
                state: 'error',
                message: 'Transaction failed',
                error: error.message || 'Unknown error occurred'
            });
        }
    };
    // Reset transaction
    const resetTransaction = ()=>{
        setTxStatus({
            state: 'idle',
            message: 'Ready to process payments'
        });
    };
    const isProcessing = [
        'preparing',
        'signing',
        'submitting'
    ].includes(txStatus.state);
    const canSubmit = validRecipients.length > 0 && walletConnected && !isProcessing;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-black text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "w-full flex items-center justify-between py-6 px-8 lg:px-16 fixed top-0 left-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-x-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push('/dashboard'),
                                className: "flex items-center gap-2 text-white/60 hover:text-white transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-5 h-5",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M15 19l-7-7 7-7"
                                        }, void 0, false, {
                                            fileName: "[project]/app/batch-payments/page.tsx",
                                            lineNumber: 157,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/batch-payments/page.tsx",
                                        lineNumber: 156,
                                        columnNumber: 13
                                    }, this),
                                    "Back"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/batch-payments/page.tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-px h-6 bg-white/20"
                            }, void 0, false, {
                                fileName: "[project]/app/batch-payments/page.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/",
                                className: "text-white/80 hover:text-white transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: "/Tess_BW.svg",
                                        alt: "Tesseract",
                                        className: "h-7 w-7 inline-block mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/app/batch-payments/page.tsx",
                                        lineNumber: 163,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline",
                                        children: "TESSERACT"
                                    }, void 0, false, {
                                        fileName: "[project]/app/batch-payments/page.tsx",
                                        lineNumber: 164,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/batch-payments/page.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/batch-payments/page.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: walletConnected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-2 h-2 rounded-full bg-green-500"
                                        }, void 0, false, {
                                            fileName: "[project]/app/batch-payments/page.tsx",
                                            lineNumber: 173,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-white/80 font-mono",
                                            children: [
                                                walletAddress.slice(0, 4),
                                                "...",
                                                walletAddress.slice(-4)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/batch-payments/page.tsx",
                                            lineNumber: 174,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/batch-payments/page.tsx",
                                    lineNumber: 172,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: disconnectWallet,
                                    className: "px-3 py-2 text-sm text-white/50 hover:text-white transition-colors",
                                    children: "Disconnect"
                                }, void 0, false, {
                                    fileName: "[project]/app/batch-payments/page.tsx",
                                    lineNumber: 178,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/batch-payments/page.tsx",
                            lineNumber: 171,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: connectWallet,
                            className: "px-4 py-2 bg-white text-black rounded-lg font-medium text-sm hover:bg-white/90 transition-colors",
                            children: "Connect Wallet"
                        }, void 0, false, {
                            fileName: "[project]/app/batch-payments/page.tsx",
                            lineNumber: 186,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/batch-payments/page.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/batch-payments/page.tsx",
                lineNumber: 150,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pt-24 pb-12 px-8 lg:px-16",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-6xl mx-auto mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: `text-3xl lg:text-4xl font-bold mb-2 ${__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__lexendTera$3e$__["lexendTera"].className}`,
                                children: "Batch Payments"
                            }, void 0, false, {
                                fileName: "[project]/app/batch-payments/page.tsx",
                                lineNumber: 200,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-white/60",
                                children: [
                                    "Pay up to ",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$bulkPaymentService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SAFE_LIMITS"].MAX_TOTAL_RECIPIENTS,
                                    " recipients with a single signature"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/batch-payments/page.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/batch-payments/page.tsx",
                        lineNumber: 199,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-lg font-semibold mb-4",
                                                children: "Recipients"
                                            }, void 0, false, {
                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                lineNumber: 213,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$batch$2d$payments$2f$RecipientsInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                recipients: recipients,
                                                onRecipientsChange: setRecipients,
                                                disabled: isProcessing
                                            }, void 0, false, {
                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                lineNumber: 214,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/batch-payments/page.tsx",
                                        lineNumber: 212,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-lg font-semibold mb-4",
                                                children: "Payment Summary"
                                            }, void 0, false, {
                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                lineNumber: 223,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-white/60",
                                                                children: "Recipients"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 226,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: validRecipients.length
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 227,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                        lineNumber: 225,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-white/60",
                                                                children: "Batches"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 230,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: batchInfo.length
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 231,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                        lineNumber: 229,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-white/60",
                                                                children: "Total Amount"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 234,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: [
                                                                    totalAmount.toFixed(7),
                                                                    " XLM"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 235,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                        lineNumber: 233,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-white/60",
                                                                children: "Signatures Required"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 238,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-green-400",
                                                                children: "1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 239,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                        lineNumber: 237,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-px bg-white/10"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                        lineNumber: 241,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-white/60",
                                                                children: "Estimated Fee"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 243,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-white/80",
                                                                children: "~0.01 XLM"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 244,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                        lineNumber: 242,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                lineNumber: 224,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/batch-payments/page.tsx",
                                        lineNumber: 222,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: executeBatchPayment,
                                        disabled: !canSubmit,
                                        className: `w-full py-4 rounded-xl font-medium text-lg transition-all ${canSubmit ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90' : 'bg-white/10 text-white/40 cursor-not-allowed'}`,
                                        children: isProcessing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center justify-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-5 h-5 animate-spin",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                            className: "opacity-25",
                                                            cx: "12",
                                                            cy: "12",
                                                            r: "10",
                                                            stroke: "currentColor",
                                                            strokeWidth: "4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/batch-payments/page.tsx",
                                                            lineNumber: 262,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            className: "opacity-75",
                                                            fill: "currentColor",
                                                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/batch-payments/page.tsx",
                                                            lineNumber: 263,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/batch-payments/page.tsx",
                                                    lineNumber: 261,
                                                    columnNumber: 19
                                                }, this),
                                                "Processing..."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/batch-payments/page.tsx",
                                            lineNumber: 260,
                                            columnNumber: 17
                                        }, this) : !walletConnected ? 'Connect Wallet to Continue' : validRecipients.length === 0 ? 'Add Recipients to Continue' : `Pay ${validRecipients.length} Recipients`
                                    }, void 0, false, {
                                        fileName: "[project]/app/batch-payments/page.tsx",
                                        lineNumber: 250,
                                        columnNumber: 13
                                    }, this),
                                    txStatus.state !== 'idle' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `p-4 rounded-xl border ${txStatus.state === 'error' ? 'bg-red-500/10 border-red-500/20' : txStatus.state === 'success' ? 'bg-green-500/10 border-green-500/20' : 'bg-blue-500/10 border-blue-500/20'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    txStatus.state === 'success' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "w-5 h-5 text-green-400",
                                                        fill: "currentColor",
                                                        viewBox: "0 0 20 20",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            fillRule: "evenodd",
                                                            d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                                                            clipRule: "evenodd"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/batch-payments/page.tsx",
                                                            lineNumber: 290,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                        lineNumber: 289,
                                                        columnNumber: 21
                                                    }, this),
                                                    txStatus.state === 'error' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "w-5 h-5 text-red-400",
                                                        fill: "currentColor",
                                                        viewBox: "0 0 20 20",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            fillRule: "evenodd",
                                                            d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                                                            clipRule: "evenodd"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/batch-payments/page.tsx",
                                                            lineNumber: 295,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                        lineNumber: 294,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: txStatus.state === 'error' ? 'text-red-400' : txStatus.state === 'success' ? 'text-green-400' : 'text-blue-400',
                                                        children: txStatus.message
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                        lineNumber: 298,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                lineNumber: 287,
                                                columnNumber: 17
                                            }, this),
                                            txStatus.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-2 text-sm text-white/50",
                                                children: txStatus.error
                                            }, void 0, false, {
                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                lineNumber: 311,
                                                columnNumber: 19
                                            }, this),
                                            txStatus.hash && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: `https://stellar.expert/explorer/testnet/tx/${txStatus.hash}`,
                                                    target: "_blank",
                                                    rel: "noopener noreferrer",
                                                    className: "text-sm text-blue-400 hover:text-blue-300 font-mono",
                                                    children: "View on Stellar Expert"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/batch-payments/page.tsx",
                                                    lineNumber: 315,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                lineNumber: 314,
                                                columnNumber: 19
                                            }, this),
                                            (txStatus.state === 'error' || txStatus.state === 'success') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: resetTransaction,
                                                className: "mt-3 text-sm text-white/50 hover:text-white",
                                                children: txStatus.state === 'success' ? 'New Payment' : 'Try Again'
                                            }, void 0, false, {
                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                lineNumber: 326,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/batch-payments/page.tsx",
                                        lineNumber: 278,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/batch-payments/page.tsx",
                                lineNumber: 211,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$batch$2d$payments$2f$AuthTreeVisualization$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        batches: batchInfo,
                                        isProcessing: isProcessing,
                                        isComplete: txStatus.state === 'success',
                                        transactionHash: txStatus.hash
                                    }, void 0, false, {
                                        fileName: "[project]/app/batch-payments/page.tsx",
                                        lineNumber: 339,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-semibold mb-4",
                                                children: "How It Works"
                                            }, void 0, false, {
                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                lineNumber: 348,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400",
                                                                children: "1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 351,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "font-medium text-sm",
                                                                        children: "Add Recipients"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                                        lineNumber: 355,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-xs text-white/50",
                                                                        children: [
                                                                            "Upload a CSV or manually enter up to ",
                                                                            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$bulkPaymentService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SAFE_LIMITS"].MAX_TOTAL_RECIPIENTS,
                                                                            " recipients"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                                        lineNumber: 356,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 354,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                        lineNumber: 350,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400",
                                                                children: "2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 362,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "font-medium text-sm",
                                                                        children: "Build Auth Tree"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                                        lineNumber: 366,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-xs text-white/50",
                                                                        children: [
                                                                            "Recipients are split into batches of ",
                                                                            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$bulkPaymentService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SAFE_LIMITS"].MAX_RECIPIENTS_PER_BATCH,
                                                                            " for optimal processing"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                                        lineNumber: 367,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 365,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                        lineNumber: 361,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400",
                                                                children: "3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 373,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "font-medium text-sm",
                                                                        children: "Single Signature"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                                        lineNumber: 377,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-xs text-white/50",
                                                                        children: "Sign once to authorize all payments atomically"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                                        lineNumber: 378,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 376,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                        lineNumber: 372,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs text-green-400",
                                                                children: "4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 384,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "font-medium text-sm",
                                                                        children: "Execute"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                                        lineNumber: 388,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-xs text-white/50",
                                                                        children: "All payments succeed or fail together in one transaction"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                                        lineNumber: 389,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 387,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                        lineNumber: 383,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                lineNumber: 349,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/batch-payments/page.tsx",
                                        lineNumber: 347,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white/5 rounded-xl p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-sm font-medium mb-3",
                                                children: "Current Limits"
                                            }, void 0, false, {
                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                lineNumber: 399,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-3 text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-white/50",
                                                                children: "Max Recipients"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 402,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$bulkPaymentService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SAFE_LIMITS"].MAX_TOTAL_RECIPIENTS
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 403,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                        lineNumber: 401,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-white/50",
                                                                children: "Per Batch"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 406,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$bulkPaymentService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SAFE_LIMITS"].MAX_RECIPIENTS_PER_BATCH
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 407,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                        lineNumber: 405,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-white/50",
                                                                children: "Max Batches"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 410,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$bulkPaymentService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SAFE_LIMITS"].MAX_BATCHES
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 411,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                        lineNumber: 409,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-white/50",
                                                                children: "Network"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 414,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-yellow-400",
                                                                children: "Testnet"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                                lineNumber: 415,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/batch-payments/page.tsx",
                                                        lineNumber: 413,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/batch-payments/page.tsx",
                                                lineNumber: 400,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/batch-payments/page.tsx",
                                        lineNumber: 398,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/batch-payments/page.tsx",
                                lineNumber: 338,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/batch-payments/page.tsx",
                        lineNumber: 209,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/batch-payments/page.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "border-t border-white/10 py-6 px-8 lg:px-16",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-6xl mx-auto flex items-center justify-between text-sm text-white/40",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Powered by Stellar Soroban"
                        }, void 0, false, {
                            fileName: "[project]/app/batch-payments/page.tsx",
                            lineNumber: 426,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Tesseract - 4D Privacy on 2D Ledger"
                        }, void 0, false, {
                            fileName: "[project]/app/batch-payments/page.tsx",
                            lineNumber: 427,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/batch-payments/page.tsx",
                    lineNumber: 425,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/batch-payments/page.tsx",
                lineNumber: 424,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/batch-payments/page.tsx",
        lineNumber: 148,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bfe53702._.js.map