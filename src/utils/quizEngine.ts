import {
  AccessoryId,
  BottomId,
  ColorId,
  EventId,
  FootwearId,
  GarmentId,
  HeadwearId,
  ModelGender,
  OutfitConfig,
  PatternId
} from '../types/vietphuc';
import { ACCESSORIES, BOTTOMS, EVENTS, FOOTWEAR, GARMENTS, HEADWEAR, HERITAGE_COLORS, PATTERNS } from '../data/heritageData';
import { CULTURAL_RULES } from '../data/culturalRules';
import { culturalRespectScore } from './culturalRuleChecker';
import { evaluateColorHarmony } from './harmonyCalculator';

export type RegionId = 'bac' | 'trung' | 'nam' | 'any';
export type StyleId = 'chuan-muc' | 'remix' | 'hoc-thuat' | 'vuong-gia';

export interface QuizAnswers {
  event: EventId;
  region: RegionId;
  style: StyleId;
  gender: ModelGender;
}

interface Affinity {
  garments?: GarmentId[];
  colors?: ColorId[];
  patterns?: PatternId[];
  bottoms?: BottomId[];
  headwear?: HeadwearId[];
  footwear?: FootwearId[];
  accessories?: AccessoryId[];
  backdrop?: OutfitConfig['backdrop'];
}

export const REGIONS: { id: RegionId; label: string; desc: string; icon: string; affinity: Affinity }[] = [
  {
    id: 'bac',
    label: 'Bắc Bộ',
    desc: 'Kinh Bắc, Thăng Long: tứ thân, quai thao, gốm Chu Đậu',
    icon: '🏮',
    affinity: {
      garments: ['ao-tu-than', 'ao-giao-linh', 'ao-dai-tan-thoi'],
      colors: ['canh-sen', 'cam-bat-trang', 'lam-cham', 'trang-nga'],
      patterns: ['chu-dau', 'hoa-sen', 'plain-silk'],
      headwear: ['non-quai-thao', 'khan-van'],
      accessories: ['dai-ngu-sac', 'tui-coi-dan'],
      backdrop: 'pho-co'
    }
  },
  {
    id: 'trung',
    label: 'Cố đô Huế',
    desc: 'Cung đình Nguyễn: nhật bình, áo tấc, tím Huế, nón bài thơ',
    icon: '🏯',
    affinity: {
      garments: ['ao-nhat-binh', 'ao-tac', 'ao-ngu-than'],
      colors: ['tim-hue', 'hoang-yen', 'do-chu-sa', 'ngoc-bich'],
      patterns: ['van-may', 'bat-buu'],
      headwear: ['non-la', 'khan-van', 'khan-dong'],
      accessories: ['kieng-bac', 'quat-giay-do'],
      backdrop: 'hoang-thanh'
    }
  },
  {
    id: 'nam',
    label: 'Nam Bộ',
    desc: 'Phóng khoáng, thoáng mát: ngũ thân, áo dài, nón lá',
    icon: '🌴',
    affinity: {
      garments: ['ao-ngu-than', 'ao-dai-tan-thoi'],
      colors: ['trang-nga', 'ngoc-bich', 'lam-cham'],
      patterns: ['plain-silk', 'hoa-sen'],
      headwear: ['non-la', 'none'],
      accessories: ['tui-coi-dan', 'quat-giay-do'],
      backdrop: 'studio-zen'
    }
  },
  { id: 'any', label: 'Không quan trọng', desc: 'Để hệ thống chọn theo sự kiện và phong cách', icon: '🧭', affinity: {} }
];

