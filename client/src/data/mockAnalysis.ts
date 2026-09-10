import type { VoiceAnalysisResult } from "../core/analysisTypes";

export const mockAnalysisResult: VoiceAnalysisResult = {
  id: "AN-2409-0842",
  fileName: "incoming-call-sample.wav",
  prediction: "FAKE",
  confidence: 97,
  fakePercentage: 96.8,
  originalPercentage: 3.2,
  riskLevel: "CRITICAL",
  action: "TERMINATE",
  message: "Synthetic voice indicators strongly match an impersonation pattern.",
  verificationRequired: true,
  verificationMethod: "CHALLENGE",
  durationSeconds: 192,
  processingTimeMs: 1840,
  audioQuality: {
    quality: "94% · stable",
    sampleRate: 16000,
    channels: 1,
    flags: [],
  },
  riskDecision: {
    decisionSource: "VOICE_AUTHENTICITY + THREAT_CONTEXT",
    reliabilityAdjustment: false,
  },
};
