import { useEffect, useState } from "react";
import type { SecurityLog } from "../core/types";
import { securityLogsApi, type SecurityLogFilters } from "../services/securityLogsApi";

export function useSecurityLogs(filters: SecurityLogFilters = {}) {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    securityLogsApi.list(filters).then((result) => {
      if (active) setLogs(result);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [filters.query, filters.risk, filters.action]);

  return { logs, loading };
}
