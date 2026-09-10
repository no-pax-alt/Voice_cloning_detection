import type React from "react";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("panel", className)}>{children}</section>;
}

export function SectionHead({ eyebrow, title, desc, action }: { eyebrow: string; title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="section-head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        {desc && <p>{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function Badge({ children, tone = "cyan" }: { children: React.ReactNode; tone?: string }) {
  return <span className={cn("badge", `badge-${tone}`)}>{children}</span>;
}

export function Metric({ label, value, detail, tone = "cyan" }: { label: string; value: string; detail: string; tone?: string }) {
  return (
    <Panel className="metric">
      <div className="metric-label">{label}</div>
      <strong className={`text-${tone}`}>{value}</strong>
      <span>{detail}</span>
    </Panel>
  );
}

export function Waveform({ large = false }: { large?: boolean }) {
  return (
    <div className={cn("waveform", large && "waveform-large")} aria-label="Live audio waveform">
      {Array.from({ length: large ? 64 : 30 }, (_, i) => (
        <i key={i} style={{ height: `${18 + ((i * 29) % 68)}%`, animationDelay: `${i * -0.07}s` }} />
      ))}
    </div>
  );
}

export function RiskRing({ value }: { value: number }) {
  return (
    <div className="risk-ring" style={{ ["--risk" as string]: `${value * 3.6}deg` }}>
      <div><strong>{value}%</strong><span>COMBINED RISK</span></div>
    </div>
  );
}
