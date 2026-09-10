import { useCallback, useEffect, useState } from "react";
import type { CallSnapshot, CallState, SecurityEvent } from "../core/types";
import { securityApi } from "../services/securityApi";

export function useSecurityMonitor(initialCall: CallSnapshot) {
  const [call, setCall] = useState(initialCall);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [busy, setBusy] = useState(false);
  const [verification, setVerification] = useState<{ verified: boolean; method: string } | null>(null);

  useEffect(() => {
    setCall(initialCall);
    setVerification(null);
  }, [initialCall]);

  const setState = useCallback((state: CallState) => {
    setCall((current) => ({ ...current, state }));
  }, []);

  const terminate = useCallback(async () => {
    if (busy || call.state === "TERMINATED") return;
    setBusy(true);
    try {
      const result = await securityApi.terminateCall(call.id);
      setCall((current) => ({ ...current, state: result.state, action: "TERMINATE" }));
      setEvents((current) => [
        { id: `evt-${Date.now()}`, type: "ACTION_TAKEN", timestamp: new Date().toISOString(), severity: "CRITICAL", message: "Call termination requested" },
        ...current,
      ]);
    } finally {
      setBusy(false);
    }
  }, [busy, call.id, call.state]);

  const requestVerification = useCallback(async () => {
    if (busy || call.state === "TERMINATED") return;
    setBusy(true);
    try {
      await securityApi.requestVerification(call.id);
      setVerification(null);
      setState("VERIFYING");
      setEvents((current) => [
        { id: `evt-${Date.now()}`, type: "VERIFICATION", timestamp: new Date().toISOString(), severity: "WARNING", message: "Caller verification requested" },
        ...current,
      ]);
    } finally {
      setBusy(false);
    }
  }, [busy, call.id, call.state, setState]);

  const verifyOTP = useCallback(async (otp: string) => {
    if (busy || call.state !== "VERIFYING") return false;
    setBusy(true);
    try {
      const result = await securityApi.verifyOTP(call.id, otp);
      setVerification(result);
      setState(result.verified ? "MONITORING" : "HIGH_RISK");
      setEvents((current) => [
        {
          id: `evt-${Date.now()}`,
          type: "VERIFICATION",
          timestamp: new Date().toISOString(),
          severity: result.verified ? "INFO" : "CRITICAL",
          message: result.verified ? "Caller verification successful" : "Caller verification failed",
        },
        ...current,
      ]);
      return result.verified;
    } finally {
      setBusy(false);
    }
  }, [busy, call.id, call.state, setState]);

  return { call, events, busy, verification, setState, terminate, requestVerification, verifyOTP };
}
