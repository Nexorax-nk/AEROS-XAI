import React from 'react';

interface CircularGaugeProps {
  value: number;
  max: number;
  label: string;
  color?: string;
}

export function CircularGauge({ value, max, label, color = '#ff003c' }: CircularGaugeProps) {
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  // Cap value to max so it doesn't overdraw the circle
  const safeValue = Math.min(value, max);
  const strokeDashoffset = circumference - (safeValue / max) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#0a0a0a] border border-[#1a1a1a] w-full">
      <div className="relative w-44 h-44 flex items-center justify-center">
        {/* Background Ring */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 150 150">
          <circle 
            cx="75" cy="75" r={radius} 
            fill="transparent" 
            stroke="#151515" 
            strokeWidth="6" 
          />
          {/* Active Glowing Ring */}
          <circle 
            cx="75" cy="75" r={radius} 
            fill="transparent" 
            stroke={color} 
            strokeWidth="6" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${color}90)` }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-black" style={{ color }}>{value.toFixed(1)}</span>
          <span className="text-[10px] text-[#555] uppercase tracking-widest font-bold mt-1">/ {max}</span>
        </div>
      </div>
      <span className="mt-4 text-xs font-bold uppercase tracking-widest text-[#888]">{label}</span>
    </div>
  );
}
