# Phase 3 — Frontend Architecture

## Status
Started on `phase-3-architecture` after Phase 2 was merged into `main`.

## First increment

The voice-security domain is now being separated from the monolithic `voiceguard.tsx`:

- `client/src/types/voice-security.ts` — shared domain contracts.
- `client/src/data/mock/voice-security.ts` — replaceable demo data.
- `client/src/services/voice-security.ts` — service boundary for live-call retrieval, audio analysis, verification, and call termination.

The existing UI remains intact while these boundaries are introduced incrementally. No fake backend integration is presented as real ML inference.

## Architecture target

`pages/components/hooks` → `services` → `API/WebSocket adapter` → real backend/ML/telephony.

Mock data remains isolated from production adapters so the real model and telephony service can be connected without rewriting the UI.

## Next increments

1. Move existing auth/navigation/layout primitives out of `voiceguard.tsx`.
2. Replace inline mock call/log declarations with the new typed data/service modules.
3. Add live-analysis state hooks and event contracts.
4. Add API/WebSocket adapters without coupling UI to transport details.
5. Keep automatic call termination as an explicit backend/telephony action surfaced through the service boundary.
