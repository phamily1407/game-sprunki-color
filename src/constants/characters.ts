import { colors } from './theme';

export type ZoneId = 'face' | 'hair' | 'leftEye' | 'rightEye' | 'nose' | 'mouth' | 'accessory';

export type ZoneShape =
  | { kind: 'circle';  cx: number; cy: number; r: number }
  | { kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
  | { kind: 'path';    d: string };

export interface ZoneDefinition {
  id: ZoneId;
  label: string;
  shape: ZoneShape;
}

export interface CharacterDef {
  id: string;
  name: string;
  emoji: string;
  viewBox: string;
  aspectRatio: number; // SVG height / width
  zones: ZoneDefinition[];
}

// ── Blobby — round happy blob face ───────────────────────────────────────
const blobbyZones: ZoneDefinition[] = [
  {
    id: 'face',
    label: 'Face',
    shape: { kind: 'ellipse', cx: 100, cy: 122, rx: 82, ry: 85 },
  },
  {
    id: 'hair',
    label: 'Hair',
    shape: {
      kind: 'path',
      d: 'M18,108 Q100,18 182,108 Q158,68 100,62 Q42,68 18,108 Z',
    },
  },
  {
    id: 'leftEye',
    label: 'Left eye',
    shape: { kind: 'circle', cx: 68, cy: 108, r: 22 },
  },
  {
    id: 'rightEye',
    label: 'Right eye',
    shape: { kind: 'circle', cx: 132, cy: 108, r: 22 },
  },
  {
    id: 'nose',
    label: 'Nose',
    shape: { kind: 'ellipse', cx: 100, cy: 138, rx: 14, ry: 10 },
  },
  {
    id: 'mouth',
    label: 'Mouth',
    shape: {
      kind: 'path',
      d: 'M65,155 Q100,185 135,155 Q118,168 100,170 Q82,168 65,155 Z',
    },
  },
  {
    id: 'accessory',
    label: 'Bow',
    shape: {
      kind: 'path',
      d: 'M80,42 C62,22 56,50 82,50 C88,46 88,42 84,40 Z M120,42 C138,22 144,50 118,50 C112,46 112,42 116,40 Z M87,46 C92,56 108,56 113,46 C108,40 92,40 87,46 Z',
    },
  },
];

// ── Sprout — round plant/leaf character ──────────────────────────────────
const sproutZones: ZoneDefinition[] = [
  {
    id: 'face',
    label: 'Face',
    shape: { kind: 'ellipse', cx: 100, cy: 130, rx: 75, ry: 75 },
  },
  {
    id: 'hair',
    label: 'Leaf hair',
    shape: {
      kind: 'path',
      d: 'M100,55 C80,28 42,35 48,68 C52,88 78,88 100,78 C122,88 148,88 152,68 C158,35 120,28 100,55 Z',
    },
  },
  {
    id: 'leftEye',
    label: 'Left eye',
    shape: { kind: 'circle', cx: 74, cy: 118, r: 20 },
  },
  {
    id: 'rightEye',
    label: 'Right eye',
    shape: { kind: 'circle', cx: 126, cy: 118, r: 20 },
  },
  {
    id: 'nose',
    label: 'Nose',
    shape: { kind: 'circle', cx: 100, cy: 142, r: 10 },
  },
  {
    id: 'mouth',
    label: 'Mouth',
    shape: {
      kind: 'path',
      d: 'M68,160 Q100,182 132,160 Q115,172 100,174 Q85,172 68,160 Z',
    },
  },
  {
    id: 'accessory',
    label: 'Flower',
    shape: {
      kind: 'path',
      d: 'M100,22 L104,35 L117,32 L108,42 L115,55 L100,48 L85,55 L92,42 L83,32 L96,35 Z',
    },
  },
];

// ── Starby — star-haired sparkle character ───────────────────────────────
const starbyZones: ZoneDefinition[] = [
  {
    id: 'face',
    label: 'Face',
    shape: { kind: 'ellipse', cx: 100, cy: 118, rx: 70, ry: 68 },
  },
  {
    id: 'hair',
    label: 'Star hair',
    shape: {
      kind: 'path',
      d: 'M100,50 L112,78 L142,70 L120,88 L130,118 L100,102 L70,118 L80,88 L58,70 L88,78 Z',
    },
  },
  {
    id: 'leftEye',
    label: 'Left eye',
    shape: { kind: 'circle', cx: 76, cy: 110, r: 19 },
  },
  {
    id: 'rightEye',
    label: 'Right eye',
    shape: { kind: 'circle', cx: 124, cy: 110, r: 19 },
  },
  {
    id: 'nose',
    label: 'Nose',
    shape: { kind: 'ellipse', cx: 100, cy: 132, rx: 11, ry: 9 },
  },
  {
    id: 'mouth',
    label: 'Mouth',
    shape: {
      kind: 'path',
      d: 'M72,150 Q100,170 128,150 Q112,162 100,163 Q88,162 72,150 Z',
    },
  },
  {
    id: 'accessory',
    label: 'Tiara',
    shape: {
      kind: 'path',
      d: 'M76,60 L80,50 L84,60 L92,54 L96,64 L100,56 L104,64 L108,54 L116,60 L120,50 L124,60 L124,68 L76,68 Z',
    },
  },
];

export const CHARACTERS: CharacterDef[] = [
  { id: 'blobby', name: 'Blobby', emoji: '😊', viewBox: '0 0 200 220', aspectRatio: 220 / 200, zones: blobbyZones },
  { id: 'sprout', name: 'Sprout', emoji: '🌿', viewBox: '0 0 200 225', aspectRatio: 225 / 200, zones: sproutZones },
  { id: 'starby', name: 'Starby', emoji: '⭐', viewBox: '0 0 200 215', aspectRatio: 215 / 200, zones: starbyZones },
];

export const CHARACTER_MAP: Record<string, CharacterDef> = Object.fromEntries(
  CHARACTERS.map((c) => [c.id, c])
);

export const defaultZoneColor = colors.zone.unpainted;
