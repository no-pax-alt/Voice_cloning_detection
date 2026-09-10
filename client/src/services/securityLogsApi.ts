import type { SecurityLog } from "../core/types";
import { logs as mockLogs } from "../data/mockData";

export interface SecurityLogFilters {
  query?: string;
  risk?: "ALL" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  action?: "ALL" | SecurityLog["action"];
}

export interface SecurityLogsApi {
  list(filters?: SecurityLogFilters): Promise<SecurityLog[]>;
}

function filterLogs(items: SecurityLog[], filters: SecurityLogFilters = {}) {
  const query = filters.query?.trim().toLowerCase();
  return items.filter((item) => {
    const matchesQuery = !query || [item.id, item.callId, item.voice, item.intent, item.status].some((value) => value.toLowerCase().includes(query));
    const matchesRisk = !filters.risk || filters.risk === "ALL" || item.risk >= ({ LOW: 0, MEDIUM: 40, HIGH: 70, CRITICAL: 90 }[filters.risk]);
    const matchesAction = !filters.action || filters.action === "ALL" || item.action === filters.action;
    return matchesQuery && matchesRisk && matchesAction;
  });
}

export const mockSecurityLogsApi: SecurityLogsApi = {
  async list(filters) {
    return filterLogs(mockLogs, filters);
  },
};

let activeApi: SecurityLogsApi = mockSecurityLogsApi;

export function configureSecurityLogsApi(api: SecurityLogsApi) {
  activeApi = api;
}

export const securityLogsApi: SecurityLogsApi = {
  list: (filters) => activeApi.list(filters),
};
