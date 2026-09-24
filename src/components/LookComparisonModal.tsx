import React from 'react';
import { OutfitConfig } from '../types/vietphuc';
import { GARMENTS, HERITAGE_COLORS, BOTTOMS, FOOTWEAR, PRESET_LOOKBOOKS } from '../data/heritageData';
import { MannequinVisualizer } from './MannequinVisualizer';
import { evaluateColorHarmony } from '../utils/harmonyCalculator';
import { X, ArrowRightLeft, Sparkles } from 'lucide-react';

interface LookComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLook: OutfitConfig;
  onApplyLook: (look: OutfitConfig) => void;
}

export const LookComparisonModal: React.FC<LookComparisonModalProps> = ({
  isOpen,
  onClose,
  currentLook,
  onApplyLook
}) => {
  const [selectedPresetId, setSelectedPresetId] = React.useState<string>(
    PRESET_LOOKBOOKS[0].config.garmentId === currentLook.garmentId 
      ? PRESET_LOOKBOOKS[1].id 
      : PRESET_LOOKBOOKS[0].id
  );

  if (!isOpen) return null;

  const comparePreset = PRESET_LOOKBOOKS.find(p => p.id === selectedPresetId) || PRESET_LOOKBOOKS[0];
  const lookA = currentLook;
  const lookB = comparePreset.config;

  const garmentA = GARMENTS.find(g => g.id === lookA.garmentId) || GARMENTS[0];
  const colorA = HERITAGE_COLORS.find(c => c.id === lookA.colorId) || HERITAGE_COLORS[0];
  const bottomA = BOTTOMS.find(b => b.id === lookA.bottomId) || BOTTOMS[0];
  const footwearA = FOOTWEAR.find(f => f.id === lookA.footwearId) || FOOTWEAR[0];
  const harmonyA = evaluateColorHarmony(lookA);

  const garmentB = GARMENTS.find(g => g.id === lookB.garmentId) || GARMENTS[0];
  const colorB = HERITAGE_COLORS.find(c => c.id === lookB.colorId) || HERITAGE_COLORS[0];
  const bottomB = BOTTOMS.find(b => b.id === lookB.bottomId) || BOTTOMS[0];
  const footwearB = FOOTWEAR.find(f => f.id === lookB.footwearId) || FOOTWEAR[0];
  const harmonyB = evaluateColorHarmony(lookB);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-2xl border border-stone-300 max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Top bar */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-white/70 sticky top-0 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif text-lg md:text-xl font-bold text-stone-900">
              So Sánh Phương Án Phối Đồ
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Preset Selector for Look B */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-stone-200">
            <span className="text-xs text-stone-600 font-medium">Chọn phương án đối chiếu:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {PRESET_LOOKBOOKS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                    selectedPresetId === preset.id
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Split Screen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LOOK A (Current) */}
            <div className="p-5 bg-white rounded-xl border-2 border-amber-800/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                    Phương án A (Hiện tại của bạn)
                  </span>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    {garmentA.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-2 py-1 rounded">
                    Điểm: {harmonyA.score}/100
                  </span>
                </div>
              </div>

              <div className="max-w-[260px] mx-auto">
                <MannequinVisualizer config={lookA} className="w-full" />
              </div>

              <div className="space-y-1.5 text-xs text-stone-700 border-t border-stone-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-stone-500">Màu sắc:</span>
                  <span className="font-medium flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorA.hex }} />
                    {colorA.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Trang phục dưới:</span>
                  <span className="font-medium">{bottomA.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Giày dép:</span>
                  <span className="font-medium">{footwearA.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Đặc trưng:</span>
                  <span className="font-medium">{garmentA.modernVibe}</span>
                </div>
              </div>
            </div>

            {/* LOOK B (Preset) */}
            <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Phương án B ({comparePreset.title})
                  </span>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    {garmentB.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-2 py-1 rounded">
                    Điểm: {harmonyB.score}/100
                  </span>
                </div>
              </div>

              <div className="max-w-[260px] mx-auto">
                <MannequinVisualizer config={lookB} className="w-full" />
              </div>

              <div className="space-y-1.5 text-xs text-stone-700 border-t border-stone-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-stone-500">Màu sắc:</span>
                  <span className="font-medium flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorB.hex }} />
                    {colorB.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Trang phục dưới:</span>
                  <span className="font-medium">{bottomB.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Giày dép:</span>
                  <span className="font-medium">{footwearB.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Đặc trưng:</span>
                  <span className="font-medium">{garmentB.modernVibe}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onApplyLook(lookB);
                  onClose();
                }}
                className="w-full py-2.5 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 mt-2 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Áp dụng công thức phối này</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
