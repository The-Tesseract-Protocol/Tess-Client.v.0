'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { lexendTera } from '../components/Fonts';
import RecipientsInput, { Recipient } from './components/RecipientsInput';
import AuthTreeVisualization from './components/AuthTreeVisualization';
import { SAFE_LIMITS, BulkPaymentService, PaymentRecipient } from '../services/bulkPaymentService';
import { WalletProvider, useWallet, ConnectWalletButton, NetworkBadge } from '../contexts/WalletContext';
import { isWalletError, WalletErrorCode } from '../services/walletService';
import IsoLevelWarp from '../components/ui/isometric-ui';
import NeuralBackground from '../components/ui/flow-field-background';

type TransactionState = 'idle' | 'preparing' | 'signing' | 'submitting' | 'success' | 'error';

interface TransactionStatus {
    state: TransactionState;
    message: string;
    hash?: string;
    error?: string | React.ReactNode;
}

function BatchPaymentsContent() {
    const router = useRouter();
    const { walletState, signAuthEntry, formatAddress, isTestnet } = useWallet();

    const [recipients, setRecipients] = useState<Recipient[]>([
        { id: '1', address: '', amount: '', isValid: false },
    ]);
    const [txStatus, setTxStatus] = useState<TransactionStatus>({
        state: 'idle',
        message: 'Ready to process payments',
    });

    // NEW: Track if visualization animation has completed
    const [isVisualizationComplete, setIsVisualizationComplete] = useState(false);

    // Callback when visualization finishes its completion animation
    const handleVisualizationComplete = useCallback(() => {
        setIsVisualizationComplete(true);
    }, []);

    // Compute valid recipients and batches
    const validRecipients = useMemo(() => recipients.filter((r) => r.isValid), [recipients]);

    const batchInfo = useMemo(() => {
        const count = validRecipients.length;
        if (count === 0) return [];

        const batches = [];
        for (let i = 0; i < count; i += SAFE_LIMITS.MAX_RECIPIENTS_PER_BATCH) {
            batches.push({
                workerIndex: batches.length,
                recipientCount: Math.min(SAFE_LIMITS.MAX_RECIPIENTS_PER_BATCH, count - i),
            });
        }
        return batches;
    }, [validRecipients]);

    const totalAmount = useMemo(() => {
        return validRecipients.reduce((sum, r) => sum + parseFloat(r.amount), 0);
    }, [validRecipients]);

    // Execute batch payment
    const executeBatchPayment = async () => {
        // Reset visualization state for new transaction
        setIsVisualizationComplete(false);

        if (validRecipients.length === 0) {
            setTxStatus({
                state: 'error',
                message: 'No valid recipients',
                error: 'Add at least one valid recipient',
            });
            return;
        }

        if (!walletState.isConnected || !walletState.address) {
            setTxStatus({
                state: 'error',
                message: 'Wallet not connected',
                error: 'Please connect your Freighter wallet first',
            });
            return;
        }

        // Check network
        if (!isTestnet()) {
            setTxStatus({
                state: 'error',
                message: 'Wrong network',
                error: 'Please switch to Stellar Testnet in Freighter',
            });
            return;
        }

        try {
            setTxStatus({ state: 'preparing', message: 'Building authorization tree...' });

            // Initialize the bulk payment service
            const bulkPaymentService = new BulkPaymentService('testnet');

            // Check if user account exists
            const accountCheck = await bulkPaymentService.checkAccountExists(walletState.address);
            if (!accountCheck.exists) {
                setTxStatus({
                    state: 'error',
                    message: 'Account not funded',
                    error: (
                        <span>
                            Your wallet address does not exist on Stellar Testnet. Please fund it using the Stellar{' '}
                            <a
                                href={`https://friendbot.stellar.org?addr=${walletState.address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-blue-300"
                            >
                                Friendbot
                            </a>
                            .
                        </span>
                    ),
                });
                return;
            }

            // Convert recipients to PaymentRecipient format
            const paymentRecipients: PaymentRecipient[] = validRecipients.map((r) => ({
                address: r.address,
                amount: BulkPaymentService.xlmToStroops(r.amount),
            }));

            // Validate and create batches
            const batchResult = bulkPaymentService.validateAndCreateBatches(paymentRecipients);

            if (batchResult.error || !batchResult.batches) {
                setTxStatus({
                    state: 'error',
                    message: 'Validation failed',
                    error: batchResult.error || 'Failed to create batches',
                });
                return;
            }

            // Build the authorization tree
            const authTreeResult = await bulkPaymentService.buildAuthTree(
                walletState.address,
                batchResult.batches
            );

            setTxStatus({ state: 'signing', message: 'Awaiting wallet signature...' });

            // Sign with Freighter using the preimage XDR (Freighter hashes it internally)
            // Freighter returns the signature (signed hash), not a full auth entry
            const signResult = await signAuthEntry(authTreeResult.authPreimageXdr);

            if (isWalletError(signResult)) {
                if (signResult.code === WalletErrorCode.USER_REJECTED) {
                    setTxStatus({
                        state: 'error',
                        message: 'Signing cancelled',
                        error: 'You cancelled the signing request',
                    });
                } else {
                    setTxStatus({
                        state: 'error',
                        message: 'Signing failed',
                        error: signResult.message,
                    });
                }
                return;
            }

            setTxStatus({ state: 'submitting', message: 'Attaching signature and submitting...' });

            // Freighter returns the signature as base64 - decode it
            // Use atob for browser compatibility, then convert to Buffer for the SDK
            const binaryString = atob(signResult.signedAuthEntry);
            const signatureBytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                signatureBytes[i] = binaryString.charCodeAt(i);
            }
            const signatureBuffer = Buffer.from(signatureBytes);

            // Attach the signature to the auth entry
            const signedAuthEntry = await bulkPaymentService.signAuthEntry(
                authTreeResult.authEntry,
                walletState.address,
                async () => signatureBuffer, // Return the signature we already have
                authTreeResult.authPayload
            );

            // Get service account secret key from environment
            // ⚠️ WARNING: This is insecure and only for testnet/development
            const serviceSecretKey = process.env.NEXT_PUBLIC_SERVICE_SECRET_KEY;

            if (!serviceSecretKey) {
                setTxStatus({
                    state: 'error',
                    message: 'Configuration error',
                    error: 'Service account key not configured. Set NEXT_PUBLIC_SERVICE_SECRET_KEY in .env.local',
                });
                return;
            }

            // Submit the transaction to the network
            const txResult = await bulkPaymentService.submitTransaction(
                signedAuthEntry,
                serviceSecretKey
            );

            if (txResult.success) {
                setTxStatus({
                    state: 'success',
                    message: `Payment successful! ${batchResult.stats?.totalRecipients} recipients paid.`,
                    hash: txResult.hash,
                });
            } else {
                setTxStatus({
                    state: 'error',
                    message: 'Transaction failed',
                    error: txResult.error || 'Unknown error during submission',
                });
            }

        } catch (error: any) {
            console.error('Batch payment error:', error);
            setTxStatus({
                state: 'error',
                message: 'Transaction failed',
                error: error.message || 'Unknown error occurred',
            });
        }
    };

    // Reset transaction
    const resetTransaction = () => {
        setTxStatus({ state: 'idle', message: 'Ready to process payments' });
        setIsVisualizationComplete(false);
    };

    // Determine if actively processing (transaction in progress OR waiting for visualization to complete)
    const isTransactionInProgress = ['preparing', 'signing', 'submitting'].includes(txStatus.state);

    // Button shows loading until BOTH transaction completes AND visualization animation finishes
    // This ensures synchronized completion experience
    const isProcessing = isTransactionInProgress ||
        (txStatus.state === 'success' && !isVisualizationComplete);

    const canSubmit = validRecipients.length > 0 && walletState.isConnected && !isProcessing;

    return (
        <section className='w-screen h-screen'>

            <NeuralBackground
                color="#818cf8" // Indigo-400
                trailOpacity={0.1} // Lower = longer trails
                speed={0.8}
            />
            <div className="min-h-screen absolute top-0 text-white font-mono flex flex-col items-center justify-center w-full">

                {/* Navigation */}
                <nav className="w-full flex items-center justify-between py-6 px-8 lg:px-16 fixed top-0 left-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/5">
                    <div className="flex items-center gap-x-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                        <div className="w-px h-6 bg-white/20 font-mono" />
                        <a href="/" className="text-white/80 hover:text-white transition-colors flex items-center">
                            <img src="/Tess-W.png" alt="Tesseract" className="h-7 w-7 inline-block mr-2" />
                            <span className="hidden sm:inline font-mono">TESSERACT</span>
                        </a>
                    </div>

                    {/* Wallet Connection */}
                    <div className="flex items-center gap-4">
                        <NetworkBadge />
                        <ConnectWalletButton />
                    </div>
                </nav>

                {/* Main Content */}
                <div className="pt-20 pb-12 px-4 md:px-8 font-mono mt-8">
                    {/* Header */}
                    <div className="max-w-7xl mx-auto mb-6 text-center">
                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl">
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-muted font-mono">
                                Batch Payment
                            </span>
                        </h1>
                        <p className="text-sm md:text-md lg:text-lg  tracking-tighter text-white/40 mb-6 drop-shadow-2xl">
                            Pay up to {SAFE_LIMITS.MAX_TOTAL_RECIPIENTS} recipients with a single signature
                        </p>
                    </div>

                    {/* Freighter Not Installed Warning */}
                    {!walletState.isInstalled && (
                        <div className="max-w-6xl mx-auto mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <p className="text-yellow-200 font-medium">Freighter Wallet Required</p>
                                    <p className="text-yellow-200/70 text-sm">
                                        Install the{' '}
                                        <a
                                            href="https://freighter.app"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline hover:text-yellow-100"
                                        >
                                            View on Stellar Expert →
                                        </a>
                                    </p>
                                </div>
                                {(txStatus.state === 'error' || txStatus.state === 'success') && (
                                    <button
                                        onClick={resetTransaction}
                                        className="mt-3 text-sm text-white/50 hover:text-white"
                                    >
                                        {txStatus.state === 'success' ? 'New Payment' : 'Try Again'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Right Column - Auth Tree Visualization */}
                    <div className="space-y-6 bg-gradient-to-br from-white/5 to-muted/10 backdrop-blur-lg rounded-2xl border border-white/10 p-6">

                        {/* <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-white/4 p-6">
                            <h3 className="text-lg font-semibold mb-4">How It Works</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400">
                                        1
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">Add Recipients</div>
                                        <div className="text-xs text-white/50">
                                            Upload a CSV or manually enter up to {SAFE_LIMITS.MAX_TOTAL_RECIPIENTS} recipients
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400">
                                        2
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">Build Auth Tree</div>
                                        <div className="text-xs text-white/50">
                                            Recipients are split into batches of {SAFE_LIMITS.MAX_RECIPIENTS_PER_BATCH} for optimal processing
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400">
                                        3
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">Sign with Freighter</div>
                                        <div className="text-xs text-white/50">
                                            One signature authorizes all payments atomically
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs text-green-400">
                                        4
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">Execute</div>
                                        <div className="text-xs text-white/50">
                                            All payments succeed or fail together in one transaction
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                     */}

                        {/* Content Grid */}
                        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column - Recipients Input */}
                            <div className="space-y-6 bg-gradient-to-br from-white/5 to-muted/10 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                                <div className="backdrop-blur-lg rounded-2xl  p-6">
                                    <h2 className="text-lg font-semibold mb-4">Recipients</h2>
                                    <RecipientsInput
                                        recipients={recipients}
                                        onRecipientsChange={setRecipients}
                                        disabled={isProcessing}
                                    />
                                </div>

                                {/* Payment Summary */}
                                {validRecipients.length > 0 && <div className="bg-black/40 backdrop-blur-lg rounded-2xl  p-6">
                                    <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/60">Recipients</span>
                                            <span className="font-medium">{validRecipients.length}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/60">Batches</span>
                                            <span className="font-medium">{batchInfo.length}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/60">Total Amount</span>
                                            <span className="font-medium">{totalAmount.toFixed(7)} XLM</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/60">Signatures Required</span>
                                            <span className="font-medium text-green-400">1</span>
                                        </div>
                                        <div className="h-px bg-white/10" />
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/60">Estimated Fee</span>
                                            <span className="font-medium text-white/80">~0.01 XLM</span>
                                        </div>
                                        {walletState.address && (
                                            <>
                                                <div className="h-px bg-white/10" />
                                                <div className="flex justify-between items-center">
                                                    <span className="text-white/60">From</span>
                                                    <span className="font-mono text-sm text-white/80">
                                                        {formatAddress(walletState.address)}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>}

                                {/* Action Button */}
                                <button
                                    onClick={executeBatchPayment}
                                    disabled={!canSubmit}
                                    className={`w-full overflow-hidden py-4 rounded-xl font-medium text-lg transition-all ${canSubmit
                                        ? 'bg-gradient-to-br from-white/60 to-mute text-black hover:opacity-90'
                                        : ' text-white/40 cursor-not-allowed'
                                        }`}
                                >
                                    {isProcessing ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            {txStatus.state === 'success'
                                                ? 'Completing...'
                                                : txStatus.message}
                                        </span>
                                    ) : !walletState.isConnected ? (
                                        'Connect Wallet to Continue'
                                    ) : validRecipients.length === 0 ? (
                                        'Add Recipients to Continue'
                                    ) : (
                                        `Pay ${validRecipients.length} Recipients`
                                    )}
                                </button>

                                {/* Status Message */}
                                {txStatus.state !== 'idle' && (
                                    <div
                                        className={`p-4 rounded-xl border ${txStatus.state === 'error'
                                            ? 'bg-red-500/10 border-red-500/20'
                                            : txStatus.state === 'success'
                                                ? 'bg-green-500/10 border-green-500/20'
                                                : 'bg-blue-500/10 border-blue-500/20'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {txStatus.state === 'success' && (
                                                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            {txStatus.state === 'error' && (
                                                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            <span
                                                className={
                                                    txStatus.state === 'error'
                                                        ? 'text-red-400'
                                                        : txStatus.state === 'success'
                                                            ? 'text-green-400'
                                                            : 'text-blue-400'
                                                }
                                            >
                                                {txStatus.message}
                                            </span>
                                        </div>
                                        {txStatus.error && (
                                            <p className="mt-2 text-sm text-white/50">{txStatus.error}</p>
                                        )}
                                        {txStatus.hash && txStatus.state === 'success' && (
                                            <div className="mt-3">
                                                <a
                                                    href={`https://stellar.expert/explorer/testnet/tx/${txStatus.hash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-400 hover:text-blue-300 font-mono break-all"
                                                >
                                                    View on Stellar Expert →
                                                </a>
                                                <p className="text-xs text-white/40 mt-2 font-mono">
                                                    TX: {txStatus.hash}
                                                </p>
                                            </div>
                                        )}
                                        {(txStatus.state === 'error' || txStatus.state === 'success') && (
                                            <button
                                                onClick={resetTransaction}
                                                className="mt-3 text-sm text-white/50 hover:text-white"
                                            >
                                                {txStatus.state === 'success' ? 'New Payment' : 'Try Again'}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Auth Tree Visualization */}
                            <div className="space-y-6 bg-gradient-to-br from-white/5 to-muted/10 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                                <AuthTreeVisualization
                                    batches={batchInfo}
                                    isProcessing={isTransactionInProgress}
                                    isComplete={txStatus.state === 'success'}
                                    transactionHash={txStatus.hash}
                                    transactionState={txStatus.state}
                                    onVisualizationComplete={handleVisualizationComplete}
                                />

                                {/* How It Works */}
                                <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-white/4 p-6">
                                    <h3 className="text-lg font-semibold mb-4">How It Works</h3>
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400">
                                                1
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">Add Recipients</div>
                                                <div className="text-xs text-white/50">
                                                    Upload a CSV or manually enter up to {SAFE_LIMITS.MAX_TOTAL_RECIPIENTS} recipients
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400">
                                                2
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">Build Auth Tree</div>
                                                <div className="text-xs text-white/50">
                                                    Recipients are split into batches of {SAFE_LIMITS.MAX_RECIPIENTS_PER_BATCH} for optimal processing
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400">
                                                3
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">Sign with Freighter</div>
                                                <div className="text-xs text-white/50">
                                                    One signature authorizes all payments atomically
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs text-green-400">
                                                4
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">Execute</div>
                                                <div className="text-xs text-white/50">
                                                    All payments succeed or fail together in one transaction
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Limits Info */}
                                <div className="bg-white/5 rounded-xl p-4">
                                    <h4 className="text-sm font-medium mb-3">Current Limits</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex justify-between border border-white/10 p-2 rounded-lg">
                                            <span className="text-white/50">Max Recipients</span>
                                            <span>{SAFE_LIMITS.MAX_TOTAL_RECIPIENTS}</span>
                                        </div>
                                        <div className="flex justify-between border border-white/10 p-2 rounded-lg">
                                            <span className="text-white/50">Per Batch</span>
                                            <span>{SAFE_LIMITS.MAX_RECIPIENTS_PER_BATCH}</span>
                                        </div>
                                        <div className="flex justify-between border border-white/10 p-2 rounded-lg">
                                            <span className="text-white/50">Max Batches</span>
                                            <span>{SAFE_LIMITS.MAX_BATCHES}</span>
                                        </div>
                                        <div className="flex justify-between border border-white/10 p-2 rounded-lg">
                                            <span className="text-white/50">Network</span>
                                            <span className="text-yellow-400">Testnet</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="border-t border-white/10 py-6 px-8 lg:px-16">
                        <div className="max-w-6xl mx-auto flex flex-col items-center justify-between text-sm text-white/70">
                            <span>Uses Authorisation trees for bulk signature traversal and internal contract calls.</span>
                            <span>Powered by Stellar Soroban</span>
                        </div>
                    </footer>
                </div>
            </div>
        </section>
    );
}

// Wrap with WalletProvider
export default function BatchPayments() {
    return (
        <WalletProvider>
            <BatchPaymentsContent />
        </WalletProvider>
    );
}
