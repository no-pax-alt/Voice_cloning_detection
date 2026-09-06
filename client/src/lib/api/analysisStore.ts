import type { VoiceAnalysisResponse } from "./voiceAnalysis";

export interface StoredAnalysis {
  id: string;
  fileName: string;
  duration: number;
  processingTime: number;
  createdAt: string;
  result: VoiceAnalysisResponse;
}

const STORAGE_PREFIX = "voiceguard:analysis:";

export function saveAnalysis(record: StoredAnalysis): void {
  sessionStorage.setItem(
    `${STORAGE_PREFIX}${record.id}`,
    JSON.stringify(record)
  );
}

export function getStoredAnalysis(
  id: string
): StoredAnalysis | null {
  const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${id}`);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredAnalysis;
  } catch {
    return null;
  }
}

export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = document.createElement("audio");

    audio.preload = "metadata";

    audio.onloadedmetadata = () => {
      const duration = Number.isFinite(audio.duration)
        ? audio.duration
        : 0;

      URL.revokeObjectURL(url);
      resolve(duration);
    };

    audio.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(0);
    };

    audio.src = url;
  });
}
