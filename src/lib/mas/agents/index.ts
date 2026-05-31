import { TelemetryState, SimulationConfig } from '../../simulation';

// ---------------------------------------------------------
// AGENT 1: APEX Vehicle Intelligence Agent
// Domain: Diagnostics, Thermals, Wear
// ---------------------------------------------------------
export class VehicleDiagnosticsAgent {
  public async analyze(state: TelemetryState, config: SimulationConfig) {
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

    let primaryConcern = "None (Nominal)";
    if (rearWearAvg > 45) primaryConcern = "Rear Tire Degradation";
    else if (maxBrakeTemp > 800) primaryConcern = "Brake Overheating (Front)";
    else if (state.engineTemp > 110) primaryConcern = "Engine Coolant Thermal Threshold";
    else if (rearWearAvg > frontWearAvg + 15) primaryConcern = "Rear Tire Thermal Slip";
    else if (minSuspensionCond < 90) primaryConcern = "Suspension Stress (Rear Right)";

    const vehicleLoss = 0.05 + (rearWearAvg / 30) * 0.15 + (maxBrakeTemp > 700 ? 0.05 : 0) + (100 - state.gearboxPerf) * 0.01;

    return {
      index: vehicleIndex,
      primaryConcern,
      timeLossSec: Math.round(vehicleLoss * 100) / 100,
      rearWearAvg,
      frontWearAvg,
      maxBrakeTemp
    };
  }
}

// ---------------------------------------------------------
// AGENT 2: Cognitive Driver Intelligence Agent
// Domain: Biometrics, Fatigue, Stress
// ---------------------------------------------------------
export class CognitiveDriverAgent {
  public async analyze(state: TelemetryState, config: SimulationConfig) {
    let driverIndex = 100;
    driverIndex -= state.fatigue * 0.35;
    driverIndex -= state.stress * 0.2;
    if (state.hydration < 65) driverIndex -= (65 - state.hydration) * 0.4;
    if (state.heartRate > 165) driverIndex -= (state.heartRate - 165) * 0.3;
    if (state.brakingVariance > 3.0) driverIndex -= (state.brakingVariance - 3.0) * 3;
    driverIndex = Math.max(10, Math.round(driverIndex));

    let primaryConcern = "None (Alert)";
    if (state.fatigue > 60) primaryConcern = "High Cognitive Fatigue";
    else if (state.stress > 65) primaryConcern = "High Stress / Hyperventilation";
    else if (state.hydration < 50) primaryConcern = "Severe Hydration Deficit";
    else if (state.brakingVariance > 4.0) primaryConcern = "Braking Consistency Degradation";
    else if (state.heartRate > 175) primaryConcern = "Cardiovascular Overload";

    const driverLoss = 0.05 + (state.fatigue / 20) * 0.15 + (state.stress / 35) * 0.08 + (state.brakingVariance / 2.0) * 0.03;

    return {
      index: driverIndex,
      primaryConcern,
      timeLossSec: Math.round(driverLoss * 100) / 100
    };
  }
}

// ---------------------------------------------------------
// AGENT 3: Race Context Agent
// Domain: Environment, Grip, Weather
// ---------------------------------------------------------
export class RaceContextAgent {
  public async analyze(state: TelemetryState, config: SimulationConfig) {
    const contextIndex = Math.round(state.trackGrip * 100);
    const contextLoss = (0.98 - state.trackGrip) * 4.5 + (40 - state.trackTemp) * 0.01;

    return {
      index: contextIndex,
      timeLossSec: Math.round(contextLoss * 100) / 100
    };
  }
}

// ---------------------------------------------------------
// AGENT 4: Performance Attribution Agent
// Domain: Loss synthesis
// ---------------------------------------------------------
export class PerformanceAttributionAgent {
  public async analyze(vehicleLoss: number, driverLoss: number, contextLoss: number) {
    const totalLoss = vehicleLoss + driverLoss + contextLoss;
    const formattedTotalLoss = Math.round(totalLoss * 100) / 100;
    
    const totalSum = Math.max(0.01, totalLoss);
    
    return {
      totalLoss: formattedTotalLoss,
      attribution: {
        vehicle: Math.round((vehicleLoss / totalSum) * 100),
        driver: Math.round((driverLoss / totalSum) * 100),
        track: Math.round((contextLoss / totalSum) * 100)
      }
    };
  }
}
