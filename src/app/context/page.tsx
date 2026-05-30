"use client";

import React, { useState, useEffect } from "react";
import { useTelemetry } from "@/context/TelemetryContext";
import { CloudRain } from "lucide-react";

export default function ContextPage() {
  const { telemetry, agentResults, config, setConfig } = useTelemetry();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <div className="p-8 max-w-[1800px] mx-auto w-full flex flex-col h-full font-mono bg-[#050505]">
      
      {/* HEADER */}
      <header className="mb-10 flex flex-col gap-4">
        <div className="flex items-center gap-4">
           <h1 className="text-4xl font-black text-white uppercase tracking-tighter">GHOST LAP</h1>
           <div className="px-3 py-1 border border-[#333] bg-[#0a0a0a] text-[10px] text-[#888] font-bold uppercase tracking-widest">
             Environmental Telemetry & Track Surface Diagnostics
           </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1">
        
        {/* LEFT PANELS */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 flex flex-col gap-4">
            <h3 className="text-[10px] text-[#888] uppercase tracking-widest border-b border-[#333] pb-2">Environmental Diagnostics</h3>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-[#666]">Primary Concern:</span>
              <span className="text-lg font-bold text-white uppercase leading-tight">
                {telemetry.weather === 'Rain' ? 'Severe Standing Water' : telemetry.weather === 'Drizzle' ? 'Surface Dampening' : 'Nominal Track Grip'}
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <span className="text-xs text-[#666]">Estimated Time Loss:</span>
              <span className="text-2xl font-black text-[#ff003c]">+{agentResults.contextLoss.toFixed(2)}s</span>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 flex flex-col gap-4">
            <h3 className="text-[10px] text-[#888] uppercase tracking-widest border-b border-[#333] pb-2">Atmospheric Feed</h3>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex justify-between items-center bg-[#111] p-3 border-l-2 border-[#ff003c]">
                <span className="text-[#888] font-bold uppercase tracking-widest text-[10px]">Condition</span>
                <span className={`font-black flex items-center gap-2 ${
                  telemetry.weather === 'Rain' ? 'text-[#ff003c] animate-pulse' : telemetry.weather === 'Drizzle' ? 'text-[#fbbf24]' : 'text-white'
                }`}>
                  <CloudRain className={`w-4 h-4 ${telemetry.weather !== 'Dry' ? 'text-[#ff003c]' : 'text-[#555]'}`} />
                  {telemetry.weather.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#222] pb-2">
                <span className="text-[#888]">Air Temp</span>
                <span className="text-white font-bold">{Math.round(telemetry.trackTemp - 8)}°C</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#222] pb-2">
                <span className="text-[#888]">Track Surface</span>
                <span className="text-white font-bold">{Math.round(telemetry.trackTemp)}°C</span>
              </div>
            </div>
          </div>

          {/* Interactive controls */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 mt-auto">
            <h3 className="text-[10px] text-[#888] uppercase tracking-widest mb-4">Weather Injection Simulator</h3>
            <div className="flex gap-2">
              {(['Clear', 'Drizzle', 'Rain'] as const).map(mode => (
                <button 
                  key={mode}
                  onClick={() => setConfig(prev => ({ ...prev, weatherType: mode === 'Clear' ? 'Dry' : mode as any }))}
                  className={`flex-1 text-[10px] uppercase font-bold py-3 rounded-none transition-all border ${
                    config.weatherType === (mode === 'Clear' ? 'Dry' : mode) ? 'bg-[#ff003c] text-white border-[#ff003c]' : 'bg-[#111] text-[#666] border-[#333] hover:bg-[#222]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER IMAGE (Glowing Red Track SVG) */}
        <div className="xl:col-span-6 relative flex flex-col items-center justify-center min-h-[500px] bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden">
          
          <div className="absolute inset-0 flex items-center justify-center p-12">
            {/* Highly stylized, blocky SVG track layout mimicking Image 1 */}
            <svg viewBox="0 0 800 600" className="w-full h-full max-h-[500px]" preserveAspectRatio="xMidYMid meet">
              <path 
                d="M 150 450 L 300 450 L 400 500 L 600 500 L 700 400 L 650 250 L 750 150 L 650 100 L 500 100 L 450 200 L 300 200 L 250 100 L 100 150 L 150 300 Z" 
                fill="none" 
                stroke="#ff003c" 
                strokeWidth="12" 
                strokeLinejoin="miter" 
                strokeLinecap="square"
                className="opacity-20"
              />
              <path 
                d="M 150 450 L 300 450 L 400 500 L 600 500 L 700 400 L 650 250 L 750 150 L 650 100 L 500 100 L 450 200 L 300 200 L 250 100 L 100 150 L 150 300 Z" 
                fill="none" 
                stroke="#ff003c" 
                strokeWidth="4" 
                strokeLinejoin="miter" 
                strokeLinecap="square"
                style={{ filter: 'drop-shadow(0 0 15px rgba(255,0,60,0.8))' }}
              />
              {/* Fake car blip orbiting the track */}
              <circle cx="0" cy="0" r="10" fill="#fff" filter="drop-shadow(0 0 10px #fff)">
                 <animateMotion 
                    dur={`${telemetry.lastLapTime || 85}s`} 
                    repeatCount="indefinite"
                    path="M 150 450 L 300 450 L 400 500 L 600 500 L 700 400 L 650 250 L 750 150 L 650 100 L 500 100 L 450 200 L 300 200 L 250 100 L 100 150 L 150 300 Z"
                 />
              </circle>
            </svg>
          </div>

          <div className="absolute bottom-6 bg-[#ff003c] text-white px-8 py-3 text-sm font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,0,60,0.5)]">
             Track Layout Matrix Active
          </div>
        </div>

        {/* RIGHT PANELS */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 flex flex-col gap-4">
            <h3 className="text-[10px] text-[#888] uppercase tracking-widest border-b border-[#333] pb-2">Sector Timings</h3>
            <div className="flex flex-col gap-3">
              <div className="bg-[#111] p-3 flex justify-between items-center border-l-2 border-[#333]">
                <span className="text-[#888] font-bold text-xs uppercase">Sector 1</span>
                <span className="text-white font-black">{telemetry.sector > 1 ? '24.312' : (telemetry.sector === 1 ? 'RUNNING' : '--')}</span>
              </div>
              <div className="bg-[#111] p-3 flex justify-between items-center border-l-2 border-[#333]">
                <span className="text-[#888] font-bold text-xs uppercase">Sector 2</span>
                <span className="text-white font-black">{telemetry.sector > 2 ? '33.109' : (telemetry.sector === 2 ? 'RUNNING' : '--')}</span>
              </div>
              <div className="bg-[#111] p-3 flex justify-between items-center border-l-2 border-[#333]">
                <span className="text-[#888] font-bold text-xs uppercase">Sector 3</span>
                <span className="text-white font-black">{telemetry.sector > 3 ? '21.054' : (telemetry.sector === 3 ? 'RUNNING' : '--')}</span>
              </div>
              <div className="mt-4 p-4 border border-[#ff003c] bg-[#1a050a] flex justify-between items-center">
                <span className="text-[#ff003c] font-bold uppercase tracking-widest text-[10px]">Lap Delta</span>
                <span className="text-white font-black text-xl">1:18.475</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 flex flex-col gap-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] text-[#888] uppercase tracking-widest font-bold">Track Grip Coefficient</span>
              <span className="text-2xl font-black text-white">{Math.round(telemetry.trackGrip * 100)}<span className="text-[10px] text-[#555] ml-1">/ 100</span></span>
            </div>
            <div className="w-full bg-[#111] border border-[#333] h-2 mb-4">
              <div className="h-full bg-white transition-all duration-700" style={{ width: `${telemetry.trackGrip * 100}%` }} />
            </div>
            <p className="text-[10px] text-[#666] uppercase leading-relaxed font-bold tracking-widest">
              Water standing accumulation is tracked at <span className="text-white">{telemetry.weather === 'Rain' ? '12.4mm/hr' : telemetry.weather === 'Drizzle' ? '3.2mm/hr' : '0.0mm/hr'}</span>. 
              The optimal racing line is currently experiencing a <span className="text-[#ff003c]">{((1 - telemetry.trackGrip) * 100).toFixed(1)}%</span> reduction in micro-roughness.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
