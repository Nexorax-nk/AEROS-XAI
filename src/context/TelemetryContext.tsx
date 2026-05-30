"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getInitialTelemetryState, 
  simulateStep, 
  runAgents, 
  defaultSimConfig, 
  TelemetryState, 
  SimulationConfig, 
  AgentOutput 
} from "@/lib/simulation";

interface TelemetryContextType {
  telemetry: TelemetryState;
  config: SimulationConfig;
  agentResults: AgentOutput;
  setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
  setTelemetry: React.Dispatch<React.SetStateAction<TelemetryState>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  simSpeed: number;
  setSimSpeed: React.Dispatch<React.SetStateAction<number>>;
  resetSimulation: () => void;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const [telemetry, setTelemetry] = useState<TelemetryState>(getInitialTelemetryState());
  const [config, setConfig] = useState<SimulationConfig>(defaultSimConfig);
  const [agentResults, setAgentResults] = useState<AgentOutput>(runAgents(getInitialTelemetryState(), defaultSimConfig));
  
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);

  // Core Simulation Loop
  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = 200; // ms between ticks
    const elapsedSec = (intervalTime / 1000) * simSpeed;
    
    const timer = setInterval(() => {
      setTelemetry((prev) => simulateStep(prev, config, elapsedSec));
    }, intervalTime);
    
    return () => clearInterval(timer);
  }, [isPlaying, config, simSpeed]);

  // Reactive Agent Calculations
  useEffect(() => {
    setAgentResults(runAgents(telemetry, config));
  }, [telemetry, config]);

  const resetSimulation = () => {
    setTelemetry(getInitialTelemetryState());
    setConfig(defaultSimConfig);
  };

  return (
    <TelemetryContext.Provider value={{
      telemetry, config, agentResults, setConfig, setTelemetry, 
      isPlaying, setIsPlaying, simSpeed, setSimSpeed, resetSimulation
    }}>
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  const context = useContext(TelemetryContext);
  if (context === undefined) {
    throw new Error("useTelemetry must be used within a TelemetryProvider");
  }
  return context;
}
