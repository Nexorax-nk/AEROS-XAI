export interface CornerMetrics {
  fl: number;
  fr: number;
  rl: number;
  rr: number;
}

export interface TelemetryState {
  // Powertrain
  rpm: number;
  engineTemp: number;
  fuelFlow: number;
  batteryHealth: number;
  gearboxPerf: number;

  // Tires
  tireWear: CornerMetrics;
  tirePressure: CornerMetrics;
  tireTemp: CornerMetrics;

  // Brakes
  brakeTemp: CornerMetrics;
  brakeWear: CornerMetrics;

  // Chassis
  suspensionTravel: CornerMetrics;
  suspensionCondition: CornerMetrics;

  // Dynamics
  speed: number;
  gear: number;
  acceleration: number;

  // Biometrics
  heartRate: number;
  bodyTemp: number;
  spo2: number;
  hydration: number;

  // Cognitive State
  stress: number;
  fatigue: number;

  // Physical Load
  gForceLateral: number;
  gForceLongitudinal: number;

  // Driving Behavior
  brakingVariance: number;
  steeringVariance: number;
  throttleVariance: number;

  // Context
  weather: 'Dry' | 'Drizzle' | 'Rain';
  trackTemp: number;
  trackGrip: number;

  // Timing & Position
  lap: number;
  sector: number;
  distanceProgress: number; // 0 to 100% of lap
  sectorTimes: [number, number, number];
  currentLapTime: number;
  lastLapTime: number;
  lapDelta: number;
}

export interface AgentOutput {
  vehicleIndex: number;
  driverIndex: number;
  contextIndex: number;
  
  vehicleLoss: number; // sec/lap
  driverLoss: number; // sec/lap
  contextLoss: number; // sec/lap
  totalLoss: number; // sec/lap
  
  attribution: {
    driver: number; // percentage
    vehicle: number; // percentage
    track: number; // percentage
  };
  
  primaryVehicleConcern: string;
  primaryDriverConcern: string;
  
  strategyRecommendation: {
    action: string;
    reason: string;
    expectedGain: number;
    urgency: 'Low' | 'Medium' | 'High';
  };
  
  futureRisks: Array<{
    riskType: string;
    probability: number;
    timeframe: string;
    impact: string;
  }>;
}

// Track configuration (Silverstone Circuit representation)
export interface TrackSegment {
  name: string;
  startPct: number;
  endPct: number;
  type: 'straight' | 'corner';
  severity: number; // 0 for straight, 1-10 for corners
}

export const TRACK_SEGMENTS: TrackSegment[] = [
  { name: "Hamilton Straight", startPct: 0, endPct: 12, type: "straight", severity: 0 },
  { name: "Abbey Corner", startPct: 12, endPct: 18, type: "corner", severity: 6 },
  { name: "Farm Curve", startPct: 18, endPct: 24, type: "corner", severity: 4 },
  { name: "Wellington Straight", startPct: 24, endPct: 38, type: "straight", severity: 0 },
  { name: "Brooklands", startPct: 38, endPct: 44, type: "corner", severity: 7 },
  { name: "Luffield", startPct: 44, endPct: 52, type: "corner", severity: 8 },
  { name: "Woodcote", startPct: 52, endPct: 56, type: "corner", severity: 3 },
  { name: "National Straight", startPct: 56, endPct: 68, type: "straight", severity: 0 },
  { name: "Copse", startPct: 68, endPct: 74, type: "corner", severity: 9 },
  { name: "Maggotts & Becketts", startPct: 74, endPct: 84, type: "corner", severity: 10 },
  { name: "Hangar Straight", startPct: 84, endPct: 94, type: "straight", severity: 0 },
  { name: "Stowe", startPct: 94, endPct: 100, type: "corner", severity: 8 },
];

export function getTrackSegment(progress: number): TrackSegment {
  return TRACK_SEGMENTS.find(s => progress >= s.startPct && progress <= s.endPct) || TRACK_SEGMENTS[0];
}

