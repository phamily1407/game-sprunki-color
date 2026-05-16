# FDD.md — Functional Design Document
# Sprunki Color

> Owner: Tech Writer / PM agent
> Each feature gets one section. Written BEFORE dev starts.

---

## FDD-001 — Core paint + music loop

**Status:** Ready for development
**Sprint:** 1
**Stories:** Covers home screen, paint screen, zone painting, audio engine

### User flow
```
App opens
  → Home screen loads 3 character cards
  → Child taps Blobby
  → Paint screen opens — Blobby shown with all zones grey
  → Child taps 🔴 Red color
  → Red color circle shows selected (scale 1.15, white ring)
  → Child taps Blobby's body zone
  → Body zone fills red instantly
  → Drum loop starts immediately (< 200ms latency)
  → Child taps another zone
  → Another instrument layers in
  → Child taps the red zone again
  → Zone goes back to grey
  → Drums stop (if no other red zone exists)
```

### Component tree
```
PaintScreen
  ├── Header (home + mute + save buttons)
  ├── SprunkiCharacter (character-specific SVG)
  │   └── [ZoneOverlay per zone]
  ├── MusicVisualizer (7 animated bars)
  └── ColorPalette (7 color circles + eraser)
```

### Zone painting logic
```
ON zone tap:
  1. Get currently selected color
  2. Get current zone state (painted or not)

  IF zone is unpainted:
    → Set zone to selected color
    → Add color to active set
    → If color not already in active set → audioEngine.playColor(color)
    → Trigger bounce animation on zone
    → Trigger haptic (native only)

  IF zone is painted:
    → Set zone to null (erase)
    → Remove from zone state
    → Recount active zones with this color
    → If count === 0 → audioEngine.stopColor(color)
    → Trigger fade animation on zone

  IF eraser selected:
    → Same as "zone is painted" path above
```

### Audio smart deduplication
```
Problem: 3 zones painted red → erase 1 → drums should NOT stop
Solution: activeColors = Set derived from all zones
  activeColors = new Set(Object.values(zones).filter(Boolean))
  
  On erase:
    const newZones = { ...zones, [zoneId]: null }
    const newActiveColors = new Set(Object.values(newZones).filter(Boolean))
    if (!newActiveColors.has(color)) → audioEngine.stopColor(color)
```

### Web audio gate (web only)
```
On web mount:
  IF audioEngine.isReady() === false:
    Show overlay: full screen, semi-transparent warm cream
    Content: large 🎵 emoji + "Tap to start music!" text
    On tap: audioEngine.preloadAll() → overlay fades out
  
  IF audioEngine.isReady() === true:
    No overlay needed (returning user who already gestured)
```

---

## FDD-002 — Gallery (save + load paintings)

**Status:** Planned
**Sprint:** 2
**Stories:** Save painting, view gallery, delete painting

### Save flow
```
Tap 💾 button:
  1. Generate id = uuid()
  2. SavedPainting = { id, characterId, zones, createdAt }
  3. useStorage.savePainting(painting)
  4. Show success toast: "Saved! 🎨" (1.5s, bottom of screen)
```

### Gallery screen
```
Load: useStorage.listSavedPaintings() sorted by createdAt desc
Display: 2-column grid
Each card:
  - Shows character SVG with saved zone colors applied
  - Character name + date
  - Tap → fullscreen view + resume music
  - Long press → delete confirm dialog
```

### Storage schema
```
Key format: painting_{id}
Value: JSON.stringify(SavedPainting)

List key: painting_index (array of ids in order)
Max saved: 20 paintings (oldest deleted if exceeded)
```

---

## FDD-003 — PWA + offline support

**Status:** Planned
**Sprint:** 2

### PWA requirements
- manifest.json with name, icons, theme_color
- Service worker: cache all assets on first load
- Offline: full game works offline after first visit
- Install prompt: shown after 3rd web visit

### Install prompt logic
```
sessionCount = localStorage.getItem('session_count') || 0
sessionCount++
localStorage.setItem('session_count', sessionCount)

IF sessionCount === 3:
  Show bottom banner: "Add to home screen for the best experience! ➕"
  Banner has: Add button + Dismiss button
  IF Add clicked: window.deferredPrompt.prompt()
  IF Dismiss: set 'pwa_dismissed' flag, never show again
```

---

## FDD-004 — Premium characters (v1.1)

**Status:** Future — do not implement in v1.0
**Sprint:** TBD

3 additional characters: Cloudy, Finny, Dropy.
Locked by default — show with lock icon overlay.
Tap locked character → RevenueCat purchase flow → $1.99 one-time.
After purchase: all 3 unlocked permanently.
