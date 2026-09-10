import { ShieldCheck, ShieldX, UserRoundCheck } from "lucide-react";
import type { TrustEvaluation, TrustSignalStatus } from "../../core/trustDecision";
import { Badge, Panel } from "./SecurityPrimitives";

function statusTone(status: TrustSignalStatus) {
  if (status === "PASS") return "green" as const;
  if (status === "FAIL") return "red" as const;
  return "amber" as const;
}

function StatusIcon({ status }: { status: TrustSignalStatus }) {
  if (status === "PASS") return <ShieldCheck size={14} />;
  if (status === "FAIL") return <ShieldX size={14} />;
  return <UserRoundCheck size={14} />;
}

export function TrustDecisionPanel({ evaluation }: { evaluation: TrustEvaluation }) {
  const tone = evaluation.decision === "BLOCK" ? "red" : evaluation.decision === "VERIFY" ? "amber" : "green";

  return (
    <Panel className="trust-panel">
      <div className="panel-head">
        <div><div className="eyebrow">TRUST LAYER</div><h3>Explainable security decision</h3></div>
        <Badge tone={tone}>{evaluation.decision}</Badge>
      </div>
      <div className="trust-score-row">
        <div><span>TRUST POLICY SCORE</span><strong>{evaluation.score}<small>/100 risk</small></strong></div>
        <div className={`trust-decision trust-${tone}`}><b>{evaluation.decision}</b><span>{evaluation.level} protection</span></div>
      </div>
      <p className="trust-rationale">{evaluation.rationale}</p>
      <div className="trust-signals">
        {evaluation.signals.map((signal) => (
          <div className="trust-signal" key={signal.key}>
            <div className={`trust-signal-icon trust-signal-${statusTone(signal.status)}`}><StatusIcon status={signal.status} /></div>
            <div><strong>{signal.label}</strong><span>{signal.detail}</span></div>
            <Badge tone={statusTone(signal.status)}>{signal.status}</Badge>
          </div>
        ))}
      </div>
    </Panel>
  );
}
