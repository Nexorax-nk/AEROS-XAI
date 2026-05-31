"use client";

import React, { useState, useEffect } from "react";
import { useTelemetry } from "@/context/TelemetryContext";
import { AlertCircle, Gauge, Flame, Wind, Activity } from "lucide-react";

export default function VehiclePage() {
  const { telemetry, agentResults, config, setConfig } = useTelemetry();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const getTireColor = (temp: number, wear: number) => {
    if (wear > 60 || temp > 120) return '#ff003c'; // High risk - Red
    if (wear > 30 || temp > 100) return '#fbbf24'; // Medium - Yellow
    return '#1a1a1a'; // Low - Dark
  };

  const getEngineColor = (temp: number) => {
    if (temp > 108) return '#ff003c';
    if (temp > 102) return '#fbbf24';
    return '#1a1a1a';
  };

  const getBrakeColorClass = (temp: number) => {
    if (temp > 800) return 'text-[#ff003c] drop-shadow-[0_0_5px_rgba(255,0,60,0.6)]';
    if (temp > 600) return 'text-[#e0e0e0]';
    return 'text-[#00f0ff]';
  };

  if (!isMounted) return <div className="h-full bg-[#050505]"></div>;

  return (
    <div className="flex flex-col h-full font-sans bg-[#050505] p-3 gap-2 overflow-hidden text-white">
      
      {/* HEADER */}
      <div className="flex flex-col shrink-0">
        <h1 className="text-[20px] font-black text-white uppercase tracking-tight flex items-center gap-3">
          Vehicle Intel 
          <span className="px-2 py-0.5 border border-[#333] bg-[#0a0a0a] text-[9px] text-[#888] font-bold uppercase tracking-widest flex items-center gap-1.5 rounded-sm">
            <span className="w-1.5 h-1.5 bg-[#ff003c] rounded-full animate-pulse shadow-[0_0_5px_rgba(255,0,60,0.8)]" /> Active Monitoring
          </span>
        </h1>
        <span className="text-[10px] text-[#888] font-semibold mt-0.5">Mechanical degradation & powertrain analysis matrix</span>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 flex-1 min-h-0 overflow-hidden">
        
        {/* LEFT COLUMN: DIAGNOSTICS & POWERTRAIN */}
        <div className="xl:col-span-3 flex flex-col gap-3 min-h-0 overflow-hidden">
          
          <div className="bg-[#080808] border border-[#1a1a1a] p-3 rounded-xl flex flex-col relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#ff003c]/5 to-transparent pointer-events-none" />
            <span className="text-[9px] text-[#555] uppercase tracking-[0.2em] font-bold mb-3 flex items-center gap-2">
              <AlertCircle className="w-3 h-3 text-[#555]" /> Diagnostic Assessment
            </span>
            <div className="flex flex-col gap-0.5 mb-2">
              <span className="text-[9px] text-[#888] uppercase tracking-wider font-semibold">Primary Concern:</span>
              <span className="text-sm font-black text-white uppercase leading-tight tracking-tight mt-0.5">{agentResults.primaryVehicleConcern}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-[#888] uppercase tracking-wider font-semibold">Time Loss:</span>
                <span className="text-2xl font-black text-[#ff003c] font-mono tracking-tighter leading-none">
                  +{agentResults.vehicleLoss.toFixed(2)}s
                </span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-[#ff003c]/10 border border-[#ff003c]/20 text-[#ff003c]">CRITICAL</span>
            </div>
          </div>

          {/* POWERTRAIN FEED */}
          <div className="bg-[#080808] border border-[#1a1a1a] p-4 rounded-xl flex flex-col shrink-0 relative overflow-hidden">
            <span className="text-[9px] text-[#555] uppercase tracking-[0.2em] font-bold mb-5 flex items-center gap-2">
              <Gauge className="w-3 h-3 text-[#555]" /> Powertrain Feed
            </span>
            
            {/* Tachometer (RPM) */}
            <div className="flex flex-col gap-1.5 mb-5">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-[#888] font-bold uppercase tracking-widest">RPM Limit</span>
                <span className="text-[22px] font-black text-white font-mono leading-none tracking-tighter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{Math.round(telemetry.rpm)}</span>
              </div>
              <div className="flex gap-0.5 h-3.5 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#ffdd00]/10 via-[#ff6600]/10 to-[#ff003c]/10 blur-sm pointer-events-none" />
                {Array.from({ length: 30 }).map((_, i) => {
                  const percent = i / 30;
                  const isActive = (telemetry.rpm / 18000) > percent;
                  const color = percent > 0.85 ? 'bg-[#ff003c] shadow-[0_0_8px_rgba(255,0,60,0.8)]' : percent > 0.60 ? 'bg-[#ff6600] shadow-[0_0_8px_rgba(255,102,0,0.8)]' : 'bg-[#ffdd00] shadow-[0_0_8px_rgba(255,221,0,0.8)]';
                  return (
                    <div key={i} className={`flex-1 skew-x-[-20deg] ${isActive ? color : 'bg-[#111]'}`} />
                  )
                })}
              </div>
            </div>

            {/* Speed & Gear */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-[#0c0c0c] border border-[#1a1a1a] rounded-lg p-3 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-[#00f0ff]/5 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="text-[9px] text-[#666] font-black uppercase tracking-widest mb-1.5 relative z-10">Speed</span>
                <div className="flex items-baseline gap-1 relative z-10">
                  <span className="text-[28px] font-black text-white font-mono tracking-tighter leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{Math.round(telemetry.speed)}</span>
                  <span className="text-[10px] text-[#555] font-bold uppercase">km/h</span>
                </div>
              </div>
              <div className="bg-[#0c0c0c] border border-[#1a1a1a] rounded-lg p-3 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-[#00f0ff]/5 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="text-[9px] text-[#666] font-black uppercase tracking-widest mb-1.5 relative z-10">Gear</span>
                <span className="text-[28px] font-black text-[#00f0ff] font-mono tracking-tighter leading-none drop-shadow-[0_0_10px_rgba(0,240,255,0.4)] relative z-10">{telemetry.gear}</span>
              </div>
            </div>

            {/* Temp & Battery */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-[#0a0a0a] p-2 rounded-md border border-[#111] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#fbbf24] to-transparent opacity-30" />
                <div className="relative w-9 h-9 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90 drop-shadow-[0_0_5px_rgba(251,191,36,0.3)]">
                    <path className="text-[#151515]" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className={telemetry.engineTemp > 108 ? 'text-[#ff003c]' : 'text-[#fbbf24]'} strokeWidth="3" strokeDasharray={`${Math.min(((telemetry.engineTemp - 80) / 50) * 100, 100)}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                </div>
                <div className="flex flex-col z-10">
                  <span className="text-[8px] text-[#666] font-black uppercase tracking-widest">Eng Temp</span>
                  <span className="text-[14px] font-black text-white font-mono">{telemetry.engineTemp.toFixed(1)}°</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#0a0a0a] p-2 rounded-md border border-[#111] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#00ff88] to-transparent opacity-30" />
                <div className="relative w-9 h-9 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90 drop-shadow-[0_0_5px_rgba(0,255,136,0.3)]">
                    <path className="text-[#151515]" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-[#00ff88]" strokeWidth="3" strokeDasharray={`${telemetry.batteryHealth}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                </div>
                <div className="flex flex-col z-10">
                  <span className="text-[8px] text-[#666] font-black uppercase tracking-widest">Bat ERS</span>
                  <span className="text-[14px] font-black text-white font-mono drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">{telemetry.batteryHealth.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* MECHANICAL INTEGRITY */}
          <div className="bg-[#080808] border border-[#1a1a1a] p-4 rounded-xl flex-1 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00f0ff]/5 to-transparent pointer-events-none" />
            <span className="text-[9px] text-[#555] uppercase tracking-[0.2em] font-bold mb-4 flex items-center gap-2 relative z-10">
              <Activity className="w-3 h-3 text-[#555]" /> Mechanical Integrity
            </span>

            <div className="flex flex-col gap-5 flex-1 justify-center relative z-10">
              {/* Gearbox */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#888] font-bold uppercase tracking-widest">Gearbox Health</span>
                  <span className="text-[16px] text-[#00f0ff] font-black font-mono drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">{(94.2 - (telemetry.rpm / 50000)).toFixed(1)}<span className="text-[10px] text-[#00f0ff]/70">%</span></span>
                </div>
                <div className="w-full h-1.5 bg-[#111] rounded-full overflow-hidden relative shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
                   <div className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#00f0ff]/20 via-[#00f0ff]/80 to-[#00f0ff] rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]" style={{ width: `${(94.2 - (telemetry.rpm / 50000)).toFixed(0)}%` }}>
                     <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/40 blur-[2px] animate-pulse" />
                   </div>
                </div>
              </div>

              {/* Fuel Flow */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#888] font-bold uppercase tracking-widest">Fuel Flow</span>
                  <span className="text-[16px] text-white font-black font-mono drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">{((telemetry.rpm / 12000) * 98.5).toFixed(1)}<span className="text-[10px] text-[#666]"> kg/h</span></span>
                </div>
                <div className="flex h-1.5 gap-1">
                  {Array.from({ length: 15 }).map((_, i) => {
                    const percent = i / 15;
                    const isActive = (((telemetry.rpm / 12000) * 98.5) / 105) > percent;
                    return <div key={i} className={`flex-1 rounded-sm transition-all duration-75 ${isActive ? 'bg-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.4)]' : 'bg-[#111]'}`} />
                  })}
                </div>
              </div>

              {/* Suspension */}
              <div className="bg-[#0c0c0c] border border-[#1a1a1a] p-3 rounded-lg flex justify-between items-center mt-2 z-10 group hover:border-[#333] transition-colors">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#888] font-bold uppercase tracking-widest group-hover:text-[#aaa] transition-colors">Suspension Load</span>
                  <span className="text-[8px] text-[#555] uppercase mt-0.5 tracking-widest">Aero Downforce</span>
                </div>
                <span className={`text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm ${telemetry.speed > 250 ? 'bg-[#ff003c]/10 border border-[#ff003c]/20 text-[#ff003c] shadow-[0_0_10px_rgba(255,0,60,0.2)]' : telemetry.speed > 100 ? 'bg-[#fbbf24]/10 border border-[#fbbf24]/30 text-[#fbbf24] shadow-[0_0_10px_rgba(251,191,36,0.2)]' : 'bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.1)]'}`}>
                  {telemetry.speed > 250 ? 'HIGH 4G' : telemetry.speed > 100 ? 'MED 2G' : 'LOW 1G'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* CENTER COLUMN: ADVANCED F1 SVG */}
        <div className="xl:col-span-6 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl relative flex flex-col items-center justify-center overflow-hidden min-h-[400px] shadow-[inset_0_0_80px_rgba(0,0,0,1)]">
          {/* Subtle grid background */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }} />
          
          {/* Center glow behind car */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[450px] bg-[#ff003c] rounded-full blur-[120px] opacity-[0.08] pointer-events-none" />
          
          <div className="relative w-full h-full flex items-center justify-center p-10 z-10">
            <svg viewBox="0 0 200 400" className="w-full max-w-[340px] h-auto drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
              <defs>
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1a1a1a" />
                  <stop offset="25%" stopColor="#222" />
                  <stop offset="50%" stopColor="#333" />
                  <stop offset="75%" stopColor="#222" />
                  <stop offset="100%" stopColor="#1a1a1a" />
                </linearGradient>
                <linearGradient id="sidepodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0a0a0a" />
                  <stop offset="50%" stopColor="#1a1a1a" />
                  <stop offset="100%" stopColor="#050505" />
                </linearGradient>
                <linearGradient id="wingMetal" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#222" />
                  <stop offset="100%" stopColor="#0a0a0a" />
                </linearGradient>
                <linearGradient id="engineHeat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
                  <stop offset="40%" stopColor="#ff5500" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ff003c" stopOpacity="0" />
                </linearGradient>
                <filter id="carGlow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Suspension Arms */}
              {/* Suspension Arms */}
              <g stroke="#111" strokeWidth="4" opacity="0.9">
                {/* Front Left A-Arm */}
                <line x1="88" y1="95" x2="57" y2="85" />
                <line x1="88" y1="125" x2="57" y2="90" />
                <line x1="88" y1="125" x2="57" y2="120" />
                {/* Front Right A-Arm */}
                <line x1="112" y1="95" x2="143" y2="85" />
                <line x1="112" y1="125" x2="143" y2="90" />
                <line x1="112" y1="125" x2="143" y2="120" />
                {/* Rear Left (Thickened) */}
                <line x1="92" y1="245" x2="58" y2="235" strokeWidth="3" />
                <line x1="92" y1="260" x2="58" y2="250" strokeWidth="3" />
                <line x1="92" y1="255" x2="58" y2="270" strokeWidth="3" />
                {/* Rear Right (Thickened) */}
                <line x1="108" y1="245" x2="142" y2="235" strokeWidth="3" />
                <line x1="108" y1="260" x2="142" y2="250" strokeWidth="3" />
                <line x1="108" y1="255" x2="142" y2="270" strokeWidth="3" />
              </g>

              {/* Floor / Carbon Base */}
              <path d="M 75 135 L 125 135 L 142 185 L 140 265 L 60 265 L 58 185 Z" fill="#080808" stroke="#111" strokeWidth="1" />
              
              {/* Floor Edge Aero (Coke bottle section) */}
              <path d="M 58 190 L 50 205 L 53 205 L 45 225 L 62 225 Z" fill="#111" stroke="#222" strokeWidth="1" />
              <path d="M 142 190 L 150 205 L 147 205 L 155 225 L 138 225 Z" fill="#111" stroke="#222" strokeWidth="1" />

              {/* Diffuser Strakes */}
              <g stroke="#1a1a1a" strokeWidth="1.5">
                <line x1="75" y1="265" x2="70" y2="290" />
                <line x1="85" y1="265" x2="82" y2="290" />
                <line x1="115" y1="265" x2="118" y2="290" />
                <line x1="125" y1="265" x2="130" y2="290" />
              </g>

              {/* Rear Brake Ducts */}
              <rect x="52" y="235" width="6" height="15" fill="#111" rx="2" />
              <rect x="142" y="235" width="6" height="15" fill="#111" rx="2" />

              {/* Front Wing Complex (Narrow Width matching Rear Wing) */}
              
              {/* Black Secondary Flaps */}
              {/* Left Flaps */}
              <path d="M 94 54 L 58 54 L 48 75 L 52 75 L 62 62 L 94 62 Z" fill="#111" />
              <path d="M 94 62 L 62 62 L 52 77 L 56 77 L 66 68 L 94 68 Z" fill="#1a1a1a" />
              {/* Right Flaps */}
              <path d="M 106 54 L 142 54 L 152 75 L 148 75 L 138 62 L 106 62 Z" fill="#111" />
              <path d="M 106 62 L 138 62 L 148 77 L 144 77 L 134 68 L 106 68 Z" fill="#1a1a1a" />

              {/* Main Red Swept Wing */}
              {/* Left Wing */}
              <path d="M 94 50 L 54 50 L 46 74 L 52 74 L 62 58 L 94 58 Z" fill="#ff003c" />
              {/* Right Wing */}
              <path d="M 106 50 L 146 50 L 154 74 L 148 74 L 138 58 L 106 58 Z" fill="#ff003c" />

              {/* Angular Endplates */}
              {/* Left Endplate */}
              <path d="M 52 48 L 56 48 L 46 77 L 42 77 Z" fill="#ff003c" stroke="#cc0030" strokeWidth="1" />
              {/* Right Endplate */}
              <path d="M 144 48 L 148 48 L 158 77 L 154 77 Z" fill="#ff003c" stroke="#cc0030" strokeWidth="1" />

              {/* Nose Cone */}
              <path d="M 94 45 C 94 35, 106 35, 106 45 L 112 135 L 88 135 Z" fill="#ff003c" />
              {/* White racing stripes */}
              <line x1="97" y1="42" x2="94" y2="135" stroke="#ddd" strokeWidth="1.5" opacity="0.8" />
              <line x1="103" y1="42" x2="106" y2="135" stroke="#ddd" strokeWidth="1.5" opacity="0.8" />
              
              {/* Chassis Main */}
              <path d="M 88 135 L 112 135 L 118 165 L 82 165 Z" fill="url(#bodyGradient)" />

              {/* Sidepods */}
              {/* Left Sidepod */}
              <path d="M 62 150 L 82 150 L 82 235 L 65 235 C 60 215, 56 175, 62 150 Z" fill="url(#sidepodGradient)" stroke="#1a1a1a" strokeWidth="1" />
              <path d="M 62 150 C 65 145, 75 145, 82 150 L 82 157 L 62 157 Z" fill="#000" /> {/* Intake Hole */}
              
              {/* Right Sidepod */}
              <path d="M 138 150 L 118 150 L 118 235 L 135 235 C 140 215, 144 175, 138 150 Z" fill="url(#sidepodGradient)" stroke="#1a1a1a" strokeWidth="1" />
              <path d="M 138 150 C 135 145, 125 145, 118 150 L 118 157 L 138 157 Z" fill="#000" /> {/* Intake Hole */}

              {/* Engine Cover */}
              <path d="M 82 205 L 118 205 L 108 285 L 92 285 Z" fill="url(#bodyGradient)" />
              {/* Shark Fin */}
              <line x1="100" y1="205" x2="100" y2="280" stroke="#111" strokeWidth="2" />

              {/* Engine Heat Glow (Symmetrical) */}
              {telemetry.engineTemp > 102 && (
                <path d="M 96 245 L 104 245 L 108 295 L 92 295 Z" fill="url(#engineHeat)" filter="url(#carGlow)" className="animate-pulse" />
              )}

              {/* Rear Wing Structure */}
              <rect x="96" y="280" width="8" height="25" fill="#111" />
              <path d="M 55 300 L 145 300 L 142 320 L 58 320 Z" fill="url(#wingMetal)" stroke="#1a1a1a" strokeWidth="1" />
              {/* Rear Wing Endplates */}
              <rect x="53" y="290" width="4" height="35" fill="#ff003c" rx="1" />
              <rect x="143" y="290" width="4" height="35" fill="#ff003c" rx="1" />
              
              {/* Exhaust/DRS Actuator */}
              <circle cx="100" cy="310" r="4" fill="#000" stroke="#333" strokeWidth="1" />
              <circle cx="100" cy="310" r="2" fill="#ff003c" filter="url(#carGlow)" /> {/* Tail light */}

              {/* Cockpit Hole */}
              <path d="M 88 170 C 88 160, 112 160, 112 170 L 110 200 C 110 210, 90 210, 90 200 Z" fill="#050505" stroke="#1a1a1a" strokeWidth="2" />
              
              {/* Driver Helmet */}
              <circle cx="100" cy="183" r="7.5" fill="#fbbf24" />
              <path d="M 94 180 Q 100 187 106 180 Z" fill="#111" /> {/* Visor */}

              {/* Halo Structure */}
              {/* Central Pillar */}
              <rect x="98.5" y="165" width="3" height="15" fill="#222" />
              {/* Outer Ring */}
              <path d="M 85 195 C 85 165, 115 165, 115 195" fill="transparent" stroke="#2a2a2a" strokeWidth="3" />

              {/* Tires */}
              {/* Front Tires (Starts at 80, Ends at 130) */}
              <rect x="35" y="80" width="22" height="50" rx="4" fill={getTireColor(telemetry.tireTemp.fl, telemetry.tireWear.fl)} className="transition-colors duration-500" />
              <rect x="143" y="80" width="22" height="50" rx="4" fill={getTireColor(telemetry.tireTemp.fr, telemetry.tireWear.fr)} className="transition-colors duration-500" />
              {/* Rear Tires (Starts at 225, Ends at 285) */}
              <rect x="30" y="225" width="28" height="60" rx="4" fill={getTireColor(telemetry.tireTemp.rl, telemetry.tireWear.rl)} className="transition-colors duration-500" />
              <rect x="142" y="225" width="28" height="60" rx="4" fill={getTireColor(telemetry.tireTemp.rr, telemetry.tireWear.rr)} className="transition-colors duration-500" />

              {/* Tire Grooves / Tread lines */}
              <g stroke="#000" strokeWidth="1.5" strokeOpacity="0.4">
                <path d="M 40.5 80 L 40.5 130 M 46 80 L 46 130 M 51.5 80 L 51.5 130" />
                <path d="M 148.5 80 L 148.5 130 M 154 80 L 154 130 M 159.5 80 L 159.5 130" />
                <path d="M 37 225 L 37 285 M 44 225 L 44 285 M 51 225 L 51 285" />
                <path d="M 149 225 L 149 285 M 156 225 L 156 285 M 163 225 L 163 285" />
              </g>
            </svg>
          </div>

          <div className="absolute bottom-10 px-8 py-2.5 bg-[#ff003c] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(255,0,60,0.5)] rounded-sm animate-pulse z-20">
            Thermal Mesh Active
          </div>
        </div>

        {/* RIGHT COLUMN: MATRIX & BRAKES */}
        <div className="xl:col-span-3 flex flex-col gap-5">
          
          {/* TYRE DEGRADATION MATRIX */}
          <div className="bg-[#080808] border border-[#1a1a1a] p-5 rounded-xl flex flex-col">
            <span className="text-[9px] text-[#555] uppercase tracking-[0.2em] font-bold mb-5 flex items-center gap-2">
              <Wind className="w-3 h-3 text-[#555]" /> Tyre Degradation Matrix
            </span>
            
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="bg-[#050505] border border-[#1a1a1a] p-4 flex flex-col gap-1 items-center justify-center rounded-md">
                <span className="text-[8px] text-[#555] uppercase font-bold tracking-[0.1em]">Front Left</span>
                <span className="text-white text-[22px] font-black font-mono leading-none my-1 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">{Math.round(telemetry.tireWear.fl)}%</span>
                <span className="text-[8px] text-[#888] font-mono">{telemetry.tirePressure.fl.toFixed(1)} PSI</span>
              </div>
              <div className="bg-[#050505] border border-[#1a1a1a] p-4 flex flex-col gap-1 items-center justify-center rounded-md">
                <span className="text-[8px] text-[#555] uppercase font-bold tracking-[0.1em]">Front Right</span>
                <span className="text-white text-[22px] font-black font-mono leading-none my-1 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">{Math.round(telemetry.tireWear.fr)}%</span>
                <span className="text-[8px] text-[#888] font-mono">{telemetry.tirePressure.fr.toFixed(1)} PSI</span>
              </div>
              <div className="bg-[#050505] border border-[#1a1a1a] p-4 flex flex-col gap-1 items-center justify-center rounded-md">
                <span className="text-[8px] text-[#555] uppercase font-bold tracking-[0.1em]">Rear Left</span>
                <span className={`text-[22px] font-black font-mono leading-none my-1 ${telemetry.tireWear.rl > 40 ? 'text-[#ff003c] drop-shadow-[0_0_5px_rgba(255,0,60,0.5)]' : 'text-white'}`}>{Math.round(telemetry.tireWear.rl)}%</span>
                <span className="text-[8px] text-[#888] font-mono">{telemetry.tirePressure.rl.toFixed(1)} PSI</span>
              </div>
              <div className="bg-[#050505] border border-[#1a1a1a] p-4 flex flex-col gap-1 items-center justify-center rounded-md">
                <span className="text-[8px] text-[#555] uppercase font-bold tracking-[0.1em]">Rear Right</span>
                <span className={`text-[22px] font-black font-mono leading-none my-1 ${telemetry.tireWear.rr > 40 ? 'text-[#ff003c] drop-shadow-[0_0_5px_rgba(255,0,60,0.5)]' : 'text-white'}`}>{Math.round(telemetry.tireWear.rr)}%</span>
                <span className="text-[8px] text-[#888] font-mono">{telemetry.tirePressure.rr.toFixed(1)} PSI</span>
              </div>
            </div>
          </div>

          {/* CIRCULAR BRAKE WIDGET */}
          <div className="bg-[#080808] border border-[#1a1a1a] p-5 rounded-xl flex flex-col flex-1 relative overflow-hidden">
            <span className="text-[9px] text-[#555] uppercase tracking-[0.2em] font-bold mb-6 flex items-center gap-2">
              <Flame className="w-3 h-3 text-[#555]" /> Brakes (°C)
            </span>
            
            <div className="relative flex-1 flex flex-col justify-between z-10">
              
              {/* Top Row: Front Brakes */}
              <div className="flex justify-between px-2">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-[#888] font-black uppercase tracking-widest mb-1">FL</span>
                  <span className={`text-[14px] font-black font-mono leading-none ${getBrakeColorClass(telemetry.brakeTemp.fl)}`}>
                    {Math.round(telemetry.brakeTemp.fl)}°C
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-[#888] font-black uppercase tracking-widest mb-1">FR</span>
                  <span className={`text-[14px] font-black font-mono leading-none ${getBrakeColorClass(telemetry.brakeTemp.fr)}`}>
                    {Math.round(telemetry.brakeTemp.fr)}°C
                  </span>
                </div>
              </div>

              {/* Center Circular Widget */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-[180px] h-[180px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                  <defs>
                    <radialGradient id="discMetal" cx="50%" cy="50%" r="50%">
                      <stop offset="30%" stopColor="#222" />
                      <stop offset="60%" stopColor="#444" />
                      <stop offset="85%" stopColor="#333" />
                      <stop offset="100%" stopColor="#111" />
                    </radialGradient>
                    <radialGradient id="hubMetal" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#2a2a2a" />
                      <stop offset="70%" stopColor="#151515" />
                      <stop offset="100%" stopColor="#000" />
                    </radialGradient>
                    <linearGradient id="caliperPaint" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff003c" />
                      <stop offset="50%" stopColor="#cc0030" />
                      <stop offset="100%" stopColor="#880020" />
                    </linearGradient>
                    <linearGradient id="caliperCarbon" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#222" />
                      <stop offset="50%" stopColor="#111" />
                      <stop offset="100%" stopColor="#050505" />
                    </linearGradient>
                    <radialGradient id="heatGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="50%" stopColor="#ff5500" stopOpacity="0" />
                      <stop offset="85%" stopColor="#ff2200" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="dropShadow">
                      <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.6" />
                    </filter>
                  </defs>

                  {/* Outer Rim Boundary */}
                  <circle cx="50" cy="50" r="48" fill="transparent" stroke="#080808" strokeWidth="2" />
                  
                  {/* Dynamic Heat Glow Base (behind disc) */}
                  <circle cx="50" cy="50" r="46" fill="url(#heatGlow)" className="animate-pulse opacity-70" />

                  {/* The Main Brake Disc */}
                  <circle cx="50" cy="50" r="46" fill="url(#discMetal)" stroke="#111" strokeWidth="0.5" />
                  
                  {/* Faint concentric friction rings (machining marks) */}
                  {[42, 38, 34, 30, 26].map(r => (
                    <circle key={`ring-${r}`} cx="50" cy="50" r={r} fill="transparent" stroke="#1a1a1a" strokeWidth="0.3" opacity="0.6" />
                  ))}

                  {/* Cooling Holes & Slotted Grooves */}
                  {Array.from({length: 12}).map((_, i) => {
                    const angle = (i * 30) * Math.PI / 180;
                    // Holes
                    const h1x = 50 + 26 * Math.cos(angle);
                    const h1y = 50 + 26 * Math.sin(angle);
                    const h2x = 50 + 34 * Math.cos(angle + 0.15);
                    const h2y = 50 + 34 * Math.sin(angle + 0.15);
                    const h3x = 50 + 42 * Math.cos(angle + 0.3);
                    const h3y = 50 + 42 * Math.sin(angle + 0.3);
                    
                    // Slotted Grooves
                    const gStartX = 50 + 26 * Math.cos(angle - 0.2);
                    const gStartY = 50 + 26 * Math.sin(angle - 0.2);
                    const gEndX = 50 + 44 * Math.cos(angle - 0.5);
                    const gEndY = 50 + 44 * Math.sin(angle - 0.5);

                    return (
                      <g key={i} className="opacity-80">
                        {/* Slotted Curve */}
                        <path d={`M ${gStartX},${gStartY} Q ${50 + 35 * Math.cos(angle - 0.4)},${50 + 35 * Math.sin(angle - 0.4)} ${gEndX},${gEndY}`} fill="none" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" />
                        
                        {/* Drilled Holes */}
                        <circle cx={h1x} cy={h1y} r="1.2" fill="#000" />
                        <circle cx={h2x} cy={h2y} r="1.5" fill="#000" />
                        <circle cx={h3x} cy={h3y} r="1.5" fill="#000" />
                      </g>
                    );
                  })}

                  {/* REALISTIC CALIPER & HEAT ARC (Rotated to top right) */}
                  <g transform="rotate(135 50 50)">
                    {/* High Heat Edge Arc */}
                    <path d="M 8,50 A 42,42 0 0,1 50,8" fill="transparent" stroke="#ff003c" strokeWidth="2" strokeLinecap="round" filter="url(#glow)" className="opacity-90 animate-pulse" />

                    {/* Caliper Assembly */}
                    <g filter="url(#dropShadow)">
                    {/* Caliper Base Monoblock */}
                    <path 
                      d="M 16.6,10.2 A 52,52 0 0,0 16.6,89.8 C 20,93 25,85 28.1,76.0 A 34,34 0 0,1 28.1,24.0 C 25,15 20,7 16.6,10.2 Z" 
                      fill="url(#caliperPaint)" 
                      stroke="#ff1a40" 
                      strokeWidth="0.5" 
                    />

                    {/* Structural Bevels / Inner Machining */}
                    <path 
                      d="M 19,16 A 48,48 0 0,0 19,84 C 21,80 25,76 26.5,72 A 36,36 0 0,1 26.5,28 C 25,24 21,20 19,16 Z" 
                      fill="#b00020" 
                      opacity="0.8"
                    />

                    {/* Carbon Ceramic Bridge (crosses over the pads) */}
                    <path d="M 27,42 L 32,44 L 32,56 L 27,58 Z" fill="url(#caliperCarbon)" stroke="#111" strokeWidth="0.5" />
                    
                    {/* Pistons / Torx Bolts */}
                    <circle cx="16" cy="25" r="2.5" fill="url(#hubMetal)" stroke="#111" strokeWidth="0.5" />
                    <circle cx="14" cy="50" r="2.5" fill="url(#hubMetal)" stroke="#111" strokeWidth="0.5" />
                    <circle cx="16" cy="75" r="2.5" fill="url(#hubMetal)" stroke="#111" strokeWidth="0.5" />
                    
                    {/* Inner piston dots */}
                    <circle cx="16" cy="25" r="1" fill="#111" />
                    <circle cx="14" cy="50" r="1" fill="#111" />
                    <circle cx="16" cy="75" r="1" fill="#111" />

                    {/* Fluid Bleed Nipple */}
                    <path d="M 17,9 L 19,5 L 21,6 L 19,10 Z" fill="#666" stroke="#222" strokeWidth="0.5" />
                    <circle cx="20" cy="5.5" r="1.5" fill="#888" />

                    {/* Racing Accent Line & White Stripe */}
                    <path d="M 12.5,35 A 54,54 0 0,0 12.5,65" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
                    <path d="M 13.5,38 A 52,52 0 0,0 13.5,62" fill="none" stroke="#ff88a0" strokeWidth="0.5" strokeLinecap="round" opacity="0.7" />
                  </g>
                  </g>

                  {/* Center Hub */}
                  <circle cx="50" cy="50" r="18" fill="url(#hubMetal)" stroke="#1a1a1a" strokeWidth="1.5" />
                  <circle cx="50" cy="50" r="7" fill="#050505" stroke="#222" strokeWidth="1" />
                  <circle cx="50" cy="50" r="3" fill="#111" />

                  {/* Hub bolts / Wheel Studs */}
                  {Array.from({length: 5}).map((_, i) => {
                    const angle = (i * 72) * Math.PI / 180;
                    const bx = 50 + 12 * Math.cos(angle);
                    const by = 50 + 12 * Math.sin(angle);
                    return (
                      <g key={`bolt-${i}`}>
                        <circle cx={bx} cy={by} r="2" fill="#222" stroke="#000" strokeWidth="0.5" />
                        <circle cx={bx} cy={by} r="1" fill="#444" />
                      </g>
                    );
                  })}
                </svg>
                
                {/* Thin technical crosshairs */}
                <div className="absolute top-[10%] bottom-[10%] w-[1px] bg-gradient-to-b from-transparent via-[#ff003c]/20 to-transparent" />
                <div className="absolute left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#ff003c]/20 to-transparent" />
              </div>

              {/* Bottom Row: Rear Brakes */}
              <div className="flex justify-between px-2 mt-auto">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-[#888] font-black uppercase tracking-widest mb-1">RL</span>
                  <span className={`text-[14px] font-black font-mono leading-none ${getBrakeColorClass(telemetry.brakeTemp.rl)}`}>
                    {Math.round(telemetry.brakeTemp.rl)}°C
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-[#888] font-black uppercase tracking-widest mb-1">RR</span>
                  <span className={`text-[14px] font-black font-mono leading-none ${getBrakeColorClass(telemetry.brakeTemp.rr)}`}>
                    {Math.round(telemetry.brakeTemp.rr)}°C
                  </span>
                </div>
              </div>
              
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
