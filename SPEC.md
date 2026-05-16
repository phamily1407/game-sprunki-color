# SPEC.md — Sprunki Color
# Game Design + Technical Specification

> Owner: Product Manager agent
> Status: v1.0 — approved
> Last updated: Sprint 0

---

## 1. Game overview

### Vision
A zero-pressure creative toy for children aged 3–10 where painting and music-making happen simultaneously. Every color choice is also a musical choice — the child composes without knowing it.

### Core loop
```
Select color → Tap zone on character → Zone fills with color
                                     → Instrument starts playing
                                     ↕ (tap again to unpaint)
                                     → Instrument stops
```

### Design philosophy
- **No wrong answers** — every combination of colors sounds good together
- **Instant feedback** — sound starts the moment a zone is tapped
- **No instructions needed** — a 3-year-old can discover it by touching
- **Infinite replay** — erase and repaint endlessly
- **Parent-safe** — no ads, no in-app purchases in free tier, no dark themes

---

## 2. Characters

### Blobby (Starter — unlocked by default)
- Shape: friendly round blob
- Paintable zones: head, body, left arm, right arm, left leg, right leg, left ear, right ear
- Expression: big round eyes, small smile — always happy
- Size on screen: fills 85% of canvas width

### Sprout (Starter — unlocked by default)
- Shape: plant/flower-like character with leaf arms
- Paintable zones: head, stem/body, left leaf, right leaf, roots/feet, flower top, left petal, right petal
- Expression: curious eyes, open mouth

### Starby (Starter — unlocked by default)
- Shape: 5-pointed star character
- Paintable zones: center body, top point, bottom-left point, bottom-right point, top-left point, top-right point, left eye zone, right eye zone

### Future characters (post-launch)
- Cloudy (cloud shape)
- Finny (fish shape)
- Dropy (raindrop shape)

---

## 3. Audio system

### Requirements
- All 7 loops must be: 90 BPM, C major, 8 bars, seamless loop
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
- 3 character cards in a row (all zones grey = unpainted preview)
- Character name below each card
- Gallery button bottom right (🖼️)
- Web: PWA install banner after 3rd visit

**Interactions:**
- Tap character card → bounce animation → navigate to /paint/[id]
- Tap gallery → navigate to /gallery

### Screen 2 — Paint (app/paint/[character].tsx)
**Purpose:** Main game screen — paint + music
**Layout (portrait):**
```
┌─────────────────────────────┐
│ 🏠  Sprunki Color    🔊 💾 │ 48px header
├─────────────────────────────┤
│                             │
│     [SprunkiCharacter]      │ 52% height
│                             │
├─────────────────────────────┤
│   ▮  ▯  ▮  ▯  ▮  ▯  ▮    │ 60px music visualizer
├─────────────────────────────┤
│ 🔴 🟡 🔵 🟢 🟣 🟠 ⚪  🧹  │ 96px color palette
└─────────────────────────────┘
```

**Interactions:**
- Tap color → select (highlighted ring)
- Tap unpainted zone → fill with color + instrument starts
- Tap painted zone → erase + instrument stops (if no other zone has same color)
- 🔊 button → mute/unmute toggle
- 💾 button → save to gallery
- 🏠 button → home (confirm if has unsaved changes)
- Native: haptic feedback on zone tap
- Web: extra-large bounce animation on zone tap

### Screen 3 — Gallery (app/gallery.tsx)
**Purpose:** View saved paintings
**Elements:**
- Grid of saved character thumbnails (2 columns)
- Each shows character + painted zones + timestamp
- Tap → view full size + replay music
- Long press → delete option
- Empty state: "Save a painting to see it here! 🎨"

---

## 5. Data model

```typescript
// Zone state
type ZoneId = string; // e.g. 'head', 'body', 'leftArm'
type PaintColor = 'red' | 'yellow' | 'blue' | 'green' | 'purple' | 'orange' | 'white';
type ZoneState = Record<ZoneId, PaintColor | null>;

// Saved painting
interface SavedPainting {
  id: string;             // uuid
  characterId: string;    // 'blobby' | 'sprout' | 'starby'
  zones: ZoneState;
  createdAt: string;      // ISO date string
  thumbnail?: string;     // base64 snapshot (future)
}

// Character definition
interface CharacterDef {
  id: string;
  name: string;
  zones: ZoneDefinition[];
}

interface ZoneDefinition {
  id: ZoneId;
  path: string;           // SVG path data
  label: string;          // accessibility label
  defaultColor: string;   // unpainted color
}
```

---

## 6. Analytics events

Log these events via Firebase Analytics. Every event must fire on both native and web.

```typescript
// App lifecycle
app_open          → { platform: 'ios' | 'android' | 'web', version: string }
screen_view       → { screen_name: string }

// Character
character_selected → { character_id: string }

// Painting
zone_painted      → { character_id, zone_id, color }
zone_erased       → { character_id, zone_id }
all_cleared       → { character_id }
painting_saved    → { character_id, zones_count: number }

// Audio
audio_started     → { color, instrument }
audio_stopped     → { color, instrument }
audio_muted       → { }
audio_unmuted     → { }

// Web specific
pwa_install_prompted → { }
pwa_installed        → { }
audio_gate_shown     → { }     // web autoplay overlay shown
audio_gate_dismissed → { }
```

---

## 7. Non-functional requirements

| Requirement | Target |
|---|---|
| App cold start | < 3 seconds |
| Audio start latency | < 200ms after tap |
| Web bundle size | < 3MB total |
| Web load time (3G) | < 5 seconds |
| Touch target size | Minimum 72x72px |
| Supported iOS | 15+ |
| Supported Android | API 26+ (Android 8) |
| Supported browsers | Chrome 90+, Safari 14+, Firefox 88+ |
| Offline | Full offline capability (PWA + native) |

---

## 8. Child safety requirements

- No user accounts required
- No personal data collected from children
- No ads in the free version
- No external links visible to children
- No dark/horror themes — ever
- No social features (no sharing PII)
- COPPA compliant (no data collection under 13)
- App Store rating: 4+ (iOS), Everyone (Android)

---

## 9. Monetisation (v1.1 — post-launch)

- Free tier: 3 characters, full features
- Premium ($1.99 one-time): 6 additional characters
- NO subscriptions, NO ads, NO consumable IAP
- Revenue via RevenueCat

---

## 10. Version history

| Version | Description |
|---|---|
| 1.0.0 | Initial release: 3 characters, 7 colors, paint + music |
| 1.1.0 | Gallery save/load, premium characters |
| 1.2.0 | Daily character (changes each day) |
| 2.0.0 | Multiplayer paint (2 children, same device) |
