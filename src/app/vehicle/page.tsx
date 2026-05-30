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
          <div className="bg-[#080808] border border-[#1a1a1a] p-3 rounded-xl flex flex-col shrink-0">
            <span className="text-[9px] text-[#555] uppercase tracking-[0.2em] font-bold mb-3 flex items-center gap-2">
              <Gauge className="w-3 h-3 text-[#555]" /> Powertrain Feed
            </span>
            <div className="flex flex-col gap-0">
              {/* RPM */}
              <div className="flex justify-between items-center py-2 border-b border-[#111]">
                <span className="text-[9px] text-[#888] font-bold uppercase tracking-widest">RPM</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full bg-[#ff003c] rounded-full transition-all" style={{ width: `${Math.min((telemetry.rpm / 18000) * 100, 100)}%` }} />
                  </div>
                  <span className="text-[12px] text-white font-black font-mono leading-none w-12 text-right">{Math.round(telemetry.rpm)}</span>
                </div>
              </div>
              {/* Speed */}
              <div className="flex justify-between items-center py-2 border-b border-[#111]">
                <span className="text-[9px] text-[#888] font-bold uppercase tracking-widest">Speed</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full bg-[#888] rounded-full transition-all" style={{ width: `${Math.min((telemetry.speed / 350) * 100, 100)}%` }} />
                  </div>
                  <span className="text-[12px] text-white font-black font-mono leading-none w-12 text-right">{Math.round(telemetry.speed)}<span className="text-[8px] text-[#555] ml-0.5">km/h</span></span>
                </div>
              </div>
              {/* Gear */}
              <div className="flex justify-between items-center py-2 border-b border-[#111]">
                <span className="text-[9px] text-[#888] font-bold uppercase tracking-widest">Gear</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5,6,7,8].map(g => (
                      <div key={g} className={`w-2 h-2 rounded-sm ${g <= telemetry.gear ? 'bg-[#00f0ff]' : 'bg-[#1a1a1a]'}`} />
                    ))}
                  </div>
                  <span className="text-[12px] text-[#00f0ff] font-black font-mono w-12 text-right">{telemetry.gear}</span>
                </div>
              </div>
              {/* Engine Temp */}
              <div className="flex justify-between items-center py-2 border-b border-[#111]">
                <span className="text-[9px] text-[#888] font-bold uppercase tracking-widest">Engine Temp</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${telemetry.engineTemp > 108 ? 'bg-[#ff003c]' : 'bg-[#fbbf24]'}`} style={{ width: `${Math.min(((telemetry.engineTemp - 80) / 50) * 100, 100)}%` }} />
                  </div>
                  <span className={`text-[12px] font-black font-mono leading-none w-12 text-right ${telemetry.engineTemp > 108 ? 'text-[#ff003c]' : 'text-white'}`}>
                    {telemetry.engineTemp.toFixed(0)}<span className="text-[8px] text-[#555]">°C</span>
                  </span>
                </div>
              </div>
              {/* Battery ERS */}
              <div className="flex justify-between items-center py-2">
                <span className="text-[9px] text-[#888] font-bold uppercase tracking-widest">Battery ERS</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full bg-[#00ff88] rounded-full transition-all" style={{ width: `${telemetry.batteryHealth}%` }} />
                  </div>
                  <span className="text-[12px] text-[#00ff88] font-black font-mono leading-none w-12 text-right">{telemetry.batteryHealth.toFixed(1)}<span className="text-[8px] text-[#555]">%</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* MECHANICAL INTEGRITY */}
          <div className="bg-[#080808] border border-[#1a1a1a] p-3 rounded-xl shrink-0">
            <span className="text-[9px] text-[#555] uppercase tracking-[0.2em] font-bold mb-3 flex items-center gap-2">
              <Activity className="w-3 h-3 text-[#555]" /> Mechanical Integrity
            </span>
            <div className="flex flex-col gap-0">
              <div className="flex justify-between items-center py-2 border-b border-[#111]">
                <span className="text-[9px] text-[#888] font-bold uppercase tracking-widest">Gearbox Health</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full bg-[#00ff88] rounded-full" style={{ width: `${(94.2 - (telemetry.rpm / 50000)).toFixed(0)}%` }} />
                  </div>
                  <span className="text-[12px] text-[#00ff88] font-black font-mono w-12 text-right">{(94.2 - (telemetry.rpm / 50000)).toFixed(1)}<span className="text-[8px] text-[#555]">%</span></span>
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#111]">
                <span className="text-[9px] text-[#888] font-bold uppercase tracking-widest">Suspension</span>
                <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${telemetry.speed > 250 ? 'bg-[#ff003c]/10 border border-[#ff003c]/20 text-[#ff003c]' : 'bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-[#00f0ff]'}`}>
                  {telemetry.speed > 250 ? 'HIGH 4G' : telemetry.speed > 100 ? 'MED 2G' : 'LOW 1G'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[9px] text-[#888] font-bold uppercase tracking-widest">Fuel Flow</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full bg-[#888] rounded-full" style={{ width: `${Math.min(((telemetry.rpm / 12000) * 98.5) / 98.5 * 100, 100)}%` }} />
                  </div>
                  <span className="text-[12px] text-white font-black font-mono w-12 text-right">{((telemetry.rpm / 12000) * 98.5).toFixed(0)}<span className="text-[8px] text-[#555]">kg/h</span></span>
                </div>
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
                <svg viewBox="0 0 100 100" className="w-[160px] h-[160px] opacity-100 drop-shadow-[0_0_15px_rgba(0,0,0,1)]">
                  <defs>
                    <radialGradient id="discMetal" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                      <stop offset="0%" stopColor="#444" />
                      <stop offset="70%" stopColor="#1a1a1a" />
                      <stop offset="100%" stopColor="#0a0a0a" />
                    </radialGradient>
                    <radialGradient id="hubMetal" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#333" />
                      <stop offset="80%" stopColor="#111" />
                      <stop offset="100%" stopColor="#000" />
                    </radialGradient>
                    <linearGradient id="heatGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff003c" stopOpacity="0.9"/>
                      <stop offset="100%" stopColor="#ff5500" stopOpacity="0.3"/>
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Outer track/rim */}
                  <circle cx="50" cy="50" r="46" fill="transparent" stroke="#0a0a0a" strokeWidth="4" />
                  
                  {/* The Brake Disc itself */}
                  <circle cx="50" cy="50" r="40" fill="url(#discMetal)" stroke="#050505" strokeWidth="1" />
                  
                  {/* Faint concentric friction rings */}
                  <circle cx="50" cy="50" r="35" fill="transparent" stroke="#222" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="28" fill="transparent" stroke="#222" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="22" fill="transparent" stroke="#222" strokeWidth="0.5" />

                  {/* Cooling Holes arranged in a spiral pattern */}
                  {Array.from({length: 12}).map((_, i) => {
                    const angle = (i * 30) * Math.PI / 180;
                    const innerX = 50 + 24 * Math.cos(angle);
                    const innerY = 50 + 24 * Math.sin(angle);
                    const outerX = 50 + 34 * Math.cos(angle + 0.2);
                    const outerY = 50 + 34 * Math.sin(angle + 0.2);
                    return (
                      <g key={i}>
                        <circle cx={innerX} cy={innerY} r="1.5" fill="#050505" />
                        <circle cx={outerX} cy={outerY} r="2" fill="#050505" />
                      </g>
                    );
                  })}

                  {/* Dynamic Caliper / Heat Arc based on average temp (assuming high heat) */}
                  <path d="M 10,50 A 40,40 0 0,1 50,10" fill="transparent" stroke="url(#heatGlow)" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" className="opacity-80 animate-pulse" />
                  <path d="M 14,67 A 40,40 0 0,0 67,86" fill="transparent" stroke="#ff003c" strokeWidth="3" strokeLinecap="round" className="opacity-40" />

                  {/* Center Hub */}
                  <circle cx="50" cy="50" r="16" fill="url(#hubMetal)" stroke="#1a1a1a" strokeWidth="1" />
                  <circle cx="50" cy="50" r="6" fill="#050505" stroke="#222" strokeWidth="1.5" />
                  <circle cx="50" cy="50" r="2" fill="#111" />

                  {/* Hub bolts */}
                  {Array.from({length: 5}).map((_, i) => {
                    const angle = (i * 72) * Math.PI / 180;
                    const x = 50 + 11 * Math.cos(angle);
                    const y = 50 + 11 * Math.sin(angle);
                    return <circle key={`bolt-${i}`} cx={x} cy={y} r="1.5" fill="#555" />;
                  })}
                </svg>
                
                {/* Thin dividing lines */}
                <div className="absolute top-[20%] bottom-[20%] w-[1px] bg-gradient-to-b from-transparent via-[#222] to-transparent" />
                <div className="absolute left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-[#222] to-transparent" />
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
