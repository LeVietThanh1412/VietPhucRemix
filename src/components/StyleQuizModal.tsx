import React from 'react';
import { EventId, ModelGender, OutfitConfig } from '../types/vietphuc';
import { EVENTS, GARMENTS, HERITAGE_COLORS } from '../data/heritageData';
import { QuizAnswers, QuizResult, REGIONS, RegionId, STYLES, StyleId, itemName, recommendLooks } from '../utils/quizEngine';
import { MannequinVisualizer } from './MannequinVisualizer';
import { AuthenticityBadge } from './AuthenticityBadge';
import { X, ArrowLeft, Wand2, Check, ShieldCheck, Palette, RotateCcw } from 'lucide-react';

import { 
  IconVietOccasionTet,
  IconVietOccasionHocDuong,
  IconVietOccasionTamLinh,
  IconVietOccasionDaoPho,
  IconVietOccasionCungDinh,
  IconVietOccasionQuanHo,
  IconVietGarment,
  IconVietBackdrop,
  IconVietAllOccasions,
  IconVietGenderMale,
  IconVietGenderFemale,
  IconVietGenderUnisex,
  VietIconProps
} from './VietIcons';

interface StyleQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (config: OutfitConfig) => void;
}

type Step = 0 | 1 | 2 | 3;

const EVENT_ICONS: Record<EventId, React.FC<VietIconProps>> = {
  'tet-du-xuan': IconVietOccasionTet,
  'ky-yeu-hoc-duong': IconVietOccasionHocDuong,
  'le-chua-tam-linh': IconVietOccasionTamLinh,
  'ca-phe-dao-pho': IconVietOccasionDaoPho,
  'dam-cuoi-ban-than': IconVietOccasionCungDinh,
  'bieu-dien-van-nghe': IconVietOccasionQuanHo
};

const REGION_ICONS: Record<RegionId, React.FC<VietIconProps>> = {
  'bac': IconVietOccasionQuanHo,
  'trung': IconVietBackdrop,
  'nam': IconVietOccasionDaoPho,
  'any': IconVietAllOccasions
};

const STYLE_ICONS: Record<StyleId, React.FC<VietIconProps>> = {
  'chuan-muc': IconVietGarment,
  'remix': IconVietOccasionDaoPho,
  'hoc-thuat': IconVietOccasionHocDuong,
  'vuong-gia': IconVietOccasionCungDinh
};

const GENDERS: { id: ModelGender; label: string }[] = [
  { id: 'female', label: 'Nữ' },
  { id: 'male', label: 'Nam' },
  { id: 'unisex', label: 'Không phân biệt' }
];

