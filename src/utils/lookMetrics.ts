import { OutfitConfig } from '../types/vietphuc';
import { ACCESSORIES, BOTTOMS, EVENTS, FOOTWEAR, GARMENTS, HEADWEAR, HERITAGE_COLORS, PATTERNS } from '../data/heritageData';
import { checkCulturalEtiquette, culturalRespectScore } from './culturalRuleChecker';
import { evaluateColorHarmony } from './harmonyCalculator';

const FORMALITY_VALUE = { formal: 100, 'semi-formal': 60, casual: 20 } as const;
const GARMENT_FORMALITY: Record<OutfitConfig['garmentId'], number> = {
  'ao-tac': 100,
  'ao-nhat-binh': 100,
  'ao-giao-linh': 75,
  'ao-ngu-than': 60,
  'ao-dai-tan-thoi': 60,
  'ao-dai-hien-dai': 75,
  'ao-ba-ba': 30,
  'ao-tu-than': 50
};
const TRADITIONAL_CATS = ['Truyền thống', 'Dân gian', 'Di sản', 'Trí thức xưa', 'Thủ công'];

export interface LookMetrics {
  cultural: number;
  harmony: number;
  harmonyTitle: string;
  /** Độ trang trọng 0–100 */
  formality: number;
  /** % món đồ mang tính truyền thống (vs remix hiện đại) */
  traditional: number;
  /** Mức độ phù hợp sự kiện 0–100 */
  eventFit: number;
  critical: number;
  warnings: number;
  kudos: number;
  labels: {
    garment: string;
    color: string;
    colorHex: string;
    element: string;
    pattern: string;
    bottom: string;
    headwear: string;
    footwear: string;
    accessories: string;
    event: string;
  };
}

export function computeLookMetrics(c: OutfitConfig): LookMetrics {
  const g = GARMENTS.find(x => x.id === c.garmentId)!;
  const color = HERITAGE_COLORS.find(x => x.id === c.colorId)!;
  const bottom = BOTTOMS.find(x => x.id === c.bottomId)!;
  const head = HEADWEAR.find(x => x.id === c.headwearId)!;
  const foot = FOOTWEAR.find(x => x.id === c.footwearId)!;
  const accs = c.accessories.map(a => ACCESSORIES.find(x => x.id === a)!).filter(Boolean);
  const event = EVENTS.find(x => x.id === c.targetEvent)!;
  const harmony = evaluateColorHarmony(c);
  const alerts = checkCulturalEtiquette(c);

  const items = [bottom, head, foot, ...accs];
  const itemFormality = items.reduce((s, i) => s + FORMALITY_VALUE[i.formality], 0) / items.length;
  const formality = Math.round(GARMENT_FORMALITY[c.garmentId] * 0.5 + itemFormality * 0.5);
  const traditional = Math.round((items.filter(i => TRADITIONAL_CATS.includes(i.category)).length / items.length) * 100);

  const formalEvents = ['le-chua-tam-linh', 'dam-cuoi-ban-than', 'tet-du-xuan'];
  const targetFormality = formalEvents.includes(c.targetEvent) ? 85 : c.targetEvent === 'ca-phe-dao-pho' ? 40 : 60;
  const eventFit = Math.max(
    0,
    Math.round(
      (event.recommendedGarments.includes(c.garmentId) ? 50 : 20) +
        50 * (1 - Math.min(1, Math.abs(formality - targetFormality) / 60)) -
        alerts.filter(a => a.level === 'critical').length * 25
    )
  );

  return {
    cultural: culturalRespectScore(c),
    harmony: harmony.score,
    harmonyTitle: harmony.title,
    formality,
    traditional,
    eventFit: Math.min(100, eventFit),
    critical: alerts.filter(a => a.level === 'critical').length,
    warnings: alerts.filter(a => a.level === 'warning').length,
    kudos: alerts.filter(a => a.level === 'kudos').length,
    labels: {
      garment: g.name,
      color: color.name.split(' (')[0],
      colorHex: color.hex,
      element: color.element,
      pattern: PATTERNS.find(p => p.id === c.patternId)?.name ?? '',
      bottom: bottom.name,
      headwear: head.name,
      footwear: foot.name,
      accessories: accs.map(a => a.name).join(', ') || 'Tối giản',
      event: event.name
    }
  };
}

/** Overall score used to pick a "winner" in comparisons. */
export const overallScore = (m: LookMetrics) => Math.round(m.cultural * 0.45 + m.harmony * 0.25 + m.eventFit * 0.3);
