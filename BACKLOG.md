# BACKLOG.md — Sprunki Color
# Product Backlog

> Owner: PM
> Milestone: 1.0.0
> Last updated: 2026-05-16

---

## Milestone 1.0.0 — Launch

Target: v1.0.0 — "Paint music, make friends!"
Scope: 3 characters, 7 colors, core paint loop, gallery, PWA offline

---

## Epic E1 — Foundation

| ID | Story | Size | Sprint | Status |
|---|---|---|---|---|
| STORY-001 | Expo SDK 52 project scaffold (package.json, app.json, tsconfig.json, babel.config.js) | S | 1 | In Progress |
| STORY-002 | Design system constants: theme.ts, colorMap.ts, characters.ts | S | 1 | In Progress |
| STORY-003 | Audio engine abstraction: audioEngine.ts (Howler web + expo-av native) | M | 1 | In Progress |

---

## Epic E2 — Core Paint + Music Loop (FDD-001)

| ID | Story | Size | Sprint | Status |
|---|---|---|---|---|
| STORY-004 | usePaintState hook — zone state, active colors, paint/erase logic | S | 1 | In Progress |
| STORY-005 | usePlatform hook — web/native detection + usePlatformStorage | S | 1 | In Progress |
| STORY-006 | ColorPalette component — 7 color buttons + eraser, 72px targets | S | 1 | In Progress |
| STORY-007 | ZoneOverlay component — tap-to-paint zone with bounce animation | S | 1 | In Progress |
| STORY-008 | MusicVisualizer component — 7 animated bars (one per color) | S | 1 | In Progress |
| STORY-009 | Blobby SVG character — 8 paintable zones (head, body, arms, legs, ears) | M | 1 | In Progress |
| STORY-010 | Sprout SVG character — 8 paintable zones (head, stem, leaves, roots, petals) | M | 1 | In Progress |
| STORY-011 | Starby SVG character — 8 paintable zones (center, 5 star points, 2 eye zones) | M | 1 | In Progress |
| STORY-012 | SprunkiCharacter index — route to correct character by ID | S | 1 | In Progress |
| STORY-013 | Home screen — 3 character cards, title, gallery button, bounce on tap | S | 1 | In Progress |
| STORY-014 | Paint screen — full game loop: palette + character + visualizer + header | M | 1 | In Progress |
| STORY-015 | Web audio gate overlay — "Tap to start music!" on first web load | S | 1 | In Progress |
| STORY-016 | App layout + navigation (Expo Router _layout.tsx) | S | 1 | In Progress |

---

## Epic E3 — Gallery (FDD-002)

| ID | Story | Size | Sprint | Status |
|---|---|---|---|---|
| STORY-017 | useStorage hook — AsyncStorage (native) / localStorage (web), 20-painting max | S | 2 | Backlog |
| STORY-018 | Gallery screen — 2-column grid, save flow, delete, empty state | M | 2 | Backlog |

---

## Epic E4 — PWA + Polish (FDD-003)

| ID | Story | Size | Sprint | Status |
|---|---|---|---|---|
| STORY-019 | PWA manifest.json + service worker (offline-first caching) | M | 2 | Backlog |
| STORY-020 | PWA install banner — shown on 3rd web visit | S | 2 | Backlog |
| STORY-021 | Analytics events — all events from SPEC.md §6 via Firebase | S | 2 | Backlog |
| STORY-022 | Native haptic feedback on zone tap (expo-haptics) | XS | 2 | Backlog |

---

## Size legend

| Size | Effort |
|---|---|
| XS | < 1 hour |
| S | 1–3 hours |
| M | 3–6 hours |
| L | 6–12 hours |

---

## Story status values

`Backlog` → `In Progress` → `In Review` → `Done`
