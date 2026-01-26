import {
    Address,
    Keypair,
    Operation,
    rpc,
    TransactionBuilder,
    xdr,
    nativeToScVal,
    hash,
    Account,
    Networks,
} from '@stellar/stellar-sdk';

// ==================== CONFIGURATION ====================

const CONFIG = {
    TESTNET: {
        RPC_URL: 'https://soroban-testnet.stellar.org',
        HORIZON_URL: 'https://horizon-testnet.stellar.org',
        NETWORK_PASSPHRASE: Networks.TESTNET,
        ORCHESTRATOR_CONTRACT: 'CBYD7XCJH6RCA27AXXJDO3ARZHQJIW5BYEHAUKJ7QS6NQMLIQ2KMJ3K2',
        XLM_SAC: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    },
    MAINNET: {
        RPC_URL: 'https://soroban-rpc.stellar.org',
        HORIZON_URL: 'https://horizon.stellar.org',
        NETWORK_PASSPHRASE: Networks.PUBLIC,
        ORCHESTRATOR_CONTRACT: '', // TODO: Deploy and update for mainnet
        XLM_SAC: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA',
    },
};

// Worker contracts for batch processing (20 available)
const WORKER_CONTRACTS: Record<string, string> = {
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
    worker20: 'CBFYQMR7BY7CANCIWJEAL7LYVURWUIKZZZFM3FR2B765HZKTGYLEYLWW',
};

// ==================== TYPE DEFINITIONS ====================

export interface PaymentRecipient {
    address: string;
    amount: bigint; // In stroops (1 XLM = 10_000_000n)
}

export interface BatchConfig {
    workerContractId: string;
    recipients: string[];
    amounts: bigint[];
}

export interface AuthTreeBuildResult {
    authEntry: xdr.SorobanAuthorizationEntry;
    authPayload: Buffer;           // Hash of preimage (for manual signing)
    authPreimageXdr: string;       // Base64 XDR of preimage (for Freighter signAuthEntry)
    expirationLedger: number;
    nonce: bigint;
}

export interface TransactionResult {
    success: boolean;
    hash?: string;
    ledger?: number;
    error?: string;
    totalPayments?: number;
}

export type NetworkType = 'testnet' | 'mainnet';

// ==================== SAFE LIMITS ====================

export const SAFE_LIMITS = {
    MAX_RECIPIENTS_PER_BATCH: 19,  // Don't use 20 (contract limit buffer)
    MAX_TOTAL_RECIPIENTS: 80,      // Stay under 81 for resource limits
    MAX_BATCHES: 5,                // 5 batches × 19 = 95, but 80 is safer
    FEE_BUFFER_MULTIPLIER: 2.0,   // 2x the simulated fee
    STROOPS_PER_XLM: 10_000_000n,
};

// ==================== MAIN SERVICE CLASS ====================

export class BulkPaymentService {
    private server: rpc.Server;
    private networkPassphrase: string;
    private orchestratorContract: string;
    private xlmSac: string;
    private workerContracts: string[];

    constructor(network: NetworkType = 'testnet') {
        const config = network === 'mainnet' ? CONFIG.MAINNET : CONFIG.TESTNET;

        this.server = new rpc.Server(config.RPC_URL, { allowHttp: true });
        this.networkPassphrase = config.NETWORK_PASSPHRASE;
        this.orchestratorContract = config.ORCHESTRATOR_CONTRACT;
        this.xlmSac = config.XLM_SAC;
        this.workerContracts = Object.values(WORKER_CONTRACTS);
    }

    // ==================== PUBLIC METHODS ====================

