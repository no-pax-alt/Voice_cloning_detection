import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Mic,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Square,
} from "lucide-react";
import { Button, useToast } from "@/components/Shared";

type RecorderState = "IDLE" | "STARTING" | "LISTENING" | "STOPPING";

interface LiveRecorderProps {
  onRecordingReady?: (blob: Blob) => void;
}

interface LiveAnalysisResult {
  type?: string;
  window_id?: number | string;
  sequence_number?: number;
  window_seconds?: number;
  processing_ms?: number;
  prediction?: "REAL" | "FAKE" | string;
  confidence?: number;
  real_probability?: number;
  fake_probability?: number;
  original_probability?: number;
  threshold?: number;
  audio_quality?: {
    status?: string;
    duration_seconds?: number;
    sample_rate?: number;
    channels?: number;
    silence_ratio?: number;
    clipping_ratio?: number;
    flags?: string[];
  };
  risk?: {
    level?: "LOW" | "MEDIUM" | "HIGH" | string;
    action?: "ALLOW" | "VERIFY" | "BLOCK" | string;
    verification_required?: boolean;
    verification_method?: string | null;
  };
  risk_level?: "LOW" | "MEDIUM" | "HIGH" | string;
  action?: "ALLOW" | "VERIFY" | "BLOCK" | string;
  verification_required?: boolean;
  verification_method?: string | null;
  message?: string;
}

const STREAM_CHUNK_MS = 1000;

