# SPRINT_01.md — Sprunki Color
# Sprint 1: Core Paint + Music Loop

> Sprint goal: A child can open the app, pick a character, paint zones, and hear layered music.
> Duration: 2026-05-16 → 2026-05-30
> Status: In Progress

---

## Stories in this sprint

| ID | Story | Size | Owner | Status |
|---|---|---|---|---|
| STORY-001 | Expo SDK 52 project scaffold | S | Dev | In Progress |
| STORY-002 | Design system constants | S | Dev | In Progress |
| STORY-003 | Audio engine abstraction | M | Dev | In Progress |
| STORY-004 | usePaintState hook | S | Dev | In Progress |
| STORY-005 | usePlatform hook | S | Dev | In Progress |
| STORY-006 | ColorPalette component | S | Dev | In Progress |
| STORY-007 | ZoneOverlay component | S | Dev | In Progress |
| STORY-008 | MusicVisualizer component | S | Dev | In Progress |
| STORY-009 | Blobby SVG character | M | Dev | In Progress |
| STORY-010 | Sprout SVG character | M | Dev | In Progress |
| STORY-011 | Starby SVG character | M | Dev | In Progress |
| STORY-012 | SprunkiCharacter index | S | Dev | In Progress |
| STORY-013 | Home screen | S | Dev | In Progress |
| STORY-014 | Paint screen | M | Dev | In Progress |
| STORY-015 | Web audio gate overlay | S | Dev | In Progress |
| STORY-016 | App layout + navigation | S | Dev | In Progress |

---

## Acceptance criteria (sprint-level)

- [ ] `npx expo start --web` loads without errors
- [ ] Home screen shows 3 character cards (Blobby, Sprout, Starby)
- [ ] Tapping a character navigates to paint screen
- [ ] Selecting a color highlights it with a white ring
- [ ] Tapping an unpainted zone fills it with color and starts audio
- [ ] Tapping a painted zone erases it; audio stops if no other zone has same color
- [ ] Music visualizer animates for each active color
- [ ] Mute/unmute button works
- [ ] Web audio gate overlay appears on first web load
- [ ] All touch targets >= 72px
- [ ] TypeScript strict — `npx tsc --noEmit` passes with 0 errors
- [ ] No `any` types anywhere

---

## File scope

### New files — Sprint 1

```
package.json
app.json
tsconfig.json
babel.config.js
metro.config.js
expo-env.d.ts
.gitignore (update)
assets/audio/                     ← placeholder (real audio in Sprint 2)
src/constants/theme.ts
src/constants/colorMap.ts
src/constants/characters.ts
src/audio/audioEngine.ts
src/hooks/usePlatform.ts
src/hooks/usePaintState.ts
src/hooks/useStorage.ts
src/components/ColorPalette.tsx
src/components/MusicVisualizer.tsx
src/components/ZoneOverlay.tsx
src/components/SprunkiCharacter/index.tsx
src/components/SprunkiCharacter/Blobby.tsx
src/components/SprunkiCharacter/Sprout.tsx
src/components/SprunkiCharacter/Starby.tsx
app/_layout.tsx
app/index.tsx
app/paint/[character].tsx
app/gallery.tsx
```

### Out of scope — Sprint 1

```
public/manifest.json              ← Sprint 2 (PWA)
public/sw.js                      ← Sprint 2 (service worker)
crew/                             ← do not modify
docs/                             ← do not modify
SPEC.md, CLAUDE.md, BACKLOG.md   ← do not modify
```

---

## Standup log

### 2026-05-16
- **Done:** BACKLOG.md, SPRINT_01.md, project scaffold initiated
- **Doing:** Building Expo project files + all Sprint 1 source code
- **Blocked:** None

---

## Retro

_To be written after sprint close._
