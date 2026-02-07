'use client';

import * as React from 'react';
import { useAnalyticsStore } from '../store/analyticsStore';
import VolumeChart from './components/VolumeChart';

const DarkAnalyticsDashboard = () => {
    const { 
        metricsData, 
        isLoading: loading, 
        error, 
        startPolling, 
        stopPolling 
    } = useAnalyticsStore();

    // Animation states
    const [animationPhase, setAnimationPhase] = React.useState(0);

    React.useEffect(() => {
        startPolling();
        return () => stopPolling();
    }, [startPolling, stopPolling]);

    // Trigger staged animations
    React.useEffect(() => {
        if (!loading && metricsData) {
            // Staggered entrance sequence
            // We use a small timeout for the reset to avoid synchronous setState warning
            const resetTimer = setTimeout(() => setAnimationPhase(0), 0);
            
            const timers = [
                setTimeout(() => setAnimationPhase(1), 100), // Header
                setTimeout(() => setAnimationPhase(2), 300), // Cards
                setTimeout(() => setAnimationPhase(3), 600), // Chart UI
            ];

            return () => {
                clearTimeout(resetTimer);
                timers.forEach(clearTimeout);
            };
        }
    }, [loading, metricsData]);

    // Formatters
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-t-blue-500 border-white/10 animate-spin" />
                    <div className="text-neutral-500 text-sm font-mono tracking-widest animate-pulse">LOADING METRICS</div>
                </div>
            </div>
        );
    }

    if (error || !metricsData) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="text-red-500 text-lg">Unable to load analytics</div>
                    <button 
                        onClick={() => window.location.reload()}
                        className="text-neutral-400 hover:text-white text-sm underline underline-offset-4 transition-colors"
                    >
                        Refresh Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // --- Data Prep ---
    const history = metricsData.charts.volumeHistory;

    // Derived 30-day totals
    const totalDeposits = history.reduce((acc, curr) => acc + (curr.depositCount || 0), 0);
    const totalDepositVol = history.reduce((acc, curr) => acc + (curr.depositVolume || 0), 0);
    const totalWithdrawals = history.reduce((acc, curr) => acc + (curr.withdrawalCount || 0), 0);
    const totalWithdrawalVol = history.reduce((acc, curr) => acc + (curr.withdrawalVolume || 0), 0);
    const totalBatches = history.reduce((acc, curr) => acc + (curr.batchCount || 0), 0);
    const totalBatchVol = history.reduce((acc, curr) => acc + (curr.batchVolume || 0), 0);

    // Metrics for Cards
    const metricsCards = [
        { 
            label: 'Total Volume', 
            value: currencyFormatter.format(metricsData.overview.totalVolumeUsd), 
            accent: 'text-blue-400' 
        },
        { 
            label: 'Active Privacy Pool', 
            value: currencyFormatter.format(metricsData.overview.activePrivacyPool), 
            accent: 'text-emerald-400' 
        },
        { 
            label: 'Waitlist Growth', 
            value: metricsData.overview.totalWaitlistedUsers.toString(), 
            accent: 'text-purple-400' 
        }
    ];

    // Token Ratio
    const usdcVol = metricsData.breakdown.byToken.usdc;
    const xlmVol = metricsData.breakdown.byToken.xlm;
    const totalTokenVol = usdcVol + xlmVol;
    const usdcPercentage = totalTokenVol > 0 ? (usdcVol / totalTokenVol) * 100 : 50;

    return (
        <div className="min-h-screen bg-transparent text-neutral-200 font-sans selection:bg-blue-500/30">
            {/* Ambient Background Glow */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                
                {/* Header Section */}
                <header className="mb-12 flex gap-1 justify-between items-end">
                    <div 
                        className={`transition-all duration-1000 ease-out transform ${
                            animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                    >
                        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-2">
                            Analytics
                        </h1>
                        <p className="text-neutral-500 font-light text-lg">
                            Network performance & privacy metrics
                        </p>
                       
                    </div>
                </header>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {metricsCards.map((card, i) => (
                        <div
                            key={card.label}
                            className={`
                                bg-white/[0.03] backdrop-blur-xl border border-white/15 rounded-2xl p-6
                                hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500
                                ${animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                            `}
                            style={{ transitionDelay: `${200 + i * 100}ms` }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-sm font-medium text-neutral-500 uppercase tracking-wider">{card.label}</span>
                                <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-emerald-500' : 'bg-purple-500'} shadow-[0_0_8px_currentColor]`} />
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-light text-white tracking-tight">{card.value}</span>
                            </div>
                        </div>
                    ))}

                        <div
                            className={`
                            bg-white/[0.03] backdrop-blur-md border border-white/15 rounded-2xl p-6
                            transition-all duration-700 delay-500
                            ${animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                        `}
                        >
                            <h3 className="text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider">Token Distribution</h3>
                            <div className="h-4 w-full bg-neutral-800/50 rounded-full overflow-hidden flex mb-3 relative">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-[1500ms] ease-out"
                                    style={{ width: `${usdcPercentage}%` }}
                                />
                                <div className="h-full flex-1 bg-neutral-700/30" />
                            </div>
                            <div className="flex justify-between text-xs font-mono text-neutral-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span className="text-white">{Math.round(usdcPercentage)}% USDC</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-white">{Math.round(100 - usdcPercentage)}% XLM</span>
                                    <div className="w-2 h-2 rounded-full bg-neutral-600"></div>
                                </div>
                            </div>
                        </div>
                   
                </div>
                

                {/* Main Chart Section */}
                <div 
                    className={`
                        relative bg-white/[0.02] backdrop-blur-sm border border-white/15 rounded-3xl p-8 mb-8
                        transition-all duration-1000 ease-out
                        ${animationPhase >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'}
                    `}
                >
                    {/* Legend */}
                    <div className="flex items-center gap-6 mb-8 pl-2">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                            <span className="text-sm text-neutral-300">Volume (USD)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-neutral-600"></span>
                            <span className="text-sm text-neutral-500">Transactions</span>
                        </div>
                    </div>

                    {/* Recharts Component */}
                    <div className="w-full h-[500px]">
                        <VolumeChart data={metricsData.charts.volumeHistory} />
                    </div>
                </div>

                {/* 30-Day Activity Breakdown */}
                <div 
                    className={`
                        grid grid-cols-1 md:grid-cols-3 gap-6 mb-8
                        transition-all duration-1000 ease-out delay-200
                        ${animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                    `}
                >
                     <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col">
                        <span className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Total Deposits (30d)</span>
                        <div className="flex items-baseline justify-between">
                             <span className="text-2xl font-light text-emerald-400">{currencyFormatter.format(totalDepositVol)}</span>
                             <span className="text-sm text-neutral-400">{totalDeposits} txs</span>
                        </div>
                     </div>
                     <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col">
                        <span className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Total Withdrawals (30d)</span>
                        <div className="flex items-baseline justify-between">
                             <span className="text-2xl font-light text-rose-400">{currencyFormatter.format(totalWithdrawalVol)}</span>
                             <span className="text-sm text-neutral-400">{totalWithdrawals} txs</span>
                        </div>
                     </div>
                     <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col">
                        <span className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Batches Processed (30d)</span>
                        <div className="flex items-baseline justify-between">
                             <span className="text-2xl font-light text-purple-400">{currencyFormatter.format(totalBatchVol)}</span>
                             <span className="text-sm text-neutral-400">{totalBatches} batches</span>
                        </div>
                     </div>
                </div>

                <p className="text-red-700 font-light text-sm border border-red-500 p-2 rounded-4xl w-auto text-center">
                    Undergoing Legacy Datafill, for activity prior to 04/02/2026 data may be incomplete.
                </p>

            </div>
        </div>
    );
};

export default DarkAnalyticsDashboard;
