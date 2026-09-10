export type ThreatTrendPoint = {
  label: string;
  genuine: number;
  suspicious: number;
  blocked: number;
};

export const analyticsSummary = {
  analyzed: 1284,
  genuine: 1098,
  suspicious: 186,
  clones: 74,
  blocked: 61,
  averageConfidence: 94.2,
  avgInferenceMs: 184,
};

export const threatTrend: ThreatTrendPoint[] = [
  { label: "08:00", genuine: 82, suspicious: 8, blocked: 2 },
  { label: "10:00", genuine: 94, suspicious: 11, blocked: 4 },
  { label: "12:00", genuine: 88, suspicious: 16, blocked: 6 },
  { label: "14:00", genuine: 112, suspicious: 13, blocked: 5 },
  { label: "16:00", genuine: 106, suspicious: 22, blocked: 9 },
  { label: "18:00", genuine: 124, suspicious: 19, blocked: 8 },
  { label: "20:00", genuine: 118, suspicious: 27, blocked: 12 },
];

export const threatDistribution = [
  { label: "Genuine", value: 85.5 },
  { label: "Suspicious", value: 8.7 },
  { label: "AI-generated", value: 5.8 },
];

export const modelHealth = [
  { name: "AASIST", status: "Online", confidence: 96, latency: "142 ms" },
  { name: "AASIST2", status: "Online", confidence: 94, latency: "168 ms" },
  { name: "ASVspoof", status: "Online", confidence: 92, latency: "241 ms" },
];
