'use client';

import { useState, useRef } from 'react';
import { useWallet } from '@/app/contexts/WalletContext';
import {
  submitWithdrawal,
  saveWithdrawal,
  getDeposits,
  deriveIdentity,
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
type InputMode = 'manual' | 'csv';

export default function WithdrawForm({ onSuccess }: WithdrawFormProps) {
  const { walletState } = useWallet();
  const { address, isConnected } = walletState;
  const [hashLN, setHashLN] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([{ address: '', amount: '' }]);
  const [status, setStatus] = useState<WithdrawStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  // CSV upload state
  const [inputMode, setInputMode] = useState<InputMode>('manual');
  const [csvError, setCsvError] = useState<string | null>(null);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user's deposits for hashLN selection
  const userDeposits = address ? getDeposits(address) : [];

  // CSV parsing function
  const parseCSV = (content: string): { recipients: Recipient[]; error?: string } => {
    const lines = content.trim().split('\n');
    const parsedRecipients: Recipient[] = [];

    // Detect and skip header
    let startLine = 0;
    const firstLine = lines[0]?.toLowerCase() || '';
    if (firstLine.includes('address') || firstLine.includes('recipient') || firstLine.includes('amount')) {
      startLine = 1;
    }

    for (let i = startLine; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(',').map((p) => p.trim());
      if (parts.length < 2) {
        return { recipients: [], error: `Invalid format at line ${i + 1}: expected "address,amount"` };
      }

      const addr = parts[0];
      const amount = parts[1];

      // Validate address
      if (!addr || addr.length !== 56 || !addr.startsWith('G')) {
        return { recipients: [], error: `Invalid Stellar address at line ${i + 1}: ${addr}` };
      }

      // Validate amount
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        return { recipients: [], error: `Invalid amount at line ${i + 1}: ${amount}` };
      }

      parsedRecipients.push({ address: addr, amount });
    }

    if (parsedRecipients.length === 0) {
      return { recipients: [], error: 'No valid recipients found in CSV' };
    }

    if (parsedRecipients.length > 10) {
      return { recipients: [], error: 'Maximum 10 recipients allowed per withdrawal' };
    }

    return { recipients: parsedRecipients };
  };

  // Handle CSV file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvError(null);
    setCsvFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = parseCSV(content);

      if (result.error) {
        setCsvError(result.error);
        setRecipients([{ address: '', amount: '' }]);
      } else {
        setRecipients(result.recipients);
        setCsvError(null);
      }
    };
    reader.onerror = () => {
      setCsvError('Failed to read file');
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle mode switch
  const handleModeSwitch = (mode: InputMode) => {
    setInputMode(mode);
    setCsvError(null);
    setCsvFileName(null);
    if (mode === 'manual') {
      setRecipients([{ address: '', amount: '' }]);
    }
  };

  // Clear CSV and reset
  const clearCSV = () => {
    setRecipients([{ address: '', amount: '' }]);
    setCsvFileName(null);
    setCsvError(null);
  };

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

      // Derive and log expected identity (for debugging)
      const expectedIdentity = await deriveIdentity(hashLN, address);
      console.log('🔑 [Withdrawal] Identity Details:');
      console.log('   HashLN:', hashLN);
      console.log('   Sender Address:', address);
      console.log('   Expected Identity (frontend):', expectedIdentity);

      // Extract raw public key (32 bytes) for backend
      const rawPublicKey = Keypair.fromPublicKey(address).rawPublicKey();
      console.log('   Raw Public Key (base64):', btoa(String.fromCharCode(...rawPublicKey)));

      // Step 2: Submit withdrawal
      setStatus('submitting');
      const result = await submitWithdrawal({
        hashLN,
        recipients: recipientsMap,
        senderPublicKey: address,
        senderRawPublicKey: rawPublicKey,  // Backend uses this for identity derivation
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

      // Save withdrawal to session with jobId
      saveWithdrawal(address, {
        requestId: result.requestId,
        jobId: result.jobId,
        hashLN,
        totalAmount: getTotalAmount(),
        recipients: recipientsMap,
        timestamp: Date.now(),
        status: 'pending',
        senderIdentity: result.senderIdentity,
      });

      onSuccess?.(result.requestId);
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
          Select Deposit  
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
       
      </div>

      {/* Recipients */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-white/60">
            Recipients
          </label>
          {/* Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
            <button
              onClick={() => handleModeSwitch('manual')}
              disabled={isProcessing}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                inputMode === 'manual'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'text-white/40 hover:text-white/60'
              } disabled:opacity-50`}
            >
              Manual
            </button>
            <button
              onClick={() => handleModeSwitch('csv')}
              disabled={isProcessing}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                inputMode === 'csv'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'text-white/40 hover:text-white/60'
              } disabled:opacity-50`}
            >
              CSV Upload
            </button>
          </div>
        </div>

        {/* CSV Upload Mode */}
        {inputMode === 'csv' && (
          <div className="space-y-3">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Upload area */}
            {!csvFileName ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="w-full border-2 border-dashed border-white/20 hover:border-purple-500/50 rounded-xl p-6 text-center transition-all disabled:opacity-50"
              >
                <svg className="w-8 h-8 mx-auto mb-2 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-white/60">Click to upload CSV</p>
                <p className="text-xs text-white/30 mt-1">Format: address,amount</p>
              </button>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{csvFileName}</p>
                      <p className="text-xs text-white/40">{recipients.filter(r => r.address && r.amount).length} recipients loaded</p>
                    </div>
                  </div>
                  <button
                    onClick={clearCSV}
                    disabled={isProcessing}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* CSV Error */}
            {csvError && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-red-400">{csvError}</span>
              </div>
            )}

            {/* Preview loaded recipients */}
            {csvFileName && recipients.length > 0 && !csvError && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 max-h-48 overflow-y-auto">
                <p className="text-xs text-white/40 mb-2">Preview:</p>
                <div className="space-y-1">
                  {recipients.slice(0, 5).map((r, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="font-mono text-white/60 truncate max-w-[60%]">{r.address}</span>
                      <span className="text-purple-400">{r.amount} USDC</span>
                    </div>
                  ))}
                  {recipients.length > 5 && (
                    <p className="text-xs text-white/30 text-center pt-1">
                      +{recipients.length - 5} more recipients
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Manual Entry Mode */}
        {inputMode === 'manual' && (
          <>
            <div className="flex justify-end mb-2">
              <button
                onClick={addRecipient}
                disabled={isProcessing || recipients.length >= 10}
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
          </>
        )}
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
