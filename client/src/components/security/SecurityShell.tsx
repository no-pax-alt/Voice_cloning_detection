import type React from "react";
import { Activity, Bell, Shield } from "lucide-react";

export function SecurityShell({ title, eyebrow = "SECURITY OPERATIONS", children }: { title: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Shield size={18} /></div><div><b>VOICE<span>GUARD</span></b><small>REAL-TIME VOICE SECURITY</small></div></div>
        <div className="mode"><span className="dot" /> PHASE 3 <span>ARCHITECTURE</span></div>
        <nav>
          <div className="nav-group"><label>EXTRACTED PAGES</label><a href="/migration/dashboard">Overview</a><a href="/migration/live-call">Live Call</a></div>
          <div className="nav-group"><label>PLATFORM</label><a href="/dashboard">Legacy command center</a></div>
        </nav>
        <div className="sidebar-foot"><div className="secure"><Activity size={14} /><span><b>Architecture active</b><small>Mock API boundary ready</small></span></div></div>
      </aside>
      <main className="main">
        <header className="topbar"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1></div><div className="top-actions"><span className="top-service"><span className="dot" /> AI ENGINE <b>ONLINE</b></span><button className="icon-button" aria-label="Notifications"><Bell size={17} /></button><div className="avatar">VG</div></div></header>
        <div className="content animate-page">{children}</div>
      </main>
    </div>
  );
}
