"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  getInitialTelemetryState, 
  simulateStep, 
  runAgents, 
  defaultSimConfig, 
  TelemetryState, 
  SimulationConfig, 
  AgentOutput 
} from "@/lib/simulation";
import { IBMGraniteStrategySupervisor } from '@/lib/mas/IBMGraniteStrategySupervisor';

interface TelemetryContextType {
  telemetry: TelemetryState;
  config: SimulationConfig;
  agentResults: AgentOutput;
  isInferencing: boolean;
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
  const [isInferencing, setIsInferencing] = useState<boolean>(false);

  // Replay Engine State
  const [replayData, setReplayData] = useState<any[]>([]);
  const replayIndexRef = useRef(0);
  const telemetryRef = useRef(telemetry);
  telemetryRef.current = telemetry;
  
  // MAS Supervisor Instance
  const supervisorRef = useRef(new IBMGraniteStrategySupervisor());

  // Fetch real OpenF1 Telemetry JSON
  useEffect(() => {
    fetch('/f1_live_telemetry_feed.json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setReplayData(data);
          console.log(`Loaded ${data.length} real telemetry frames from OpenF1.`);
        }
      })
      .catch(err => console.error("Error loading OpenF1 telemetry replay data:", err));
  }, []);

  // 1. FAST LOOP: Core Simulation Loop (10Hz to match OpenF1)
  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = 100; // 10Hz
    const elapsedSec = (intervalTime / 1000) * simSpeed;
    
    const timer = setInterval(() => {
      setTelemetry((prev) => {
        // Advance the mathematical simulation
        let nextState = simulateStep(prev, config, elapsedSec);
        
        // Inject REAL OpenF1 Telemetry data
        if (replayData.length > 0) {
          const frame = replayData[replayIndexRef.current];
          nextState = {
            ...nextState,
            rpm: frame.rpm ?? nextState.rpm,
            speed: frame.speed ?? nextState.speed,
            gear: frame.n_gear ?? nextState.gear,
          };
          replayIndexRef.current = (replayIndexRef.current + 1) % replayData.length;
        }
        return nextState;
      });
    }, intervalTime);
    
    return () => clearInterval(timer);
  }, [isPlaying, config, simSpeed, replayData]);

  // 2. SLOW LOOP: Cognitive MAS Engine (Asynchronous Polling every 3 seconds)
  useEffect(() => {
    if (!isPlaying) return;

    // Initial inference
    supervisorRef.current.inferStrategy(telemetryRef.current, config).then(setAgentResults);

    const aiTimer = setInterval(async () => {
      setIsInferencing(true);
      try {
        const newResults = await supervisorRef.current.inferStrategy(telemetryRef.current, config);
        setAgentResults(newResults);
      } catch (err) {
        console.error("IBM Granite MAS Inference Error:", err);
      } finally {
        setTimeout(() => setIsInferencing(false), 500); // Visual delay for UI blinking effect
      }
    }, 3000);
    
    return () => clearInterval(aiTimer);
  }, [isPlaying, config]);

  const resetSimulation = () => {
    setTelemetry(getInitialTelemetryState());
    setConfig(defaultSimConfig);
    replayIndexRef.current = 0;
  };

  return (
    <TelemetryContext.Provider value={{
      telemetry, config, agentResults, isInferencing, setConfig, setTelemetry, 
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
