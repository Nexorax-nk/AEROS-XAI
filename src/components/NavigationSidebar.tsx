"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Car, Crosshair, Cpu, Hexagon, Brain, Signal, Database, Zap } from 'lucide-react';

export function NavigationSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/overview', label: 'COMMAND CENTER', icon: Crosshair },
    { href: '/vehicle', label: 'MACHINE TELEMETRY', icon: Car },
    { href: '/driver', label: 'COGNITIVE STATE', icon: Brain },
    { href: '/context', label: 'STRATEGY AGENT', icon: Activity },
    { href: '/network', label: 'AGENT NETWORK', icon: Cpu },
  ];

  return (
    <div className="w-[260px] bg-[#050505] border-r border-[#1a1a1a] flex flex-col h-screen shrink-0 font-sans z-50 relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-[#e00016]/5 to-transparent pointer-events-none" />

      {/* Logo Area */}
      <div className="h-[85px] border-b border-[#1a1a1a] flex items-center px-6 shrink-0 relative z-10 bg-[#050505]/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#333] bg-[#0a0a0a] shadow-[0_0_15px_rgba(224,0,22,0.1)] group transition-all hover:border-[#e00016]/50">
            <Hexagon className="w-5 h-5 text-[#e00016] group-hover:animate-[spin_4s_linear_infinite]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[#f0f0f0] font-black text-base tracking-[0.2em] leading-none">AEROS<span className="text-[#e00016]">-XAI</span></span>
            <span className="text-[8px] text-[#888] tracking-[0.3em] font-bold uppercase mt-1.5 flex items-center gap-1">
              <Signal className="w-2.5 h-2.5 text-[#e00016]" />
              Live Telemetry
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar relative z-10">
        
        {/* Navigation Links */}
        <div className="flex flex-col py-6 gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-4 px-6 py-3.5 transition-all duration-300 relative overflow-hidden group ${
                  isActive 
                    ? 'text-white bg-gradient-to-r from-[#e00016]/15 via-[#e00016]/5 to-transparent' 
                    : 'text-[#666] hover:text-[#e0e0e0] hover:bg-[#0a0a0a]'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#e00016] shadow-[0_0_12px_rgba(224,0,22,0.8)]" />
                )}
                <link.icon className={`w-[18px] h-[18px] transition-all duration-300 ${
                  isActive ? 'text-[#e00016] drop-shadow-[0_0_5px_rgba(224,0,22,0.5)]' : 'group-hover:text-[#aaa]'
                }`} />
                <span className={`text-xs font-black tracking-[0.15em] uppercase transition-all duration-300 ${
                  isActive ? 'opacity-100 translate-x-1' : 'opacity-70'
                }`}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Spacer to push modules to bottom if needed, or just let them sit below */}
        <div className="flex-1" />

        {/* Live Modules Section (Fills empty space) */}
        <div className="px-6 py-6 border-t border-[#111]">
          <h4 className="text-[9px] text-[#555] font-black tracking-[0.3em] uppercase mb-5 flex items-center gap-2">
            <Zap className="w-3 h-3 text-[#e00016]" />
            Active Sub-Systems
          </h4>
          
          <div className="flex flex-col gap-5">
            {/* Module 1 */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] text-[#888] font-bold tracking-widest uppercase flex items-center gap-1.5">
                  <Database className="w-3 h-3" />
                  Telemetry Stream
                </span>
                <span className="text-[10px] text-white font-black font-mono">98%</span>
              </div>
              <div className="h-1 w-full bg-[#111] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#e00016] to-[#ff4d4d] w-[98%] shadow-[0_0_10px_rgba(224,0,22,0.5)]" />
              </div>
            </div>

            {/* Module 2 */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] text-[#888] font-bold tracking-widest uppercase flex items-center gap-1.5">
                  <Brain className="w-3 h-3" />
                  Neural Engine
                </span>
                <span className="text-[10px] text-white font-black font-mono">74%</span>
              </div>
              <div className="h-1 w-full bg-[#111] rounded-full overflow-hidden">
                <div className="h-full bg-[#00ff66] w-[74%] shadow-[0_0_10px_rgba(0,255,102,0.5)]" />
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Session Status Footer (Cinematic Data Readout) */}
      <div className="p-5 border-t border-[#1a1a1a] bg-[#020202] relative z-10 shrink-0">
        <div className="bg-[#080808] border border-[#1a1a1a] p-4 rounded-md flex flex-col gap-4 shadow-lg relative overflow-hidden">
          
          {/* Subtle tech grid background in footer */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
          
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[9px] text-[#666] uppercase tracking-[0.2em] font-bold">Data Link</span>
            <span className="text-[#e00016] font-black text-[9px] tracking-widest flex items-center gap-2 bg-[#e00016]/10 px-2 py-1 rounded border border-[#e00016]/20">
              23Hz 
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e00016] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e00016]"></span>
              </span>
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="flex flex-col gap-1.5">
              <span className="text-[8px] text-[#555] uppercase tracking-widest font-bold">Pace Fade</span>
              <span className="text-[#e00016] font-mono text-[14px] font-black tracking-wider leading-none drop-shadow-[0_0_3px_rgba(224,0,22,0.3)]">
                +0.14s
              </span>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="text-[8px] text-[#555] uppercase tracking-widest font-bold">Agent Intel</span>
              <span className="text-[#e0e0e0] font-black text-[10px] tracking-wider font-mono leading-none flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#00ff66] rounded-full shadow-[0_0_5px_rgba(0,255,102,0.5)]" />
                ONLINE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}