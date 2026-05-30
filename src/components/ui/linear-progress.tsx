import React from 'react';

export function LinearProgress({ value, max, label, color = '#00f0ff' }: { value: number, max: number, label: string, color?: string }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className="flex flex-col w-full bg-[#0a0a0a] border border-[#1a1a1a] p-5">
      <div className="flex justify-between items-end mb-3">
        <span className="text-[10px] uppercase font-bold text-[#888] tracking-widest">{label}</span>
        <span className="text-xl font-black text-white leading-none">{value.toFixed(1)}<span className="text-[10px] text-[#555] ml-1">/ {max}</span></span>
      </div>
      <div className="w-full h-1.5 bg-[#111] overflow-hidden">
        <div 
          className="h-full transition-all duration-700" 
          style={{ width: `${percentage}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}` }} 
        />
      </div>
    </div>
  );
}
