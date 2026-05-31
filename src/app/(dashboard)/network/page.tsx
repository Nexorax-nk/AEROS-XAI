"use client";

import React, { useState, useEffect } from 'react';
import { Activity, Brain, Timer, GitBranch, ShieldAlert, Cpu, Database, Terminal, Server } from 'lucide-react';

// Dynamic Simulated Logs for the agents
const generateLogs = (agentType: string) => {
  const hash = Math.random().toString(16).substring(2, 8).toUpperCase();
  switch(agentType) {
    case 'telemetry': {
      const size = Math.floor(Math.random() * 400 + 100);
      const types = ['UDP Packet', 'CAN-BUS Frame', 'GPS Sync', 'Wheel Speed Delta', 'Suspension Load'];
      return `[INFO] ${types[Math.floor(Math.random() * types.length)]} 0x${hash} (${size}b) | Buffer: ${Math.floor(Math.random()*5)}%`;
    }
    case 'driver': {
      const hr = Math.floor(Math.random() * 20 + 150);
      const hrv = Math.floor(Math.random() * 10 + 20);
      const conf = Math.floor(Math.random() * 10 + 85);
      return `[DATA] Biometric stream ${hash} | HR: ${hr}bpm | HRV: ${hrv}ms | Conf: ${conf}%`;
    }
    case 'performance': {
      const sector = Math.floor(Math.random() * 3 + 1);
      const delta = (Math.random() * 0.4 - 0.2).toFixed(3);
      const deltaStr = parseFloat(delta) > 0 ? `+${delta}` : delta;
      return `[CALC] Micro-sector ${sector} eval | Delta: ${deltaStr}s | Grip: ${(Math.random()*0.2 + 0.8).toFixed(2)}`;
    }
    case 'strategy': {
      const iter = Math.floor(Math.random() * 5000 + 1000);
      const prob = (Math.random() * 20 + 60).toFixed(1);
      return `[SIM] Monte Carlo thread-${hash} | Iter: ${iter} | Win Prob: ${prob}%`;
    }
    case 'fia': {
      const turn = Math.floor(Math.random() * 20 + 1);
      const margin = (Math.random() * 15).toFixed(1);
      const isWarn = Math.random() > 0.8;
      const status = isWarn ? 'WARN: Limits Exceeded' : 'OK: Clear';
      return `[MONITOR] Track limits T${turn} check | Margin: ${margin}cm | ${status}`;
    }
    default: return `[SYS] Processing payload ${hash}...`;
  }
};

const agents = [
  {
    id: 'telemetry',
    name: 'Telemetry Agent',
    icon: Activity,
    color: '#00f0ff',
    status: 'ONLINE',
    load: 64,
    latency: 12,
    logType: 'telemetry'
  },
  {
    id: 'driver',
    name: 'Driver State Agent',
    icon: Brain,
    color: '#ff003c',
    status: 'PROCESSING',
    load: 82,
    latency: 24,
    logType: 'driver'
  },
  {
    id: 'performance',
    name: 'Performance Attribution',
    icon: Timer,
    color: '#f59e0b',
    status: 'ONLINE',
    load: 45,
    latency: 18,
    logType: 'performance'
  },
  {
    id: 'strategy',
    name: 'Strategy Agent',
    icon: GitBranch,
    color: '#8b5cf6',
    status: 'COMPUTING',
    load: 91,
    latency: 45,
    logType: 'strategy'
  },
  {
    id: 'fia',
    name: 'FIA Guardrails Agent',
    icon: ShieldAlert,
    color: '#e2e8f0',
    status: 'MONITORING',
    load: 22,
    latency: 8,
    logType: 'fia'
  }
];

