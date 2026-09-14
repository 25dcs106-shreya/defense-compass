# Defense Compass

Build a production-quality hackathon prototype called:

DEFCON-X

AI Defence Readiness & Threat Intelligence Copilot

Tagline:
From sensor anomaly to cyber threat to mission impact — one AI copilot for complete defence readiness.

This is an IBM AI Innovation hackathon prototype based on two connected defence challenges:

Mission Readiness & Predictive Maintenance Copilot

Threat Intelligence Correlation & Alert Prioritisation Assistant

Do NOT present this as two separate applications.

The product must feel like ONE unified defence intelligence and mission-readiness platform.

The central question the system answers is:

“Is this mission ready, what could go wrong, why is it risky, what will happen next, and what should we prioritize?”

The platform combines:

Physical asset health

HUMS sensor data

Predictive maintenance

Service records

Cybersecurity alerts

SIEM/EDR/network events

Threat intelligence

Intelligence reports

MITRE ATT&CK mapping

Mission context

Asset criticality

AI-powered correlation

Mission impact analysis

Commander-ready BLUF reports

Analyst investigation

What-if mission simulation

IMPORTANT:
This is a DEFENCE DECISION-SUPPORT prototype.
It must NOT autonomously control weapons, aircraft, vehicles, targeting systems, or operational military equipment.
All recommendations must be presented as decision support requiring human review.

VISUAL DESIGN

Create a premium defence-tech command-center interface.

The design must look like a real enterprise defence operations platform, NOT a normal SaaS dashboard.

Visual style:

Dark command-center theme

Near-black / deep navy background

Subtle glass panels

High contrast typography

Restrained military-tech aesthetic

Professional, serious, futuristic

Dense information architecture without becoming cluttered

Fine grid/background texture

Subtle glowing status indicators

Minimal gradients

No cartoonish illustrations

No excessive rounded cards

No generic AI robot graphics

No excessive neon

No stock images

Use a restrained status palette:

Green = ready / healthy

Amber = warning

Red = critical

Blue = informational

Gray = inactive

Typography:

Modern professional sans-serif

Strong hierarchy

Compact labels

Monospaced styling for IDs, timestamps, IPs, sensor values and technical information where appropriate.

The application should feel similar in quality to:

enterprise SOC platforms

aerospace mission-control dashboards

defence command systems

modern intelligence analysis platforms

Use responsive desktop-first design.

The primary demo should look excellent at 1440px desktop resolution.

APPLICATION STRUCTURE

Create these major pages:

Command Center

Mission Readiness

Asset Fleet

Asset Digital Twin

Predictive Maintenance

Threat Intelligence

Alert Correlation

Incident Investigation

Intelligence Fusion

Mission Impact

What-If Simulator

BLUF Reports

AI Copilot

Data Ingestion

System / Settings

Use a professional left sidebar navigation.

Sidebar:

DEFCON-X logo

COMMAND

Command Center

Mission Readiness

ASSETS

Asset Fleet

Digital Twin

Predictive Maintenance

SECURITY

Threat Intelligence

Alert Correlation

Incidents

INTELLIGENCE

Intelligence Fusion

Mission Impact

ANALYSIS

What-If Simulator

BLUF Reports

AI Copilot

DATA

Data Ingestion

SYSTEM

Settings

At the bottom:
System Status
● AI Engine Operational
● Data Pipeline Operational
● Threat Feed Connected

COMMAND CENTER

This is the primary landing page and most important demo screen.

Header:

DEFCON-X COMMAND CENTER

Mission:
FALCON SHIELD

Status:
CONDITIONAL READINESS

Show a large central readiness score:

78%

CONDITIONAL

Under it:

Physical Readiness
82%

Cyber Readiness
61%

Maintenance Readiness
74%

Intelligence Risk
89%

Operational Availability
81%

Use a large circular or radial readiness visualization.

Then display:

CRITICAL RISKS
2

HIGH RISKS
5

ASSETS AT RISK
4 / 12

PREDICTED FAILURES
3

ACTIVE INCIDENTS
2

TOP PRIORITIES

Show ranked priority list.

Example:

01
RADAR R-04
Potential Cyber Compromise
Risk: 91 / 100
Mission Impact: CRITICAL

02
AIRCRAFT A-17
Hydraulic Pump Failure Prediction
Failure Probability: 87%
Mission Impact: HIGH

