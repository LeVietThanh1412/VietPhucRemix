import { GARMENTS } from '../data/heritageData';
import { OutfitConfig } from '../types/vietphuc';
import { checkCulturalEtiquette } from './culturalRuleChecker';
import { eventCombo } from './eventRecommendations';

export interface StylistAction {
  label: string;
  suggestedPatch: Partial<OutfitConfig>;
}

export function offlineStylist(config: OutfitConfig, query: string): { reply: string; actions: StylistAction[] } {
  const q = query.toLowerCase();
  const requested = GARMENTS.find(g => q.includes(g.name.split(' (')[0].toLowerCase()))
    ?? GARMENTS.find(g => g.id === config.garmentId)!;
  const alerts = checkCulturalEtiquette(config).filter(a => a.level === 'critical' || a.level === 'warning');
  const warning = alerts.map(a => `${a.title}: ${a.guidance}`).join('\n');
  const candidate: OutfitConfig = {
    ...config, ...eventCombo(config.targetEvent, config.modelGender),
    garmentId: requested.id,
    patternId: 'plain-silk',
    colorId: requested.recommendedColors[0],
    bottomId: 'quan-lua-trang',
    headwearId: config.modelGender === 'male' ? 'khan-dong' : 'khan-van',
    footwearId: 'giay-oxford',
    accessories: []
  };
  if (q.includes('viên lĩnh')) candidate.patternId = 'cuc-day-ly';
  if (q.includes('nhật bình')) candidate.patternId = 'bat-buu';
  const safe = !(config.modelGender === 'male' && requested.targetGender === 'female') &&
    !checkCulturalEtiquette(candidate).some(a => a.level === 'critical' || a.level === 'warning');
  return {
    reply: [warning, `${requested.name}: ${requested.shortDesc}`, requested.verificationNote,
      `Nguồn tham khảo: ${requested.sources.map(s => s.title).join('; ')}.`,
      'Đây là nhận xét offline dựa trên dữ liệu của ứng dụng. Với câu hỏi ngoài dữ liệu này, mình chưa có tư liệu kiểm chứng.'
    ].filter(Boolean).join('\n\n'),
    actions: safe ? [{ label: `Áp dụng: ${requested.name.split(' (')[0]} + Quần lụa trắng + Giày Oxford`, suggestedPatch: candidate }] : []
  };
}
