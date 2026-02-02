'use client';

import { useState, useRef, useCallback } from 'react';
import { SAFE_LIMITS } from '@/app/services/bulkPaymentService';

export interface Recipient {
  id: string;
  address: string;
  amount: string;
  isValid: boolean;
  error?: string;
}

interface RecipientsInputProps {
  recipients: Recipient[];
  onRecipientsChange: (recipients: Recipient[]) => void;
  disabled?: boolean;
  maxRecipients?: number;
  showBatches?: boolean;
}

export default function RecipientsInput({
  recipients,
  onRecipientsChange,
  disabled = false,
  maxRecipients = SAFE_LIMITS.MAX_TOTAL_RECIPIENTS,
  showBatches = true,
}: RecipientsInputProps) {
  const [dragActive, setDragActive] = useState(false);
  const [inputMode, setInputMode] = useState<'manual' | 'csv'>('manual');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate unique ID
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Validate a single recipient
  const validateRecipient = (address: string, amount: string): { isValid: boolean; error?: string } => {
    if (!address.trim()) {
      return { isValid: false, error: 'Address required' };
    }

    if (address.length !== 56 || !address.startsWith('G')) {
      return { isValid: false, error: 'Invalid Stellar address' };
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return { isValid: false, error: 'Invalid amount' };
    }

    return { isValid: true };
  };

  // Add empty recipient row
  const addRecipient = () => {
    if (recipients.length >= maxRecipients) return;

    const newRecipient: Recipient = {
      id: generateId(),
      address: '',
      amount: '',
      isValid: false,
    };
    onRecipientsChange([...recipients, newRecipient]);
  };

  // Update recipient
  const updateRecipient = (id: string, field: 'address' | 'amount', value: string) => {
    const updated = recipients.map((r) => {
      if (r.id !== id) return r;

      const newAddress = field === 'address' ? value : r.address;
      const newAmount = field === 'amount' ? value : r.amount;
      const validation = validateRecipient(newAddress, newAmount);

      return {
        ...r,
        [field]: value,
        isValid: validation.isValid,
        error: validation.error,
      };
    });
    onRecipientsChange(updated);
  };

  // Remove recipient
  const removeRecipient = (id: string) => {
    if (recipients.length <= 1) return;
    onRecipientsChange(recipients.filter((r) => r.id !== id));
  };

  // Parse CSV content
  const parseCSVContent = useCallback((content: string) => {
    const lines = content.trim().split('\n');

    // Skip header if present
    let startLine = 0;
    const firstLine = lines[0].toLowerCase();
    if (firstLine.includes('address') || firstLine.includes('recipient')) {
      startLine = 1;
    }

    const newRecipients: Recipient[] = [];

    for (let i = startLine; i < lines.length && newRecipients.length < maxRecipients; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(',').map((p) => p.trim());
      if (parts.length >= 2) {
        const address = parts[0];
        const amount = parts[1];
        const validation = validateRecipient(address, amount);

        newRecipients.push({
          id: generateId(),
          address,
          amount,
          isValid: validation.isValid,
          error: validation.error,
        });
      }
    }

    if (newRecipients.length > 0) {
      onRecipientsChange(newRecipients);
      setInputMode('csv');
    }
  }, [onRecipientsChange, maxRecipients]);

  // Handle CSV file upload
  const handleFileUpload = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        parseCSVContent(content);
      };
      reader.readAsText(file);
    },
    [parseCSVContent]
  );

  // Handle Get Test CSV
  const handleGetTestCSV = async () => {
    try {
      const response = await fetch('/upload.csv');
      if (!response.ok) throw new Error('Failed to load test CSV');
      const content = await response.text();
      parseCSVContent(content);
      setInputMode('manual');
    } catch (error) {
      console.error('Error loading test CSV:', error);
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Clear all and reset
  const clearAll = () => {
    onRecipientsChange([
      {
        id: generateId(),
        address: '',
        amount: '',
        isValid: false,
      },
    ]);
    setInputMode('manual');
  };

  const validCount = recipients.filter((r) => r.isValid).length;
  const totalAmount = recipients
    .filter((r) => r.isValid)
    .reduce((sum, r) => sum + parseFloat(r.amount), 0);

  return (
    <div className="space-y-4">
      {/* Mode Toggle and Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex bg-transparent rounded-lg p-1">
            <button
              onClick={() => setInputMode('manual')}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                inputMode === 'manual'
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white'
              }`}
              disabled={disabled}
            >
              Manual Entry
            </button>
            <button
              onClick={() => setInputMode('csv')}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                inputMode === 'csv'
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white'
              }`}
              disabled={disabled}
            >
              Upload CSV
            </button>
          </div>
        </div>

        <div className="text-sm text-white/50">
          {validCount}/{maxRecipients} recipients
        </div>
      </div>

      {/* CSV Drop Zone */}
      {inputMode === 'csv' && (
        <div
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${dragActive
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-white/20 hover:border-white/30'
            } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
            disabled={disabled}
          />

          <svg className="w-10 h-10 mx-auto mb-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-white/60 mb-3">
            Drag and drop CSV file here, or{' '}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-400 hover:text-blue-300"
              disabled={disabled}
            >
              browse
            </button>
          </p>
          
          <button
            onClick={handleGetTestCSV}
            className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors border border-white/5"
            disabled={disabled}
          >
            Get Test CSV
          </button>
          
          <p className="text-xs text-white/40 mt-3">Format: address,amount (amount in XLM)</p>
        </div>
      
      )}
      {/* Recipients Table */}
      <div className="bg-black/20 rounded-xl border border-white/10 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_120px_40px] gap-2 px-4 py-3 bg-white/3 border-b border-white/10">
          <div className="text-xs font-medium text-white/60 uppercase tracking-wider">
            Recipient Address
          </div>
          <div className="text-xs font-medium text-white/60 uppercase tracking-wider">
            Amount (XLM)
          </div>
          <div></div>
        </div>

        {/* Table Body */}
        <div className="h-[150px] overflow-y-auto">
          {recipients.map((recipient, index) => (
            <div
              key={recipient.id}
              className={`grid grid-cols-[1fr_120px_40px] gap-2 px-4 py-2 border-b border-white/5 ${
                !recipient.isValid && (recipient.address || recipient.amount)
                  ? 'bg-red-500/5'
                  : ''
              }`}
            >
              {/* Address Input */}
              <div className="relative">
                <input
                  type="text"
                  value={recipient.address}
                  onChange={(e) => updateRecipient(recipient.id, 'address', e.target.value)}
                  placeholder="G..."
                  className={`w-full bg-transparent border-0 text-sm font-mono text-white placeholder-white/50 focus:outline-none focus:ring-0 ${
                    !recipient.isValid && recipient.address ? 'text-red-400' : ''
                  }`}
                  disabled={disabled}
                />
                {recipient.error && recipient.address && (
                  <div className="absolute -bottom-4 left-0 text-xs text-red-400">
                    {recipient.error}
                  </div>
                )}
              </div>

              {/* Amount Input */}
              <input
                type="number"
                step="0.0000001"
                min="0"
                value={recipient.amount}
                onChange={(e) => updateRecipient(recipient.id, 'amount', e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent border-0 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-0"
                disabled={disabled}
              />

              {/* Remove Button */}
              <button
                onClick={() => removeRecipient(recipient.id)}
                className="flex items-center justify-center text-white/30 hover:text-red-400 transition-colors"
                disabled={disabled || recipients.length <= 1}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Add Row Button */}
        <div className="px-4 py-3 border-t border-white/10">
          <button
            onClick={addRecipient}
            disabled={disabled || recipients.length >= maxRecipients}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors disabled:opacity-30"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Recipient
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className={`grid ${showBatches ? 'grid-cols-3' : 'grid-cols-2'} gap-4 p-4 bg-white/2 rounded-xl`}>
        <div>
          <div className="text-xs text-white/40 mb-1">Valid Recipients</div>
          <div className="text-lg font-semibold text-white">
            {validCount}
            <span className="text-sm text-white/40">/{recipients.length}</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-white/40 mb-1">Total Amount</div>
          <div className="text-lg font-semibold text-white">
            {totalAmount.toFixed(2)}
            <span className="text-sm text-white/40"> XLM</span>
          </div>
        </div>
        {showBatches && (
          <div>
            <div className="text-xs text-white/40 mb-1">Batches</div>
            <div className="text-lg font-semibold text-white">
              {Math.ceil(validCount / SAFE_LIMITS.MAX_RECIPIENTS_PER_BATCH) || 0}
            </div>
          </div>
        )}
      </div>

      {/* Limit Warning */}
      {recipients.length >= maxRecipients  && (
        <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-yellow-200">
            Approaching limit: Maximum {maxRecipients} recipients per transaction
          </span>
        </div>
      )}

      {/* Clear Button */}
      {recipients.length > 1 && (
        <button
          onClick={clearAll}
          disabled={disabled}
          className="text-sm text-white/40 hover:text-white/80 transition-colors border border-white/10 px-3 py-1 rounded-lg hover:border-white/40"
        >
          Clear all recipients
        </button>
      )}
    </div>
  );
}
