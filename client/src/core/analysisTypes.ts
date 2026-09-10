export type AnalysisPrediction = "REAL" | "FAKE";
export type AnalysisRisk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type AnalysisAction = "ALLOW" | "VERIFY" | "BLOCK" | "TERMINATE";

export interface AudioQuality {
  quality: string;
  sampleRate: number;
  channels: number;
  flags: string[];
}

export interface AnalysisRiskDecision {
  decisionSource: string;
  reliabilityAdjustment: boolean;
}

export interface VoiceAnalysisResult {
  id: string;
  fileName: string;
  prediction: AnalysisPrediction;
  confidence: number;
  fakePercentage: number;
  originalPercentage: number;
  riskLevel: AnalysisRisk;
  action: AnalysisAction;
  message: string;
  verificationRequired: boolean;
  verificationMethod?: "OTP" | "CHALLENGE" | "MANUAL";
  durationSeconds: number;
  processingTimeMs: number;
  audioQuality: AudioQuality;
  riskDecision: AnalysisRiskDecision;
}
