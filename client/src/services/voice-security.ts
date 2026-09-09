import { mockLiveCall } from "../data/mock/voice-security";
import type { CallState, VoiceAnalysisResult } from "../types/voice-security";

export interface VoiceSecurityService {
  getLiveCall(): Promise<typeof mockLiveCall>;
  analyzeAudio(audio: Blob): Promise<VoiceAnalysisResult>;
  terminateCall(callId: string): Promise<{ callId: string; state: CallState; event: string }>;
  requestVerification(callId: string): Promise<{ callId: string; status: string }>;
  verifyOTP(callId: string, otp: string): Promise<{ verified: boolean }>;
}

/**
 * Demo adapter. Keep mock behavior here so pages/components never depend on
 * fabricated data directly. Replace this adapter with the real API adapter
 * when the backend/ML service is connected.
 */
export const mockVoiceSecurityService: VoiceSecurityService = {
  async getLiveCall() {
    return mockLiveCall;
  },
  async analyzeAudio(_audio) {
    return {
      authenticity: mockLiveCall.voice,
      authenticityScore: mockLiveCall.voiceRisk,
      confidence: 94,
      inferenceMs: 182,
      indicators: mockLiveCall.indicators,
      model: "AASIST / ASVspoof",
      analyzedAt: new Date().toISOString(),
    };
  },
  async terminateCall(callId) {
    return { callId, state: "TERMINATED", event: "CALL_TERMINATED" };
  },
  async requestVerification(callId) {
    return { callId, status: "VERIFICATION_REQUIRED" };
  },
  async verifyOTP(_callId, otp) {
    return { verified: /^\d{6}$/.test(otp) };
  },
};

export function createVoiceSecurityService(): VoiceSecurityService {
  return mockVoiceSecurityService;
}
