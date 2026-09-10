import { randomUUID } from "node:crypto";
import { inferenceProvider, type InferenceRequest } from "./inference";

export type AnalysisPrediction = "REAL" | "FAKE";
export type AnalysisRisk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type AnalysisAction = "ALLOW" | "VERIFY" | "BLOCK" | "TERMINATE";

export interface AnalyzeRequest {
  fileName?: string;
  durationSeconds?: number;
  sampleRate?: number;
  channels?: number;
  source?: "upload" | "live";
  audioBase64?: string;
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

const results = new Map<string, VoiceAnalysisResult>();

function deriveRisk(fakePercentage: number): AnalysisRisk {
  if (fakePercentage >= 90) return "CRITICAL";
  if (fakePercentage >= 70) return "HIGH";
  if (fakePercentage >= 40) return "MEDIUM";
  return "LOW";
}

function deriveAction(risk: AnalysisRisk): AnalysisAction {
  if (risk === "CRITICAL") return "BLOCK";
  if (risk === "HIGH" || risk === "MEDIUM") return "VERIFY";
  return "ALLOW";
}

export async function buildAnalysis(input: AnalyzeRequest): Promise<VoiceAnalysisResult> {
  const duration = Math.max(0, Number(input.durationSeconds ?? 3.2));
  const sampleRate = Number(input.sampleRate ?? 48000);
  const channels = Number(input.channels ?? 1);

  const inferenceRequest: InferenceRequest = {
    fileName: input.fileName || "live-capture.wav",
    source: input.source ?? "upload",
    audioBase64: input.audioBase64,
    durationSeconds: duration,
    sampleRate,
    channels,
  };

  const started = Date.now();
  const inference = await inferenceProvider.analyze(inferenceRequest);
  const processingTimeMs = inference.processingTimeMs ?? Date.now() - started;
  const fakePercentage = Math.max(
    0,
    Math.min(100, inference.fakePercentage ?? (inference.prediction === "FAKE" ? inference.confidence * 100 : (1 - inference.confidence) * 100)),
  );
  const originalPercentage = Math.max(0, Math.min(100, 100 - fakePercentage));
  const riskLevel = deriveRisk(fakePercentage);
  const action = deriveAction(riskLevel);

  const result: VoiceAnalysisResult = {
    id: randomUUID(),
    fileName: inferenceRequest.fileName,
    prediction: inference.prediction,
    confidence: Math.max(0, Math.min(1, inference.confidence)),
    fakePercentage,
    originalPercentage,
    riskLevel,
    action,
    message: inference.message || (action === "ALLOW" ? "No strong synthetic-voice indicators detected." : "Synthetic-voice indicators require additional verification."),
    verificationRequired: action === "VERIFY",
    verificationMethod: action === "VERIFY" ? "CHALLENGE" : undefined,
    durationSeconds: duration,
    processingTimeMs,
    audioQuality: {
      quality: channels > 1 ? "STEREO" : "GOOD",
      sampleRate,
      channels,
      flags: [],
    },
    riskDecision: {
      decisionSource: "voice-authenticity-model",
      reliabilityAdjustment: false,
    },
    pipeline: {
      provider: inference.provider ?? "external",
      model: inference.model ?? "unknown",
      version: inference.version ?? "unknown",
    },
  };

  results.set(result.id, result);
  return result;
}

export function getAnalysis(id: string) {
  return results.get(id) ?? null;
}
