import type { StoredAnalysis } from "./analysisStore";

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildReportHtml(analysis: StoredAnalysis): string {
  const result = analysis.result;
  const quality = result.audio_quality;
  const risk = result.risk;

  const generatedAt = new Date(analysis.createdAt).toLocaleString();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>VoiceGuard Analysis Report - ${escapeHtml(analysis.id)}</title>
<style>
body {
  font-family: Arial, sans-serif;
  max-width: 900px;
  margin: 40px auto;
  padding: 0 24px;
  color: #17201b;
  line-height: 1.6;
}
h1, h2 { margin-bottom: 8px; }
.header {
  border-bottom: 2px solid #17201b;
  padding-bottom: 20px;
  margin-bottom: 30px;
}
.status {
  font-size: 24px;
  font-weight: bold;
  margin: 12px 0;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.card {
  border: 1px solid #d8ddd9;
  padding: 16px;
  border-radius: 8px;
}
.label {
  color: #657068;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .08em;
}
.value {
  font-weight: bold;
  margin-top: 4px;
}
.warning {
  background: #fff7e5;
  border: 1px solid #ead49c;
  padding: 16px;
  margin-top: 24px;
}
.footer {
  margin-top: 40px;
  padding-top: 16px;
  border-top: 1px solid #ddd;
  color: #68736d;
  font-size: 12px;
}
@media print {
  body { margin: 20px; }
}
</style>
</head>
<body>

<div class="header">
  <h1>VoiceGuard Analysis Report</h1>
  <div>Voice authenticity and security assessment</div>
  <div><strong>Analysis ID:</strong> ${escapeHtml(analysis.id)}</div>
  <div><strong>Generated:</strong> ${escapeHtml(generatedAt)}</div>
</div>

<h2>Analysis Result</h2>
<div class="status">${escapeHtml(result.prediction)}</div>

<div class="grid">
  <div class="card">
    <div class="label">AI / Synthetic Probability</div>
    <div class="value">${escapeHtml(result.fake_percentage)}%</div>
  </div>
  <div class="card">
    <div class="label">Human / Original Probability</div>
    <div class="value">${escapeHtml(result.original_percentage)}%</div>
  </div>
  <div class="card">
    <div class="label">Model Confidence</div>
    <div class="value">${escapeHtml(result.confidence)}%</div>
  </div>
  <div class="card">
    <div class="label">Decision Threshold</div>
    <div class="value">${escapeHtml(result.decision_threshold)}</div>
  </div>
</div>

<h2>File Information</h2>
<div class="grid">
  <div class="card">
    <div class="label">File Name</div>
    <div class="value">${escapeHtml(analysis.fileName)}</div>
  </div>
  <div class="card">
    <div class="label">Duration</div>
    <div class="value">${escapeHtml(analysis.duration)} seconds</div>
  </div>
  <div class="card">
    <div class="label">Processing Time</div>
    <div class="value">${escapeHtml(analysis.processingTime)} ms</div>
  </div>
  <div class="card">
    <div class="label">Analysis ID</div>
    <div class="value">${escapeHtml(analysis.id)}</div>
  </div>
</div>

<h2>Audio Reliability</h2>
<div class="grid">
  <div class="card">
    <div class="label">Quality</div>
    <div class="value">${escapeHtml(quality.quality)}</div>
  </div>
  <div class="card">
    <div class="label">Sample Rate</div>
    <div class="value">${escapeHtml(quality.sample_rate)} Hz</div>
  </div>
  <div class="card">
    <div class="label">Channels</div>
    <div class="value">${escapeHtml(quality.channels)}</div>
  </div>
  <div class="card">
    <div class="label">Silence Ratio</div>
    <div class="value">${escapeHtml((quality.silence_ratio * 100).toFixed(2))}%</div>
  </div>
</div>

<div class="card" style="margin-top:16px">
  <div class="label">Reliability Flags</div>
  <div class="value">
    ${quality.flags.length ? escapeHtml(quality.flags.join(", ")) : "None"}
  </div>
</div>

<h2>Security Decision</h2>
<div class="grid">
  <div class="card">
    <div class="label">Risk Level</div>
    <div class="value">${escapeHtml(risk.risk_level)}</div>
  </div>
  <div class="card">
    <div class="label">Recommended Action</div>
    <div class="value">${escapeHtml(risk.action)}</div>
  </div>
  <div class="card">
    <div class="label">Decision Source</div>
    <div class="value">${escapeHtml(risk.decision_source ?? "BASE_RISK_ENGINE")}</div>
  </div>
  <div class="card">
    <div class="label">Reliability Adjustment</div>
    <div class="value">${risk.reliability_adjustment ? "YES" : "NO"}</div>
  </div>
</div>

<div class="card" style="margin-top:16px">
  <div class="label">Verification</div>
  <div class="value">
    ${risk.verification_required
      ? `Required — ${escapeHtml(risk.verification_method)}`
      : "Not required"}
  </div>
</div>

<div class="warning">
  <strong>Security interpretation:</strong>
  ${escapeHtml(risk.message)}
</div>

<div class="footer">
  VoiceGuard · AI voice authenticity and security analysis<br>
  This report reflects the analysis produced by the VoiceGuard prototype and should not be treated as a standalone forensic or legal opinion.
</div>

</body>
</html>`;
}

export function downloadReport(analysis: StoredAnalysis): void {
  const html = buildReportHtml(analysis);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `VoiceGuard-Report-${analysis.id}.html`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}
