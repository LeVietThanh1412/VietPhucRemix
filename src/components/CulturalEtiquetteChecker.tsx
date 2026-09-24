import React, { useState } from 'react';
import { OutfitConfig } from '../types/vietphuc';
import { GARMENTS, HERITAGE_COLORS } from '../data/heritageData';
import { checkCulturalEtiquette } from '../utils/culturalRuleChecker';
import { ShieldCheck, AlertTriangle, Sparkles, BookOpen, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface CulturalEtiquetteCheckerProps {
  config: OutfitConfig;
}

export const CulturalEtiquetteChecker: React.FC<CulturalEtiquetteCheckerProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'history' | 'symbolism'>('rules');
  const [isExpanded, setIsExpanded] = useState(true);

  const garment = GARMENTS.find(g => g.id === config.garmentId) || GARMENTS[0];
  const color = HERITAGE_COLORS.find(c => c.id === config.colorId) || HERITAGE_COLORS[0];
  const alerts = checkCulturalEtiquette(config);

  const hasWarning = alerts.some(a => a.level === 'warning');

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden transition-all duration-200">
      {/* Header bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-4 border-b border-stone-100 flex items-center justify-between cursor-pointer hover:bg-stone-50/70 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${hasWarning ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
            {hasWarning ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-stone-900 text-sm md:text-base">
                Thẩm Định Chuẩn Mực Văn Hóa
              </h3>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                hasWarning 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {hasWarning ? 'Cần lưu ý bối cảnh' : 'Chuẩn mực di sản'}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Đảm bảo bản sắc truyền thống khi phối cùng phong cách hiện đại
            </p>
          </div>
        </div>

        <button className="text-stone-400 hover:text-stone-700 p-1">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-5">
          {/* Segmented control tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg mb-4 text-xs font-medium">
            <button
              onClick={() => setActiveTab('rules')}
              className={`flex-1 py-1.5 px-3 rounded-md transition-all ${
                activeTab === 'rules'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Cảnh báo & Đánh giá
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-1.5 px-3 rounded-md transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Nguồn gốc {garment.name.split(' (')[0]}
            </button>
            <button
              onClick={() => setActiveTab('symbolism')}
              className={`flex-1 py-1.5 px-3 rounded-md transition-all ${
                activeTab === 'symbolism'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Ý nghĩa chi tiết
            </button>
          </div>

          {/* TAB 1: Rules & Alerts */}
          {activeTab === 'rules' && (
            <div className="space-y-3">
              {alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
                    alert.level === 'warning'
                      ? 'bg-amber-50/70 border-amber-200/80 text-amber-950'
                      : alert.level === 'kudos'
                      ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
                      : 'bg-stone-50 border-stone-200/80 text-stone-800'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {alert.level === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                    {alert.level === 'kudos' && <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                    {alert.level === 'info' && <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />}
                    <div className="space-y-1">
                      <p className="font-semibold text-stone-900">{alert.title}</p>
                      <p className="text-stone-700">{alert.message}</p>
                      <p className="text-stone-500 italic mt-1 font-sans">
                        💡 Lời khuyên: {alert.guidance}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* General etiquette reminders for the selected garment */}
              <div className="pt-2 border-t border-stone-100">
                <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Quy tắc cốt lõi của {garment.name}
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-600">
                  {garment.etiquetteNotes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-amber-800 shrink-0">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: History & Origin */}
          {activeTab === 'history' && (
            <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                <div className="text-[11px] text-stone-500 font-medium uppercase tracking-wider mb-1">
                  Niên đại & Thời kỳ
                </div>
                <div className="text-stone-900 font-serif text-base font-semibold">
                  {garment.dynasty}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-stone-900 mb-1">Giá trị văn hóa:</h4>
                <p className="text-stone-600">{garment.culturalSignificance}</p>
              </div>

              <div>
                <h4 className="font-semibold text-stone-900 mb-1">Hoàn cảnh sử dụng cổ truyền:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {garment.traditionalOccasions.map((occ, i) => (
                    <span key={i} className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px]">
                      {occ}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-2.5 bg-amber-50/60 rounded-md border border-amber-100/80 text-amber-900">
                <span className="font-semibold">Vibe Gen Z: </span>
                <span>{garment.modernVibe}</span>
              </div>
            </div>
          )}

          {/* TAB 3: Symbolism of details */}
          {activeTab === 'symbolism' && (
            <div className="space-y-3 text-xs text-stone-700">
              <div>
                <h4 className="font-semibold text-stone-900 mb-1.5">Đặc trưng cấu trúc thân áo:</h4>
                <div className="space-y-1.5">
                  {garment.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-stone-600 bg-stone-50 p-2 rounded border border-stone-100">
                      <span className="font-mono text-stone-400 font-bold shrink-0">0{i+1}.</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 border border-stone-100">
                <h4 className="font-semibold text-stone-900 mb-1">
                  Biểu tượng màu {color.name}:
                </h4>
                <p className="text-stone-600">{color.meaning}</p>
                <p className="text-stone-500 italic mt-1">{color.culturalBackground}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
