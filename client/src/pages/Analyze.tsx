import { useEffect, useRef, useState } from "react";
import { FileAudio, FileUp, Info, Loader2, Pause, Play, RefreshCw, Sparkles, Trash2, UploadCloud } from "lucide-react";
import { useLocation } from "wouter";
import { analysisStages, featuredAnalysis, waveformHeights } from "@/lib/mockData";
import { Button, SectionEyebrow, useToast, Waveform } from "@/components/Shared";

export default function Analyze() {
  const [, navigate] = useLocation();
  const { notify } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const canAnalyze = Boolean(file) && stageIndex === -1;

  useEffect(() => { if (!playing) return; const timer = window.setTimeout(() => setPlaying(false), 2600); return () => window.clearTimeout(timer); }, [playing]);
  useEffect(() => {
    if (stageIndex < 0) return;
    if (stageIndex >= analysisStages.length - 1) {
      const complete = window.setTimeout(() => navigate(`/analysis/${featuredAnalysis.id}`), 850);
      return () => window.clearTimeout(complete);
    }
    const next = window.setTimeout(() => setStageIndex((current) => current + 1), 700);
    return () => window.clearTimeout(next);
  }, [stageIndex, navigate]);
  useEffect(() => {
    if (stageIndex < 0) return;
    const timer = window.setInterval(() => setProgress((current) => Math.min(100, current + 1.7)), 45);
    return () => window.clearInterval(timer);
  }, [stageIndex]);

  const chooseFile = (selected?: File) => {
    if (!selected) return;
    if (!/\.(mp3|wav|m4a|flac)$/i.test(selected.name)) { notify("Unsupported file type", "Choose an MP3, WAV, M4A, or FLAC file.", "warning"); return; }
    setFile(selected);
    setProgress(0);
    setStageIndex(-1);
  };
  const loadMock = () => { const mock = new File([new Uint8Array(2200)], "customer-support-call.wav", { type: "audio/wav" }); chooseFile(mock); notify("Sample file loaded", "Ready to run a simulated voice analysis.", "info"); };
  const startAnalysis = () => { if (!file) return; setStageIndex(0); setProgress(4); notify("Analysis started", "This is a frontend-only simulated scan.", "info"); };

  return <div className="mx-auto max-w-[1120px] animate-page"><div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><SectionEyebrow>Forensic workspace / 01</SectionEyebrow><h1 className="mt-3 font-display text-3xl font-bold tracking-[-.05em] text-white lg:text-[38px]">Analyze a voice<span className="text-[#b8e94f]">.</span></h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#84908a]">Upload an audio file to screen for synthetic speech signals. Your file stays in this prototype and is never sent anywhere.</p></div><div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-[#6f7b74]"><span className="h-1.5 w-1.5 rounded-full bg-[#b8e94f]" />Local simulation</div></div>
    <div className="grid gap-5 lg:grid-cols-[1.4fr_.8fr]"><section className="panel p-5 lg:p-7"><div className={`relative flex min-h-[310px] flex-col items-center justify-center border border-dashed px-6 text-center transition ${dragging ? "border-[#b8e94f] bg-[#b8e94f]/[.06]" : "border-white/15 bg-white/[.018] hover:border-white/30"}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); chooseFile(event.dataTransfer.files[0]); }}><div className="absolute inset-4 border border-white/[.03]" /><span className="relative flex h-14 w-14 items-center justify-center border border-[#b8e94f]/25 bg-[#b8e94f]/[.09] text-[#b8e94f]"><UploadCloud size={25} strokeWidth={1.5} /></span><h2 className="relative mt-6 font-display text-xl font-semibold text-white">Drop an audio file here</h2><p className="relative mt-2 text-sm text-[#77837c]">or <button onClick={() => inputRef.current?.click()} className="font-semibold text-[#b8e94f] underline decoration-[#b8e94f]/30 underline-offset-4 hover:text-[#d4ff8d]">browse files</button></p><p className="relative mt-5 font-mono text-[10px] uppercase tracking-[.16em] text-[#65716a]">MP3 · WAV · M4A · FLAC <span className="mx-2 text-[#3d4842]">/</span> max 250 MB</p><input ref={inputRef} type="file" accept=".mp3,.wav,.m4a,.flac,audio/*" className="hidden" onChange={(event) => chooseFile(event.target.files?.[0])} /></div>
      <div className="mt-5 flex items-center justify-between"><span className="text-xs text-[#68746e]">No file on hand?</span><button onClick={loadMock} className="inline-flex items-center gap-2 text-xs font-semibold text-[#aab5ae] transition hover:text-[#b8e94f]"><Sparkles size={14} />Use sample audio</button></div>
      {file && <div className="mt-6 border border-white/10 bg-[#151a18] p-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center bg-[#b8e94f]/10 text-[#b8e94f]"><FileAudio size={17} /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#e5ebe7]">{file.name}</p><p className="mt-1 font-mono text-[10px] text-[#75817a]">{file.size > 0 ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "2.4 MB"} · WAV · 02:48</p></div><button disabled={stageIndex >= 0} onClick={() => { setFile(null); setPlaying(false); }} className="flex h-8 w-8 items-center justify-center text-[#738078] transition hover:bg-[#ff6a5f]/10 hover:text-[#ff9b93] disabled:opacity-30" aria-label="Remove file"><Trash2 size={15} /></button></div><div className="mt-4 flex items-center gap-3"><button disabled={stageIndex >= 0} onClick={() => setPlaying((value) => !value)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#b8e94f]/30 text-[#b8e94f] transition hover:bg-[#b8e94f]/10 disabled:opacity-30" aria-label={playing ? "Pause preview" : "Play preview"}>{playing ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" className="ml-0.5" />}</button><div className="flex-1"><Waveform active={playing} progress={stageIndex >= 0 ? progress / 100 : 0} height={35} /></div><span className="font-mono text-[10px] text-[#68746e]">02:48</span></div></div>}
      <Button onClick={startAnalysis} disabled={!canAnalyze} className="mt-6 w-full py-3.5">{stageIndex >= 0 ? <><Loader2 size={16} className="animate-spin" />Analyzing audio · {Math.round(progress)}%</> : <><Sparkles size={16} />Analyze voice</>}</Button>
    </section><aside className="space-y-5"><section className="panel p-5 lg:p-6"><div className="flex items-start gap-3"><span className="flex h-8 w-8 items-center justify-center border border-[#6ee7c8]/20 bg-[#6ee7c8]/[.08] text-[#6ee7c8]"><Info size={15} /></span><div><SectionEyebrow>How it works</SectionEyebrow><h2 className="mt-2 font-display text-lg font-semibold text-white">Signal screening</h2></div></div><div className="mt-5 space-y-4">{["Measure spectral behavior", "Map prosody and pitch", "Compare synthetic markers"].map((label, index) => <div key={label} className="flex gap-3"><span className="font-mono text-[10px] text-[#b8e94f]">0{index + 1}</span><div><p className="text-xs font-semibold text-[#dce4df]">{label}</p><p className="mt-1 text-xs leading-5 text-[#75817a]">{["Looks for unnaturally uniform frequency bands.", "Checks cadence, stress, and micro-variation.", "Returns a confidence-weighted signal summary."][index]}</p></div></div>)}</div></section><section className="border border-[#b8e94f]/15 bg-[#b8e94f]/[.045] p-5"><div className="flex items-center gap-2 text-[#b8e94f]"><RefreshCw size={14} /><span className="text-[10px] font-semibold uppercase tracking-[.16em]">Prototype note</span></div><p className="mt-3 text-xs leading-5 text-[#a5b29d]">Results are simulated for interface demonstration only. No audio is uploaded or analyzed by a real model.</p></section></aside></div>
    {stageIndex >= 0 && <section className="panel mt-5 p-5 lg:p-6"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><SectionEyebrow>Live processing</SectionEyebrow><h2 className="mt-2 font-display text-lg font-semibold text-white">Building your confidence score</h2></div><span className="font-mono text-sm font-semibold text-[#b8e94f]">{Math.round(progress)}%</span></div><div className="mt-5 h-1.5 bg-white/8"><div className="h-full bg-[#b8e94f] transition-[width] duration-100" style={{ width: `${progress}%` }} /></div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{analysisStages.map((stage, index) => <div key={stage} className={`flex items-center gap-3 border p-3 ${index < stageIndex ? "border-[#b8e94f]/15 bg-[#b8e94f]/[.05]" : index === stageIndex ? "border-[#b8e94f]/30 bg-[#b8e94f]/[.08]" : "border-white/8 bg-white/[.018]"}`}><span className={`flex h-6 w-6 items-center justify-center font-mono text-[10px] ${index <= stageIndex ? "bg-[#b8e94f] text-[#101412]" : "border border-white/10 text-[#66726b]"}`}>{index < stageIndex ? "✓" : `0${index + 1}`}</span><span className={`text-xs ${index <= stageIndex ? "font-semibold text-[#dce4df]" : "text-[#69756f]"}`}>{stage}</span>{index === stageIndex && <Loader2 size={13} className="ml-auto animate-spin text-[#b8e94f]" />}</div>)}</div></section>}
  </div>;
}