export const STYLES: { id: StyleId; label: string; desc: string; icon: string; affinity: Affinity }[] = [
  {
    id: 'chuan-muc',
    label: 'Truyền thống chuẩn mực',
    desc: 'Mặc đúng như xưa, phụ kiện cổ truyền',
    icon: '📜',
    affinity: {
      bottoms: ['quan-lua-trang', 'quan-lua-den'],
      headwear: ['khan-van', 'khan-dong', 'non-quai-thao', 'tram-cai-toc'],
      footwear: ['guoc-moc', 'giay-oxford'],
      accessories: ['kieng-bac', 'quat-giay-do', 'dai-ngu-sac'],
      patterns: ['van-may', 'hoa-sen', 'bat-buu']
    }
  },
  {
    id: 'remix',
    label: 'Remix Gen Z',
    desc: 'Streetwear, sneaker, kính Y2K, dễ mặc đi chơi',
    icon: '🛹',
    affinity: {
      garments: ['ao-ngu-than', 'ao-tu-than', 'ao-dai-tan-thoi'],
      bottoms: ['vay-xep-ly', 'quan-palazzo', 'quan-jeans-suong'],
      headwear: ['none', 'bom-ngoc-trai'],
      footwear: ['sneaker-trang', 'boot-da-co-thap'],
      accessories: ['kinh-mat-y2k', 'tui-tote-cham', 'choker-ngoc-trai'],
      patterns: ['plain-silk', 'chu-dau']
    }
  },
  {
    id: 'hoc-thuat',
    label: 'Nho nhã học thuật',
    desc: 'Dark academia kiểu sĩ tử: tông trầm, kính gọng tròn',
    icon: '📚',
    affinity: {
      garments: ['ao-giao-linh', 'ao-ngu-than'],
      colors: ['lam-cham', 'den-mun', 'trang-nga', 'ngoc-bich'],
      bottoms: ['quan-lua-den', 'quan-lua-trang', 'quan-palazzo'],
      headwear: ['khan-dong', 'khan-van', 'none'],
      footwear: ['giay-oxford'],
      accessories: ['kinh-gong-tron', 'tui-tote-cham', 'quat-giay-do'],
      patterns: ['plain-silk', 'chu-dau', 'hoa-sen']
    }
  },
  {
    id: 'vuong-gia',
    label: 'Vương giả cung đình',
    desc: 'Lộng lẫy, hoa văn cát tường, trang sức cao quý',
    icon: '👑',
    affinity: {
      garments: ['ao-nhat-binh', 'ao-tac'],
      colors: ['do-chu-sa', 'hoang-yen', 'tim-hue'],
      bottoms: ['quan-lua-trang', 'quan-lua-den'],
      headwear: ['khan-van', 'tram-cai-toc', 'bom-ngoc-trai'],
      footwear: ['guoc-moc', 'giay-oxford'],
      accessories: ['kieng-bac', 'choker-ngoc-trai', 'quat-giay-do'],
      patterns: ['bat-buu', 'van-may']
    }
  }
];

const FORMAL_EVENTS: EventId[] = ['le-chua-tam-linh', 'dam-cuoi-ban-than', 'tet-du-xuan'];
const FEMALE_ONLY: GarmentId[] = ['ao-tu-than', 'ao-nhat-binh'];

export interface QuizResult {
  config: OutfitConfig;
  total: number;
  culturalScore: number;
  harmonyScore: number;
  reasons: string[];
}

const inList = <T>(list: T[] | undefined, v: T) => !!list && list.includes(v);

type Tier = 'formal' | 'semi' | 'casual';
const SEMI_EVENTS: EventId[] = ['ky-yeu-hoc-duong', 'bieu-dien-van-nghe'];
const eventTier = (e: EventId): Tier => (FORMAL_EVENTS.includes(e) ? 'formal' : SEMI_EVENTS.includes(e) ? 'semi' : 'casual');

const TIER_FIT: Record<Tier, Record<string, number>> = {
  formal: { formal: 4, 'semi-formal': 1, casual: -6 },
  semi: { formal: 2, 'semi-formal': 3, casual: -1 },
  casual: { formal: 0, 'semi-formal': 2, casual: 3 }
};

function formalityFit(id: string, list: { id: string; formality: string }[], tier: Tier): number {
  const f = list.find(i => i.id === id)?.formality;
  return f ? TIER_FIT[tier][f] ?? 0 : 0;
}

/** True if adding this accessory introduces a new critical/warning alert. */
function accessoryIsSafe(base: OutfitConfig, acc: AccessoryId): boolean {
  const next = { ...base, accessories: [...base.accessories, acc] };
  const bad = (c: OutfitConfig) =>
    CULTURAL_RULES.filter(r => (r.level === 'critical' || r.level === 'warning') && r.when(c)).length;
  return bad(next) <= bad(base);
}