export const StyleQuizModal: React.FC<StyleQuizModalProps> = ({ isOpen, onClose, onApply }) => {
  const [step, setStep] = React.useState<Step>(0);
  const [event, setEvent] = React.useState<EventId | null>(null);
  const [region, setRegion] = React.useState<RegionId | null>(null);
  const [gender, setGender] = React.useState<ModelGender>('unisex');
  const [results, setResults] = React.useState<QuizResult[]>([]);

  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const reset = () => {
    setStep(0);
    setEvent(null);
    setRegion(null);
    setResults([]);
  };

  const finish = (style: StyleId) => {
    if (!event || !region) return;
    const answers: QuizAnswers = { event, region, style, gender };
    setResults(recommendLooks(answers, 3));
    setStep(3);
  };

  const optionCls = (active: boolean) =>
    `p-3.5 rounded-xl border text-left transition-all ${
      active ? 'border-amber-800 bg-amber-50/60 ring-1 ring-amber-800' : 'border-stone-200 hover:border-stone-400 bg-white'
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Quiz tìm phong cách Việt phục"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#FAF7F2] rounded-2xl border border-stone-300 max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-white/70 sticky top-0 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            {step > 0 && step < 3 && (
              <button onClick={() => setStep((step - 1) as Step)} className="p-1 rounded hover:bg-stone-200 text-stone-600" aria-label="Quay lại">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <Wand2 className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif text-lg md:text-xl font-bold text-stone-900">
              {step < 3 ? 'Tìm Việt phục hợp với bạn' : 'Gợi ý dành cho bạn'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {step < 3 && (
              <div className="flex items-center gap-1" aria-label={`Bước ${step + 1}/3`}>
                {[0, 1, 2].map(i => (
                  <span key={i} className={`h-1.5 rounded-full transition-all ${i <= step ? 'w-6 bg-amber-800' : 'w-3 bg-stone-300'}`} />
                ))}
              </div>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500" aria-label="Đóng">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* STEP 1: Event */}
          {step === 0 && (
            <>
              <div>
                <p className="text-xs uppercase tracking-widest text-amber-800 font-semibold">Câu 1/3</p>
                <h3 className="font-serif text-xl font-bold text-stone-900">Bạn định mặc Việt phục đi đâu?</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {EVENTS.map(e => {
                  const EventIcon = EVENT_ICONS[e.id];
                  return (
                    <button
                      key={e.id}
                      onClick={() => {
                        setEvent(e.id);
                        setStep(1);
                      }}
                      className={optionCls(event === e.id)}
                    >
                      <div className="p-2 rounded-lg bg-amber-50/80 w-fit mb-1 border border-amber-200/60 shadow-2xs">
                        {EventIcon && <EventIcon size={26} />}
                      </div>
                      <div className="font-semibold text-stone-900 text-sm mt-1">{e.name}</div>
                      <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">{e.desc}</p>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* STEP 2: Region + gender */}
          {step === 1 && (
            <>
              <div>
                <p className="text-xs uppercase tracking-widest text-amber-800 font-semibold">Câu 2/3</p>
                <h3 className="font-serif text-xl font-bold text-stone-900">Bạn thích nét văn hóa vùng nào?</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {REGIONS.map(r => {
                  const RegionIcon = REGION_ICONS[r.id];
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        setRegion(r.id);
                        setStep(2);
                      }}
                      className={optionCls(region === r.id)}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-200/50 shadow-2xs">
                          {RegionIcon && <RegionIcon size={22} />}
                        </div>
                        <span className="font-semibold text-stone-900 text-sm">{r.label}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">{r.desc}</p>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 flex-wrap text-xs pt-2 border-t border-stone-200">
                <span className="font-semibold text-stone-700">Dáng người mẫu:</span>
                {GENDERS.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setGender(g.id)}
                    className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all ${
                      gender === g.id ? 'bg-stone-900 text-white border-stone-900 shadow-2xs' : 'border-stone-300 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {g.id === 'female' && <IconVietGenderFemale size={14} />}
                    {g.id === 'male' && <IconVietGenderMale size={14} />}
                    {g.id === 'unisex' && <IconVietGenderUnisex size={14} />}
                    <span>{g.label}</span>
                  </button>
                ))}
                <span className="text-[11px] text-stone-400">Dùng để gợi ý trang phục và phụ kiện theo truyền thống nam/nữ.</span>
              </div>
            </>
          )}

          {/* STEP 3: Style */}
          {step === 2 && (
            <>
              <div>
                <p className="text-xs uppercase tracking-widest text-amber-800 font-semibold">Câu 3/3</p>
                <h3 className="font-serif text-xl font-bold text-stone-900">Phong cách của bạn là gì?</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STYLES.map(s => {
                  const StyleIcon = STYLE_ICONS[s.id];
                  return (
                    <button key={s.id} onClick={() => finish(s.id)} className={optionCls(false)}>
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-200/50 shadow-2xs">
                          {StyleIcon && <StyleIcon size={22} />}
                        </div>
                        <span className="font-semibold text-stone-900 text-sm">{s.label}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">{s.desc}</p>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* RESULTS */}
          {step === 3 && (
            <>
              {results.length === 0 ? (
                <p className="text-sm text-stone-600">Chưa tìm được cách phối phù hợp. Hãy thử đổi câu trả lời.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {results.map((r, i) => {
                    const g = GARMENTS.find(x => x.id === r.config.garmentId)!;
                    const c = HERITAGE_COLORS.find(x => x.id === r.config.colorId)!;
                    return (
                      <div
                        key={r.config.garmentId}
                        className={`bg-white rounded-xl border overflow-hidden flex flex-col ${
                          i === 0 ? 'border-amber-800 ring-1 ring-amber-800' : 'border-stone-200'
                        }`}
                      >
                        <div className="relative">
                          <MannequinVisualizer config={r.config} className="w-full" />
                          {i === 0 && (
                            <span className="absolute top-2 left-2 text-[10px] font-bold uppercase bg-amber-800 text-white px-2 py-0.5 rounded-full">
                              Phù hợp nhất
                            </span>
                          )}
                        </div>
                        <div className="p-3.5 space-y-2 flex-1 flex flex-col text-xs">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-serif font-bold text-stone-900 text-sm">{g.name}</h4>
                            <AuthenticityBadge level={g.authenticity} />
                          </div>
                          <div className="flex items-center gap-1.5 text-stone-600">
                            <span className="w-3.5 h-3.5 rounded border border-stone-300" style={{ backgroundColor: c.hex }} />
                            <span>{c.name.split(' (')[0]}</span>
                          </div>
                          <p className="text-[11px] text-stone-500">
                            {itemName('bottom', r.config.bottomId)} · {itemName('headwear', r.config.headwearId)} · {itemName('footwear', r.config.footwearId)}
                          </p>
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded">
                              <ShieldCheck className="w-3 h-3" /> Văn hóa {r.culturalScore}
                            </span>
                            <span className="flex items-center gap-1 bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded">
                              <Palette className="w-3 h-3" /> Màu {r.harmonyScore}
                            </span>
                          </div>
                          <ul className="space-y-1 text-[11px] text-stone-600 flex-1">
                            {r.reasons.map((reason, k) => (
                              <li key={k} className="flex items-start gap-1">
                                <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={() => {
                              onApply(r.config);
                              onClose();
                            }}
                            className="w-full py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold transition-colors"
                          >
                            Mặc thử look này
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-stone-200">
                <p className="text-[11px] text-stone-500">
                  Hệ thống duyệt hàng chục nghìn cách phối, loại bỏ mọi phương án có lỗi văn hóa nghiêm trọng, rồi xếp hạng theo độ hợp sự kiện, vùng miền, phong cách và độ hài hòa màu.
                </p>
                <button onClick={reset} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100">
                  <RotateCcw className="w-3.5 h-3.5" /> Làm lại quiz
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
