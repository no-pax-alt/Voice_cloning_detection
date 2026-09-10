import type { Action, CallIntent, CallSnapshot, RiskLevel, VoiceAuthenticity } from "./types";

export type TrustSignalStatus = "PASS" | "WARN" | "FAIL" | "UNKNOWN";
export type TrustDecision = "ALLOW" | "VERIFY" | "BLOCK";

export interface TrustSignal {
  key: string;
  label: string;
  status: TrustSignalStatus;
  detail: string;
}

export interface TrustEvaluation {
  decision: TrustDecision;
  level: RiskLevel;
  score: number;
  rationale: string;
  signals: TrustSignal[];
}

function voiceStatus(voice: VoiceAuthenticity): TrustSignalStatus {
  if (voice === "REAL") return "PASS";
  if (voice === "AI-GENERATED") return "FAIL";
  return "UNKNOWN";
}

function intentStatus(intent: CallIntent): TrustSignalStatus {
  if (intent === "LEGITIMATE") return "PASS";
  if (intent === "CONFIRMED FRAUD" || intent === "POTENTIAL FRAUD") return "FAIL";
  return "WARN";
}

function verificationStatus(call: CallSnapshot): TrustSignalStatus {
  if (call.action === "VERIFY" || call.state === "VERIFYING") return "WARN";
  if (call.action === "BLOCK" || call.action === "TERMINATE" || call.state === "TERMINATED") return "FAIL";
  return "UNKNOWN";
}

export function evaluateTrust(call: CallSnapshot): TrustEvaluation {
  const signals: TrustSignal[] = [
    {
      key: "voice",
      label: "Voice authenticity",
      status: voiceStatus(call.voice),
      detail: call.voice === "AI-GENERATED" ? `${call.voiceRisk}% synthetic risk` : `${100 - call.voiceRisk}% authenticity signal`,
    },
    {
      key: "intent",
      label: "Call intent",
      status: intentStatus(call.intent),
      detail: call.intent === "LEGITIMATE" ? "No fraud intent detected" : `${call.intent} pattern detected`,
    },
    {
      key: "verification",
      label: "Caller verification",
      status: verificationStatus(call),
      detail: call.state === "VERIFYING" ? "Step-up verification in progress" : "Independent identity proof not established",
    },
  ];

  const failed = signals.filter((signal) => signal.status === "FAIL").length;
  const warnings = signals.filter((signal) => signal.status === "WARN" || signal.status === "UNKNOWN").length;

  let decision: TrustDecision = "VERIFY";
  if (call.combinedRisk >= 90 || failed >= 2 || call.intent === "CONFIRMED FRAUD") decision = "BLOCK";
  else if (call.combinedRisk < 35 && failed === 0 && warnings <= 1) decision = "ALLOW";

  const rationale = decision === "BLOCK"
    ? "Multiple high-risk signals exceed the protection policy threshold."
    : decision === "VERIFY"
      ? "Trust is insufficient for automatic approval; require step-up verification."
      : "Signals remain within the low-risk policy band.";

  return {
    decision,
    level: call.combinedRisk >= 90 ? "CRITICAL" : call.combinedRisk >= 70 ? "HIGH" : call.combinedRisk >= 35 ? "MEDIUM" : "LOW",
    score: call.combinedRisk,
    rationale,
    signals,
  };
}

export function decisionToAction(decision: TrustDecision): Action {
  if (decision === "BLOCK") return "BLOCK";
  if (decision === "VERIFY") return "VERIFY";
  return "ALLOW";
}