03
VEHICLE V-32
Transmission Anomaly
Risk: 71 / 100
Mission Impact: HIGH

Each item must have:

severity indicator

asset

problem

score

reason

recommended action

“Investigate” button

MISSION ASSET SUMMARY

Create a table:

Asset
Type
Physical Health
Cyber Health
Maintenance
Mission Criticality
Readiness
Status

Example assets:

A-17
Aircraft
72%
91%
76%
95%
78%
WARNING

A-11
Aircraft
94%
97%
92%
89%
94%
READY

V-32
Vehicle
81%
88%
64%
82%
73%
WARNING

R-04
Radar
96%
43%
91%
98%
61%
CRITICAL

C-12
Communication
89%
76%
93%
94%
84%
READY

Allow filtering:

All

Critical

Warning

Ready

LIVE EVENT FEED

At the bottom/right create a live event stream.

Example:

19:32:14
CRITICAL
Radar R-04
Suspicious authentication detected

19:31:48
WARNING
Aircraft A-17
Hydraulic pressure anomaly

19:30:51
HIGH
Network Node C-12
Suspicious outbound connection

19:29:20
INFO
Threat Intelligence
IOC match updated

Use realistic timestamps and animated live indicators.

MISSION READINESS

Create a dedicated mission readiness page.

Header:

MISSION READINESS ASSESSMENT

Mission:
Falcon Shield

Mission Window:
06:00 – 14:00

Overall Readiness:
78%

Status:
CONDITIONAL

Show readiness dimensions:

Physical
82

Cyber
61

Maintenance
74

Intelligence
89

Availability
81

Then show:

MISSION DEPENDENCIES

Aircraft
8 / 10 Ready

Vehicles
14 / 15 Ready

Radar
3 / 4 Ready

Communication
5 / 5 Ready

Logistics
9 / 10 Ready

Create a dependency graph showing:

Mission
↓
Air Surveillance
↓
Radar R-04
↓
Communication C-12

and:

Mission
↓
Air Operations
↓
Aircraft A-17

Clicking an asset should open its details.

ASSET FLEET

Create a professional fleet-management page.

Asset categories:

Aircraft
Vehicles
Radar
Communication
Fuel Systems
Power Systems
Other Mission Equipment

Display cards/table containing:

Asset ID
Asset Name
Type
Location
Health
Cyber Risk
Maintenance
Mission Criticality
Readiness
Status

Example:

A-17
Falcon Aircraft
Aircraft
Hangar 02
72%
21%
76%
95%
78%
WARNING

R-04
Long Range Radar
Radar
Sector 04
96%
89%
91%
98%
61%
CRITICAL

Provide:

Search

Filter

Sort

Status filtering

Type filtering

ASSET DIGITAL TWIN

When an asset is selected, create a detailed digital-twin view.

Example:

AIRCRAFT A-17

STATUS:
WARNING

READINESS:
78%

HEALTH:
72%

Show technical metrics:

Engine Temperature
87°C

Vibration
4.7 mm/s

Hydraulic Pressure
162 bar

RPM
2,940

Fuel Consumption
+8.2%

Operating Hours
1,824

Flight Hours
1,241

Last Service
18 days ago

Next Scheduled Service
12 days

SENSOR GRAPH

Create interactive charts for:

Temperature

Vibration

Pressure

RPM

Fuel consumption

Show normal operating range and anomalous values.

Highlight anomalies visually.

Example:

Normal vibration:
2.1–2.8 mm/s

Current:
4.7 mm/s

Anomaly:
HIGH

AI ASSET ANALYSIS

Show:

AI HEALTH ASSESSMENT

“The asset is currently operational but shows increasing vibration and hydraulic-pressure instability. The pattern is consistent with early-stage hydraulic pump degradation.”

Confidence:
89%

Then show:

PREDICTED COMPONENT RISK

Hydraulic Pump
87%

Engine Bearing
71%

Brake Assembly
34%

PREDICTIVE MAINTENANCE

Create a full predictive maintenance dashboard.

Header:

PREDICTIVE MAINTENANCE

Show:

Predicted Failures
3

Critical Maintenance
2

Due Soon
5

Potential Downtime Avoided
18.4 hrs

Create a maintenance priority queue.

Priority 1:

AIRCRAFT A-17
Component:
Hydraulic Pump

