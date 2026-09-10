import { Activity, ArrowUpRight } from "lucide-react";
import type { SecurityLog } from "../../core/types";
import { Badge, Panel } from "./SecurityPrimitives";

function toneForRisk(risk: number) {
  if (risk >= 90) return "red";
  if (risk >= 70) return "amber";
  return "green";
}

export function SecurityLogTable({ logs, loading = false }: { logs: SecurityLog[]; loading?: boolean }) {
  return <Panel className="security-log-panel">
    <div className="panel-head"><div><div className="eyebrow">SECURITY TELEMETRY</div><h3>Recent decisions</h3></div><Badge tone="cyan"><Activity size={12} /> {logs.length} EVENTS</Badge></div>
    {loading ? <div className="empty-state">Loading security telemetry…</div> : logs.length === 0 ? <div className="empty-state">No events match the current filters.</div> : <div className="security-log-table-wrap"><table className="security-log-table"><thead><tr><th>Event</th><th>Voice</th><th>Intent</th><th>Risk</th><th>Action</th><th>Status</th><th /></tr></thead><tbody>{logs.map(log => <tr key={log.id}><td><strong>{log.callId}</strong><span>{log.timestamp} · {log.id}</span></td><td><Badge tone={log.voice === "AI-GENERATED" ? "red" : "green"}>{log.voice}</Badge></td><td>{log.intent}</td><td><span className={`risk-number risk-${toneForRisk(log.risk)}`}>{log.risk}%</span></td><td><Badge tone={log.action === "TERMINATE" || log.action === "BLOCK" ? "red" : log.action === "VERIFY" ? "amber" : "green"}>{log.action}</Badge></td><td>{log.status}</td><td><ArrowUpRight size={14} /></td></tr>)}</tbody></table></div>}
  </Panel>;
}
