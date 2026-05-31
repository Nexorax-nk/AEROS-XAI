"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Activity, Cpu, Flag, TrendingUp, ArrowDown, CheckCircle, Gauge, User, Map, Shield, Network, BarChart2, Database, Gavel } from 'lucide-react';

export default function LandingPage() {
  const [timeLeft, setTimeLeft] = useState({ days: '32', hours: '14', minutes: '45', seconds: '10' });

  useEffect(() => {
    // Target time: 32 days from now
    const target = new Date().getTime() + (32 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (45 * 60 * 1000) + (10 * 1000);
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeLeft({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#e00016] selection:text-white">
      
      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative w-full h-screen flex flex-col justify-between">
      
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {/* Background dark radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#e00016]/10 via-[#050505]/80 to-[#050505] z-10" />
        
        {/* The generated F1 Car Image */}
        <div className="absolute inset-0 w-full h-full opacity-80 mix-blend-screen">
          <Image 
            src="/landing_car.png" 
            alt="F1 Car Background" 
            fill 
            className="object-cover object-center"
            priority
            unoptimized
          />
        </div>
        
        {/* Left side deep fade to ensure text is perfectly readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#000] via-[#000]/80 to-transparent z-10 w-2/3" />
      </div>

      {/* Top Header */}
      <header className="relative z-20 flex justify-between items-center px-12 py-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex flex-col items-center justify-center transform -skew-x-12">
            <div className="w-full h-3 bg-[#e00016] mb-1" />
            <div className="w-full h-3 bg-[#e00016] opacity-50" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-widest leading-none">
              AEROS<span className="text-[#e00016]">-XAI</span>
            </span>
            <span className="text-[9px] tracking-[0.4em] text-[#888] uppercase mt-1">
              Race Intelligence System
            </span>
          </div>
        </div>
        
        <div className="border border-[#e00016]/40 bg-[#e00016]/10 px-4 py-2 rounded flex items-center gap-3 backdrop-blur-sm shadow-[0_0_15px_rgba(224,0,22,0.1)]">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e00016] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#e00016]"></span>
          </div>
          <span className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#e0e0e0]">Live Telemetry</span>
        </div>
      </header>

      {/* Main Content (Center Left) */}
      <main className="relative z-20 px-12 flex flex-col justify-center flex-1">
        <div className="max-w-3xl">
          <p className="text-[#a0a0a0] tracking-[0.3em] text-xs font-bold mb-4 uppercase">
            Intelligence. Precision. <span className="text-[#e00016]">Victory.</span>
          </p>
          
          <h1 className="text-[8rem] font-black leading-[0.85] tracking-tighter mb-1 drop-shadow-2xl">
            RACE
          </h1>
          <h1 className="text-[7.5rem] font-black leading-[0.85] tracking-tighter text-[#e00016] drop-shadow-[0_0_30px_rgba(224,0,22,0.3)] mb-8">
            INTELLIGENCE
          </h1>
          
          <div className="flex items-center gap-4 mb-10">
            <div className="w-8 h-[2px] bg-[#e00016]" />
            <p className="text-[#e0e0e0] tracking-[0.3em] text-[11px] font-bold uppercase">
              Real-time. Explainable. Actionable.
            </p>
          </div>
          
          <div className="border-l-4 border-[#e00016] pl-6 mb-12">
            <p className="text-[#b0b0b0] text-lg font-light italic leading-relaxed max-w-lg">
              "Knowing you're slower doesn't help.<br />
              Knowing <strong className="text-[#e00016] font-black normal-case not-italic">why</strong> you're slower helps."
            </p>
          </div>

          <div className="flex items-center gap-8">
            <Link 
              href="/overview"
              className="group relative inline-flex items-center gap-4 border-2 border-[#e00016] bg-[#050505]/50 px-8 py-4 rounded-lg overflow-hidden backdrop-blur-md shadow-[0_0_20px_rgba(224,0,22,0.2)] transition-all hover:shadow-[0_0_40px_rgba(224,0,22,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#e00016]/20 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
              <span className="text-[13px] font-black tracking-widest uppercase relative z-10">
                Enter Command Center
              </span>
              <ArrowRight className="w-5 h-5 text-[#e00016] relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <div className="flex items-center gap-3 text-[#666]">
              <span className="text-[9px] tracking-[0.2em] font-bold uppercase">Scroll to explore</span>
              <div className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center">
                <ArrowDown className="w-3 h-3 animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info Bar */}
      <footer className="relative z-20 border-t border-[#e00016]/20 bg-gradient-to-r from-[#050505] via-[#0a0002] to-[#050505] pb-6 pt-8 backdrop-blur-xl">
        <div className="absolute top-0 left-12 w-3 h-[2px] bg-[#e00016]" />
        <div className="absolute top-0 right-12 w-3 h-[2px] bg-[#e00016]" />
        
        <div className="w-full px-12 flex items-center justify-between">
          
          {/* Race Starts In Block (Aggressive styling) */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-[#e00016] animate-pulse shadow-[0_0_8px_rgba(224,0,22,0.8)]" />
              <span className="text-[#e00016] text-[10px] tracking-[0.3em] font-black uppercase">Race Deployment In</span>
            </div>
            
            <div className="flex items-center gap-6 font-mono">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] leading-none">{timeLeft.days}</span>
                <span className="text-[8px] text-[#555] uppercase tracking-[0.3em] mt-1">DAYS</span>
              </div>
              <span className="text-2xl text-[#e00016] opacity-50 font-light pb-4">/</span>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] leading-none">{timeLeft.hours}</span>
                <span className="text-[8px] text-[#555] uppercase tracking-[0.3em] mt-1">HRS</span>
              </div>
              <span className="text-2xl text-[#e00016] opacity-50 font-light pb-4">/</span>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] leading-none">{timeLeft.minutes}</span>
                <span className="text-[8px] text-[#555] uppercase tracking-[0.3em] mt-1">MIN</span>
              </div>
              <span className="text-2xl text-[#e00016] opacity-50 font-light pb-4">/</span>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black text-[#e00016] tracking-tighter drop-shadow-[0_0_15px_rgba(224,0,22,0.8)] leading-none">{timeLeft.seconds}</span>
                <span className="text-[8px] text-[#e00016]/60 uppercase tracking-[0.3em] mt-1">SEC</span>
              </div>
            </div>
          </div>

          {/* Features - Aggressive layout properly distributed */}
          <div className="flex-1 flex items-center justify-around pl-16">
            {/* Feature 1 */}
            <div className="flex items-center gap-4 group cursor-pointer">
              <Activity className="w-6 h-6 text-[#e00016] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <div className="flex flex-col">
                <h4 className="text-[12px] font-black tracking-widest uppercase text-white group-hover:text-[#e00016] transition-colors">Live Telemetry</h4>
                <p className="text-[9px] tracking-[0.2em] text-[#555] uppercase">23Hz Data Stream</p>
              </div>
            </div>
            
            <div className="w-[1px] h-8 bg-[#333] rotate-12" />
            
            {/* Feature 2 */}
            <div className="flex items-center gap-4 group cursor-pointer">
              <Cpu className="w-6 h-6 text-[#e00016] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <div className="flex flex-col">
                <h4 className="text-[12px] font-black tracking-widest uppercase text-white group-hover:text-[#e00016] transition-colors">AI Agents</h4>
                <p className="text-[9px] tracking-[0.2em] text-[#555] uppercase">Real-time Analysis</p>
              </div>
            </div>
            
            <div className="w-[1px] h-8 bg-[#333] rotate-12" />
            
            {/* Feature 3 */}
            <div className="flex items-center gap-4 group cursor-pointer">
              <Flag className="w-6 h-6 text-[#e00016] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <div className="flex flex-col">
                <h4 className="text-[12px] font-black tracking-widest uppercase text-white group-hover:text-[#e00016] transition-colors">Strategy Engine</h4>
                <p className="text-[9px] tracking-[0.2em] text-[#555] uppercase">Race Winning Decisions</p>
              </div>
            </div>
            
            <div className="w-[1px] h-8 bg-[#333] rotate-12" />
            
            {/* Feature 4 */}
            <div className="flex items-center gap-4 group cursor-pointer">
              <TrendingUp className="w-6 h-6 text-[#e00016] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <div className="flex flex-col">
                <h4 className="text-[12px] font-black tracking-widest uppercase text-white group-hover:text-[#e00016] transition-colors">Predictive Insights</h4>
                <p className="text-[9px] tracking-[0.2em] text-[#555] uppercase">Future Scenarios</p>
              </div>
            </div>
          </div>
          
        </div>
      </footer>
      </section>

      {/* ----------------- MISSION BRIEFING & CHALLENGE SECTION ----------------- */}
      <section className="relative w-full bg-[#050505] border-t border-[#333] pt-24 pb-32 flex flex-col">
        {/* Unified Background Layer */}
        <div className="absolute top-0 left-0 right-0 h-[110vh] z-0 select-none pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent z-10 w-2/3" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] z-10" />
          <Image 
            src="/mission_car.png" 
            alt="Mission Briefing Car" 
            fill 
            className="object-cover object-top opacity-60 mix-blend-lighten"
            unoptimized
          />
        </div>

        <div className="relative z-20 w-full px-12 mb-12">
          {/* Left Content */}
          <div className="max-w-3xl">
            <span className="text-[#e00016] text-[10px] tracking-[0.3em] font-black uppercase mb-4 block">Mission Briefing</span>
            <h2 className="text-6xl md:text-7xl font-black leading-[0.9] tracking-tighter mb-8 text-white uppercase drop-shadow-2xl">
              The Intelligence <br/>Behind <span className="text-[#e00016]">Every Lap.</span>
            </h2>
            <p className="text-[#a0a0a0] text-sm tracking-wide leading-relaxed max-w-xl mb-8 border-l border-[#e00016] pl-6">
              AEROS-XAI unifies telemetry, driver state, strategy, and regulations into a single explainable intelligence engine. Detect issues earlier. Understand causes deeper. Make decisions faster.
            </p>
          </div>
        </div>

        {/* The Challenge Content (Now unified into the same section) */}
        <div className="relative z-20 w-full px-12">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-[#e00016] text-[10px] tracking-[0.3em] font-black uppercase mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#e00016] animate-pulse" />
                The Challenge
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#e00016]">
                Why Teams Lose Performance
              </h2>
            </div>
            <p className="text-[#888] text-[11px] tracking-widest uppercase max-w-sm text-right leading-relaxed">
              Race performance is influenced by multiple complex factors. Traditional systems analyze them separately. <br/>
              <strong className="text-[#e00016]">We connect them.</strong>
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {[
              { title: 'Vehicle', icon: Gauge, items: ['Tire degradation', 'Brake overheating', 'Fuel inefficiency', 'Powertrain issues'] },
              { title: 'Driver', icon: User, items: ['Fatigue', 'Stress', 'Hydration loss', 'Reduced reaction time'] },
              { title: 'Strategy', icon: Map, items: ['Missed pit window', 'Traffic exposure', 'Fuel planning', 'Tire selection'] },
              { title: 'Regulations', icon: Shield, items: ['Penalty risks', 'Safety car restrictions', 'Pit stop legality', 'Track limits'] }
            ].map((card, idx) => (
              <div key={idx} className="relative bg-[#050505]/80 backdrop-blur-xl border border-[#333] border-t-2 border-t-[#e00016] p-8 group hover:-translate-y-2 transition-all duration-500 overflow-hidden shadow-2xl">
                
                {/* Tech Accent Corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#e00016]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-[#e00016] shadow-[0_0_10px_#e00016] opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500" />
                
                <div className="flex items-center gap-5 mb-8 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#e00016] to-[#7a000c] flex items-center justify-center shadow-[0_0_15px_rgba(224,0,22,0.4)] group-hover:shadow-[0_0_25px_rgba(224,0,22,0.7)] transition-shadow duration-500">
                    <card.icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-sm font-black tracking-[0.2em] text-white uppercase">{card.title}</h3>
                </div>
                
                <ul className="space-y-4 relative z-10">
                  {card.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#888] group/item hover:text-white transition-colors cursor-default">
                      <div className="w-3 h-[2px] bg-[#e00016]/40 group-hover/item:bg-[#e00016] group-hover/item:w-6 transition-all duration-300" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- CONNECTED INTELLIGENCE SECTION ----------------- */}
      <section className="relative w-full min-h-screen bg-[#050505] py-32 flex items-center border-t border-[#333] overflow-hidden">
        
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          {/* A much lighter overlay so your bg.png is highly visible but text remains readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/60 to-[#050505]/80 z-10" />
          {/* Pointing to your specific png image at full opacity */}
          <div className="absolute inset-0 bg-[url('/bg.png')] bg-cover bg-center z-0" />
        </div>

        <div className="relative z-20 max-w-[90rem] mx-auto w-full px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Typography & Metrics */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[#e00016] text-[11px] tracking-[0.3em] font-black uppercase flex items-center gap-2">
                <div className="w-2 h-2 bg-[#e00016] animate-pulse" />
                03 Connected Intelligence
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#e00016]/50 to-transparent max-w-[120px]" />
            </div>

            <div className="mb-10">
              <h2 className="text-7xl md:text-[7rem] font-black tracking-tighter text-white leading-[0.85] drop-shadow-2xl">
                ONE PLATFORM.
              </h2>
              <h2 className="text-7xl md:text-[7rem] font-black tracking-tighter leading-[0.85] text-[#e00016] mt-3">
                FOUR LAYERS.
              </h2>
            </div>

            <p className="text-[#a0a0a0] text-base tracking-wide leading-relaxed max-w-lg mb-16 border-l-2 border-[#e00016]/30 pl-6">
              A unified operating layer for engineers. Each domain runs continuously, then shares evidence through the Intelligence Core before a recommendation reaches the pit wall.
            </p>

            <div className="flex items-center gap-16">
              <div className="group">
                <div className="text-5xl md:text-6xl font-black text-white mb-2 group-hover:text-[#e00016] transition-colors">2.8k</div>
                <div className="text-[11px] text-[#666] tracking-widest uppercase font-bold group-hover:text-[#aaa] transition-colors">Signals / Sec</div>
              </div>
              <div className="group">
                <div className="text-5xl md:text-6xl font-black text-white mb-2 group-hover:text-[#e00016] transition-colors">42ms</div>
                <div className="text-[11px] text-[#666] tracking-widest uppercase font-bold group-hover:text-[#aaa] transition-colors">Inference Latency</div>
              </div>
              <div className="group">
                <div className="text-5xl md:text-6xl font-black text-white mb-2 group-hover:text-[#e00016] transition-colors">91%</div>
                <div className="text-[11px] text-[#666] tracking-widest uppercase font-bold group-hover:text-[#aaa] transition-colors">Decision Confidence</div>
              </div>
            </div>
          </div>

          {/* Right Column: Radar Diagram */}
          <div className="relative w-full aspect-square flex items-center justify-center mt-12 lg:mt-0">
            {/* Concentric Circles */}
            <div className="absolute w-[50%] h-[50%] rounded-full border border-[#555] border-dashed opacity-50" />
            <div className="absolute w-[85%] h-[85%] rounded-full border border-[#555] border-dashed opacity-50" />
            
            {/* Diagonal Connecting Lines */}
            <div className="absolute w-[120%] h-[1px] bg-gradient-to-r from-transparent via-[#e00016]/60 to-transparent rotate-45" />
            <div className="absolute w-[120%] h-[1px] bg-gradient-to-r from-transparent via-[#e00016]/60 to-transparent -rotate-45" />

            {/* Core Center Node */}
            <div className="relative z-10 w-56 h-56 rounded-full border border-[#e00016] bg-[#050505]/90 backdrop-blur-md shadow-[0_0_40px_rgba(224,0,22,0.4)] flex flex-col items-center justify-center group cursor-pointer hover:shadow-[0_0_70px_rgba(224,0,22,0.7)] transition-all duration-700">
              <div className="absolute -inset-4 rounded-full border border-[#e00016]/40 animate-[spin_8s_linear_infinite]" />
              <div className="absolute -inset-8 rounded-full border border-[#e00016]/10 animate-[spin_12s_linear_infinite_reverse]" />
              
              <div className="text-xs text-[#e00016] font-bold tracking-widest mb-1">AEROS-XAI</div>
              <div className="text-5xl font-black text-white tracking-wider">CORE</div>
              <div className="text-[10px] text-[#888] tracking-[0.2em] mt-2 uppercase">IBM Granite</div>
            </div>

            {/* Outer Nodes */}
            <div className="absolute top-[5%] left-[2%] w-48 p-6 border-l-2 border-[#e00016] bg-black/40 backdrop-blur-md shadow-2xl group hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(224,0,22,0.3)] transition-all duration-500 cursor-pointer z-20">
              <div className="absolute inset-0 bg-gradient-to-r from-[#e00016]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-[#e00016] text-xs font-black mb-2 relative z-10">01</div>
              <div className="text-3xl font-black text-white tracking-wider mb-2 relative z-10">DRIVER</div>
              <div className="text-[10px] text-[#aaa] tracking-widest uppercase relative z-10">State Analysis</div>
            </div>

            <div className="absolute top-[5%] right-[2%] w-48 p-6 border-l-2 border-[#e00016] bg-black/40 backdrop-blur-md shadow-2xl group hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(224,0,22,0.3)] transition-all duration-500 cursor-pointer z-20">
              <div className="absolute inset-0 bg-gradient-to-r from-[#e00016]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-[#e00016] text-xs font-black mb-2 relative z-10">02</div>
              <div className="text-3xl font-black text-white tracking-wider mb-2 relative z-10">VEHICLE</div>
              <div className="text-[10px] text-[#aaa] tracking-widest uppercase relative z-10">Machine Health</div>
            </div>

            <div className="absolute bottom-[5%] left-[2%] w-48 p-6 border-l-2 border-[#e00016] bg-black/40 backdrop-blur-md shadow-2xl group hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(224,0,22,0.3)] transition-all duration-500 cursor-pointer z-20">
              <div className="absolute inset-0 bg-gradient-to-r from-[#e00016]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-[#e00016] text-xs font-black mb-2 relative z-10">03</div>
              <div className="text-3xl font-black text-white tracking-wider mb-2 relative z-10">STRATEGY</div>
              <div className="text-[10px] text-[#aaa] tracking-widest uppercase relative z-10">Race Model</div>
            </div>

            <div className="absolute bottom-[5%] right-[2%] w-48 p-6 border-l-2 border-[#e00016] bg-black/40 backdrop-blur-md shadow-2xl group hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(224,0,22,0.3)] transition-all duration-500 cursor-pointer z-20">
              <div className="absolute inset-0 bg-gradient-to-r from-[#e00016]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-[#e00016] text-xs font-black mb-2 relative z-10">04</div>
              <div className="text-3xl font-black text-white tracking-wider mb-2 relative z-10">RULES</div>
              <div className="text-[10px] text-[#aaa] tracking-widest uppercase relative z-10">FIA Validation</div>
            </div>
          </div>
        </div>
      </section>
      {/* ----------------- OUR SOLUTION SECTION ----------------- */}
      <section className="relative w-full min-h-screen bg-[#050505] border-t border-[#333] py-32 flex flex-col items-center">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-[#050505] z-10" />
          <Image 
            src="/solution_bg.png" 
            alt="Multi-Agent Architecture" 
            fill 
            className="object-cover object-center opacity-40 mix-blend-screen"
            unoptimized
          />
        </div>

        <div className="relative z-20 w-full px-12 max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-24">
            <span className="text-[#e00016] text-[10px] tracking-[0.3em] font-black uppercase mb-4 flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#e00016] animate-pulse" />
              Our Solution
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#e00016]">
              Multi-Agent Intelligence<br/>Architecture
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {/* 1. Vehicle Diagnostics Agent */}
            <div className="relative bg-[#050505]/80 backdrop-blur-xl border border-[#333] border-t-2 border-t-[#e00016] p-8 group hover:-translate-y-2 transition-all duration-500 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#e00016]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-[#e00016] shadow-[0_0_10px_#e00016] opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500" />
              
              <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-[#e00016] to-[#7a000c] flex items-center justify-center shadow-[0_0_15px_rgba(224,0,22,0.4)] group-hover:shadow-[0_0_25px_rgba(224,0,22,0.7)] transition-shadow duration-500">
                  <Activity className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-[0.2em] text-white uppercase">Vehicle Diagnostics</h3>
                  <span className="text-[9px] text-[#e00016] tracking-widest uppercase font-bold">Mechanical Intelligence</span>
                </div>
              </div>
              
              <div className="space-y-4 relative z-10">
                <span className="text-[10px] text-[#555] tracking-widest uppercase font-bold border-b border-[#333] pb-2 block mb-4">Processes</span>
                <div className="flex flex-wrap gap-2">
                  {['Tire Wear', 'Brake Analysis', 'Engine Health', 'Fuel Efficiency'].map((item, i) => (
                    <span key={i} className="text-[9px] font-bold uppercase tracking-widest text-[#a0a0a0] bg-[#111] border border-[#333] px-2 py-1 rounded-sm group-hover:border-[#e00016]/50 transition-colors">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Driver State Agent */}
            <div className="relative bg-[#050505]/80 backdrop-blur-xl border border-[#333] border-t-2 border-t-[#e00016] p-8 group hover:-translate-y-2 transition-all duration-500 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#e00016]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-[#e00016] shadow-[0_0_10px_#e00016] opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500" />
              
              <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-[#e00016] to-[#7a000c] flex items-center justify-center shadow-[0_0_15px_rgba(224,0,22,0.4)] group-hover:shadow-[0_0_25px_rgba(224,0,22,0.7)] transition-shadow duration-500">
                  <User className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-[0.2em] text-white uppercase">Driver State Agent</h3>
                  <span className="text-[9px] text-[#e00016] tracking-widest uppercase font-bold">Human Performance Intelligence</span>
                </div>
              </div>
              
              <div className="space-y-4 relative z-10">
                <span className="text-[10px] text-[#555] tracking-widest uppercase font-bold border-b border-[#333] pb-2 block mb-4">Processes</span>
                <div className="flex flex-wrap gap-2">
                  {['Fatigue Detection', 'Stress Analysis', 'Hydration', 'Physical Load'].map((item, i) => (
                    <span key={i} className="text-[9px] font-bold uppercase tracking-widest text-[#a0a0a0] bg-[#111] border border-[#333] px-2 py-1 rounded-sm group-hover:border-[#e00016]/50 transition-colors">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Performance Attribution Agent */}
            <div className="relative bg-[#050505]/80 backdrop-blur-xl border border-[#333] border-t-2 border-t-[#e00016] p-8 group hover:-translate-y-2 transition-all duration-500 overflow-hidden shadow-2xl lg:row-span-2">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#e00016]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-[#e00016] shadow-[0_0_10px_#e00016] opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500" />
              
              <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-[#e00016] to-[#7a000c] flex items-center justify-center shadow-[0_0_15px_rgba(224,0,22,0.4)] group-hover:shadow-[0_0_25px_rgba(224,0,22,0.7)] transition-shadow duration-500">
                  <BarChart2 className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-[0.2em] text-white uppercase">Performance Attribution</h3>
                  <span className="text-[9px] text-[#e00016] tracking-widest uppercase font-bold">Root Cause Intelligence</span>
                </div>
              </div>
              
              <div className="space-y-6 relative z-10">
                <div>
                  <span className="text-[10px] text-[#555] tracking-widest uppercase font-bold border-b border-[#333] pb-2 block mb-4">Determines</span>
                  <p className="text-xs font-bold text-[#ccc] tracking-widest uppercase">Why performance is being lost.</p>
                </div>
                
                <div className="bg-[#111] p-6 border border-[#333] rounded-sm group-hover:border-[#e00016]/30 transition-colors">
                  <span className="text-[9px] text-[#555] tracking-widest uppercase font-bold block mb-6 text-center">Live Attribution Example</span>
                  
                  <div className="space-y-5">
                    {/* Progress Bar 1 */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Driver Impact</span>
                        <span className="text-[10px] font-black text-[#e00016]">52%</span>
                      </div>
                      <div className="w-full h-1 bg-[#222] rounded-full overflow-hidden">
                        <div className="h-full bg-[#e00016] w-[52%] shadow-[0_0_10px_#e00016]" />
                      </div>
                    </div>
                    {/* Progress Bar 2 */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest">Vehicle Impact</span>
                        <span className="text-[10px] font-black text-white">35%</span>
                      </div>
                      <div className="w-full h-1 bg-[#222] rounded-full overflow-hidden">
                        <div className="h-full bg-[#666] w-[35%]" />
                      </div>
                    </div>
                    {/* Progress Bar 3 */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest">Track Impact</span>
                        <span className="text-[10px] font-black text-white">13%</span>
                      </div>
                      <div className="w-full h-1 bg-[#222] rounded-full overflow-hidden">
                        <div className="h-full bg-[#444] w-[13%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Race Context Agent */}
            <div className="relative bg-[#050505]/80 backdrop-blur-xl border border-[#333] border-t-2 border-t-[#e00016] p-8 group hover:-translate-y-2 transition-all duration-500 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#e00016]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-[#e00016] shadow-[0_0_10px_#e00016] opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500" />
              
              <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-[#e00016] to-[#7a000c] flex items-center justify-center shadow-[0_0_15px_rgba(224,0,22,0.4)] group-hover:shadow-[0_0_25px_rgba(224,0,22,0.7)] transition-shadow duration-500">
                  <Map className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-[0.2em] text-white uppercase">Race Context Agent</h3>
                  <span className="text-[9px] text-[#e00016] tracking-widest uppercase font-bold">Environmental Intelligence</span>
                </div>
              </div>
              
              <div className="space-y-4 relative z-10">
                <span className="text-[10px] text-[#555] tracking-widest uppercase font-bold border-b border-[#333] pb-2 block mb-4">Processes</span>
                <div className="flex flex-wrap gap-2">
                  {['Weather Analysis', 'Track Condition', 'Grip Monitoring', 'Sector Performance'].map((item, i) => (
                    <span key={i} className="text-[9px] font-bold uppercase tracking-widest text-[#a0a0a0] bg-[#111] border border-[#333] px-2 py-1 rounded-sm group-hover:border-[#e00016]/50 transition-colors">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Strategy Supervisor Agent */}
            <div className="relative bg-[#050505]/80 backdrop-blur-xl border border-[#333] border-t-2 border-t-[#e00016] p-8 group hover:-translate-y-2 transition-all duration-500 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#e00016]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-[#e00016] shadow-[0_0_10px_#e00016] opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500" />
              
              <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-[#e00016] to-[#7a000c] flex items-center justify-center shadow-[0_0_15px_rgba(224,0,22,0.4)] group-hover:shadow-[0_0_25px_rgba(224,0,22,0.7)] transition-shadow duration-500">
                  <Cpu className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-[0.2em] text-white uppercase">Strategy Supervisor</h3>
                  <span className="text-[9px] text-[#e00016] tracking-widest uppercase font-bold">IBM Granite Engine</span>
                </div>
              </div>
              
              <ul className="space-y-4 relative z-10">
                {['Agent Orchestration', 'Tactical Recommendation', 'Decision Synthesis'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#a0a0a0] group/item hover:text-white transition-colors cursor-default">
                    <div className="w-3 h-[2px] bg-[#e00016]/40 group-hover/item:bg-[#e00016] group-hover/item:w-6 transition-all duration-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- DATA INTEGRATION SECTION ----------------- */}
      <section className="relative w-full min-h-[80vh] bg-[#111] py-32 flex flex-col justify-center items-center border-t border-[#333] overflow-hidden">
        
        {/* ==================================================================================================== */}
        {/* BACKGROUND IMAGE SPACE: Add your local image to the /public folder and update the URL here           */}
        {/* ==================================================================================================== */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="w-full h-full bg-center bg-cover bg-no-repeat" style={{ backgroundImage: 'url("/your-bg-image.jpg")' }} />
          {/* Gradient overlay to ensure text remains readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#111] via-transparent to-[#111]" />
        </div>

        <div className="max-w-[90rem] mx-auto w-full px-8 md:px-16 z-20 relative">
          
          {/* Section Header */}
          <div className="mb-20 text-center">
            <span className="text-[#e00016] text-[11px] tracking-[0.3em] font-black uppercase flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 bg-[#e00016] animate-pulse" />
              05 Validated Data Integration
            </span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-none drop-shadow-2xl">
              Proven with <br/>
              <span className="text-transparent" style={{ WebkitTextStroke: '2px #e00016' }}>Real-World Datasets</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* OpenF1 API */}
            <div className="bg-[#050505]/80 backdrop-blur-xl border border-[#333] border-l-4 border-l-[#e00016] p-10 group hover:-translate-y-2 transition-transform duration-500 shadow-2xl">
              <div className="flex items-center gap-5 mb-6">
                <Database className="w-10 h-10 text-[#e00016]" />
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-wider">Historical API Streaming</h3>
                  <span className="text-[10px] text-[#e00016] uppercase tracking-[0.2em] font-bold">OpenF1 10Hz Telemetry</span>
                </div>
              </div>
              <p className="text-[#a0a0a0] text-sm leading-relaxed mb-6 font-bold italic">
                "Our replay engine actively streams real OpenF1 telemetry JSON files at exactly 10Hz, injecting authentic Speed, RPM, and Gear data into the dashboard in real-time."
              </p>
              <div className="flex flex-wrap gap-2">
                {['Live Speed', 'Live RPM', 'Live Gears', 'Throttle', 'Brake', '10Hz Stream Rate'].map(tag => (
                  <span key={tag} className="text-[9px] font-bold tracking-widest uppercase text-[#888] bg-[#111] border border-[#333] px-3 py-1.5 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* FastF1 */}
            <div className="bg-[#050505]/80 backdrop-blur-xl border border-[#333] border-l-4 border-l-[#e00016] p-10 group hover:-translate-y-2 transition-transform duration-500 shadow-2xl">
              <div className="flex items-center gap-5 mb-6">
                <TrendingUp className="w-10 h-10 text-[#e00016]" />
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-wider">Dynamic Physics Math</h3>
                  <span className="text-[10px] text-[#e00016] uppercase tracking-[0.2em] font-bold">Simulated Biometrics & Thermals</span>
                </div>
              </div>
              <p className="text-[#a0a0a0] text-sm leading-relaxed mb-6 font-bold italic">
                "Because APIs don't broadcast driver heart rate or exact tire wear, we run continuous mathematical physics models that react instantly to the real speed telemetry."
              </p>
              <div className="flex flex-wrap gap-2">
                {['Tire Wear %', 'Brake Temps', 'Driver HR (bpm)', 'Hydration', 'G-Force'].map(tag => (
                  <span key={tag} className="text-[9px] font-bold tracking-widest uppercase text-[#888] bg-[#111] border border-[#333] px-3 py-1.5 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Real Pit Strategy */}
            <div className="bg-[#050505]/80 backdrop-blur-xl border border-[#333] border-l-4 border-l-[#e00016] p-10 group hover:-translate-y-2 transition-transform duration-500 shadow-2xl">
              <div className="flex items-center gap-5 mb-6">
                <Network className="w-10 h-10 text-[#e00016]" />
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-wider">The Hybrid Architecture</h3>
                  <span className="text-[10px] text-[#e00016] uppercase tracking-[0.2em] font-bold">Seamless Data Merging</span>
                </div>
              </div>
              <p className="text-[#a0a0a0] text-sm leading-relaxed mb-6">
                A single React Context handles both datasets simultaneously. Real OpenF1 data overrides the mocked movement physics, while the math calculates the unseen analytics.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Unified React Context', 'State Overrides', 'Zero Latency Blend'].map(tag => (
                  <span key={tag} className="text-[9px] font-bold tracking-widest uppercase text-[#888] bg-[#111] border border-[#333] px-3 py-1.5 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Tire Degradation Dataset */}
            <div className="bg-[#050505]/80 backdrop-blur-xl border border-[#333] border-l-4 border-l-[#e00016] p-10 group hover:-translate-y-2 transition-transform duration-500 shadow-2xl">
              <div className="flex items-center gap-5 mb-6">
                <Activity className="w-10 h-10 text-[#e00016]" />
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-wider">Offline Demo Reliability</h3>
                  <span className="text-[10px] text-[#e00016] uppercase tracking-[0.2em] font-bold">100% Presentation Safe</span>
                </div>
              </div>
              <p className="text-[#a0a0a0] text-sm leading-relaxed mb-6">
                By downloading a specific high-speed snippet of Max Verstappen's telemetry into a local JSON file, we guarantee the live-demo will never fail due to API rate limits.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Locally Cached JSON', 'No Rate Limits', 'Max Verstappen Abu Dhabi'].map(tag => (
                  <span key={tag} className="text-[9px] font-bold tracking-widest uppercase text-[#888] bg-[#111] border border-[#333] px-3 py-1.5 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ----------------- FINAL CTA SECTION ----------------- */}
      <section className="relative w-full h-screen bg-[#050505] flex flex-col justify-center items-center">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#050505]/90 to-[#050505] z-10" />
          <Image 
            src="/final_bg.png" 
            alt="F1 Driver Helmet Reflection" 
            fill 
            className="object-cover object-center opacity-30 mix-blend-screen"
            unoptimized
          />
        </div>

        <div className="relative z-20 w-full px-12 flex flex-col items-center text-center">
          <h2 className="text-6xl md:text-8xl lg:text-[8rem] font-black leading-[0.9] tracking-tighter mb-4 text-white uppercase drop-shadow-2xl">
            Every lap tells <br/>a story.
          </h2>
          <h3 className="text-3xl md:text-5xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#e00016] to-[#ff4d4d] mb-16">
            AEROS-XAI Explains It.
          </h3>
          
          <Link href="/overview" className="group relative inline-flex items-center justify-center">
            {/* Outer Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#e00016] to-[#ff4d4d] rounded-sm blur opacity-40 group-hover:opacity-100 transition duration-500" />
            
            <div className="relative px-12 py-5 bg-[#050505] border border-[#e00016] rounded-sm flex items-center gap-4 transition-all duration-300 group-hover:bg-[#0a0002]">
              <span className="text-sm font-black tracking-[0.3em] text-white uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,1)] transition-all">
                Enter Command Center
              </span>
              <ArrowRight className="w-5 h-5 text-[#e00016] group-hover:translate-x-2 transition-transform duration-300" strokeWidth={3} />
            </div>
          </Link>
        </div>
      </section>

    </div>
  );
}
