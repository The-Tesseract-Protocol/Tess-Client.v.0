'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useWallet } from '@/app/contexts/WalletContext';
import {
  fetchDepositsFromBackend,
  getWithdrawals,
  PrivacyPayDeposit,
  PrivacyPayWithdrawal,
  checkJobStatuses,
  updateWithdrawalByJobId,
} from '@/app/services/privacyPayService';

export default function TransactionHistory() {
  const { walletState } = useWallet();
  const { address } = walletState;
  const [deposits, setDeposits] = useState<PrivacyPayDeposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<PrivacyPayWithdrawal[]>([]);
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals'>('deposits');
  const [isLoadingDeposits, setIsLoadingDeposits] = useState(false);
  const withdrawalsRef = useRef(withdrawals);

  // Keep ref in sync with state
  useEffect(() => {
    withdrawalsRef.current = withdrawals;
  }, [withdrawals]);

  const pollJobs = useCallback(async () => {
    if (!address) return;

    // Use ref to get current withdrawals without triggering effect re-run
    const pendingWithdrawals = withdrawalsRef.current.filter(w => w.jobId && !w.txHash);

    if (pendingWithdrawals.length === 0) return;

    const jobIds = pendingWithdrawals.map(w => w.jobId!);

    try {
      const result = await checkJobStatuses(jobIds);

      // Update all returned jobs with their latest status and txHash
      let updated = false;
      result.jobs.forEach(job => {
        updateWithdrawalByJobId(address, job.jobId, job.status, job.txHash);
        updated = true;
      });

      // Refresh withdrawals if any were updated
      if (updated) {
        const refreshed = getWithdrawals(address);
        setWithdrawals(refreshed);
        withdrawalsRef.current = refreshed;
      }
    } catch (error) {
      console.error('Error polling job statuses:', error);
    }
  }, [address]);

  // Load data and poll immediately on mount / address change
  useEffect(() => {
    if (!address) return;

    // Fetch deposits from backend
    const loadDeposits = async () => {
      setIsLoadingDeposits(true);
      try {
        const data = await fetchDepositsFromBackend(address);
        setDeposits(data);
      } catch (error) {
        console.error('Failed to load deposits:', error);
      } finally {
        setIsLoadingDeposits(false);
      }
    };

    loadDeposits();

    // Load withdrawals (still local storage for now as per instructions mainly focused on deposit query)
    // If withdrawals also need to be backend based, we'd need a similar endpoint. 
    // Assuming only deposits for now based on prompt.
    const loaded = getWithdrawals(address);
    setWithdrawals(loaded);
    withdrawalsRef.current = loaded;

    // Poll immediately now that withdrawals are in the ref
    pollJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  // Poll for job statuses every 3 minutes
  useEffect(() => {
    if (!address) return;

    const pollInterval = 3 * 60 * 1000; // 3 minutes

    // Set up interval for polling (initial call handled separately)
    const interval = setInterval(pollJobs, pollInterval);
    
    return () => clearInterval(interval);
  }, [address, pollJobs]);

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
    <div className="space-y-4 overflow-y-auto scrollbar-hide min-h-[500px] overflow-x-hidden max-h-[500px]">
      {/* Tabs */}
      <div className="flex gap-1">
        <button
          onClick={() => setActiveTab('deposits')}
          className={`px-2 py-2 rounded-4xl text-xs font-medium transition-all flex items-center gap-1 ${
            activeTab === 'deposits'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
          }`}
        >
          <span>Deposits</span>
          <span>({deposits.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-2 py-2 rounded-4xl text-xs font-medium transition-all flex items-center gap-1${
            activeTab === 'withdrawals'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
          }`}
        >
         <span>Withdrawals </span> 
         <span>({withdrawals.length})</span> 
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
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium text-xs">{deposit.amount} USDC</p>
                    <p className="text-white/40 text-[9px]">{formatDate(deposit.timestamp)}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-[10px] font-medium ${getStatusColor(
                    deposit.status
                  )}`}
                >
                  {deposit.status}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Hash</span>
                  <code className="text-white/60 font-mono text-[9px]">
                    {deposit.hashLN.slice(0, 16)}...
                  </code>
                </div>
                {deposit.txHash && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-xs">Transaction</span>
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${deposit.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-mono text-[9px]"
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
                    {withdrawal.status === 'completed' ? (
                      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : withdrawal.status === 'failed' ? (
                      <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                    withdrawal.status
                  )}`}
                >
                  {withdrawal.status}
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
                {withdrawal.txHash && (
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
                )}
                {withdrawal.status === 'failed' && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/40">Status</span>
                    <span className="text-red-400 text-xs flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                      Failed
                    </span>
                  </div>
                )}
                {(withdrawal.status === 'pending' || withdrawal.status === 'processing') && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/40">Status</span>
                    <span className="text-yellow-400 text-xs flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      {withdrawal.status === 'processing' ? 'Processing...' : 'Pending...'}
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
