import { useState, type FormEvent } from "react";
import { ShieldAlert } from "lucide-react";
import { SecurityShell } from "../components/security/SecurityShell";
import { Badge, Metric, Panel, RiskRing, SectionHead, Waveform } from "../components/security/SecurityPrimitives";
import { ThreatResponsePanel } from "../components/security/ThreatResponsePanel";
import { liveCall } from "../data/mockData";
import { useSecurityMonitor } from "../hooks/useSecurityMonitor";

export default function LiveCallPage() {
  const { call, events, busy, verification, terminate, requestVerification, verifyOTP } = useSecurityMonitor(liveCall);
  const [otp, setOtp] = useState("");
  const critical = call.combinedRisk >= 90;

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
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
    <ThreatResponsePanel call={call} events={events} busy={busy} onTerminate={terminate} onVerify={requestVerification} otp={otp} onOtpChange={setOtp} onVerifyOtp={() => void handleVerify({ preventDefault: () => {} } as FormEvent<HTMLFormElement>)} verificationBusy={busy} verificationMessage={verification ? (verification.verified ? "Caller verification passed." : "Caller verification failed; keep the call in a high-risk state.") : undefined} />
  </SecurityShell>;
}
