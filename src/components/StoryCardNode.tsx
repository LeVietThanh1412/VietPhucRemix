import React from 'react';
import QRCode from 'qrcode';
import { effectiveColor } from '../utils/outfitColor';
import { OutfitConfig } from '../types/vietphuc';
import { GARMENTS, HERITAGE_COLORS, BOTTOMS, FOOTWEAR, HEADWEAR } from '../data/heritageData';
import { computeLookMetrics } from '../utils/lookMetrics';
import { MannequinVisualizer } from './MannequinVisualizer';
import { Sparkles, ShieldCheck, Compass, Heart } from 'lucide-react';

interface StoryCardNodeProps {
  config: OutfitConfig;
  format: 'story' | 'post';
  title?: string;
  shareUrl?: string;
  cardRef?: React.Ref<HTMLDivElement>;
  onQrReady?: (url: string) => void;
  onQrError?: (url: string) => void;
}

export const StoryCardNode: React.FC<StoryCardNodeProps> = ({
  config,
  format,
  title,
  shareUrl = '',
  cardRef,
  onQrReady,
  onQrError
}) => {
  const [qrDataUrl, setQrDataUrl] = React.useState<string>('');

  const selectedGarment = GARMENTS.find(g => g.id === config.garmentId) || GARMENTS[0];
  const selectedColor = effectiveColor(config);
  const selectedBottom = BOTTOMS.find(b => b.id === config.bottomId);
  const selectedFootwear = FOOTWEAR.find(f => f.id === config.footwearId);
  const selectedHeadwear = HEADWEAR.find(h => h.id === config.headwearId);

  const metrics = computeLookMetrics(config);
  const displayTitle = title?.trim() || selectedGarment.name;
  const isStory = format === 'story';

  React.useEffect(() => {
    let cancelled = false;
    setQrDataUrl('');
    if (!shareUrl) return;
    QRCode.toDataURL(shareUrl, {
      margin: 1,
      width: 140,
      color: {
        dark: '#1C1917',
        light: '#FFFFFF'
      }
    })
      .then(url => { if (!cancelled) { setQrDataUrl(url); onQrReady?.(shareUrl); } })
      .catch(() => { if (!cancelled) onQrError?.(shareUrl); });
    return () => { cancelled = true; };
  }, [shareUrl, onQrReady, onQrError]);

  return (
    <div
      ref={cardRef}
      className={`relative mx-auto bg-[#FAF7F2] text-stone-900 overflow-hidden flex flex-col justify-between shadow-2xl border-4 border-amber-900/30 ${
        isStory ? 'w-[432px] h-[768px] p-6' : 'w-[432px] h-[540px] p-5'
      }`}
      style={{
        boxSizing: 'border-box',
        backgroundImage: 'radial-gradient(#E8DFC8 0.75px, transparent 0.75px)',
        backgroundSize: '16px 16px',
        backgroundColor: '#FAF7F2'
      }}
    >
      {/* Decorative Ornate Vietnamese Double-Border */}
      <div className="absolute inset-2 border border-amber-800/25 pointer-events-none rounded-lg" />
      <div className="absolute inset-3 border border-amber-700/15 pointer-events-none rounded-md" />

      {/* 1. Header: Branding & Heritage Era */}
      <div className="relative z-10 text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold tracking-[0.25em] text-amber-900/80 font-sans">
          <span>✦</span>
          <span>VIỆT PHỤC REMIX</span>
          <span>·</span>
          <span>DI SẢN ĐƯƠNG ĐẠI</span>
          <span>✦</span>
        </div>

        <h1 className="break-words font-serif text-2xl font-black text-stone-900 tracking-tight leading-tight">
          {displayTitle}
        </h1>

        <div className="flex items-center justify-center gap-2 text-[11px] text-stone-600 font-sans">
          <span className="font-medium text-amber-950">{selectedGarment.dynasty}</span>
          <span className="text-stone-300">•</span>
          <span className="px-1.5 py-0.5 rounded bg-amber-100/80 text-amber-900 text-[10px] font-semibold">
            {selectedGarment.authenticity === 'documented'
              ? 'CÓ TƯ LIỆU LỊCH SỬ'
              : selectedGarment.authenticity === 'reconstructed'
              ? 'PHỎNG DỰNG VĂN HÓA'
              : 'CÁCH TÂN CẬN ĐẠI'}
          </span>
        </div>
      </div>

      {/* 2. Visualizer Centerpiece */}
      <div className="relative z-10 flex-1 min-h-0 my-2 flex items-center justify-center">
          <MannequinVisualizer
            config={config}
            hideBadge
            fitToContainer
            className="shadow-lg border-2 border-stone-200/90 rounded-xl"
          />
      </div>

      {/* 3. Cultural Story & Harmony Summary */}
      <div className="relative z-10 space-y-2">
        {/* Cultural description snippet */}
        <p className={`text-stone-700 font-serif italic text-center leading-relaxed line-clamp-2 ${isStory ? 'text-xs px-2' : 'text-[11px] px-1'}`}>
          "{selectedGarment.culturalSignificance}"
        </p>

        {/* Color Palette & Components Bar */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-white/90 border border-stone-200/80 text-[11px] shadow-2xs">
          {/* Swatches */}
          <div className="flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-full border border-black/15 shrink-0 shadow-2xs"
              style={{ backgroundColor: config.customColorHex || selectedColor.hex }}
              title={selectedColor.name}
            />
            <div className="leading-tight">
              <span className="font-semibold text-stone-800 block text-[11px]">
                {config.customColorHex ? `Màu ${config.customColorHex}` : selectedColor.name.split(' (')[0]}
              </span>
              <span className="text-[10px] text-amber-800 font-medium">Hành {selectedColor.element}</span>
            </div>
          </div>

          {/* Cultural Etiquette Score */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-stone-100 text-stone-700 font-mono text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Chuẩn mực: <b>{metrics.cultural}/100</b></span>
          </div>
        </div>

        {/* Footer: QR Code & Social Tag */}
        <div className="flex items-center justify-between pt-1 border-t border-stone-200/70 text-[10px] text-stone-500 font-sans">
          <div className="space-y-0.5">
            <span className="font-semibold text-stone-700 block">Quét QR trải nghiệm phối đồ:</span>
            <span className="text-[9px] text-stone-400 font-mono">@vietphuc.remix · #VietPhucRemix</span>
          </div>

          {qrDataUrl && (
            <div className="p-1 rounded bg-white border border-stone-200 shadow-2xs">
              <img src={qrDataUrl} alt="Mã QR Look" className="w-9 h-9" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
