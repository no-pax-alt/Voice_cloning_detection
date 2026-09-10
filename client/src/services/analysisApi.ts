import type { VoiceAnalysisResult } from "../core/analysisTypes";
import { mockAnalysisResult } from "../data/mockAnalysis";

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

let activeApi: AnalysisApi = mockAnalysisApi;

export function configureAnalysisApi(api: AnalysisApi) {
  activeApi = api;
}

export const analysisApi: AnalysisApi = {
  getResult: (id) => activeApi.getResult(id),
  analyze: (file) => activeApi.analyze(file),
};
