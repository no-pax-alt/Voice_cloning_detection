export interface VoiceAnalysisResponse {
  success: boolean;
  prediction: "REAL" | "FAKE";
  original_probability: number;
  fake_probability: number;
  original_percentage: number;
  fake_percentage: number;
  confidence: number;
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
