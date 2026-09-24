import React from 'react';
import { OutfitConfig } from '../types/vietphuc';
import { HERITAGE_COLORS, BOTTOMS } from '../data/heritageData';
import { evaluateColorHarmony } from '../utils/harmonyCalculator';
import { Palette, Sparkles, CheckCircle2 } from 'lucide-react';

interface ColorHarmonyEngineProps {
  config: OutfitConfig;
}

export const ColorHarmonyEngine: React.FC<ColorHarmonyEngineProps> = ({ config }) => {
  const harmony = evaluateColorHarmony(config);
  const garmentColor = HERITAGE_COLORS.find(c => c.id === config.colorId) || HERITAGE_COLORS[0];
  const bottom = BOTTOMS.find(b => b.id === config.bottomId) || BOTTOMS[0];

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-50 text-rose-800">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 text-sm md:text-base">
              Hài Hòa Màu Sắc Ngũ Hành
            </h3>
            <p className="text-xs text-stone-500">
              Phân tích bảng màu di sản và nguyên lý thẩm mỹ thị giác
            </p>
          </div>
        </div>

        {/* Score Ring / Pill */}
        <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200/80">
          <div className="text-right">
            <span className="text-lg font-bold font-mono text-stone-900 leading-none">
              {harmony.score}
            </span>
            <span className="text-[10px] text-stone-400 block font-mono">/ 100</span>
          </div>
        </div>
      </div>

      {/* Visual Color Distribution Bar (60-30-10) */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-stone-600 font-medium">
          <span>Tỷ lệ phân bổ màu sắc thị giác:</span>
          <span className="text-stone-400 text-[11px]">60% Áo · 30% Hạ y · 10% Điểm nhấn</span>
        </div>
        <div className="h-3.5 w-full rounded-full overflow-hidden flex shadow-inner border border-stone-200/60 p-0.5 bg-stone-100">
          {/* 60% Garment */}
          <div
            className="h-full rounded-l-full transition-all duration-300 relative group"
            style={{ width: '60%', backgroundColor: garmentColor.hex }}
            title={`Áo chính: ${garmentColor.name} (60%)`}
          />
          {/* 30% Bottom */}
          <div
            className="h-full transition-all duration-300 relative group"
            style={{
              width: '30%',
              backgroundColor: config.bottomId === 'quan-lua-den' ? '#1C1917' : config.bottomId === 'quan-jeans-suong' ? '#607D8B' : '#EFE9DF'
            }}
            title={`Hạ y: ${bottom.name} (30%)`}
          />
          {/* 10% Accent */}
          <div
            className="h-full rounded-r-full transition-all duration-300 relative group"
            style={{ width: '10%', backgroundColor: '#D4AF37' }}
            title="Phụ kiện & Trang sức (10%)"
          />
        </div>
      </div>

      {/* Harmony evaluation details */}
      <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200/70 text-xs space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-semibold text-stone-900">{harmony.title}</span>
          <div className="flex items-center gap-1.5 ml-auto">
            {harmony.tags.map((t, idx) => (
              <span key={idx} className="bg-white text-stone-600 border border-stone-200 text-[10px] px-1.5 py-0.5 rounded font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>

        <p className="text-stone-700 leading-relaxed">
          {harmony.elementAnalysis}
        </p>

        <p className="text-stone-600 leading-relaxed border-t border-stone-200/60 pt-2">
          {harmony.ratioAnalysis}
        </p>

        <div className="flex items-start gap-1.5 text-stone-500 pt-1 italic">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>{harmony.advice}</span>
        </div>
      </div>

      {/* Selected Color Meaning */}
      <div className="flex items-center gap-3 pt-1">
        <span
          className="w-5 h-5 rounded-full shrink-0 border border-stone-300 shadow-xs"
          style={{ backgroundColor: garmentColor.hex }}
        />
        <div className="text-xs">
          <span className="font-semibold text-stone-800">{garmentColor.name}</span>
          <span className="text-stone-500"> (Hành {garmentColor.element}): {garmentColor.meaning}</span>
        </div>
      </div>
    </div>
  );
};
