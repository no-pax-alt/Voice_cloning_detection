import { Activity, Ban, CheckCircle2, Gauge, ShieldAlert, Sparkles } from "lucide-react";
import { SecurityShell } from "../components/security/SecurityShell";
import { Badge, Metric, Panel, SectionHead } from "../components/security/SecurityPrimitives";
import { analyticsSummary, modelHealth, threatDistribution, threatTrend } from "../data/analyticsData";

const maxTrend = Math.max(...threatTrend.flatMap((p) => [p.genuine, p.suspicious, p.blocked]));

function MiniBars({ values, tone }: { values: number[]; tone: "safe" | "warn" | "danger" }) {
  return <div className={`mini-bars ${tone}`}>{values.map((value, i) => <i key={i} style={{ height: `${Math.max(10, (value / maxTrend) * 100)}%` }} />)}</div>;
}

export default function SecurityAnalyticsPage() {
  return (
    <SecurityShell title="Security Analytics" eyebrow="MISSION CONTROL / ANALYTICS">
      <div className="page-stack">
        <SectionHead eyebrow="SECURITY POSTURE" title="Threat intelligence at a glance" desc="Aggregated voice-security telemetry for the current monitoring window." action={<Badge tone="cyan"><Activity size={13} /> LIVE TELEMETRY</Badge>} />

        <div className="metric-grid analytics-metrics">
          <Metric label="VOICES ANALYZED" value={analyticsSummary.analyzed.toLocaleString()} detail="Current monitoring window" />
          <Metric label="GENUINE VOICES" value={analyticsSummary.genuine.toLocaleString()} detail="85.5% of analyzed" tone="safe" />
          <Metric label="SUSPICIOUS" value={analyticsSummary.suspicious.toLocaleString()} detail="Requires verification" tone="warn" />
          <Metric label="CLONES DETECTED" value={analyticsSummary.clones.toLocaleString()} detail="74 high-confidence detections" tone="danger" />
          <Metric label="ATTACKS BLOCKED" value={analyticsSummary.blocked.toLocaleString()} detail="Prevention actions executed" tone="safe" />
          <Metric label="AVG CONFIDENCE" value={`${analyticsSummary.averageConfidence}%`} detail={`${analyticsSummary.avgInferenceMs} ms avg inference`} />
        </div>

        <div className="analytics-grid">
          <Panel className="analytics-panel trend-panel">
            <SectionHead eyebrow="DETECTION TREND" title="Voice activity" desc="Genuine, suspicious and blocked events over the latest window." />
            <div className="trend-chart">
              <div className="trend-y"><span>120</span><span>80</span><span>40</span><span>0</span></div>
              <div className="trend-area">
                <div className="trend-gridlines" />
                {threatTrend.map((point) => <div className="trend-column" key={point.label}>
                  <div className="trend-bars">
                    <i className="bar-safe" style={{ height: `${(point.genuine / maxTrend) * 100}%` }} />
                    <i className="bar-warn" style={{ height: `${(point.suspicious / maxTrend) * 100}%` }} />
                    <i className="bar-danger" style={{ height: `${(point.blocked / maxTrend) * 100}%` }} />
                  </div>
                  <small>{point.label}</small>
                </div>)}
              </div>
            </div>
            <div className="legend"><span><i className="legend-safe" /> Genuine</span><span><i className="legend-warn" /> Suspicious</span><span><i className="legend-danger" /> Blocked</span></div>
          </Panel>

          <Panel className="analytics-panel distribution-panel">
            <SectionHead eyebrow="THREAT MIX" title="Detection distribution" />
            <div className="distribution-ring"><div><strong>5.8%</strong><span>AI-GENERATED</span></div></div>
            <div className="distribution-list">{threatDistribution.map((item) => <div key={item.label}><span><i className={`dot-${item.label.toLowerCase().replace("-", "")}`} />{item.label}</span><b>{item.value}%</b></div>)}</div>
          </Panel>
        </div>

        <Panel className="analytics-panel">
          <SectionHead eyebrow="MODEL HEALTH" title="Detection engine status" desc="Production integration points are isolated from presentation logic." />
          <div className="model-health-grid">{modelHealth.map((model) => <div className="model-card" key={model.name}>
            <div className="model-icon"><Sparkles size={16} /></div><div className="model-copy"><strong>{model.name}</strong><span><i className="dot" /> {model.status}</span></div>
            <div className="model-stat"><small>CONFIDENCE</small><b>{model.confidence}%</b></div><div className="model-stat"><small>INFERENCE</small><b>{model.latency}</b></div>
          </div>)}</div>
        </Panel>

        <div className="analytics-grid quick-stats">
          <Panel className="security-callout"><div className="callout-icon"><ShieldAlert size={20} /></div><div><Badge tone="danger">HIGH-VALUE SIGNAL</Badge><h3>Clone detections are concentrated in financial-intent calls.</h3><p>Use the forensic view to inspect artifacts before taking a prevention action.</p></div></Panel>
          <Panel className="security-callout"><div className="callout-icon"><Gauge size={20} /></div><div><Badge tone="safe">SYSTEM HEALTH</Badge><h3>All configured detection models are responding.</h3><p>Average inference latency remains inside the current demonstration target.</p></div></Panel>
        </div>
      </div>
    </SecurityShell>
  );
}
