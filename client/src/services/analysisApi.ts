import type { VoiceAnalysisResult } from "../core/analysisTypes";
import { mockAnalysisResult } from "../data/mockAnalysis";
import { createHttpAnalysisApi } from "./httpAnalysisApi";

export interface AnalysisApi {
  getResult(id: string): Promise<VoiceAnalysisResult | null>;
  analyze(file: File): Promise<VoiceAnalysisResult>;
}

export const mockAnalysisApi: AnalysisApi = {
  async getResult(id) {
    return id === mockAnalysisResult.id ? mockAnalysisResult : null;
  },
  async analyze(_file) {
    return mockAnalysisResult;
  },
};

/**
 * The UI remains mock-first for local demos. Set VITE_ANALYSIS_API_URL to
 * switch to the HTTP contract without changing page/component code.
 */
const configuredBaseUrl = import.meta.env.VITE_ANALYSIS_API_URL as string | undefined;
let activeApi: AnalysisApi = configuredBaseUrl
  ? createHttpAnalysisApi(configuredBaseUrl)
  : mockAnalysisApi;

export function configureAnalysisApi(api: AnalysisApi) {
  activeApi = api;
}

export function useHttpAnalysisApi(baseUrl = configuredBaseUrl || "") {
  activeApi = createHttpAnalysisApi(baseUrl);
}

export const analysisApi: AnalysisApi = {
  getResult: (id) => activeApi.getResult(id),
  analyze: (file) => activeApi.analyze(file),
};
