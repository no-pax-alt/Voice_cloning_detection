import type { AnalysisApi } from "./analysisApi";
import type { VoiceAnalysisResult } from "../core/analysisTypes";

export function createHttpAnalysisApi(baseUrl = ""): AnalysisApi {
  const normalizedBase = baseUrl.replace(/\/$/, "");

  return {
    async getResult(id: string): Promise<VoiceAnalysisResult | null> {
      const response = await fetch(`${normalizedBase}/api/analysis/${encodeURIComponent(id)}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`Analysis lookup failed (${response.status})`);
      return (await response.json()) as VoiceAnalysisResult;
    },

    async analyze(file: File): Promise<VoiceAnalysisResult> {
      const response = await fetch(`${normalizedBase}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          source: "upload",
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || `Analysis request failed (${response.status})`);
      }

      return (await response.json()) as VoiceAnalysisResult;
    },
  };
}
