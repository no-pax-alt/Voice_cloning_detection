import { Mic, MicOff, Radio, Activity } from "lucide-react";
import { Badge, Panel } from "./SecurityPrimitives";
import { useLiveAudioMonitor } from "../../hooks/useLiveAudioMonitor";

function formatDuration(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function LiveAudioTelemetry() {
  const { snapshot, levels, start, stop } = useLiveAudioMonitor();

  async function toggle() {
    try {
      if (snapshot.active) stop();
      else await start();
    } catch {
      // Permission errors are surfaced in the UI without breaking the monitor page.
    }
  }

  return (
    <Panel className="live-telemetry-panel">
      <div className="panel-head">
        <div>
          <div className="eyebrow">REAL-TIME INPUT</div>
          <h3>Live microphone telemetry</h3>
        </div>
        <Badge tone={snapshot.active ? "green" : "cyan"}>{snapshot.active ? "CAPTURING" : "READY"}</Badge>
      </div>

      <div className="telemetry-toolbar">
        <div className="telemetry-signal"><span className={snapshot.active ? "pulse-dot" : "signal-dot"} /><strong>{snapshot.active ? "MIC STREAM ACTIVE" : "MIC STREAM STANDBY"}</strong></div>
        <button className="telemetry-toggle" type="button" onClick={() => void toggle()} aria-pressed={snapshot.active}>
          {snapshot.active ? <MicOff size={16} /> : <Mic size={16} />}
          {snapshot.active ? "Stop capture" : "Start live capture"}
        </button>
      </div>

      <div className="telemetry-wave" aria-label="Real-time microphone waveform">
        {levels.map((level, index) => <i key={index} style={{ height: `${Math.max(8, Math.min(94, level * 1.9))}%` }} />)}
      </div>

      <div className="pipeline-strip">
        <span className="pipeline-live"><Radio size={13} /> {snapshot.stage.replaceAll("_", " ")}</span>
        <span><Activity size={13} /> {snapshot.amplitude}% signal</span>
        <span>{formatDuration(snapshot.durationSeconds)}</span>
      </div>

      <div className="telemetry-stats">
        <div><span>INPUT QUALITY</span><strong>{snapshot.quality}</strong></div>
        <div><span>SAMPLE RATE</span><strong>{snapshot.sampleRate ? `${(snapshot.sampleRate / 1000).toFixed(1)} kHz` : "—"}</strong></div>
        <div><span>INFERENCE</span><strong>{snapshot.inferenceMs ? `${snapshot.inferenceMs} ms` : "—"}</strong></div>
        <div><span>PROCESSING</span><strong>{snapshot.active ? "STREAMING" : "PAUSED"}</strong></div>
      </div>
    </Panel>
  );
}
