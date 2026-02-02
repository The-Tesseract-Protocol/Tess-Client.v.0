'use client';

import { useState } from 'react';
import { useWallet } from '@/app/contexts/WalletContext';
import { usePrivacyStore } from '@/app/store/privacyStore';

export default function TransactionHistory() {
  const { walletState } = useWallet();
  const { address } = walletState;
  
  // Use Zustand store
  const { deposits, withdrawals, isLoading } = usePrivacyStore();
  
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals'>('deposits');

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
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'pending':
      case 'processing':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'failed':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-white/40 bg-white/10 border-white/10';
    }
  };

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-white/60 font-medium">Wallet Not Connected</p>
        <p className="text-white/30 text-xs mt-1">Connect to view your history</p>
      </div>
    );
  }

  const isEmpty = activeTab === 'deposits' ? deposits.length === 0 : withdrawals.length === 0;

  return (
    <div className="flex flex-col max-h-[70vh] overflow-y-scroll">
      {/* Tabs */}
      <div className="flex p-1 bg-white/5 rounded-xl mb-4">
        <button
          onClick={() => setActiveTab('deposits')}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'deposits'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          Deposits
        </button>
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
            activeTab === 'withdrawals'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          Withdrawals
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-scoll pr-2 -mr-2 space-y-3 scrollbar-hide">
        {isLoading && activeTab === 'deposits' && deposits.length === 0 && (
          <div className="text-center py-8 text-white/30 text-xs animate-pulse">Loading deposits...</div>
        )}

        {!isLoading && isEmpty && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-white/40 text-sm">No {activeTab} found</p>
          </div>
        )}

        {activeTab === 'deposits' && deposits.map((deposit) => (
          <div
            key={deposit.hashLN}
            className="group bg-white/2 hover:bg-white/5 border border-white/10 hover:border-white/10 rounded-2xl p-4 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">
                    {deposit.amount} <span className="text-white/50 text-xs">{deposit.token?.toUpperCase()}</span>
                  </div>
                  <div className="text-white/30 text-[10px]">{formatDate(deposit.timestamp)}</div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border ${getStatusColor(deposit.status)}`}>
                {deposit.status}
              </span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/30">Hash</span>
                <span className="text-white/50 font-mono text-[10px] bg-black/20 px-1.5 py-0.5 rounded">
                  {deposit.hashLN.slice(0, 12)}...
                </span>
              </div>
              {deposit.txHash && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/30">Tx</span>
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${deposit.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 font-mono text-[10px] flex items-center gap-1"
                  >
                    {deposit.txHash.slice(0, 8)}...
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}

        {activeTab === 'withdrawals' && withdrawals.map((withdrawal) => (
          <div
            key={withdrawal.requestId}
            className="group bg-white/2 hover:bg-white/5 border border-white/10 hover:border-white/10 rounded-2xl p-4 transition-all duration-300 overflow-y-scroll"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">
                    {withdrawal.totalAmount} <span className="text-white/50 text-xs">{withdrawal.token?.toUpperCase()}</span>
                  </div>
                  <div className="text-white/30 text-[10px]">{formatDate(withdrawal.timestamp)}</div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border ${getStatusColor(withdrawal.status)}`}>
                {withdrawal.status === 'processing' ? 'Processing' : withdrawal.status}
              </span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/30">Recipients</span>
                <span className="text-white/60 font-mono">
                  {Object.keys(withdrawal.recipients).length}
                </span>
              </div>
              {withdrawal.txHashes && withdrawal.txHashes.length > 0 ? (
                <div className="space-y-1 max-h-[80px] overflow-scroll">
                  {withdrawal.txHashes.map((hash, idx) => (
                    <div key={hash} className="flex justify-between items-center text-xs">
                      <span className="text-white/30">{idx === 0 ? 'Tx' : ''}</span>
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 font-mono text-[10px] flex items-center gap-1"
                      >
                        {hash.slice(0, 8)}...
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  ))}
                </div>
              ) : withdrawal.txHash ? (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/30">Tx</span>
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${withdrawal.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 font-mono text-[10px] flex items-center gap-1"
                  >
                    {withdrawal.txHash.slice(0, 8)}...
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              ) : (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/30">Job ID</span>
                  <span className="text-white/40 font-mono text-[10px]">
                    {withdrawal.jobId?.slice(0, 8) || '...'}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