    /**
     * Validates and creates batches from a list of recipients
     * Returns error if validation fails
     */
    validateAndCreateBatches(recipients: PaymentRecipient[]): {
        batches?: BatchConfig[];
        error?: string;
        stats?: {
            totalRecipients: number;
            totalAmount: bigint;
            batchCount: number;
            recipientsPerBatch: number[];
        };
    } {
        // Validate recipient count
        if (recipients.length === 0) {
            return { error: 'No recipients provided' };
        }

        if (recipients.length > SAFE_LIMITS.MAX_TOTAL_RECIPIENTS) {
            return {
                error: `Maximum ${SAFE_LIMITS.MAX_TOTAL_RECIPIENTS} recipients per transaction. You provided ${recipients.length}.`
            };
        }

        // Validate addresses and amounts
        for (let i = 0; i < recipients.length; i++) {
            const r = recipients[i];

            // Validate address format (basic check)
            if (!r.address || r.address.length !== 56 || !r.address.startsWith('G')) {
                return { error: `Invalid Stellar address at row ${i + 1}: ${r.address}` };
            }

            // Validate amount
            if (r.amount <= 0n) {
                return { error: `Amount must be positive at row ${i + 1}` };
            }
        }

        // Create batches
        const batches: BatchConfig[] = [];
        const recipientsPerBatch: number[] = [];

        for (let i = 0; i < recipients.length; i += SAFE_LIMITS.MAX_RECIPIENTS_PER_BATCH) {
            const batchRecipients = recipients.slice(i, i + SAFE_LIMITS.MAX_RECIPIENTS_PER_BATCH);
            const workerIndex = batches.length % this.workerContracts.length;

            batches.push({
                workerContractId: this.workerContracts[workerIndex],
                recipients: batchRecipients.map(r => r.address),
                amounts: batchRecipients.map(r => r.amount),
            });

            recipientsPerBatch.push(batchRecipients.length);
        }

        const totalAmount = recipients.reduce((sum, r) => sum + r.amount, 0n);

        return {
            batches,
            stats: {
                totalRecipients: recipients.length,
                totalAmount,
                batchCount: batches.length,
                recipientsPerBatch,
            },
        };
    }

    /**
     * Builds the 3-level authorization tree for orchestrated payments
     * This is the key function that enables SINGLE SIGNATURE for all batches
     */
    async buildAuthTree(
        userPublicKey: string,
        batches: BatchConfig[]
    ): Promise<AuthTreeBuildResult> {
        // Get current ledger for nonce and expiration
        const ledgerResponse = await this.server.getLatestLedger();
        const currentLedger = ledgerResponse.sequence;
        const expirationLedger = currentLedger + 1000; // ~83 minutes validity
        const nonce = BigInt(currentLedger);

        // Build Level 3: Token transfer sub-invocations for each batch
        const batchSubInvocations: xdr.SorobanAuthorizedInvocation[] = batches.map(batch => {
            // Build transfer invocations (Level 3)
            const transferInvocations = batch.recipients.map((recipient, i) => {
                return new xdr.SorobanAuthorizedInvocation({
                    function: xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(
                        new xdr.InvokeContractArgs({
                            contractAddress: new Address(this.xlmSac).toScAddress(),
                            functionName: 'transfer',
                            args: [
                                new Address(userPublicKey).toScVal(),
                                new Address(recipient).toScVal(),
                                nativeToScVal(batch.amounts[i], { type: 'i128' }),
                            ],
                        })
                    ),
                    subInvocations: [],
                });
            });

            // Build Level 2: Worker batch_pay invocation
            return new xdr.SorobanAuthorizedInvocation({
                function: xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(
                    new xdr.InvokeContractArgs({
                        contractAddress: new Address(batch.workerContractId).toScAddress(),
                        functionName: 'batch_pay',
                        args: [
                            new Address(userPublicKey).toScVal(),
                            xdr.ScVal.scvVec(batch.recipients.map(r => new Address(r).toScVal())),
                            xdr.ScVal.scvVec(batch.amounts.map(a => nativeToScVal(a, { type: 'i128' }))),
                            new Address(this.xlmSac).toScVal(),
                        ],
                    })
                ),
                subInvocations: transferInvocations,
            });
        });

        // Build Level 1: Orchestrator root invocation
        // Convert batches to BatchConfig ScVal format
        // IMPORTANT: Map entries MUST be in alphabetical order for Soroban
        const batchesScVal = xdr.ScVal.scvVec(
            batches.map(batch =>
                xdr.ScVal.scvMap([
                    new xdr.ScMapEntry({
                        key: xdr.ScVal.scvSymbol('amounts'),
                        val: xdr.ScVal.scvVec(batch.amounts.map(a => nativeToScVal(a, { type: 'i128' }))),
                    }),
                    new xdr.ScMapEntry({
                        key: xdr.ScVal.scvSymbol('recipients'),
                        val: xdr.ScVal.scvVec(batch.recipients.map(r => new Address(r).toScVal())),
                    }),
                    new xdr.ScMapEntry({
                        key: xdr.ScVal.scvSymbol('worker_contract'),
                        val: new Address(batch.workerContractId).toScVal(),
                    }),
                ])
            )
        );

        const rootInvocation = new xdr.SorobanAuthorizedInvocation({
            function: xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(
                new xdr.InvokeContractArgs({
                    contractAddress: new Address(this.orchestratorContract).toScAddress(),
                    functionName: 'orchestrate_payments',
                    args: [
                        new Address(userPublicKey).toScVal(),
                        batchesScVal,
                        new Address(this.xlmSac).toScVal(),
                    ],
                })
            ),
            subInvocations: batchSubInvocations,
        });

        // Build the authorization entry with credentials placeholder
        const authEntry = new xdr.SorobanAuthorizationEntry({
            credentials: xdr.SorobanCredentials.sorobanCredentialsAddress(
                new xdr.SorobanAddressCredentials({
                    address: new Address(userPublicKey).toScAddress(),
                    nonce: xdr.Int64.fromString(nonce.toString()),
                    signatureExpirationLedger: expirationLedger,
                    signature: xdr.ScVal.scvVoid(), // Placeholder - will be filled after signing
                })
            ),
            rootInvocation: rootInvocation,
        });

        // Compute the hash payload that needs to be signed
        const networkId = hash(Buffer.from(this.networkPassphrase));
        const hashIdPreimage = xdr.HashIdPreimage.envelopeTypeSorobanAuthorization(
            new xdr.HashIdPreimageSorobanAuthorization({
                networkId: networkId,
                nonce: xdr.Int64.fromString(nonce.toString()),
                signatureExpirationLedger: expirationLedger,
                invocation: rootInvocation,
            })
        );

        // Get the preimage XDR for Freighter (it hashes internally)
        const preimageXdr = hashIdPreimage.toXDR();
        const authPreimageXdr = preimageXdr.toString('base64');
        
        // Also compute the hash for manual signing scenarios
        const authPayload = hash(preimageXdr);

        return {
            authEntry,
            authPayload,
            authPreimageXdr,
            expirationLedger,
            nonce,
        };
    }