Failure Probability:
87%

Predicted Failure Window:
3–7 days

Next Mission:
48 hours

Mission Impact:
CRITICAL

Recommended:
Immediate inspection/replacement

Reasons:

Pressure fluctuations

Increased vibration

Temperature anomaly

Maintenance history

Similar historical failure pattern

Priority 2:

VEHICLE V-32
Transmission

Failure probability:
69%

Priority 3:

AIRCRAFT A-11
Engine Bearing

Failure probability:
42%

Include buttons:

View Evidence

View Service History

Create Maintenance Recommendation

Simulate Delay

THREAT INTELLIGENCE

Create a threat-intelligence dashboard.

Show:

Active Threats
12

Critical
3

High
5

Medium
4

Threat Actors
7

IOCs
143

MITRE Techniques
28

Create threat feed cards.

Example:

THREAT ACTOR:
APT-X7

Confidence:
87%

Associated Techniques:
T1078
T1059.001
T1003

Affected Assets:
R-04
C-12

Threat Level:
CRITICAL

ALERT CORRELATION

This is one of the MOST IMPORTANT features.

The UI must visually demonstrate:

THOUSANDS OF ALERTS
↓
NORMALIZATION
↓
CORRELATION
↓
FALSE POSITIVE REDUCTION
↓
INCIDENT CLUSTERS
↓
PRIORITIZED THREATS

Create a metric section:

Raw Alerts
2,847

After Deduplication
1,943

Correlated Events
421

Potential Incidents
37

Critical Incidents
4

Then create correlated incident cards.

Example:

INCIDENT #INC-042

Potential Credential Compromise

5 correlated alerts

Affected Asset:
Radar R-04

Threat Score:
91 / 100

Confidence:
91%

Timeline:
10:01 → 10:11

Evidence:
✓ Failed authentication
✓ Successful unusual login
✓ PowerShell execution
✓ Credential access
✓ Suspicious external connection

MITRE:
T1078
T1059.001
T1003

Button:
INVESTIGATE

CORRELATION ENGINE

Implement realistic frontend logic for correlation.

Events should be correlated using combinations of:

asset ID

user

source IP

destination IP

domain

timestamp proximity

process

IOC

technique

location

event type

For the demo, events within a configurable time window and sharing meaningful entities should be grouped into incidents.

Show a visual explanation:

5 ALERTS
↓
Same Asset
+
Same User
+
11-minute Window
+
Related Techniques
↓
1 CORRELATED INCIDENT

Include:

CORRELATION CONFIDENCE
94%

INCIDENT INVESTIGATION

Create a detailed incident investigation page.

Header:

INCIDENT #INC-042

Potential Credential Compromise

Severity:
CRITICAL

Confidence:
91%

Affected Asset:
Radar R-04

First Seen:
10:01

Latest Event:
10:11

Create a horizontal/vertical timeline:

10:01
Failed authentication

↓
10:04
Successful unusual login

↓
10:06
PowerShell execution

↓
10:08
Credential-access indicator

↓
10:11
Suspicious outbound connection

Then show:

ATTACK CHAIN

Initial Access
✓

Credential Access
✓

Execution
✓

Persistence
?

Discovery
?

Lateral Movement
?

Command & Control
✓

Impact
?

MITRE ATT&CK

Map observed behavior to:

T1078 — Valid Accounts
T1059.001 — PowerShell
T1003 — OS Credential Dumping

Each technique should have:

technique ID

name

evidence

confidence

AI INCIDENT EXPLANATION

Create an AI explanation panel.

WHY IS THIS CRITICAL?

The affected radar is mission-critical.

Valid-account activity was detected.

PowerShell execution followed authentication.

Credential-access indicators were observed.

Suspicious external communication occurred.

Multiple events occurred within a short time window.

Confidence:
91%

Then:

RECOMMENDED INVESTIGATION

Validate the affected account.

Review endpoint activity.

Inspect outbound connections.

Check for related assets.

Escalate if lateral movement is confirmed.

IMPORTANT:
These are recommendations only and require analyst confirmation.

INTELLIGENCE FUSION

This is a major innovation feature.

Create a graph visualization connecting:

Threat Actor
↓
IOC
↓
Cyber Event
↓
Asset
↓
Component
↓
Mission
↓
Mission Impact

Example:

