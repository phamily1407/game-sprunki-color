# SPEC.md — Sprunki Color
# Game Design + Technical Specification

> Owner: Product Manager agent
> Status: v2.0 — approved
> Last updated: Sprint 1 Hotfix / v1.0.1

---

## 1. Game overview

### Vision
A zero-pressure creative toy for children aged 3–10 where painting a character's body parts and making music happen simultaneously. Every color choice is also a musical choice — the child composes without knowing it.

### Core loop
```
Select color → Tap a body part on the character → Body part fills with color
                                                 → Instrument starts playing
                                                 ↕ (tap again to unpaint)
                                                 → Instrument stops
```

### Design philosophy
- **No wrong answers** — every combination of colors sounds good together
- **Instant feedback** — sound starts the moment a body part is tapped
- **No instructions needed** — a 3-year-old can discover it by touching
- **Infinite replay** — erase and repaint endlessly
- **Parent-safe** — no ads, no in-app purchases in free tier, no dark themes

---

## 2. Characters & body parts

Each character has exactly **7 paintable body parts** matching the 7 colors:

| Zone ID | Body Part | Description |
|---|---|---|
| `face` | Face / Skin | The main face area — skin, cheeks, base color |
| `hair` | Hair | Hair, fur, leaves, or head decoration |
| `leftEye` | Left Eye | Left eye area |
| `rightEye` | Right Eye | Right eye area |
| `nose` | Nose | Nose area |
| `mouth` | Mouth | Mouth / smile area |
| `accessory` | Accessory | Hat, bow, flower, crown, or other head accessory |

### Blobby (Starter — unlocked by default)
- Shape: friendly round blob face
- Personality: always happy, big round eyes
- Accessory: cute bow on top of head

### Sprout (Starter — unlocked by default)
- Shape: round plant/leaf character
- Personality: curious, open mouth
- Hair: leaf-shaped hair crown
- Accessory: star flower on top

### Starby (Starter — unlocked by default)
- Shape: face with spiky star-shaped hair
- Personality: sparkly, playful
- Hair: crown of star points
- Accessory: small tiara

### Future characters (post-launch)
- Cloudy (cloud shape, puff hair)
- Finny (fish shape, fin hair)
- Dropy (raindrop shape, wavy hair)

---

## 3. Audio system

### Requirements
- All 7 loops: 90 BPM, C major, 8 bars, seamless loop
- Max simultaneous tracks: 7 (one per color)
- Fade in on play: 200ms
- Fade out on stop: 300ms
- Web: Howler.js (handles autoplay policy gracefully)
- Native: expo-av Sound objects
- All audio access goes through `src/audio/audioEngine.ts` — never directly

### Web audio policy handling
- Browser blocks autoplay until user gesture
- On first web load: show overlay "Tap anywhere to start music 🎵"
- After gesture: audio system initialised, overlay dismissed
- Native: no overlay needed

### Audio engine interface
```typescript
interface AudioEngine {
  preloadAll(): Promise<void>;
  playColor(color: PaintColor): void;
  stopColor(color: PaintColor): void;
  stopAll(): void;
  setMuted(muted: boolean): void;
  isReady(): boolean;
}
```

---

## 4. UI screens

### Screen 1 — Home (app/index.tsx)
**Purpose:** Character selection
**Elements:**
- App name "Sprunki Color 🎨" — large, playful font
- Subtitle "Tap a friend!" — 22px
- 3 character cards in a row (preview of character with all parts grey)
- Character name below each card
- Gallery button bottom right (🖼️)

**Interactions:**
- Tap character card → bounce animation → navigate to /paint/[id]
- Tap gallery → navigate to /gallery

### Screen 2 — Paint (app/paint/[character].tsx)
**Purpose:** Main game screen — paint body parts + music
**Layout (portrait):**
```
┌─────────────────────────────┐
│ 🏠  Sprunki Color    🔊 💾 │ 56px header
├─────────────────────────────┤
│                             │
│   [Character face — SVG]    │ flex:1
│  Hair / Eyes / Nose / Mouth │
│      / Face / Accessory     │
│                             │
├─────────────────────────────┤
│   ▮  ▯  ▮  ▯  ▮  ▯  ▮    │ 60px music visualizer
├─────────────────────────────┤
│ 🔴 🟡 🔵 🟢 🟣 🟠 ⚪  🧹  │ 96px color palette
└─────────────────────────────┘
```

