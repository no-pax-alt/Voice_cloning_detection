export interface AudioQuality {
  quality: "GOOD" | "DEGRADED" | "POOR";
  duration_seconds: number;
  sample_rate: number;
  channels: number;
  rms: number;
  peak_amplitude: number;
  silence_ratio: number;
  clipping_ratio: number;
  flags: string[];
}

export interface RiskDecision {
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  action: "ALLOW" | "VERIFY" | "BLOCK";
  message: string;
  verification_required: boolean;
  verification_method: string;
  decision_source?: string;
  reliability_adjustment?: boolean;
  quality_flags?: string[];
}

export interface VoiceAnalysisResponse {
  success: boolean;
  prediction: "REAL" | "FAKE";
  original_probability: number;
  fake_probability: number;
  original_percentage: number;
  fake_percentage: number;
  confidence: number;
  decision_threshold: number;
  audio_quality: AudioQuality;
  risk: RiskDecision;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  action: "ALLOW" | "VERIFY" | "BLOCK";
  message: string;
  verification_required: boolean;
  verification_method: string;
}

export async function analyzeVoice(
  file: File
): Promise<VoiceAnalysisResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/v1/voice/analyze", {
    method: "POST",
    body: formData,
  });

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Backend returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok) {
    const detail =
      typeof data === "object" &&
      data !== null &&
      "detail" in data &&
      typeof data.detail === "string"
        ? data.detail
        : `Analysis failed with status ${response.status}.`;

    throw new Error(detail);
  }

  return data as VoiceAnalysisResponse;
}