export default function AgentNetworkPage() {
  const [logs, setLogs] = useState<Record<string, string[]>>({
    telemetry: [], driver: [], performance: [], strategy: [], fia: []
  });

  // Simulate asynchronous streaming logs
  useEffect(() => {
    // Tick very fast, but only update 1 or 2 random agents at a time to simulate real async logging
    const interval = setInterval(() => {
      setLogs(prev => {
        const next = { ...prev };
        const numUpdates = Math.floor(Math.random() * 2) + 1; // 1 or 2 updates per tick
        
        for (let i = 0; i < numUpdates; i++) {
          const agent = agents[Math.floor(Math.random() * agents.length)];
          const newLog = generateLogs(agent.logType);
          const timestamp = new Date().toISOString().substring(11, 23); // HH:mm:ss.SSS
          
          if (!next[agent.id]) next[agent.id] = [];
          // Prepend new log, keep only the last 4
          next[agent.id] = [`[${timestamp}] ${newLog}`, ...next[agent.id]].slice(0, 4);
        }
        return next;
      });
    }, 350); // 350ms tick rate makes the terminal feel extremely alive
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#050505] text-white p-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="mb-8 border-b border-[#1a1a1a] pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-widest text-white flex items-center gap-3">
            <Server className="w-8 h-8 text-[#ff003c]" />
            AGENT NETWORK
          </h1>
          <p className="text-[#666] uppercase tracking-widest text-[10px] font-bold mt-2">
            AEROS-XAI Distributed Computing Topology
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#00f0ff] font-mono text-[10px] tracking-widest bg-[#00f0ff]/10 px-3 py-1 rounded border border-[#00f0ff]/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
            NETWORK HEALTH: NOMINAL
          </span>
        </div>
      </div>

      {/* SVG Network Visualization */}
      <div className="w-full h-[300px] bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl mb-8 relative overflow-hidden flex items-center justify-center shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#00f0ff 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
        
        <svg viewBox="0 0 1000 300" className="w-full h-full absolute inset-0">
          <defs>
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff003c" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Connection Lines */}
          {[
            { x: 200, y: 70, c: '#00f0ff' },   // Telemetry
            { x: 800, y: 70, c: '#ff003c' },   // Driver
            { x: 150, y: 230, c: '#f59e0b' },  // Performance
            { x: 850, y: 230, c: '#8b5cf6' },  // Strategy
            { x: 500, y: 260, c: '#e2e8f0' }   // FIA
          ].map((target, i) => (
            <g key={i}>
              <line 
                x1="500" y1="130" 
                x2={target.x} y2={target.y} 
                stroke={target.c} 
                strokeWidth="1.5" 
                opacity="0.3" 
                strokeDasharray="4 4"
              />
              <circle r="3" fill={target.c} className="animate-pulse">
                <animate 
                  attributeName="cx" 
                  values={`500;${target.x}`} 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
                <animate 
                  attributeName="cy" 
                  values={`130;${target.y}`} 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              </circle>
            </g>
          ))}

          {/* Central AEROS CORE Node */}
          <circle cx="500" cy="130" r="80" fill="url(#coreGlow)" />
          <circle cx="500" cy="130" r="40" fill="#050505" stroke="#ff003c" strokeWidth="2" />
          <circle cx="500" cy="130" r="32" fill="none" stroke="#ff003c" strokeWidth="1" strokeDasharray="5 5" opacity="0.5" className="animate-spin-slow" />
          <text x="500" y="134" textAnchor="middle" fill="#ffffff" fontSize="12" fontFamily="monospace" fontWeight="900" letterSpacing="0.1em">CORE</text>

          {/* Agent Nodes */}
          {/* Telemetry */}
          <g transform="translate(200, 70)">
            <circle cx="0" cy="0" r="25" fill="#050505" stroke="#00f0ff" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="30" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.2" />
            <text x="0" y="45" textAnchor="middle" fill="#00f0ff" fontSize="10" fontFamily="monospace" fontWeight="700">TELEMETRY</text>
          </g>
          {/* Driver */}
          <g transform="translate(800, 70)">
            <circle cx="0" cy="0" r="25" fill="#050505" stroke="#ff003c" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="30" fill="none" stroke="#ff003c" strokeWidth="1" opacity="0.2" />
            <text x="0" y="45" textAnchor="middle" fill="#ff003c" fontSize="10" fontFamily="monospace" fontWeight="700">DRIVER</text>
          </g>
          {/* Performance */}
          <g transform="translate(150, 230)">
            <circle cx="0" cy="0" r="25" fill="#050505" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="30" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.2" />
            <text x="0" y="45" textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="700">PERFORMANCE</text>
          </g>
          {/* Strategy */}
          <g transform="translate(850, 230)">
            <circle cx="0" cy="0" r="25" fill="#050505" stroke="#8b5cf6" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="30" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.2" />
            <text x="0" y="45" textAnchor="middle" fill="#8b5cf6" fontSize="10" fontFamily="monospace" fontWeight="700">STRATEGY</text>
          </g>
          {/* FIA */}
          <g transform="translate(500, 260)">
            <circle cx="0" cy="0" r="25" fill="#050505" stroke="#e2e8f0" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="30" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.2" />
            <text x="0" y="45" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="monospace" fontWeight="700">FIA GUARD</text>
          </g>
        </svg>
      </div>

      {/* Agent Detail Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden flex flex-col relative group hover:border-[#333] transition-colors">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-[2px]" style={{ backgroundColor: agent.color, opacity: 0.5 }} />
            <div className="absolute top-0 left-0 w-1/3 h-[2px] shadow-[0_0_10px_currentColor]" style={{ backgroundColor: agent.color, color: agent.color }} />
            
            <div className="p-5 flex flex-col gap-4">
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#111] border border-[#222]" style={{ borderColor: `${agent.color}40` }}>
                    <agent.icon className="w-5 h-5" style={{ color: agent.color }} />
                  </div>
                  <div>
                    <h3 className="font-black tracking-widest text-[13px] uppercase" style={{ color: agent.color }}>
                      {agent.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: agent.color }} />
                      <span className="text-[9px] font-bold tracking-widest text-[#888] uppercase">{agent.status}</span>
                    </div>
                  </div>
                </div>
                <Database className="w-4 h-4 text-[#444]" />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 bg-[#050505] p-3 rounded-lg border border-[#111]">
                <div>
                  <span className="text-[8px] text-[#666] uppercase tracking-widest font-bold block mb-1">Compute Load</span>
                  <div className="flex items-end gap-1">
                    <span className="text-xl font-black leading-none">{agent.load}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1 bg-[#1a1a1a] rounded-full mt-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${agent.load}%`, backgroundColor: agent.color }} />
                  </div>
                </div>
                <div>
                  <span className="text-[8px] text-[#666] uppercase tracking-widest font-bold block mb-1">Response Time</span>
                  <div className="flex items-end gap-1">
                    <span className="text-xl font-black leading-none">{agent.latency}</span>
                    <span className="text-[10px] text-[#666] font-bold mb-0.5">ms</span>
                  </div>
                  {/* Mini sparkline mock */}
                  <div className="w-full h-1 bg-[#1a1a1a] rounded-full mt-2 overflow-hidden relative">
                    <div className="absolute right-0 top-0 h-full w-1/3 rounded-full opacity-50" style={{ backgroundColor: agent.color }} />
                  </div>
                </div>
              </div>

              {/* Terminal Logs */}
              <div className="bg-[#020202] border border-[#111] rounded-lg p-3 font-mono text-[10px] leading-relaxed relative overflow-hidden group-hover:border-[#222] transition-colors">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#111]">
                  <Terminal className="w-3 h-3 text-[#555]" />
                  <span className="text-[#555] font-bold tracking-wider">LIVE STDOUT</span>
                </div>
                <div className="text-[#888] h-[60px] flex flex-col justify-end">
                  {logs[agent.id]?.map((log, i) => (
                    <div key={i} className={`truncate ${i === 0 ? 'text-[#e0e0e0]' : `opacity-${100 - i * 25}`}`}>
                      <span style={{ color: agent.color, opacity: 0.7 }}>&gt;</span> {log}
                    </div>
                  ))}
                  {!logs[agent.id]?.length && <div>Initializing agent sequence...</div>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