// Initial baseline telemetry state
export function getInitialTelemetryState(): TelemetryState {
  return {
    rpm: 11500,
    engineTemp: 102.5,
    fuelFlow: 94.2,
    batteryHealth: 98.4,
    gearboxPerf: 99.8,
    tireWear: { fl: 12.4, fr: 14.2, rl: 28.5, rr: 30.1 }, // Starts with rear degradation
    tirePressure: { fl: 22.1, fr: 22.3, rl: 21.0, rr: 20.8 },
    tireTemp: { fl: 92, fr: 95, rl: 104, rr: 105 },
    brakeTemp: { fl: 410, fr: 425, rl: 380, rr: 390 },
    brakeWear: { fl: 8.2, fr: 8.5, rl: 6.8, rr: 7.0 },
    suspensionTravel: { fl: 14, fr: 15, rl: 12, rr: 11 },
    suspensionCondition: { fl: 99.1, fr: 99.2, rl: 98.8, rr: 98.7 },
    speed: 285,
    gear: 7,
    acceleration: 1.2,
    heartRate: 142,
    bodyTemp: 37.8,
    spo2: 97,
    hydration: 88,
    stress: 35,
    fatigue: 20,
    gForceLateral: 0.2,
    gForceLongitudinal: 0.8,
    brakingVariance: 2.1,
    steeringVariance: 1.8,
    throttleVariance: 1.5,
    weather: 'Dry',
    trackTemp: 38.5,
    trackGrip: 0.98,
    lap: 14,
    sector: 1,
    distanceProgress: 0,
    sectorTimes: [28.42, 35.15, 23.88],
    currentLapTime: 0,
    lastLapTime: 87.45,
    lapDelta: 0.05,
  };
}

// Simulation modifier configs (controlled by UI sliders)
export interface SimulationConfig {
  fatigueFactor: number; // 0 to 100
  tireWearRate: number; // 1 to 5 (multiplier)
  brakeWearRate: number; // 1 to 5 (multiplier)
  stressFactor: number; // 0 to 100
  weatherType: 'Dry' | 'Drizzle' | 'Rain';
  pushMode: 'Conserve' | 'Balanced' | 'Push' | 'Qualy';
  hydrationLossRate: number; // 1 to 5
}

export const defaultSimConfig: SimulationConfig = {
  fatigueFactor: 25,
  tireWearRate: 1.5,
  brakeWearRate: 1.0,
  stressFactor: 40,
  weatherType: 'Dry',
  pushMode: 'Balanced',
  hydrationLossRate: 1.5,
};

