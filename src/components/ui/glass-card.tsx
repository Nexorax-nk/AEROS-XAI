import React from "react";

interface TelemetryPanelProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "red" | "white" | "gold";
}

export function GlassCard({ children, className = "", glowColor }: TelemetryPanelProps) {
  // We keep the component name GlassCard so we don't break existing imports across pages just yet,
  // but we redesign it completely.
  
  const borderColors = {
    red: "border-t-ferrari-red",
    white: "border-t-tech-white",
    gold: "border-t-warning-amber",
    default: "border-t-[#333333]"
  };

  const topBorderClass = glowColor ? borderColors[glowColor] : borderColors.default;

  return (
    <div 
      className={`
        bg-[#0c0c0c]
        border border-[#222222] border-t-2 ${topBorderClass}
        p-6 relative overflow-hidden
        rounded-none
        shadow-[0_4px_20px_rgba(0,0,0,0.8)]
        ${className}
      `}
    >
      {/* Harsh corner accent */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#444] opacity-50" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#444] opacity-50" />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