**Interactions:**
- Tap color → select (highlighted ring)
- Tap unpainted body part → fill with color + instrument starts
- Tap painted body part → erase + instrument stops (if no other zone has same color)
- 🔊 button → mute/unmute toggle
- 💾 button → save to gallery
- 🏠 button → home (confirm if has unsaved changes)
- Native: haptic feedback on body part tap
- Zone tap feedback: brief opacity flash (0.45 → 1.0 spring) on the tapped part

### Screen 3 — Gallery (app/gallery.tsx)
**Purpose:** View saved paintings
**Elements:**
- Grid of saved character thumbnails (2 columns)
- Each shows character + painted body parts + timestamp
- Long press → delete option
- Empty state: "Save a painting to see it here! 🎨"

---

## 5. Data model

```typescript
type ZoneId = 'face' | 'hair' | 'leftEye' | 'rightEye' | 'nose' | 'mouth' | 'accessory';
type PaintColor = 'red' | 'yellow' | 'blue' | 'green' | 'purple' | 'orange' | 'white';
type ZoneState = Record<ZoneId, PaintColor | null>;

interface SavedPainting {
  id: string;
  characterId: string;
  zones: ZoneState;
  createdAt: string;
}

// Zone shape types
type ZoneShape =
  | { kind: 'circle';  cx: number; cy: number; r: number }
  | { kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
  | { kind: 'path';    d: string };

interface ZoneDefinition {
  id: ZoneId;
  label: string;
  shape: ZoneShape;
}

interface CharacterDef {
  id: string;
  name: string;
  emoji: string;
  viewBox: string;
  aspectRatio: number; // height / width
  zones: ZoneDefinition[];
}
```

---

## 6. Analytics events

```typescript
app_open          → { platform, version }
screen_view       → { screen_name }
character_selected → { character_id }
zone_painted      → { character_id, zone_id, color }
zone_erased       → { character_id, zone_id }
all_cleared       → { character_id }
painting_saved    → { character_id, zones_count }
audio_started     → { color, instrument }
audio_stopped     → { color, instrument }
audio_muted       → { }
audio_unmuted     → { }
audio_gate_shown     → { }
audio_gate_dismissed → { }
```

---

## 7. Non-functional requirements

| Requirement | Target |
|---|---|
| App cold start | < 3 seconds |
| Audio start latency | < 200ms after tap |
| Web bundle size | < 3MB total |
| Touch target size | Minimum 72×72px |
| Supported iOS | 15+ |
| Supported Android | API 26+ |
| Supported browsers | Chrome 90+, Safari 14+, Firefox 88+ |
| Offline | Full offline (PWA + native) |

---

## 8. Child safety requirements

- No user accounts, no PII collected
- No ads in free version
- No external links visible to children
- No dark/horror themes — ever
- COPPA compliant
- App Store: 4+ (iOS), Everyone (Android)

---

## 9. Color → instrument mapping

| Color | Hex | Instrument | Audio file |
|---|---|---|---|
| 🔴 Red | #FF4B4B | Drums | drum_loop.mp3 |
| 🟡 Yellow | #FFD700 | Guitar | guitar_loop.mp3 |
| 🔵 Blue | #4B9EFF | Piano | piano_loop.mp3 |
| 🟢 Green | #4BCC6A | Marimba | marimba_loop.mp3 |
| 🟣 Purple | #B44BFF | Synth | synth_loop.mp3 |
| 🟠 Orange | #FF8C00 | Bass | bass_loop.mp3 |
| ⚪ White | #F5F5F5 | Bell | bell_loop.mp3 |

---

## 10. Version history

| Version | Description |
|---|---|
| 1.0.0 | Initial: 3 characters, abstract zone painting, 7 colors |
| 1.0.1 | QA fixes: 72px touch targets, zone animation, analytics, audio guards |
| 1.1.0 | Body parts redesign: face/hair/eyes/nose/mouth/accessory per character |
| 1.2.0 | Gallery save/load, PWA offline |
| 2.0.0 | Premium characters, multiplayer |