// Step the simulation forward (run on every timer tick)
export function simulateStep(
  currentState: TelemetryState,
  config: SimulationConfig,
  elapsedSec: number = 0.5
): TelemetryState {
  const next = { ...currentState };

  // 1. Advance position along track
  next.distanceProgress += (next.speed * elapsedSec) / (5891 * 3.6) * 100; // 5891m is Silverstone lap length
  if (next.distanceProgress >= 100) {
    next.distanceProgress = 0;
    next.lap += 1;
    next.lastLapTime = next.currentLapTime;
    next.currentLapTime = 0;
  }

  // 2. Track lap timing & sectors
  next.currentLapTime += elapsedSec;
  if (next.distanceProgress < 33.3) {
    next.sector = 1;
  } else if (next.distanceProgress < 66.6) {
    next.sector = 2;
  } else {
    next.sector = 3;
  }

  const segment = getTrackSegment(next.distanceProgress);

  // 3. Dynamic speed, gear, RPM, and G-Forces based on track segments
  if (segment.type === 'straight') {
    // Accelerating on straights
    const pushMaxSpeed = {
      'Conserve': 305,
      'Balanced': 325,
      'Push': 335,
      'Qualy': 342
    }[config.pushMode];
    
    if (next.speed < pushMaxSpeed) {
      next.speed += (15 + (config.pushMode === 'Push' ? 5 : 0)) * elapsedSec;
      next.acceleration = 2.4;
    } else {
      next.speed = pushMaxSpeed + Math.sin(next.currentLapTime) * 1.5;
      next.acceleration = 0.1;
    }
    
    // Gears on straight
    if (next.speed > 310) next.gear = 8;
    else if (next.speed > 270) next.gear = 7;
    else if (next.speed > 230) next.gear = 6;
    else next.gear = 5;
    
    next.rpm = 10000 + ((next.speed % 40) / 40) * 4000;
    next.gForceLateral = 0.1 + Math.sin(next.currentLapTime * 2) * 0.15;
    next.gForceLongitudinal = next.speed < pushMaxSpeed ? 1.5 : 0.0;
    
    // Brakes cool down
    next.brakeTemp.fl = Math.max(120, next.brakeTemp.fl - 18 * elapsedSec);
    next.brakeTemp.fr = Math.max(120, next.brakeTemp.fr - 18 * elapsedSec);
    next.brakeTemp.rl = Math.max(100, next.brakeTemp.rl - 15 * elapsedSec);
    next.brakeTemp.rr = Math.max(100, next.brakeTemp.rr - 15 * elapsedSec);

    // Tire temperatures stabilize
    const targetTireTemp = config.pushMode === 'Push' ? 98 : 94;
    next.tireTemp.fl = next.tireTemp.fl + (targetTireTemp - next.tireTemp.fl) * 0.1 * elapsedSec;
    next.tireTemp.fr = next.tireTemp.fr + (targetTireTemp - next.tireTemp.fr) * 0.1 * elapsedSec;
    next.tireTemp.rl = next.tireTemp.rl + (targetTireTemp - next.tireTemp.rl) * 0.1 * elapsedSec;
    next.tireTemp.rr = next.tireTemp.rr + (targetTireTemp - next.tireTemp.rr) * 0.1 * elapsedSec;
  } else {
    // Cornering
    const targetCornerSpeed = Math.max(80, 260 - segment.severity * 18);
    if (next.speed > targetCornerSpeed) {
      next.speed -= (35 + segment.severity * 8) * elapsedSec;
      next.acceleration = -3.8;
      next.gForceLongitudinal = -3.5;
    } else {
      next.speed = targetCornerSpeed + Math.sin(next.currentLapTime) * 3;
      next.acceleration = 0.2;
      next.gForceLongitudinal = 0.0;
    }

    // Gears in corners
    if (next.speed < 110) next.gear = 2;
    else if (next.speed < 150) next.gear = 3;
    else if (next.speed < 200) next.gear = 4;
    else if (next.speed < 250) next.gear = 5;
    else next.gear = 6;

    next.rpm = 9500 + ((next.speed % 30) / 30) * 3500;
    
    // G-Forces high lateral
    next.gForceLateral = (segment.severity * 0.45) + Math.sin(next.currentLapTime) * 0.2;
    
    // Brake temps spike
    const brakeHeatRate = segment.severity * 45 * elapsedSec;
    next.brakeTemp.fl = Math.min(950, next.brakeTemp.fl + brakeHeatRate * 1.1);
    next.brakeTemp.fr = Math.min(950, next.brakeTemp.fr + brakeHeatRate * 1.1);
    next.brakeTemp.rl = Math.min(850, next.brakeTemp.rl + brakeHeatRate * 0.9);
    next.brakeTemp.rr = Math.min(850, next.brakeTemp.rr + brakeHeatRate * 0.9);

    // Tire temperatures rise
    const tireHeatRate = segment.severity * 3 * elapsedSec * (1 + (config.pushMode === 'Push' ? 0.3 : 0));
    next.tireTemp.fl = Math.min(130, next.tireTemp.fl + tireHeatRate * 0.9);
    next.tireTemp.fr = Math.min(130, next.tireTemp.fr + tireHeatRate * 1.1); // Clockwise track puts pressure on FR
    next.tireTemp.rl = Math.min(130, next.tireTemp.rl + tireHeatRate * 0.95);
    next.tireTemp.rr = Math.min(130, next.tireTemp.rr + tireHeatRate * 1.25); // Rear tires slip under power out of corners
  }

  // 4. Update Engine, Fuel and Battery Health
  const engineHeatCoeff = config.pushMode === 'Push' ? 1.5 : (config.pushMode === 'Qualy' ? 2.0 : 1.0);
  next.engineTemp = 95 + (next.rpm / 15000) * 12 * engineHeatCoeff + Math.sin(next.currentLapTime) * 0.5;
  
  const baseFuelFlow = (next.rpm / 15000) * 105;
  next.fuelFlow = baseFuelFlow * (config.pushMode === 'Push' ? 1.12 : (config.pushMode === 'Conserve' ? 0.88 : 1.0));
  
  // Battery discharges during high acceleration and recharges under braking
  if (next.acceleration < 0) {
    next.batteryHealth = Math.min(100, next.batteryHealth + 0.1 * elapsedSec);
  } else {
    next.batteryHealth = Math.max(5, next.batteryHealth - 0.04 * elapsedSec * (config.pushMode === 'Push' ? 1.5 : 1.0));
  }
  
  next.gearboxPerf = Math.max(90, 100 - (next.lap * 0.03) - (currentState.brakeTemp.rl > 500 ? 0.5 : 0));

  // 5. Update Tires and Brakes Wear (influenced by slider rates)
  const wearMult = {
    'Conserve': 0.5,
    'Balanced': 1.0,
    'Push': 1.8,
    'Qualy': 2.5
  }[config.pushMode];

  const wearRateBase = 0.003 * config.tireWearRate * wearMult * elapsedSec;
  next.tireWear.fl = Math.min(100, next.tireWear.fl + wearRateBase * 0.9);
  next.tireWear.fr = Math.min(100, next.tireWear.fr + wearRateBase * 1.1);
  next.tireWear.rl = Math.min(100, next.tireWear.rl + wearRateBase * 1.35); // Rear wear accelerated
  next.tireWear.rr = Math.min(100, next.tireWear.rr + wearRateBase * 1.45); // Right rear wear fastest

  const brakeWearBase = 0.001 * config.brakeWearRate * wearMult * elapsedSec;
  next.brakeWear.fl = Math.min(100, next.brakeWear.fl + brakeWearBase * 1.0);
  next.brakeWear.fr = Math.min(100, next.brakeWear.fr + brakeWearBase * 1.0);
  next.brakeWear.rl = Math.min(100, next.brakeWear.rl + brakeWearBase * 0.8);
  next.brakeWear.rr = Math.min(100, next.brakeWear.rr + brakeWearBase * 0.8);

  // Tire pressures adapt dynamically based on tire temp
  next.tirePressure.fl = 20.0 + (next.tireTemp.fl / 90) * 2.2;
  next.tirePressure.fr = 20.0 + (next.tireTemp.fr / 90) * 2.2;
  next.tirePressure.rl = 19.5 + (next.tireTemp.rl / 90) * 2.1;
  next.tirePressure.rr = 19.5 + (next.tireTemp.rr / 90) * 2.1;

  // Suspension travel updates as dynamic oscillations
  next.suspensionTravel.fl = Math.max(2, Math.min(30, 15 + Math.sin(next.currentLapTime * 5) * 8 * (segment.type === 'corner' ? 1.5 : 0.5)));
  next.suspensionTravel.fr = Math.max(2, Math.min(30, 15 + Math.cos(next.currentLapTime * 5.2) * 8 * (segment.type === 'corner' ? 1.5 : 0.5)));
  next.suspensionTravel.rl = Math.max(2, Math.min(30, 14 + Math.sin(next.currentLapTime * 4.8) * 6 * (segment.type === 'corner' ? 1.4 : 0.5)));
  next.suspensionTravel.rr = Math.max(2, Math.min(30, 14 + Math.cos(next.currentLapTime * 4.6) * 6 * (segment.type === 'corner' ? 1.4 : 0.5)));

  next.suspensionCondition.fl = Math.max(60, 100 - (next.lap * 0.02) - (next.suspensionTravel.fl > 28 ? 0.1 : 0));
  next.suspensionCondition.fr = Math.max(60, 100 - (next.lap * 0.02) - (next.suspensionTravel.fr > 28 ? 0.1 : 0));
  next.suspensionCondition.rl = Math.max(60, 100 - (next.lap * 0.02) - (next.suspensionTravel.rl > 28 ? 0.1 : 0));
  next.suspensionCondition.rr = Math.max(60, 100 - (next.lap * 0.02) - (next.suspensionTravel.rr > 28 ? 0.1 : 0));

  // 6. Update Driver Vitals and Biometrics
  // Vitals react to fatigueFactor, stressFactor, pushMode, and G-Forces
  const rawStress = config.stressFactor;
  const rawFatigue = config.fatigueFactor;
  
  next.stress = rawStress + Math.sin(next.currentLapTime * 0.5) * 5;
  next.fatigue = rawFatigue + (next.currentLapTime / 90) * 0.8;
  
  // Heart rate rises with G-Forces, fatigue, stress, and push mode
  const targetHR = 110 + (next.gForceLateral * 12) + (next.stress * 0.55) + (next.fatigue * 0.25) + (config.pushMode === 'Push' ? 15 : 0);
  next.heartRate = Math.round(next.heartRate + (targetHR - next.heartRate) * 0.15);
  
  // Body temp climbs slowly with workload
  next.bodyTemp = 36.5 + (next.heartRate - 60) * 0.015;
  
  // SpO2 drops slightly under massive Gs/holding breath in heavy braking corners
  const spo2Drop = next.gForceLongitudinal < -3.0 ? 2 : 0;
  next.spo2 = Math.min(100, Math.max(92, 98 - spo2Drop - (next.fatigue * 0.03) + Math.round(Math.sin(next.currentLapTime) * 0.5)));

  // Hydration depletes based on slider hydration loss rate
  next.hydration = Math.max(20, next.hydration - 0.01 * config.hydrationLossRate * (next.heartRate / 100) * elapsedSec);

  // Driving variance (noise on throttle/brake/steering) increases with driver stress/fatigue
  const driverVarianceMult = 1.0 + (next.fatigue / 40) + (next.stress / 50) + (next.hydration < 50 ? 0.5 : 0);
  next.brakingVariance = Math.max(0.1, 1.5 * driverVarianceMult + Math.sin(next.currentLapTime * 0.3) * 0.5);
  next.steeringVariance = Math.max(0.1, 1.2 * driverVarianceMult + Math.cos(next.currentLapTime * 0.25) * 0.4);
  next.throttleVariance = Math.max(0.1, 1.0 * driverVarianceMult + Math.sin(next.currentLapTime * 0.4) * 0.3);

  // 7. Update Race Context (Weather slider, Track Grip)
  next.weather = config.weatherType;
  if (next.weather === 'Dry') {
    next.trackGrip = 0.98 - (next.trackTemp > 45 ? 0.03 : 0);
    next.trackTemp = 38.0 + Math.sin(next.currentLapTime * 0.01) * 2;
  } else if (next.weather === 'Drizzle') {
    next.trackGrip = Math.max(0.7, next.trackGrip - 0.03 * elapsedSec);
    next.trackTemp = Math.max(22, next.trackTemp - 0.2 * elapsedSec);
  } else {
    // Rain
    next.trackGrip = Math.max(0.52, next.trackGrip - 0.06 * elapsedSec);
    next.trackTemp = Math.max(18, next.trackTemp - 0.4 * elapsedSec);
  }

  // Lap delta comparison (sec/lap delta vs baseline)
  next.lapDelta = Math.sin(next.currentLapTime * 0.1) * 0.1;

  return next;
}

