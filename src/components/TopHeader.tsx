"use client";

import React from 'react';
import { useTelemetry } from '@/context/TelemetryContext';

export function TopHeader() {
  const { telemetry } = useTelemetry();

  return (
    <div className="h-[80px] bg-[#050505] border-b border-[#1a1a1a] flex items-center justify-between px-8 font-mono shrink-0">
      
      {/* Session Info */}
      <div className="flex items-center gap-12 h-full">
        
        <div className="flex flex-col">
          <span className="text-[9px] text-[#666] uppercase font-bold tracking-widest">Session</span>
          <span className="text-white font-black text-sm tracking-widest mt-1">RACE</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-[9px] text-[#666] uppercase font-bold tracking-widest">Lap</span>
          <span className="text-white font-black text-sm tracking-widest mt-1">{telemetry.lap} <span className="text-[#555]">/ 58</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] text-[#666] uppercase font-bold tracking-widest">Track</span>
            <span className="text-white font-black text-sm tracking-widest mt-1 uppercase">MONACO</span>
          </div>
          {/* Simple Monaco Track Outline Placeholder */}
          <svg viewBox="0 0 100 40" className="w-16 h-6 stroke-[#333] fill-transparent stroke-2 ml-2">
            <path d="M10,20 Q20,10 40,15 T70,10 T90,20 T70,30 T40,25 T20,35 Q10,35 10,20" />
          </svg>
        </div>

      </div>

      {/* Environmental Data */}
      <div className="flex items-center gap-10">
        <div className="flex flex-col">
          <span className="text-[9px] text-[#666] uppercase font-bold tracking-widest">Air Temp</span>
          <span className="text-[#ccc] font-bold text-sm tracking-wider mt-1">24.7°C</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-[#666] uppercase font-bold tracking-widest">Track Temp</span>
          <span className="text-[#ccc] font-bold text-sm tracking-wider mt-1">{Math.round(telemetry.trackTemp)}°C</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-[#666] uppercase font-bold tracking-widest">Humidity</span>
          <span className="text-[#ccc] font-bold text-sm tracking-wider mt-1">68%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-[#666] uppercase font-bold tracking-widest">Wind</span>
          <span className="text-[#ccc] font-bold text-sm tracking-wider mt-1">6.3 km/h</span>
        </div>
      </div>

      {/* Connection Status */}
      <div className="flex items-center gap-6 border-l border-[#1a1a1a] pl-8 h-full py-4">
        <div className="flex flex-col gap-2">
          <span className="text-[9px] text-[#ff003c] font-black tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#ff003c] rounded-full animate-pulse" /> LIVE TELEMETRY
          </span>
          <span className="text-[9px] text-[#00ff88] font-bold tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full" /> CONNECTED
          </span>
        </div>
      </div>

    </div>
  );
}