    /**
     * Signs the authorization entry with the wallet's signing function
     * Returns the signed auth entry ready for transaction submission
     */
    async signAuthEntry(
        authEntry: xdr.SorobanAuthorizationEntry,
        userPublicKey: string,
        signFunction: (payload: Buffer) => Promise<Buffer>,
        authPayload: Buffer
    ): Promise<xdr.SorobanAuthorizationEntry> {
        // Get the signature from the wallet
        const signature = await signFunction(authPayload);

        // Build the signature ScVal - MUST be Vec<Map> format for Stellar/Soroban
        // The Vec allows for multiple signers, Map contains public_key and signature
        const signatureScVal = xdr.ScVal.scvVec([
            xdr.ScVal.scvMap([
                new xdr.ScMapEntry({
                    key: xdr.ScVal.scvSymbol('public_key'),
                    val: xdr.ScVal.scvBytes(Keypair.fromPublicKey(userPublicKey).rawPublicKey()),
                }),
                new xdr.ScMapEntry({
                    key: xdr.ScVal.scvSymbol('signature'),
                    val: xdr.ScVal.scvBytes(signature),
                }),
            ]),
        ]);

        // Create new credentials with the signature
        const credentials = authEntry.credentials();
        const addressCreds = credentials.address();

        const signedCredentials = xdr.SorobanCredentials.sorobanCredentialsAddress(
            new xdr.SorobanAddressCredentials({
                address: addressCreds.address(),
                nonce: addressCreds.nonce(),
                signatureExpirationLedger: addressCreds.signatureExpirationLedger(),
                signature: signatureScVal,
            })
        );

        return new xdr.SorobanAuthorizationEntry({
            credentials: signedCredentials,
            rootInvocation: authEntry.rootInvocation(),
        });
    }

    /**
     * Submits the signed authorization entry as a transaction
     * Returns the transaction result
     */
    async submitTransaction(
        signedAuthEntry: xdr.SorobanAuthorizationEntry,
        serviceSecretKey: string
    ): Promise<TransactionResult> {
        const serviceKeypair = Keypair.fromSecret(serviceSecretKey);
        const serviceAddress = serviceKeypair.publicKey();

        // Load service account
        let serviceAccount: Account;
        try {
            serviceAccount = await this.server.getAccount(serviceAddress);
        } catch (e) {
            return {
                success: false,
                error: `Failed to load service account: ${serviceAddress}. Ensure it is funded.`,
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
            auth: [signedAuthEntry],
        });

        // Build transaction for simulation
        const simTx = new TransactionBuilder(serviceAccount, {
            fee: '100',
            networkPassphrase: this.networkPassphrase,
        })
            .addOperation(invokeOp)
            .setTimeout(60)
            .build();

        // Simulate
        const simResponse = await this.server.simulateTransaction(simTx);

        if (rpc.Api.isSimulationError(simResponse)) {
            return {
                success: false,
                error: `Simulation failed: ${simResponse.error}`,
            };
        }

        // Build final transaction with resource data
        const sorobanData = simResponse.transactionData?.build();
        const feeWithBuffer = Math.ceil(
            parseInt(simResponse.minResourceFee || '0') * SAFE_LIMITS.FEE_BUFFER_MULTIPLIER
        );

        // Reload account for correct sequence number
        serviceAccount = await this.server.getAccount(serviceAddress);

        const finalTx = new TransactionBuilder(serviceAccount, {
            fee: feeWithBuffer.toString(),
            networkPassphrase: this.networkPassphrase,
        })
            .setSorobanData(sorobanData!)
            .addOperation(invokeOp)
            .setTimeout(90)
            .build();

        // Sign with service key (pays fees)
        finalTx.sign(serviceKeypair);

        // Submit
        const sendResponse = await this.server.sendTransaction(finalTx);

        if (sendResponse.status !== 'PENDING') {
            return {
                success: false,
                error: `Transaction submission failed. Status: ${sendResponse.status}`,
            };
        }

        // Wait for confirmation
        let txStatus = await this.server.getTransaction(sendResponse.hash);
        let attempts = 0;
        const maxAttempts = 30;

        while (txStatus.status === 'NOT_FOUND' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            txStatus = await this.server.getTransaction(sendResponse.hash);
            attempts++;
        }

        if (txStatus.status === 'SUCCESS') {
            return {
                success: true,
                hash: sendResponse.hash,
                ledger: txStatus.ledger,
            };
        }

        return {
            success: false,
            error: `Transaction failed with status: ${txStatus.status}`,
            hash: sendResponse.hash,
        };
    }


