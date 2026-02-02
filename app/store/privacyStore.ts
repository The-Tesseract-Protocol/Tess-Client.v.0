import { create } from 'zustand';
import {
  PrivacyPayDeposit,
  PrivacyPayWithdrawal,
  fetchDepositsFromBackend,
  getWithdrawals,
  checkJobStatuses,
  updateWithdrawalByJobId,
  saveDeposit,
  saveWithdrawal,
} from '../services/privacyPayService';

interface PrivacyState {
  deposits: PrivacyPayDeposit[];
  withdrawals: PrivacyPayWithdrawal[];
  isLoading: boolean;
  lastUpdated: number;
  
  // Actions
  fetchData: (address: string) => Promise<void>;
  startPolling: (address: string) => void;
  stopPolling: () => void;
  addDeposit: (address: string, deposit: PrivacyPayDeposit) => void;
  addWithdrawal: (address: string, withdrawal: PrivacyPayWithdrawal) => void;
}

let pollInterval: NodeJS.Timeout | null = null;

export const usePrivacyStore = create<PrivacyState>((set, get) => ({
  deposits: [],
  withdrawals: [],
  isLoading: false,
  lastUpdated: 0,

  fetchData: async (address: string) => {
    if (!address) return;
    
    try {
      // 1. Fetch Deposits
      const deposits = await fetchDepositsFromBackend(address);
      
      // 2. Fetch Withdrawals (Local + Status Check)
      let currentWithdrawals = getWithdrawals(address);
      
      // Check for pending jobs
      const pendingJobs = currentWithdrawals.filter(w => 
        w.status === 'pending' || w.status === 'processing'
      );
      
      if (pendingJobs.length > 0) {
        const jobIds = pendingJobs.map(w => w.jobId).filter((id): id is string => !!id);
        if (jobIds.length > 0) {
          const statusResult = await checkJobStatuses(jobIds);
           // Update local storage and current list
           let updated = false;
           statusResult.jobs.forEach(job => {
             updateWithdrawalByJobId(
               address, 
               job.jobId, 
               job.status, 
               job.txHash, 
               job.txHashes // Pass all collected hashes
             );
             updated = true;
           });
           
           if (updated) {
             currentWithdrawals = getWithdrawals(address);
           }
        }
      }

      set({ 
        deposits, 
        withdrawals: currentWithdrawals, 
        lastUpdated: Date.now() 
      });
      
    } catch (error) {
      console.error('Error fetching privacy data:', error);
    }
  },

  startPolling: (address: string) => {
    if (pollInterval) clearInterval(pollInterval);
    
    // Initial fetch
    set({ isLoading: true });
    get().fetchData(address).finally(() => set({ isLoading: false }));
    
    pollInterval = setInterval(() => {
      get().fetchData(address);
    }, 10000); // Poll every 10s
  },

  stopPolling: () => {
    if (pollInterval) {
      clearInterval(pollInterval);
      pollInterval = null;
    }
  },
  
  addDeposit: (address: string, deposit: PrivacyPayDeposit) => {
    saveDeposit(address, deposit);
    set(state => ({
        deposits: [deposit, ...state.deposits].sort((a, b) => b.timestamp - a.timestamp)
    }));
  },

  addWithdrawal: (address: string, withdrawal: PrivacyPayWithdrawal) => {
      saveWithdrawal(address, withdrawal);
      set(state => ({
          withdrawals: [withdrawal, ...state.withdrawals].sort((a, b) => b.timestamp - a.timestamp)
      }));
  }
}));