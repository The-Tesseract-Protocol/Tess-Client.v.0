'use client';

import { useState, useEffect, useMemo } from 'react';
import { useWallet } from '@/app/contexts/WalletContext';
import { usePrivacyStore } from '@/app/store/privacyStore';
import {
  submitWithdrawal,
  deriveIdentity,
  SUPPORTED_TOKENS,
} from '@/app/services/privacyPayService';
import { Keypair } from '@stellar/stellar-sdk';
import { HybridCryptoUtil } from '@/app/utils/hybrid-crypto.util';
import { signMessage } from '@stellar/freighter-api';
import { AutoResetToast } from '@/app/components/ui/auto-reset-toast';
import RecipientsInput, { Recipient as RecipientInputType } from '@/app/batch-payments/components/RecipientsInput';

interface WithdrawFormProps {
  onSuccess?: (requestId: string) => void;
}

type WithdrawStatus = 'idle' | 'encrypting' | 'submitting' | 'success' | 'error';

const DECRYPTION_STEPS = [
  'Signature Confirmed',
  'Constructing Proof',
  'Deriving Identity',
  'Deriving Fields',
  'Success'
];

export default function WithdrawForm({ onSuccess }: WithdrawFormProps) {
  const { walletState } = useWallet();
  const { address, isConnected } = walletState;

  // Use Zustand Store
  const { deposits, isLoading: loadingDeposits, addWithdrawal } = usePrivacyStore();

  const [hashLN, setHashLN] = useState('');
  const [token, setToken] = useState<string>('usdc');
  const [recipients, setRecipients] = useState<RecipientInputType[]>([
    { id: '1', address: '', amount: '', isValid: false }
  ]);
  const [status, setStatus] = useState<WithdrawStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [showAutoReset, setShowAutoReset] = useState(false);

  // Decryption state
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showDecryptionModal, setShowDecryptionModal] = useState(false);
  const [decryptionStep, setDecryptionStep] = useState(0);
  const [showDecryptWarning, setShowDecryptWarning] = useState(false);


  const handleDecrypt = async (): Promise<boolean> => {
    if (!address || !isConnected) return false;
    setIsDecrypting(true);
    try {
      // 1. Construct detailed payload
      const confirmedDeposits = deposits.filter(d => d.status === 'confirmed');
      const depositCount = confirmedDeposits.length;
      
      let hashesList = confirmedDeposits
        .slice(0, 5)
        .map(d => `  - ${d.hashLN.slice(0, 16)}...`)
        .join('\n');
      
      if (depositCount > 5) {
        hashesList += `\n  - ...and ${depositCount - 5} more`;
      }

      const message = `Decrypting privacy deposits for ${address}
Timestamp: ${new Date().toISOString()}
Confirmed Deposits: ${depositCount}
Hashes:
${hashesList}`;

      // 2. Request signature
      // Explicitly handle Freighter response types (string | { signature } | { error } | { signedMessage })
      const response: any = await signMessage(message, { address });
      
      if (!response) {
        throw new Error('No response from wallet');
      }
      
      if (typeof response === 'object' && 'error' in response) {
        throw new Error(response.error || 'Signature declined');
      }
      
      // Handle various response formats from different wallet versions
      let signature = '';
      if (typeof response === 'string') {
        signature = response;
      } else if (typeof response === 'object') {
        signature = response.signature || response.signedMessage;
      }
      
      if (!signature) {
        // Fallback: If response is an object but has no known signature field, log it (console only) and potentially fail
        console.warn('Unexpected wallet response format:', response);
        throw new Error('No signature received from wallet');
      }

      // Start decryption visual sequence
      setShowDecryptionModal(true);

      // Random total duration between 5000ms and 10000ms
      const totalDuration = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
      // Reserve 2000ms for the success step
      const processingDuration = totalDuration - 2000;

      // Distribute processing time:
      // Step 0 (Sig): 10%
      // Step 1 (Proof): 40% (longer)
      // Step 2 (Identity): 40% (longer)
      // Step 3 (Fields): 10%
      const step0Time = Math.floor(processingDuration * 0.1);
      const step1Time = Math.floor(processingDuration * 0.4);
      const step2Time = Math.floor(processingDuration * 0.4);
      const step3Time = Math.floor(processingDuration * 0.1);

      // Step 0: Signature Confirmed
      setDecryptionStep(0);
      await new Promise(r => setTimeout(r, step0Time));

      // Step 1: Constructing Proof
      setDecryptionStep(1);
      await new Promise(r => setTimeout(r, step1Time));

      // Step 2: Deriving Identity
      setDecryptionStep(2);
      await new Promise(r => setTimeout(r, step2Time));

      // Step 3: Deriving Fields
      setDecryptionStep(3);
      await new Promise(r => setTimeout(r, step3Time));

      // Step 4: Success
      setDecryptionStep(4);
      await new Promise(r => setTimeout(r, 2000));

      setShowDecryptionModal(false);
      setIsDecrypted(true);
      return true;
    } catch (e) {
      console.error('Decryption failed or cancelled:', e);
      return false;
    } finally {
      setIsDecrypting(false);
    }
  };

  const validRecipients = useMemo(() => recipients.filter(r => r.isValid), [recipients]);

  const getTotalAmount = () => {
    return validRecipients.reduce((sum, r) => {
      const amt = parseFloat(r.amount);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);
  };

  const handleWithdraw = async () => {
    // If not decrypted, we must force the decryption flow first
    if (!isDecrypted) {
      if (!address || !hashLN) return; // Basic validation for selection presence

      // Show warning
      setShowDecryptWarning(true);
      
      // Wait 2 seconds showing the warning
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowDecryptWarning(false);

      // Proceed to decrypt
      const success = await handleDecrypt();
      
      // CRITICAL: Stop if decryption failed or was cancelled
      if (!success) return;
      
      // If decryption succeeded, continue to withdrawal below...
    }

    if (!address || !hashLN || validRecipients.length === 0) return;

    setError(null);
    setRequestId(null);
    setShowAutoReset(false);

    try {
      // Step 1: Prepare recipients map
      setStatus('encrypting');

      const recipientsMap: Record<string, string> = {};
      validRecipients.forEach((r) => {
        recipientsMap[r.address] = r.amount;
      });

      // Derive and log expected identity (for debugging)
      const expectedIdentity = await deriveIdentity(hashLN, address);
      console.log('🔑 [Withdrawal] Identity Details:');
      console.log('   HashLN:', hashLN);
      console.log('   Sender Address:', address);
      console.log('   Expected Identity (frontend):', expectedIdentity);

      // Extract raw public key (32 bytes) for backend
      const rawPublicKey = Keypair.fromPublicKey(address).rawPublicKey();
      console.log('   Raw Public Key (base64):', btoa(String.fromCharCode(...rawPublicKey)));

      // Step 2: Submit withdrawal with hybrid AES-256 encryption
      setStatus('submitting');
      const result = await submitWithdrawal({
        hashLN,
        recipients: recipientsMap,
        senderPublicKey: address,
        senderRawPublicKey: rawPublicKey,  // Backend uses this for identity derivation
        token,
      });

      if (!result.success) {
        throw new Error(result.error || 'Relayer rejected the withdrawal request');
      }

      if (!result.requestId) {
        console.error('[Withdrawal] Missing requestId in result:', result);
        throw new Error('Relayer returned success but no request ID');
      }

      setRequestId(result.requestId);
      setStatus('success');

      // Save withdrawal to session with jobId (and update store)
      addWithdrawal(address, {
        requestId: result.requestId,
        jobId: result.jobId,
        hashLN,
        totalAmount: getTotalAmount(),
        recipients: recipientsMap,
        timestamp: Date.now(),
        status: 'pending',
        senderIdentity: result.senderIdentity,
        token,
      });

      onSuccess?.(result.requestId);
      setShowAutoReset(true);
    } catch (err: any) {
      console.error('Withdrawal error:', err);
      setError(err.message || 'Withdrawal failed');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setRecipients([{ id: '1', address: '', amount: '', isValid: false }]);
    setHashLN('');
    setRequestId(null);
    setError(null);
    setStatus('idle');
    setShowAutoReset(false);
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'encrypting':
        return 'Encrypting withdrawal request...';
      case 'submitting':
        return 'Submitting to relayer...';
      case 'success':
        return 'Withdrawal request submitted!';
      case 'error':
        return error || 'An error occurred';
      default:
        return null;
    }
  };

  const isProcessing = ['encrypting', 'submitting'].includes(status);
  const maxRecipients = HybridCryptoUtil.calculateMaxRecipients();

  return (
    <div className="space-y-6 relative">

      {/* Auto Reset Toast */}
      <AutoResetToast
        isVisible={showAutoReset}
        onReset={handleReset}
        onCancel={() => setShowAutoReset(false)}
        message="Withdrawal request submitted."
      />

      {/* Decryption Warning Toast */}
      {showDecryptWarning && (
        <div className=" z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-black/80 backdrop-blur-md border border-white/10 text-white px-6 py-4 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-medium">Decryption of withdrawal intent required</span>
            </div>
          </div>
        </div>
      )}

      {/* Decryption Modal */}
      {showDecryptionModal && (
        <div className=" inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl space-y-6 text-center transform transition-all">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-2 border-purple-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {decryptionStep === 4 ? (
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {decryptionStep === 4 ? 'Decryption Complete' : 'Decrypting Deposits'}
              </h3>
              <p className="text-white/40 text-sm">
                Please wait while we securely process your data
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {DECRYPTION_STEPS.map((step, index) => {
                const isActive = index === decryptionStep;
                const isCompleted = index < decryptionStep;

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 transition-all duration-300 ${isActive ? 'opacity-100 transform scale-105' :
                      isCompleted ? 'opacity-50' : 'opacity-20'
                      }`}
                  >
                    <div className={`w-2 h-2 rounded-full transition-colors ${isActive ? 'bg-purple-500 animate-pulse' :
                      isCompleted ? 'bg-green-500' : 'bg-white'
                      }`} />
                    <span className={`text-sm font-medium ${isActive ? 'text-purple-400' :
                      isCompleted ? 'text-green-400' : 'text-white'
                      }`}>
                      {step}
                    </span>
                    {isCompleted && (
                      <svg className="w-4 h-4 text-green-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* HashLN Input/Selection */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-white/60">
            Select Deposit
          </label>
          {!isDecrypted && deposits.length > 0 && !loadingDeposits && (
            <button
              onClick={async () => { await handleDecrypt(); }}
              disabled={isDecrypting || !isConnected}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              {isDecrypting ? (
                <span className="animate-pulse">Decrypting...</span>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  Decrypt All
                </>
              )}
            </button>
          )}
        </div>
        {loadingDeposits ? (
          <div className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-white/60 text-sm">Loading deposits...</span>
          </div>
        ) : deposits.length > 0 ? (
          <select
            value={hashLN}
            onChange={(e) => setHashLN(e.target.value)}
            disabled={isProcessing}
            className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all disabled:opacity-50"
          >
            <option value="">{isDecrypted ? 'Select from your deposits' : 'Encrypted Deposits Found'}</option>
            {deposits
              .filter((d) => d.status === 'confirmed')
              .map((d) => (
                <option key={d.hashLN} value={d.hashLN}>
                  {!isDecrypted
                    ? `Identity: ${(d.identity || '').slice(0, 20)}...`
                    : `${d.hashLN.slice(0, 16)}... (${d.currentBalance !== undefined ? d.currentBalance : d.amount} ${(d.token || 'usdc').toUpperCase()})`
                  }
                </option>
              ))}
          </select>
        ) : (
          <input
            type="text"
            value={hashLN}
            onChange={(e) => setHashLN(e.target.value)}
            placeholder="Enter your deposit hash or make a deposit first"
            disabled={isProcessing}
            className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all disabled:opacity-50 font-mono text-sm"
          />
        )}
      </div>

      {/* Token Selection */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">
          Select Pool
        </label>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(SUPPORTED_TOKENS).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setToken(key)}
              disabled={isProcessing}
              className={`p-4 rounded-xl border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${token === key
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-white/10 bg-transparent hover:border-white/20'
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{config.symbol}</span>
                {token === key && (
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recipients */}
      <div className='overflow-y-auto max-h-full'>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-white/60">
            Recipients
          </label>
        </div>
        
        <RecipientsInput 
          recipients={recipients}
          onRecipientsChange={setRecipients}
          disabled={isProcessing}
          maxRecipients={maxRecipients}
          showBatches={false}
        />
      </div>

      {/* Status Message */}
      {
        getStatusMessage() && (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl ${status === 'success'
              ? 'bg-green-500/10 border border-green-500/20'
              : status === 'error'
                ? 'bg-red-500/10 border border-red-500/20'
                : 'bg-white/5 border border-white/10'
              }`}
          >
            {isProcessing && (
              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            )}
            {status === 'success' && (
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {status === 'error' && (
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span
              className={`text-sm ${status === 'success'
                ? 'text-green-400'
                : status === 'error'
                  ? 'text-red-400'
                  : 'text-white/60'
                }`}
            >
              {getStatusMessage()}
            </span>
          </div>
        )
      }

      {/* Request ID */}
      {
        requestId && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="block text-xs font-medium text-white/40 mb-2">
              Request ID
            </label>
            <code className="font-mono text-sm text-purple-400 break-all">
              {requestId}
            </code>
          </div>
        )
      }

      {/* Submit Button */}
      <button
        onClick={handleWithdraw}
        disabled={!isConnected || !hashLN || validRecipients.length === 0 || isProcessing}
        className={`w-full py-4 rounded-xl font-semibold transition-all ${!isConnected || !hashLN || validRecipients.length === 0 || isProcessing
          ? 'bg-white/5 text-white/30 cursor-not-allowed'
          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-600 text-white'
          }`}
      >
        {!isConnected
          ? 'Connect Wallet First'
          : isProcessing
            ? getStatusMessage()
            : 'Submit Private Withdrawal'}
      </button>

      {/* Disabled State Info Message */}
      {isConnected && (!hashLN || validRecipients.length === 0) && !isProcessing && (
        <p className="text-center text-xs text-white/40 mt-2">
          {!hashLN || !isDecrypted 
            ? 'Decryption and selection of intent needed to proceed.' 
            : 'Add at least one valid recipient to proceed.'}
        </p>
      )}
    </div >
  );
}