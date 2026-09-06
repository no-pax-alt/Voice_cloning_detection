import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Check, CircleAlert, Download, FileAudio, MoreHorizontal, Play, Pause, X } from "lucide-react";
import { Link } from "wouter";
import { getToneColor, waveformHeights, type AnalysisResult } from "@/lib/mockData";

export type ToastKind = "success" | "info" | "warning";
interface ToastMessage { id: number; title: string; description?: string; kind: ToastKind; }
interface ToastContextValue { notify: (title: string, description?: string, kind?: ToastKind) => void; }
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const notify = (title: string, description?: string, kind: ToastKind = "success") => {
    const id = Date.now();
    setMessages((current) => [...current, { id, title, description, kind }]);
    window.setTimeout(() => setMessages((current) => current.filter((message) => message.id !== id)), 4200);
  };
  return <ToastContext.Provider value={{ notify }}>
    {children}
    <div className="fixed bottom-5 right-5 z-50 flex w-[min(360px,calc(100vw-40px))] flex-col gap-3">
      {messages.map((message) => <Toast key={message.id} message={message} onDismiss={() => setMessages((current) => current.filter((item) => item.id !== message.id))} />)}
    </div>
  </ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

function Toast({ message, onDismiss }: { message: ToastMessage; onDismiss: () => void }) {
  const Icon = message.kind === "success" ? Check : message.kind === "warning" ? CircleAlert : FileAudio;
  return <div className="toast-enter flex items-start gap-3 border border-white/10 bg-[#171b1a]/95 p-4 shadow-2xl backdrop-blur-xl">
    <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center ${message.kind === "success" ? "bg-[#b8e94f] text-[#101412]" : message.kind === "warning" ? "bg-[#f2b84b] text-[#1b170e]" : "bg-[#6ee7c8] text-[#0c1715]"}`}><Icon size={14} strokeWidth={2.5} /></span>
    <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-white">{message.title}</p>{message.description && <p className="mt-1 text-xs leading-5 text-[#9ca7a2]">{message.description}</p>}</div>
    <button onClick={onDismiss} aria-label="Dismiss notification" className="text-[#76817c] transition hover:text-white"><X size={15} /></button>
  </div>;
}

export function SectionEyebrow({ children }: { children: ReactNode }) { return <span className="eyebrow">{children}</span>; }

export function Button({ children, variant = "primary", className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return <button className={`ui-button inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold transition duration-200 active:scale-[.965] disabled:cursor-not-allowed disabled:opacity-50 ${variant === "primary" ? "bg-[#b8e94f] text-[#101412] shadow-[0_0_0_1px_rgba(184,233,79,.14),0_8px_24px_rgba(184,233,79,.08)] hover:bg-[#c8f46a]" : variant === "secondary" ? "border border-white/12 bg-white/[.045] text-[#e8edea] hover:border-white/25 hover:bg-white/[.08]" : variant === "danger" ? "border border-[#ff6a5f]/30 bg-[#ff6a5f]/10 text-[#ffaaa4] hover:bg-[#ff6a5f]/15" : "text-[#aab3ae] hover:bg-white/[.06] hover:text-white"} ${className}`} {...props}>{children}</button>;
}

export function StatusBadge({ result, compact = false }: { result: AnalysisResult; compact?: boolean }) {
  const isAi = result === "AI Detected";
  return <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${isAi ? "border-[#ff6a5f]/25 bg-[#ff6a5f]/10 text-[#ff9b93]" : "border-[#b8e94f]/20 bg-[#b8e94f]/10 text-[#c8f46a]"} ${compact ? "px-2 py-0.5 text-[10px]" : ""}`}><span className={`h-1.5 w-1.5 rounded-full ${isAi ? "bg-[#ff6a5f]" : "bg-[#b8e94f]"}`} />{result}</span>;
}

export function StatusDot({ status }: { status: string }) {
  const style = status === "Complete" ? "bg-[#b8e94f]" : status === "Processing" ? "bg-[#f2b84b] animate-pulse" : "bg-[#84908a]";
  return <span className="inline-flex items-center gap-2 text-xs text-[#9ca7a2]"><span className={`h-1.5 w-1.5 rounded-full ${style}`} />{status}</span>;
}

