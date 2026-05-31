import { TelemetryState, SimulationConfig, AgentOutput } from '../simulation';
import { 
  VehicleDiagnosticsAgent, 
  CognitiveDriverAgent, 
  RaceContextAgent, 
  PerformanceAttributionAgent 
} from './agents';

/**
 * ---------------------------------------------------------
 * AGENT 5: IBM Granite Strategy Supervisor
 * 
 * In a production MAS, this class initializes an IBM Granite LLM
 * via LangChain or @ibm-generative-ai/node-sdk, passes the state 
 * as context, and parses the natural language output into tactics.
 * 
 * For this offline demo, it implements the exact architectural 
 * interface but calculates the response deterministically to 
 * guarantee 0% failure rate during live presentations.
 * ---------------------------------------------------------
 */
export class IBMGraniteStrategySupervisor {
  private vehicleAgent: VehicleDiagnosticsAgent;
  private driverAgent: CognitiveDriverAgent;
  private contextAgent: RaceContextAgent;
  private attributionAgent: PerformanceAttributionAgent;

  constructor() {
    // Initialize the Sub-Agents
    this.vehicleAgent = new VehicleDiagnosticsAgent();
    this.driverAgent = new CognitiveDriverAgent();
    this.contextAgent = new RaceContextAgent();
    this.attributionAgent = new PerformanceAttributionAgent();
  }

  public async inferStrategy(state: TelemetryState, config: SimulationConfig): Promise<AgentOutput> {
    // 1. Parallel execution of specialized sub-agents
    const [vehicleState, driverState, contextState] = await Promise.all([
      this.vehicleAgent.analyze(state, config),
      this.driverAgent.analyze(state, config),
      this.contextAgent.analyze(state, config)
    ]);

    // 2. Synthesize performance loss
    const synthesis = await this.attributionAgent.analyze(
      vehicleState.timeLossSec, 
      driverState.timeLossSec, 
      contextState.timeLossSec
    );

    // 3. Supervisor Reasoning (IBM Granite Mock)
    let recommendationAction = "Maintain Strategy";
    let recommendationReason = "Driver stress and vehicle wear are within nominal ranges. Maintain current race pace and engine mapping.";
    let expectedGain = 0.0;
    let urgency: 'Low' | 'Medium' | 'High' = 'Low';

    if (state.weather !== 'Dry' && state.trackGrip < 0.75) {
      recommendationAction = "Box for Intermediate Tyres";
      recommendationReason = "Track grip has fallen below critical coefficient (0.75) due to wet surface evolution. Switching to Intermediates will restore lap time efficiency by ~3.2s.";
      expectedGain = 3.2;
      urgency = 'High';
    } else if (vehicleState.rearWearAvg > 50) {
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
      recommendationReason = `Biometrics indicate elevated fatigue (Index: ${Math.round(state.fatigue)}) and high stress. Adjusting engine maps and brake migration forwards reduces entry snaps and driver cognitive load by ~18%.`;
      expectedGain = 0.25;
      urgency = 'Medium';
    } else if (vehicleState.maxBrakeTemp > 780) {
      recommendationAction = "Increase Lift & Coast";
      recommendationReason = "Front brakes have crossed 780°C threshold. Implementing 80-meter lift-and-coast on straights cools front discs by 90°C within 2 laps and preserves pad condition.";
      expectedGain = 0.35;
      urgency = 'Medium';
    } else if (config.pushMode === 'Balanced' && vehicleState.rearWearAvg < 25 && state.fatigue < 30) {
      recommendationAction = "Enable Push Mode (Attack Windows)";
      recommendationReason = `Car systems are nominal (Vehicle Index: ${vehicleState.index}) and driver biometrics are excellent. Incrementing engine push will recover +0.31s/lap delta to competitors.`;
      expectedGain = 0.31;
      urgency = 'Low';
    }

    // 4. Future Risk Projections
    const futureRisks = [];
    if (vehicleState.rearWearAvg > 35) {
      futureRisks.push({
        riskType: "Rear Tire Blistering / Blowout",
        probability: Math.min(95, Math.round(20 + (vehicleState.rearWearAvg - 35) * 1.5)),
        timeframe: `${Math.max(2, Math.round(15 - (vehicleState.rearWearAvg - 35) * 0.25))} laps`,
        impact: "Severe grip loss or retirement"
      });
    } else {
      futureRisks.push({
        riskType: "Tire Tread Degradation",
        probability: Math.round(15 + vehicleState.frontWearAvg * 0.5),
        timeframe: "12 laps",
        impact: "Traction loss (+0.18s/lap)"
      });
    }

    if (vehicleState.maxBrakeTemp > 650) {
      futureRisks.push({
        riskType: "Brake Disc Glazing / Thermal Lockup",
        probability: Math.min(85, Math.round(30 + (vehicleState.maxBrakeTemp - 650) * 0.2)),
        timeframe: `${Math.max(3, Math.round(12 - (vehicleState.maxBrakeTemp - 650) * 0.02))} laps`,
        impact: "Stopping distance expansion (+0.3s/lap)"
      });
    }

    if (state.fatigue > 35) {
      futureRisks.push({
        riskType: "Driver Cognitive Fatigue Drop",
        probability: Math.min(90, Math.round(40 + (state.fatigue - 35) * 1.2)),
        timeframe: `${Math.max(1, Math.round(8 - (state.fatigue - 35) * 0.1))} laps`,
        impact: "Throttle/braking variance rise (+0.35s/lap)"
      });
    }

    // 5. Construct Final Output matching AgentOutput interface
    return {
      vehicleIndex: vehicleState.index,
      driverIndex: driverState.index,
      contextIndex: contextState.index,
      
      vehicleLoss: vehicleState.timeLossSec,
      driverLoss: driverState.timeLossSec,
      contextLoss: contextState.timeLossSec,
      totalLoss: synthesis.totalLoss,
      
      attribution: synthesis.attribution,
      
      primaryVehicleConcern: vehicleState.primaryConcern,
      primaryDriverConcern: driverState.primaryConcern,
      
      strategyRecommendation: {
        action: recommendationAction,
        reason: recommendationReason,
        expectedGain,
        urgency
      },
      
      futureRisks
    };
  }
}
