# SPRINT_01_HOTFIX.md — Sprunki Color
# Milestone 1.0.1 — QA Fix Sprint

> Sprint goal: Resolve all 11 QA failures from Sprint 1 review before v1.0.0 can ship.
> Source: sprints/REVIEW.md — Verdict: FAIL (11 failures, 9 warnings)
> Duration: 2026-05-16 (same day patch)
> Status: In Progress

---

## Why this sprint exists

Sprint 1 QA returned FAIL. No milestone ships with a FAIL verdict. This hotfix sprint
resolves every hard failure and selected high-priority warnings before v1.0.0 is tagged.

---

## Failures being fixed

| ID | Severity | File | Issue |
|---|---|---|---|
| F-01 | 🔴 Child-safety | `src/components/ColorPalette.tsx` | Color circles 52px — must be 72px |
| F-02 | 🔴 UX | `app/paint/[character].tsx` | Web audio gate always shown — ignores `isReady()` |
| F-03 | 🔴 Bug | `app/paint/[character].tsx` | Character ID fallback inconsistent before hooks |
| F-04 | 🔴 Audio | `src/audio/audioEngine.ts` | Native `playColor()` no double-play guard |
| F-05 | 🔴 Audio | `src/audio/audioEngine.ts` | Native `setMuted(false)` does not resume sounds |
| F-06 | 🟠 Compat | `app/paint/[character].tsx` | `window.confirm` blocked on iOS WKWebView |
| F-07 | 🟠 Design | `app/gallery.tsx` | Hardcoded font sizes 14px/12px below design system floor |
| F-08 | 🟠 UX | `src/components/ZoneOverlay.tsx` | Zone tap bounce animation not implemented |
| F-09 | 🟡 Code | `src/components/ZoneOverlay.tsx` | Unused imports (Platform, G, reanimated hooks) |
| F-10 | 🟠 Bug | `app/index.tsx` | `setTimeout` navigation not cleaned up on unmount |
| F-11 | 🔴 SPEC | all screens | Zero analytics events — mandatory SPEC §6 requirement |

---

## Warnings being fixed (selected)

| ID | File | Issue |
|---|---|---|
| W-01 | `audioEngine.ts` | Native `stopColor()` no playing-state guard |
| W-06 | `Blobby/Sprout/Starby.tsx` | Hardcoded hex colors — must use theme imports |
| W-08 | `usePaintState.ts` | No haptic feedback on native zone tap |

---

## New files

```
src/utils/analytics.ts   ← analytics event stubs (Firebase-ready interface)
```

---

## Modified files

```
src/constants/theme.ts                     ← add sizes.font.xs, colors.blush
src/audio/audioEngine.ts                   ← F-04, F-05, W-01 native engine fixes
src/hooks/usePaintState.ts                 ← W-08 haptics + analytics zone events
src/components/ColorPalette.tsx            ← F-01 circle size 52→72
src/components/ZoneOverlay.tsx             ← F-08 bounce animation, F-09 dead imports
src/components/SprunkiCharacter/Blobby.tsx ← W-06 theme colors
src/components/SprunkiCharacter/Sprout.tsx ← W-06 theme colors
src/components/SprunkiCharacter/Starby.tsx ← W-06 theme colors
app/_layout.tsx                            ← F-11 app_open event
app/index.tsx                              ← F-10 timeout cleanup, F-11 character_selected
app/paint/[character].tsx                  ← F-02 showGate, F-03 char guard, F-06 Alert, F-11 events
app/gallery.tsx                            ← F-07 font sizes
```

---

## Acceptance criteria (must all pass for QA PASS)

- [ ] `ColorPalette` visible circles are 72×72px
- [ ] Web audio gate does not show on return visits (audioEngine.isReady() respected)
- [ ] No `window.confirm` calls — all confirmations use `Alert.alert`
- [ ] Native `playColor()` guards against double-play
- [ ] Native `setMuted(false)` resumes all active sounds
- [ ] Zone tap shows visual bounce (fillOpacity flash + spring)
- [ ] No hardcoded font sizes below `sizes.font.xs` in gallery
- [ ] All SPEC §6 analytics events fire (logged to console in dev)
- [ ] Haptic feedback fires on native zone tap
- [ ] No hardcoded hex colors in SVG character files
- [ ] `setTimeout` in index.tsx properly cleaned up
- [ ] `npx tsc --noEmit` passes with 0 errors
- [ ] QA re-review: PASS ✅

---

## Standup log

### 2026-05-16
- **Done:** Sprint 1 QA review (FAIL — 11 failures, 9 warnings)
- **Doing:** All 11 failures + 3 warnings fixed in same session
- **Blocked:** None
