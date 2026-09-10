import { CheckCircle2, Cpu, Database, Radio, Server, ShieldCheck, Wifi } from "lucide-react";
import { SecurityShell } from "../components/security/SecurityShell";
import { Badge, Panel, SectionHead } from "../components/security/SecurityPrimitives";

const services = [
  ["AI inference engine", "Operational", "184 ms", Cpu],
  ["Voice stream monitor", "Operational", "LIVE", Radio],
  ["Threat decision service", "Operational", "99.99%", ShieldCheck],
  ["Event store", "Operational", "12 ms", Database],
  ["API gateway", "Operational", "41 ms", Server],
  ["Secure transport", "Operational", "Connected", Wifi],
] as const;

export default function SystemStatusPage() {
  return <SecurityShell title="System Status" eyebrow="SECURITY OPERATIONS / SYSTEM STATUS">
    <SectionHead eyebrow="PLATFORM HEALTH" title="All systems operational" desc="Live readiness of the VoiceShield detection and response pipeline." action={<Badge tone="green"><CheckCircle2 size={13}/> OPERATIONAL</Badge>} />
    <Panel className="status-hero"><div><span className="eyebrow">OVERALL AVAILABILITY</span><strong>99.98%</strong><span>Last 30 days · no active incidents</span></div><div className="status-pulse"><i/><span>MONITORING ACTIVE</span></div></Panel>
    <SectionHead eyebrow="SERVICE HEALTH" title="Detection pipeline" />
    <div className="status-grid">{services.map(([name, state, telemetry, Icon]) => <Panel key={name} className="status-card"><div className="status-card-top"><div className="status-service-icon"><Icon size={17}/></div><Badge tone="green">ONLINE</Badge></div><strong>{name}</strong><div className="status-detail"><span>{state}</span><b>{telemetry}</b></div><div className="health-bar"><i/></div></Panel>)}</div>
    <SectionHead eyebrow="MODEL READINESS" title="AI detection models" />
    <Panel><div className="model-status-row"><div><strong>AASIST</strong><span>Primary spoof detector · ready</span></div><Badge tone="green">READY</Badge><b>96.8%</b></div><div className="model-status-row"><div><strong>AASIST2</strong><span>Secondary ensemble detector · ready</span></div><Badge tone="green">READY</Badge><b>94.2%</b></div><div className="model-status-row"><div><strong>ASVspoof evaluation</strong><span>Benchmark pipeline · synchronized</span></div><Badge tone="cyan">SYNCED</Badge><b>100%</b></div></Panel>
  </SecurityShell>;
}