export default function LiveRecorder({
  onRecordingReady,
}: LiveRecorderProps) {
  const { notify } = useToast();

  const [state, setState] = useState<RecorderState>("IDLE");
  const [elapsed, setElapsed] = useState(0);
  const [micReady, setMicReady] = useState(false);

  const [connectionStatus, setConnectionStatus] = useState("DISCONNECTED");
  const [analysisStatus, setAnalysisStatus] = useState("WAITING");
  const [lastResult, setLastResult] = useState<LiveAnalysisResult | null>(
    null
  );
  const [alertActive, setAlertActive] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const stoppingRef = useRef(false);

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setMicReady(false);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const closeSocket = useCallback(() => {
    const socket = socketRef.current;

    if (socket) {
      socket.close();
      socketRef.current = null;
    }

    setConnectionStatus("DISCONNECTED");
  }, []);

  const createLiveSession = async () => {
    const response = await fetch("/api/v1/live/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Unable to create a live protection session.");
    }

    const data = await response.json();

    if (!data?.token) {
      throw new Error("Live protection session token was not returned.");
    }

    return data.token as string;
  };

  const connectSocket = async () => {
    const token = await createLiveSession();

    const protocol =
      window.location.protocol === "https:" ? "wss:" : "ws:";

    const socketUrl =
      `${protocol}//${window.location.host}/api/v1/live/ws` +
      `?token=${encodeURIComponent(token)}`;

    const socket = new WebSocket(socketUrl);

    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === "CONNECTED") {
          setConnectionStatus("CONNECTED");
          setAnalysisStatus("BUFFERING");
          return;
        }

        if (message.type === "CHUNK_RECEIVED") {
          setConnectionStatus("CONNECTED");
          return;
        }

        if (message.type === "WINDOW_READY") {
          setAnalysisStatus("ANALYZING");
          return;
        }

        if (message.type === "ANALYSIS_RESULT") {
          const result = message as LiveAnalysisResult;

          setLastResult(result);
          setAnalysisStatus("RESULT");

          const riskLevel =
            result.risk?.level ?? result.risk_level ?? "LOW";

          const action =
            result.risk?.action ?? result.action ?? "ALLOW";

          if (action === "BLOCK" || riskLevel === "HIGH") {
            setAlertActive(true);

            notify(
              "AI voice threat detected",
              `Prediction: ${result.prediction ?? "UNKNOWN"} · Action: ${action}`,
              "warning"
            );
          } else if (action === "VERIFY" || riskLevel === "MEDIUM") {
            setAlertActive(false);

            notify(
              "Voice verification required",
              `Prediction: ${result.prediction ?? "UNKNOWN"} · Action: ${action}`,
              "warning"
            );
          } else {
            setAlertActive(false);
          }

          return;
        }

        if (
          message.type === "ANALYSIS_ERROR" ||
          message.type === "ERROR"
        ) {
          setAnalysisStatus("ERROR");

          notify(
            "Live analysis error",
            message.message || "Live audio analysis failed.",
            "warning"
          );
        }
      } catch {
        // Ignore malformed/non-JSON websocket messages.
      }
    };

    socket.onerror = () => {
      setConnectionStatus("ERROR");
      setAnalysisStatus("ERROR");
    };

    socket.onclose = () => {
      if (socketRef.current === socket) {
        socketRef.current = null;
      }

      setConnectionStatus("DISCONNECTED");
    };

    await new Promise<void>((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        socket.close();
        reject(
          new Error("Live protection WebSocket connection timed out.")
        );
      }, 10000);

      socket.onopen = () => {
        window.clearTimeout(timeout);
        setConnectionStatus("CONNECTED");
        resolve();
      };

      const originalError = socket.onerror;

      socket.onerror = (event) => {
        window.clearTimeout(timeout);

        if (originalError) {
          originalError.call(socket, event);
        }

        reject(
          new Error("Unable to connect to the live protection service.")
        );
      };
    });
  };

  const startRecording = async () => {
    if (state !== "IDLE") return;

    try {
      stoppingRef.current = false;

      setState("STARTING");
      setLastResult(null);
      setAlertActive(false);
      setAnalysisStatus("CONNECTING");
      setConnectionStatus("CONNECTING");

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Microphone capture is not supported by this browser."
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      setMicReady(true);

      await connectSocket();

      const recorder = new MediaRecorder(stream);

      recorderRef.current = recorder;
      recordedChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size <= 0) return;

        recordedChunksRef.current.push(event.data);

        const socket = socketRef.current;

        if (socket?.readyState === WebSocket.OPEN) {
          socket.send(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        if (blob.size > 0) {
          onRecordingReady?.(blob);
        }

        recordedChunksRef.current = [];
        recorderRef.current = null;

        closeSocket();
        stopTracks();
        stopTimer();

        setAnalysisStatus("WAITING");
        setAlertActive(false);
        setState("IDLE");
      };

      /*
       * IMPORTANT:
       * This is one continuous MediaRecorder.
       * Browser emits approximately one audio chunk every second.
       * Backend combines approximately five chunks into its
       * five-second rolling analysis window.
       */
      recorder.start(STREAM_CHUNK_MS);

      setElapsed(0);
      setState("LISTENING");
      setAnalysisStatus("BUFFERING");

      timerRef.current = window.setInterval(() => {
        setElapsed((value) => value + 1);
      }, 1000);

      notify(
        "Live protection started",
        "VoiceGuard is continuously analyzing microphone speech.",
        "info"
      );
    } catch (error) {
      stoppingRef.current = true;

      if (recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
      }

      recorderRef.current = null;

      closeSocket();
      stopTracks();
      stopTimer();

      setState("IDLE");
      setAnalysisStatus("ERROR");

      notify(
        "Live protection unavailable",
        error instanceof Error
          ? error.message
          : "Unable to start live protection.",
        "warning"
      );
    }
  };

  const stopRecording = () => {
    if (state !== "LISTENING") return;

    stoppingRef.current = true;
    setState("STOPPING");
    setAnalysisStatus("STOPPING");

    stopTimer();

    const recorder = recorderRef.current;

    if (recorder?.state === "recording") {
      recorder.stop();
    } else {
      recorderRef.current = null;
      closeSocket();
      stopTracks();
      setState("IDLE");
    }
  };

  useEffect(() => {
    return () => {
      stoppingRef.current = true;

      if (recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
      }

      closeSocket();
      stopTracks();
      stopTimer();
    };
  }, [closeSocket, stopTimer, stopTracks]);

  const formattedTime = `${Math.floor(elapsed / 60)
    .toString()
    .padStart(2, "0")}:${(elapsed % 60)
    .toString()
    .padStart(2, "0")}`;

  const listening = state === "LISTENING";
  const stopping = state === "STOPPING";

  const prediction = lastResult?.prediction ?? "NO RESULT";

  const confidence = Math.max(
    0,
    Math.min(100, Number(lastResult?.confidence ?? 0))
  );

  const fakeProbability = Math.max(
    0,
    Math.min(
      100,
      Number(
        lastResult?.fake_probability ??
          (prediction === "FAKE" ? confidence : 100 - confidence)
      )
    )
  );

  const realProbability = Math.max(
    0,
    Math.min(
      100,
      Number(
        lastResult?.real_probability ??
          (prediction === "REAL" ? confidence : 100 - confidence)
      )
    )
  );

  const riskLevel =
    lastResult?.risk?.level ??
    lastResult?.risk_level ??
    "—";

  const action =
    lastResult?.risk?.action ??
    lastResult?.action ??
    "—";

  const latency =
    lastResult?.processing_ms !== undefined
      ? `${Math.round(lastResult.processing_ms)} ms`
      : "—";

  const sequence =
    lastResult?.sequence_number !== undefined
      ? `WINDOW ${lastResult.sequence_number}`
      : "WAITING";

  const predictionIsFake = prediction === "FAKE";
  const predictionIsReal = prediction === "REAL";

  return (
    <section className="panel mt-5 overflow-hidden p-5 lg:p-7">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                listening
                  ? "animate-pulse bg-[#b8e94f]"
                  : "bg-[#59645e]"
              }`}
            />

            <span className="font-mono text-[10px] font-semibold uppercase tracking-[.16em] text-[#738078]">
              {listening
                ? "Live protection active"
                : "Live protection ready"}
            </span>
          </div>

          <h2 className="mt-3 font-display text-xl font-semibold text-white">
            Real-time voice protection
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#7d8982]">
            VoiceGuard continuously streams microphone audio and analyzes
            rolling five-second windows while you speak.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-mono text-lg font-semibold text-[#dce4df]">
              {formattedTime}
            </p>

            <p className="font-mono text-[9px] uppercase tracking-[.14em] text-[#66726b]">
              {micReady ? "MIC CONNECTED" : "MIC STANDBY"}
            </p>
          </div>

          {listening || stopping ? (
            <Button
              onClick={stopRecording}
              disabled={stopping}
              className="border-[#ff6a5f]/30 bg-[#ff6a5f]/10 text-[#ff9b93] hover:bg-[#ff6a5f]/20"
            >
              <Square size={15} fill="currentColor" />
              {stopping ? "Stopping..." : "Stop protection"}
            </Button>
          ) : (
            <Button
              onClick={startRecording}
              disabled={state === "STARTING"}
              className="py-3.5"
            >
              <Mic size={16} />
              {state === "STARTING"
                ? "Starting..."
                : "Start live protection"}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="border border-white/8 bg-white/[.018] p-4">
          <div className="flex items-center gap-2 text-[#b8e94f]">
            <Radio size={14} />
            <span className="font-mono text-[9px] uppercase tracking-[.14em]">
              Stream
            </span>
          </div>

          <p className="mt-2 text-xs text-[#aab5ae]">
            {connectionStatus}
          </p>
        </div>

        <div className="border border-white/8 bg-white/[.018] p-4">
          <div className="flex items-center gap-2 text-[#6ee7c8]">
            <Activity size={14} />
            <span className="font-mono text-[9px] uppercase tracking-[.14em]">
              Detection
            </span>
          </div>

          <p className="mt-2 text-xs text-[#aab5ae]">
            {analysisStatus}
          </p>
        </div>

        <div className="border border-white/8 bg-white/[.018] p-4">
          <div className="flex items-center gap-2 text-[#c8d3cc]">
            <Mic size={14} />
            <span className="font-mono text-[9px] uppercase tracking-[.14em]">
              Window
            </span>
          </div>

          <p className="mt-2 text-xs text-[#aab5ae]">
            {lastResult
              ? `${lastResult.window_seconds ?? 5}s rolling`
              : "Building 5s window"}
          </p>
        </div>
      </div>

      <div
        className={`mt-4 border p-5 transition-all ${
          alertActive
            ? "border-[#ff6a5f]/50 bg-[#ff6a5f]/[.08]"
            : "border-white/8 bg-white/[.018]"
        }`}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              {alertActive ? (
                <ShieldAlert size={16} className="text-[#ff887e]" />
              ) : predictionIsFake ? (
                <AlertTriangle size={16} className="text-[#ff887e]" />
              ) : predictionIsReal ? (
                <CheckCircle2 size={16} className="text-[#b8e94f]" />
              ) : (
                <ShieldCheck size={16} className="text-[#6ee7c8]" />
              )}

              <span className="font-mono text-[9px] font-semibold uppercase tracking-[.16em] text-[#738078]">
                Latest AI assessment
              </span>
            </div>

            <h3
              className={`mt-2 font-display text-2xl font-semibold ${
                predictionIsFake
                  ? "text-[#ff887e]"
                  : predictionIsReal
                    ? "text-[#b8e94f]"
                    : "text-white"
              }`}
            >
              {predictionIsFake
                ? "AI GENERATED VOICE"
                : predictionIsReal
                  ? "LIKELY HUMAN VOICE"
                  : "NO RESULT"}
            </h3>

            <p className="mt-1 font-mono text-[10px] uppercase tracking-[.12em] text-[#66726b]">
              {sequence}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            <Metric label="Confidence" value={`${confidence.toFixed(1)}%`} />
            <Metric label="Risk" value={riskLevel} />
            <Metric label="Action" value={action} />
            <Metric label="Latency" value={latency} />
          </div>
        </div>

        {lastResult && (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <ProbabilityBar
              label="Human / Real probability"
              value={realProbability}
              safe
            />

            <ProbabilityBar
              label="Synthetic / Fake probability"
              value={fakeProbability}
              danger
            />
          </div>
        )}

        {!lastResult && listening && (
          <div className="mt-5 border border-white/8 bg-black/10 px-4 py-4">
            <div className="flex items-center gap-3">
              <Activity
                size={15}
                className="animate-pulse text-[#b8e94f]"
              />

              <div>
                <p className="text-xs font-semibold text-[#dce4df]">
                  Listening and building analysis window
                </p>

                <p className="mt-1 text-[11px] text-[#69756f]">
                  Keep speaking. The first AI prediction appears after
                  enough audio is collected.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-[70px]">
      <p className="font-mono text-[8px] uppercase tracking-[.12em] text-[#66726b]">
        {label}
      </p>

      <p className="mt-1 font-mono text-sm font-semibold text-[#dce4df]">
        {value}
      </p>
    </div>
  );
}

function ProbabilityBar({
  label,
  value,
  safe,
  danger,
}: {
  label: string;
  value: number;
  safe?: boolean;
  danger?: boolean;
}) {
  const textClass = danger
    ? "text-[#ff887e]"
    : safe
      ? "text-[#b8e94f]"
      : "text-[#dce4df]";

  const barClass = danger
    ? "bg-[#ff6a5f]"
    : safe
      ? "bg-[#b8e94f]"
      : "bg-[#6ee7c8]";

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-[#dce4df]">
          {label}
        </p>

        <span
          className={`font-mono text-xs font-semibold ${textClass}`}
        >
          {value.toFixed(1)}%
        </span>
      </div>

      <div className="mt-3 h-1 bg-white/8">
        <div
          className={`h-full transition-[width] duration-500 ${barClass}`}
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
          }}
        />
      </div>
    </div>
  );
}
