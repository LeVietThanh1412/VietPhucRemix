import React, { useState } from 'react';
import { OutfitConfig } from '../types/vietphuc';
import { GARMENTS, HERITAGE_COLORS, BOTTOMS, FOOTWEAR, EVENTS } from '../data/heritageData';
import { Bot, Sparkles, Send, Loader2, RefreshCw, Wand2, ArrowRight } from 'lucide-react';
import { checkCulturalEtiquette } from '../utils/culturalRuleChecker';
import { 
  IconViet3D, 
  IconVietOrbit, 
  IconVietLighting, 
  IconVietFocus,
  IconVietVienLinh,
  IconVietGarment 
} from './VietIcons';
import { AIActionDirective } from './MannequinVisualizer3D';

interface AIStylistConsultantProps {
  config: OutfitConfig;
  onApplyConfig?: (patch: Partial<OutfitConfig>) => void;
  onTrigger3DAction?: (action: AIActionDirective) => void;
  is3DMode?: boolean;
  onToggle3DMode?: (is3D: boolean) => void;
}

interface ParsedAction {
  label: string;
  action: AIActionDirective;
  suggestedPatch?: Partial<OutfitConfig>;
}

export const AIStylistConsultant: React.FC<AIStylistConsultantProps> = ({
  config,
  onApplyConfig,
  onTrigger3DAction,
  is3DMode = false,
  onToggle3DMode
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
    { label: 'Gợi ý tạo dáng 3D tôn vinh tà áo (45°)', prompt: 'Gợi ý cách tạo dáng 3D chụp ảnh tôn vinh tà áo' },
    { label: 'Xoay 3D kiểm tra sống lưng di sản (180°)', prompt: 'Xoay 3D kiểm tra chi tiết nẹp sống lưng và tà sau' },
    { label: 'Kính lúp: Soi cổ áo & 5 khuy Ngũ Thường', prompt: 'Soi chi tiết cổ áo và nẹp 5 khuy cúc hữu nhậm chuẩn Việt' },
    { label: 'Phối phong cách Vương Triều Lý - Trần (3D)', prompt: 'Gợi ý bản phối Vương triều Lý - Trần với Áo Viên Lĩnh' }
  ];

  // Helper to build tailored fallback responses with direct 3D actions
  const buildFallback = (query: string): { reply: string; actions: ParsedAction[] } => {
    const issues = checkCulturalEtiquette(config).filter(a => a.level === 'critical' || a.level === 'warning');
    const actions: ParsedAction[] = [];

    // Case 0: Inspect Collar & Buttons
    if (query.toLowerCase().includes('cổ áo') || query.toLowerCase().includes('khuy') || query.toLowerCase().includes('hữu nhậm')) {
      actions.push({
        label: 'Kính Lúp: Soi Cổ Áo & 5 Khuy Ngũ Thường',
        action: { type: 'focus', value: 'collar', message: 'Kính Lúp Di Sản đang phóng to vào cổ áo và hàng 5 khuy cúc cài nách hữu nhậm.' }
      });
      actions.push({
        label: 'Xoay góc chính diện 0°',
        action: { type: 'rotate', value: 0, message: 'Quan sát chính diện cấu trúc nẹp áo chuẩn Việt.' }
      });

      return {
        reply: `Cấu trúc cổ áo và hàng khuy là "chứng minh thư văn hóa" của Cổ Phục Việt! Khác với Hán phục vạt chéo bè rộng hay Kimono thẳng đứng, trang phục Việt (như Áo Ngũ Thân, Áo Tấc) định hình cổ đứng Lập Lĩnh với nẹp áo lượn cánh cung sang nách phải, cài đúng 5 cúc khuy tượng trưng cho Ngũ Thường: Nhân, Nghĩa, Lễ, Trí, Tín.\n\nBấm nút bên dưới để bật Kính Lúp Di Sản phóng to cận cảnh chi tiết may đo này!`,
        actions
      };
    }

    // Case 1: Check back seam / sống lưng
    if (query.toLowerCase().includes('sống lưng') || query.toLowerCase().includes('xoay 3d') || query.toLowerCase().includes('mặt sau')) {
      actions.push({
        label: 'Xoay 3D ra sau lưng (180°)',
        action: { type: 'rotate', value: 180, message: 'Đang xoay 180° ra sau lưng để bạn quan sát sống lưng áo di sản.' }
      });
      actions.push({
        label: 'Tiêu điểm nẹp sống lưng',
        action: { type: 'focus', value: 'back', message: 'Tiêu điểm vào sống lưng áo - biểu tượng sự chính trực và tay nghề may ghép truyền thống.' }
      });

      if (garment.id === 'ao-tu-than') {
        return {
          reply: `Đường sống lưng của Áo Tứ Thân là một trong những nét độc đáo nhất của trang phục Kinh Bắc! Hai thân sau được may ghép liền với nhau tượng trưng cho sự gắn kết vợ chồng bền chặt. Khi nhìn từ phía sau ở góc 180°, bạn sẽ thấy dải ruột tượng xanh và dải lụa đào vắt ngang hông buông rủ tha thướt.\n\nMẹo chụp ảnh 3D: Hãy xoay người mẫu ra sau góc 180°, hơi nghiêng đầu 15 độ để khoe trâm cài tóc hoặc dải khăn vấn!`,
          actions
        };
      } else if (garment.id === 'ao-vien-linh') {
        return {
          reply: `Mặt sau Áo Viên Lĩnh thời Lý - Trần toát lên uy nghi vương triều! Thân sau trường bào buông dài phẳng phiu, đai ngọc ôm trọn vòng thắt lưng sau với các phiến ngọc trắng đính đều đặn, đường sống lưng áo ngay thẳng tượng trưng cho phong thái đĩnh đạc của bậc quân tử.\n\nMẹo chụp ảnh 3D: Xoay góc 180° và bật ánh sáng Hoàng Hôn để làm nổi bật ánh ngọc trên bản đai lưng!`,
          actions
        };
      } else {
        return {
          reply: `Đường sống lưng ở mặt sau của ${garment.name} là chi tiết may đo quan trọng, thể hiện sự chính trực của người mặc theo quan niệm cổ truyền Đại Việt. Bạn có thể bấm nút bên dưới để mô hình 3D tự động xoay 180° soi rõ chi tiết này!`,
          actions
        };
      }
    }

    // Case 2: Posing in 3D (Tạo dáng 3D)
    if (query.toLowerCase().includes('tạo dáng') || query.toLowerCase().includes('45')) {
      actions.push({
        label: 'Tạo dáng Cung Đình (Nghiêng 45°)',
        action: { type: 'pose', value: 'cung-dinh', message: 'Tạo dáng 45° đón ánh hoàng hôn Cố Đô, tôn vinh độ thụng của ống tay áo!' }
      });
      actions.push({
        label: 'Ánh sáng Hoàng Hôn Cố Đô',
        action: { type: 'lighting', value: 'sunset', message: 'Kích hoạt ánh hoàng hôn rực rỡ chiếu rọi tà áo.' }
      });

      return {
        reply: `Để có bức ảnh lookbook Việt Phục 3D đậm chất điện ảnh, góc nghiêng 45 độ là "tỉ lệ vàng"! Ở góc này, ống tay thụng sẽ mở rộng tự nhiên đón gió, để lộ lớp lót lụa trắng thanh nhã bên trong, đồng thời tôn vinh trọn vẹn hoa văn chạm khắc trên ngực áo.\n\nBấm nút hành động bên dưới để mình tự động xoay mô hình 3D sang góc nghiêng 45° và bật hiệu ứng ánh sáng hoàng hôn cho bạn ngay!`,
        actions
      };
    }

    // Case 3: Recommend Imperial Ly-Tran
    if (query.toLowerCase().includes('lý - trần') || query.toLowerCase().includes('viên lĩnh') || query.toLowerCase().includes('vương triều')) {
      actions.push({
        label: 'Áp dụng Outfit Vương Triều Lý - Trần (3D)',
        action: { type: 'apply', value: 'ly-tran', message: 'Đã phối Áo Viên Lĩnh + Rồng Thời Trần + Đai Ngọc lên mô hình 3D!' },
        suggestedPatch: {
          garmentId: 'ao-vien-linh',
          patternId: 'rong-thoi-tran',
          colorId: 'hoang-yen',
          backdrop: 'hoang-thanh'
        }
      });
      actions.push({
        label: 'Xoay góc chính diện 0°',
        action: { type: 'rotate', value: 0, message: 'Góc nhìn chính diện tôn nghiêm triều đại Lý - Trần.' }
      });

      return {
        reply: `Vương triều Lý - Trần là thời kỳ đỉnh cao của tinh thần tự chủ Đại Việt với hào khí Đông A! Bản phối vương triều lý tưởng nhất gồm Áo Viên Lĩnh cổ tròn mang sắc vàng Hoàng Yến, phủ đồ án hoa văn Rồng Thời Trần dũng mãnh, thắt đai ngọc đính hoa sen và bối cảnh Cố Đô uy nghiêm.\n\nBạn có thể bấm nút bên dưới để áp dụng trọn vẹn bản phối này trực tiếp lên mô hình 3D!`,
        actions
      };
    }

    // Default Fallback
    const prefix = issues.length
      ? `⚠️ Trước tiên, lưu ý lễ nghi: ${issues.map(a => `${a.title}. ${a.guidance}`).join(' ')}\n\n`
      : '';

    actions.push({
      label: 'Xoay góc nghiêng 45°',
      action: { type: 'rotate', value: 45, message: 'Góc nhìn 45° tôn vinh chiều sâu tà áo.' }
    });
    actions.push({
      label: 'Bật ánh sáng Hoàng Hôn',
      action: { type: 'lighting', value: 'sunset', message: 'Ánh hoàng hôn vàng ấm rực rỡ.' }
    });

    return {
      reply: prefix + `Bản phối ${garment.name} với tông màu ${color.name} và ${bottom.name} thể hiện gu thẩm mỹ di sản rất có chiều sâu. Bạn có thể tương tác xoay 360 độ trên mô hình 3D để chiêm ngưỡng phom dáng tà áo từ mọi góc độ!`,
      actions
    };
  };

  const handleConsult = async (queryText?: string) => {
    const query = queryText || promptQuery || 'Thẩm định outfit hiện tại';
    setLoading(true);
    setDetectedActions([]);

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
      let replyText = data.reply || '';

      // Parse any action tags from Gemini response
      const actions: ParsedAction[] = [];
      if (replyText.includes('[ACTION:rotate:180]')) {
        actions.push({
          label: 'Xoay 3D ra sau lưng (180°)',
          action: { type: 'rotate', value: 180, message: 'Xoay ra sau lưng để soi sống lưng áo di sản.' }
        });
        replyText = replyText.replace(/\[ACTION:rotate:180\]/g, '');
      }
      if (replyText.includes('[ACTION:pose:45]')) {
        actions.push({
          label: 'Tạo dáng 3D góc nghiêng 45°',
          action: { type: 'pose', value: 'cung-dinh', message: 'Góc nghiêng 45° tôn vinh tà áo.' }
        });
        replyText = replyText.replace(/\[ACTION:pose:45\]/g, '');
      }
      if (replyText.includes('[ACTION:lighting:sunset]')) {
        actions.push({
          label: 'Đổi ánh sáng Hoàng Hôn',
          action: { type: 'lighting', value: 'sunset', message: 'Kích hoạt ánh hoàng hôn Cố Đô.' }
        });
        replyText = replyText.replace(/\[ACTION:lighting:sunset\]/g, '');
      }
      if (replyText.includes('[ACTION:focus:collar]')) {
        actions.push({
          label: 'Soi chi tiết cổ áo & hoa văn',
          action: { type: 'focus', value: 'collar', message: 'Tiêu điểm vào chi tiết cổ áo.' }
        });
        replyText = replyText.replace(/\[ACTION:focus:collar\]/g, '');
      }

      // If no tag was returned, generate default 3D interaction actions
      if (actions.length === 0) {
        actions.push({
          label: 'Xoay góc 45° tôn dáng tà áo',
          action: { type: 'rotate', value: 45, message: 'Góc nghiêng 45° tôn vinh độ rủ của tà áo.' }
        });
        actions.push({
          label: 'Xoay 180° soi nẹp sống lưng',
          action: { type: 'rotate', value: 180, message: 'Xoay ra mặt sau để soi sống lưng áo.' }
        });
      }

      setResponse(replyText.trim());
      setDetectedActions(actions);
      setSource('ai');
    } catch {
      // Local fallback with direct 3D interactive actions
      const fb = buildFallback(query);
      setResponse(fb.reply);
      setDetectedActions(fb.actions);
      setSource('offline');
    } finally {
      setLoading(false);
    }
  };

  const executeAction = (actionItem: ParsedAction) => {
    // 1. Ensure 3D mode is active so user sees the result
    if (!is3DMode) {
      onToggle3DMode?.(true);
    }

    // 2. If action has outfit patch, apply it
    if (actionItem.suggestedPatch) {
      onApplyConfig?.(actionItem.suggestedPatch);
    }

    // 3. Trigger 3D action directive on mannequin
    onTrigger3DAction?.(actionItem.action);

    // 4. Smooth scroll up to mannequin stage if below viewport
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
              Tương tác trực tiếp & điều khiển mô hình 3D theo thời gian thực
            </p>
          </div>
        </div>

        {/* 3D Mode Toggle Button */}
        {onToggle3DMode && (
          <button
            onClick={() => onToggle3DMode(!is3DMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              is3DMode
                ? 'bg-amber-800 text-white border-amber-900 shadow-2xs ring-1 ring-amber-700'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <IconViet3D size={15} className={is3DMode ? 'text-amber-300' : 'text-stone-600'} />
            <span>{is3DMode ? 'Chế Độ 3D Đang Bật' : 'Bật Chế Độ 3D'}</span>
          </button>
        )}
      </div>

      {/* Quick Prompts with 3D Actions */}
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
          placeholder="Hỏi AI về cách phối, xoay 3D kiểm tra sống lưng hoặc mẹo tạo dáng..."
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

      {/* AI Response Display with Actionable 3D Buttons */}
      {response && (
        <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100/80 text-xs text-stone-800 leading-relaxed space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between text-indigo-900 font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Lời khuyên từ Stylist AI:
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

          {/* Actionable 3D Directives Strip */}
          {detectedActions.length > 0 && (
            <div className="pt-2 border-t border-indigo-100/90 space-y-1.5">
              <span className="text-[11px] font-semibold text-indigo-900 flex items-center gap-1">
                <IconViet3D size={13} className="text-indigo-700" />
                <span>Hành động tương tác trực tiếp lên mô hình 3D:</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {detectedActions.map((act, actIdx) => (
                  <button
                    key={actIdx}
                    onClick={() => executeAction(act)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-indigo-950 font-semibold text-xs shadow-2xs hover:bg-indigo-50 hover:border-indigo-300 transition-all active:scale-95"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{act.label}</span>
                    <ArrowRight className="w-3 h-3 text-indigo-400" />
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
