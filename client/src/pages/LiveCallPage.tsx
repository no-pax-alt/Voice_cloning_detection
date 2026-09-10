import { useState } from "react";
import { AlertTriangle, CheckCircle2, PhoneOff, ShieldAlert, ShieldCheck, UserCheck } from "lucide-react";
import { SecurityShell } from "../components/security/SecurityShell";
import { Badge, Metric, Panel, RiskRing, SectionHead, Waveform } from "../components/security/SecurityPrimitives";
import { liveCall } from "../data/mockData";
import { useSecurityMonitor } from "../hooks/useSecurityMonitor";

export default function LiveCallPage() {
  const { call, events, busy, verification, terminate, requestVerification, verifyOTP } = useSecurityMonitor(liveCall);
  const [otp, setOtp] = useState("");
  const critical = call.combinedRisk >= 90;
  const verifying = call.state === "VERIFYING";

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) return;
    const verified = await verifyOTP(otp);
    if (verified) setOtp("");
  }

  return <SecurityShell title="Live Call Monitor" eyebrow="REAL-TIME THREAT MONITORING">
    <SectionHead eyebrow="EXTRACTED PAGE" title={call.caller} desc={`${call.id} · ${call.duration} · signal quality ${call.quality}`} action={<Badge tone={critical ? "red" : "cyan"}>{call.state}</Badge>} />
    <div className="dashboard-grid">
      <Panel><div className="panel-head"><div><div className="eyebrow">LIVE AUDIO</div><h3>Voice telemetry</h3></div><Badge tone="green">MONITORING</Badge></div><Waveform large /><div className="metrics"><Metric label="VOICE AUTHENTICITY" value={`${call.voiceRisk}%`} detail={call.voice} tone="red" /><Metric label="INTENT RISK" value={`${call.intentRisk}%`} detail={call.intent} tone="amber" /></div></Panel>
      <Panel><div className="panel-head"><div><div className="eyebrow">DECISION ENGINE</div><h3>Combined risk</h3></div><ShieldAlert size={18} /></div><RiskRing value={call.combinedRisk} /><div className="legend">{call.indicators.map(indicator => <div key={indicator}><i className="signal-red" />{indicator}</div>)}</div></Panel>
    </div>
    <Panel><div className="panel-head"><div><div className="eyebrow">THREAT RESPONSE</div><h3>Operator controls</h3></div><Badge tone="red">{call.action}</Badge></div><div className="actions"><button className="button primary" disabled={busy || call.state === "TERMINATED"} onClick={terminate}><PhoneOff size={15} /> Terminate call</button><button className="button secondary" disabled={busy || call.state === "TERMINATED"} onClick={requestVerification}><UserCheck size={15} /> Request verification</button></div>{verifying && <form className="verification-form" onSubmit={handleVerify}><div><div className="eyebrow">CALLER VERIFICATION</div><strong>Enter the 6-digit verification code</strong><span>Verification is routed through the Security API boundary.</span></div><div className="verification-input"><input aria-label="Verification code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={event => setOtp(event.target.value.replace(/\D/g, ""))} placeholder="000000" /><button className="button secondary" type="submit" disabled={busy || otp.length !== 6}>Verify</button></div></form>}{verification && <div className="verification-result"><Badge tone={verification.verified ? "green" : "red"}>{verification.verified ? "VERIFIED" : "FAILED"}</Badge><span>{verification.verified ? "Caller verification passed." : "Caller verification failed; keep the call in a high-risk state."}</span></div>}<div className="event-list">{events.map(event => <div className="event" key={event.id}><div className={`event-icon ${event.severity === "CRITICAL" ? "red" : event.severity === "WARNING" ? "amber" : "green"}`}><AlertTriangle /></div><div className="event-copy"><b>{event.message}</b><span>{new Date(event.timestamp).toLocaleTimeString()}</span></div><Badge tone={event.severity === "CRITICAL" ? "red" : event.severity === "WARNING" ? "amber" : "green"}>{event.severity}</Badge></div>)}{call.state === "TERMINATED" && <div className="event"><div className="event-icon green"><CheckCircle2 /></div><div className="event-copy"><b>Call termination requested successfully</b><span>Action routed through the Security API adapter.</span></div><Badge tone="green"><ShieldCheck size={12} /> TERMINATED</Badge></div>}</div></Panel>
  </SecurityShell>;
}
