import { AlertTriangle, CheckCircle2, PhoneOff, ShieldCheck, UserCheck } from "lucide-react";
import type { CallSnapshot, SecurityEvent } from "../../core/types";
import { Badge, Panel } from "./SecurityPrimitives";

interface ThreatResponsePanelProps {
  call: CallSnapshot;
  events: SecurityEvent[];
  busy: boolean;
  onTerminate: () => void;
  onVerify: () => void;
  otp: string;
  onOtpChange: (value: string) => void;
  onVerifyOtp: () => void;
  verificationBusy: boolean;
  verificationMessage?: string;
}

export function ThreatResponsePanel({ call, events, busy, onTerminate, onVerify, otp, onOtpChange, onVerifyOtp, verificationBusy, verificationMessage }: ThreatResponsePanelProps) {
  return (
    <Panel>
      <div className="panel-head"><div><div className="eyebrow">THREAT RESPONSE</div><h3>Operator controls</h3></div><Badge tone={call.level === "CRITICAL" ? "red" : "amber"}>{call.action}</Badge></div>
      <div className="actions">
        <button className="button primary" disabled={busy || call.state === "TERMINATED"} onClick={onTerminate}><PhoneOff size={15} /> Terminate call</button>
        <button className="button secondary" disabled={busy || call.state === "TERMINATED"} onClick={onVerify}><UserCheck size={15} /> Request verification</button>
      </div>
      {call.state === "VERIFYING" && (
        <div className="verification-card">
          <div><div className="eyebrow">IDENTITY CHALLENGE</div><strong>Enter the 6-digit verification code</strong></div>
          <div className="verification-row">
            <input aria-label="Verification code" inputMode="numeric" maxLength={6} value={otp} onChange={(event) => onOtpChange(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" />
            <button className="button secondary" disabled={verificationBusy || otp.length !== 6} onClick={onVerifyOtp}>Verify</button>
          </div>
          {verificationMessage && <span className="verification-message">{verificationMessage}</span>}
        </div>
      )}
      <div className="event-list">
        {events.map(event => <div className="event" key={event.id}><div className="event-icon red"><AlertTriangle /></div><div className="event-copy"><b>{event.message}</b><span>{new Date(event.timestamp).toLocaleTimeString()}</span></div><Badge tone="red">{event.severity}</Badge></div>)}
        {call.state === "TERMINATED" && <div className="event"><div className="event-icon green"><CheckCircle2 /></div><div className="event-copy"><b>Call termination requested successfully</b><span>Action routed through the Security API adapter.</span></div><Badge tone="green"><ShieldCheck size={12} /> TERMINATED</Badge></div>}
      </div>
    </Panel>
  );
}
