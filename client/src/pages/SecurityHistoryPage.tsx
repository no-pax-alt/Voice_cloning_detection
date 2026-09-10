import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { SecurityShell } from "../components/security/SecurityShell";
import { SecurityLogTable } from "../components/security/SecurityLogTable";
import { Badge, SectionHead } from "../components/security/SecurityPrimitives";
import { useSecurityLogs } from "../hooks/useSecurityLogs";

export default function SecurityHistoryPage() {
  const [query, setQuery] = useState("");
  const [risk, setRisk] = useState<"ALL" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("ALL");
  const [action, setAction] = useState<"ALL" | "ALLOW" | "VERIFY" | "WARN" | "BLOCK" | "TERMINATE">("ALL");
  const filters = useMemo(() => ({ query, risk, action }), [query, risk, action]);
  const { logs, loading } = useSecurityLogs(filters);

  return <SecurityShell title="Security History" eyebrow="INCIDENT & DECISION HISTORY">
    <SectionHead eyebrow="AUDIT TRAIL" title="Security events" desc="Review voice authenticity decisions, intent classification and automated response actions from the security pipeline." action={<Badge tone="cyan"><SlidersHorizontal size={12} /> FILTERABLE</Badge>} />
    <div className="history-filters panel">
      <label className="search-field"><Search size={15} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search call ID, event, voice or intent…" /></label>
      <select value={risk} onChange={event => setRisk(event.target.value as typeof risk)}><option value="ALL">All risk levels</option><option value="LOW">Low+</option><option value="MEDIUM">Medium+</option><option value="HIGH">High+</option><option value="CRITICAL">Critical</option></select>
      <select value={action} onChange={event => setAction(event.target.value as typeof action)}><option value="ALL">All actions</option><option value="ALLOW">Allow</option><option value="VERIFY">Verify</option><option value="WARN">Warn</option><option value="BLOCK">Block</option><option value="TERMINATE">Terminate</option></select>
    </div>
    <SecurityLogTable logs={logs} loading={loading} />
  </SecurityShell>;
}
