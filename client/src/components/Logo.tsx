import type { SVGProps } from "react";

export default function Logo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return <span className={`inline-flex items-center gap-3 ${className}`} aria-label="VoiceGuard">
    <svg width={compact ? 34 : 38} height={compact ? 34 : 38} viewBox="0 0 38 38" fill="none" role="img" aria-hidden="true">
      <rect x="1" y="1" width="36" height="36" fill="#B8E94F" />
      <path d="M19 7.5 29 11v7.4c0 6.2-4 10.6-10 13.1-6-2.5-10-6.9-10-13.1V11l10-3.5Z" fill="#101412" />
      <path d="M12.5 19.1h2.7l1.5-4 2.2 8 2-5.2 1.4 2.7h2.8" stroke="#B8E94F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30.5 4.5h4v4" stroke="#FF6A5F" strokeWidth="2.4" />
    </svg>
    {!compact && <span><span className="font-display block text-[15px] font-bold tracking-[-.02em] text-white">voiceguard</span><span className="font-mono block text-[8px] uppercase tracking-[.22em] text-[#6c7871]">forensic intelligence</span></span>}
  </span>;
}
