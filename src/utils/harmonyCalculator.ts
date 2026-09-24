import { ColorId, OutfitConfig, ColorHarmonyResult } from '../types/vietphuc';
import { HERITAGE_COLORS, BOTTOMS } from '../data/heritageData';

const ELEMENT_CYCLE: Record<string, { generates: string; overcomes: string }> = {
  'Kim': { generates: 'Thủy', overcomes: 'Mộc' },
  'Thủy': { generates: 'Mộc', overcomes: 'Hỏa' },
  'Mộc': { generates: 'Hỏa', overcomes: 'Thổ' },
  'Hỏa': { generates: 'Thổ', overcomes: 'Kim' },
  'Thổ': { generates: 'Kim', overcomes: 'Thủy' }
};

export function evaluateColorHarmony(config: OutfitConfig): ColorHarmonyResult {
  const garmentColor = HERITAGE_COLORS.find(c => c.id === config.colorId) || HERITAGE_COLORS[0];
  const bottom = BOTTOMS.find(b => b.id === config.bottomId);

  // Determine bottom color element
  let bottomElement: 'Kim' | 'Thủy' | 'Mộc' | 'Hỏa' | 'Thổ' = 'Kim';
  if (config.bottomId === 'quan-lua-den') bottomElement = 'Thủy';
  else if (config.bottomId === 'quan-jeans-suong') bottomElement = 'Thủy';
  else if (config.bottomId === 'vay-xep-ly') bottomElement = 'Mộc';
  else if (config.bottomId === 'quan-palazzo') bottomElement = 'Thổ';

  const gElement = garmentColor.element;
  const cycleInfo = ELEMENT_CYCLE[gElement];

  let score = 80;
  let elementAnalysis = '';
  let advice = '';
  const tags: string[] = [];

  // Ngũ Hành relationship
  if (cycleInfo.generates === bottomElement || ELEMENT_CYCLE[bottomElement]?.generates === gElement) {
    score += 15;
    elementAnalysis = `Quan hệ Tương Sinh (${gElement} & ${bottomElement}): Năng lượng hài hòa, nuôi dưỡng và sinh khí tươi mới theo triết lý Đông phương.`;
    tags.push('Ngũ Hành Tương Sinh', 'Cát Tường');
  } else if (gElement === bottomElement) {
    score += 10;
    elementAnalysis = `Quan hệ Đồng Hành (${gElement}): Tạo sự vững chãi, liền mạch và phong thái đồng điệu.`;
    tags.push('Đồng Hành Tương Trợ');
  } else if (cycleInfo.overcomes === bottomElement) {
    score -= 5;
    elementAnalysis = `Quan hệ Tương Khắc (${gElement} khắc ${bottomElement}): Tạo sự tương phản thị giác gắt ghét nhưng giàu kịch tính nếu biết tiết chế phụ kiện.`;
    tags.push('Tương Phản Cá Tính');
  } else {
    score += 5;
    elementAnalysis = `Sự kết hợp ôn hòa giữa hành ${gElement} của áo và hành ${bottomElement} của trang phục dưới.`;
    tags.push('Cân Bằng Âm Dương');
  }

  // Visual Palette Check (60-30-10 ratio)
  let ratioAnalysis = '';
  if (config.bottomId === 'quan-lua-trang' || config.bottomId === 'quan-lua-den') {
    score += 5;
    ratioAnalysis = 'Phối màu kinh điển 60-30-10: Sắc áo chính làm chủ đạo (60%), quần lụa nền tảng trung tính (30%), phụ kiện làm điểm nhấn ánh kim/ngọc (10%).';
  } else {
    ratioAnalysis = 'Phối màu phá cách Gen Z: Điểm chuyển tiếp giữa thân áo truyền thống và chân váy/palazzo tạo tỷ lệ thị giác cao ráo, thanh thoát.';
  }

  // Refined advice
  if (score >= 90) {
    advice = 'Bảng màu đạt chuẩn "Vẻ Đẹp Hoàn Mỹ": Vừa đậm đà bản sắc vừa cực kỳ bắt mắt trước ống kính!';
  } else if (score >= 80) {
    advice = 'Tỉ lệ sắc thái cân đối tốt. Có thể thêm 1 phụ kiện ánh bạc hoặc quạt giấy Dó để hoàn thiện điểm nhấn 10%.';
  } else {
    advice = 'Nên chọn quần lụa trắng hoặc đen để làm dịu bớt độ gắt của sắc áo chính, giúp tổng thể trang nhã hơn.';
  }

  return {
    score: Math.min(100, Math.max(65, score)),
    title: score >= 90 ? 'Hài Hòa Tuyệt Sắc' : score >= 80 ? 'Cân Đối Trang Nhã' : 'Phá Cách Ấn Tượng',
    elementAnalysis,
    ratioAnalysis,
    advice,
    tags
  };
}
