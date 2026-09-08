import { Bell, ChevronDown, CircleHelp, FileSearch, History, LayoutDashboard, Menu, ScanLine, Settings2, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, type ReactNode } from "react";
import { useToast } from "@/components/Shared";
import Logo from "@/components/Logo";

const mainNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/analyze", label: "New analysis", icon: ScanLine },
  { href: "/history", label: "Analysis history", icon: History },
];

export default function VoiceGuardLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { notify } = useToast();
  const pageLabel = location === "/dashboard" ? "Overview" : location === "/analyze" ? "New analysis" : location.startsWith("/analysis") ? "Analysis result" : location.startsWith("/report") ? "Report" : location === "/settings" ? "Settings" : "Analysis history";

  return <div className="min-h-screen bg-[#0d1110] text-[#e8edea]">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-white/8 bg-[#111614] px-4 py-5 transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center justify-between px-2"><Link href="/dashboard" onClick={() => setMobileOpen(false)}><Logo /></Link><button className="text-[#7a8580] lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18} /></button></div>
      <div className="my-8 border-t border-white/8" />
      <p className="px-3 text-[10px] font-semibold uppercase tracking-[.2em] text-[#68746e]">Workspace</p>
      <nav className="mt-3 space-y-1">{mainNav.map((item) => { const active = location === item.href || (item.href === "/history" && location.startsWith("/report")); const Icon = item.icon; return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`group flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm transition ${active ? "border-[#b8e94f] bg-[#b8e94f]/[.08] text-white" : "border-transparent text-[#8b9690] hover:bg-white/[.04] hover:text-white"}`}><Icon size={16} className={active ? "text-[#b8e94f]" : "text-[#77847d] group-hover:text-[#b8e94f]"} /><span>{item.label}</span>{item.label === "New analysis" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#b8e94f]" />}</Link>; })}</nav>
      <p className="mt-8 px-3 text-[10px] font-semibold uppercase tracking-[.2em] text-[#68746e]">Manage</p>
      <nav className="mt-3 space-y-1"><Link href="/settings" onClick={() => setMobileOpen(false)} className={`group flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm transition ${location === "/settings" ? "border-[#b8e94f] bg-[#b8e94f]/[.08] text-white" : "border-transparent text-[#8b9690] hover:bg-white/[.04] hover:text-white"}`}><Settings2 size={16} className="text-[#77847d] group-hover:text-[#b8e94f]" /><span>Settings</span></Link><button onClick={() => notify("Help center is coming soon", "Connect your workspace docs when the backend is enabled.", "info")} className="group flex w-full items-center gap-3 border-l-2 border-transparent px-3 py-2.5 text-sm text-[#8b9690] transition hover:bg-white/[.04] hover:text-white"><CircleHelp size={16} className="text-[#77847d] group-hover:text-[#b8e94f]" /><span>Help center</span></button></nav>
      <div className="mt-auto border border-white/8 bg-[#151a18] p-3"><div className="flex items-center justify-between"><span className="eyebrow">Plan status</span><span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#b8e94f]"><span className="h-1.5 w-1.5 rounded-full bg-[#b8e94f]" />Active</span></div><p className="mt-3 text-xs text-[#b4beb8]">Detection • Reliability • Risk</p><div className="mt-2 h-1 bg-white/8"><div className="h-full w-[68%] bg-[#b8e94f]" /></div><div className="mt-2 flex justify-between font-mono text-[10px] text-[#76817c]"><span>AI-powered analysis</span><span>Real-time risk decisioning</span></div></div>
      <div className="mt-4 flex items-center gap-3 border-t border-white/8 px-2 pt-4"><div className="flex h-8 w-8 items-center justify-center bg-[#29413a] font-display text-xs font-bold text-[#b8e94f]">JD</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-[#dce4df]">VOICEGUARD</p><p className="truncate text-[10px] text-[#6f7c75]">AI Voice Authenticity Platform</p></div><ChevronDown size={14} className="text-[#718078]" /></div>
    </aside>
    {mobileOpen && <button className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" />}
    <div className="lg:pl-[248px]"><header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-white/8 bg-[#0d1110]/90 px-5 backdrop-blur-xl lg:px-8"><div className="flex items-center gap-3"><button className="flex h-9 w-9 items-center justify-center border border-white/10 text-[#a0aaa4] lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={18} /></button><div className="hidden items-center gap-2 text-xs text-[#69756f] sm:flex"><FileSearch size={14} /><span>Workspace</span><span className="text-[#3b4641]">/</span><span className="text-[#b7c0bb]">{pageLabel}</span></div><div className="sm:hidden"><span className="font-display text-sm font-bold text-white">{pageLabel}</span></div></div><div className="flex items-center gap-3"><span className="hidden items-center gap-2 border border-[#b8e94f]/15 bg-[#b8e94f]/[.06] px-2.5 py-1.5 text-[10px] font-semibold text-[#c8f46a] sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#b8e94f] shadow-[0_0_8px_#b8e94f]" />All systems nominal</span><button onClick={() => notify("You're all caught up", "No new workspace notifications.", "info")} className="relative flex h-9 w-9 items-center justify-center border border-white/10 text-[#919c95] transition hover:border-white/25 hover:bg-white/[.05] hover:text-white" aria-label="Notifications"><Bell size={16} /><span className="absolute right-2 top-2 h-1.5 w-1.5 bg-[#ff6a5f]" /></button><Link href="/settings" className="flex h-9 w-9 items-center justify-center bg-[#29413a] font-display text-xs font-bold text-[#b8e94f] transition hover:bg-[#35574b]">JD</Link></div></header><main className="min-h-[calc(100vh-68px)] px-5 py-7 lg:px-8 lg:py-9">{children}</main></div>
  </div>;
}

