import { Activity, AlertTriangle, ArrowUpRight, ShieldAlert, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { SecurityShell } from "../components/security/SecurityShell";
import { logs } from "../data/mockData";

const metrics = [
  ["TOTAL ANALYSES", "1,284", "↑ 18.4% this month", "cyan"],
  ["THREATS DETECTED", "47", "12 require review", "amber"],
  ["CALLS BLOCKED", "19", "97.2% confidence", "red"],
  ["VERIFICATION REQUESTS", "82", "91% resolved", "green"],
] as const;

export default function DashboardPage() {
  return <SecurityShell title="Overview">
    <div className="section-head"><div><div className="eyebrow">EXTRACTED FROM COMMAND CENTER</div><h2>Real-time protection is active</h2><p>Dashboard telemetry now consumes the shared mock-data boundary instead of defining security records inside the page shell.</p></div><Link className="button primary" href="/migration/live-call">Open live call <ArrowUpRight size={15} /></Link></div>
    <div className="metrics">{metrics.map(([label, value, detail, tone]) => <section className="panel metric" key={label}><div className="metric-label">{label}</div><strong className={`text-${tone}`}>{value}</strong><span>{detail}</span></section>)}</div>
    <div className="dashboard-grid">
      <section className="panel chart-panel"><div className="panel-head"><div><div className="eyebrow">RISK TELEMETRY · LAST 24H</div><h3>Security risk timeline</h3></div><span className="badge badge-cyan">LIVE STREAM</span></div><div className="chart"><div className="chart-y"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div className="chart-main"><svg viewBox="0 0 700 220" preserveAspectRatio="none"><path className="line" d="M0 185 C45 180 60 160 100 166 S150 135 190 150 S240 110 270 130 S300 82 335 118 S390 148 420 112 S465 125 500 87 S555 102 585 65 S630 92 700 31" /></svg><div className="x-axis"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>NOW</span></div></div></div></section>
      <section className="panel distribution"><div className="panel-head"><div><div className="eyebrow">SECURITY EVENTS</div><h3>Current signal mix</h3></div><Activity size={17} /></div><div className="legend"><div><i className="signal-red" />AI voice<b>38%</b></div><div><i className="signal-amber" />Fraud intent<b>26%</b></div><div><i className="signal-cyan" />Impersonation<b>19%</b></div><div><i className="signal-purple" />Suspicious requests<b>11%</b></div></div></section>
    </div>
    <section className="panel events"><div className="panel-head"><div><div className="eyebrow">EVENT STREAM</div><h3>Recent security events</h3></div><Link className="text-link" href="/logs">View all <ArrowUpRight size={14} /></Link></div><div className="event-list">{logs.slice(0, 3).map(log => <div className="event" key={log.id}><div className={`event-icon ${log.risk >= 90 ? "red" : log.risk >= 60 ? "amber" : "green"}`}>{log.risk >= 90 ? <ShieldAlert /> : log.risk >= 60 ? <AlertTriangle /> : <ShieldCheck />}</div><div className="event-copy"><b>{log.intent}</b><span>{log.callId} · {log.timestamp}</span></div><strong>{log.risk}%</strong><span className="badge badge-cyan">{log.status}</span></div>)}</div></section>
  </SecurityShell>;
}
