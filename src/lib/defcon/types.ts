export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
export type AssetStatus = "READY" | "WARNING" | "CRITICAL" | "OFFLINE";
export type AssetType =
  | "Aircraft"
  | "Vehicle"
  | "Radar"
  | "Communication"
  | "Power System"
  | "Fuel System";

export interface SensorPoint {
  t: string;
  temperature: number;
  vibration: number;
  pressure: number;
  rpm: number;
  fuel: number;
}

export interface ComponentRisk {
  name: string;
  failureProbability: number;
  window: string;
  factors: string[];
}

export interface ServiceRecord {
  date: string;
  action: string;
  technician: string;
  notes: string;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  location: string;
  /** 0-100 physical health from HUMS trend analysis */
  health: number;
  /** 0-100 cyber risk (higher = worse) */
  cyberRisk: number;
  /** 0-100 maintenance risk (higher = worse) */
  maintenanceRisk: number;
  /** 0-100 mission criticality */
  criticality: number;
  operatingHours: number;
  flightHours?: number;
  lastServiceDays: number;
  nextServiceDays: number;
  functionName: string;
  sensors: SensorPoint[];
  nominal: { temperature: [number, number]; vibration: [number, number]; pressure: [number, number] };
  components: ComponentRisk[];
  serviceHistory: ServiceRecord[];
  standby?: boolean;
}

export interface RawAlert {
  id: string;
  ts: string;
  assetId: string;
  user: string;
  srcIp: string;
  dstIp: string;
  process: string;
  eventType: string;
  technique: string;
  severity: Severity;
  description: string;
  ioc?: string;
}

export interface Incident {
  id: string;
  title: string;
  assetId: string;
  severity: Severity;
  alertIds: string[];
  threatScore: number;
  confidence: number;
  correlationBasis: string[];
  chain: Record<string, "confirmed" | "suspected" | "none">;
  actor?: string;
  status: "OPEN" | "CONTAINED" | "MONITORING";
}

export interface ThreatActor {
  id: string;
  name: string;
  confidence: number;
  techniques: string[];
  affectedAssets: string[];
  level: Severity;
  summary: string;
  iocs: { type: string; value: string; confidence: number }[];
}

export interface MitreTechnique {
  id: string;
  name: string;
  tactic: string;
  evidence: string;
  confidence: number;
}

export interface KbDocument {
  id: string;
  title: string;
  type: string;
  section: string;
  updated: string;
  snippet: string;
  assetId?: string;
}

export type Role = "COMMANDER" | "ANALYST" | "MAINTENANCE";
