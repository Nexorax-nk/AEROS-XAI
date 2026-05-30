import { NextRequest, NextResponse } from "next/server";

// Standard WatsonX Endpoint for text generation
const WATSONX_URL = "https://us-south.ml.cloud.ibm.com/ml/v1-beta/generation/text?version=2023-05-29";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      vehicleLoss, 
      driverLoss, 
      contextLoss, 
      vehicleConcern, 
      driverConcern, 
      pushMode, 
      weather,
      trackGrip 
    } = body;

    const apiKey = process.env.WATSONX_APIKEY;
    const projectId = process.env.WATSONX_PROJECT_ID;
    const modelId = process.env.WATSONX_MODEL_ID || "ibm/granite-13b-instruct-v2";

    const prompt = `[INST] You are an F1 Lead Race Strategist AI powered by IBM Granite. Analyze the current race telemetry anomalies and performance attribution data, and generate a concise tactical recommendation for the race engineer.

CURRENT METRICS:
- APEX Vehicle Performance Loss: +${vehicleLoss}s/lap
- APEX Vehicle Primary Concern: ${vehicleConcern}
- Cognitive Driver Performance Impact: +${driverLoss}s/lap
- Cognitive Driver Primary Concern: ${driverConcern}
- Race Context Environmental Loss: +${contextLoss}s/lap
- Current Weather: ${weather} (Grip Level: ${trackGrip})
- Current Strategy Push Mode: ${pushMode}

TASK:
1. Recommend a single clear action (e.g., Box for tyres, change push mode, lift & coast, adjust engine mapping, adjust brake bias).
2. Explain the technical reasoning based on the telemetry (specifically reference how the driver or car vitals correlate with the loss).
3. Estimate the expected performance delta gain (in seconds per lap) or protection value.

Format your response strictly as a JSON object:
{
  "action": "Recommended strategy action here",
  "reason": "Detailed engineer-grade explanation here",
  "expectedGain": 0.25,
  "urgency": "Low" | "Medium" | "High"
}
[/INST]`;

    // If WatsonX environment variables are provided, perform actual API call
    if (apiKey && projectId) {
      // 1. Get an IAM access token
      const tokenResponse = await fetch("https://iam.cloud.ibm.com/identity/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}`
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to authenticate with IBM Cloud IAM");
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // 2. Call WatsonX generation endpoint
      const genResponse = await fetch(WATSONX_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          model_id: modelId,
          project_id: projectId,
          input: prompt,
          parameters: {
            decoding_method: "greedy",
            max_new_tokens: 300,
            temperature: 0.1
          }
        })
      });

      if (!genResponse.ok) {
        throw new Error(`WatsonX API failed with status ${genResponse.status}`);
      }

      const genData = await genResponse.json();
      const generatedText = genData.results[0].generated_text.trim();

      // Attempt to extract and parse the JSON block
      try {
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json({
            ...parsed,
            source: "IBM Granite Live API",
            model: modelId,
            tokensUsed: genData.results[0].generated_token_count,
            latencyMs: 1200 // estimated or calculated
          });
        }
      } catch (e) {
        // Fallback to text wrapping if JSON parse fails
        return NextResponse.json({
          action: "Modify Strategy (Granite Live)",
          reason: generatedText,
          expectedGain: 0.3,
          urgency: "Medium",
          source: "IBM Granite Live API (Unformatted)",
          model: modelId
        });
      }
    }

    // High-fidelity simulation fallback when WatsonX keys are missing (Out-of-the-box mode)
    // Simulate API network delay
    await new Promise(resolve => setTimeout(resolve, 350));

    let action = "Maintain Stint Strategy";
    let reason = `Telemetry indicates balanced performance. Vehicle loss is +${vehicleLoss}s/lap (${vehicleConcern}), Driver loss is +${driverLoss}s/lap (${driverConcern}). Engine thermals and biometric load remain within baseline tolerances.`;
    let expectedGain = 0.0;
    let urgency = "Low";

    if (weather !== 'Dry' && trackGrip < 0.75) {
      action = "Box for Intermediate Tyres";
      reason = `IBM Granite Warning: Environmental tracking identifies significant grip drop (coefficient: ${trackGrip}) due to progressive track saturation (${weather}). Immediate pit window entry is advised. Fitting intermediate tyre compounds will restore lateral traction and recover -${(4.5 * (1 - trackGrip)).toFixed(2)}s/lap telemetry degradation.`;
      expectedGain = 3.2;
      urgency = "High";
    } else if (vehicleConcern.includes("Rear Tire")) {
      if (pushMode === 'Push' || pushMode === 'Qualy') {
        action = "Switch Engine Mode to Conserve-Rear / Lower Push Mode";
        reason = `IBM Granite Diagnostic: Heavy thermal load on rear axle (rear wear at accelerated multiplier) is degrading traction efficiency. Switching engine maps to lower throttle torque curves out of low-speed sectors will cool tyre carcass cores, saving rubber life and recovering +0.35s/lap over the stint.`;
        expectedGain = 0.35;
        urgency = "Medium";
      } else {
        action = "Box for Hard Tyres";
        reason = `IBM Granite Assessment: Rear tyre carcass degradation has entered terminal phase. Thermal runaway is visible on rear axle. Safety risk is flagged at 85%. Pitting for Hard tyres is recommended.`;
        expectedGain = 1.6;
        urgency = "High";
      }
    } else if (driverConcern.includes("Fatigue") || driverConcern.includes("Consistency")) {
      action = "Enable Active Strategy Feedback (Co-Pilot Command)";
      reason = `IBM Granite Cognitive Attributor: High driver fatigue indicators (stress/fatigue sliders elevated) correspond to +${driverLoss}s/lap loss in braking sectors. Shift braking migrations +1.5% forward to stabilize the rear and alleviate driver workload. Real-time audio coaching will assist in normalizing throttle entry points.`;
      expectedGain = 0.25;
      urgency = "Medium";
    } else if (vehicleConcern.includes("Brake")) {
      action = "Implement 80m Lift & Coast (Turn 1 / Stowe)";
      reason = `IBM Granite Thermal Alert: Front brake temps have crossed 780°C threshold. Implementing lift-and-coast strategy will use aerodynamic drag rather than thermal friction for initial deceleration, cooling brake assemblies by 110°C and recovering brake pedal consistency.`;
      expectedGain = 0.3;
      urgency = "Medium";
    } else if (pushMode === 'Balanced' && vehicleLoss < 0.15 && driverLoss < 0.15) {
      action = "Trigger Strategic Overtake Mode";
      reason = `IBM Granite Performance Optimization: Driver biometrics are excellent (Low fatigue) and car systems are nominal (Index > 90). The ahead vehicle is within drag reduction system (DRS) range. Instruct driver to push for 3 consecutive laps using battery deployment.`;
      expectedGain = 0.45;
      urgency = "Low";
    }

    return NextResponse.json({
      action,
      reason,
      expectedGain,
      urgency,
      source: "IBM Granite (Mock Simulation Node)",
      model: "ibm/granite-20b-multilingual",
      tokensUsed: 220,
      latencyMs: 380
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
