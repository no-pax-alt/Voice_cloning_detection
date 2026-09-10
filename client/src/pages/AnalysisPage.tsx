import { useRef, useState } from "react";
import { Activity, FileAudio, UploadCloud } from "lucide-react";
import { SecurityShell } from "../components/security/SecurityShell";
import { Badge, Metric, Panel, SectionHead, Waveform } from "../components/security/SecurityPrimitives";

export default function AnalysisPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  function selectFile(file?: File) {
    if (!file) return;
    setFileName(file.name);
    setAnalyzing(false);
  }

  function startAnalysis() {
    if (!fileName) return;
    setAnalyzing(true);
  }

  return <SecurityShell title="Voice Analysis" eyebrow="AUDIO THREAT ANALYSIS">
    <SectionHead eyebrow="ANALYSIS WORKSPACE" title="Inspect a voice sample" desc="Upload an audio sample for authenticity, intent and risk analysis. The analysis adapter is ready to be connected to the real ML service." action={<Badge tone="cyan"><Activity size={12} /> ML READY</Badge>} />
    <div className="dashboard-grid">
      <Panel>
        <div className="panel-head"><div><div className="eyebrow">INPUT</div><h3>Audio sample</h3></div><FileAudio size={18} /></div>
        <div className="upload-zone" onClick={() => inputRef.current?.click()} role="button" tabIndex={0} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") inputRef.current?.click(); }}>
          <UploadCloud size={30} />
          <strong>{fileName || "Select an audio file"}</strong>
          <span>{fileName ? "Ready for analysis" : "WAV, MP3 or supported voice recording"}</span>
          <input ref={inputRef} type="file" accept="audio/*" hidden onChange={event => selectFile(event.target.files?.[0])} />
        </div>
        <button className="button primary" disabled={!fileName || analyzing} onClick={startAnalysis}>{analyzing ? "Analysis queued" : "Analyze sample"}</button>
      </Panel>
      <Panel>
        <div className="panel-head"><div><div className="eyebrow">TELEMETRY</div><h3>Signal preview</h3></div><Badge tone="green">LOCAL PREVIEW</Badge></div>
        <Waveform large />
        <div className="metrics"><Metric label="VOICE MODEL" value="READY" detail="Awaiting sample" tone="cyan" /><Metric label="RISK ENGINE" value="READY" detail="Awaiting analysis" tone="cyan" /></div>
      </Panel>
    </div>
  </SecurityShell>;
}