APT-X7
↓
Malicious IP
↓
Suspicious connection
↓
Radar R-04
↓
Communication subsystem
↓
Falcon Shield
↓
Reduced surveillance capability

Allow nodes to be clicked.

Show relationship confidence.

Create a panel:

CROSS-DOMAIN CORRELATION

Cyber anomaly:
High

Physical anomaly:
Medium

Intelligence indicator:
High

Combined confidence:
91%

Assessment:
“Multiple independent indicators suggest elevated risk to Radar R-04.”

MISSION IMPACT ENGINE

THIS IS THE CENTRAL DIFFERENTIATOR OF THE PRODUCT.

Create a dedicated page showing how threats and maintenance problems affect missions.

For each incident:

Event
↓
Affected Asset
↓
Asset Criticality
↓
Mission Dependency
↓
Operational Impact
↓
Mission Readiness

Example:

Radar R-04
Cyber Risk:
91

Mission Criticality:
98

Mission:
Falcon Shield

Operational Function:
Air Surveillance

Potential Impact:
Reduced surveillance coverage

Mission Readiness Impact:
-9%

Create a visual relationship graph.

UNIFIED RISK ENGINE

Create a transparent risk calculation interface.

Risk should NOT be generated randomly by the AI.

Use deterministic/demo logic combining:

Threat Severity
Asset Criticality
IOC Confidence
Attack Chain Evidence
Recurrence
Physical Health
Maintenance Risk
Mission Dependency
Operational Availability

Normalize final score to 0–100.

Example:

Radar R-04:

Cyber Risk
89

Physical Risk
12

Maintenance Risk
21

Mission Criticality
98

Final Mission Risk
91

Show a “WHY?” button.

When clicked, show the decision trace.

AI DECISION TRACE

Create a powerful explainability panel.

Title:

WHY DID DEFCON-X MARK THIS CRITICAL?

Show:

INPUT DATA
↓
5 Related Security Alerts

CORRELATION
↓
Same Asset + Same User + 11 Minute Window

THREAT INTELLIGENCE
↓
IOC Match

MITRE ANALYSIS
↓
T1078 + T1059.001 + T1003

ASSET CRITICALITY
↓
Mission-Critical Radar

MISSION DEPENDENCY
↓
Required for Air Surveillance

FINAL RISK
↓
91 / 100

This should look like a technical AI reasoning trace but MUST NOT claim to expose hidden chain-of-thought.

Use labels such as:
“Evidence Trace”
“Decision Factors”
“Risk Factors”

WHAT-IF MISSION SIMULATOR

Create an advanced simulation page.

Header:

MISSION SCENARIO SIMULATOR

Mission:
Falcon Shield

Current Readiness:
78%

Allow users to simulate:

Asset offline

Maintenance delayed

Threat escalated

Radar unavailable

Aircraft unavailable

Communication degraded

Cyber incident contained

Backup asset deployed

Example:

Scenario:
Take Radar R-04 Offline

Current:
78%

Projected:
64%

Affected Missions:
2

Affected Functions:
Air Surveillance

Then:

Deploy Backup Radar R-07

Projected:
82%

Status:
MITIGATION SUCCESSFUL

Use sliders/dropdowns/buttons for scenario controls.

Also support:

“What if A-17 maintenance is delayed by 48 hours?”

Output:

Failure probability:
87% → 93%

Readiness:
78% → 71%

Recommendation:
Do not delay maintenance.

Clearly label these as simulated projections.

BLUF REPORT GENERATOR

Create a commander-ready BLUF page.

Button:

GENERATE BLUF

Output:

BOTTOM LINE UP FRONT

Mission Falcon Shield is currently CONDITIONALLY READY at 78%.

Two critical risks require immediate attention:
Radar R-04 shows indicators of potential cyber compromise, while Aircraft A-17 has an 87% predicted hydraulic pump failure probability before the mission window.

Recommended priorities:

Investigate Radar R-04.

Inspect A-17 hydraulic system.

Recalculate readiness after mitigation.

Confidence:
91%

Include buttons:

Copy

Export PDF

Export Report

Share internally

Make the BLUF concise and executive-friendly.

AI COPILOT

Create a professional AI assistant.

Name:

DEFCON-X COPILOT

The copilot should answer questions using application data and demo knowledge.

Example questions:

“Why is mission readiness only 78%?”

