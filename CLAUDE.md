# CLAUDE.md — Sprunki Color

> Global context file. Every agent reads this before doing anything.
> Do not modify without Product Manager approval.

---

## Project identity

**App name:** Sprunki Color
**Tagline:** Paint music, make friends!
**Type:** Mobile game + PWA (Progressive Web App)
**Target users:** Children aged 3–10 and their parents
**Platform:** iOS + Android + Mobile Web (1 codebase)
**Markets:** Southeast Asia (SG, MY, ID, PH, TH) + Global English

---

## Core concept

Tap a color → tap a zone on a Sprunki character → zone fills with color → instrument sound starts looping. More zones painted = more instruments = richer music. Unpaint a zone → that instrument stops. Pure creative play — no fail states, no timers, no scores.

---

## Tech stack

| Layer | Tool | Notes |
|---|---|---|
| Framework | Expo SDK 52 + React Native Web | 1 codebase → iOS + Android + Web |
| Language | TypeScript (strict mode) | No `any` types ever |
| Drawing | react-native-svg | SVG zone tap-to-paint, web compatible |
| Audio | Howler.js (web) + expo-av (native) | Via audioEngine.ts abstraction |
| Animation | react-native-reanimated 3 | Works on native + web |
| Navigation | Expo Router | File-based routing |
| Storage | useStorage hook | AsyncStorage (native) / localStorage (web) |
| Build app | EAS Build | iOS + Android |
| Build web | expo export --platform web | Deploy to Vercel |
| PWA | manifest.json + service worker | Installable on mobile browser |

### Banned libraries (web incompatible)
- ❌ react-native-skia — WASM too large for mobile web
- ❌ react-native-canvas — no web support
- ❌ expo-av directly in components — use audioEngine.ts only

---

## Project structure

```
sprunki-color/
├── CLAUDE.md                    ← this file
├── SPEC.md                      ← full game design spec
├── BACKLOG.md                   ← product backlog
├── CHANGELOG.md                 ← version history
├── RELEASE_NOTES.md             ← user-facing release notes
├── docs/
│   └── FDD.md                   ← functional design document
├── sprints/
│   ├── SPRINT_01.md
│   └── REVIEW.md
├── crew/
│   └── sprunki_color_crew.py    ← CrewAI team
├── app/
│   ├── _layout.tsx              ← root layout
│   ├── index.tsx                ← home screen
│   ├── paint/
│   │   └── [character].tsx      ← paint screen
│   └── gallery.tsx              ← saved creations
├── src/
│   ├── components/
│   │   ├── SprunkiCharacter/
│   │   │   ├── index.tsx
│   │   │   ├── Blobby.tsx       ← round blob character
│   │   │   ├── Sprout.tsx       ← plant character
│   │   │   └── Starby.tsx       ← star character
│   │   ├── ColorPalette.tsx
│   │   ├── MusicVisualizer.tsx
│   │   └── ZoneOverlay.tsx
│   ├── audio/
│   │   └── audioEngine.ts
│   ├── hooks/
│   │   ├── usePaintState.ts
│   │   ├── useStorage.ts
│   │   └── usePlatform.ts
│   └── constants/
│       ├── theme.ts
│       ├── colorMap.ts
│       └── characters.ts
├── assets/
│   ├── audio/                   ← 7 loop files (90 BPM, C major)
│   ├── fonts/
│   └── images/
├── public/
│   ├── manifest.json
│   └── icons/
├── app.json
├── eas.json
└── package.json
```

---

## Color → instrument mapping

| Color | Hex | Instrument | Audio file |
|---|---|---|---|
| 🔴 Red | #FF4B4B | Drums | drum_loop.mp3 |
| 🟡 Yellow | #FFD700 | Guitar | guitar_loop.mp3 |
| 🔵 Blue | #4B9EFF | Piano | piano_loop.mp3 |
| 🟢 Green | #4BCC6A | Marimba | marimba_loop.mp3 |
| 🟣 Purple | #B44BFF | Synth | synth_loop.mp3 |
| 🟠 Orange | #FF8C00 | Bass | bass_loop.mp3 |
| ⚪ White | #F5F5F5 | Bell | bell_loop.mp3 |

All loops: 90 BPM, C major, 8 bars, seamless loop.

---

## Design system

```typescript
// src/constants/theme.ts
export const colors = {
  bg: '#FFF9F0',
  card: '#FFFFFF',
  border: '#FFE0C0',
  text: '#2D1B00',
  textMuted: '#8A7060',
  accent: '#FF6B35',
  paint: {
    red: '#FF4B4B', yellow: '#FFD700', blue: '#4B9EFF',
    green: '#4BCC6A', purple: '#B44BFF', orange: '#FF8C00', white: '#F5F5F5',
  },
  zone: { unpainted: '#E8E0D8', outline: '#C8C0B8' },
};

export const sizes = {
  touchMin: 72,         // minimum touch target — NEVER go below this
  colorBtn: 72,
  radius: { sm: 12, md: 20, lg: 28, full: 999 },
  font: { sm: 18, md: 22, lg: 28, xl: 36, xxl: 48 },
  spacing: { xs: 6, sm: 12, md: 18, lg: 24, xl: 36 },
};
```

---

## Agent behaviour rules

When working on Sprunki Color, every agent must:

1. **Read this file first** — before writing a single line of code or doc
2. **Never use banned libraries** — check list above before installing anything
3. **Minimum 72px touch targets** — child-safety rule, non-negotiable
4. **Never hardcode colors** — always import from `theme.ts`
5. **Never call Howler or expo-av directly** — always use `audioEngine.ts`
6. **No fail states in UI** — this is creative play, not a test
7. **TypeScript strict** — no `any`, no `// @ts-ignore`
8. **Platform-safe always** — every feature must work on iOS + Android + Web
9. **Test on web** — run `npx expo start --web` before marking any task done
10. **Log all analytics events** — defined in SPEC.md events section

---

## Commands

```bash
# Development
npx expo start              # native (iOS/Android)
npx expo start --web        # web browser

# Type check
npx tsc --noEmit

# Tests
npx jest --passWithNoTests

# Build
eas build --platform all --profile production
npx expo export --platform web

# Deploy web
vercel deploy ./dist
```