function pickAccessories(base: OutfitConfig, a: QuizAnswers): AccessoryId[] {
  const region = REGIONS.find(r => r.id === a.region)!.affinity;
  const style = STYLES.find(s => s.id === a.style)!.affinity;
  const tier = eventTier(a.event);
  const ranked = ACCESSORIES.filter(
    acc =>
      !(a.gender === 'male' && (acc.id === 'kieng-bac' || acc.id === 'choker-ngoc-trai')) &&
      !(acc.id === 'dai-ngu-sac' && base.garmentId !== 'ao-tu-than')
  ).map(acc => ({
    id: acc.id,
    s:
      (inList(style.accessories, acc.id) ? 10 : 0) +
      (inList(region.accessories, acc.id) ? 5 : 0) +
      (acc.id === 'dai-ngu-sac' && base.garmentId === 'ao-tu-than' ? 6 : 0) +
      formalityFit(acc.id, ACCESSORIES, tier)
  }))
    .filter(x => x.s > 4)
    .sort((x, y) => y.s - x.s);

  const chosen: AccessoryId[] = [];
  for (const { id } of ranked) {
    if (chosen.length >= 2) break;
    const cfg = { ...base, accessories: chosen };
    if (accessoryIsSafe(cfg, id)) chosen.push(id);
  }
  return chosen;
}

/**
 * Enumerate every garment × color × pattern × bottom × headwear × footwear combination
 * (~57k), drop anything with a *critical* cultural violation, score the rest, then
 * return the best look for each of the top-N distinct garments.
 */
export function recommendLooks(a: QuizAnswers, topN = 3): QuizResult[] {
  const region = REGIONS.find(r => r.id === a.region)!.affinity;
  const style = STYLES.find(s => s.id === a.style)!.affinity;
  const event = EVENTS.find(e => e.id === a.event)!;
  const tier = eventTier(a.event);
  const criticalRules = CULTURAL_RULES.filter(r => r.level === 'critical');
  // Info rules are "allowed but off-tradition" (e.g. quai thao on non-tứ-thân) → soft penalty in recommendations
  const infoRules = CULTURAL_RULES.filter(r => r.level === 'info' && r.category !== 'cau-truc' && r.category !== 'mau-sac');
  const backdrop = region.backdrop ?? (tier === 'formal' ? 'hoang-thanh' : 'pho-co');

  type Cand = { config: OutfitConfig; total: number };
  // Keep best candidate per (garment, color) so the final pick can diversify colors too
  const best = new Map<string, Cand>();

  for (const g of GARMENTS) {
    if (a.gender === 'male' && FEMALE_ONLY.includes(g.id)) continue;
    const gScore =
      (event.recommendedGarments.includes(g.id) ? 30 : 0) +
      (inList(region.garments, g.id) ? 18 : 0) +
      (inList(style.garments, g.id) ? 14 : 0);

    for (const c of HERITAGE_COLORS) {
      const cScore =
        (g.recommendedColors.includes(c.id) ? 10 : 0) + (inList(region.colors, c.id) ? 6 : 0) + (inList(style.colors, c.id) ? 6 : 0);
      for (const p of PATTERNS) {
        const pScore = (inList(region.patterns, p.id) ? 4 : 0) + (inList(style.patterns, p.id) ? 5 : 0);
        for (const b of BOTTOMS) {
          const bScore = (inList(style.bottoms, b.id) ? 8 : 0) + formalityFit(b.id, BOTTOMS, tier);
          for (const h of HEADWEAR) {
            if (a.gender === 'female' && h.id === 'khan-dong') continue;
            if (a.gender === 'male' && (h.id === 'bom-ngoc-trai' || h.id === 'tram-cai-toc')) continue;
            const hScore =
              (inList(region.headwear, h.id) ? 8 : 0) + (inList(style.headwear, h.id) ? 7 : 0) + formalityFit(h.id, HEADWEAR, tier);
            for (const f of FOOTWEAR) {
              const fScore = (inList(style.footwear, f.id) ? 8 : 0) + formalityFit(f.id, FOOTWEAR, tier);
              const config: OutfitConfig = {
                garmentId: g.id,
                colorId: c.id,
                patternId: p.id,
                bottomId: b.id,
                headwearId: h.id,
                footwearId: f.id,
                accessories: [],
                targetEvent: a.event,
                modelGender: a.gender,
                backdrop
              };
              if (criticalRules.some(r => r.when(config))) continue;

              const preScore = gScore + cScore + pScore + bScore + hScore + fScore;
              const key = `${g.id}|${c.id}`;
              const prev = best.get(key);
              // cheap upper bound prune: cultural ≤ 100 (×0.6) + harmony ≤ 100 (×0.3)
              if (prev && preScore + 90 < prev.total) continue;

              const infoHits = infoRules.reduce((n, r) => n + (r.when(config) ? 1 : 0), 0);
              const total =
                preScore + culturalRespectScore(config) * 0.6 + evaluateColorHarmony(config).score * 0.3 - infoHits * 12;
              if (!prev || total > prev.total) best.set(key, { config, total });
            }
          }
        }
      }
    }
  }

  // Greedy diverse selection: distinct garments, penalize repeated color / bottom / footwear
  const pool = [...best.values()];
  const picked: Cand[] = [];
  while (picked.length < topN) {
    let top: Cand | null = null;
    let topAdj = -Infinity;
    for (const cand of pool) {
      if (picked.some(p => p.config.garmentId === cand.config.garmentId)) continue;
      const adj =
        cand.total -
        picked.reduce(
          (s, p) =>
            s +
            (p.config.colorId === cand.config.colorId ? 10 : 0) +
            (p.config.bottomId === cand.config.bottomId ? 5 : 0) +
            (p.config.footwearId === cand.config.footwearId ? 3 : 0),
          0
        );
      if (adj > topAdj) {
        topAdj = adj;
        top = cand;
      }
    }
    if (!top) break;
    picked.push(top);
  }

  return picked.map(r => {
      const config = { ...r.config, accessories: pickAccessories(r.config, a) };
      return {
        config,
        total: Math.round(r.total),
        culturalScore: culturalRespectScore(config),
        harmonyScore: evaluateColorHarmony(config).score,
        reasons: explain(config, a)
      };
    });
}

