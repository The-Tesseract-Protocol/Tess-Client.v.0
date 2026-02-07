import { create } from 'zustand';
import { analyticsService, DashboardMetricsResponse } from '../services/analyticsService';

interface AnalyticsState {
  metricsData: DashboardMetricsResponse | null;
  isLoading: boolean;
  error: boolean;
  lastUpdated: number;
  
  // Actions
  fetchData: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
}

let pollInterval: NodeJS.Timeout | null = null;

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  metricsData: null,
  isLoading: false,
  error: false,
  lastUpdated: 0,

  fetchData: async () => {
    try {
      const data = await analyticsService.getMetrics();
      set({ 
        metricsData: data, 
        lastUpdated: Date.now(),
        error: false
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      set({ error: true });
    }
  },

  startPolling: () => {
    if (pollInterval) clearInterval(pollInterval);
    
    // Initial fetch if no data or data is stale (optional, but good practice to ensure fresh data on mount)
    // We can rely on the component to show loading state if desired, but here we manage it in the store
    const { metricsData } = get();
    if (!metricsData) {
        set({ isLoading: true });
    }
    
    get().fetchData().finally(() => set({ isLoading: false }));
    
    // Poll every 5 minutes (300,000 ms)
    pollInterval = setInterval(() => {
      get().fetchData();
    }, 300000); 
  },

  stopPolling: () => {
    if (pollInterval) {
      clearInterval(pollInterval);
      pollInterval = null;
    }
  }
}));
