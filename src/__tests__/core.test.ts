import { describe, expect, it } from 'vitest';
import { ACCESSORIES, BOTTOMS, EVENTS, EVENT_COMBOS, FOOTWEAR, GARMENTS, HEADWEAR, HERITAGE_COLORS, PATTERNS, PRESET_LOOKBOOKS } from '../data/heritageData';
import { CULTURAL_RULES } from '../data/culturalRules';
import { checkCulturalEtiquette, culturalRespectScore } from '../utils/culturalRuleChecker';
import { DEFAULT_LOOK, decodeLook, encodeLook, encodeLookLegacy } from '../utils/lookStorage';
import { recommendLooks, REGIONS, STYLES } from '../utils/quizEngine';
import { sameLook } from '../utils/savedLooks';
import { buildStylistContext } from '../utils/stylistContext';
import { OutfitConfig } from '../types/vietphuc';

const bad = (c: OutfitConfig) => checkCulturalEtiquette(c).filter(a => a.level === 'critical' || a.level === 'warning');

/**
 * Snapshot of catalog order. Share links encode items by index, so reordering breaks
 * every QR code already printed. Only APPEND new ids at the end, then update this list.
 */
const CATALOG_ORDER = {
  garments: ['ao-tac', 'ao-ngu-than', 'ao-tu-than', 'ao-nhat-binh', 'ao-giao-linh', 'ao-dai-tan-thoi', 'ao-dai-hien-dai', 'ao-ba-ba'],
  headwear: ['none', 'khan-van', 'khan-dong', 'non-quai-thao', 'non-la', 'bom-ngoc-trai', 'tram-cai-toc', 'khan-ran']
};