    /**
     * Checks if a Stellar account exists on the network.
     * @param publicKey The public key of the account to check.
     * @returns An object indicating if the account exists and an error message if not.
     */
    async checkAccountExists(publicKey: string): Promise<{ exists: boolean; error?: string }> {
        try {
            await this.server.getAccount(publicKey);
            return { exists: true };
        } catch (e: any) {
            if (e.message?.includes('Not Found') || e.code === 404) {
                return {
                    exists: false,
                    error: `Account ${publicKey} does not exist on the network. Please fund it first.`
                };
            }
            // Re-throw or return a generic error if it's not a "Not Found" issue
            return { exists: false, error: e.message || 'An unknown error occurred while checking account existence.' };
        }
    }

    // ==================== UTILITY METHODS ====================

    /**
     * Converts XLM to stroops
     */
    static xlmToStroops(xlm: number | string): bigint {
        const xlmNum = typeof xlm === 'string' ? parseFloat(xlm) : xlm;
        return BigInt(Math.floor(xlmNum * Number(SAFE_LIMITS.STROOPS_PER_XLM)));
    }

    /**
     * Converts stroops to XLM
     */
    static stroopsToXlm(stroops: bigint): string {
        return (Number(stroops) / Number(SAFE_LIMITS.STROOPS_PER_XLM)).toFixed(7);
    }

    /**
     * Parses CSV content into payment recipients
     * Expected format: address,amount (amount in XLM)
     */
    static parseCSV(csvContent: string): {
        recipients?: PaymentRecipient[];
        error?: string;
        warnings?: string[];
    } {
        const lines = csvContent.trim().split('\n');
        const recipients: PaymentRecipient[] = [];
        const warnings: string[] = [];

        // Skip header if present
        let startLine = 0;
        const firstLine = lines[0].toLowerCase();
        if (firstLine.includes('address') || firstLine.includes('recipient') || firstLine.includes('amount')) {
            startLine = 1;
        }

        for (let i = startLine; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const parts = line.split(',').map(p => p.trim());
            if (parts.length < 2) {
                return { error: `Invalid format at line ${i + 1}: expected "address,amount"` };
            }

            const address = parts[0];
            const amountStr = parts[1];

            // Parse amount (assuming XLM)
            const amount = parseFloat(amountStr);
            if (isNaN(amount) || amount <= 0) {
                return { error: `Invalid amount at line ${i + 1}: ${amountStr}` };
            }

            // Warn about very small amounts
            if (amount < 0.0000001) {
                warnings.push(`Very small amount at line ${i + 1}: ${amountStr} XLM`);
            }

            recipients.push({
                address,
                amount: BulkPaymentService.xlmToStroops(amount),
            });
        }

        if (recipients.length === 0) {
            return { error: 'No valid recipients found in CSV' };
        }

        return { recipients, warnings };
    }

    /**
     * Gets the orchestrator contract address
     */
    getOrchestratorContract(): string {
        return this.orchestratorContract;
    }

    /**
     * Gets the XLM SAC address
     */
    getXlmSac(): string {
        return this.xlmSac;
    }

    /**
     * Gets the RPC server instance
     */
    getServer(): rpc.Server {
        return this.server;
    }
}

// Export singleton for convenience
export const bulkPaymentService = new BulkPaymentService('testnet');