“Which asset should we prioritize?”

“What are the top three threats?”

“Why is Radar R-04 critical?”

“Which components are predicted to fail?”

“What happens if A-17 is unavailable?”

“Show me all assets affected by active cyber incidents.”

“Generate a commander BLUF.”

“What MITRE techniques are involved in INC-042?”

“Which risks affect Falcon Shield?”

The assistant should respond with:

direct answer

relevant evidence

affected assets

risk score

recommendation

confidence

Do not make it behave like a generic chatbot.

It should feel like an operational decision-support copilot.

RAG / KNOWLEDGE BASE

Create a knowledge-base interface.

Supported demo documents:

Maintenance manuals

Service records

SOPs

Incident response procedures

Threat reports

Asset specifications

Intelligence reports

Create:

KNOWLEDGE BASE

Documents:
127

Indexed:
127

Last Updated:
2 minutes ago

Allow uploading PDF/TXT/CSV/JSON files.

For the prototype, provide seeded sample documents/data so the application works immediately.

When the copilot references a document, display:

SOURCE:
Aircraft A-17 Maintenance Manual

Relevant Section:
Hydraulic System

Confidence:
94%

Do not fabricate document citations.

DATA INGESTION

Create a professional ingestion page.

Tabs:

HUMS SENSOR DATA
SERVICE RECORDS
SIEM ALERTS
THREAT INTELLIGENCE
INTELLIGENCE REPORTS

Allow drag-and-drop uploads.

Supported:
CSV
JSON
TXT
PDF

Show pipeline:

UPLOADED
↓
PARSING
↓
NORMALIZATION
↓
VALIDATION
↓
CORRELATION
↓
INDEXED

Create sample data generation buttons:

Generate HUMS Demo Data
Generate SIEM Demo Data
Generate Threat Intelligence Data
Generate Maintenance Records
Generate Mission Data

The application must come preloaded with realistic synthetic demo data.

SAMPLE DATA

Create realistic but completely fictional assets.

Do NOT use real military secrets, real operational information, real classified data, or real-world sensitive military infrastructure.

Use fictional examples:

Mission:
Falcon Shield

Assets:

A-17
Aircraft

A-11
Aircraft

V-32
Armored Vehicle

V-18
Utility Vehicle

R-04
Long Range Radar

R-07
Backup Radar

C-12
Communication Node

P-03
Power System

F-08
Fuel System

Create realistic:

sensor values

maintenance history

service dates

alert timestamps

users

IP addresses using safe private/documentation ranges

IOCs

threat actors

MITRE mappings

All data must clearly be synthetic/demo data.

ASSET HEALTH LOGIC

Create deterministic demo logic for sensor anomalies.

Example:

Normal vibration:
2.0–3.0 mm/s

Warning:
3.0–4.0

Critical:

4.0

Hydraulic pressure:
normal range defined per asset

Temperature:
normal range defined per asset

Use rolling/trend logic rather than only a single value.

Create anomaly scores from 0–100.

Create failure probabilities based on:

anomaly severity

trend

component age

operating hours

maintenance history

historical failure patterns

The exact model can be simulated for the prototype, but the UI must clearly communicate that these are predictive analytics.

THREAT RISK LOGIC

Create deterministic threat scoring.

Factors:

Severity
Asset Criticality
IOC Confidence
Correlation Strength
Technique Count
Attack Chain Progress
Mission Dependency
Recurrence

Output:
0–100

Categories:

0–30
LOW

31–60
MEDIUM

61–80
HIGH

81–100
CRITICAL

Never display arbitrary random risk numbers.

FALSE POSITIVE REDUCTION

Create a visual metric showing alert reduction.

Example:

2,847 raw alerts

↓ duplicate removal

1,943

↓ correlation

421

↓ context analysis

37

↓ prioritization

4 critical incidents

Make this one of the visually strongest components on the Alert Correlation page.

CROSS-DOMAIN CORRELATION

This is another key feature.

Create examples where:

Sensor anomaly
+
Cyber event
+
Threat intelligence
+
Maintenance history

combine into a stronger assessment.

Example:

Radar R-04:

Physical:
Cooling anomaly

Cyber:
Unusual authentication

Intelligence:
Related IOC

Maintenance:
Recent configuration change

System assessment:

“Cross-domain indicators increase confidence that the asset requires immediate investigation.”

