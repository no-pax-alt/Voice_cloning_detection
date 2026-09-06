export type AnalysisResult = "AI Detected" | "Likely Human";
export type AnalysisStatus = "Complete" | "Processing" | "Queued";

export interface Analysis {
  id: string;
  fileName: string;
  date: string;
  duration: string;
  seconds: number;
  result: AnalysisResult;
  confidence: number;
  status: AnalysisStatus;
  aiProbability: number;
  humanProbability: number;
  processingTime: string;
  indicators: {
    name: string;
    score: number;
    tone: "danger" | "warning" | "safe";
    explanation: string;
  }[];
  events: { time: string; label: string; detail: string; tone: "danger" | "warning" }[];
}

export const mockAnalyses: Analysis[] = [
  {
    id: "VG-2026-0842",
    fileName: "customer-support-call.wav",
    date: "Today, 09:42",
    duration: "02:48",
    seconds: 168,
    result: "AI Detected",
    confidence: 94,
    status: "Complete",
    aiProbability: 94,
    humanProbability: 6,
    processingTime: "18.4 sec",
    indicators: [
      { name: "Spectral consistency", score: 92, tone: "danger", explanation: "Uniform harmonic bands suggest a synthesized vocal tract." },
      { name: "Prosody naturalness", score: 88, tone: "danger", explanation: "Stress and cadence are unusually regular across phrase boundaries." },
      { name: "Pitch variation", score: 76, tone: "warning", explanation: "Pitch movement is present, but transitions lack natural micro-variance." },
      { name: "Harmonic structure", score: 91, tone: "danger", explanation: "High-frequency harmonic alignment matches known neural vocoder artifacts." },
      { name: "Temporal patterns", score: 84, tone: "warning", explanation: "Breath and pause timing shows repeated, machine-like intervals." },
    ],
    events: [
      { time: "00:12", label: "Synthetic pattern", detail: "Spectral phase locking detected", tone: "danger" },
      { time: "00:27", label: "Unnatural pitch transition", detail: "Abrupt formant movement", tone: "warning" },
      { time: "00:41", label: "Spectral anomaly", detail: "Harmonic energy mismatch", tone: "danger" },
      { time: "01:56", label: "Synthetic pattern", detail: "Repeated noise floor signature", tone: "danger" },
    ],
  },
  {
    id: "VG-2026-0841",
    fileName: "board-meeting-clip.mp3",
    date: "Today, 08:16",
    duration: "11:24",
    seconds: 684,
    result: "Likely Human",
    confidence: 89,
    status: "Complete",
    aiProbability: 11,
    humanProbability: 89,
    processingTime: "43.2 sec",
    indicators: [
      { name: "Spectral consistency", score: 18, tone: "safe", explanation: "Natural spectral drift is consistent with a live recording environment." },
      { name: "Prosody naturalness", score: 12, tone: "safe", explanation: "Expressive emphasis and interruptions track human speech patterns." },
      { name: "Pitch variation", score: 9, tone: "safe", explanation: "Micro-variation across voiced segments appears organic." },
      { name: "Harmonic structure", score: 24, tone: "safe", explanation: "Harmonic energy varies naturally with articulation and room tone." },
      { name: "Temporal patterns", score: 16, tone: "safe", explanation: "Pause timing and breath events are irregular in a human-like way." },
    ],
    events: [],
  },
  {
    id: "VG-2026-0840",
    fileName: "voicemail-unknown.m4a",
    date: "Yesterday, 17:52",
    duration: "00:43",
    seconds: 43,
    result: "AI Detected",
    confidence: 81,
    status: "Complete",
    aiProbability: 81,
    humanProbability: 19,
    processingTime: "9.8 sec",
    indicators: [],
    events: [{ time: "00:18", label: "Synthetic pattern", detail: "Phase coherence spike", tone: "danger" }],
  },
  {
    id: "VG-2026-0839",
    fileName: "interview-take-02.flac",
    date: "Yesterday, 14:09",
    duration: "04:06",
    seconds: 246,
    result: "Likely Human",
    confidence: 96,
    status: "Complete",
    aiProbability: 4,
    humanProbability: 96,
    processingTime: "22.1 sec",
    indicators: [],
    events: [],
  },
  {
    id: "VG-2026-0838",
    fileName: "voice-note-17.wav",
    date: "Sep 04, 12:33",
    duration: "01:18",
    seconds: 78,
    result: "AI Detected",
    confidence: 73,
    status: "Complete",
    aiProbability: 73,
    humanProbability: 27,
    processingTime: "12.5 sec",
    indicators: [],
    events: [{ time: "00:49", label: "Unnatural pitch transition", detail: "Glide discontinuity", tone: "warning" }],
  },
  {
    id: "VG-2026-0837",
    fileName: "press-briefing.wav",
    date: "Sep 03, 16:45",
    duration: "08:51",
    seconds: 531,
    result: "Likely Human",
    confidence: 92,
    status: "Complete",
    aiProbability: 8,
    humanProbability: 92,
    processingTime: "38.9 sec",
    indicators: [],
    events: [],
  },
];

export const featuredAnalysis = mockAnalyses[0];
export const waveformHeights = [22, 38, 15, 32, 48, 26, 64, 35, 24, 56, 43, 72, 34, 27, 51, 39, 22, 68, 42, 30, 53, 27, 18, 46, 57, 36, 28, 61, 39, 24, 44, 32, 19, 55, 46, 29, 63, 38, 21, 48, 31, 17, 40, 26, 53, 35, 24, 46, 29, 19, 42, 34, 22, 58, 38, 26, 49, 33, 18, 44, 28, 55, 37, 23, 48, 31, 20, 41, 27, 50, 34, 22, 46, 30, 18, 43, 27, 52, 35, 20, 46, 29, 17, 39, 24, 48, 32, 21, 44, 28, 53, 34, 18, 42, 26, 49, 31, 20, 45, 29, 17, 38];

export const getAnalysis = (id?: string) => mockAnalyses.find((analysis) => analysis.id === id) ?? featuredAnalysis;

export const formatSeconds = (value: number) => {
  const minutes = Math.floor(value / 60).toString().padStart(2, "0");
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export const todayDistribution = [
  { label: "Mon", ai: 7, human: 12 },
  { label: "Tue", ai: 13, human: 8 },
  { label: "Wed", ai: 9, human: 15 },
  { label: "Thu", ai: 18, human: 11 },
  { label: "Fri", ai: 12, human: 17 },
  { label: "Sat", ai: 8, human: 6 },
  { label: "Sun", ai: 16, human: 10 },
];

export const analysisStages = [
  "Uploading audio",
  "Extracting features",
  "Analyzing voice patterns",
  "Checking synthetic indicators",
  "Generating confidence score",
  "Complete",
];

export const navItems = [
  { href: "/dashboard", label: "Overview", icon: "LayoutDashboard" },
  { href: "/analyze", label: "New analysis", icon: "ScanLine" },
  { href: "/history", label: "Analysis history", icon: "History" },
];

export const settingsItems = [
  { href: "/settings", label: "Settings", icon: "Settings2" },
];

export const getInitials = (name: string) => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
export const getToneColor = (tone: "danger" | "warning" | "safe") => tone === "danger" ? "#ff6a5f" : tone === "warning" ? "#f2b84b" : "#b8e94f";

export default mockAnalyses;