function explain(c: OutfitConfig, a: QuizAnswers): string[] {
  const region = REGIONS.find(r => r.id === a.region)!;
  const style = STYLES.find(s => s.id === a.style)!;
  const event = EVENTS.find(e => e.id === a.event)!;
  const g = GARMENTS.find(x => x.id === c.garmentId)!;
  const color = HERITAGE_COLORS.find(x => x.id === c.colorId)!;
  const out: string[] = [];
  if (event.recommendedGarments.includes(c.garmentId)) out.push(`${g.name.split(' (')[0]} hợp với dịp "${event.name}".`);
  if (inList(region.affinity.garments, c.garmentId) || inList(region.affinity.headwear, c.headwearId))
    out.push(`Mang nét đặc trưng ${region.label}.`);
  if (g.recommendedColors.includes(c.colorId)) out.push(`Màu ${color.name.split(' (')[0]} là sắc truyền thống thường dùng cho loại áo này.`);
  const styleHits = [
    inList(style.affinity.bottoms, c.bottomId),
    inList(style.affinity.footwear, c.footwearId),
    inList(style.affinity.headwear, c.headwearId)
  ].filter(Boolean).length;
  if (styleHits >= 2) out.push(`Hạ y, giày dép và khăn/nón đúng tinh thần "${style.label}".`);
  if (eventTier(a.event) === 'formal') out.push('Giữ mức trang trọng phù hợp với dịp lễ.');
  return out.slice(0, 4);
}

export function itemName(kind: 'bottom' | 'headwear' | 'footwear', id: string): string {
  const list = kind === 'bottom' ? BOTTOMS : kind === 'headwear' ? HEADWEAR : FOOTWEAR;
  return list.find(i => i.id === id)?.name ?? id;
}
