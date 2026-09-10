export interface InferenceRequest {
  fileName: string;
  source: "upload" | "live";
  audioBase64?: string;
  durationSeconds?: number;
  sampleRate?: number;
  channels?: number;
}

export interface InferenceResponse {
  prediction: "REAL" | "FAKE";
  confidence: number;
  fakePercentage?: number;
  originalPercentage?: number;
  processingTimeMs?: number;
  model?: string;
  version?: string;
  provider?: "mock" | "aasist" | "external";
  message?: string;
}

export interface InferenceProvider {
  analyze(input: InferenceRequest): Promise<InferenceResponse>;
}

/**
 * HTTP adapter for a real inference service (AASIST, AASIST2, wav2vec2,
 * or another ASVspoof-compatible model). The ML service owns model loading
 * and returns probabilities; this API keeps those details out of the UI.
 */
export function createExternalInferenceProvider(baseUrl: string): InferenceProvider {
  const endpoint = baseUrl.replace(/\/$/, "");

  return {
    async analyze(input) {
      const response = await fetch(`${endpoint}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.message || `Inference service failed (${response.status})`);
      }

      return payload as InferenceResponse;
    },
  };
}

export const mockInferenceProvider: InferenceProvider = {
  async analyze() {
    return {
      prediction: "REAL",
      confidence: 0.94,
      fakePercentage: 6,
      originalPercentage: 94,
      processingTimeMs: 42,
      provider: "mock",
      model: "voiceguard-demo",
      version: "0.1.0",
      message: "No strong synthetic-voice indicators detected in demo inference.",
    };
  },
};

const configuredUrl = process.env.VOICE_ANALYSIS_API_URL?.trim();

export const inferenceProvider: InferenceProvider = configuredUrl
  ? createExternalInferenceProvider(configuredUrl)
  : mockInferenceProvider;
