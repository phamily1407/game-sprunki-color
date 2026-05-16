import { colors } from './theme';

export type ZoneId = string;

export interface ZoneDefinition {
  id: ZoneId;
  label: string;
  // SVG path data — centered in a 200×240 viewBox
  path: string;
}

export interface CharacterDef {
  id: string;
  name: string;
  emoji: string;
  zones: ZoneDefinition[];
}

// ── Blobby — friendly round blob ──────────────────────────────────────────
const blobbyZones: ZoneDefinition[] = [
  {
    id: 'head',
    label: 'Head',
    path: 'M100,20 C140,20 165,50 165,80 C165,110 140,130 100,130 C60,130 35,110 35,80 C35,50 60,20 100,20 Z',
  },
  {
    id: 'body',
    label: 'Body',
    path: 'M65,128 C55,140 50,160 50,180 C50,210 70,225 100,225 C130,225 150,210 150,180 C150,160 145,140 135,128 Z',
  },
  {
    id: 'leftArm',
    label: 'Left arm',
    path: 'M50,135 C30,130 15,145 15,160 C15,175 30,182 48,175 C55,158 54,144 50,135 Z',
  },
  {
    id: 'rightArm',
    label: 'Right arm',
    path: 'M150,135 C170,130 185,145 185,160 C185,175 170,182 152,175 C145,158 146,144 150,135 Z',
  },
  {
    id: 'leftLeg',
    label: 'Left leg',
    path: 'M65,222 C60,232 58,245 62,255 C66,265 80,268 88,258 C90,245 88,230 85,222 Z',
  },
  {
    id: 'rightLeg',
    label: 'Right leg',
    path: 'M135,222 C140,232 142,245 138,255 C134,265 120,268 112,258 C110,245 112,230 115,222 Z',
  },
  {
    id: 'leftEar',
    label: 'Left ear',
    path: 'M36,60 C24,55 18,68 22,80 C26,90 38,90 44,82 C46,72 44,63 36,60 Z',
  },
  {
    id: 'rightEar',
    label: 'Right ear',
    path: 'M164,60 C176,55 182,68 178,80 C174,90 162,90 156,82 C154,72 156,63 164,60 Z',
  },
];

// ── Sprout — plant/flower character ──────────────────────────────────────
const sproutZones: ZoneDefinition[] = [
  {
    id: 'head',
    label: 'Head',
    path: 'M100,25 C130,25 150,48 150,72 C150,96 130,115 100,115 C70,115 50,96 50,72 C50,48 70,25 100,25 Z',
  },
  {
    id: 'stem',
    label: 'Stem',
    path: 'M82,113 C78,135 76,160 78,185 C80,205 90,218 100,218 C110,218 120,205 122,185 C124,160 122,135 118,113 Z',
  },
  {
    id: 'leftLeaf',
    label: 'Left leaf',
    path: 'M78,145 C55,130 30,138 28,158 C26,175 48,185 72,172 C80,162 82,152 78,145 Z',
  },
  {
    id: 'rightLeaf',
    label: 'Right leaf',
    path: 'M122,145 C145,130 170,138 172,158 C174,175 152,185 128,172 C120,162 118,152 122,145 Z',
  },
  {
    id: 'roots',
    label: 'Roots',
    path: 'M78,216 C68,228 60,242 65,255 C70,265 90,265 100,252 C110,265 130,265 135,255 C140,242 132,228 122,216 Z',
  },
  {
    id: 'flowerTop',
    label: 'Flower top',
    path: 'M100,10 C108,0 122,2 122,14 C122,22 114,26 100,24 C86,26 78,22 78,14 C78,2 92,0 100,10 Z',
  },
  {
    id: 'leftPetal',
    label: 'Left petal',
    path: 'M52,38 C38,28 30,14 38,6 C46,0 58,8 60,22 C58,32 56,38 52,38 Z',
  },
  {
    id: 'rightPetal',
    label: 'Right petal',
    path: 'M148,38 C162,28 170,14 162,6 C154,0 142,8 140,22 C142,32 144,38 148,38 Z',
  },
];

// ── Starby — 5-pointed star character ────────────────────────────────────
const starbyZones: ZoneDefinition[] = [
  {
    id: 'centerBody',
    label: 'Center body',
    path: 'M100,75 L115,120 L162,120 L125,147 L138,192 L100,165 L62,192 L75,147 L38,120 L85,120 Z',
  },
  {
    id: 'topPoint',
    label: 'Top point',
    path: 'M100,10 L110,55 L100,75 L90,55 Z',
  },
  {
    id: 'topRightPoint',
    label: 'Top-right point',
    path: 'M170,42 L138,75 L125,66 L148,38 Z',
  },
  {
    id: 'bottomRightPoint',
    label: 'Bottom-right point',
    path: 'M160,145 L125,145 L138,192 L162,165 Z',
  },
  {
    id: 'bottomLeftPoint',
    label: 'Bottom-left point',
    path: 'M40,145 L75,145 L62,192 L38,165 Z',
  },
  {
    id: 'topLeftPoint',
    label: 'Top-left point',
    path: 'M30,42 L62,75 L75,66 L52,38 Z',
  },
  {
    id: 'leftEyeZone',
    label: 'Left eye zone',
    path: 'M82,95 C78,90 74,94 76,100 C78,106 84,106 86,100 C88,96 86,92 82,95 Z',
  },
  {
    id: 'rightEyeZone',
    label: 'Right eye zone',
    path: 'M118,95 C114,90 110,94 112,100 C114,106 120,106 122,100 C124,96 122,92 118,95 Z',
  },
];

export const CHARACTERS: CharacterDef[] = [
  { id: 'blobby', name: 'Blobby', emoji: '🟢', zones: blobbyZones },
  { id: 'sprout', name: 'Sprout', emoji: '🌱', zones: sproutZones },
  { id: 'starby', name: 'Starby', emoji: '⭐', zones: starbyZones },
];

export const CHARACTER_MAP: Record<string, CharacterDef> = Object.fromEntries(
  CHARACTERS.map((c) => [c.id, c])
);

export const defaultZoneColor = colors.zone.unpainted;
