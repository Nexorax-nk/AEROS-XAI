"use client";

import React, { useEffect, useState } from "react";
import { useTelemetry } from "@/context/TelemetryContext";
import { CircularGauge } from "@/components/ui/circular-gauge";
import { LinearProgress } from "@/components/ui/linear-progress";

export default function DriverPage() {
  const { telemetry, agentResults } = useTelemetry();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  const getConfidence = () => Math.max(10, 100 - (telemetry.stress * 0.5 + telemetry.fatigue * 0.5));
  const getPanicProb = () => Math.min(100, (telemetry.stress * 0.8 + (100 - telemetry.hydration) * 0.4));

  return (
    <div className="p-8 max-w-[1800px] mx-auto w-full flex flex-col h-full font-mono bg-[#050505]">
      
      {/* HEADER */}
      <header className="mb-10 flex flex-col gap-4">
        <div className="flex items-center gap-4">
           <h1 className="text-4xl font-black text-white uppercase tracking-tighter">MISSION CONTROL</h1>
           <div className="px-3 py-1 border border-[#333] bg-[#0a0a0a] text-[10px] text-[#888] font-bold uppercase tracking-widest">
             Cognitive Twin Operating System / Telemetry Infrastructure
           </div>
        </div>
        
        {/* Driver Selection Tabs (Aesthetic) */}
        <div className="flex gap-2">
          <div className="border border-[#ff003c] bg-[#1a050a] p-3 w-48">
            <div className="text-xl font-black text-white">HAM</div>
            <div className="text-[9px] text-[#ff003c] font-bold uppercase tracking-widest mt-1">Hamilton</div>
            <div className="text-[9px] text-[#888] mt-1">DEFENSIVE · UNSTABLE</div>
          </div>
          <div className="border border-[#1a1a1a] bg-[#0a0a0a] p-3 w-48 opacity-50">
            <div className="text-xl font-black text-white">VER</div>
            <div className="text-[9px] text-[#555] font-bold uppercase tracking-widest mt-1">Verstappen</div>
            <div className="text-[9px] text-[#555] mt-1">OFFENSIVE · STABLE</div>
          </div>
        </div>
      </header>

      {/* TOP ROW: MASSIVE CIRCULAR GAUGES */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <CircularGauge 
          value={telemetry.stress} 
          max={100} 
          label="Stress" 
          color={telemetry.stress > 80 ? '#ff003c' : '#fbbf24'} 
        />
        <CircularGauge 
          value={getConfidence()} 
          max={100} 
          label="Confidence" 
          color="#00f0ff" 
        />
        <CircularGauge 
          value={telemetry.fatigue} 
          max={100} 
          label="Fatigue" 
          color="#ff003c" 
        />
        <CircularGauge 
          value={getPanicProb()} 
          max={100} 
          label="Panic Prob" 
          color="#fbbf24" 
        />
      </div>

      {/* MIDDLE ROW: LINEAR PROGRESS BARS */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <LinearProgress 
          value={(telemetry.stress + telemetry.fatigue) / 2} 
          max={100} 
          label="Cognitive Load" 
          color="#ff003c" 
        />
        <LinearProgress 
          value={100 - (telemetry.fatigue * 0.6)} 
          max={100} 
          label="Attention" 
          color="#00f0ff" 
        />
        <LinearProgress 
          value={getConfidence()} 
          max={100} 
          label="Strategic" 
          color="#00f0ff" 
        />
        <LinearProgress 
          value={telemetry.stress * 0.15} 
          max={10} 
          label="Emotional Drift" 
          color="#fbbf24" 
        />
      </div>

      {/* BOTTOM ROW: ECG & PRESCRIPTIVE ENGINE */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1">
        
        {/* ECG Heartbeat Display */}
        <div className="xl:col-span-2 bg-[#0a0a0a] border border-[#1a1a1a] p-6 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <span className="text-xs text-[#888] font-bold uppercase tracking-widest">Real-time Biometrics</span>
            <span className={`text-2xl font-black ${telemetry.heartRate > 160 ? 'text-[#ff003c] animate-pulse' : 'text-white'}`}>
              {telemetry.heartRate} <span className="text-xs text-[#555] font-bold ml-1">BPM</span>
            </span>
          </div>

          <div className="flex-1 w-full relative flex items-center justify-center">
             {/* Realistic Medical ECG Wave */}
             {/* A repeating SVG pattern with a sharp QRS complex */}
             <div className="absolute inset-0 overflow-hidden">
               <svg className="w-full h-full" preserveAspectRatio="none">
                 <defs>
                   <pattern id="ecgPattern" x="0" y="0" width="400" height="100%" patternUnits="userSpaceOnUse">
                      {/* P wave, QRS complex, T wave */}
                      <path 
                        d="M0,70 L50,70 L60,55 L70,70 L80,70 L90,110 L100,10 L110,80 L120,70 L140,70 L150,55 L170,70 L400,70" 
                        fill="none" 
                        stroke="#ff003c" 
                        strokeWidth="3" 
                        strokeLinejoin="miter" 
                        strokeLinecap="square"
                        style={{ filter: 'drop-shadow(0 0 8px rgba(255,0,60,0.8))' }}
                      />
                   </pattern>
                 </defs>
                 <rect x="0" y="0" width="200%" height="100%" fill="url(#ecgPattern)">
                   <animate attributeName="x" from="0" to="-400" dur={`${60 / telemetry.heartRate}s`} repeatCount="indefinite" />
                 </rect>
               </svg>
             </div>
             
             {/* Fade gradient overlays to make the line look like a sweeping dot */}
             <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
          </div>
        </div>

        {/* Prescriptive Engine */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 bg-[#00f0ff] rounded-full" />
            <span className="text-xs text-[#888] font-bold uppercase tracking-widest">Prescriptive Engine</span>
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-4">
             <div className="text-4xl font-black text-white leading-none">
               -{agentResults.driverLoss.toFixed(2)}<span className="text-sm text-[#555] ml-1">SEC/LAP</span>
             </div>
             <p className="text-sm text-[#888] leading-relaxed">
               Driver cognitive load is currently resulting in increased braking variance.
               Engine mapping adjustments and brake migration shifts are recommended.
             </p>
             <div className="mt-4 bg-[#111] border border-[#333] p-4 text-[#00f0ff] font-bold text-xs uppercase tracking-widest">
               {agentResults.primaryDriverConcern}
             </div>
          </div>
        </div>

      </div>

    </div>
  );
}
