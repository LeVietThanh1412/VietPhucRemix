import { HERITAGE_COLORS } from '../data/heritageData';
import { OutfitConfig } from '../types/vietphuc';

/** Keep editable colors opaque and compatible with the browser's color picker. */
export function normalizeHex(value: unknown): string | undefined {
  if (typeof value !== 'string' || !/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(value)) return undefined;
  const hex = value.slice(1);
  return '#' + (hex.length === 3 ? [...hex].map(c => c + c).join('') : hex).toUpperCase();
}

/** Custom colors use the nearest catalog color for the app's symbolic color rules. */
export function effectiveColor(config: OutfitConfig) {
  const base = HERITAGE_COLORS.find(c => c.id === config.colorId) || HERITAGE_COLORS[0];
  const hex = normalizeHex(config.customColorHex);
  if (!hex) return base;
  const rgb = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const target = rgb(hex);
  const distance = (h: string) => rgb(h).reduce((sum, v, i) => sum + (v - target[i]) ** 2, 0);
  const nearest = HERITAGE_COLORS.reduce((best, color) => distance(color.hex) < distance(best.hex) ? color : best);
  return { ...nearest, hex, name: `Màu tùy chỉnh ${hex}` };
}
