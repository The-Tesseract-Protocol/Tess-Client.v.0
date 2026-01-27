'use client';

import { useState } from 'react';
import { useWallet } from '@/app/contexts/WalletContext';
import {
  buildDepositTransaction,
  submitDepositTransaction,
  generateHashLN,
  deriveIdentity,
  getCurrentLedger,
  generateWalletNonce,
  saveDeposit,
  updateDepositStatus,
} from '@/app/services/privacyPayService';
import { signTransaction } from '@stellar/freighter-api';

interface DepositFormProps {
  onSuccess?: (txHash: string, hashLN: string) => void;
}

type DepositStatus = 'idle' | 'generating' | 'building' | 'signing' | 'submitting' | 'success' | 'error';

export default function DepositForm({ onSuccess }: DepositFormProps) {
  const { walletState } = useWallet();
  const { address, isConnected } = walletState;
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<DepositStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [generatedHashLN, setGeneratedHashLN] = useState<string | null>(null);

  const handleDeposit = async () => {
    if (!address || !amount) return;

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setError(null);
    setTxHash(null);

    try {
      // Step 1: Generate hashLN
      setStatus('generating');
      const ledgerNumber = await getCurrentLedger();
      const walletNonce = generateWalletNonce();
      const hashLN = await generateHashLN(ledgerNumber, walletNonce);
      setGeneratedHashLN(hashLN);

      // Derive identity for tracking
      const identity = await deriveIdentity(hashLN, address);

      console.log('🔑 [Deposit] Identity Details:');
      console.log('   HashLN:', hashLN);
      console.log('   Depositor Address:', address);
      console.log('   Expected Identity:', identity);

      // Save pending deposit to session
      saveDeposit(address, {
        hashLN,
        identity,
        amount: depositAmount,
        txHash: '',
        timestamp: Date.now(),
        status: 'pending',
      });

      // Step 2: Build transaction
      setStatus('building');
      const txXdr = await buildDepositTransaction({
        depositorAddress: address,
        hashLN,
        amount: depositAmount,
      });

      // Step 3: Sign with Freighter
      setStatus('signing');
      const signResult = await signTransaction(txXdr, {
        networkPassphrase: 'Test SDF Network ; September 2015',
      });

      if (typeof signResult === 'string') {
        throw new Error('Signing was cancelled');
      }

      const signedXdr = signResult.signedTxXdr;

      // Step 4: Submit transaction
      setStatus('submitting');
      const result = await submitDepositTransaction(signedXdr);

      if (result.success && result.txHash) {
        setTxHash(result.txHash);
        setStatus('success');
        updateDepositStatus(address, hashLN, 'confirmed', result.txHash);
        onSuccess?.(result.txHash, hashLN);
      } else {
        throw new Error(result.error || 'Transaction failed');
      }
    } catch (err: any) {
      console.error('Deposit error:', err);
      setError(err.message || 'Deposit failed');
      setStatus('error');
      if (generatedHashLN && address) {
        updateDepositStatus(address, generatedHashLN, 'failed');
      }
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'generating':
        return 'Generating secure hash...';
      case 'building':
        return 'Building transaction...';
      case 'signing':
        return 'Please sign in Freighter...';
      case 'submitting':
        return 'Submitting to Stellar...';
      case 'success':
        return 'Deposit successful!';
      case 'error':
        return error || 'An error occurred';
      default:
        return null;
    }
  };

  const isProcessing = ['generating', 'building', 'signing', 'submitting'].includes(status);

  return (
    <div className="space-y-6">
      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">
          Deposit Amount (USDC)
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            disabled={isProcessing}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">
            USDC
          </span>
        </div>
      </div>

      {/* Info Box */}
     

      {/* Generated HashLN Display */}
     

      {/* Status Message */}
      {getStatusMessage() && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl ${
            status === 'success'
              ? 'bg-green-500/10 border border-green-500/20'
              : status === 'error'
              ? 'bg-red-500/10 border border-red-500/20'
              : 'bg-white/5 border border-white/10'
          }`}
        >
          {isProcessing && (
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
            className={`text-sm ${
              status === 'success'
                ? 'text-green-400'
                : status === 'error'
                ? 'text-red-400'
                : 'text-white/60'
            }`}
          >
            {getStatusMessage()}
          </span>
        </div>
      )}

      {/* Transaction Hash */}
      {txHash && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <label className="block text-xs font-medium text-white/40 mb-2">
            Transaction Hash
          </label>
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-blue-400 hover:text-blue-300 transition-colors break-all"
          >
            {txHash}
          </a>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleDeposit}
        disabled={!isConnected || !amount || isProcessing}
        className={`w-full py-4 rounded-xl font-semibold transition-all ${
          !isConnected || !amount || isProcessing
            ? 'bg-white/10 text-white/30 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
        }`}
      >
        {!isConnected
          ? 'Connect Wallet First'
          : isProcessing
          ? getStatusMessage()
          : 'Deposit to Privacy Pool'}
      </button>
    </div>
  );
}
