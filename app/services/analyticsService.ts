import dummyData from '../data/dummy-analytics.json';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export type AnalyticsAction = 
  | 'contract_invocation' 
  | 'deposit' 
  | 'withdrawal_request' 
  | 'batch_execution'
  | 'waitlist_signup';

export interface AnalyticsEvent {
  action: AnalyticsAction;
  amount?: number;
  token?: string;
  count?: number; // e.g., number of recipients
  tx_hash?: string;
  contract_address?: string;
  wallet_address?: string;
  institution_name?: string; // For waitlist
  timestamp?: number;
}

export interface DashboardMetricsResponse {
  overview: {
    totalVolumeUsd: number;
    totalContractCalls: number;
    totalWaitlistedUsers: number;
    totalBatchesProcessed: number;
    activePrivacyPool: number;
  };
  charts: {
    volumeHistory: Array<{
      date: string;
      volume: number;
      txCount: number;
    }>;
    waitlistHistory: Array<{
      date: string;
      newUsers: number;
    }>;
  };
  breakdown: {
    byActionType: {
      deposits: number;
      withdrawals: number;
      batches: number;
    };
    byToken: {
      usdc: number;
      xlm: number;
    };
  };
}

class AnalyticsService {
  /**
   * Track an analytics event by sending it to the backend
   */
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const payload = {
        ...event,
        timestamp: event.timestamp || Date.now(),
        platform: 'web_client'
      };

      console.log('[Analytics] Tracking event:', payload);

      // In a real scenario, this would POST to the backend
      await fetch(`${BACKEND_URL}/api/analytics/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
    } catch (error) {
      // Analytics should never break the app, so we just log the error
      console.warn('[Analytics] Failed to track event:', error);
    }
  }

  /**
   * Fetch dashboard metrics
   * Currently returns dummy data simulating the /api/analytics/metrics endpoint
   */
  async getMetrics(): Promise<DashboardMetricsResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real scenario, this would fetch from the backend
    const response = await fetch(`${BACKEND_URL}/api/analytics/metrics`);
    return response.json();

    // return dummyData as DashboardMetricsResponse;
  }
}

export const analyticsService = new AnalyticsService();
