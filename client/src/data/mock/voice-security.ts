import type { CallSnapshot, SecurityLog } from "../../types/voice-security";

export const mockLiveCall: CallSnapshot = {
  id: "VG-2409-0842",
  caller: "Unknown caller · +91 80 4217 9082",
  duration: "03:12",
  voice: "AI-GENERATED",
  voiceRisk: 96.8,
  intent: "POTENTIAL FRAUD",
  intentRisk: 91,
  combinedRisk: 97,
  level: "CRITICAL",
  action: "TERMINATE",
  indicators: ["AI VOICE", "IMPERSONATION", "OTP REQUEST", "FINANCIAL REQUEST", "URGENCY"],
  state: "HIGH_RISK",
  quality: "94% · stable",
};

export const mockSecurityLogs: SecurityLog[] = [
  { id: "evt-01", timestamp: "10:42:18", callId: "VG-2409-0842", voice: "AI-GENERATED", intent: "CONFIRMED FRAUD", risk: 97, action: "TERMINATE", status: "Terminated" },
  { id: "evt-02", timestamp: "10:38:51", callId: "VG-2409-0838", voice: "REAL", intent: "SUSPICIOUS", risk: 72, action: "VERIFY", status: "Verified" },
  { id: "evt-03", timestamp: "10:31:04", callId: "VG-2409-0831", voice: "REAL", intent: "LEGITIMATE", risk: 8, action: "ALLOW", status: "Allowed" },
  { id: "evt-04", timestamp: "09:56:40", callId: "VG-2409-0756", voice: "AI-GENERATED", intent: "POTENTIAL FRAUD", risk: 84, action: "BLOCK", status: "Blocked" },
];