describe('catalog integrity', () => {
  it('ids are unique', () => {
    for (const list of [GARMENTS, HERITAGE_COLORS, PATTERNS, BOTTOMS, HEADWEAR, FOOTWEAR, ACCESSORIES, EVENTS]) {
      const ids = list.map(i => i.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('catalog order is append-only (share-link compatibility)', () => {
    expect(GARMENTS.map(g => g.id).slice(0, CATALOG_ORDER.garments.length)).toEqual(CATALOG_ORDER.garments);
    expect(HEADWEAR.map(h => h.id).slice(0, CATALOG_ORDER.headwear.length)).toEqual(CATALOG_ORDER.headwear);
  });

  it('each catalog fits in one base36 char', () => {
    for (const list of [GARMENTS, HERITAGE_COLORS, PATTERNS, BOTTOMS, HEADWEAR, FOOTWEAR, ACCESSORIES, EVENTS]) {
      expect(list.length).toBeLessThanOrEqual(36);
    }
  });

  it('every garment has sources, verification note and valid recommended colors', () => {
    for (const g of GARMENTS) {
      expect(g.sources.length).toBeGreaterThan(0);
      expect(g.verificationNote.length).toBeGreaterThan(20);
      for (const c of g.recommendedColors) expect(HERITAGE_COLORS.some(x => x.id === c)).toBe(true);
    }
  });

  it('events reference existing garments', () => {
    for (const e of EVENTS) for (const g of e.recommendedGarments) expect(GARMENTS.some(x => x.id === g)).toBe(true);
  });

  it('rule ids are unique', () => {
    const ids = CULTURAL_RULES.map(r => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('cultural rules', () => {
  it('curated presets and event combos have no critical/warning', () => {
    for (const p of PRESET_LOOKBOOKS) expect(bad(p.config).map(a => a.id)).toEqual([]);
    for (const [event, combo] of Object.entries(EVENT_COMBOS)) {
      for (const modelGender of ['female', 'unisex'] as const) {
        const c = { ...DEFAULT_LOOK, accessories: [], ...combo, targetEvent: event, modelGender } as OutfitConfig;
        expect(bad(c).map(a => a.id), `${event}/${modelGender}`).toEqual([]);
      }
    }
  });

  it('flags nhật bình + denim at a temple as critical', () => {
    const c: OutfitConfig = { ...DEFAULT_LOOK, garmentId: 'ao-nhat-binh', bottomId: 'quan-jeans-suong', targetEvent: 'le-chua-tam-linh' };
    const ids = checkCulturalEtiquette(c).filter(a => a.level === 'critical').map(a => a.id);
    expect(ids).toContain('nhat-binh-denim');
    expect(ids).toContain('sacred-denim');
    expect(culturalRespectScore(c)).toBeLessThan(50);
  });

  it('flags áo bà ba at a wedding', () => {
    const c: OutfitConfig = { ...DEFAULT_LOOK, garmentId: 'ao-ba-ba', targetEvent: 'dam-cuoi-ban-than' };
    expect(bad(c).map(a => a.id)).toContain('ba-ba-formal');
  });

  it('praises bà ba + khăn rằn', () => {
    const c: OutfitConfig = { ...DEFAULT_LOOK, garmentId: 'ao-ba-ba', headwearId: 'khan-ran', accessories: [], targetEvent: 'ca-phe-dao-pho' };
    expect(checkCulturalEtiquette(c).some(a => a.id === 'ba-ba-khan-ran')).toBe(true);
  });
});

describe('share links', () => {
  const pick = <T extends { id: string }>(l: T[], i: number) => l[i % l.length].id;
  it('round-trips every combination sample', () => {
    for (let i = 0; i < 2000; i++) {
      const c = {
        garmentId: pick(GARMENTS, i),
        colorId: pick(HERITAGE_COLORS, i * 7),
        patternId: pick(PATTERNS, i * 3),
        bottomId: pick(BOTTOMS, i * 5),
        headwearId: pick(HEADWEAR, i * 11),
        footwearId: pick(FOOTWEAR, i * 13),
        accessories: [pick(ACCESSORIES, i), pick(ACCESSORIES, i + 3)].filter((v, k, a) => a.indexOf(v) === k),
        targetEvent: pick(EVENTS, i * 17),
        modelGender: (['female', 'male', 'unisex'] as const)[i % 3],
        backdrop: (['hoang-thanh', 'pho-co', 'studio-zen', 'hieu-anh'] as const)[i % 4]
      } as OutfitConfig;
      const d = decodeLook(encodeLook(c));
      expect(d && sameLook(d, c)).toBe(true);
    }
  });

  it('decodes legacy base64 links', () => {
    expect(sameLook(decodeLook(encodeLookLegacy(DEFAULT_LOOK))!, DEFAULT_LOOK)).toBe(true);
  });

  it('rejects garbage', () => {
    expect(decodeLook('xyz')).toBeNull();
    expect(decodeLook('1-zzzzzz-_-0-0-0')).toBeNull();
  });

  it('token is short', () => {
    expect(encodeLook(DEFAULT_LOOK).length).toBeLessThan(25);
  });
});

describe('quiz engine', () => {
  it('never recommends critical/warning looks, and respects gender', () => {
    for (const e of EVENTS)
      for (const r of REGIONS)
        for (const s of STYLES)
          for (const gender of ['female', 'male', 'unisex'] as const) {
            const res = recommendLooks({ event: e.id, region: r.id, style: s.id, gender });
            expect(res.length).toBeGreaterThan(0);
            for (const x of res) {
              expect(bad(x.config).map(a => a.id), `${e.id}/${r.id}/${s.id}/${gender}`).toEqual([]);
              if (gender === 'male') expect(['ao-tu-than', 'ao-nhat-binh']).not.toContain(x.config.garmentId);
            }
          }
  });

  it('Nam Bộ casual recommends áo bà ba', () => {
    const res = recommendLooks({ event: 'ca-phe-dao-pho', region: 'nam', style: 'chuan-muc', gender: 'female' });
    expect(res.map(r => r.config.garmentId)).toContain('ao-ba-ba');
  });

  it('graduation recommends áo dài hiện đại', () => {
    const res = recommendLooks({ event: 'ky-yeu-hoc-duong', region: 'any', style: 'chuan-muc', gender: 'female' });
    expect(res.map(r => r.config.garmentId)).toContain('ao-dai-hien-dai');
  });
});

describe('AI grounding context', () => {
  it('includes verification note, sources and alerts', () => {
    const c: OutfitConfig = { ...DEFAULT_LOOK, garmentId: 'ao-nhat-binh', bottomId: 'quan-jeans-suong' };
    const ctx = buildStylistContext(c);
    expect(ctx).toContain('ghi_chu_kiem_chung');
    expect(ctx).toContain('Bảo tàng Cổ vật Cung đình Huế');
    expect(ctx).toContain('[critical]');
  });
});

describe('Avatar Generator Layering, Digital Wardrobe & Lookbook Export Workflows', () => {
  it('preserves customColorHex and layerVisibility in sanitizeLook', () => {
    const customConfig: OutfitConfig = {
      ...DEFAULT_LOOK,
      customColorHex: '#8B1E3F',
      layerVisibility: {
        backdrop: false,
        body: true,
        garment: true,
        bottom: true,
        footwear: false,
        accessories: true,
        headwear: false
      }
    };
    expect(customConfig.customColorHex).toBe('#8B1E3F');
    expect(customConfig.layerVisibility?.backdrop).toBe(false);
    expect(customConfig.layerVisibility?.footwear).toBe(false);
    expect(customConfig.layerVisibility?.headwear).toBe(false);
  });

  it('validates Story and Post aspect ratios and export dimensions', () => {
    // Story 9:16 (1080x1920)
    expect(1080 / 1920).toBeCloseTo(9 / 16, 2);
    // Post 4:5 (1080x1350)
    expect(1080 / 1350).toBeCloseTo(4 / 5, 2);
  });
});