Do NOT automatically claim that independent anomalies prove a cyberattack.
Use language such as:

potential

likely

elevated confidence

requires investigation

indicators suggest

SEARCH

Add global search.

Users can search:

asset ID
mission
incident
IOC
user
technique
component
report

Example:
Search “R-04”

Results:
Asset
Incidents
Threat Intelligence
Maintenance
Missions
Reports

NOTIFICATIONS

Create notification center.

Examples:

CRITICAL
Radar R-04 risk increased to 91.

HIGH
Aircraft A-17 predicted failure probability increased to 87%.

WARNING
Maintenance overdue for V-32.

INFO
Threat intelligence feed updated.

REPORTING

Create reports:

Mission Readiness Report
Predictive Maintenance Report
Threat Assessment
Incident Report
BLUF Report

Include:

timestamp

mission

assets

risk

evidence

recommendations

confidence

data sources

ROLE-BASED INTERFACE

Create three demo roles:

COMMANDER
ANALYST
MAINTENANCE OFFICER

COMMANDER:

Mission readiness

Critical risks

BLUF

What-if simulation

high-level recommendations

ANALYST:

Alerts

Incidents

MITRE

Threat intelligence

Evidence

Correlation

MAINTENANCE OFFICER:

Asset health

Sensor data

Service history

Predicted failures

Maintenance priorities

Hide unnecessary technical details based on role.

DEMO MODE

Create a DEMO MODE toggle.

When enabled, show:

“SYNTHETIC DEMONSTRATION DATA”

This is extremely important.

The prototype must clearly state:

“All operational data shown in this demonstration is synthetic and intended solely for evaluation.”

Create a guided demo scenario.

Button:

RUN DEMO SCENARIO

The scenario should automatically demonstrate:

Mission readiness begins at 82%.

New cyber alerts arrive.

Alerts correlate into INC-042.

Radar R-04 cyber risk increases.

Aircraft A-17 sensor anomaly is detected.

Hydraulic pump failure probability rises to 87%.

Mission readiness drops to 78%.

DEFCON-X identifies top priorities.

User opens incident investigation.

User views MITRE mapping.

User opens A-17 digital twin.

User opens Mission Impact.

User runs what-if simulation.

User deploys backup radar.

Readiness improves to 82%.

User generates BLUF.

The demo must feel smooth and intentional.

LIVE SIMULATION

Create a small “LIVE SIMULATION” indicator.

Allow simulated events to arrive automatically.

Example:

NEW EVENT

Radar R-04
Suspicious authentication

Then:

CORRELATED

INC-042

Then:

MISSION IMPACT UPDATED

Then:

READINESS UPDATED

Use subtle animation, not excessive effects.

COMMANDER COPILOT DEMO

Include a prominent AI button:

ASK DEFCON-X

When clicked, open the copilot.

Suggested prompts:

“Why is readiness low?”

“Show critical risks.”

“What should we fix first?”

“What happens if R-04 is offline?”

“Generate BLUF.”

The answers must reference actual application state.

API / BACKEND STRUCTURE

If backend support is available, structure it cleanly.

Entities:

users
missions
assets
components
sensor_readings
maintenance_records
alerts
incidents
threat_intelligence
mitre_techniques
mission_dependencies
risk_scores
recommendations
documents
reports
simulation_runs

Create clean service boundaries:

/api/assets
/api/missions
/api/sensors
/api/maintenance
/api/alerts
/api/incidents
/api/threats
/api/mitre
/api/risk
/api/readiness
/api/simulation
/api/copilot
/api/reports

If a real backend cannot be implemented within the prototype environment, create a clean mock-data/service layer so the frontend architecture remains production-like.

ERROR HANDLING

Do NOT leave empty screens.

Every page needs:

loading state

empty state

error state

successful state

Use toast notifications for actions.

PERFORMANCE

Optimize:

charts

tables

filtering

navigation

animations

Avoid excessive animation.

Use reusable components.

Do not create one giant component.

Use modular components for:

risk cards

asset cards

charts

timelines

threat cards

tables

status indicators

AI panels

modal dialogs

IMPORTANT AI PRINCIPLES

AI should assist humans.

The application must:

show confidence

show evidence

explain recommendations

show data sources

distinguish prediction from fact

distinguish correlation from causation

require human confirmation for consequential actions

