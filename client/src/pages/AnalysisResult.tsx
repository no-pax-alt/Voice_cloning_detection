import { ArrowLeft, Download, FileAudio, Share2 } from "lucide-react";
import { Link, useLocation, useRoute } from "wouter";
import {
  Button,
  ConfidenceGauge,
  EmptyState,
  SectionEyebrow,
  StatusBadge,
  useToast,
} from "@/components/Shared";
import { getStoredAnalysis } from "@/lib/api/analysisStore";

function ResultStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-l border-white/10 pl-4">
      <p className="text-[10px] uppercase tracking-[.14em] text-[#69756f]">
        {label}
      </p>
      <p className="mt-2 font-mono text-sm font-semibold text-[#e6ece8]">
        {value}
      </p>
    </div>
  );
}

function RiskBadge({
  risk,
}: {
  risk: "LOW" | "MEDIUM" | "HIGH";
}) {
  const classes = {
    LOW: "border-[#b8e94f]/20 bg-[#b8e94f]/10 text-[#b8e94f]",
    MEDIUM: "border-[#f2b84b]/20 bg-[#f2b84b]/10 text-[#f2c66c]",
    HIGH: "border-[#ff6a5f]/20 bg-[#ff6a5f]/10 text-[#ff887e]",
  };

  return (
    <span
      className={`rounded-full border px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[.12em] ${classes[risk]}`}
    >
      {risk} RISK
    </span>
  );
}

function ActionBadge({
  action,
}: {
  action: "ALLOW" | "VERIFY" | "BLOCK";
}) {
  const classes = {
    ALLOW: "border-[#b8e94f]/20 bg-[#b8e94f]/10 text-[#b8e94f]",
    VERIFY: "border-[#f2b84b]/20 bg-[#f2b84b]/10 text-[#f2c66c]",
    BLOCK: "border-[#ff6a5f]/20 bg-[#ff6a5f]/10 text-[#ff887e]",
  };

  return (
    <span
      className={`rounded-full border px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[.12em] ${classes[action]}`}
    >
      ACTION: {action}
    </span>
  );
}

