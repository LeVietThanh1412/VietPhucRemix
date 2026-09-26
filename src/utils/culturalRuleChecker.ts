import { OutfitConfig, CulturalAlert } from '../types/vietphuc';
import { GARMENTS } from '../data/heritageData';
import { CULTURAL_RULES, LEVEL_PENALTY } from '../data/culturalRules';

const LEVEL_ORDER: Record<CulturalAlert['level'], number> = { critical: 0, warning: 1, info: 2, kudos: 3 };

export function checkCulturalEtiquette(config: OutfitConfig): CulturalAlert[] {
  const alerts: CulturalAlert[] = CULTURAL_RULES.filter(rule => rule.when(config)).map(rule => ({
    id: rule.id,
    level: rule.level,
    title: rule.title,
    message: rule.message,
    guidance: rule.guidance,
    basis: rule.basis
  }));

  if (!alerts.some(a => a.level === 'critical' || a.level === 'warning' || a.level === 'kudos')) {
    const garment = GARMENTS.find(g => g.id === config.garmentId);
    alerts.push({
      id: 'default-ok',
      level: 'kudos',
      title: 'Phối đồ thanh lịch, đúng bối cảnh',
      message: `Cách phối ${garment?.name || 'Việt phục'} này hài hòa và không vi phạm quy ước văn hóa nào đã biết.`,
      guidance: 'Tự tin diện outfit này trong các buổi chụp ảnh hoặc sự kiện văn hóa!'
    });
  }

  return alerts.sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
}

/** Điểm tôn trọng văn hóa 0–100 (dùng cho so sánh look). */
export function culturalRespectScore(config: OutfitConfig): number {
  const penalty = CULTURAL_RULES.filter(r => r.when(config)).reduce((s, r) => s + LEVEL_PENALTY[r.level], 0);
  return Math.max(0, Math.min(100, 100 - penalty));
}
