"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Car, Crosshair, ShieldAlert, Cpu, Hexagon, Brain, BookOpen, Signal } from 'lucide-react';

export function NavigationSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'COMMAND CENTER', icon: Crosshair },
    { href: '/vehicle', label: 'MACHINE TELEMETRY', icon: Car },
    { href: '/driver', label: 'COGNITIVE STATE', icon: Brain },
    { href: '/context', label: 'STRATEGY AGENT', icon: Activity },
    { href: '/regulations', label: 'FIA GUARDRAILS', icon: BookOpen },
    { href: '/forecast', label: 'RISK FORECAST', icon: ShieldAlert },
    { href: '/network', label: 'AGENT NETWORK', icon: Cpu },
  ];

  return (
    <div className="w-[250px] bg-[#050505] border-r border-[#1a1a1a] flex flex-col h-screen shrink-0 font-sans z-50 relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-[#ff003c]/5 to-transparent pointer-events-none" />

      {/* Logo Area */}
      <div className="h-[80px] border-b border-[#1a1a1a] flex items-center px-6 shrink-0 relative z-10 bg-[#050505]/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#333] bg-[#0a0a0a] shadow-[0_0_15px_rgba(255,0,60,0.1)] group transition-all hover:border-[#ff003c]/50">
            <Hexagon className="w-5 h-5 text-[#ff003c] group-hover:animate-spin-slow" />
          </div>
          <div className="flex flex-col">
            <span className="text-[#f0f0f0] font-black text-[15px] tracking-[0.2em] leading-none">AEROS<span className="text-[#ff003c]">-XAI</span></span>
            <span className="text-[7.5px] text-[#888] tracking-[0.3em] font-bold uppercase mt-1.5 flex items-center gap-1">
              <Signal className="w-2 h-2 text-[#ff003c]" />
              Live Telemetry
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col py-6 flex-1 gap-1 overflow-y-auto custom-scrollbar relative z-10">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-4 px-6 py-3 transition-all duration-300 relative overflow-hidden group ${
                isActive 
                  ? 'text-white bg-gradient-to-r from-[#ff003c]/10 via-[#ff003c]/5 to-transparent' 
                  : 'text-[#666] hover:text-[#e0e0e0] hover:bg-[#0a0a0a]'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#ff003c] shadow-[0_0_12px_rgba(255,0,60,0.6)]" />
              )}
              <link.icon className={`w-[16px] h-[16px] transition-all duration-300 ${
                isActive ? 'text-[#ff003c] drop-shadow-[0_0_5px_rgba(255,0,60,0.5)]' : 'group-hover:text-[#aaa]'
              }`} />
              <span className={`text-[11px] font-black tracking-[0.15em] uppercase transition-all duration-300 ${
                isActive ? 'opacity-100 translate-x-1' : 'opacity-70'
              }`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Session Status Footer (Cinematic Data Readout) */}
      <div className="p-5 border-t border-[#1a1a1a] bg-[#020202] relative z-10">
        <div className="bg-[#080808] border border-[#1a1a1a] p-4 rounded-md flex flex-col gap-4 shadow-lg relative overflow-hidden">
          
          {/* Subtle tech grid background in footer */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
          
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[9px] text-[#666] uppercase tracking-[0.2em] font-bold">Data Link</span>
            <span className="text-[#ff003c] font-black text-[9px] tracking-widest flex items-center gap-2 bg-[#ff003c]/10 px-2 py-1 rounded border border-[#ff003c]/20">
              23Hz 
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff003c] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff003c]"></span>
              </span>
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="flex flex-col gap-1.5">
              <span className="text-[8px] text-[#555] uppercase tracking-widest font-bold">Pace Fade</span>
              <span className="text-[#ff003c] font-mono text-[14px] font-black tracking-wider leading-none drop-shadow-[0_0_3px_rgba(255,0,60,0.3)]">
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