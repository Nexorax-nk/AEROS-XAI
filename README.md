# AEROS-XAI (Adaptive Explainable Race Operations System)
### Real-Time Human–Machine Performance Intelligence Platform

> **May Innovation Challenge: Car Racing and AI**  
> *Drive AI beyond the finish line with IBM Granite and explainable performance intelligence.*

---

## 🏎️ The Core Problem: Performance Attribution

In modern Formula 1 and professional motorsport, race control rooms ingest **thousands of telemetry channels and biometric sensors every second**. 

The problem is not *data scarcity*. The problem is **Performance Attribution**. 

When lap times drop during a critical stint, engineers struggle to diagnose the root cause:
- **Is the Car responsible?** (Tire degradation, thermal brake runaway, battery state, engine mapping issues?)
- **Is the Driver responsible?** (Heart rate fatigue spikes, hydration drops, brake/throttle consistency drift, steering stress?)
- **Is the Track Environment responsible?** (Track temperature drop, microclimate drizzle, track grip coefficient evolution?)
- **Which factor is costing the most time?**
- **What corrective action will recover the performance fastest?**

By the time human engineers correlate these disparate metrics, valuable seconds are lost, costing positions, podiums, and race wins.

---

## 🛠️ What AEROS-XAI Does

**AEROS-XAI** continuously fuses multi-modal signals (Vehicle, Driver, and Environment) and feeds them into **5 Specialized Intelligence Agent Engines** to output **Explainable AI (XAI) Performance Attributions** and real-time strategist actions.

```
                          [ Telemetry Fusion Layer ]
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            ▼                          ▼                          ▼
   [ APEX Vehicle Agent ]     [ Cognitive Driver Agent ]    [ Race Context Agent ]
   - Powertrain Diagnostics   - Biometrics (ECG, SpO2)      - Track Grip & Temp
   - Tire Wear & Pressures    - Stress & Fatigue Index      - Microclimate Weather
   - Braking Temperatures     - Input Variances             - Sector Sector Times
            │                          │                          │
            └──────────────────────────┼──────────────────────────┘
                                       ▼
                       [ Performance Attribution Agent ] 
                           - Computes Delta Loss (+s/lap)
                           - Explains % Ratios (Driver vs Car vs Track)
                                       │
                                       ▼
                       [ IBM Granite Strategy Engine ]
                           - Formulates Natural Language Recommendations
                           - Simulates Stint Delta Recovery Gains
```

---

## 🧠 The Intelligence Architecture (The 5 Engines)

### 1. APEX Vehicle Intelligence Agent
- **Diagnostics**: Monitors Powertrain (RPM, Engine Temp, Fuel Flow, Battery ERS, Gearbox), Tires (FL, FR, RL, RR wear, pressure, temp), Brakes (4 corners temperature/wear), and Chassis (suspension travel/condition).
- **Core Attribution**: Isolates mechanical degradation (e.g. Rear Tire Degradation).

### 2. Cognitive Driver Intelligence Agent
- **Diagnostics**: Monitors Driver Biometrics (Heart Rate, Body Temp, SpO₂, Hydration Level), Cognitive Vitals (Stress, Fatigue), Physical Load (Lateral & Longitudinal G-Forces), and Driving Behavior (Braking, Steering, and Throttle Input Variance).
- **Core Attribution**: Tracks cardiovascular strain and throttle-application drift.

### 3. Race Context Agent
- **Diagnostics**: Monitors Environmental Weather shifts (Dry, Drizzle, Rain), Track Surface Temperature, Track Grip Coefficients, and Sector Timing profiles.
- **Core Attribution**: Isolates environmental grip depletion.

### 4. Performance Attribution Agent ⭐
- **The Core Feature**: Combines time-series inputs from the Vehicle, Driver, and Context engines to compute a unified **Lap-Time Loss Delta** (e.g., `+0.52 sec/lap`) and runs a SHAP-like attribution model to output the precise percentage of responsibility (e.g. *Driver: 57%, Vehicle: 29%, Track: 14%*).

### 5. Decision Intelligence Engine (Powered by IBM Granite)
- **Action Generation**: Recommends real-time strategy modifications (e.g., "Box for Hard Tyres", "Reduce Push Mode", "Increase Lift & Coast").
- **Expected Gains**: Models and displays target lap gains (e.g., `-0.35 sec/lap` recovery).

---

## 🔌 IBM AI Technology Integration

AEROS-XAI is built to fully leverage the IBM AI ecosystem:

### 1. IBM Granite (Strategic Reasoning)
- Granite serves as the central **Decision Intelligence Engine**.
- When the Performance Attribution Agent identifies critical anomalies (e.g. driver fatigue index > 60% + rear tire degradation accelerating), a prompt is dispatched to `ibm/granite-13b-instruct-v2` or `ibm/granite-20b-multilingual` via the **IBM WatsonX API**.
- Granite parses the multi-agent telemetry analysis and outputs natural language strategy adjustments with technical rationale (e.g., *"Shift braking bias +1.5% forward to reduce driver cognitive entry load and protect rear tyre compounds"*).

### 2. Docling (Race Strategy Knowledge Ingestion)
- We use **Docling** to ingest dense PDF/HTML regulatory documents, such as the *FIA Formula 1 Sporting Regulations* and the *Pirelli Tyre Technical Specifications*.
- Docling converts these files into clean, structured Markdown, extracting tabular data (like minimum tire pressures, tire stint limits, or track speed limits).
- This parsed knowledge is embedded directly into the context window of IBM Granite, ensuring all strategy recommendations comply with current sporting rules (e.g. preventing illegal tire pressure setups).

### 3. Langflow & Context Forge (Agent Orchestration)
- **Langflow** maps the pipeline routing of the 5 agents. It ensures telemetry data flows from the Fusion layer through the respective analytical engines before triggering the Granite API.
- **Context Forge** serves as the Model Context Protocol (MCP) server, fetching historical driver profiles (e.g. average heart rate thresholds) and circuit maps (Silverstone) to feed the agents.

---

## ⚡ Setup & Execution

AEROS-XAI is built using **Next.js 15, React 19, TypeScript, Tailwind CSS, Recharts, and Framer Motion**.

### Prerequisites
Ensure you have [Node.js](https://nodejs.org) (v18.x or later) installed.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/[your-org]/AEROS-XAI.git
   cd AEROS-XAI
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

### Connecting to IBM WatsonX (Optional)
Create a `.env.local` file in the root directory:
```env
WATSONX_APIKEY=your_ibm_cloud_apikey
WATSONX_PROJECT_ID=your_watsonx_project_id
WATSONX_MODEL_ID=ibm/granite-13b-instruct-v2
```
*If environment variables are omitted, AEROS-XAI automatically operates in **Simulation Fallback Mode**, mocking the WatsonX API parameters (latency, token usage, text formats) to ensure an out-of-the-box experience.*

### Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🎨 Premium UI & Interactive Features

1. **Telemetry Sliders**: Manually adjust Driver Fatigue, Driver Stress, Tire Wear multiplier, or Weather conditions. Watch the Explainable AI instantly re-attribute the percentage charts (Recharts) and calculate the delta loss.
2. **Dynamic Track Map**: An animated SVG vector path of Silverstone circuit. A blue dot tracks the car's real-time position, updating active corner segments (e.g., Maggotts & Becketts) and current sector splits.
3. **Execute Strategy**: Click the button to implement Granite's advice (like pitting for hard tyres or intermediate compound). The simulation will pause, enter the pits, fit new tyres, reset wear/thermals, and resume with restored performance!
