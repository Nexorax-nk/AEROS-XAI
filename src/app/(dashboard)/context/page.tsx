"use client";

import React, { useState, useEffect } from "react";
import { useTelemetry } from "@/context/TelemetryContext";

const S = {
  label: { fontSize: "8px", color: "#666", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, display: "block", marginBottom: "4px" },
  val: { fontSize: "18px", fontWeight: 800, color: "#e8e8e8", lineHeight: 1 },
  valLg: { fontSize: "28px", fontWeight: 800, color: "#fff", lineHeight: 1 },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "linear-gradient(90deg, #111 0%, #0a0a0a 100%)", borderLeft: "2px solid #333", borderRadius: "2px" },
  card: { background: "linear-gradient(180deg, #0f0f0f 0%, #080808 100%)", border: "1px solid #1c1c1c", borderRadius: "6px", padding: "14px", display: "flex" as const, flexDirection: "column" as const, boxShadow: "0 4px 12px rgba(0,0,0,0.5)" },
  sectionHdr: { fontSize: "10px", color: "#555", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, paddingBottom: "10px", marginBottom: "12px", borderBottom: "1px solid #1c1c1c" },
};

export default function ContextPage() {
  const { telemetry } = useTelemetry();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  const maxWear = Math.max(telemetry.tireWear.fl, telemetry.tireWear.fr, telemetry.tireWear.rl, telemetry.tireWear.rr);
  const tireLife = Math.max(0, 100 - maxWear);
  const fuelRemaining = Math.max(0, 105 - telemetry.lap * 1.8);
  const fuelPct = (fuelRemaining / 105) * 100;
  const tireC = 2 * Math.PI * 26;
  const tireFill = (tireLife / 100) * tireC;
  const lapPct = Math.min(95, Math.max(0, ((telemetry.lap - 20) / 20) * 100));

  const fmt = (t: number) => {
    if (!t) return "—";
    return `${Math.floor(t / 60)}:${(t % 60).toFixed(3).padStart(6, "0")}`;
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "270px 1fr 290px",
      gridTemplateRows: "1fr",
      gap: "14px",
      height: "100%",
      padding: "12px 16px",
      boxSizing: "border-box",
      overflow: "hidden",
      background: "#030303",
      fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif",
      color: "#e0e0e0",
    }}>

      {/* ═══ LEFT COLUMN ═══════════════════════════════════════════ */}
      <div style={{ display: "grid", gridTemplateRows: "auto 1fr auto", gap: "8px", overflow: "hidden" }}>

        {/* Race State */}
        <div style={{ ...S.card, gap: "0" }}>
          <div style={S.sectionHdr}>Race State</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", paddingBottom: "10px", marginBottom: "10px", borderBottom: "1px solid #141414" }}>
            <div>
              <span style={S.label}>Lap</span>
              <span style={S.valLg}>{telemetry.lap}<span style={{ fontSize: "12px", color: "#333", marginLeft: "3px", fontWeight: 600 }}>/ 58</span></span>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={S.label}>Position</span>
              <span style={S.valLg}>P3</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <div style={{ ...S.row, borderLeftColor: "#aa2222" }}><span style={S.label}>Gap Ahead</span><span style={{ fontSize: "13px", fontWeight: 700, color: "#cc3333" }}>+1.8s</span></div>
            <div style={{ ...S.row, borderLeftColor: "#666" }}><span style={S.label}>Gap Behind</span><span style={{ fontSize: "13px", fontWeight: 700, color: "#e8e8e8" }}>+0.9s</span></div>
          </div>
        </div>

        {/* Sector Analysis */}
        <div style={{ ...S.card, overflow: "hidden" }}>
          <div style={S.sectionHdr}>Sector Analysis</div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {[{ s: "S1", d: +0.12 }, { s: "S2", d: -0.08 }, { s: "S3", d: +0.04 }].map((x, i) => (
              <div key={x.s} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? "1px solid #161616" : "none" }}>
                <span style={{ fontSize: "10px", color: "#666", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>{x.s === "S1" ? "Sector 1" : x.s === "S2" ? "Sector 2" : "Sector 3"}</span>
                <span style={{ fontSize: "15px", fontWeight: 800, color: x.d > 0 ? "#cc3333" : "#4a8a4a" }}>{x.d > 0 ? "+" : ""}{x.d.toFixed(2)}s</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "12px", padding: "12px", background: "linear-gradient(90deg, #141414 0%, #0a0a0a 100%)", borderRadius: "4px", border: "1px solid #1c1c1c", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "10px", color: "#666", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>Lap Delta</span>
            <span style={{ fontSize: "18px", fontWeight: 800, color: "#cc3333" }}>+0.08s</span>
          </div>
        </div>

        {/* Track Conditions */}
        <div style={{ ...S.card }}>
          <div style={S.sectionHdr}>Track Conditions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {[
              { l: "Condition", v: telemetry.weather },
              { l: "Air Temp", v: `${Math.round(telemetry.trackTemp - 8)}°C` },
              { l: "Track Temp", v: `${Math.round(telemetry.trackTemp)}°C` },
              { l: "Grip", v: `${Math.round(telemetry.trackGrip * 100)}%` },
            ].map(r => (
              <div key={r.l} style={{ ...S.row }}>
                <span style={S.label}>{r.l}</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#e0e0e0" }}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CENTER: Track Map + Timeline ══════════════════════════ */}
      <div style={{ display: "grid", gridTemplateRows: "1fr auto", gap: "8px", overflow: "hidden" }}>

        {/* Track Map */}
        <div style={{ ...S.card, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 10, left: 12, fontSize: "9px", color: "#333", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>Track Map — Silverstone</div>
          <div style={{ position: "absolute", top: 10, right: 12, display: "flex", gap: "14px", alignItems: "center" }}>
            <LegendItem color="#3a6a3a" label="DRS" />
            <LegendItem color="#6a6a2a" label="Pit" />
            <LegendItem color="#2a5a6a" label="Sector" />
          </div>
          <svg viewBox="0 0 800 560" style={{ width: "100%", height: "100%", display: "block" }} preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="sg"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <filter id="glow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>

            {/* Base Track Shadows & Surface */}
            {/* Real F1 Track Path */}
            <path d="M 250 500 L 600 500 C 750 500 750 350 650 300 L 550 250 C 500 220 480 150 550 100 C 620 50 700 150 600 200 L 450 300 C 400 350 300 350 250 300 L 150 150 C 100 50 50 100 50 200 L 100 350 C 120 450 150 500 250 500 Z"
              fill="none" stroke="#050505" strokeWidth="36" strokeLinejoin="round" strokeLinecap="round" />
            <path d="M 250 500 L 600 500 C 750 500 750 350 650 300 L 550 250 C 500 220 480 150 550 100 C 620 50 700 150 600 200 L 450 300 C 400 350 300 350 250 300 L 150 150 C 100 50 50 100 50 200 L 100 350 C 120 450 150 500 250 500 Z"
              fill="none" stroke="#1c1c1c" strokeWidth="28" strokeLinejoin="round" strokeLinecap="round" />
            {/* Subtle Racing Line / Groove */}
            <path d="M 250 500 L 600 500 C 750 500 750 350 650 300 L 550 250 C 500 220 480 150 550 100 C 620 50 700 150 600 200 L 450 300 C 400 350 300 350 250 300 L 150 150 C 100 50 50 100 50 200 L 100 350 C 120 450 150 500 250 500 Z"
              fill="none" stroke="#333" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" opacity="0.6" />

            {/* Pit Lane (Amber) */}
            <path d="M 120 390 Q 120 460 250 460 L 580 460 Q 650 460 660 330" fill="none" stroke="#c8960a" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" filter="url(#glow)" />
            <path d="M 120 390 Q 120 460 250 460 L 580 460 Q 650 460 660 330" fill="none" stroke="#ffe866" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="6 4" />
            
            {/* Pit Entry / Exit Markers */}
            <circle cx="120" cy="390" r="4" fill="#ffe866" filter="url(#glow)" />
            <text x="50" y="380" fill="#c8960a" fontSize="10" fontWeight="900" filter="url(#sg)" letterSpacing="0.05em">PIT ENTRY</text>
            
            <circle cx="660" cy="330" r="4" fill="#ffe866" filter="url(#glow)" />
            <text x="670" y="340" fill="#c8960a" fontSize="10" fontWeight="900" filter="url(#sg)" letterSpacing="0.05em">PIT EXIT</text>

            {/* DRS Zones (Green) */}
            {/* Zone 1: Main Straight */}
            <path d="M 350 500 L 550 500" fill="none" stroke="#3aaa8a" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" filter="url(#glow)" />
            <path d="M 350 500 L 550 500" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            <line x1="320" y1="480" x2="320" y2="520" stroke="#3aaa8a" strokeWidth="3" strokeDasharray="4 4" />
            <text x="300" y="470" fill="#3aaa8a" fontSize="11" fontWeight="900" letterSpacing="0.05em" filter="url(#sg)">DRS DETECT</text>

            {/* Zone 2: Back Straight */}
            <path d="M 230 270 L 170 180" fill="none" stroke="#3aaa8a" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" filter="url(#glow)" />
            <path d="M 230 270 L 170 180" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            <line x1="280" y1="310" x2="310" y2="290" stroke="#3aaa8a" strokeWidth="3" strokeDasharray="4 4" />
            <text x="300" y="280" fill="#3aaa8a" fontSize="11" fontWeight="900" letterSpacing="0.05em" filter="url(#sg)">DRS DETECT</text>

            {/* Sector Splits (Cyan) */}
            {/* S1 */}
            <line x1="600" y1="280" x2="630" y2="250" stroke="#00d8ff" strokeWidth="3" strokeDasharray="6 4" filter="url(#sg)" />
            <text x="640" y="250" fill="#00d8ff" fontSize="14" fontWeight="900" letterSpacing="0.1em" filter="url(#sg)">SECTOR 1</text>
            
            {/* S2 */}
            <line x1="100" y1="100" x2="130" y2="70" stroke="#00d8ff" strokeWidth="3" strokeDasharray="6 4" filter="url(#sg)" />
            <text x="140" y="70" fill="#00d8ff" fontSize="14" fontWeight="900" letterSpacing="0.1em" filter="url(#sg)">SECTOR 2</text>

            {/* S3: Final Corner */}
            <line x1="120" y1="450" x2="150" y2="420" stroke="#00d8ff" strokeWidth="3" strokeDasharray="6 4" filter="url(#sg)" />
            <text x="80" y="415" fill="#00d8ff" fontSize="14" fontWeight="900" letterSpacing="0.1em" filter="url(#sg)">SECTOR 3</text>

            {/* Start / Finish Grid */}
            <line x1="240" y1="485" x2="240" y2="515" stroke="#fff" strokeWidth="4" />
            {Array.from({length: 4}).map((_, i) => <circle key={i} cx={225 + i * 12} cy={500} r={2.5} fill="#fff" />)}

            {/* Car Position Indicator */}
            <g>
              <animateMotion dur={`${telemetry.lastLapTime || 85}s`} repeatCount="indefinite"
                  path="M 250 500 L 600 500 C 750 500 750 350 650 300 L 550 250 C 500 220 480 150 550 100 C 620 50 700 150 600 200 L 450 300 C 400 350 300 350 250 300 L 150 150 C 100 50 50 100 50 200 L 100 350 C 120 450 150 500 250 500 Z" />
              <circle cx="0" cy="0" r="16" fill="none" stroke="#fff" strokeWidth="3" filter="url(#glow)">
                <animate attributeName="r" values="10;24;10" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="0" cy="0" r="7" fill="#fff" filter="url(#glow)" />
              <circle cx="0" cy="0" r="3.5" fill="#000" />
            </g>
          </svg>
        </div>

        {/* Strategy Timeline */}
        <div style={{ ...S.card }}>
          <div style={S.sectionHdr}>Strategy Timeline</div>
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "45px 36px 55px", flex: 1 }}>
            
            {/* Background Track */}
            <div style={{ position: "absolute", left: 36, right: 36, top: "50%", height: 6, background: "#111", borderRadius: 3, borderBottom: "1px solid #1c1c1c", borderTop: "1px solid #000", transform: "translateY(-50%)" }} />
            
            {/* Filled Progress Track */}
            <div style={{ position: "absolute", left: 36, top: "50%", width: "28%", height: 6, background: "linear-gradient(90deg, #661111 0%, #e62222 100%)", borderRadius: 3, transform: "translateY(-50%)", boxShadow: "0 0 12px rgba(230,34,34,0.6)" }} />

            {[
              { lbl: `Lap ${telemetry.lap}`, active: true, opt: false, desc: "Current" },
              { lbl: "Lap 27", active: false, opt: true, desc: "Opt. Window Open" },
              { lbl: "Lap 31", active: false, opt: false, desc: "Opt. Window Close" },
              { lbl: "Lap 35", active: false, opt: false, desc: "Max Tyre Ext." },
            ].map((n, i) => (
              <div key={i} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1 }}>
                
                {/* Node Point */}
                <div style={{ 
                  width: n.opt ? 18 : (n.active ? 16 : 12), 
                  height: n.opt ? 18 : (n.active ? 16 : 12), 
                  borderRadius: "50%", 
                  background: n.active ? "radial-gradient(circle, #ff5555 0%, #cc1111 100%)" : n.opt ? "radial-gradient(circle, #ffd700 0%, #b8860b 100%)" : "#141414", 
                  border: `2px solid ${n.active ? "#ff8888" : n.opt ? "#ffe866" : "#333"}`,
                  boxShadow: n.active ? "0 0 16px rgba(255,51,51,0.8)" : n.opt ? "0 0 16px rgba(255,215,0,0.6)" : "inset 0 2px 4px rgba(0,0,0,0.8)"
                }} />

                {/* Top Label (for Optimal) */}
                {n.opt && (
                  <div style={{ position: "absolute", top: -34, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", color: "#ffd700", fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 0 10px rgba(255,215,0,0.5)" }}>Optimal Pit</span>
                    <div style={{ width: 2, height: 12, background: "linear-gradient(180deg, #ffd700 0%, transparent 100%)", marginTop: 4 }} />
                  </div>
                )}

                {/* Bottom Labels */}
                <div style={{ position: "absolute", top: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "13px", color: n.active ? "#fff" : n.opt ? "#fff" : "#777", fontWeight: 900, whiteSpace: "nowrap" }}>{n.lbl}</span>
                  <span style={{ fontSize: "9px", color: n.active ? "#ff5555" : n.opt ? "#ffd700" : "#444", fontWeight: 800, textTransform: "uppercase", whiteSpace: "nowrap", letterSpacing: "0.05em" }}>{n.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ RIGHT COLUMN ══════════════════════════════════════════ */}
      <div style={{ display: "grid", gridTemplateRows: "1fr 1fr 1fr 1fr", gap: "14px", overflow: "hidden" }}>

        {/* Tyre Strategy */}
        <div style={{ ...S.card, overflow: "hidden", position: "relative" }}>
          {/* Subtle background glow */}
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "radial-gradient(circle, rgba(200,150,10,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={S.sectionHdr}>Tyre Strategy</div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minHeight: 0 }}>
            {/* Tyre Icon + Ring Container */}
            <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0, borderRadius: "50%", background: "radial-gradient(circle, #1a1505 0%, #0a0802 100%)", border: "1px solid #3a2a0a", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 4px 10px rgba(0,0,0,0.5), 0 0 15px rgba(200,150,10,0.15)" }}>
              {/* Clean flat Tyre SVG */}
              <svg viewBox="0 0 64 64" width="40" height="40">
                {/* Rubber */}
                <circle cx="32" cy="32" r="30" fill="#111" />
                <circle cx="32" cy="32" r="30" fill="none" stroke="#222" strokeWidth="4" />
                {Array.from({ length: 14 }).map((_, i) => {
                  const a = (i / 14) * Math.PI * 2;
                  return <line key={i} x1={32 + Math.cos(a) * 24} y1={32 + Math.sin(a) * 24} x2={32 + Math.cos(a) * 30} y2={32 + Math.sin(a) * 30} stroke="#050505" strokeWidth="3" strokeLinecap="round" />;
                })}
                
                {/* Metallic Rim Highlights */}
                <circle cx="32" cy="32" r="17" fill="none" stroke="#777" strokeWidth="1.5" />
                <circle cx="32" cy="32" r="16" fill="#181818" />
                
                {/* Silver Spokes */}
                {Array.from({ length: 5 }).map((_, i) => {
                  const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
                  return <line key={i} x1={32 + Math.cos(a) * 6} y1={32 + Math.sin(a) * 6} x2={32 + Math.cos(a) * 16} y2={32 + Math.sin(a) * 16} stroke="#aaa" strokeWidth="2.5" strokeLinecap="round" />;
                })}
                
                {/* Center Hub */}
                <circle cx="32" cy="32" r="6" fill="#222" stroke="#888" strokeWidth="1.5" />
                <circle cx="32" cy="32" r="2" fill="#eee" />
              </svg>
              {/* Neon Ring Around It */}
              <svg viewBox="0 0 64 64" width="64" height="64" style={{ position: "absolute", top: -1, left: -1, pointerEvents: "none" }}>
                <circle cx="32" cy="32" r="31" fill="none" stroke="#c8960a" strokeWidth="2"
                  strokeDasharray={`${(tireLife / 100) * (2 * Math.PI * 31)} ${2 * Math.PI * 31}`} strokeLinecap="round" transform="rotate(-90 32 32)"
                  style={{ transition: "stroke-dasharray 1s ease", filter: "drop-shadow(0 0 4px rgba(200,150,10,0.8))" }} />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span style={S.label}>Compound</span>
              <div style={{ fontSize: "18px", fontWeight: 900, color: "#c8960a", marginBottom: "8px", textShadow: "0 0 10px rgba(200,150,10,0.3)" }}>MEDIUM</div>
              <div style={{ display: "flex", gap: "12px" }}>
                <div><span style={S.label}>Life</span><div style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>{Math.round(tireLife)}%</div></div>
                <div><span style={S.label}>Deg/Lap</span><div style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>0.83%</div></div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "12px", height: 3, background: "#141414", borderRadius: 2, overflow: "hidden", position: "relative" }}>
            <div style={{ height: "100%", width: `${tireLife}%`, background: "linear-gradient(90deg, #c8960a 0%, #ffd700 100%)", borderRadius: 2, transition: "width 1s ease", boxShadow: "0 0 8px rgba(200,150,10,0.6)" }} />
          </div>
        </div>

        {/* Fuel Strategy */}
        <div style={{ ...S.card, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "radial-gradient(circle, rgba(58,138,122,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={S.sectionHdr}>Fuel Strategy</div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minHeight: 0 }}>
            <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0, borderRadius: "50%", background: "radial-gradient(circle, #0a1c18 0%, #050d0a 100%)", border: "1px solid #1a3a30", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 4px 10px rgba(0,0,0,0.5), 0 0 15px rgba(58,138,122,0.15)" }}>
              {/* Clean flat Fuel SVG */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="3" width="10" height="18" rx="2" fill="#11221c" stroke="#3aaa8a" strokeWidth="2" />
                <rect x="6" y="6" width="6" height="5" rx="1" fill="#3aaa8a" />
                <path d="M14 8h3.5a1.5 1.5 0 0 1 1.5 1.5v4.5A1.5 1.5 0 0 1 17.5 15.5H14" stroke="#3aaa8a" strokeWidth="2" strokeLinejoin="round" />
                <circle cx="17.5" cy="15.5" r="2" fill="#3aaa8a" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                <div><span style={S.label}>Remaining</span><div style={{ fontSize: "18px", fontWeight: 900, color: "#fff" }}>{fuelRemaining.toFixed(1)}<span style={{ fontSize: "11px", color: "#666", marginLeft: "2px" }}>L</span></div></div>
                <div><span style={S.label}>Est. Laps</span><div style={{ fontSize: "18px", fontWeight: 900, color: "#fff" }}>{(fuelRemaining / 1.8).toFixed(1)}</div></div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(58,138,122,0.05)", padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(58,138,122,0.1)" }}>
                <span style={{ fontSize: "9px", color: "#888", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Fuel Delta</span>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#3aaa6a", textShadow: "0 0 8px rgba(58,170,106,0.4)" }}>+0.8 L</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "12px", height: 3, background: "#141414", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${fuelPct}%`, background: "linear-gradient(90deg, #3a7a6a 0%, #4aca9a 100%)", borderRadius: 2, transition: "width 1s ease", boxShadow: "0 0 8px rgba(74,202,154,0.5)" }} />
          </div>
        </div>

        {/* Pit Window */}
        <div style={{ ...S.card, overflow: "hidden" }}>
          <div style={S.sectionHdr}>Pit Window</div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minHeight: 0 }}>
            <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: "50%", background: "radial-gradient(circle, #181818 0%, #0d0d0d 100%)", border: "1px solid #252525", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 4px 10px rgba(0,0,0,0.5)" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.8))" }}>
                <defs>
                  <linearGradient id="wrenchGrad" x1="0" y1="0" x2="24" y2="24">
                    <stop offset="0%" stopColor="#d0d0d0" />
                    <stop offset="100%" stopColor="#555" />
                  </linearGradient>
                </defs>
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="url(#wrenchGrad)" stroke="#111" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <span style={S.label}>Opt. Window</span>
                  <div style={{ fontSize: "16px", fontWeight: 900, color: "#fff", letterSpacing: "0.02em" }}>LAP 27 – 31</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={S.label}>Undercut</span>
                  <div style={{ fontSize: "14px", fontWeight: 900, color: "#c8960a", textShadow: "0 0 8px rgba(200,150,10,0.4)" }}>HIGH</div>
                </div>
              </div>
              {/* Pit bar */}
              <div style={{ position: "relative", height: 6, background: "#111", borderRadius: 3, overflow: "hidden", border: "1px solid #1c1c1c" }}>
                <div style={{ position: "absolute", left: `${((27 - 20) / 20) * 100}%`, width: `${((31 - 27) / 20) * 100}%`, height: "100%", background: "#c8960a", opacity: 0.9, boxShadow: "0 0 6px rgba(200,150,10,0.6)" }} />
                <div style={{ position: "absolute", left: `${lapPct}%`, top: 0, bottom: 0, width: 3, background: "#fff", borderRadius: 1, boxShadow: "0 0 6px #fff" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <span style={{ fontSize: "9px", color: "#444", fontWeight: 700 }}>20</span>
                <span style={{ fontSize: "9px", color: "#c8960a", fontWeight: 800 }}>27–31</span>
                <span style={{ fontSize: "9px", color: "#444", fontWeight: 700 }}>40</span>
              </div>
            </div>
          </div>
        </div>

        {/* DRS Opportunity */}
        <div style={{ ...S.card, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "radial-gradient(circle, rgba(58,170,58,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={S.sectionHdr}>DRS Opportunity</div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minHeight: 0 }}>
            <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: "50%", background: "radial-gradient(circle, #081c08 0%, #050d05 100%)", border: "1px solid #1a3a1a", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 4px 10px rgba(0,0,0,0.5), 0 0 15px rgba(58,170,58,0.15)" }}>
              <span style={{ fontSize: "14px", fontWeight: 900, color: "#4aca4a", letterSpacing: "0.05em", textShadow: "0 0 10px rgba(74,202,74,0.5)" }}>DRS</span>
            </div>
            <div style={{ flex: 1, display: "flex", gap: "10px", justifyContent: "space-between" }}>
              <div>
                <span style={S.label}>Gain</span>
                <div style={{ fontSize: "18px", fontWeight: 900, color: "#4aca4a", lineHeight: 1, textShadow: "0 0 10px rgba(74,202,74,0.3)" }}>0.23<span style={{ fontSize: "10px", color: "#666", marginLeft: "2px" }}>s</span></div>
              </div>
              <div>
                <span style={S.label}>Zones</span>
                <div style={{ fontSize: "18px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>2</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={S.label}>Race Pace</span>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#cc3333", lineHeight: 1.3 }}>{fmt(telemetry.lastLapTime)}</div>
                <div style={{ fontSize: "11px", fontWeight: 800, color: "#4aca4a" }}>{fmt(telemetry.lastLapTime - 0.5)}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <div style={{ width: 16, height: 2, background: color }} />
      <span style={{ fontSize: "8px", color: "#333", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}
