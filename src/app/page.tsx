"use client";

import React, { useState, useEffect, useRef } from "react";
import { Target, CircleDashed, Disc, Heart, Droplet, Cloud, MessageSquareCode } from "lucide-react";
import { PieChart, Pie, Cell, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine, LineChart } from "recharts";

const performanceHistory = [
  { lap: 7, actualLoss: -0.42, optimalPace: -0.40, delta: -0.02 },
  { lap: 8, actualLoss: -0.35, optimalPace: -0.40, delta: 0.05 },
  { lap: 9, actualLoss: -0.30, optimalPace: -0.40, delta: 0.10 },
  { lap: 10, actualLoss: -0.12, optimalPace: -0.38, delta: 0.26 },
  { lap: 11, actualLoss: 0.04, optimalPace: -0.36, delta: 0.40 },
  { lap: 12, actualLoss: 0.18, optimalPace: -0.35, delta: 0.53 },
  { lap: 13, actualLoss: 0.38, optimalPace: -0.36, delta: 0.74 },
  { lap: 14, actualLoss: 0.61, optimalPace: -0.40, delta: 1.01 },
];

const attributionData = [
  { name: "VEHICLE", value: 34, fill: "#ff003c", loss: "+0.21s" },
  { name: "DRIVER", value: 64, fill: "#8a2be2", loss: "+0.39s" },
  { name: "TRACK", value: 2, fill: "#fbbf24", loss: "+0.01s" },
];

const sparklineDataRed = [{ v: 0 }, { v: 1 }, { v: 0.5 }, { v: 2 }, { v: 1.5 }, { v: 3 }, { v: 5 }];
const sparklineDataGreen = [{ v: 2 }, { v: 1 }, { v: 3 }, { v: 2.5 }, { v: 4 }, { v: 3.5 }, { v: 5 }];

