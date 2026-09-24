import React, { useRef } from 'react';
import { OutfitConfig } from '../types/vietphuc';
import { GARMENTS, HERITAGE_COLORS, BOTTOMS, HEADWEAR, FOOTWEAR, ACCESSORIES, EVENTS } from '../data/heritageData';
import { MannequinVisualizer } from './MannequinVisualizer';
import { Download, X, Share2, Check, Sparkles } from 'lucide-react';

interface LookbookCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: OutfitConfig;
}

export const LookbookCardModal: React.FC<LookbookCardModalProps> = ({
  isOpen,
  onClose,
  config
}) => {
  const [copied, setCopied] = React.useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const garment = GARMENTS.find(g => g.id === config.garmentId) || GARMENTS[0];
  const color = HERITAGE_COLORS.find(c => c.id === config.colorId) || HERITAGE_COLORS[0];
  const bottom = BOTTOMS.find(b => b.id === config.bottomId) || BOTTOMS[0];
  const headwear = HEADWEAR.find(h => h.id === config.headwearId);
  const footwear = FOOTWEAR.find(f => f.id === config.footwearId) || FOOTWEAR[0];
  const event = EVENTS.find(e => e.id === config.targetEvent) || EVENTS[0];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    // Generate a clean HTML5 Canvas snapshot
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 1100;

    // Background Warm Paper
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border Frame
    ctx.strokeStyle = '#D6CEBE';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    // Magazine Header
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 36px serif';
    ctx.textAlign = 'center';
    ctx.fillText('VIỆT PHỤC REMIX', canvas.width / 2, 90);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#78350F';
    ctx.fillText('LOOKBOOK DI SẢN & PHONG CÁCH TRẺ · GEN Z EDITION', canvas.width / 2, 120);

    // Hairline
    ctx.strokeStyle = '#E5DEC9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 140);
    ctx.lineTo(canvas.width - 60, 140);
    ctx.stroke();

    // Garment Title
    ctx.font = 'bold 28px serif';
    ctx.fillStyle = '#1C1917';
    ctx.fillText(garment.name.toUpperCase(), canvas.width / 2, 190);

    ctx.font = 'italic 16px serif';
    ctx.fillStyle = '#57534E';
    ctx.fillText(garment.dynasty, canvas.width / 2, 220);

    // Color Swatch
    ctx.fillStyle = color.hex;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 260, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#D1D5DB';
    ctx.stroke();

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#1C1917';
    ctx.fillText(`Sắc thái: ${color.name} (Hành ${color.element})`, canvas.width / 2, 305);

    // Specification List
    ctx.textAlign = 'left';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = '#78350F';
    ctx.fillText('THÔNG SỐ PHỐI TRANG PHỤC:', 80, 360);

    ctx.font = '15px sans-serif';
    ctx.fillStyle = '#292524';
    const specs = [
      `• Áo chính: ${garment.name}`,
      `• Hạ y: ${bottom.name}`,
      `• Mũ / Khăn: ${headwear?.name || 'Tự nhiên'}`,
      `• Giày dép: ${footwear.name}`,
      `• Phụ kiện: ${config.accessories.map(a => ACCESSORIES.find(acc => acc.id === a)?.name).join(', ') || 'Tối giản'}`,
      `• Bối cảnh phù hợp: ${event.name}`
    ];

    specs.forEach((s, idx) => {
      ctx.fillText(s, 80, 400 + idx * 35);
    });

    // Cultural meaning quote
    ctx.fillStyle = '#F5F0E6';
    ctx.fillRect(80, 640, canvas.width - 160, 180);
    ctx.strokeStyle = '#D6CEBE';
    ctx.strokeRect(80, 640, canvas.width - 160, 180);

    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#78350F';
    ctx.fillText('GIÁ TRỊ VĂN HÓA CỐT LÕI:', 110, 680);

    ctx.font = 'italic 15px serif';
    ctx.fillStyle = '#44403C';
    // Multi-line wrap
    const words = garment.culturalSignificance.split(' ');
    let line = '';
    let y = 715;
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 560 && i > 0) {
        ctx.fillText(line, 110, y);
        line = words[i] + ' ';
        y += 26;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 110, y);

    // Footer
    ctx.textAlign = 'center';
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#8C7E72';
    ctx.fillText('Việt Phục Remix · Tôn Vinh Di Sản - Tự Hào Bản Sắc', canvas.width / 2, 1020);

    // Trigger download
    const link = document.createElement('a');
    link.download = `viet-phuc-remix-${garment.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        ref={cardRef}
        className="bg-[#FAF7F2] rounded-2xl border border-stone-300 max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-stone-200/80 flex items-center justify-between bg-white/70 sticky top-0 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif text-lg md:text-xl font-bold text-stone-900">
              Lookbook Việt Phục Remix
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép!' : 'Chia sẻ'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-900 text-xs font-medium text-white hover:bg-stone-800 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải thẻ Lookbook</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content / Editorial Lookbook Card */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Visual Column */}
            <div className="md:col-span-6 flex flex-col items-center">
              <MannequinVisualizer config={config} className="w-full shadow-lg" />
              <p className="text-[11px] text-stone-400 mt-2 font-mono text-center">
                Mô hình trực quan tỷ lệ 3:4 · Chuẩn thiết kế di sản
              </p>
            </div>

            {/* Editorial Data Column */}
            <div className="md:col-span-6 space-y-5">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold font-sans">
                  VOL. 01 · BẢN SẮC & THỜI TRANG TRẺ
                </span>
                <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1">
                  {garment.name}
                </h1>
                <p className="text-sm text-stone-500 font-serif italic mt-0.5">
                  {garment.dynasty}
                </p>
              </div>

              <div className="p-4 bg-white/80 rounded-xl border border-stone-200/80 shadow-xs space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Thông số bản phối cá nhân:
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="text-stone-500">Sắc màu chủ đạo:</span>
                    <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.hex }} />
                      {color.name}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="text-stone-500">Trang phục dưới:</span>
                    <span className="font-semibold text-stone-900">{bottom.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="text-stone-500">Mũ / Khăn đội:</span>
                    <span className="font-semibold text-stone-900">{headwear?.name || 'Tự nhiên'}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="text-stone-500">Giày dép:</span>
                    <span className="font-semibold text-stone-900">{footwear.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="text-stone-500">Bối cảnh đề xuất:</span>
                    <span className="font-semibold text-amber-800">{event.name}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Ý nghĩa văn hóa:
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  {garment.culturalSignificance}
                </p>
              </div>

              <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200/80 text-xs text-amber-900">
                <p className="font-semibold mb-0.5">Lời nhắn người yêu Việt phục:</p>
                <p className="text-stone-700">
                  "Mặc cổ phục không chỉ để chụp ảnh đẹp, mà là khoác lên mình tâm hồn và niềm kiêu hãnh của hàng nghìn năm văn hiến."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
