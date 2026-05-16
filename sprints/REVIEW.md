# QA REVIEW — Sprint 1 Hotfix (v1.0.1)
Date: 2026-05-16

---

## Fixes Verified ✅

- [F-01] `ColorPalette.tsx` lines 101–103: `colorBtn` and `eraserBtn` are now `width: sizes.touchMin` / `height: sizes.touchMin` (72px each). Visual circle matches touch target — confirmed fixed.
- [F-02] `paint/[character].tsx` line 48–50: `showGate` initialised to `Platform.OS === 'web' && !audioEngine.isReady()`. Returning web users who have already gestured skip the gate — confirmed fixed.
- [F-03] `paint/[character].tsx` lines 37–39: `characterId` resolved to a valid key before any hook runs — `rawCharacterId && CHARACTER_MAP[rawCharacterId] ? rawCharacterId : 'blobby'`. `character` is guaranteed non-undefined before hooks. `usePaintState` always receives a consistent, valid ID — confirmed fixed.
- [F-04] `audioEngine.ts` `NativeAudioEngine.playColor()` lines 162–163: `getStatusAsync()` checked; early return if `status.isLoaded && status.isPlaying` — double-play guard confirmed fixed.
- [F-05] `audioEngine.ts` `NativeAudioEngine.setMuted()` lines 201–204: On `muted === false`, iterates `this.activeColors` and calls `this.playColor(color)` for each — active sounds are resumed on unmute. `activeColors` is preserved as a snapshot during the mute path (lines 193–199) so the set is intact on unmute — confirmed fixed.
- [F-06] `paint/[character].tsx` line 99: `Alert.alert(...)` used for the unsaved-changes prompt — no `window.confirm`. `gallery.tsx` line 31 also uses `Alert.alert` for delete confirm — confirmed fixed on both screens.
- [F-07] `gallery.tsx` lines 174, 178: `cardDate` and `cardZones` now use `fontSize: sizes.font.xs`. `sizes.font.xs` is defined as `16` in `theme.ts` line 25 — no hardcoded values — confirmed fixed.
- [F-08] `ZoneOverlay.tsx` lines 33–38: `handlePress` triggers `fillOpacity.value = withSequence(withTiming(0.45, { duration: 70 }), withSpring(1, { damping: 6, stiffness: 200 }))` — visible bounce animation on every zone tap — confirmed fixed.
- [F-09] `ZoneOverlay.tsx` imports (lines 1–12): No `Platform` import, no `G` import, no dead reanimated hooks. Used imports are `useSharedValue`, `useAnimatedProps`, `withSequence`, `withTiming`, `withSpring` — all consumed. `Path` is the only SVG import — confirmed fixed.
- [F-10] `index.tsx` lines 25–31: `timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)`. `useEffect` cleanup returns `() => { if (timerRef.current) clearTimeout(timerRef.current); }`. Timer assigned to `timerRef.current` at line 44 — leak plugged — confirmed fixed.
- [F-11] All required analytics events confirmed firing:
  - `app_open` — `_layout.tsx` line 9 (`Analytics.appOpen()`)
  - `screen_view` — `index.tsx` line 71, `paint/[character].tsx` line 54, `gallery.tsx` line 73
  - `character_selected` — `index.tsx` line 38
  - `zone_painted` — `usePaintState.ts` line 69
  - `zone_erased` — `usePaintState.ts` line 57
  - `all_cleared` — `usePaintState.ts` line 80
  - `painting_saved` — `paint/[character].tsx` line 88
  - `audio_started` — `audioEngine.ts` lines 57, 168
  - `audio_stopped` — `audioEngine.ts` lines 65, 176
  - `audio_muted` — `paint/[character].tsx` line 76
  - `audio_unmuted` — `paint/[character].tsx` line 76
  - `audio_gate_shown` — `paint/[character].tsx` line 59
  - `audio_gate_dismissed` — `paint/[character].tsx` line 67
  All 13 required events confirmed — fixed.

---

## Still Failing ❌

None.

---

## Remaining Warnings ⚠️

- [W-02] `MusicVisualizer.tsx`: `Math.random()` called inside a `withSequence`/`withTiming` chain that may run in a Reanimated worklet context. `Math.random()` is not guaranteed available in the UI-thread worklet sandbox on all Reanimated 3 versions. Not yet tested on device.
- [W-03] `gallery.tsx` line 159: `maxWidth: '48%'` is a percentage string in `StyleSheet.create`. Can cause layout inconsistencies between platforms in some Expo SDK versions. A numeric calculation (`(windowWidth - padding) / 2`) would be more reliable.
- [W-04] `useStorage.ts` `getWebSessionCount()`: No session-level flag guards the increment. If the function is called more than once per session, the count increments multiple times, triggering the PWA install prompt earlier than the intended "3rd visit" threshold.
- [W-05] `paint/[character].tsx` `handleSave()`: `if (!hasChanges) return` guard is present (line 79), so blank paintings are blocked — this warning is now resolved. No action needed.
- [W-07] `audioEngine.ts` `WebAudioEngine.setMuted()`: On `setMuted(false)`, `Howler.mute(false)` is called, which re-enables global Howler output. However, if a zone was painted while muted, that color's `playColor()` returned early (line 53 guard `if (!sound.playing())`), so the sound was never started. Unmuting while zones are painted produces silence on web — the user must re-tap each zone. Mirrors the pre-fix native behavior. No fix has been applied to the web path.
- [W-09] `paint/[character].tsx`: Save success feedback changes the 💾 header icon to ✅ for 1.5s. FDD-002 specifies a bottom-of-screen toast "Saved! 🎨". The header-button substitution is not visible to a child looking at the canvas. Diverges from spec.

Note: W-01, W-06, W-08 have all been resolved (see Fixes Verified above for W-06 and W-08; W-01 is covered by the `stopSound()` helper in `audioEngine.ts` lines 140–152).

---

## Child Safety Check

- Touch targets: PASS — `ColorPalette` color circles and eraser are 72×72px (`sizes.touchMin`). All header buttons, gallery back button, and character cards confirm `width/height: sizes.touchMin` (72px). No touch target below 72px found.
- No fail states: PASS — No scores, timers, lives, or negative feedback found in any screen or component.
- No dark themes: PASS — Warm cream background (`#FFF9F0`), pastel palette throughout. No dark, violent, or disturbing imagery.
- No PII collection: PASS — No user accounts, no network calls, no personal data fields. Storage is local-only (AsyncStorage / localStorage). Analytics stub logs to console only; no SDK initialised yet.

---

## Verdict: PASS ✅

All 11 failures and all 3 selected warnings (W-01, W-06, W-08) are resolved. Four lower-priority warnings (W-02, W-03, W-04, W-07) and one spec-divergence (W-09) remain open and are candidates for Sprint 2.
