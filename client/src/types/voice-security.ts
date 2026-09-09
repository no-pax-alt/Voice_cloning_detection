export type VoiceAuthenticity = "REAL" | "AI-GENERATED" | "UNKNOWN" | "ANALYZING";
export type CallIntent = "LEGITIMATE" | "SUSPICIOUS" | "POTENTIAL FRAUD" | "CONFIRMED FRAUD";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type Action = "ALLOW" | "VERIFY" | "WARN" | "BLOCK" | "TERMINATE";
export type CallState =
  | "IDLE" | "CONNECTING" | "MONITORING" | "ANALYZING"
  | "SUSPICIOUS" | "VERIFYING" | "HIGH_RISK" | "TERMINATING"
  | "TERMINATED" | "ENDED";

export interface CallSnapshot {
  id: string;
  caller: string;
  duration: string;
  voice: VoiceAuthenticity;
  voiceRisk: number;
  intent: CallIntent;
  intentRisk: number;
  combinedRisk: number;
  level: RiskLevel;
  action: Action;
  indicators: string[];
  state: CallState;
  quality: string;
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  callId: string;
  voice: VoiceAuthenticity;
  intent: CallIntent;
  risk: number;
  action: Action;
  status: string;
}

export interface VoiceAnalysisResult {
  authenticity: VoiceAuthenticity;
  authenticityScore: number;
  confidence: number;
  inferenceMs: number;
  indicators: string[];
  model: string;
  analyzedAt: string;
}

export interface ThreatAssessment {
  level: RiskLevel;
  score: number;
  intent: CallIntent;
  recommendedAction: Action;
  reasons: string[];
}
