import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, FileAudio, ShieldAlert } from "lucide-react";
import { SecurityShell } from "../components/security/SecurityShell";
import { Badge, Panel, RiskRing, SectionHead, Waveform } from "../components/security/SecurityPrimitives";
import { mockAnalysisResult } from "../data/mockAnalysis";
import type { VoiceAnalysisResult } from "../core/analysisTypes";
import { analysisApi } from "../services/analysisApi";

export default function ForensicsPage() {
  const [result, setResult] = useState<VoiceAnalysisResult | null>(null);

  useEffect(() => {
    void analysisApi.getResult(mockAnalysisResult.id).then(setResult);
  }, []);

  if (!result) return <SecurityShell title="Voice Forensics" eyebrow="ANALYSIS FORENSICS"><Panel>Loading forensic record…</Panel></SecurityShell>;

  const fake = result.prediction === "FAKE";
  const actionTone = result.riskLevel === "CRITICAL" || result.riskLevel === "HIGH" ? "red" : "green";

  return <SecurityShell title="Voice Forensics" eyebrow="ANALYSIS FORENSICS">
    <SectionHead eyebrow="FORENSIC RECORD" title={result.fileName} desc={`${result.id} · ${result.durationSeconds}s sample · processed in ${(result.processingTimeMs / 1000).toFixed(2)}s`} action={<Badge tone={actionTone}>{result.action}</Badge>} />
    <div className="dashboard-grid">
      <Panel>
        <div className="panel-head"><div><div className="eyebrow">AUTHENTICITY</div><h3>Model verdict</h3></div>{fake ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}</div>
        <div className="forensic-verdict"><div><strong>{fake ? "AI-GENERATED" : "LIKELY HUMAN"}</strong><span>{result.message}</span></div><RiskRing value={Math.round(result.fakePercentage)} /></div>
        <div className="probability-grid"><div><span>AI probability</span><strong>{result.fakePercentage}%</strong></div><div><span>Human probability</span><strong>{result.originalPercentage}%</strong></div><div><span>Confidence</span><strong>{result.confidence}%</strong></div></div>
      </Panel>
      <Panel>
        <div className="panel-head"><div><div className="eyebrow">SIGNAL FORENSICS</div><h3>Audio telemetry</h3></div><FileAudio size={18} /></div>
        <Waveform large />
        <div className="legend"><div><i className="signal-red" />Synthetic likelihood elevated</div><div><i className="signal-cyan" />Sample quality {result.audioQuality.quality}</div></div>
      </Panel>
    </div>
    <Panel className="forensic-details">
      <div className="panel-head"><div><div className="eyebrow">EXPLAINABLE DECISION</div><h3>Why the security engine responded</h3></div><ShieldAlert size={18} /></div>
      <div className="forensic-grid">
        <div><span>Risk level</span><Badge tone={actionTone}>{result.riskLevel}</Badge></div>
        <div><span>Recommended action</span><Badge tone={actionTone}>{result.action}</Badge></div>
        <div><span>Verification</span><strong>{result.verificationRequired ? result.verificationMethod : "Not required"}</strong></div>
        <div><span>Decision source</span><strong>{result.riskDecision.decisionSource}</strong></div>
        <div><span>Sample rate</span><strong>{result.audioQuality.sampleRate} Hz</strong></div>
        <div><span>Channels</span><strong>{result.audioQuality.channels}</strong></div>
      </div>
      <div className="forensic-note">{result.riskDecision.reliabilityAdjustment ? "Audio reliability adjustment was applied." : "No audio reliability adjustment was required."}</div>
    </Panel>
  </SecurityShell>;
}
