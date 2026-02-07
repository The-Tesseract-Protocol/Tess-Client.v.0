'use client';

import * as React from 'react';
import {
    ComposedChart,
    Area,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface ChartDataPoint {
    date: string;
    volume: number;
    txCount: number;
    depositCount?: number;
    depositVolume?: number;
    withdrawalCount?: number;
    withdrawalVolume?: number;
    batchCount?: number;
    batchVolume?: number;
}

interface VolumeChartProps {
    data: ChartDataPoint[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload as ChartDataPoint;

        const currencyFormatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });

        return (
            <div className="bg-neutral-900/95 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl min-w-[220px] text-left">
                <div className="text-neutral-400 text-xs mb-3 border-b border-white/5 pb-2 font-mono">
                    {new Date(data.date).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })}
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-neutral-500">Volume</span>
                        <span className="text-lg font-light text-blue-400">
                            {currencyFormatter.format(data.volume)}
                        </span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase tracking-wider text-neutral-500">Txns</span>
                        <span className="text-lg font-light text-white">
                            {data.txCount}
                        </span>
                    </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80"></div>
                            <span className="text-neutral-400">Deposits</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-neutral-500">{data.depositCount || 0}</span>
                            <span className="text-white font-mono">{currencyFormatter.format(data.depositVolume || 0)}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500/80"></div>
                            <span className="text-neutral-400">Withdrawals</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-neutral-500">{data.withdrawalCount || 0}</span>
                            <span className="text-white font-mono">{currencyFormatter.format(data.withdrawalVolume || 0)}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500/80"></div>
                            <span className="text-neutral-400">Batches</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-neutral-500">{data.batchCount || 0}</span>
                            <span className="text-white font-mono">{currencyFormatter.format(data.batchVolume || 0)}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

const VolumeChart: React.FC<VolumeChartProps> = ({ data }) => {
    // Transform data once to add timestamp
    const processedData = React.useMemo(() => {
        return data.map(item => ({
            ...item,
            timestamp: new Date(item.date).getTime(),
        }));
    }, [data]);

    // Initial window size (e.g., show last 20 items or 30% of data, whichever is reasonable)
    // Adjust VISIBLE_COUNT to preference
    const VISIBLE_COUNT = 30;
    
    // State to manage the visible window [startIndex, endIndex]
    // We only need to store startIndex, endIndex is derived from window size if fixed, 
    // but allowing flexible window is better. For scroll pan, we keep window size constant.
    const [windowRange, setWindowRange] = React.useState<{ start: number; end: number }>({
        start: Math.max(0, processedData.length - VISIBLE_COUNT),
        end: processedData.length
    });

    const containerRef = React.useRef<HTMLDivElement>(null);

    // Sync state if data length changes significantly (e.g. initial load)
    React.useEffect(() => {
        setWindowRange(() => {
            // If we want to stick to the "latest" data on load
            const start = Math.max(0, processedData.length - VISIBLE_COUNT);
            return { start, end: processedData.length };
        });
    }, [processedData.length]);

    // Handle scroll to pan
    React.useEffect(() => {
        const div = containerRef.current;
        if (!div) return;

        const onWheel = (e: WheelEvent) => {
            // Prevent default page scroll behavior completely when over the chart
            e.preventDefault();
            e.stopPropagation();

            // Simple threshold to avoid jitter
            if (Math.abs(e.deltaX) < 1 && Math.abs(e.deltaY) < 1) return;

            setWindowRange(prev => {
                const rangeSize = prev.end - prev.start;
                const total = processedData.length;
                
                // Determine direction and speed
                // Map BOTH horizontal (deltaX) and vertical (deltaY) scroll to horizontal pan
                // This allows standard mouse wheels (deltaY) to pan the chart.
                // Scroll down/right -> pan right (show later dates)
                // Scroll up/left -> pan left (show earlier dates)
                
                const rawDelta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
                const shift = Math.sign(rawDelta) * Math.ceil(Math.abs(rawDelta) / 10);
                
                let newStart = prev.start + shift;
                let newEnd = prev.end + shift;

                // Clamp bounds
                if (newEnd > total) {
                    newEnd = total;
                    newStart = Math.max(0, total - rangeSize);
                }
                if (newStart < 0) {
                    newStart = 0;
                    newEnd = Math.min(total, rangeSize);
                }

                return { start: newStart, end: newEnd };
            });
        };

        // Use non-passive listener to allow preventDefault
        div.addEventListener('wheel', onWheel, { passive: false });
        
        return () => {
            div.removeEventListener('wheel', onWheel);
        };
    }, [processedData.length]);

    // Slice the data for display
    const visibleData = processedData.slice(windowRange.start, windowRange.end);

    return (
        <div 
            ref={containerRef}
            className="w-full h-[500px] select-none touch-none" // touch-none helps with gestures
        >
             <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    data={visibleData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    
                    <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        stroke="rgba(255,255,255,0.3)"
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }}
                        minTickGap={50}
                        // Ensure axis updates smoothly
                        allowDataOverflow={true} 
                    />
                    
                    <YAxis 
                        yAxisId="left"
                        stroke="rgba(59, 130, 246, 0.3)"
                        tick={{ fill: 'rgba(59, 130, 246, 0.5)', fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    
                    <YAxis 
                        yAxisId="right"
                        orientation="right"
                        stroke="rgba(255,255,255,0.1)"
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }}
                    />

                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }} />
                    
                    <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="volume"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#volumeGradient)"
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#60a5fa' }}
                        animationDuration={500} // Faster animation for scrolling
                    />
                    
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="txCount"
                        stroke="#737373" // neutral-500
                        strokeWidth={2}
                        dot={false}
                        strokeDasharray="5 5"
                        animationDuration={500}
                    />
                    {/* Brush removed as requested */}
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default VolumeChart;