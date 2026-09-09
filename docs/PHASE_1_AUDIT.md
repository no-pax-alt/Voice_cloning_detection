# VoiceShield — Phase 1 Frontend Architecture Audit

**Repository:** `no-pax-alt/Voice_cloning_detection`
**Branch:** `phase-1-audit`
**Baseline:** `main` at `0023928f6191e31b07aedfbc19f0aae4c9177160`

## 1. Current architecture

The repository already has a useful full-stack separation:

```text
client/
  src/
server/
shared/
```

The frontend is React + TypeScript + Vite. The package configuration already includes Framer Motion, Recharts, Lucide React, Axios, Wouter, Radix UI primitives, Tailwind CSS and related utilities.

The server is currently a lightweight Express static-file server with client-side route fallback. It does not currently expose a voice-analysis API in `server/index.ts`.

`shared/` currently contains only a small shared constants file, so it is a good future boundary for contracts/types shared between client and server without coupling UI code to model implementation.

## 2. Existing frontend entry flow

`client/src/App.tsx` is a thin root wrapper. It currently mounts `voiceguard.tsx` inside `ErrorBoundary` and `ToastProvider`.

`client/src/voiceguard.tsx` currently contains a large amount of application logic in one file, including:

- authentication UI and auth context
- navigation definitions
- shared UI primitives
- dashboard UI
- live-call concepts
- voice/risk domain types
- demo/mock call data
- mock service actions
- routing

This is functional but is the main architectural refactoring target for later phases.

## 3. Existing routes/pages

The current page layer includes:

- `Home.tsx`
- `Analyze.tsx`
- `AnalysisResult.tsx`
- `History.tsx`
- `Report.tsx`
- `Settings.tsx`
- `NotFound.tsx`

The monolithic `voiceguard.tsx` also defines additional routed screens and navigation concepts for live calls, threats, verification, logs, model intelligence, system health and notifications.

## 4. Reusable assets to preserve

### Preserve

- React 19 + TypeScript setup
- Vite development/build setup
- Wouter routing
- Error boundary
- Toast provider
- Existing auth abstraction
- Existing Lucide icon dependency
- Existing Framer Motion dependency
- Existing Recharts dependency
- Existing Radix UI primitives
- Existing page/domain concepts
- Existing server/client/shared separation

### Refactor rather than discard

- `voiceguard.tsx` should be decomposed into focused components, pages, hooks, state and service adapters.
- Existing mock call/risk types should become typed domain contracts rather than remain embedded in a UI component.
- Existing mock service actions should move behind a service interface so real backend/model endpoints can replace them later.
- Existing styling in `index.css` should be evaluated and selectively replaced/extended rather than creating a second competing styling system.

## 5. Current domain model

The existing frontend already defines useful security concepts:

- `VoiceAuthenticity`: `REAL`, `AI-GENERATED`, `UNKNOWN`, `ANALYZING`
- `CallIntent`: `LEGITIMATE`, `SUSPICIOUS`, `POTENTIAL FRAUD`, `CONFIRMED FRAUD`
- `RiskLevel`: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- `Action`: `ALLOW`, `VERIFY`, `WARN`, `BLOCK`, `TERMINATE`
- `CallState`: includes idle, connecting, monitoring, analyzing, suspicious, verifying, high-risk, terminating, terminated and ended states

`CallSnapshot` and `SecurityLog` already provide a useful starting point for the future API contract.

## 6. Mock/backend boundary

The current `service` object is a frontend mock implementation with actions for terminating a call, requesting verification and verifying an OTP.

Phase 2+ should move this behind an adapter such as:

```text
client/src/services/
  voiceAnalysis.ts
  callControl.ts
  securityEvents.ts

client/src/data/mock/
  calls.ts
  analytics.ts
  alerts.ts
  analysis.ts
```

The UI must depend on service interfaces, not directly on mock data. This allows the mock adapter to be replaced by REST/WebSocket/model-backed implementations later.

## 7. Target architecture after redesign

```text
client/src/
  app/
    routes/
    providers/
  components/
    layout/
    dashboard/
    live-analysis/
    forensics/
    threats/
    analytics/
    shared/
  pages/
    Dashboard.tsx
    LiveAnalysis.tsx
    VoiceForensics.tsx
    Threats.tsx
    History.tsx
    Reports.tsx
    SystemStatus.tsx
    Settings.tsx
  hooks/
    useLiveAnalysis.ts
    useThreatMonitoring.ts
    useSecurityEvents.ts
  services/
    api/
    mock/
  types/
    voice.ts
    threat.ts
    analysis.ts
    security.ts
  data/
    mock/
  lib/
  styles/
```

This is a target, not a requirement to mechanically recreate every directory. Existing working structures should be reused where sensible.

## 8. UI redesign direction

The target experience is a premium cybersecurity command center named **VoiceShield**:

**VOICE INPUT → AI ANALYSIS → THREAT ASSESSMENT → DECISION → PREVENTION**

Visual direction:

- deep navy / near-black foundation
- restrained glass panels
- thin borders
- cyan/teal/soft-blue primary accents
- green safe state
- amber suspicious state
- red high-risk state
- subtle grid/ambient lighting
- controlled motion
- no generic hacker aesthetic
- no excessive neon
- no unnecessary 3D elements

The live waveform should be a major visual element of the monitoring experience.

## 9. Functional target screens

The redesign should converge toward:

1. Mission Control / Overview
2. Live Analysis
3. Voice Forensics
4. Threat Detection
5. Explainable AI
6. History & Analytics
7. Reports
8. System Status
9. Settings

The existing navigation already contains many of these concepts, so this should be treated as consolidation and refinement rather than an entirely unrelated application.

## 10. Real-time monitoring requirements

The frontend architecture must support a future real-time stream containing, at minimum:

- live audio state
- waveform/level data
- transcript or call context
- voice authenticity probability
- threat/fraud probability
- confidence
- analysis status
- detected indicators
- security events
- recommended action
- call-control state

A future WebSocket/SSE implementation should be able to feed the same UI state used by the mock adapter.

## 11. Threat-response requirements

The UI must support high-risk states such as:

**POTENTIAL VOICE CLONE DETECTED**

with risk score, authenticity probabilities, confidence, reasons/evidence and actions such as:

- Block call
- Verify speaker
- View forensic analysis
- Terminate call state

Actual telephony termination must remain a backend/telephony responsibility; the frontend should represent and control the workflow through an API boundary.

## 12. Phase 1 conclusion

The repository is **not a blank frontend**. It already contains a functioning VoiceGuard-style security application and the dependencies required for the intended redesign.

The primary technical issue is not lack of capability; it is **concentration of application logic inside `client/src/voiceguard.tsx` and coupling between UI, domain state and mock services**.

Therefore the next implementation phase should focus on extracting the existing functionality into a maintainable architecture while simultaneously establishing the VoiceShield visual system. The existing working behavior should be preserved during that transition.

## 13. Phase 2 priorities

1. Establish the VoiceShield design tokens and global visual system.
2. Refactor the monolithic `voiceguard.tsx` incrementally.
3. Create reusable layout/navigation components.
4. Establish typed mock service adapters.
5. Build the Mission Control dashboard.
6. Keep all existing routes functional during migration.
7. Run TypeScript/build checks after each major extraction.
