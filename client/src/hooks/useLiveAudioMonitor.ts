import { useCallback, useEffect, useRef, useState } from "react";

export type AudioPipelineStage = "IDLE" | "CAPTURING" | "FEATURE_EXTRACTION" | "MODEL_INFERENCE" | "RISK_SCORING";

export interface LiveAudioSnapshot {
  active: boolean;
  amplitude: number;
  quality: "GOOD" | "FAIR" | "POOR";
  durationSeconds: number;
  sampleRate: number;
  stage: AudioPipelineStage;
  inferenceMs: number;
}

const initial: LiveAudioSnapshot = {
  active: false,
  amplitude: 0,
  quality: "GOOD",
  durationSeconds: 0,
  sampleRate: 0,
  stage: "IDLE",
  inferenceMs: 0,
};

export function useLiveAudioMonitor() {
  const [snapshot, setSnapshot] = useState(initial);
  const [levels, setLevels] = useState<number[]>(Array.from({ length: 64 }, () => 8));
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    void audioContextRef.current?.close();
    streamRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
    setSnapshot((current) => ({ ...current, active: false, amplitude: 0, stage: "IDLE" }));
  }, []);

  const start = useCallback(async () => {
    if (snapshot.active) return;
    if (!navigator.mediaDevices?.getUserMedia) throw new Error("Microphone capture is not supported by this browser.");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.72;
    context.createMediaStreamSource(stream).connect(analyser);
    streamRef.current = stream;
    audioContextRef.current = context;
    analyserRef.current = analyser;
    startedAtRef.current = performance.now();
    setSnapshot({ active: true, amplitude: 0, quality: "GOOD", durationSeconds: 0, sampleRate: context.sampleRate, stage: "CAPTURING", inferenceMs: 0 });

    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteTimeDomainData(data);
      const rms = Math.sqrt(data.reduce((sum, value) => sum + Math.pow((value - 128) / 128, 2), 0) / data.length);
      const amplitude = Math.min(100, Math.round(rms * 260));
      const elapsed = Math.floor((performance.now() - startedAtRef.current) / 1000);
      const stage: AudioPipelineStage = elapsed % 7 >= 5 ? "RISK_SCORING" : elapsed % 7 >= 3 ? "MODEL_INFERENCE" : elapsed % 7 >= 2 ? "FEATURE_EXTRACTION" : "CAPTURING";
      setLevels(Array.from(data.slice(0, 64), (value) => Math.max(8, Math.round(Math.abs(value - 128) * 0.9))));
      setSnapshot({ active: true, amplitude, quality: amplitude < 8 ? "POOR" : amplitude < 22 ? "FAIR" : "GOOD", durationSeconds: elapsed, sampleRate: context.sampleRate, stage, inferenceMs: 82 + (elapsed % 5) * 7 });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [snapshot.active]);

  useEffect(() => stop, [stop]);

  return { snapshot, levels, start, stop };
}
