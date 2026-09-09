export type Role = "ADMIN" | "ANALYST" | "VIEWER";
export interface User { id: string; name: string; email: string; role: Role; }
export interface AuthSession { user: User; token: string; }

const demoUsers: Record<string, { password: string; user: User }> = {
  "admin@voiceguard.local": { password: "admin123", user: { id: "usr-admin", name: "Asha Rao", email: "admin@voiceguard.local", role: "ADMIN" } },
  "analyst@voiceguard.local": { password: "analyst123", user: { id: "usr-analyst", name: "Analyst Review", email: "analyst@voiceguard.local", role: "ANALYST" } },
  "viewer@voiceguard.local": { password: "viewer123", user: { id: "usr-viewer", name: "Read Only Observer", email: "viewer@voiceguard.local", role: "VIEWER" } },
};

export async function signIn(email: string, password: string): Promise<AuthSession> {
  await new Promise(resolve => setTimeout(resolve, 350));
  const record = demoUsers[email.trim().toLowerCase()];
  if (!record || record.password !== password) throw new Error("Invalid email or password");
  return { user: record.user, token: `mock-session-${record.user.id}` };
}
export function canAccess(role: Role, permission: "VIEW" | "ANALYZE" | "VERIFY" | "TERMINATE" | "ADMIN") {
  if (role === "ADMIN") return true;
  if (permission === "VIEW") return true;
  if (role === "ANALYST") return permission !== "ADMIN";
  return false;
}
export const demoAccounts = [
  { role: "ADMIN" as Role, email: "admin@voiceguard.local", password: "admin123", label: "Full access" },
  { role: "ANALYST" as Role, email: "analyst@voiceguard.local", password: "analyst123", label: "Monitor and respond" },
  { role: "VIEWER" as Role, email: "viewer@voiceguard.local", password: "viewer123", label: "Read-only access" },
];
