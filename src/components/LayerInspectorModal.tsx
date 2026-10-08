import { HexColorInput } from './HexColorInput';
import React from 'react';
import { OutfitConfig, LayerVisibility } from '../types/vietphuc';
import { GARMENTS, HERITAGE_COLORS, BOTTOMS, FOOTWEAR, HEADWEAR, ACCESSORIES } from '../data/heritageData';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  X, 
  Palette, 
  Sparkles, 
  RotateCcw, 
  Check, 
  Sliders, 
  HelpCircle,
  Shirt,
  Footprints
} from 'lucide-react';
import { 
  IconVietHeadwear,
  IconVietAccessory,
  IconVietGarment,
  IconVietBottom,
  IconVietFootwear,
  IconVietMannequin,
  IconVietBackdrop
} from './VietIcons';

interface LayerInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: OutfitConfig;
  onChangeConfig: (newConfig: OutfitConfig) => void;
}

const PRESET_HEX_COLORS = [
  { name: 'Đỏ Chu Sa Cung Đình', hex: '#991B1B' },
  { name: 'Vàng Kim Hoàng Gia', hex: '#D97706' },
  { name: 'Xanh Chàm Cổ Kính', hex: '#1E3A8A' },
  { name: 'Lục Ngọc Bích', hex: '#047857' },
  { name: 'Tím Huế Mộng Mơ', hex: '#6B21A8' },
  { name: 'Hồng Sen Thắm', hex: '#DB2777' },
  { name: 'Nâu Trầm Hương', hex: '#78350F' },
  { name: 'Đen Mực Nho', hex: '#1C1917' }
];

