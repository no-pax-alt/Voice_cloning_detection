import { useCallback, useEffect, useState } from "react";
import type { CallSnapshot, CallState, SecurityEvent } from "../core/types";
import { securityApi } from "../services/securityApi";

export function useSecurityMonitor(initialCall: CallSnapshot) {
  const [call, setCall] = useState(initialCall);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setCall(initialCall);
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
    setBusy(true);
    try {
      await securityApi.requestVerification(call.id);
      setState("VERIFYING");
    } finally {
      setBusy(false);
    }
  }, [call.id, setState]);

  return { call, events, busy, setState, terminate, requestVerification };
}