export function Waveform({ active = false, flagged = false, height = 70, progress = 0 }: { active?: boolean; flagged?: boolean; height?: number; progress?: number }) {
  return <div className="relative flex items-center gap-[3px] overflow-hidden" style={{ height }} aria-label="Audio waveform visualization">
    {waveformHeights.map((bar, index) => {
      const played = progress > 0 && index / waveformHeights.length < progress;
      const isFlagged = flagged && (index > 19 && index < 29 || index > 48 && index < 58 || index > 73 && index < 81);
      const variance = ((index * 17) % 11) - 5;
      return <span key={index} className={`wave-bar w-full min-w-[2px] rounded-full transition-colors duration-300 ${active ? "wave-bar-live" : ""} ${isFlagged ? "bg-[#ff6a5f]" : played || active ? "bg-[#b8e94f]" : "bg-[#42514a]"}`} style={{ height: `${Math.max(7, bar * (height / 76))}%`, opacity: isFlagged ? .95 : played || active ? .9 : .7, animationDelay: `${(index % 13) * -0.085}s`, animationDuration: `${0.55 + (index % 5) * 0.08}s`, transform: `scaleY(${1 + variance / 120})` }} />;
    })}
  </div>;
}

export function AudioPlayer({ fileName = "customer-support-call.wav", duration = "02:48" }: { fileName?: string; duration?: string }) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => { if (!playing) return; const timer = window.setTimeout(() => setPlaying(false), 2800); return () => window.clearTimeout(timer); }, [playing]);
  return <div className="flex items-center gap-4 border border-white/10 bg-white/[.025] px-4 py-3">
    <button onClick={() => setPlaying((value) => !value)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#b8e94f] text-[#101412] transition hover:bg-[#c8f46a]">{playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" className="ml-0.5" />}</button>
    <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#e8edea]">{fileName}</p><div className="mt-2"><Waveform active={playing} height={30} /></div></div>
    <span className="font-mono text-xs text-[#76817c]">{duration}</span>
  </div>;
}

export function ConfidenceGauge({ score, size = 220 }: { score: number; size?: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * (score / 100);
  return <div className="relative" style={{ width: size, height: size }}><svg viewBox="0 0 100 100" className="h-full w-full -rotate-90"><circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="8" strokeDasharray={`${circumference * .74} ${circumference * .26}`} strokeLinecap="round" /><circle cx="50" cy="50" r={radius} fill="none" stroke="#b8e94f" strokeWidth="8" strokeDasharray={`${dash * .74} ${circumference - dash * .74}`} strokeLinecap="round" /></svg><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="font-display text-4xl font-bold tracking-[-.05em] text-white">{score}%</span><span className="mt-1 text-[10px] font-semibold uppercase tracking-[.18em] text-[#87938d]">confidence</span></div></div>;
}

export function EmptyState({ query }: { query?: string }) { return <div className="flex min-h-[260px] flex-col items-center justify-center border border-dashed border-white/10 bg-white/[.015] px-6 text-center"><span className="mb-4 flex h-11 w-11 items-center justify-center border border-white/10 bg-white/[.04] text-[#76817c]"><FileAudio size={19} /></span><h3 className="text-sm font-semibold text-white">No analyses found</h3><p className="mt-2 max-w-xs text-xs leading-5 text-[#7f8984]">{query ? `Nothing matches “${query}”. Try a different search term.` : "Your completed voice analyses will appear here."}</p></div>; }

export function QuickLink({ href, icon: Icon, label, description }: { href: string; icon: typeof Download; label: string; description: string }) { return <Link href={href} className="group flex items-start gap-3 border border-white/8 bg-white/[.02] p-4 transition hover:border-[#b8e94f]/25 hover:bg-[#b8e94f]/[.035]"><span className="flex h-8 w-8 items-center justify-center border border-white/10 bg-white/[.035] text-[#b8e94f] transition group-hover:border-[#b8e94f]/30"><Icon size={15} /></span><span><strong className="block text-sm text-[#dce4df]">{label}</strong><span className="mt-1 block text-xs leading-5 text-[#78837d]">{description}</span></span></Link>; }

export function IconButton({ children, label, onClick }: { children: ReactNode; label: string; onClick?: () => void }) { return <button onClick={onClick} aria-label={label} title={label} className="flex h-9 w-9 items-center justify-center border border-white/10 text-[#84908a] transition hover:border-white/25 hover:bg-white/[.06] hover:text-white">{children}</button>; }

export function MoreMenu({ onSelect }: { onSelect: (value: string) => void }) { const [open, setOpen] = useState(false); return <div className="relative"><IconButton label="More actions" onClick={() => setOpen((value) => !value)}><MoreHorizontal size={16} /></IconButton>{open && <div className="absolute right-0 top-11 z-20 w-36 border border-white/10 bg-[#181d1b] py-1 shadow-2xl"><button onClick={() => { onSelect("report"); setOpen(false); }} className="w-full px-3 py-2 text-left text-xs text-[#adb8b2] hover:bg-white/[.06] hover:text-white">View report</button><button onClick={() => { onSelect("share"); setOpen(false); }} className="w-full px-3 py-2 text-left text-xs text-[#adb8b2] hover:bg-white/[.06] hover:text-white">Copy link</button></div>}</div>; }

export { getToneColor };
