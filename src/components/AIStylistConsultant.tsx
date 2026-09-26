import React, { useState } from 'react';
import { OutfitConfig } from '../types/vietphuc';
import { GARMENTS, HERITAGE_COLORS, BOTTOMS, FOOTWEAR, EVENTS } from '../data/heritageData';
import { Bot, Sparkles, Send, Loader2, RefreshCw } from 'lucide-react';
import { checkCulturalEtiquette } from '../utils/culturalRuleChecker';

interface AIStylistConsultantProps {
  config: OutfitConfig;
}

export const AIStylistConsultant: React.FC<AIStylistConsultantProps> = ({ config }) => {
  const [promptQuery, setPromptQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<'ai' | 'offline' | null>(null);

  const garment = GARMENTS.find(g => g.id === config.garmentId) || GARMENTS[0];
  const color = HERITAGE_COLORS.find(c => c.id === config.colorId) || HERITAGE_COLORS[0];
  const bottom = BOTTOMS.find(b => b.id === config.bottomId) || BOTTOMS[0];
  const footwear = FOOTWEAR.find(f => f.id === config.footwearId) || FOOTWEAR[0];
  const event = EVENTS.find(e => e.id === config.targetEvent) || EVENTS[0];

  const quickPrompts = [
    'Thẩm định gu phối đồ này theo góc nhìn Gen Z',
    'Gợi ý cách tạo dáng chụp ảnh tôn vinh tà áo',
    'Làm sao để remix thêm phụ kiện mà vẫn chuẩn văn hóa?'
  ];

  const buildFallback = () => {
    const issues = checkCulturalEtiquette(config).filter(a => a.level === 'critical' || a.level === 'warning');
    const prefix = issues.length
      ? `⚠️ Trước tiên, lưu ý: ${issues.map(a => `${a.title}. ${a.guidance}`).join(' ')}\n\n`
      : '';
    return prefix + buildPraise();
  };

  const buildPraise = () => {
    if (garment.id === 'ao-tac') {
      return `Outfit Áo Tấc sắc ${color.name} này mang lại thần thái "Vương triều quý tộc" cực đỉnh! Điểm cộng lớn là tay áo thụng rộng tạo cảm giác bề thế, uy nghiêm. Nếu bạn mang guốc mộc truyền thống, hãy thử tạo dáng hai tay chắp phía trước bụng để ống tay áo buông tự nhiên thành dáng chữ Nhất - vừa tôn nét khiêm hòa vừa lên ảnh lookbook cực kỳ điện ảnh!`;
    }
    if (garment.id === 'ao-ngu-than') {
      return `Sự kết hợp giữa Áo Ngũ Thân tay chẽn và ${footwear.name} là chuẩn định nghĩa "Việt phục Remix" của Gen Z! Bạn vừa giữ phom áo năm thân với 5 khuy (theo cách hiểu phổ biến là tượng trưng cho Ngũ thường), vừa có sự năng động để tự tin sải bước cà phê phố cổ hay đi kỷ yếu. Tuyệt đối đừng quên một chiếc kính râm retro để bức ảnh tăng thêm 100% độ "slay"!`;
    }
    if (garment.id === 'ao-tu-than') {
      return `Vibe thiếu nữ Kinh Bắc hòa cùng phong cách hiện đại rất ngọt ngào! Chiếc yếm thắm màu bên trong tà áo tứ thân tạo nét duyên dáng, đoan trang. Nếu đi sự kiện hoặc biểu diễn, một chiếc nón quai thao nghiêng nhẹ góc 45 độ sẽ tạo bố cục khuôn hình hoàn hảo.`;
    }
    return `Bản phối ${garment.name} với tông màu ${color.name} và ${bottom.name} thể hiện gu thẩm mỹ rất có chiều sâu. Bạn đã khéo léo cân bằng giữa tính trang trọng của di sản và sự thoải mái hiện đại, sẵn sàng tỏa sáng trong dịp ${event.name}!`;
  };

  const handleConsult = async (queryText?: string) => {
    const query = queryText || promptQuery || 'Thẩm định outfit hiện tại';
    setLoading(true);

    try {
      const res = await fetch('/api/ai-stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.slice(0, 500), config })
      });

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        setResponse(data.error || 'Bạn hỏi hơi nhanh, thử lại sau ít phút nhé.');
        setSource('offline');
        return;
      }
      if (!res.ok) {
        throw new Error('API request failed');
      }

      const data = await res.json();
      setResponse(data.reply);
      setSource('ai');
    } catch {
      // Local fallback (no API key / network error)
      setResponse(buildFallback());
      setSource('offline');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 text-sm md:text-base flex items-center gap-2">
              <span>Trợ Lý Thời Trang Di Sản AI</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-medium px-2 py-0.5 rounded-full">
                {source === 'offline' ? 'Chế độ offline' : 'Gemini AI'}
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Nhận xét thẩm mỹ thời trang Gen Z & tư vấn văn hóa thời gian thực
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-1.5">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setPromptQuery(p);
              handleConsult(p);
            }}
            disabled={loading}
            className="text-[11px] bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/80 px-2.5 py-1 rounded-md transition-colors text-left"
          >
            {p}
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
          placeholder="Hỏi AI về cách phối, bối cảnh mặc hoặc mẹo chụp ảnh..."
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
        <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100/80 text-xs text-stone-800 leading-relaxed space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-indigo-900 font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Lời khuyên từ Stylist:
            </span>
            <button
              onClick={() => handleConsult()}
              className="text-stone-400 hover:text-stone-700 p-0.5"
              title="Làm mới lời khuyên"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
          <p className="whitespace-pre-line text-stone-700 font-sans">{response}</p>
        </div>
      )}
    </div>
  );
};
