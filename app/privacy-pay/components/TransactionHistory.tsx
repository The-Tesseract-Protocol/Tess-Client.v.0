'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/app/contexts/WalletContext';
import {
  getDeposits,
  getWithdrawals,
  PrivacyPayDeposit,
  PrivacyPayWithdrawal,
  checkJobStatuses,
  updateWithdrawalTxHash,
} from '@/app/services/privacyPayService';

export default function TransactionHistory() {
  const { walletState } = useWallet();
  const { address } = walletState;
  const [deposits, setDeposits] = useState<PrivacyPayDeposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<PrivacyPayWithdrawal[]>([]);
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals'>('deposits');

  useEffect(() => {
    if (address) {
      setDeposits(getDeposits(address));
      setWithdrawals(getWithdrawals(address));
    }
  }, [address,deposits.length,withdrawals.length]);

  // Poll for job statuses every 3 minutes
  useEffect(() => {
    if (!address) return;

    const pollInterval = 3 * 60 * 1000; // 3 minutes

    const pollJobs = async () => {
      // Get pending withdrawals (those without txHash)
      const pendingWithdrawals = withdrawals.filter(w => w.jobId && !w.txHash);
      
      if (pendingWithdrawals.length === 0) return;

      const jobIds = pendingWithdrawals.map(w => w.jobId!);
      
      try {
        const result = await checkJobStatuses(jobIds);
        
        // Update withdrawals with new txHashes
        let updated = false;
        result.jobs.forEach(job => {
          if (job.txHash) {
            updateWithdrawalTxHash(address, job.jobId, job.txHash);
            updated = true;
          }
        });

        // Refresh withdrawals if any were updated
        if (updated) {
          setWithdrawals(getWithdrawals(address));
        }
      } catch (error) {
        console.error('Error polling job statuses:', error);
      }
    };

    // Poll immediately on mount
    pollJobs();

    // Set up interval for polling
    const interval = setInterval(pollJobs, pollInterval);
    
    return () => clearInterval(interval);
  }, [address, withdrawals]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'text-green-400 bg-green-400/10';
      case 'pending':
      case 'processing':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'failed':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-white/40 bg-white/10';
    }
  };

  if (!address) {
    return (
      <div className="text-center py-12">
        <svg className="w-12 h-12 text-white/20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-white/40">Connect wallet to view history</p>
      </div>
    );
  }

  const isEmpty = deposits.length === 0 && withdrawals.length === 0;

  if (isEmpty) {
    return (
      <div className="text-center py-12">
        <svg className="w-12 h-12 text-white/20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-white/40">No transactions yet</p>
        <p className="text-white/30 text-sm mt-1">Make a deposit to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('deposits')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'deposits'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
          }`}
        >
          Deposits ({deposits.length})
        </button>
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'withdrawals'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
          }`}
        >
          Withdrawals ({withdrawals.length})
        </button>
      </div>

      {/* Deposits List */}
      {activeTab === 'deposits' && (
        <div className="space-y-3">
          {deposits.map((deposit) => (
            <div
              key={deposit.hashLN}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">{deposit.amount} USDC</p>
                    <p className="text-white/40 text-xs">{formatDate(deposit.timestamp)}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                    deposit.status
                  )}`}
                >
                  {deposit.status}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Hash</span>
                  <code className="text-white/60 font-mono text-xs">
                    {deposit.hashLN.slice(0, 16)}...
                  </code>
                </div>
                {deposit.txHash && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/40">Transaction</span>
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${deposit.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-mono text-xs"
                    >
                      {deposit.txHash.slice(0, 8)}...
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Withdrawals List */}
      {activeTab === 'withdrawals' && (
        <div className="space-y-3">
          {withdrawals.map((withdrawal) => (
            <div
              key={withdrawal.requestId}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    {withdrawal.txHash ? (
                      <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">{withdrawal.totalAmount} USDC</p>
                    <p className="text-white/40 text-xs">{formatDate(withdrawal.timestamp)}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                    withdrawal.txHash ? 'completed' : 'pending'
                  )}`}
                >
                  {withdrawal.txHash ? 'completed' : 'pending'}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Recipients</span>
                  <span className="text-white/60">
                    {Object.keys(withdrawal.recipients).length}
                  </span>
                </div>
                {withdrawal.jobId && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/40">Job ID</span>
                    <code className="text-white/60 font-mono text-xs">
                      {withdrawal.jobId.slice(0, 8)}...
                    </code>
                  </div>
                )}
                {withdrawal.txHash ? (
                  <div className="flex items-center justify-between">
                    <span className="text-white/40">Transaction</span>
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${withdrawal.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 font-mono text-xs flex items-center gap-1"
                    >
                      {withdrawal.txHash.slice(0, 8)}...
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-white/40">Status</span>
                    <span className="text-yellow-400 text-xs flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      Processing...
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
