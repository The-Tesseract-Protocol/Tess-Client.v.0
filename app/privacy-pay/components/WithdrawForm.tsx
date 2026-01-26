'use client';

import { useState } from 'react';
import { useWallet } from '@/app/contexts/WalletContext';
import {
  submitWithdrawal,
  saveWithdrawal,
  getDeposits,
} from '@/app/services/privacyPayService';
import { Keypair } from '@stellar/stellar-sdk';

interface Recipient {
  address: string;
  amount: string;
}

interface WithdrawFormProps {
  onSuccess?: (requestId: string) => void;
}

type WithdrawStatus = 'idle' | 'encrypting' | 'submitting' | 'success' | 'error';

export default function WithdrawForm({ onSuccess }: WithdrawFormProps) {
  const { walletState } = useWallet();
  const { address, isConnected } = walletState;
  const [hashLN, setHashLN] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([{ address: '', amount: '' }]);
  const [status, setStatus] = useState<WithdrawStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  // Get user's deposits for hashLN selection
  const userDeposits = address ? getDeposits(address) : [];

  const addRecipient = () => {
    setRecipients([...recipients, { address: '', amount: '' }]);
  };

  const removeRecipient = (index: number) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index));
    }
  };

  const updateRecipient = (index: number, field: 'address' | 'amount', value: string) => {
    const updated = [...recipients];
    updated[index][field] = value;
    setRecipients(updated);
  };

  const getTotalAmount = () => {
    return recipients.reduce((sum, r) => {
      const amt = parseFloat(r.amount);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);
  };

  const isValidRecipient = (r: Recipient) => {
    return (
      r.address.length === 56 &&
      r.address.startsWith('G') &&
      !isNaN(parseFloat(r.amount)) &&
      parseFloat(r.amount) > 0
    );
  };

  const allRecipientsValid = recipients.every(isValidRecipient);

  const handleWithdraw = async () => {
    if (!address || !hashLN || !allRecipientsValid) return;

    setError(null);
    setRequestId(null);

    try {
      // Step 1: Prepare recipients map
      setStatus('encrypting');

      const recipientsMap: Record<string, string> = {};
      recipients.forEach((r) => {
        recipientsMap[r.address] = r.amount;
      });

      // Get raw public key from address (32 bytes)
      // Note: In a real implementation, you'd need to get this from the wallet
      // For now, we'll derive it from the Stellar address
      const rawPublicKey = Keypair.fromPublicKey(address).rawPublicKey();

      // Step 2: Submit withdrawal
      setStatus('submitting');
      const result = await submitWithdrawal({
        hashLN,
        recipients: recipientsMap,
        senderPublicKey: address,
        senderRawPublicKey: rawPublicKey,
      });

      if (result.success && result.requestId) {
        setRequestId(result.requestId);
        setStatus('success');

        // Save withdrawal to session
        saveWithdrawal(address, {
          requestId: result.requestId,
          hashLN,
          totalAmount: getTotalAmount(),
          recipients: recipientsMap,
          timestamp: Date.now(),
          status: 'pending',
        });

        onSuccess?.(result.requestId);
      } else {
        throw new Error(result.error || 'Withdrawal request failed');
      }
    } catch (err: any) {
      console.error('Withdrawal error:', err);
      setError(err.message || 'Withdrawal failed');
      setStatus('error');
    }
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

  return (
    <div className="space-y-6">
      {/* HashLN Input/Selection */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-2">
          Deposit Hash (hashLN)
        </label>
        {userDeposits.length > 0 ? (
          <select
            value={hashLN}
            onChange={(e) => setHashLN(e.target.value)}
            disabled={isProcessing}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all disabled:opacity-50"
          >
            <option value="">Select from your deposits</option>
            {userDeposits
              .filter((d) => d.status === 'confirmed')
              .map((d) => (
                <option key={d.hashLN} value={d.hashLN}>
                  {d.hashLN.slice(0, 16)}... ({d.amount} USDC)
                </option>
              ))}
          </select>
        ) : (
          <input
            type="text"
            value={hashLN}
            onChange={(e) => setHashLN(e.target.value)}
            placeholder="Enter your deposit hash"
            disabled={isProcessing}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all disabled:opacity-50 font-mono text-sm"
          />
        )}
        <p className="mt-2 text-xs text-white/40">
          You can also paste a hash manually if you have one saved
        </p>
        {userDeposits.length > 0 && (
          <input
            type="text"
            value={hashLN}
            onChange={(e) => setHashLN(e.target.value)}
            placeholder="Or paste hash manually"
            disabled={isProcessing}
            className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all disabled:opacity-50 font-mono text-sm"
          />
        )}
      </div>

      {/* Recipients */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-white/60">
            Recipients
          </label>
          <button
            onClick={addRecipient}
            disabled={isProcessing}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
          >
            + Add Recipient
          </button>
        </div>

        <div className="space-y-3">
          {recipients.map((recipient, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={recipient.address}
                onChange={(e) => updateRecipient(index, 'address', e.target.value)}
                placeholder="G..."
                disabled={isProcessing}
                className={`flex-1 bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-1 transition-all disabled:opacity-50 font-mono text-sm ${
                  recipient.address && !recipient.address.startsWith('G')
                    ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50'
                    : 'border-white/10 focus:border-blue-500/50 focus:ring-blue-500/50'
                }`}
              />
              <input
                type="number"
                value={recipient.amount}
                onChange={(e) => updateRecipient(index, 'amount', e.target.value)}
                placeholder="Amount"
                disabled={isProcessing}
                className="w-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all disabled:opacity-50"
              />
              {recipients.length > 1 && (
                <button
                  onClick={() => removeRecipient(index)}
                  disabled={isProcessing}
                  className="p-3 hover:bg-white/10 rounded-xl transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-white/60">Total Withdrawal</span>
          <span className="text-xl font-semibold text-white">
            {getTotalAmount().toFixed(2)} USDC
          </span>
        </div>
        <div className="flex justify-between items-center mt-2 text-sm">
          <span className="text-white/40">Recipients</span>
          <span className="text-white/60">{recipients.filter(isValidRecipient).length}</span>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div className="text-sm text-white/60">
            <p className="text-purple-400 font-medium mb-1">Privacy Protection</p>
            <ul className="space-y-1 text-white/50">
              <li>Recipients are encrypted end-to-end</li>
              <li>Relayer cannot see who receives funds</li>
              <li>Only the Distributor can decrypt recipients</li>
            </ul>
          </div>
        </div>
      </div>

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

      {/* Request ID */}
      {requestId && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <label className="block text-xs font-medium text-white/40 mb-2">
            Request ID
          </label>
          <code className="font-mono text-sm text-purple-400 break-all">
            {requestId}
          </code>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleWithdraw}
        disabled={!isConnected || !hashLN || !allRecipientsValid || isProcessing}
        className={`w-full py-4 rounded-xl font-semibold transition-all ${
          !isConnected || !hashLN || !allRecipientsValid || isProcessing
            ? 'bg-white/10 text-white/30 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
        }`}
      >
        {!isConnected
          ? 'Connect Wallet First'
          : isProcessing
          ? getStatusMessage()
          : 'Submit Private Withdrawal'}
      </button>
    </div>
  );
}
