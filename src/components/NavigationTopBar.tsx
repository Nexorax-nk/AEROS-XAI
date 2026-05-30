"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, Zap } from 'lucide-react';

export function NavigationTopBar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Overview' },
    { href: '/vehicle', label: 'Vehicle Intel' },
    { href: '/driver', label: 'Mission Control' },
    { href: '/context', label: 'Ghost Lap' },
  ];

  return (
    <nav className="w-full h-16 bg-[#050505] border-b border-[#1a1a1a] flex items-center px-6 shrink-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 mr-12">
        <div className="w-8 h-8 bg-[#0a0a0a] border border-[#333] flex items-center justify-center">
          <Zap className="w-4 h-4 text-[#00f0ff]" />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-black tracking-tighter text-sm uppercase leading-none">NEUROPIT</span>
          <span className="text-[8px] text-[#555] uppercase tracking-widest font-bold mt-0.5">Systems</span>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex h-full">
        {links.map(link => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center px-6 h-full transition-all text-xs font-bold uppercase tracking-widest border-b-2 ${
                isActive 
                  ? 'border-[#ff003c] text-[#ff003c] bg-[#0a0a0a]' 
                  : 'border-transparent text-[#666] hover:text-white hover:bg-[#0a0a0a]'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-2 border border-[#333] bg-[#0a0a0a] px-4 py-1.5 rounded-full">
           <span className="w-2 h-2 bg-[#ff003c] rounded-full animate-pulse" />
           <span className="text-[9px] text-[#ff003c] uppercase font-bold tracking-widest">Live Telemetry</span>
        </div>
      </div>
    </nav>
  );
}