export default function AnalysisResult() {
  const [, params] = useRoute("/analysis/:id");
  const [, navigate] = useLocation();
  const { notify } = useToast();

  const analysis = params?.id
    ? getStoredAnalysis(params.id)
    : null;

  if (!analysis) {
    return (
      <div className="mx-auto max-w-[1250px] animate-page">
        <div className="mb-6">
          <Link
            href="/history"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#89948e] transition hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to history
          </Link>
        </div>

        <div className="panel p-8">
          <EmptyState query="Analysis result not found" />

          <div className="mt-5 flex justify-center">
            <Button
              variant="secondary"
              onClick={() => navigate("/analyze")}
            >
              Analyze another file
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const result = analysis.result;

  const isFake = result.prediction === "FAKE";
  const displayResult = isFake ? "AI Detected" : "Likely Human";

  const share = async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href);

      notify(
        "Result link copied",
        "The analysis result URL has been copied.",
        "info"
      );
    } catch {
      notify(
        "Unable to copy link",
        "Copy the current browser URL manually.",
        "warning"
      );
    }
  };

  const duration =
    analysis.duration > 0
      ? `${Math.round(analysis.duration)}s`
      : "Unknown";

  const processingTime = `${(
    analysis.processingTime / 1000
  ).toFixed(2)}s`;

  return (
    <div className="mx-auto max-w-[1250px] animate-page">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/history"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#89948e] transition hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to history
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() =>
              notify(
                "Report export",
                "Report export will be available through the reporting workflow.",
                "info"
              )
            }
          >
            <Download size={14} />
            Download report
          </Button>

          <Button variant="secondary" onClick={share}>
            <Share2 size={14} />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </div>

      <section className="panel relative overflow-hidden p-5 lg:p-8">
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-[#ff6a5f]/10 blur-[90px]" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <SectionEyebrow>
                Analysis result
              </SectionEyebrow>

              <RiskBadge risk={result.risk_level} />

              <ActionBadge action={result.action} />
            </div>

            <div className="mt-5 flex items-start gap-3">
              <span
                className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center ${
                  isFake
                    ? "bg-[#ff6a5f]/10 text-[#ff887e]"
                    : "bg-[#b8e94f]/10 text-[#b8e94f]"
                }`}
              >
                <ShieldIcon />
              </span>

              <div>
                <h1 className="font-display text-3xl font-bold tracking-[-.05em] text-white lg:text-[42px]">
                  {displayResult}
                  <span
                    className={
                      isFake
                        ? "text-[#ff6a5f]"
                        : "text-[#b8e94f]"
                    }
                  >
                    .
                  </span>
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#9ca7a2]">
                  {result.message}
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
              <ResultStat
                label="AI probability"
                value={`${result.fake_percentage}%`}
              />

              <ResultStat
                label="Human probability"
                value={`${result.original_percentage}%`}
              />

              <ResultStat
                label="Audio duration"
                value={duration}
              />

              <ResultStat
                label="Processing time"
                value={processingTime}
              />
            </div>
          </div>

          <div className="flex items-center justify-start lg:justify-end">
            <ConfidenceGauge
              score={result.confidence}
              size={190}
            />
          </div>
        </div>

        <div className="relative mt-8 flex flex-col gap-3 border-t border-white/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <FileAudio
              size={15}
              className="text-[#76817c]"
            />

            <span className="text-xs font-semibold text-[#dce4df]">
              {analysis.fileName}
            </span>

            <span className="font-mono text-[10px] text-[#69756f]">
              {analysis.id}
            </span>
          </div>

          <StatusBadge result={displayResult} />
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <section className="panel p-5 lg:p-6">
          <SectionEyebrow>
            Model assessment
          </SectionEyebrow>

          <h2 className="mt-2 font-display text-xl font-semibold text-white">
            Voice authenticity analysis
          </h2>

          <div className="mt-6 space-y-5">
            <ProbabilityBar
              label="Human / original"
              value={result.original_percentage}
              tone="safe"
            />

            <ProbabilityBar
              label="AI / synthetic"
              value={result.fake_percentage}
              tone="danger"
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="border border-white/8 bg-white/[.02] p-4">
              <p className="text-[10px] uppercase tracking-[.14em] text-[#69756f]">
                Risk level
              </p>

              <div className="mt-3">
                <RiskBadge risk={result.risk_level} />
              </div>
            </div>

            <div className="border border-white/8 bg-white/[.02] p-4">
              <p className="text-[10px] uppercase tracking-[.14em] text-[#69756f]">
                Recommended action
              </p>

              <div className="mt-3">
                <ActionBadge action={result.action} />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="panel p-5 lg:p-6">
            <SectionEyebrow>
              Decision
            </SectionEyebrow>

            <h2 className="mt-2 font-display text-xl font-semibold text-white">
              Security response
            </h2>

            <p className="mt-4 text-sm leading-6 text-[#9aa59f]">
              The model result has been passed to the security
              risk engine. The resulting action is based on the
              detector prediction and confidence score.
            </p>

            <div className="mt-5 border-l-2 border-[#ff6a5f] bg-[#ff6a5f]/[.06] px-4 py-3">
              <p className="text-xs font-semibold text-[#d9aaa5]">
                {result.message}
              </p>

              {result.verification_required && (
                <p className="mt-2 text-xs leading-5 text-[#b7aaa7]">
                  Verification required using{" "}
                  <span className="font-mono text-[#e0c8c4]">
                    {result.verification_method}
                  </span>
                  .
                </p>
              )}
            </div>
          </div>

          <div className="panel p-5 lg:p-6">
            <SectionEyebrow>
              Analysis metadata
            </SectionEyebrow>

            <h2 className="mt-2 font-display text-lg font-semibold text-white">
              Backend decision data
            </h2>

            <div className="mt-5 space-y-3 text-xs">
              <MetadataRow
                label="Prediction"
                value={result.prediction}
              />

              <MetadataRow
                label="Confidence"
                value={`${result.confidence}%`}
              />

              <MetadataRow
                label="Risk"
                value={result.risk_level}
              />

              <MetadataRow
                label="Action"
                value={result.action}
              />

              <MetadataRow
                label="Verification"
                value={
                  result.verification_required
                    ? result.verification_method
                    : "Not required"
                }
              />
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          variant="secondary"
          onClick={() => navigate("/analyze")}
        >
          Analyze another file
        </Button>
      </div>
    </div>
  );
}

function ProbabilityBar({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "safe" | "danger";
}) {
  const className =
    tone === "danger"
      ? "bg-[#ff6a5f]"
      : "bg-[#b8e94f]";

  const textClass =
    tone === "danger"
      ? "text-[#ff887e]"
      : "text-[#b8e94f]";

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-[#dce4df]">
          {label}
        </p>

        <span
          className={`font-mono text-xs font-semibold ${textClass}`}
        >
          {value}%
        </span>
      </div>

      <div className="mt-3 h-1 bg-white/8">
        <div
          className={`h-full transition-[width] duration-500 ${className}`}
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
          }}
        />
      </div>
    </div>
  );
}

function MetadataRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-3 last:border-0 last:pb-0">
      <span className="text-[#69756f]">
        {label}
      </span>

      <span className="font-mono font-semibold text-[#dce4df]">
        {value}
      </span>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 3 5 6v5c0 4.5 2.8 8.5 7 10 4.2-1.5 7-5.5 7-10V6l-7-3Z" />
      <path d="m8.8 12 2.2 2.2 4.5-4.5" />
    </svg>
  );
}

