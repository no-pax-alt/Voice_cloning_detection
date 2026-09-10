import { randomUUID } from "node:crypto";

export type AnalysisPrediction = "REAL" | "FAKE";
export type AnalysisRisk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type AnalysisAction = "ALLOW" | "VERIFY" | "BLOCK" | "TERMINATE";

export interface AnalyzeRequest {
  fileName?: string;
  durationSeconds?: number;
  sampleRate?: number;
  channels?: number;
  source?: "upload" | "live";
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
  audioQuality: {
    quality: string;
    sampleRate: number;
    channels: number;
    flags: string[];
  };
  riskDecision: {
    decisionSource: string;
    reliabilityAdjustment: boolean;
  };
  pipeline: {
    provider: "mock" | "aasist" | "external";
    model: string;
    version: string;
  };
}

/**
 * Stable response contract for the frontend/ML boundary.
 * Replace buildDemoAnalysis with the real AASIST/FastAPI inference call later
 * without changing the client-facing response shape.
 */
export function buildDemoAnalysis(input: AnalyzeRequest): VoiceAnalysisResult {
  const duration = Math.max(0, Number(input.durationSeconds ?? 3.2));
  const sampleRate = Number(input.sampleRate ?? 48000);
  const channels = Number(input.channels ?? 1);
  const processingTimeMs = 42;

  return {
    id: randomUUID(),
    fileName: input.fileName || "live-capture.wav",
    prediction: "REAL",
    confidence: 0.94,
    fakePercentage: 6,
    originalPercentage: 94,
    riskLevel: "LOW",
    action: "ALLOW",
    message: "No strong synthetic-voice indicators detected in this demo inference.",
    verificationRequired: false,
    durationSeconds: duration,
    processingTimeMs,
    audioQuality: {
      quality: channels > 1 ? "STEREO" : "GOOD",
      sampleRate,
      channels,
      flags: [],
    },
    riskDecision: {
      decisionSource: "voice-authenticity-demo",
      reliabilityAdjustment: false,
    },
    pipeline: {
      provider: "mock",
      model: "voiceguard-demo",
      version: "0.1.0",
    },
  };
}
