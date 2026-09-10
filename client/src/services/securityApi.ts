import type { CallState, VerificationResult } from "../core/types";

export interface SecurityApi {
  terminateCall(callId: string): Promise<{ callId: string; state: CallState; event: string }>;
  requestVerification(callId: string): Promise<{ callId: string; status: string }>;
  verifyOTP(callId: string, otp: string): Promise<VerificationResult>;
}

/**
 * Mock adapter used by the current demo. Replace this adapter with the real
 * backend/telephony implementation without changing UI components.
 */
export const mockSecurityApi: SecurityApi = {
  async terminateCall(callId) {
    return { callId, state: "TERMINATED", event: "CALL_TERMINATED" };
  },
  async requestVerification(callId) {
    return { callId, status: "VERIFICATION_REQUIRED" };
  },
  async verifyOTP(_callId, otp) {
    return { verified: /^\d{6}$/.test(otp), method: "OTP" };
  },
};

let activeApi: SecurityApi = mockSecurityApi;

export function configureSecurityApi(api: SecurityApi) {
  activeApi = api;
}

export const securityApi: SecurityApi = {
  terminateCall: (callId) => activeApi.terminateCall(callId),
  requestVerification: (callId) => activeApi.requestVerification(callId),
  verifyOTP: (callId, otp) => activeApi.verifyOTP(callId, otp),
};