Never claim:

“This is definitely an attack.”

Prefer:

“Indicators suggest a potential compromise requiring investigation.”

Never claim:

“This component WILL fail.”

Prefer:

“Estimated failure probability is 87% within the modeled window.”

Never execute operational actions automatically.

LANDING / LOGIN

Create a polished login screen.

Logo:
DEFCON-X

Subtitle:
AI Defence Readiness & Threat Intelligence Copilot

Fields:
Username
Password

Demo role buttons:

Enter as Commander
Enter as Analyst
Enter as Maintenance Officer

Add:

“SYNTHETIC DEMONSTRATION ENVIRONMENT”

Keep login simple for the prototype.

HEADER

Top header should include:

DEFCON-X

Mission:
FALCON SHIELD

Environment:
DEMO

System Status:
OPERATIONAL

Threat Level:
ELEVATED

Current Time

Notifications

User profile

AI Copilot button

FINAL UX REQUIREMENTS

The interface must feel connected.

If the user clicks Radar R-04 from Command Center, the same Radar R-04 information should appear everywhere.

If an incident affects R-04:

Command Center reflects it

Mission Readiness reflects it

Mission Impact reflects it

Threat Intelligence reflects it

Incident Investigation reflects it

Copilot knows about it

BLUF includes it

The system should feel like one unified data platform.

Do NOT create disconnected mock pages.

KEY DIFFERENTIATOR

The product's unique value proposition is:

Traditional predictive maintenance asks:
“Is this asset going to fail?”

Traditional SOC asks:
“Is this a cyber threat?”

DEFCON-X asks:

“How do physical health, cyber threats, intelligence, maintenance, and mission dependencies combine to affect mission readiness?”

The core pipeline is:

INGEST
↓
NORMALIZE
↓
CORRELATE
↓
DETECT
↓
PREDICT
↓
ASSESS
↓
MAP
↓
EXPLAIN
↓
SIMULATE
↓
RECOMMEND
↓
GENERATE BLUF

FINAL COMMAND CENTER STORY

The final product should support this exact hackathon demonstration:

MISSION:
FALCON SHIELD

Initial readiness:
82%

A cyber event appears on Radar R-04.

The system correlates:

authentication anomaly

PowerShell activity

suspicious outbound connection

threat intelligence IOC

It creates:

INC-042
Potential Credential Compromise
Risk 91
Confidence 91%

At the same time, HUMS data for Aircraft A-17 shows:

increasing vibration

hydraulic pressure fluctuation

temperature increase

The predictive engine produces:

Hydraulic Pump Failure Probability:
87%

The Mission Impact Engine combines these events.

Mission readiness changes:

82% → 78%

The Command Center immediately displays:

CRITICAL:
Radar R-04

HIGH:
Aircraft A-17

The commander asks:

“Why is readiness 78%?”

DEFCON-X explains the two dominant risks.

Commander asks:

“What should we prioritize?”

DEFCON-X recommends:

Investigate R-04 due to critical mission dependency.

Inspect A-17 hydraulic system.

Recalculate readiness after mitigation.

Commander asks:

“What if R-04 is isolated?”

Simulation:

Readiness:
78% → 64%

Backup radar R-07 deployed:

64% → 82%

Commander asks:

“Generate BLUF.”

DEFCON-X produces a concise commander-ready summary.

This should be the centerpiece of the entire prototype.

QUALITY BAR

The final application should NOT look like an AI-generated template.

It must feel:

sophisticated

coherent

technically credible

defence-grade

enterprise-ready

data-rich

explainable

futuristic but professional

Prioritize:

Command Center

Mission Readiness

Asset Digital Twin

Predictive Maintenance

Alert Correlation

Incident Investigation

Mission Impact

What-If Simulator

BLUF

AI Copilot

These are the most important pages for judging.

Do not sacrifice these core experiences to add unnecessary secondary features.

Build the complete prototype with realistic synthetic data, polished interactions, responsive layouts, working navigation, functional filters, working charts, functional simulation logic, functional risk calculations, and a convincing end-to-end demo flow.

The final experience should communicate one clear message:

DEFCON-X

SEE THE THREAT. PREDICT THE FAILURE. UNDERSTAND THE IMPACT. PROTECT THE MISSION.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7f0fe4fa-c001-41bb-8511-86a29f44aab9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
