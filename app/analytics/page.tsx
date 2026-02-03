'use client';

import React, { useState, useEffect } from 'react';
import { analyticsService, DashboardMetricsResponse } from '../services/analyticsService';

const DarkAnalyticsDashboard = () => {
    const [metricsData, setMetricsData] = useState<DashboardMetricsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Animation states
    const [animationPhase, setAnimationPhase] = useState(0);
    const [chartVisible, setChartVisible] = useState(false);
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

    // Hardcoded per spec
    const selectedPeriod = 'Last 30 days';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Simulate slightly longer loading for effect
                await new Promise(r => setTimeout(r, 600));
                const data = await analyticsService.getMetrics();
                setMetricsData(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch analytics:", err);
                setError(true);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Trigger staged animations
    useEffect(() => {
        if (!loading && metricsData) {
            setChartVisible(false);
            setAnimationPhase(0);

            // Staggered entrance sequence
            const timers = [
                setTimeout(() => setAnimationPhase(1), 100), // Header
                setTimeout(() => setAnimationPhase(2), 300), // Cards
                setTimeout(() => setAnimationPhase(3), 600), // Chart UI
                setTimeout(() => setChartVisible(true), 1000) // Chart Lines
            ];

            return () => timers.forEach(clearTimeout);
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
    const dates = history.map(h => {
        const d = new Date(h.date);
        return d.toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
        });
    });
    const volumes = history.map(h => h.volume);
    const txCounts = history.map(h => h.txCount);

    const maxVolume = Math.max(...volumes) * 1.1 || 100;
    const maxTxCount = Math.max(...txCounts) * 1.1 || 10;

    // Derived 30-day totals
    const totalDeposits = history.reduce((acc, curr) => acc + (curr.depositCount || 0), 0);
    const totalDepositVol = history.reduce((acc, curr) => acc + (curr.depositVolume || 0), 0);
    const totalWithdrawals = history.reduce((acc, curr) => acc + (curr.withdrawalCount || 0), 0);
    const totalWithdrawalVol = history.reduce((acc, curr) => acc + (curr.withdrawalVolume || 0), 0);
    const totalBatches = history.reduce((acc, curr) => acc + (curr.batchCount || 0), 0);
    const totalBatchVol = history.reduce((acc, curr) => acc + (curr.batchVolume || 0), 0);

    // --- Helper for Smooth Bezier Curves ---
    const generateSmoothPath = (values: number[], maxValue: number, height = 300, isArea = false) => {
        const width = 800;
        const padding = 0; // Removing internal padding for cleaner full-width look
        const chartWidth = width;
        const chartHeight = height;

        const points = values.map((value, index) => ({
            x: (values.length > 1 ? index / (values.length - 1) : 0.5) * chartWidth,
            y: (1 - value / maxValue) * chartHeight
        }));

        if (points.length < 2) {
            // Handle single point case to draw at least something flat
            if (points.length === 1) {
                const y = points[0].y;
                if (isArea) {
                    return `M 0,${y} L ${width},${y} L ${width},${height} L 0,${height} Z`;
                }
                return `M 0,${y} L ${width},${y}`;
            }
            return '';
        }

        let path = `M ${points[0].x},${points[0].y}`;

        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const next = points[i + 1];

            const cp1x = prev.x + (curr.x - prev.x) * 0.5;
            const cp1y = prev.y;
            const cp2x = curr.x - (next ? (next.x - curr.x) * 0.3 : 0);
            const cp2y = curr.y;

            path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
        }

        if (isArea) {
            path += ` L ${width},${height} L 0,${height} Z`;
        }

        return path;
    };

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
                                bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-2xl p-6
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
                            bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl p-6
                            transition-all duration-700 delay-500
                            ${animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                        `}
                        >
                            <h3 className="text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider">Token Distribution</h3>
                            <div className="h-4 w-full bg-neutral-800/50 rounded-full overflow-hidden flex mb-3 relative">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-[1500ms] ease-out"
                                    style={{ width: chartVisible ? `${usdcPercentage}%` : '0%' }}
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
                        relative bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-3xl p-8 mb-8
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

                    {/* SVG Chart */}
                    <div className="h-[400px] w-full relative group">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 800 400" preserveAspectRatio="none">
                            {/* Grid Lines */}
                            {[0, 0.25, 0.5, 0.75, 1].map((pos, i) => (
                                <line 
                                    key={i}
                                    x1="0" 
                                    y1={400 * pos} 
                                    x2="800" 
                                    y2={400 * pos} 
                                    stroke="rgba(255,255,255,0.03)" 
                                    strokeWidth="1" 
                                />
                            ))}

                            {/* Volume Gradient Definition */}
                            <defs>
                                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Volume Area */}
                            <path
                                d={generateSmoothPath(volumes, maxVolume, 400, true)}
                                fill="url(#volumeGradient)"
                                className={`transition-all duration-[2000ms] ease-out ${chartVisible ? 'opacity-100' : 'opacity-0'}`}
                                style={{ transformOrigin: 'bottom' }}
                            />

                            {/* Transaction Line (Background) */}
                            <path
                                d={generateSmoothPath(txCounts, maxTxCount, 400)}
                                fill="none"
                                stroke="#525252"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeDasharray="4 4"
                                className={`transition-all duration-[2000ms] ease-out ${chartVisible ? 'opacity-100' : 'opacity-0'}`}
                                style={{
                                    strokeDashoffset: chartVisible ? 0 : 1000,
                                    transitionDelay: '200ms'
                                }}
                            />

                            {/* Volume Line (Foreground) */}
                            <path
                                d={generateSmoothPath(volumes, maxVolume, 400)}
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                strokeLinecap="round"
                                className={`transition-all duration-[2000ms] ease-out ${chartVisible ? 'opacity-100' : 'opacity-0'}`}
                                style={{
                                    strokeDasharray: 2500, // Roughly path length
                                    strokeDashoffset: chartVisible ? 0 : 2500
                                }}
                            />

                            {/* Interactive Overlay & Points */}
                            {dates.map((date, index) => {
                                const x = (dates.length > 1 ? index / (dates.length - 1) : 0.5) * 800;
                                const volumeY = (1 - volumes[index] / maxVolume) * 400;
                                
                                return (
                                    <g key={index} className="group/point">
                                        {/* Invisible Hit Area Bar */}
                                        <rect 
                                            x={x - (800 / dates.length / 2)} 
                                            y="0" 
                                            width={800 / dates.length} 
                                            height="400" 
                                            fill="transparent" 
                                            onMouseEnter={() => setHoveredPoint(index)}
                                            onMouseLeave={() => setHoveredPoint(null)}
                                            className="cursor-crosshair"
                                        />
                                        
                                        {/* Highlight Point (Only visible on hover) */}
                                        <circle
                                            cx={x}
                                            cy={volumeY}
                                            r="6"
                                            fill="#000"
                                            stroke="#3b82f6"
                                            strokeWidth="3"
                                            className={`transition-all duration-200 pointer-events-none ${
                                                hoveredPoint === index ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                                            }`}
                                        />
                                        
                                        {/* Vertical Guide Line */}
                                        <line
                                            x1={x}
                                            y1="0"
                                            x2={x}
                                            y2="400"
                                            stroke="rgba(255,255,255,0.1)"
                                            strokeWidth="1"
                                            className={`transition-opacity duration-200 pointer-events-none ${
                                                hoveredPoint === index ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        />
                                    </g>
                                );
                            })}
                        </svg>

                        {/* Floating Tooltip */}
                        {hoveredPoint !== null && (
                            <div 
                                className="absolute top-0 pointer-events-none transition-all duration-75 ease-out z-20"
                                style={{ 
                                    left: `${(dates.length > 1 ? hoveredPoint / (dates.length - 1) : 0.5) * 100}%`,
                                    transform: `translateX(-50%) translateY(-110%)` // Shift up
                                }}
                            >
                                <div className="bg-neutral-900/95 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl min-w-[200px]">
                                    <div className="text-neutral-400 text-xs mb-3 border-b border-white/5 pb-2 font-mono">
                                        {dates[hoveredPoint]}
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-3">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-wider text-neutral-500">Volume</span>
                                            <span className="text-lg font-light text-blue-400">
                                                {currencyFormatter.format(volumes[hoveredPoint])}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] uppercase tracking-wider text-neutral-500">Txns</span>
                                            <span className="text-lg font-light text-white">
                                                {txCounts[hoveredPoint]}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Detailed Breakdown */}
                                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                                        <div className="flex justify-between items-center text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80"></div>
                                                <span className="text-neutral-400">Deposits</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-neutral-500">{history[hoveredPoint].depositCount || 0}</span>
                                                <span className="text-white font-mono">{currencyFormatter.format(history[hoveredPoint].depositVolume || 0)}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500/80"></div>
                                                <span className="text-neutral-400">Withdrawals</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-neutral-500">{history[hoveredPoint].withdrawalCount || 0}</span>
                                                <span className="text-white font-mono">{currencyFormatter.format(history[hoveredPoint].withdrawalVolume || 0)}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500/80"></div>
                                                <span className="text-neutral-400">Batches</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-neutral-500">{history[hoveredPoint].batchCount || 0}</span>
                                                <span className="text-white font-mono">{currencyFormatter.format(history[hoveredPoint].batchVolume || 0)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Tooltip Arrow */}
                                <div className="w-3 h-3 bg-neutral-900 border-r border-b border-white/10 rotate-45 mx-auto -mt-1.5"></div>
                            </div>
                        )}
                    </div>

                    {/* X-Axis Labels */}
                    <div className="flex justify-between mt-4 px-2">
                        {dates.map((date, i) => (
                            // Show first, last, and every ~5th label
                            (i === 0 || i === dates.length - 1 || i % 6 === 0) && (
                                <span key={i} className="text-xs text-neutral-600 font-mono">
                                    {date}
                                </span>
                            )
                        ))}
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