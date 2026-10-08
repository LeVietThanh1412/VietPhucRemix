import React, { useEffect, useRef, useState } from 'react';
import { OutfitConfig } from '../types/vietphuc';
import { Bot, Sparkles, Send, Loader2, RefreshCw, Wand2, ArrowRight } from 'lucide-react';
import { offlineStylist, StylistAction } from '../utils/offlineStylist';

interface AIStylistConsultantProps {
  config: OutfitConfig;
  onApplyConfig?: (patch: Partial<OutfitConfig>) => void;
}

export const AIStylistConsultant: React.FC<AIStylistConsultantProps> = ({
  config,
  onApplyConfig
}) => {
  const [promptQuery, setPromptQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [detectedActions, setDetectedActions] = useState<StylistAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<'ai' | 'offline' | null>(null);

  const requestRef = useRef<AbortController | null>(null);
  useEffect(() => {
    requestRef.current?.abort();
    requestRef.current = null;
    setLoading(false);
    setResponse(null);
    setDetectedActions([]);
    setSource(null);
    return () => requestRef.current?.abort();
  }, [config]);

  const quickPrompts = [
    { label: 'Phối Lễ Phục Áo Tấc & Khăn Đóng', prompt: 'Gợi ý phối Áo Tấc cho dịp trang trọng đúng chuẩn cổ truyền' },
    { label: 'Phối Áo Viên Lĩnh Vương Triều Lý - Trần', prompt: 'Gợi ý bản phối Áo Viên Lĩnh thời Lý Trần với hoa văn Cúc Dây' },
    { label: 'Phối Áo Nhật Bình Cung Đình Huế', prompt: 'Gợi ý phối Áo Nhật Bình với hoa văn Bát Bửu và màu hoàng tộc' },
    { label: 'Phối Áo Giao Lĩnh Sĩ Tử Thanh Lịch', prompt: 'Gợi ý cách phối Áo Giao Lĩnh thư sinh tao nhã' }
  ];

  const handleConsult = async (queryText?: string) => {
    const query = (queryText || promptQuery).trim().slice(0, 500);
    if (!query || requestRef.current) return;
    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 25_000);
    setLoading(true);
    setResponse(null);
    setDetectedActions([]);
    setSource(null);
    const fallback = offlineStylist(config, query);
    try {
      const res = await fetch('/api/ai-stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, config }),
        signal: controller.signal
      });
      if (!res.ok) throw new Error('API unavailable');
      const data = await res.json();
      if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('Empty response');
      if (requestRef.current !== controller) return;
      setResponse(data.reply.trim());
      setDetectedActions(fallback.actions);
      setSource('ai');
    } catch {
      if (requestRef.current !== controller) return;
      setResponse(fallback.reply);
      setDetectedActions(fallback.actions);
      setSource('offline');
    } finally {
      window.clearTimeout(timeout);
      if (requestRef.current === controller) {
        requestRef.current = null;
        setLoading(false);
      }
    }
  };

  const executeAction = (actionItem: StylistAction) => {
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
                {source === 'ai' ? 'Gemini AI' : source === 'offline' ? 'Chế độ tri thức di sản' : 'Tư vấn di sản'}
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
          maxLength={500}
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
              disabled={loading}
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
