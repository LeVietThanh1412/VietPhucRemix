import React, { useState } from 'react';
import { OutfitConfig } from '../types/vietphuc';
import { GARMENTS, HERITAGE_COLORS, BOTTOMS, FOOTWEAR, EVENTS } from '../data/heritageData';
import { Bot, Sparkles, Send, Loader2, RefreshCw, Wand2, ArrowRight } from 'lucide-react';
import { checkCulturalEtiquette } from '../utils/culturalRuleChecker';

interface AIStylistConsultantProps {
  config: OutfitConfig;
  onApplyConfig?: (patch: Partial<OutfitConfig>) => void;
}

interface ParsedAction {
  label: string;
  suggestedPatch: Partial<OutfitConfig>;
}

export const AIStylistConsultant: React.FC<AIStylistConsultantProps> = ({
  config,
  onApplyConfig
}) => {
  const [promptQuery, setPromptQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [detectedActions, setDetectedActions] = useState<ParsedAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<'ai' | 'offline' | null>(null);

  const garment = GARMENTS.find(g => g.id === config.garmentId) || GARMENTS[0];
  const color = HERITAGE_COLORS.find(c => c.id === config.colorId) || HERITAGE_COLORS[0];
  const bottom = BOTTOMS.find(b => b.id === config.bottomId) || BOTTOMS[0];
  const footwear = FOOTWEAR.find(f => f.id === config.footwearId) || FOOTWEAR[0];
  const event = EVENTS.find(e => e.id === config.targetEvent) || EVENTS[0];

  const quickPrompts = [
    { label: 'Phối Lễ Phục Áo Tấc & Khăn Đóng', prompt: 'Gợi ý phối Áo Tấc cho dịp trang trọng đúng chuẩn cổ truyền' },
    { label: 'Phối Áo Viên Lĩnh Vương Triều Lý - Trần', prompt: 'Gợi ý bản phối Áo Viên Lĩnh thời Lý Trần với hoa văn Cúc Dây' },
    { label: 'Phối Áo Nhật Bình Cung Đình Huế', prompt: 'Gợi ý phối Áo Nhật Bình với hoa văn Bát Bửu và màu hoàng tộc' },
    { label: 'Phối Áo Giao Lĩnh Sĩ Tử Thanh Lịch', prompt: 'Gợi ý cách phối Áo Giao Lĩnh thư sinh tao nhã' }
  ];

  // Helper to build tailored fallback responses with direct styling patches
  const buildFallback = (query: string): { reply: string; actions: ParsedAction[] } => {
    const q = query.toLowerCase();
    const actions: ParsedAction[] = [];

    if (q.includes('viên lĩnh') || q.includes('lý') || q.includes('trần')) {
      actions.push({
        label: 'Áp dụng: Áo Viên Lĩnh + Cúc Dây Lý + Vàng Hoàng Yến',
        suggestedPatch: { garmentId: 'ao-vien-linh', patternId: 'cuc-day-ly', colorId: 'hoang-yen', bottomId: 'quan-lua-trang' }
      });
      return {
        reply: `Áo Viên Lĩnh (cổ tròn) là dạng thức phục sức uy nghiêm bậc nhất thời Lý - Trần (thế kỷ 11 - 14). Đặc trưng cổ áo tròn ôm khít chân cổ, vạt gài khuy vai phải, kết hợp cùng đai ngọc hoàng triều đính các phiến ngọc chữ nhật tượng trưng cho phong thái quân tử đĩnh đạc. Bản phối đề xuất kết hợp cùng hoa văn Cúc Dây thời Lý và sắc Vàng Hoàng Yến quyền quý.`,
        actions
      };
    }

    if (q.includes('nhật bình') || q.includes('cung đình')) {
      actions.push({
        label: 'Áp dụng: Áo Nhật Bình + Đỏ Chu Sa + Hoa Văn Bát Bửu',
        suggestedPatch: { garmentId: 'ao-nhat-binh', colorId: 'do-chu-sa', patternId: 'bat-buu', bottomId: 'quan-lua-trang' }
      });
      return {
        reply: `Áo Nhật Bình là thường phục cao quý của Hoàng Thái Hậu, Hoàng Hậu, Công Chúa và mệnh phụ triều Nguyễn. Điểm nhấn là nẹp cổ hình chữ nhật chạy quanh cổ và ngực thêu phượng và dải ngũ sắc, tay áo ngũ hành rực rỡ. Phối cùng sắc Đỏ Chu Sa (hành Hỏa may mắn) và hoa văn Bát Bửu triều đình sẽ tôn trọn nét kiêu sa di sản.`,
        actions
      };
    }

    if (q.includes('giao lĩnh') || q.includes('sĩ tử') || q.includes('học sĩ')) {
      actions.push({
        label: 'Áp dụng: Áo Giao Lĩnh + Lam Chàm + Quần Lụa Trắng',
        suggestedPatch: { garmentId: 'ao-giao-linh', colorId: 'lam-cham', bottomId: 'quan-lua-trang', patternId: 'plain-silk' }
      });
      return {
        reply: `Áo Giao Lĩnh vạt chéo hữu nhậm toát lên phong thái tao nhã của danh sĩ Đại Việt. Khi mặc, lớp cổ lót trắng (Bạch la) e ấp lộ ra bên trong cổ chữ V thanh mảnh, thắt lưng lụa mềm buông rủ tha thướt. Tông màu Lam Chàm tĩnh tại là sự lựa chọn hoàn hảo cho phong cách thư sinh nho nhã.`,
        actions
      };
    }

    // Default Áo Tấc
    actions.push({
      label: 'Áp dụng: Áo Tấc + Khăn Đóng + Quần Lụa Trắng',
      suggestedPatch: { garmentId: 'ao-tac', headwearId: 'khan-dong', bottomId: 'quan-lua-trang', footwearId: 'guoc-moc' }
    });
    return {
      reply: `Áo Tấc (Áo Thụ Thụ) là đại diện chuẩn mực cho quốc phục thời Nguyễn với cổ đứng Lập Lĩnh, ống tay thụng rộng 30-50cm và hàng 5 khuy cúc cài nách phải tượng trưng cho Ngũ Thường (Nhân, Nghĩa, Lễ, Trí, Tín). Kết hợp cùng Khăn Đóng truyền thống và Quần Lụa Trắng mang lại vẻ trang trọng tuyệt đối cho các dịp lễ Tết, cưới hỏi hay nghi lễ cung đình.`,
      actions
    };
  };

  const handleConsult = async (queryText?: string) => {
    const query = queryText || promptQuery;
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);
    setDetectedActions([]);

    try {
      const res = await fetch('/api/stylist/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          currentConfig: {
            garment: garment.name,
            color: color.name,
            bottom: bottom.name,
            footwear: footwear.name,
            targetEvent: event.name
          }
        })
      });

      if (!res.ok) throw new Error('API offline');
      const data = await res.json();
      const replyText = data.reply || '';

      const fb = buildFallback(query);
      setResponse(replyText.trim() || fb.reply);
      setDetectedActions(fb.actions);
      setSource('ai');
    } catch {
      const fb = buildFallback(query);
      setResponse(fb.reply);
      setDetectedActions(fb.actions);
      setSource('offline');
    } finally {
      setLoading(false);
    }
  };

  const executeAction = (actionItem: ParsedAction) => {
    if (actionItem.suggestedPatch) {
      onApplyConfig?.(actionItem.suggestedPatch);
    }

    const stage = document.getElementById('studio-remix');
    if (stage) {
      stage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 text-sm md:text-base flex items-center gap-2">
              <span>Trợ Lý Thời Trang Di Sản AI</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded-full">
                {source === 'offline' ? 'Chế độ tri thức di sản' : 'Gemini AI'}
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Tư vấn phối Cổ Phục chuẩn văn hóa, hoa văn và phối màu Ngũ Hành tương sinh
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-1.5">
        {quickPrompts.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              setPromptQuery(item.prompt);
              handleConsult(item.prompt);
            }}
            disabled={loading}
            className="text-[11px] bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/80 px-2.5 py-1 rounded-md transition-colors text-left flex items-center gap-1"
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="flex gap-2">
        <input
          type="text"
          value={promptQuery}
          onChange={e => setPromptQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleConsult()}
          placeholder="Hỏi AI về cách phối Áo Tấc, Áo Nhật Bình, ý nghĩa 5 khuy cúc hoặc phối màu di sản..."
          className="flex-1 px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-400 bg-stone-50/50"
        />
        <button
          onClick={() => handleConsult()}
          disabled={loading}
          className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors text-xs font-medium flex items-center gap-1.5 shrink-0 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          <span>Tư vấn</span>
        </button>
      </div>

      {/* AI Response Display */}
      {response && (
        <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200/70 text-xs text-stone-800 leading-relaxed space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between text-amber-900 font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Lời khuyên từ Stylist Di Sản:
            </span>
            <button
              onClick={() => handleConsult()}
              className="text-stone-400 hover:text-stone-700 p-0.5"
              title="Làm mới lời khuyên"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          <p className="whitespace-pre-line text-stone-700 font-sans leading-relaxed">
            {response}
          </p>

          {/* Actionable Suggestions */}
          {detectedActions.length > 0 && (
            <div className="pt-2 border-t border-amber-200/60 space-y-1.5">
              <span className="text-[11px] font-semibold text-amber-900 flex items-center gap-1">
                <Wand2 className="w-3 h-3 text-amber-700" />
                <span>Bản phối đề xuất nhanh:</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {detectedActions.map((act, actIdx) => (
                  <button
                    key={actIdx}
                    onClick={() => executeAction(act)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-950 font-semibold text-xs shadow-2xs hover:bg-amber-100/60 transition-all active:scale-95"
                  >
                    <span>{act.label}</span>
                    <ArrowRight className="w-3 h-3 text-amber-600" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