// Compute the 5 AI Agent Engine Calculations
export function runAgents(state: TelemetryState, config: SimulationConfig): AgentOutput {
  // --- Agent 1: APEX Vehicle Intelligence Agent ---
  // Evaluates wear and conditions, calculates an index (0-100)
  const rearWearAvg = (state.tireWear.rl + state.tireWear.rr) / 2;
  const frontWearAvg = (state.tireWear.fl + state.tireWear.fr) / 2;
  const maxBrakeTemp = Math.max(state.brakeTemp.fl, state.brakeTemp.fr, state.brakeTemp.rl, state.brakeTemp.rr);
  const minSuspensionCond = Math.min(state.suspensionCondition.fl, state.suspensionCondition.fr, state.suspensionCondition.rl, state.suspensionCondition.rr);
  
  let vehicleIndex = 100;
  vehicleIndex -= rearWearAvg * 0.4;
  vehicleIndex -= frontWearAvg * 0.2;
  if (maxBrakeTemp > 750) vehicleIndex -= (maxBrakeTemp - 750) * 0.1;
  if (state.engineTemp > 108) vehicleIndex -= (state.engineTemp - 108) * 1.5;
  if (minSuspensionCond < 95) vehicleIndex -= (95 - minSuspensionCond) * 0.8;
  vehicleIndex = Math.max(10, Math.round(vehicleIndex));

  // Primary concern assessment
  let primaryVehicleConcern = "None (Nominal)";
  if (rearWearAvg > 45) {
    primaryVehicleConcern = "Rear Tire Degradation";
  } else if (maxBrakeTemp > 800) {
    primaryVehicleConcern = "Brake Overheating (Front)";
  } else if (state.engineTemp > 110) {
    primaryVehicleConcern = "Engine Coolant Thermal Threshold";
  } else if (rearWearAvg > frontWearAvg + 15) {
    primaryVehicleConcern = "Rear Tire Thermal Slip";
  } else if (minSuspensionCond < 90) {
    primaryVehicleConcern = "Suspension Stress (Rear Right)";
  }

  // Performance Loss from Vehicle (sec/lap)
  // Request specified: Vehicle primary concern "Rear Tire Degradation" should show a loss of ~0.24s/lap
  // We'll scale vehicle loss so that typical rear wear (30-40%) outputs ~0.24s/lap
  const vehicleLoss = 0.05 + (rearWearAvg / 30) * 0.15 + (maxBrakeTemp > 700 ? 0.05 : 0) + (100 - state.gearboxPerf) * 0.01;
  const formattedVehicleLoss = Math.round(vehicleLoss * 100) / 100;


  // --- Agent 2: Cognitive Driver Intelligence Agent ---
  // Evaluates biometrics, fatigue, stress, variances
  let driverIndex = 100;
  driverIndex -= state.fatigue * 0.35;
  driverIndex -= state.stress * 0.2;
  if (state.hydration < 65) driverIndex -= (65 - state.hydration) * 0.4;
  if (state.heartRate > 165) driverIndex -= (state.heartRate - 165) * 0.3;
  if (state.brakingVariance > 3.0) driverIndex -= (state.brakingVariance - 3.0) * 3;
  driverIndex = Math.max(10, Math.round(driverIndex));

  let primaryDriverConcern = "None (Alert)";
  if (state.fatigue > 60) {
    primaryDriverConcern = "High Cognitive Fatigue";
  } else if (state.stress > 65) {
    primaryDriverConcern = "High Stress / Hyperventilation";
  } else if (state.hydration < 50) {
    primaryDriverConcern = "Severe Hydration Deficit";
  } else if (state.brakingVariance > 4.0) {
    primaryDriverConcern = "Braking Consistency Degradation";
  } else if (state.heartRate > 175) {
    primaryDriverConcern = "Cardiovascular Overload";
  }

  // Driver Performance Loss (sec/lap)
  // Request specified: Driver agent shows ~0.31 sec/lap impact
  // We'll scale so that baseline fatigue (20-40) + stress (35-50) yields ~0.31s/lap
  const driverLoss = 0.05 + (state.fatigue / 20) * 0.15 + (state.stress / 35) * 0.08 + (state.brakingVariance / 2.0) * 0.03;
  const formattedDriverLoss = Math.round(driverLoss * 100) / 100;


  // --- Agent 3: Race Context Agent ---
  // Evaluates weather, grip, sector timing vs baseline
  let contextIndex = Math.round(state.trackGrip * 100);
  
  // Track/Context Loss (sec/lap)
  // Grip of 0.98 is dry base. As it rains, grip drops, causing lap time loss
  const contextLoss = (0.98 - state.trackGrip) * 4.5 + (40 - state.trackTemp) * 0.01;
  const formattedContextLoss = Math.round(contextLoss * 100) / 100;


  // --- Agent 4: Performance Attribution Agent ---
  // Ingests individual losses, calculates percentages
  const totalLoss = formattedVehicleLoss + formattedDriverLoss + formattedContextLoss;
  const formattedTotalLoss = Math.round(totalLoss * 100) / 100;

  const totalSum = Math.max(0.01, formattedVehicleLoss + formattedDriverLoss + formattedContextLoss);
  const attribution = {
    vehicle: Math.round((formattedVehicleLoss / totalSum) * 100),
    driver: Math.round((formattedDriverLoss / totalSum) * 100),
    track: Math.round((formattedContextLoss / totalSum) * 100)
  };


  // --- Agent 5: Decision Intelligence Engine (Powered by Granite) ---
  // Formulates natural language strategic recommendations
  let recommendationAction = "Maintain Strategy";
  let recommendationReason = "Driver stress and vehicle wear are within nominal ranges. Maintain current race pace and engine mapping.";
  let expectedGain = 0.0;
  let urgency: 'Low' | 'Medium' | 'High' = 'Low';

  if (state.weather !== 'Dry' && state.trackGrip < 0.75) {
    recommendationAction = "Box for Intermediate Tyres";
    recommendationReason = "Track grip has fallen below critical coefficient (0.75) due to wet surface evolution. Switching to Intermediates will restore lap time efficiency by ~3.2s.";
    expectedGain = 3.2;
    urgency = 'High';
  } else if (state.tireWear.rl > 50 || state.tireWear.rr > 50) {
    if (config.pushMode === 'Push' || config.pushMode === 'Balanced') {
      recommendationAction = "Reduce Push Mode (Target: Conserve)";
      recommendationReason = "Rear tire wear has exceeded 50% thermal/physical limit. Reducing push levels protects the rubber carcass from blistering and mitigates tire failure risks.";
      expectedGain = 0.4;
      urgency = 'Medium';
    } else {
      recommendationAction = "Box for Hard Tyres";
      recommendationReason = "Rear tire wear has reached terminal safety limits. A pit stop is required to prevent blowout risk and restore traction.";
      expectedGain = 1.8;
      urgency = 'High';
    }
  } else if (state.fatigue > 55 || state.heartRate > 165) {
    recommendationAction = "Reduce Driver Push Level / Modify Brake Migration";
    recommendationReason = "Biometrics indicate elevated fatigue (Index: " + Math.round(state.fatigue) + ") and high stress. Adjusting engine maps and brake migration forwards reduces entry snaps and driver cognitive load by ~18%.";
    expectedGain = 0.25;
    urgency = 'Medium';
  } else if (state.brakeTemp.fl > 780 || state.brakeTemp.fr > 780) {
    recommendationAction = "Increase Lift & Coast";
    recommendationReason = "Front brakes have crossed 780°C threshold. Implementing 80-meter lift-and-coast on straights cools front discs by 90°C within 2 laps and preserves pad condition.";
    expectedGain = 0.35;
    urgency = 'Medium';
  } else if (config.pushMode === 'Balanced' && state.tireWear.rl < 25 && state.fatigue < 30) {
    recommendationAction = "Enable Push Mode (Attack Windows)";
    recommendationReason = "Car systems are nominal (Vehicle Index: " + vehicleIndex + ") and driver biometrics are excellent. Incrementing engine push will recover +0.31s/lap delta to competitors.";
    expectedGain = 0.31;
    urgency = 'Low';
  }

  // Generate Future Risk Projections
  const futureRisks: Array<{
    riskType: string;
    probability: number;
    timeframe: string;
    impact: string;
  }> = [];

  // Rear Tire Blowout Risk
  if (rearWearAvg > 35) {
    const prob = Math.round(20 + (rearWearAvg - 35) * 1.5);
    const laps = Math.max(2, Math.round(15 - (rearWearAvg - 35) * 0.25));
    futureRisks.push({
      riskType: "Rear Tire Blistering / Blowout",
      probability: Math.min(95, prob),
      timeframe: `${laps} laps`,
      impact: "Severe grip loss or retirement"
    });
  } else {
    futureRisks.push({
      riskType: "Tire Tread Degradation",
      probability: Math.round(15 + frontWearAvg * 0.5),
      timeframe: "12 laps",
      impact: "Traction loss (+0.18s/lap)"
    });
  }

  // Brake failure risk
  if (maxBrakeTemp > 650) {
    const prob = Math.round(30 + (maxBrakeTemp - 650) * 0.2);
    const laps = Math.max(3, Math.round(12 - (maxBrakeTemp - 650) * 0.02));
    futureRisks.push({
      riskType: "Brake Disc Glazing / Thermal Lockup",
      probability: Math.min(85, prob),
      timeframe: `${laps} laps`,
      impact: "Stopping distance expansion (+0.3s/lap)"
    });
  }

  // Driver Fatigue Risk
  if (state.fatigue > 35) {
    const prob = Math.round(40 + (state.fatigue - 35) * 1.2);
    const laps = Math.max(1, Math.round(8 - (state.fatigue - 35) * 0.1));
    futureRisks.push({
      riskType: "Driver Cognitive Fatigue Drop",
      probability: Math.min(90, prob),
      timeframe: `${laps} laps`,
      impact: "Throttle/braking variance rise (+0.35s/lap)"
    });
  }

  return {
    vehicleIndex,
    driverIndex,
    contextIndex,
    vehicleLoss: formattedVehicleLoss,
    driverLoss: formattedDriverLoss,
    contextLoss: formattedContextLoss,
    totalLoss: formattedTotalLoss,
    attribution,
    primaryVehicleConcern,
    primaryDriverConcern,
    strategyRecommendation: {
      action: recommendationAction,
      reason: recommendationReason,
      expectedGain,
      urgency
    },
    futureRisks
  };
}
