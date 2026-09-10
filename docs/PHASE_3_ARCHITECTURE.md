# Phase 3 — Frontend Architecture Refactor

## Goal
Create explicit boundaries between the security domain, demo data, UI primitives, and backend-facing actions while preserving the existing VoiceGuard routes and UI.

## New boundaries

```text
client/src/
├── core/types.ts                    # shared security domain contracts
├── data/mockData.ts                 # demo-only call/log fixtures
├── hooks/useSecurityMonitor.ts      # reusable live-call state/actions
├── services/securityApi.ts          # backend/telephony adapter boundary
└── components/security/
    └── SecurityPrimitives.tsx       # reusable panel/badge/section primitives
```

### `core/types.ts`
Single source for call state, authenticity, intent, risk, actions, logs, verification results, and security events. Future ML/backend payloads should map into these contracts at the boundary.

### `data/mockData.ts`
Demo fixtures are isolated from UI code. Replacing mock telemetry with real API data no longer requires editing presentation components.

### `services/securityApi.ts`
Defines the contract for call termination, verification requests, and OTP verification. The default implementation is a safe mock adapter; a real backend/telephony adapter can be registered with `configureSecurityApi()`.

### `hooks/useSecurityMonitor.ts`
Owns reusable live-call state transitions and security actions. This keeps asynchronous call-control behavior out of page rendering and gives Phase 4 a stable integration point for streaming telemetry.

### `components/security/SecurityPrimitives.tsx`
Extracts the most repeated visual primitives so new security-console pages can share the same Glass Cyber Command language without copying markup.

## Compatibility strategy

The existing `voiceguard.tsx` remains the compatibility shell during this phase. No routes, authentication flow, or current UI behavior are removed. Subsequent Phase 3 work can migrate page-by-page onto these boundaries instead of performing a risky all-at-once rewrite.

## Next migration targets

1. Move `Dashboard` and `Live Call` into dedicated page modules.
2. Replace inline `service` usage with `securityApi`.
3. Replace inline `liveCall`/`logs` fixtures with `data/mockData` imports.
4. Move shared shell/navigation primitives into `components/security`.
5. Keep backend/ML integration behind `services/` so real endpoints can replace mocks without redesigning the UI.
