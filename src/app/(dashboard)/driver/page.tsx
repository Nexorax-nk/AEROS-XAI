"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTelemetry } from "@/context/TelemetryContext";

export default function DriverPage() {
  const { telemetry } = useTelemetry();
  const [isMounted, setIsMounted] = useState(false);

  // Rolling history buffers
  const [hrHistory, setHrHistory] = useState<number[]>(Array(80).fill(120));
  const [gHistory, setGHistory] = useState<{ x: number; y: number }[]>(Array(40).fill({ x: 0, y: 0 }));
  const [stressHistory, setStressHistory] = useState<number[]>(Array(60).fill(50));
  const [fatigueHistory, setFatigueHistory] = useState<number[]>(Array(60).fill(30));

  // ECG phase for realistic waveform
  const phaseRef = useRef(0);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isMounted) return;

    // Advance ECG phase (simulate realistic PQRST)
    phaseRef.current = (phaseRef.current + 0.08) % 1;
    const p = phaseRef.current;

    let ecgVal = 0;
    if (p > 0.0 && p < 0.08) ecgVal = Math.sin((p / 0.08) * Math.PI) * 8; // P wave
    else if (p >= 0.08 && p < 0.14) ecgVal = -Math.sin(((p - 0.08) / 0.06) * Math.PI) * 4; // Q
    else if (p >= 0.14 && p < 0.20) ecgVal = Math.sin(((p - 0.14) / 0.06) * Math.PI) * 80; // R spike
    else if (p >= 0.20 && p < 0.26) ecgVal = -Math.sin(((p - 0.20) / 0.06) * Math.PI) * 12; // S
    else if (p >= 0.30 && p < 0.45) ecgVal = Math.sin(((p - 0.30) / 0.15) * Math.PI) * 15; // T wave
    else ecgVal = 0;

    ecgVal += (Math.random() - 0.5) * 2; // tiny noise

    setHrHistory(prev => [...prev.slice(1), ecgVal]);
    setGHistory(prev => [...prev.slice(1), { x: telemetry.gForceLateral, y: telemetry.gForceLongitudinal }]);
    setStressHistory(prev => [...prev.slice(1), telemetry.stress + (Math.random() - 0.5) * 3]);
    setFatigueHistory(prev => [...prev.slice(1), telemetry.fatigue + (Math.random() - 0.5) * 3]);
  }, [telemetry, isMounted]);

  if (!isMounted) return null;

  const breathRate = Math.round(12 + ((telemetry.heartRate - 80) / 80) * 8 + (telemetry.stress / 100) * 6);

  // SVG polyline helpers
  const toPolyline = (data: number[], min: number, max: number, w: number, h: number) => {
    const range = max - min || 1;
    return data.map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${Math.max(0, Math.min(h, y))}`;
    }).join(" ");
  };

  const toPath = (data: number[], min: number, max: number, w: number, h: number) => {
    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const range = max - min || 1;
      const y = h - ((v - min) / range) * h;
      return `${x},${Math.max(0, Math.min(h, y))}`;
    });
    return `M ${pts.join(" L ")}`;
  };

  const toAreaPath = (data: number[], min: number, max: number, w: number, h: number) => {
    const line = toPath(data, min, max, w, h);
    return `${line} L ${w},${h} L 0,${h} Z`;
  };

  // Gauge color for heart rate
  const hrStatus = telemetry.heartRate > 175 ? { text: "HIGH", bg: "#ff003c", border: "#ff003c" }
    : telemetry.heartRate > 140 ? { text: "ELEVATED", bg: "#ff7700", border: "#ff7700" }
      : { text: "NORMAL", bg: "#00cc66", border: "#00cc66" };

  const brStatus = breathRate > 24 ? { text: "HIGH", color: "#ff003c" }
    : breathRate > 18 ? { text: "ELEVATED", color: "#00f0ff" }
      : { text: "NORMAL", color: "#00cc66" };

  const spo2Status = telemetry.spo2 < 95 ? "text-[#ff003c]" : "text-[#00f0ff]";
  const spo2Label = telemetry.spo2 < 95 ? "Low" : "Normal";
  const spo2Stroke = telemetry.spo2 < 95 ? "#ff003c" : "#00f0ff";

  const bodyTempStatus = telemetry.bodyTemp > 38.5 ? { text: "CRITICAL", color: "#ff003c" }
    : telemetry.bodyTemp > 37.5 ? { text: "ELEVATED", color: "#ff9f0a" }
      : { text: "NORMAL", color: "#00cc66" };

  // Thermometer fill percent (34°C = 0%, 42°C = 100%)
  const tempFill = Math.max(0, Math.min(100, ((telemetry.bodyTemp - 34) / 8) * 100));

  // Dynamic G-Force Calculations
  const currentGMag = Math.sqrt(telemetry.gForceLateral ** 2 + telemetry.gForceLongitudinal ** 2);
  const getGColor = (mag: number) => {
    if (mag > 2.8) return "#ff003c"; // Red for massive loads
    if (mag > 1.8) return "#ff9f0a"; // Orange for high loads
    return "#00f0ff"; // Cyan for normal operation
  };
  const currentGColor = getGColor(currentGMag);

  return (
    <div className="h-full w-full bg-[#000] p-4 flex flex-col gap-3 overflow-hidden">

      {/* ═══════════════════════════════════ GRID 3 COLUMNS ═══════════════════════════════════ */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">

        {/* ──────────── LEFT: Cardio + SpO2 + Temp ──────────── */}
        <div className="col-span-4 flex flex-col gap-4 min-h-0">

          {/* CARDIOVASCULAR & RESPIRATORY */}
          <div className="shrink-0 bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg p-4 flex flex-col" style={{ height: '58%' }}>
            <p className="text-[9px] text-[#555] font-bold uppercase tracking-[0.2em] mb-3">Cardiovascular &amp; Respiratory</p>

            {/* Values Row */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-[9px] text-[#666] font-bold uppercase tracking-widest mb-1">Heart Rate</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white tracking-tight leading-none">{Math.round(telemetry.heartRate)}</span>
                  <span className="text-sm font-bold" style={{ color: hrStatus.border }}>BPM</span>
                </div>
                <div className="mt-2 text-[9px] font-black px-2 py-0.5 rounded-sm w-max uppercase tracking-widest"
                  style={{ background: `${hrStatus.bg}20`, border: `1px solid ${hrStatus.border}40`, color: hrStatus.bg }}>
                  {hrStatus.text}
                </div>
              </div>

              <div className="text-right">
                <p className="text-[9px] text-[#666] font-bold uppercase tracking-widest mb-1">Respiratory Rate</p>
                <div className="flex items-baseline justify-end gap-2">
                  <span className="text-4xl font-black tracking-tight leading-none" style={{ color: brStatus.color }}>{breathRate}</span>
                  <span className="text-xs font-bold" style={{ color: brStatus.color }}>RPM</span>
                </div>
                <div className="mt-2 text-[9px] font-black px-2 py-0.5 rounded-sm w-max uppercase tracking-widest ml-auto"
                  style={{ background: `${brStatus.color}20`, border: `1px solid ${brStatus.color}40`, color: brStatus.color }}>
                  {brStatus.text}
                </div>
              </div>
            </div>

            {/* ECG Graph */}
            <div className="flex-1 min-h-0 relative border border-[#1a1a1a] rounded overflow-hidden bg-[#030303]">
              {/* Y labels */}
              <div className="absolute left-1 top-0 bottom-4 flex flex-col justify-between text-[8px] text-[#333] z-10 pointer-events-none">
                {['220', '180', '140', '100', '60'].map(l => <span key={l}>{l}</span>)}
              </div>

              {/* Grid */}
              <div className="absolute inset-0 left-6 bottom-4" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '25% 25%'
              }} />

              {/* ECG SVG */}
              <svg className="absolute inset-0 left-6 bottom-4 w-[calc(100%-24px)] h-[calc(100%-16px)]"
                viewBox="0 0 320 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="ecgFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff003c" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ff003c" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={toAreaPath(hrHistory, -30, 90, 320, 100)} fill="url(#ecgFill)" />
                <polyline
                  points={toPolyline(hrHistory, -30, 90, 320, 100)}
                  fill="none" stroke="#ff003c" strokeWidth="1.5"
                  strokeLinejoin="round" strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 4px #ff003c)' }}
                />
              </svg>

              {/* X axis labels */}
              <div className="absolute bottom-0.5 left-6 right-0 flex justify-between text-[8px] text-[#333]">
                {['-60s', '-45s', '-30s', '-15s', 'NOW'].map(l => <span key={l}>{l}</span>)}
              </div>
            </div>
          </div>

          {/* SpO2 + Body Temp side by side */}
          <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">

            {/* SpO2 */}
            <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg p-5 flex flex-col items-center justify-between relative overflow-hidden">
              <p className="text-[10px] text-[#555] font-bold uppercase tracking-widest w-full text-left">Oxygen Saturation (SpO₂)</p>

              {/* Circular gauge */}
              <div className="relative w-32 h-32 flex items-center justify-center my-auto">
                {/* Background glow diamond */}
                <div className="absolute inset-0 m-auto w-20 h-20 bg-[#00f0ff] opacity-10 blur-xl rounded-full rotate-45 pointer-events-none" />

                <svg viewBox="0 0 100 100" className="absolute w-full h-full -rotate-[220deg]">
                  {/* Track */}
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#1a1a1a" strokeWidth="6"
                    strokeDasharray="209 289" strokeLinecap="round" />
                  {/* Fill */}
                  <circle cx="50" cy="50" r="46" fill="none" stroke={spo2Stroke} strokeWidth="6"
                    strokeDasharray={`${(telemetry.spo2 / 100) * 209} 289`} strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 8px ${spo2Stroke})`, transition: 'stroke-dasharray 1s' }} />
                </svg>
                <div className="flex flex-col items-center z-10">
                  <span className={`text-4xl font-black text-white leading-none tracking-tight`}>{telemetry.spo2.toFixed(1)}</span>
                  <span className={`text-[10px] font-bold mt-1 ${spo2Status}`}>%</span>
                </div>
                <span className="absolute bottom-1 left-2 text-[8px] text-[#444] font-mono">80%</span>
                <span className="absolute bottom-1 right-2 text-[8px] text-[#444] font-mono">100%</span>
              </div>

              <span className={`text-[12px] font-black uppercase tracking-[0.2em] ${spo2Status}`}>{spo2Label}</span>
            </div>

            {/* Body Temp */}
            <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg p-5 flex flex-col relative overflow-hidden">
              <p className="text-[10px] text-[#555] font-bold uppercase tracking-widest mb-6 text-left">Body Temp</p>

              <div className="flex flex-1 items-center justify-center gap-4 pr-2">
                {/* Thermometer */}
                <div className="relative flex items-center justify-end flex-shrink-0 h-40 w-20">
                  {/* Degree labels */}
                  <div className="absolute left-0 top-3 bottom-8 flex flex-col justify-between text-[10px] text-[#555] font-mono">
                    {['42°', '40°', '38°', '36°', '34°'].map(t => <span key={t}>{t}</span>)}
                  </div>

                  {/* SVG Thermometer */}
                  <svg viewBox="0 0 40 120" className="absolute right-0 h-full w-14">
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor="#ff003c" />
                        <stop offset="100%" stopColor="#ff9f0a" />
                      </linearGradient>
                      <filter id="bulbGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="glow" />
                        <feMerge>
                          <feMergeNode in="glow" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Outer Glass Shell */}
                    <path d="M 13 89.1 L 13 15 A 7 7 0 0 1 27 15 L 27 89.1 A 13 13 0 1 1 13 89.1 Z"
                      fill="#050505" stroke="#1e1e1e" strokeWidth="2" />

                    {/* Inner Hollow Track */}
                    <path d="M 15 90.2 L 15 15 A 5 5 0 0 1 25 15 L 25 90.2 A 11 11 0 1 1 15 90.2 Z"
                      fill="#000000" />

                    {/* Glow behind liquid */}
                    <circle cx="20" cy="100" r="10" fill="#ff003c" filter="url(#bulbGlow)" opacity="0.6" />

                    {/* Seamless Liquid Fill */}
                    <g>
                      {/* Bulb Base */}
                      <circle cx="20" cy="100" r="8" fill="#ff003c" />
                      {/* Tube extends down exactly to cy=100 (center of bulb) to perfectly hide any seams */}
                      <rect x="16" y={100 - (tempFill / 100) * 84} width="8" height={(tempFill / 100) * 84}
                        fill="url(#tempGradient)" rx="4" style={{ transition: 'y 1s ease-in-out, height 1s ease-in-out' }} />
                    </g>

                    {/* Glass Reflection Highlight (Left edge) */}
                    <path d="M 16 18 L 16 85" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 15.5 94 A 6 6 0 0 0 16 106" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Temp value */}
                <div className="flex flex-col items-start justify-center">
                  <span className="text-4xl font-black text-white leading-tight tracking-tight">{telemetry.bodyTemp.toFixed(1)}</span>
                  <span className="text-lg font-bold" style={{ color: bodyTempStatus.color }}>°C</span>
                  <div className="mt-3 text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest"
                    style={{ background: `${bodyTempStatus.color}15`, border: `1px solid ${bodyTempStatus.color}50`, color: bodyTempStatus.color }}>
                    {bodyTempStatus.text}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ──────────── CENTER: G-Circle ──────────── */}
        <div className="col-span-4 min-h-0">
          <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg p-4 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 shrink-0">
              <p className="text-[9px] text-[#555] font-bold uppercase tracking-[0.2em]">G-Force Circle</p>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${currentGMag > 2.8 ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                  currentGMag > 1.8 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                    'bg-[#1a1a1a] text-[#555] border border-[#222]'
                }`}>{currentGMag.toFixed(2)}G</span>
            </div>

            {/* G Circle SVG */}
            {/* G Circle SVG */}
            <div className="flex-1 min-h-0 flex items-center justify-center" style={{ padding: '6px' }}>
              <svg
                viewBox="-9 -9 18 18"
                style={{
                  width: 'min(100%, 500px)',
                  height: 'min(100%, 500px)',
                  aspectRatio: '1',
                  display: 'block',
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              >
                <defs>
                  <clipPath id="gcClip">
                    <circle cx="0" cy="0" r="6.5" />
                  </clipPath>
                  
                  {/* Subtle deep cyan radar glow for the background */}
                  <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.08" />
                    <stop offset="40%" stopColor="#0044ff" stopOpacity="0.03" />
                    <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
                  </radialGradient>

                  {/* Gradient for the axes */}
                  <linearGradient id="axisGradH" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0" />
                    <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="axisGradV" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0" />
                    <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* ── Base background glow ── */}
                <circle cx="0" cy="0" r="6.5" fill="url(#radarGlow)" />

                {/* ── High-Tech Grid lines ── */}
                <g clipPath="url(#gcClip)">
                  {/* Main Axes with glowing gradient */}
                  <line x1="-6.5" y1="0" x2="6.5" y2="0" stroke="url(#axisGradH)" strokeWidth="0.05" />
                  <line x1="0" y1="-6.5" x2="0" y2="6.5" stroke="url(#axisGradV)" strokeWidth="0.05" />
                  
                  {/* 45° diagonals - darker tech lines */}
                  <line x1="-6.5" y1="-6.5" x2="6.5" y2="6.5" stroke="#1f2937" strokeWidth="0.04" strokeDasharray="0.15 0.15" />
                  <line x1="6.5" y1="-6.5" x2="-6.5" y2="6.5" stroke="#1f2937" strokeWidth="0.04" strokeDasharray="0.15 0.15" />
                </g>

                {/* ── Vibrant Concentric G rings ── */}
                {/* 2G — Cyan */}
                <circle cx="0" cy="0" r="2.167" fill="none" stroke="#00f0ff" strokeWidth="0.04" strokeDasharray="0.1 0.2" opacity="0.4" />
                {/* 4G — Violet/Magenta */}
                <circle cx="0" cy="0" r="4.333" fill="none" stroke="#8b5cf6" strokeWidth="0.05" strokeDasharray="0.15 0.25" opacity="0.5" />
                
                {/* ── Complex Outer Ring Assembly (6G Boundary) ── */}
                {/* 1. Deep blue thick base track */}
                <circle cx="0" cy="0" r="6.5" fill="none" stroke="#0f172a" strokeWidth="0.25" />
                {/* 2. Red warning track inner edge */}
                <circle cx="0" cy="0" r="6.35" fill="none" stroke="#ef4444" strokeWidth="0.02" opacity="0.6" />
                {/* 3. Cyan segmented glowing ring */}
                <circle cx="0" cy="0" r="6.5" fill="none" stroke="#00f0ff" strokeWidth="0.08" strokeDasharray="0.85 0.15" opacity="0.8" />
                {/* 4. Fine outer containment line */}
                <circle cx="0" cy="0" r="6.65" fill="none" stroke="#00f0ff" strokeWidth="0.02" opacity="0.5" />

                {/* ── Sci-Fi Tick marks around the boundary (72 total, every 5°) ── */}
                {Array.from({ length: 72 }, (_, i) => {
                  const angle = i * 5 * Math.PI / 180;
                  const isMajor = i % 18 === 0; // 90°
                  const isMed   = i % 9 === 0;  // 45°
                  const isMinorMajor = i % 3 === 0; // 15°
                  
                  const r1 = 6.5;
                  const r2 = isMajor ? 6.95 : isMed ? 6.85 : isMinorMajor ? 6.75 : 6.65;
                  const col = isMajor ? '#00f0ff' : isMed ? '#38bdf8' : isMinorMajor ? '#334155' : '#1e293b';
                  const w   = isMajor ? 0.08 : isMed ? 0.06 : 0.03;
                  return (
                    <line
                      key={i}
                      x1={r1 * Math.cos(angle)} y1={r1 * Math.sin(angle)}
                      x2={r2 * Math.cos(angle)} y2={r2 * Math.sin(angle)}
                      stroke={col} strokeWidth={w}
                    />
                  );
                })}

                {/* ── G-scale labels: 45° lower-right ── */}
                {/* Pill backgrounds for labels */}
                <rect x="1.45" y="1.35" width="0.75" height="0.4" rx="0.2" fill="#00f0ff" opacity="0.1" />
                <rect x="3.1" y="3.0" width="0.75" height="0.4" rx="0.2" fill="#8b5cf6" opacity="0.15" />
                <rect x="4.65" y="4.55" width="0.75" height="0.4" rx="0.2" fill="#ef4444" opacity="0.15" />
                
                <text x="1.82" y="1.63" fill="#00f0ff" fontSize="0.28" fontFamily="monospace" fontWeight="800" textAnchor="middle">2G</text>
                <text x="3.47" y="3.28" fill="#a78bfa" fontSize="0.28" fontFamily="monospace" fontWeight="800" textAnchor="middle">4G</text>
                <text x="5.02" y="4.83" fill="#f87171" fontSize="0.28" fontFamily="monospace" fontWeight="800" textAnchor="middle">6G</text>

                {/* ── Direction labels ── */}
                {/* Add subtle glow text under the main text for a neon effect */}
                <text x="0"     y="-7.45" textAnchor="middle" fill="#00f0ff" fontSize="0.45" fontFamily="monospace" fontWeight="900" letterSpacing="0.08" opacity="0.3" filter="blur(0.15px)">ACCEL</text>
                <text x="0"     y="-7.45" textAnchor="middle" fill="#ffffff" fontSize="0.45" fontFamily="monospace" fontWeight="900" letterSpacing="0.08">ACCEL</text>
                
                <text x="0"     y="8.1"   textAnchor="middle" fill="#00f0ff" fontSize="0.45" fontFamily="monospace" fontWeight="900" letterSpacing="0.08" opacity="0.3" filter="blur(0.15px)">BRAKE</text>
                <text x="0"     y="8.1"   textAnchor="middle" fill="#ffffff" fontSize="0.45" fontFamily="monospace" fontWeight="900" letterSpacing="0.08">BRAKE</text>
                
                <text x="-7.1"  y="0.15"  textAnchor="end"    fill="#00f0ff" fontSize="0.45" fontFamily="monospace" fontWeight="900" letterSpacing="0.08" opacity="0.3" filter="blur(0.15px)">LEFT</text>
                <text x="-7.1"  y="0.15"  textAnchor="end"    fill="#ffffff" fontSize="0.45" fontFamily="monospace" fontWeight="900" letterSpacing="0.08">LEFT</text>
                
                <text x="7.1"   y="0.15"  textAnchor="start"  fill="#00f0ff" fontSize="0.45" fontFamily="monospace" fontWeight="900" letterSpacing="0.08" opacity="0.3" filter="blur(0.15px)">RIGHT</text>
                <text x="7.1"   y="0.15"  textAnchor="start"  fill="#ffffff" fontSize="0.45" fontFamily="monospace" fontWeight="900" letterSpacing="0.08">RIGHT</text>

                {/* ── DATA LAYER (clipped inside circle) ── */}
                <g clipPath="url(#gcClip)">
                  {/* Fading comet dots on top of the trail */}
                  {gHistory.map((pt, i) => {
                    const n = gHistory.length;
                    if (n < 2) return null;
                    const ratio = i / (n - 1);
                    if (ratio < 0.05 || (pt.x === 0 && pt.y === 0)) return null;
                    const scale = 6.5 / 6;
                    const x = Math.max(-6.4, Math.min(6.4, pt.x * scale));
                    const y = Math.max(-6.4, Math.min(6.4, -pt.y * scale));
                    const m = Math.sqrt(pt.x ** 2 + pt.y ** 2);
                    // Match theme colors: Normal (#00f0ff), Warning (#f59e0b), Danger (#ff003c)
                    const col = m > 5 ? '#ff003c' : m > 4 ? '#f59e0b' : '#00f0ff';
                    return (
                      <circle
                        key={i}
                        cx={x} cy={y}
                        r={0.03 + Math.pow(ratio, 2) * 0.12}
                        fill={col}
                        opacity={Math.pow(ratio, 1.4) * 0.8}
                      />
                    );
                  })}

                  {/* ── Live position targeting reticle ── */}
                  {(() => {
                    const scale = 6.5 / 6;
                    const lx = Math.max(-6.4, Math.min(6.4, telemetry.gForceLateral * scale));
                    const ly = Math.max(-6.4, Math.min(6.4, -telemetry.gForceLongitudinal * scale));
                    // Match theme colors
                    const lc = currentGMag > 5 ? '#ff003c' : currentGMag > 4 ? '#f59e0b' : '#00f0ff';
                    return (
                      <g>
                        {/* Thin precise crosshairs */}
                        <line x1={lx} y1="-6.5" x2={lx} y2="6.5" stroke={lc} strokeWidth="0.02" opacity="0.6" strokeDasharray="0.1 0.1" />
                        <line x1="-6.5" y1={ly} x2="6.5" y2={ly} stroke={lc} strokeWidth="0.02" opacity="0.6" strokeDasharray="0.1 0.1" />
                        {/* Outer sleek ring */}
                        <circle cx={lx} cy={ly} r="0.35" fill="none" stroke={lc} strokeWidth="0.04" opacity="0.8" />
                        {/* Coloured fill dot */}
                        <circle cx={lx} cy={ly} r="0.12" fill={lc} />
                        {/* White core for extreme contrast */}
                        <circle cx={lx} cy={ly} r="0.04" fill="#ffffff" />
                      </g>
                    );
                  })()}
                </g>

                {/* Origin minimalist cross */}
                <line x1="-0.15" y1="0" x2="0.15" y2="0" stroke="#555" strokeWidth="0.03" />
                <line x1="0" y1="-0.15" x2="0" y2="0.15" stroke="#555" strokeWidth="0.03" />
              </svg>
            </div>


            {/* G-Force Readouts */}
            <div className="grid grid-cols-2 gap-3 mt-2 pt-3 border-t border-[#181818] shrink-0">
              <div>
                <p className="text-[9px] text-[#444] font-bold uppercase tracking-widest mb-1">Lateral G</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white tracking-tight">{Math.abs(telemetry.gForceLateral).toFixed(2)}</span>
                  <span className="text-xs text-[#444] font-bold">G</span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${telemetry.gForceLateral > 0.1 ? 'text-violet-400' : telemetry.gForceLateral < -0.1 ? 'text-violet-400' : 'text-[#444]'
                  }`}>
                  {telemetry.gForceLateral > 0.1 ? 'RIGHT' : telemetry.gForceLateral < -0.1 ? 'LEFT' : 'NEUTRAL'}
                </span>
              </div>
              <div>
                <p className="text-[9px] text-[#444] font-bold uppercase tracking-widest mb-1">Longitudinal G</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white tracking-tight">{Math.abs(telemetry.gForceLongitudinal).toFixed(2)}</span>
                  <span className="text-xs text-[#444] font-bold">G</span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${telemetry.gForceLongitudinal > 0.1 ? 'text-amber-400' : telemetry.gForceLongitudinal < -0.1 ? 'text-red-400' : 'text-[#444]'
                  }`}>
                  {telemetry.gForceLongitudinal > 0.1 ? 'ACCEL' : telemetry.gForceLongitudinal < -0.1 ? 'BRAKE' : 'NEUTRAL'}
                </span>
              </div>
            </div>
          </div>
        </div>


        {/* ──────────── RIGHT: Hydration + Cognitive Trends ──────────── */}

        {/* ──────────── RIGHT: Hydration + Cognitive Trends ──────────── */}
        <div className="col-span-4 flex flex-col gap-4 min-h-0">

          {/* FLUID & HYDRATION */}
          <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg p-4 flex flex-col shrink-0">
            <p className="text-[9px] text-[#555] font-bold uppercase tracking-[0.2em] mb-3">Fluid &amp; Hydration</p>

            <div className="flex items-center justify-between gap-4">
              {/* Left: values */}
              <div className="flex flex-col gap-2">
                <p className="text-[9px] text-[#555] font-bold uppercase tracking-widest">Hydration Level</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white tracking-tight leading-none">{telemetry.hydration.toFixed(1)}</span>
                  <span className="text-xl font-black text-[#00f0ff]">%</span>
                </div>
                <div className="text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest w-max"
                  style={{ background: '#00f0ff20', border: '1px solid #00f0ff40', color: '#00f0ff' }}>
                  {telemetry.hydration > 70 ? 'MODERATE' : telemetry.hydration > 50 ? 'LOW' : 'CRITICAL'}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-[#1a1a1a]">
                  <div>
                    <p className="text-[8px] text-[#444] uppercase tracking-widest font-bold mb-0.5">Fluid Loss</p>
                    <p className="text-xs font-black text-white">1.2L/h <span className="text-[#ff003c]">↑</span></p>
                  </div>
                  <div>
                    <p className="text-[8px] text-[#444] uppercase tracking-widest font-bold mb-0.5">Sweat Rate</p>
                    <p className="text-xs font-black text-white">0.9L/h <span className="text-[#ff003c]">↑</span></p>
                  </div>
                </div>
              </div>

              {/* Right: Flask */}
              <div className="relative flex-shrink-0 flex items-center gap-3">
                {/* Tick labels */}
                <div className="flex flex-col justify-between text-[8px] text-[#444] h-32 py-1">
                  {['100%', '75%', '50%', '25%', '0%'].map(l => <span key={l}>{l}</span>)}
                </div>

                {/* Flask SVG */}
                <svg viewBox="0 0 80 110" className="h-32 w-auto drop-shadow-[0_0_12px_rgba(0,210,255,0.2)]">
                  <defs>
                    <linearGradient id="flaskLiquid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00ddff" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#0044cc" stopOpacity="1" />
                    </linearGradient>
                    <clipPath id="flaskClip">
                      <path d="M30,5 L50,5 L50,35 C50,35 72,65 72,82 C72,97 62,104 40,104 C18,104 8,97 8,82 C8,65 30,35 30,35 Z" />
                    </clipPath>
                  </defs>
                  {/* Glass */}
                  <path d="M30,5 L50,5 L50,35 C50,35 72,65 72,82 C72,97 62,104 40,104 C18,104 8,97 8,82 C8,65 30,35 30,35 Z"
                    fill="rgba(255,255,255,0.02)" stroke="#2a2a2a" strokeWidth="2" />
                  {/* Liquid */}
                  <rect x="0" y={104 - (telemetry.hydration / 100) * 99} width="80" height="110"
                    fill="url(#flaskLiquid)" clipPath="url(#flaskClip)"
                    style={{ transition: 'y 1s ease-in-out' }} />
                  {/* Surface sheen */}
                  <ellipse cx="40" cy={104 - (telemetry.hydration / 100) * 99} rx="20" ry="3"
                    fill="#00eeff" opacity="0.6" clipPath="url(#flaskClip)" />
                </svg>
              </div>
            </div>
          </div>

          {/* COGNITIVE STATE TRENDS */}
          <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg p-4 flex-1 flex flex-col min-h-0">
            <p className="text-[9px] text-[#555] font-bold uppercase tracking-[0.2em] mb-3">Cognitive State Trends</p>

            <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
              {/* Stress */}
              <div className="flex flex-col min-h-0">
                <p className="text-[9px] text-[#ff9f0a] font-bold uppercase tracking-widest mb-1">Stress</p>
                <span className="text-3xl font-black text-white tracking-tight leading-none mb-3">{telemetry.stress.toFixed(1)}</span>
                <div className="flex-1 relative min-h-0 border-b border-l border-[#1e1e1e]">
                  <svg viewBox="0 0 200 80" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                    <defs>
                      <linearGradient id="sgFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff9f0a" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ff9f0a" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={toAreaPath(stressHistory, 0, 100, 200, 80)} fill="url(#sgFill)" />
                    <polyline points={toPolyline(stressHistory, 0, 100, 200, 80)}
                      fill="none" stroke="#ff9f0a" strokeWidth="1.5" strokeLinejoin="round"
                      style={{ filter: 'drop-shadow(0 0 3px #ff9f0a)' }} />
                    {/* Dots every N points */}
                    {stressHistory.filter((_, i) => i % 10 === 0).map((v, idx) => {
                      const i = idx * 10;
                      const x = (i / (stressHistory.length - 1)) * 200;
                      const y = 80 - (v / 100) * 80;
                      return <circle key={i} cx={x} cy={Math.max(0, Math.min(80, y))} r="2.5" fill="#ff9f0a" />;
                    })}
                  </svg>
                </div>
              </div>

              {/* Fatigue */}
              <div className="flex flex-col min-h-0">
                <p className="text-[9px] text-[#ff003c] font-bold uppercase tracking-widest mb-1">Fatigue</p>
                <span className="text-3xl font-black text-white tracking-tight leading-none mb-3">{telemetry.fatigue.toFixed(1)}</span>
                <div className="flex-1 relative min-h-0 border-b border-l border-[#1e1e1e]">
                  <svg viewBox="0 0 200 80" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                    <defs>
                      <linearGradient id="fgFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff003c" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ff003c" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={toAreaPath(fatigueHistory, 0, 100, 200, 80)} fill="url(#fgFill)" />
                    <polyline points={toPolyline(fatigueHistory, 0, 100, 200, 80)}
                      fill="none" stroke="#ff003c" strokeWidth="1.5" strokeLinejoin="round"
                      style={{ filter: 'drop-shadow(0 0 3px #ff003c)' }} />
                    {fatigueHistory.filter((_, i) => i % 10 === 0).map((v, idx) => {
                      const i = idx * 10;
                      const x = (i / (fatigueHistory.length - 1)) * 200;
                      const y = 80 - (v / 100) * 80;
                      return <circle key={i} cx={x} cy={Math.max(0, Math.min(80, y))} r="2.5" fill="#ff003c" />;
                    })}
                  </svg>
                </div>
              </div>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-[8px] text-[#333] uppercase tracking-widest shrink-0">
              {['-20 MIN', '-15 MIN', '-10 MIN', '-5 MIN', 'NOW'].map(l => <span key={l}>{l}</span>)}
            </div>
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-2 shrink-0">
              {[['#ff9f0a', 'STRESS'], ['#ff003c', 'FATIGUE']].map(([color, label]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-4 h-0.5 rounded" style={{ background: color }} />
                  <span className="text-[8px] text-[#444] uppercase tracking-widest">{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
