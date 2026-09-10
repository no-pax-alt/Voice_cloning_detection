import { FileText, Download, ShieldCheck, AlertTriangle, Ban, Activity } from "lucide-react";
import { SecurityShell } from "../components/security/SecurityShell";
import { Badge, Metric, Panel, SectionHead } from "../components/security/SecurityPrimitives";

const reports = [
  { id: "RPT-2409-01", title: "Weekly Threat Summary", period: "Sep 04–10, 2026", status: "READY", incidents: 18, severity: "HIGH" },
  { id: "RPT-2409-02", title: "Voice Clone Detection Audit", period: "Sep 01–10, 2026", status: "READY", incidents: 7, severity: "CRITICAL" },
  { id: "RPT-2409-03", title: "Model Performance Review", period: "Aug 01–31, 2026", status: "ARCHIVED", incidents: 42, severity: "MEDIUM" },
];

export default function SecurityReportsPage() {
  return <SecurityShell title="Security Reports" eyebrow="SECURITY OPERATIONS / REPORTS">
    <SectionHead eyebrow="AUDIT & INTELLIGENCE" title="Security reporting" desc="Exportable summaries of detection activity, response actions and model performance." />
    <div className="metrics-grid">
      <Metric label="Reports generated" value="128" detail="+12 this month" />
      <Metric label="Incidents covered" value="842" detail="Across monitored calls" tone="amber" />
      <Metric label="Critical events" value="37" detail="Requiring response" tone="red" />
      <Metric label="Audit coverage" value="99.4%" detail="Telemetry completeness" tone="green" />
    </div>
    <Panel>
      <div className="report-list">
        {reports.map((report) => <article className="report-row" key={report.id}>
          <div className="report-icon"><FileText size={18} /></div>
          <div className="report-main"><strong>{report.title}</strong><span>{report.id} · {report.period}</span></div>
          <Badge tone={report.severity === "CRITICAL" ? "red" : report.severity === "HIGH" ? "amber" : "cyan"}>{report.severity}</Badge>
          <span className="report-count"><b>{report.incidents}</b> incidents</span>
          <Badge tone="green">{report.status}</Badge>
          <button className="icon-button" aria-label={`Download ${report.title}`}><Download size={16} /></button>
        </article>)}
      </div>
    </Panel>
    <SectionHead eyebrow="LATEST SNAPSHOT" title="Response posture" />
    <div className="report-summary-grid">
      <Panel><div className="summary-icon"><ShieldCheck size={18}/></div><strong>Safe events</strong><b>91.8%</b><span>Allowed after verification</span></Panel>
      <Panel><div className="summary-icon"><AlertTriangle size={18}/></div><strong>Suspicious</strong><b>5.6%</b><span>Additional verification required</span></Panel>
      <Panel><div className="summary-icon"><Ban size={18}/></div><strong>Blocked</strong><b>2.6%</b><span>High-risk activity prevented</span></Panel>
      <Panel><div className="summary-icon"><Activity size={18}/></div><strong>Avg response</strong><b>184 ms</b><span>Detection-to-decision latency</span></Panel>
    </div>
  </SecurityShell>;
}