export default function NeuropitOverview() {
  const [isMounted, setIsMounted] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) return <div className="h-full bg-[#050505] p-5"></div>;

  return (
    <div className="flex flex-col h-full font-sans bg-[#050505] p-5 gap-5 overflow-y-auto overflow-x-hidden text-white">

      {/* Title */}
      <div className="flex flex-col shrink-0">
        <h1 className="text-[26px] font-black text-white uppercase tracking-tight">Performance Attribution Overview</h1>
        <span className="text-xs text-[#888] font-semibold mt-1">Real-time analysis of performance degradation and root causes</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

        {/* LEFT MAIN AREA (9 COLUMNS) */}
        <div className="xl:col-span-9 flex flex-col gap-5">

          {/* ROW 1: KPI BLOCKS */}
          <div className="grid grid-cols-3 gap-5">
            {/* Performance Loss */}
            <div className="bg-[#08080c] border border-[#ff003c]/20 p-5 rounded-xl flex justify-between items-center overflow-hidden">
              <div className="flex flex-col justify-center h-full">
                <span className="text-[10px] text-[#ff003c] font-black uppercase tracking-widest mb-1">Performance Loss</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[44px] font-black text-[#ff003c] font-mono tracking-tighter leading-none">+0.61</span>
                  <div className="flex flex-col text-[10px] text-[#888] font-bold leading-tight mt-2">
                    <span>sec</span>
                    <span>/ lap</span>
                  </div>
                </div>
                <span className="text-[10px] text-[#888] font-semibold mt-2">vs Optimal Pace</span>
              </div>
              <div className="w-[75px] h-[40px] flex items-center justify-end mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineDataRed}>
                    <Line type="monotone" dataKey="v" stroke="#ff003c" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Primary Cause */}
            <div className="bg-[#08080c] border border-[#8a2be2]/20 p-5 rounded-xl flex justify-between items-center overflow-hidden">
              <div className="flex flex-col justify-center h-full">
                <span className="text-[10px] text-[#8a2be2] font-black uppercase tracking-widest mb-2">Primary Cause</span>
                <div className="text-[20px] font-black text-[#ff003c] uppercase leading-tight tracking-tight">
                  REAR TIRE<br />THERMAL SLIP
                </div>
                <span className="text-[10px] text-[#888] font-semibold mt-2">Confidence: 91%</span>
              </div>
              <Target className="w-[55px] h-[55px] text-[#8a2be2] stroke-[1.5] mr-2" />
            </div>

            {/* Recovery Potential */}
            <div className="bg-[#08080c] border border-[#00ff88]/20 p-5 rounded-xl flex justify-between items-center overflow-hidden">
              <div className="flex flex-col justify-center h-full">
                <span className="text-[10px] text-[#00ff88] font-black uppercase tracking-widest mb-1">Recovery Potential</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[44px] font-black text-[#00ff88] font-mono tracking-tighter leading-none">1.60</span>
                  <div className="flex flex-col text-[10px] text-[#888] font-bold leading-tight mt-2">
                    <span>sec</span>
                    <span>/ lap</span>
                  </div>
                </div>
                <span className="text-[10px] text-[#888] font-semibold mt-2 w-44 leading-tight">if recommended actions applied</span>
              </div>
              <div className="w-[75px] h-[40px] flex items-center justify-end mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineDataGreen}>
                    <Line type="monotone" dataKey="v" stroke="#00ff88" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ROW 2: MASSIVE CHARTS */}
          <div className="grid grid-cols-12 gap-5 flex-1 min-h-[220px] max-h-[260px]">

            {/* ROOT CAUSE CONTRIBUTION */}
            <div className="col-span-5 bg-[#080808] border border-[#1a1a1a] p-5 flex flex-col rounded-xl">
              <span className="text-[11px] text-white font-black uppercase tracking-widest">Root Cause Contribution</span>
              <span className="text-[9px] text-[#666] font-semibold mb-6">Impact distribution of performance loss</span>
              <div className="flex flex-1 items-center gap-6">
                <div className="flex items-center justify-center w-[140px] h-[140px] shrink-0 mx-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={attributionData} cx="50%" cy="50%" innerRadius={50} outerRadius={65} paddingAngle={3} dataKey="value" stroke="none" isAnimationActive={false}>
                        {attributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-6 w-full justify-center">
                  {attributionData.map(item => (
                    <div key={item.name} className="flex flex-col">
                      <div className="flex items-baseline justify-between w-full">
                        <span className="text-[12px] text-white font-black uppercase tracking-widest flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} /> {item.name}
                        </span>
                        <span className="text-[20px] font-black font-mono leading-none" style={{ color: item.fill }}>{item.value}%</span>
                      </div>
                      <span className="text-[10px] text-[#888] font-mono mt-1.5 ml-5">Impact: {item.loss}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PERFORMANCE TREND CHART */}
            <div className="col-span-7 bg-[#080808] border border-[#1a1a1a] p-5 flex flex-col rounded-xl relative overflow-hidden">

              {/* Subtle corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#ff003c]/4 to-transparent pointer-events-none" />

              {/* Header */}
              <div className="flex justify-between items-start mb-4 z-10">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-white font-black uppercase tracking-widest">
                    Performance Trend
                    <span className="text-[#444] font-semibold tracking-normal ml-2 normal-case">sec / lap</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] text-[#555] uppercase tracking-widest font-bold">LAP 7 – 14</span>
                    <span className="px-1.5 py-0.5 bg-[#ff003c]/10 border border-[#ff003c]/20 text-[#ff003c] text-[8px] font-black uppercase tracking-widest rounded-sm">DEGRADING</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-[22px] font-black text-[#ff003c] font-mono leading-none">+0.61s</div>
                  <span className="text-[9px] text-[#555] font-bold uppercase tracking-widest">current delta</span>
                </div>
              </div>

              {/* Chart */}
              <div className="flex-1 w-full min-h-0 z-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={performanceHistory} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff003c" stopOpacity={0.22} />
                        <stop offset="100%" stopColor="#ff003c" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="optimalGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.10} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 4" stroke="#161616" vertical={false} />

                    {/* Zero baseline */}
                    <ReferenceLine y={0} stroke="#2a2a2a" strokeWidth={1.5} strokeDasharray="0" />

                    <XAxis
                      dataKey="lap"
                      stroke="#1e1e1e"
                      tick={{ fill: '#555', fontSize: 9, fontFamily: 'monospace', fontWeight: 700 }}
                      tickFormatter={(v) => `L${v}`}
                      axisLine={{ stroke: '#1a1a1a' }}
                      tickLine={false}
                      dy={8}
                    />
                    <YAxis
                      stroke="#1e1e1e"
                      tick={{ fill: '#555', fontSize: 9, fontFamily: 'monospace', fontWeight: 700 }}
                      domain={[-0.6, 0.8]}
                      ticks={[-0.4, 0, 0.4, 0.8]}
                      tickFormatter={(v) => v > 0 ? `+${v}` : `${v}`}
                      axisLine={false}
                      tickLine={false}
                      width={32}
                    />

                    <Tooltip
                      cursor={{ stroke: '#2a2a2a', strokeWidth: 1, strokeDasharray: '4 3' }}
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        const loss = payload.find(p => p.dataKey === 'actualLoss')?.value as number;
                        const pace = payload.find(p => p.dataKey === 'optimalPace')?.value as number;
                        return (
                          <div className="bg-[#0e0e0e] border border-[#222] rounded-lg px-3 py-2.5 shadow-xl">
                            <div className="text-[9px] text-[#555] font-black uppercase tracking-widest mb-2">LAP {label}</div>
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-[#ff003c]" />
                                  <span className="text-[9px] text-[#888] uppercase tracking-widest font-bold">Actual</span>
                                </div>
                                <span className={`text-[11px] font-black font-mono ${loss > 0 ? 'text-[#ff003c]' : 'text-[#00cc6a]'}`}>
                                  {loss > 0 ? '+' : ''}{loss?.toFixed(2)}s
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-0.5 bg-[#3b82f6]" />
                                  <span className="text-[9px] text-[#888] uppercase tracking-widest font-bold">Optimal</span>
                                </div>
                                <span className="text-[11px] font-black font-mono text-[#3b82f6]">
                                  {pace?.toFixed(2)}s
                                </span>
                              </div>
                              <div className="border-t border-[#1a1a1a] pt-1.5 mt-0.5 flex justify-between items-center">
                                <span className="text-[9px] text-[#555] uppercase tracking-widest font-bold">Δ Delta</span>
                                <span className="text-[11px] font-black font-mono text-[#ff9500]">
                                  +{(loss - pace).toFixed(2)}s
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />

                    {/* Optimal pace area */}
                    <Area type="monotone" dataKey="optimalPace" stroke="#3b82f6" strokeWidth={1.5}
                      strokeDasharray="5 3" fill="url(#optimalGrad)" fillOpacity={1}
                      dot={false} isAnimationActive={false} />

                    {/* Actual loss area */}
                    <Area type="monotone" dataKey="actualLoss" stroke="#ff003c" strokeWidth={2}
                      fill="url(#lossGrad)" fillOpacity={1} isAnimationActive={false}
                      dot={({ cx, cy, payload }) => (
                        <circle
                          key={`dot-${payload.lap}`}
                          cx={cx} cy={cy} r={payload.lap === 14 ? 4 : 2.5}
                          fill={payload.lap === 14 ? '#ff003c' : '#0e0e0e'}
                          stroke="#ff003c" strokeWidth={1.5}
                        />
                      )}
                    />

                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mt-3 z-10">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-[#ff003c] rounded-full" />
                  <span className="text-[9px] text-[#555] uppercase font-bold tracking-widest">Actual Loss</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="16" height="4"><line x1="0" y1="2" x2="16" y2="2" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 2" /></svg>
                  <span className="text-[9px] text-[#555] uppercase font-bold tracking-widest">Optimal Pace</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="w-2 h-2 rounded-full bg-[#ff003c]" />
                  <span className="text-[9px] text-[#555] uppercase font-bold tracking-widest">Peak at Lap 14</span>
                </div>
              </div>

            </div>
          </div>

          {/* ROW 3: TRIPLE BOTTOM PANELS */}
          <div className="grid grid-cols-12 gap-5 shrink-0">

            {/* QUICK STATUS */}
            <div className="col-span-5 bg-[#080808] border border-[#1a1a1a] p-5 rounded-xl flex flex-col justify-between">
              <span className="text-[11px] text-white font-black uppercase tracking-widest mb-5">Quick Status</span>
              <div className="grid grid-cols-4 gap-4 flex-1">
                {/* Tire Health */}
                <div className="flex flex-col items-center justify-end h-full">
                  <CircleDashed className="w-6 h-6 text-[#555] mb-3" />
                  <span className="text-[8px] text-[#888] font-bold uppercase tracking-widest text-center h-6 flex items-center">Tire Health</span>
                  <span className="text-xl font-black text-[#ff003c] font-mono leading-none my-2">42%</span>
                  <span className="text-[8px] text-[#ff003c] font-bold uppercase tracking-widest text-center mb-3">Rear Left</span>
                  <div className="w-full h-1 bg-[#1a1a1a] rounded-full overflow-hidden mt-auto">
                    <div className="h-full bg-[#ff003c]" style={{ width: '42%' }} />
                  </div>
                </div>

                {/* Brake Temp */}
                <div className="flex flex-col items-center justify-end h-full">
                  <Disc className="w-6 h-6 text-[#555] mb-3" />
                  <span className="text-[8px] text-[#888] font-bold uppercase tracking-widest text-center h-6 flex items-center">Brake Temp</span>
                  <span className="text-xl font-black text-[#ff003c] font-mono leading-none my-2">853°</span>
                  <span className="text-[8px] text-[#ff003c] font-bold uppercase tracking-widest text-center mb-3">Rear Right</span>
                  <div className="w-full h-1 bg-[#1a1a1a] rounded-full overflow-hidden mt-auto">
                    <div className="h-full bg-[#ff003c]" style={{ width: '85.3%' }} />
                  </div>
                </div>

                {/* Driver HR */}
                <div className="flex flex-col items-center justify-end h-full">
                  <Heart className="w-6 h-6 text-[#ff003c] fill-[#ff003c]/20 mb-3" />
                  <span className="text-[8px] text-[#888] font-bold uppercase tracking-widest text-center h-6 flex items-center">Driver HR</span>
                  <div className="flex items-baseline gap-0.5 my-2">
                    <span className="text-xl font-black text-[#ff003c] font-mono leading-none">156</span>
                  </div>
                  <span className="text-[8px] text-[#ff003c] font-bold uppercase tracking-widest text-center mb-3">bpm - High</span>
                  <div className="w-full h-1 bg-[#1a1a1a] rounded-full overflow-hidden mt-auto">
                    <div className="h-full bg-[#ff003c]" style={{ width: '78%' }} />
                  </div>
                </div>

                {/* Hydration */}
                <div className="flex flex-col items-center justify-end h-full">
                  <Droplet className="w-6 h-6 text-[#00f0ff] fill-[#00f0ff]/20 mb-3" />
                  <span className="text-[8px] text-[#888] font-bold uppercase tracking-widest text-center h-6 flex items-center">Hydration</span>
                  <span className="text-xl font-black text-[#fbbf24] font-mono leading-none my-2">64%</span>
                  <span className="text-[8px] text-[#fbbf24] font-bold uppercase tracking-widest text-center mb-3">Low</span>
                  <div className="w-full h-1 bg-[#1a1a1a] rounded-full overflow-hidden mt-auto">
                    <div className="h-full bg-[#fbbf24]" style={{ width: '64%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* SESSION OVERVIEW */}
            <div className="col-span-3 bg-[#080808] border border-[#1a1a1a] p-5 rounded-xl flex flex-col justify-between">
              <span className="text-[11px] text-white font-black uppercase tracking-widest mb-4">Session Overview</span>
              <div className="flex flex-col gap-5 flex-1 justify-center">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] text-[#666] font-bold uppercase tracking-widest">Best Lap</span>
                  <span className="text-[20px] font-black text-[#8a2be2] font-mono leading-none">1:12.456</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] text-[#666] font-bold uppercase tracking-widest">Last Lap</span>
                  <span className="text-[20px] font-black text-white font-mono leading-none">1:27.450</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] text-[#666] font-bold uppercase tracking-widest">Fuel Remaining</span>
                  <span className="text-[20px] font-black text-[#ff003c] font-mono leading-none">28.4 L</span>
                </div>
              </div>
            </div>

            {/* RISK SUMMARY */}
            <div className="col-span-4 bg-[#080808] border border-[#1a1a1a] p-5 rounded-xl flex flex-col justify-between">
              <span className="text-[11px] text-white font-black uppercase tracking-widest mb-6 flex items-center gap-2">Risk Summary <span className="text-[#ff003c] border border-[#ff003c]/30 rounded-sm px-1.5 py-0.5 flex items-center justify-center bg-[#ff003c]/10 text-[10px]">⚠️</span></span>
              <div className="flex flex-col gap-5 flex-1 justify-center">

                <div className="flex items-center justify-between text-[9px] text-[#888] font-bold tracking-widest gap-2">
                  <span className="flex-1 whitespace-nowrap">REAR TIRE FAILURE</span>
                  <span className="text-white font-mono text-[10px] text-right w-8">78%</span>
                  <span className="text-[#ff003c] text-[8px] font-black w-10 text-center">HIGH</span>
                  <div className="w-20 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden shrink-0">
                    <div className="h-full bg-[#ff003c]" style={{ width: '78%' }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] text-[#888] font-bold tracking-widest gap-2">
                  <span className="flex-1 whitespace-nowrap">BRAKE OVERHEAT</span>
                  <span className="text-white font-mono text-[10px] text-right w-8">42%</span>
                  <span className="text-[#fbbf24] text-[8px] font-black w-10 text-center">MED</span>
                  <div className="w-20 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden shrink-0">
                    <div className="h-full bg-[#fbbf24]" style={{ width: '42%' }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] text-[#888] font-bold tracking-widest gap-2">
                  <span className="flex-1 whitespace-nowrap">DRIVER FATIGUE</span>
                  <span className="text-white font-mono text-[10px] text-right w-8">65%</span>
                  <span className="text-[#ff003c] text-[8px] font-black w-10 text-center">HIGH</span>
                  <div className="w-20 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden shrink-0">
                    <div className="h-full bg-[#ff003c]" style={{ width: '65%' }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] text-[#888] font-bold tracking-widest gap-2">
                  <span className="flex-1 whitespace-nowrap">HYDRATION DROP</span>
                  <span className="text-white font-mono text-[10px] text-right w-8">58%</span>
                  <span className="text-[#fbbf24] text-[8px] font-black w-10 text-center">MED</span>
                  <div className="w-20 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden shrink-0">
                    <div className="h-full bg-[#fbbf24]" style={{ width: '58%' }} />
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* RIGHT SIDEBAR (IBM GRANITE & TRACK CONDITIONS) */}
        <div className="xl:col-span-3 flex flex-col gap-5">

          {/* TERMINAL */}
          <div className="bg-[#050505] border border-[#1a1a1a] flex flex-col rounded-xl flex-1 overflow-hidden relative min-h-[300px]">
            <div className="p-4 border-b border-[#1a1a1a] flex flex-col shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-[#00f0ff] flex items-center justify-center bg-[#00f0ff]/10 text-[#00f0ff] font-black text-sm">
                  a/I
                </div>
                <div className="flex flex-col">
                  <h2 className="text-white text-[12px] font-black uppercase tracking-widest">IBM Granite Terminal</h2>
                  <div className="text-[9px] text-[#888] uppercase tracking-widest flex items-center gap-1.5 mt-1 font-bold">
                    <span className="w-2 h-2 bg-[#00ff88] rounded-full" /> Connected (Lat: 380ms)
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal Logs */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6 font-mono text-[11px] leading-relaxed">
              <div className="flex flex-col gap-1.5">
                <div className="flex gap-4 text-[#555] uppercase font-bold tracking-widest text-[9px]">
                  <span>10:45:50 PM</span>
                  <span>GRANITE ENGINE</span>
                </div>
                <div className="text-[#a0a0a0] leading-relaxed pr-4">
                  Granite-20B-Multilingual initialized.<br />
                  Monitoring tire thermals and<br />
                  driver cognitive load.
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex gap-4 text-[#555] uppercase font-bold tracking-widest text-[9px]">
                  <span>10:45:58 PM</span>
                  <span>SYSTEM AGENT</span>
                </div>
                <div className="text-[#ff003c] bg-[#ff003c]/10 border border-[#ff003c]/20 p-3 rounded-md pr-4 shadow-[0_0_15px_rgba(255,0,60,0.05)]">
                  Anomaly detected:<br />
                  Rear Tire Thermal Slip.<br />
                  Requesting tactical inference.
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex gap-4 text-[#555] uppercase font-bold tracking-widest text-[9px]">
                  <span>10:46:05 PM</span>
                  <span>GRANITE ENGINE</span>
                </div>
                <div className="text-[#a0a0a0] leading-relaxed pr-4">
                  Strategy Updated [High]:<br />
                  Box for Hard Tyres.<br />
                  Rear tyre carcass degradation<br />
                  has entered terminal phase.
                </div>
              </div>
            </div>
          </div>

          {/* SUGGESTED COMMAND */}
          <div className="bg-[#080808] border border-[#1a1a1a] p-5 rounded-xl shrink-0 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-[#888] uppercase font-bold tracking-widest">Suggested Command</span>
              <span className="text-[10px] text-[#ff003c] uppercase font-black tracking-widest">Critical Priority</span>
            </div>

            <button
              className="w-full py-4 px-6 font-black text-sm uppercase flex items-center justify-between tracking-widest transition-all rounded-md bg-[#ff003c] text-white hover:bg-white hover:text-black shadow-[0_0_20px_rgba(255,0,60,0.15)]"
            >
              <span className="truncate">BOX FOR HARD TYRES</span>
              <span className="shrink-0 text-lg leading-none">→</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
