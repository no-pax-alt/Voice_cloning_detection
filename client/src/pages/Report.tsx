import { ArrowLeft, Download, FileText, Printer, Share2 } from "lucide-react";
import { Link, useRoute } from "wouter";
import {
  Button,
  SectionEyebrow,
  StatusBadge,
  useToast,
  Waveform,
} from "@/components/Shared";
import { getStoredAnalysis } from "@/lib/api/analysisStore";
import { downloadReport } from "@/lib/api/report";

export default function Report() {
  const [, params] = useRoute("/report/:id");
  const analysis = params?.id ? getStoredAnalysis(params.id) : null;
  const { notify } = useToast();

  if (!analysis) {
    return (
      <div className="mx-auto max-w-[980px] animate-page">
        <div className="mb-6">
          <Link
            href="/history"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#89948e] hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to history
          </Link>
        </div>

        <article className="border border-white/10 bg-[#141917] p-8">
          <SectionEyebrow>VoiceGuard report</SectionEyebrow>
          <h1 className="mt-3 font-display text-2xl font-bold text-white">
            Analysis report not found.
          </h1>
          <p className="mt-3 text-sm text-[#89948e]">
            This report is no longer available in the current browser session.
          </p>
        </article>
      </div>
    );
  }

  const result = analysis.result;
  const isFake = result.prediction === "FAKE";
  const audioQuality = result.audio_quality;
  const risk = result.risk;
  const duration =
    analysis.duration > 0 ? `${Math.round(analysis.duration)}s` : "Unknown";
  const processingTime = `${(analysis.processingTime / 1000).toFixed(2)}s`;

  const shareReport = async () => {
    const shareData = {
      title: "VoiceGuard Analysis Report",
      text: `VoiceGuard analysis: ${result.prediction} · Risk ${result.risk_level} · Action ${result.action}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        notify(
          "Report shared",
          "The VoiceGuard report was shared successfully.",
          "success",
        );
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      notify(
        "Report link copied",
        "The report URL has been copied to your clipboard.",
        "success",
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      try {
        await navigator.clipboard.writeText(window.location.href);
        notify(
          "Report link copied",
          "The report URL has been copied instead.",
          "info",
        );
      } catch {
        notify(
          "Unable to share",
          "Copy the current browser URL manually.",
          "warning",
        );
      }
    }
  };

  return (
    <div className="mx-auto max-w-[980px] animate-page">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link
          href={`/analysis/${analysis.id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#89948e] hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to result
        </Link>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              downloadReport(analysis);
              notify(
                "Report downloaded",
                "The VoiceGuard analysis report has been downloaded.",
                "success",
              );
            }}
          >
            <Download size={14} />
            Download report
          </Button>

          <button
            onClick={() => window.print()}
            className="hidden h-10 w-10 items-center justify-center border border-white/10 text-[#98a39d] hover:border-white/25 hover:text-white sm:flex"
            aria-label="Print report"
          >
            <Printer size={15} />
          </button>
        </div>
      </div>

      <article className="border border-white/10 bg-[#141917] shadow-2xl">
        <header className="flex flex-col justify-between gap-7 border-b border-white/10 p-6 sm:flex-row sm:items-start lg:p-9">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-[#b8e94f] text-[#101412]">
              <FileText size={18} />
            </span>

            <div>
              <p className="font-display text-base font-bold text-white">
                voiceguard
              </p>
              <p className="font-mono text-[8px] uppercase tracking-[.2em] text-[#6f7b74]">
                voice authenticity intelligence
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#68746e]">
              Analysis report
            </p>
            <p className="mt-2 font-mono text-sm font-semibold text-[#dce4df]">
              {analysis.id}
            </p>
            <p className="mt-1 text-xs text-[#78837c]">
              Generated {new Date(analysis.createdAt).toLocaleString()}
            </p>
          </div>
        </header>

        <div className="p-6 lg:p-9">
          <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end">
            <div>
              <SectionEyebrow>Voice authenticity assessment</SectionEyebrow>

              <h1 className="mt-3 font-display text-3xl font-bold tracking-[-.05em] text-white">
                {isFake ? "AI generated" : "Likely human"}
                <span
                  className={isFake ? "text-[#ff6a5f]" : "text-[#b8e94f]"}
                >
                  .
                </span>
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-6 text-[#89948e]">
                This report summarizes the actual VoiceGuard detection,
                audio-reliability assessment, and security decision returned
                by the backend.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <StatusBadge result={isFake ? "AI Detected" : "Likely Human"} />

              <span className="font-display text-4xl font-bold tracking-[-.05em] text-[#b8e94f]">
                {result.confidence}%
                <small className="ml-2 font-mono text-[10px] font-normal uppercase tracking-[.16em] text-[#7c887f]">
                  confidence
                </small>
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <SectionEyebrow>File information</SectionEyebrow>

              <div className="mt-4 space-y-3">
                {[
                  ["File name", analysis.fileName],
                  ["Audio duration", duration],
                  ["Processing time", processingTime],
                  ["Analysis ID", analysis.id],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-4 border-b border-white/6 pb-3 text-xs"
                  >
                    <span className="text-[#77837c]">{label}</span>
                    <span className="font-mono text-right text-[#dce4df]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionEyebrow>Probability split</SectionEyebrow>

              <div className="mt-4 space-y-4">
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#ff9b93]">AI generated</span>
                    <span className="font-mono font-semibold text-[#ff9b93]">
                      {result.fake_percentage}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 bg-white/8">
                    <div
                      className="h-full bg-[#ff6a5f]"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, result.fake_percentage),
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#c8f46a]">Likely human</span>
                    <span className="font-mono font-semibold text-[#c8f46a]">
                      {result.original_percentage}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 bg-white/8">
                    <div
                      className="h-full bg-[#b8e94f]"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, result.original_percentage),
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-9">
            <SectionEyebrow>Audio reliability</SectionEyebrow>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="border border-white/8 p-4">
                <p className="text-[10px] uppercase tracking-[.14em] text-[#69756f]">
                  Quality
                </p>
                <p className="mt-2 font-mono text-sm font-semibold text-white">
                  {audioQuality.quality}
                </p>
              </div>

              <div className="border border-white/8 p-4">
                <p className="text-[10px] uppercase tracking-[.14em] text-[#69756f]">
                  Reliability flags
                </p>
                <p className="mt-2 font-mono text-xs font-semibold text-[#dce4df]">
                  {audioQuality.flags.length
                    ? audioQuality.flags.join(", ")
                    : "None"}
                </p>
              </div>

              <div className="border border-white/8 p-4">
                <p className="text-[10px] uppercase tracking-[.14em] text-[#69756f]">
                  Sample format
                </p>
                <p className="mt-2 font-mono text-sm font-semibold text-white">
                  {audioQuality.sample_rate} Hz · {audioQuality.channels} ch
                </p>
              </div>
            </div>
          </div>

          <div className="mt-9">
            <SectionEyebrow>Security decision</SectionEyebrow>

            <div className="mt-4 grid gap-4 sm:grid-cols-4">
              <div className="border border-white/8 p-4">
                <p className="text-[10px] uppercase tracking-[.14em] text-[#69756f]">
                  Risk
                </p>
                <p className="mt-2 font-mono text-sm font-bold text-white">
                  {risk.risk_level}
                </p>
              </div>

              <div className="border border-white/8 p-4">
                <p className="text-[10px] uppercase tracking-[.14em] text-[#69756f]">
                  Action
                </p>
                <p className="mt-2 font-mono text-sm font-bold text-white">
                  {risk.action}
                </p>
              </div>

              <div className="border border-white/8 p-4">
                <p className="text-[10px] uppercase tracking-[.14em] text-[#69756f]">
                  Decision source
                </p>
                <p className="mt-2 font-mono text-xs font-semibold text-white">
                  {risk.decision_source ?? "BASE_RISK_ENGINE"}
                </p>
              </div>

              <div className="border border-white/8 p-4">
                <p className="text-[10px] uppercase tracking-[.14em] text-[#69756f]">
                  Reliability adjustment
                </p>
                <p className="mt-2 font-mono text-sm font-bold text-white">
                  {risk.reliability_adjustment ? "YES" : "NO"}
                </p>
              </div>
            </div>

            <div className="mt-4 border-l-2 border-[#ff6a5f] bg-[#ff6a5f]/[.06] px-4 py-3">
              <p className="text-xs font-semibold text-[#d9aaa5]">
                {risk.message}
              </p>

              {risk.verification_required && (
                <p className="mt-2 text-xs leading-5 text-[#b7aaa7]">
                  Verification required using{" "}
                  <span className="font-mono text-[#e0c8c4]">
                    {risk.verification_method}
                  </span>
                  .
                </p>
              )}
            </div>
          </div>

          <div className="mt-9">
            <SectionEyebrow>Audio timeline</SectionEyebrow>

            <div className="mt-4 border border-white/8 bg-[#101412] p-4">
              <Waveform flagged height={72} />

              <div className="mt-4 text-xs text-[#78837c]">
                The current report uses the stored analysis result. Detailed
                event-level forensic markers are not fabricated when they are
                not returned by the backend.
              </div>
            </div>
          </div>

          <div className="mt-9 grid gap-8 border-t border-white/10 pt-8 sm:grid-cols-2">
            <div>
              <SectionEyebrow>Technical summary</SectionEyebrow>
              <p className="mt-4 text-sm leading-7 text-[#9ba69f]">
                VoiceGuard first evaluates the submitted audio for
                authenticity. It then evaluates signal reliability before
                passing the result through the security risk layer. This
                separates model confidence from the quality of the evidence
                used for the final action.
              </p>
            </div>

            <div>
              <SectionEyebrow>Conclusion</SectionEyebrow>
              <p className="mt-4 text-sm leading-7 text-[#9ba69f]">
                The conclusion shown here is based on the actual backend
                analysis stored for this session. It should be treated as an
                AI-assisted authenticity assessment rather than definitive
                forensic proof.
              </p>
            </div>
          </div>
        </div>

        <footer className="flex flex-col justify-between gap-3 border-t border-white/10 px-6 py-5 text-[10px] text-[#68746e] sm:flex-row sm:items-center lg:px-9">
          <span>VoiceGuard · AI voice authenticity platform</span>

          <button
            onClick={shareReport}
            className="inline-flex items-center gap-2 text-[#aab5ae] hover:text-white"
          >
            <Share2 size={13} />
            Share report
          </button>
        </footer>
      </article>
    </div>
  );
}