export const LayerInspectorModal: React.FC<LayerInspectorModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig
}) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);
  if (!isOpen) return null;

  const currentLayers: Required<LayerVisibility> = {
    backdrop: config.layerVisibility?.backdrop !== false,
    body: config.layerVisibility?.body !== false,
    bottom: config.layerVisibility?.bottom !== false,
    footwear: config.layerVisibility?.footwear !== false,
    garment: config.layerVisibility?.garment !== false,
    accessories: config.layerVisibility?.accessories !== false,
    headwear: config.layerVisibility?.headwear !== false
  };

  const selectedGarment = GARMENTS.find(g => g.id === config.garmentId);
  const selectedBottom = BOTTOMS.find(b => b.id === config.bottomId);
  const selectedFootwear = FOOTWEAR.find(f => f.id === config.footwearId);
  const selectedHeadwear = HEADWEAR.find(h => h.id === config.headwearId);
  const selectedColor = HERITAGE_COLORS.find(c => c.id === config.colorId);

  const activeHex = config.customColorHex || selectedColor?.hex || '#991B1B';

  const toggleLayer = (key: keyof LayerVisibility) => {
    const updated: LayerVisibility = {
      ...config.layerVisibility,
      [key]: !currentLayers[key]
    };
    onChangeConfig({
      ...config,
      layerVisibility: updated
    });
  };

  const setAllLayers = (visible: boolean) => {
    onChangeConfig({
      ...config,
      layerVisibility: {
        backdrop: visible,
        body: visible,
        bottom: visible,
        footwear: visible,
        garment: visible,
        accessories: visible,
        headwear: visible
      }
    });
  };

  const setGarmentOnly = () => {
    onChangeConfig({
      ...config,
      layerVisibility: {
        backdrop: false,
        body: false,
        bottom: true,
        footwear: true,
        garment: true,
        accessories: true,
        headwear: true
      }
    });
  };

  const handleCustomHex = (hex: string) => {
    onChangeConfig({
      ...config,
      customColorHex: hex
    });
  };

  const resetCustomColor = () => {
    const { customColorHex, ...rest } = config;
    onChangeConfig(rest as OutfitConfig);
  };

  const layersList = [
    {
      key: 'headwear' as const,
      level: 'Z=7 (Lớp trên cùng)',
      name: 'Mũ & Khăn Vấn (Headwear)',
      itemName: selectedHeadwear?.name || 'Không đội mũ',
      Icon: IconVietHeadwear
    },
    {
      key: 'accessories' as const,
      level: 'Z=6',
      name: 'Phụ Kiện Cầm Tay (Accessories)',
      itemName: config.accessories.length > 0 ? `${config.accessories.length} món phụ kiện` : 'Không có phụ kiện',
      Icon: IconVietAccessory
    },
    {
      key: 'garment' as const,
      level: 'Z=5 (Trang phục chính)',
      name: 'Lớp Áo Chính (Main Garment)',
      itemName: selectedGarment?.name || 'Áo',
      Icon: IconVietGarment
    },
    {
      key: 'bottom' as const,
      level: 'Z=4',
      name: 'Quần / Chân Váy (Bottom)',
      itemName: selectedBottom?.name || 'Quần',
      Icon: IconVietBottom
    },
    {
      key: 'footwear' as const,
      level: 'Z=3',
      name: 'Giày Dép & Guốc (Footwear)',
      itemName: selectedFootwear?.name || 'Giày',
      Icon: IconVietFootwear
    },
    {
      key: 'body' as const,
      level: 'Z=2',
      name: 'Dáng Người & Mặt (Body & Face)',
      itemName: config.modelGender === 'male' ? 'Dáng Nam' : config.modelGender === 'female' ? 'Dáng Nữ' : 'Dáng Unisex',
      Icon: IconVietMannequin
    },
    {
      key: 'backdrop' as const,
      level: 'Z=1 (Lớp đáy)',
      name: 'Bối Cảnh Di Sản (Backdrop & Shadow)',
      itemName: config.backdrop,
      Icon: IconVietBackdrop
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Bộ điều khiển lớp Layering & Bảng màu Hex"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#FAF7F2] rounded-2xl border border-stone-300 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200/80 flex items-center justify-between bg-white/80 sticky top-0 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-100/70 text-amber-900">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Bộ Điều Khiển Lớp (Layering Architecture)
              </h2>
              <p className="text-xs text-stone-500 font-sans">
                Cơ chế xếp chồng SVG đa lớp chuẩn Avatar Generator & Đổi màu Hex realtime
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-stone-100/70 rounded-xl border border-stone-200">
            <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Thao tác nhanh:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAllLayers(true)}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 shadow-2xs"
              >
                Hiện tất cả lớp
              </button>
              <button
                onClick={setGarmentOnly}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 shadow-2xs"
              >
                Chỉ xem trang phục
              </button>
            </div>
          </div>

          {/* Layer Stacking Pipeline List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Thứ tự xếp lớp (Từ trên xuống dưới):
              </span>
              <span className="text-[11px] text-stone-400">
                (Click vào icon mắt để bật/tắt từng lớp)
              </span>
            </div>

            <div className="divide-y divide-stone-200/80 border border-stone-200 rounded-xl bg-white overflow-hidden shadow-2xs">
              {layersList.map(layer => {
                const isVisible = currentLayers[layer.key];
                return (
                  <div
                    key={layer.key}
                    className={`flex items-center justify-between p-3 transition-colors ${
                      isVisible ? 'bg-white hover:bg-stone-50/70' : 'bg-stone-100/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <layer.Icon size={38} className="rounded-lg shadow-2xs border border-amber-900/10" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-stone-800">
                            {layer.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 font-mono">
                            {layer.level}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500">
                          Đang chọn: <b className="text-amber-900">{layer.itemName}</b>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleLayer(layer.key)}
                      className={`p-2 rounded-lg border transition-all ${
                        isVisible
                          ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                          : 'bg-stone-200 border-stone-300 text-stone-500 hover:bg-stone-300'
                      }`}
                      title={isVisible ? 'Ẩn lớp này' : 'Hiện lớp này'}
                    >
                      {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hex Color Customizer (Avatar Generator Feature) */}
          <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Tùy Biến Màu Hex Tự Do (Props & CSS Filter)
                </span>
              </div>
              {config.customColorHex && (
                <button
                  onClick={resetCustomColor}
                  className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-800 underline"
                >
                  <RotateCcw className="w-3 h-3" /> Trở về màu di sản gốc
                </button>
              )}
            </div>

            <p className="text-xs text-stone-500">
              Cơ chế Avatar Generator cho phép đổi màu áo chính theo bất kỳ mã Hex nào với ánh bóng lụa (silk-sheen) tự động cân bằng tương phản sáng/tối.
            </p>

            {/* Input & Swatches */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="color"
                  value={activeHex}
                  onChange={e => handleCustomHex(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-stone-300 p-0.5 bg-white shadow-2xs"
                  title="Chọn mã màu"
                />
                <div className="relative flex-1 sm:w-36">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-xs">
                    #
                  </span>
                  <HexColorInput value={activeHex} onChange={handleCustomHex} className="w-full pl-6 pr-2.5 py-1.5 border border-stone-300 rounded-lg font-mono text-xs uppercase bg-white" />
                </div>
              </div>

              {/* Color preview capsule */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 w-full sm:w-auto">
                <span
                  className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: activeHex }}
                />
                <span className="text-xs font-mono text-stone-700 font-semibold">{activeHex}</span>
                {config.customColorHex && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-medium">
                    Tùy biến
                  </span>
                )}
              </div>
            </div>

            {/* Preset Color Swatches */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-stone-500">Gợi ý sắc màu:</span>
              <div className="flex flex-wrap gap-2">
                {PRESET_HEX_COLORS.map(p => (
                  <button
                    key={p.hex}
                    onClick={() => handleCustomHex(p.hex)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                      activeHex.toLowerCase() === p.hex.toLowerCase()
                        ? 'border-amber-800 bg-amber-50 text-amber-900 shadow-2xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/10"
                      style={{ backgroundColor: p.hex }}
                    />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-stone-200/80 bg-white/70 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 shadow-xs"
          >
            Hoàn tất xem lớp
          </button>
        </div>
      </div>
    </div>
  );
};
