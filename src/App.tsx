import { useDialogFocus } from './hooks/useDialogFocus';
import { HexColorInput } from './components/HexColorInput';
import React, { useEffect, useState } from 'react';
import { DEFAULT_LOOK, loadInitialLook, saveLook } from './utils/lookStorage';
import { OutfitConfig, GarmentId, ColorId, PatternId, BottomId, HeadwearId, FootwearId, AccessoryId, EventId, ModelGender } from './types/vietphuc';
import { 
  GARMENTS, 
  HERITAGE_COLORS, 
  PATTERNS, 
  BOTTOMS, 
  HEADWEAR, 
  FOOTWEAR, 
  ACCESSORIES, 
  PRESET_LOOKBOOKS,
  EVENTS
} from './data/heritageData';
import { MannequinVisualizer } from './components/MannequinVisualizer';
import { CulturalEtiquetteChecker } from './components/CulturalEtiquetteChecker';
import { ColorHarmonyEngine } from './components/ColorHarmonyEngine';
import { WeatherEventRecommender } from './components/WeatherEventRecommender';
import { AIStylistConsultant } from './components/AIStylistConsultant';
import { AuthenticityBadge } from './components/AuthenticityBadge';
import { SavedLooksPanel } from './components/SavedLooksPanel';
import { useSavedLooks } from './hooks/useSavedLooks';
import { OccasionFilterBar, OccasionTag } from './components/OccasionFilterBar';
import { 
  IconVietGenderMale, 
  IconVietGenderFemale, 
  IconVietGenderUnisex,
  IconVietVienLinh,
  IconVietGarment,
  IconPatternPlainSilk,
  IconPatternHoaSen,
  IconPatternVanMay,
  IconPatternCucDayLy,
  IconPatternRongTran,
  IconPatternHacMayLe,
  IconPatternBatBuu,
  IconPatternChuTho,
  IconPatternChuDau
} from './components/VietIcons';

// UI/UX Pro Max React Performance Rule #7: Lazy load heavy modals with Canvas/HTML-to-image to optimize initial bundle
const LookbookCardModal = React.lazy(() => import('./components/LookbookCardModal').then(m => ({ default: m.LookbookCardModal })));
const LookComparisonModal = React.lazy(() => import('./components/LookComparisonModal').then(m => ({ default: m.LookComparisonModal })));
const StyleQuizModal = React.lazy(() => import('./components/StyleQuizModal').then(m => ({ default: m.StyleQuizModal })));
const LayerInspectorModal = React.lazy(() => import('./components/LayerInspectorModal').then(m => ({ default: m.LayerInspectorModal })));
import { 
  Sparkles, 
  ArrowRightLeft, 
  Download, 
  RotateCcw, 
  Shuffle, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Shirt, 
  Palette, 
  Check, 
  Layers,
  ChevronRight,
  Wand2,
  Bookmark,
  BookmarkCheck,
  Lightbulb
} from 'lucide-react';

const FEEDBACK_URL = (import.meta.env.VITE_FEEDBACK_URL as string | undefined)?.trim() || '';

export default function App() {
  // Current outfit configuration
  const [config, setConfig] = useState<OutfitConfig>(loadInitialLook);

  // Persist look locally on every change
  useEffect(() => {
    saveLook(config);
  }, [config]);

  // Strip ?look= after loading a shared look so the URL doesn't go stale
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has('look')) {
      url.searchParams.delete('look');
      window.history.replaceState(null, '', url.toString());
    }
  }, []);

  // UI state
  const [activeTab, setActiveTab] = useState<'garment' | 'color' | 'pattern' | 'bottom' | 'headwear' | 'footwear' | 'accessories'>('garment');
  const [garmentGenderFilter, setGarmentGenderFilter] = useState<'all' | 'female' | 'male' | 'both'>('all');
  const [garmentDynastyFilter, setGarmentDynastyFilter] = useState<'all' | 'ly-tran' | 'hau-le' | 'nguyen' | 'can-hien-dai'>('all');
  const [patternDynastyFilter, setPatternDynastyFilter] = useState<'all' | 'ly-tran' | 'le-so' | 'nguyen' | 'gom-dan-gian'>('all');
  const [isZoomed, setIsZoomed] = useState(false);
  // Auto-open quiz for first-time visitors (not when arriving via a shared link)
  const [activeModal, setActiveModal] = useState<'quiz' | 'lookbook' | 'comparison' | 'layers' | null>(() => {
    try {
      const seen = localStorage.getItem('vietphuc-remix:quiz-seen');
      const shared = new URLSearchParams(window.location.search).has('look');
      return !seen && !shared ? 'quiz' : null;
    } catch {
      return null;
    }
  });

  useDialogFocus(activeModal);
  const isQuizOpen = activeModal === 'quiz';
  const isLookbookModalOpen = activeModal === 'lookbook';
  const isComparisonModalOpen = activeModal === 'comparison';
  const isLayerModalOpen = activeModal === 'layers';
  const [compareSelection, setCompareSelection] = useState<string[] | undefined>(undefined);
  const saved = useSavedLooks();
  const [saveFlash, setSaveFlash] = useState<string | null>(null);
  const [occasionTag, setOccasionTag] = useState<OccasionTag>('all');

  const isGarmentMatchingOccasion = (garmentId: GarmentId, tag: OccasionTag): boolean => {
    if (tag === 'all') return true;
    if (tag === 'tet') return ['ao-tac', 'ao-ngu-than', 'ao-dai-tan-thoi', 'ao-nhat-binh', 'ao-vien-linh'].includes(garmentId);
    if (tag === 'quan-ho') return ['ao-tu-than', 'ao-giao-linh'].includes(garmentId);
    if (tag === 'cung-dinh') return ['ao-tac', 'ao-nhat-binh', 'ao-vien-linh'].includes(garmentId);
    if (tag === 'dao-pho') return ['ao-ngu-than', 'ao-tu-than', 'ao-ba-ba', 'ao-dai-hien-dai'].includes(garmentId);
    if (tag === 'tam-linh') return ['ao-giao-linh', 'ao-tac', 'ao-ngu-than', 'ao-vien-linh'].includes(garmentId);
    if (tag === 'hoc-duong') return ['ao-ngu-than', 'ao-giao-linh', 'ao-dai-tan-thoi', 'ao-dai-hien-dai'].includes(garmentId);
    return true;
  };

  const filteredGarments = React.useMemo(() => {
    let list = GARMENTS;
    if (garmentGenderFilter === 'female') list = list.filter(g => g.targetGender === 'female' || g.targetGender === 'both');
    else if (garmentGenderFilter === 'male') list = list.filter(g => g.targetGender === 'male' || g.targetGender === 'both');
    else if (garmentGenderFilter === 'both') list = list.filter(g => g.targetGender === 'both');

    if (garmentDynastyFilter === 'ly-tran') list = list.filter(g => ['ao-vien-linh', 'ao-giao-linh'].includes(g.id));
    else if (garmentDynastyFilter === 'hau-le') list = list.filter(g => ['ao-giao-linh', 'ao-tu-than'].includes(g.id));
    else if (garmentDynastyFilter === 'nguyen') list = list.filter(g => ['ao-tac', 'ao-ngu-than', 'ao-nhat-binh'].includes(g.id));
    else if (garmentDynastyFilter === 'can-hien-dai') list = list.filter(g => ['ao-dai-tan-thoi', 'ao-dai-hien-dai', 'ao-ba-ba'].includes(g.id));

    return list;
  }, [garmentGenderFilter, garmentDynastyFilter]);

  const filteredPatterns = React.useMemo(() => {
    if (patternDynastyFilter === 'all') return PATTERNS;
    if (patternDynastyFilter === 'ly-tran') return PATTERNS.filter(p => p.id === 'cuc-day-ly' || p.id === 'rong-thoi-tran' || p.id === 'hoa-sen');
    if (patternDynastyFilter === 'le-so') return PATTERNS.filter(p => p.id === 'hac-may-le');
    if (patternDynastyFilter === 'nguyen') return PATTERNS.filter(p => p.id === 'bat-buu' || p.id === 'chu-tho' || p.id === 'van-may');
    if (patternDynastyFilter === 'gom-dan-gian') return PATTERNS.filter(p => p.id === 'chu-dau' || p.id === 'plain-silk');
    return PATTERNS;
  }, [patternDynastyFilter]);

  const getPatternIcon = (patternId: PatternId, size = 24) => {
    switch (patternId) {
      case 'cuc-day-ly':
        return <IconPatternCucDayLy size={size} />;
      case 'rong-thoi-tran':
        return <IconPatternRongTran size={size} />;
      case 'hac-may-le':
        return <IconPatternHacMayLe size={size} />;
      case 'hoa-sen':
        return <IconPatternHoaSen size={size} />;
      case 'van-may':
        return <IconPatternVanMay size={size} />;
      case 'bat-buu':
        return <IconPatternBatBuu size={size} />;
      case 'chu-tho':
        return <IconPatternChuTho size={size} />;
      case 'chu-dau':
        return <IconPatternChuDau size={size} />;
      case 'plain-silk':
      default:
        return <IconPatternPlainSilk size={size} />;
    }
  };

  const femaleGarmentCount = GARMENTS.filter(g => g.targetGender === 'female' || g.targetGender === 'both').length;
  const maleGarmentCount = GARMENTS.filter(g => g.targetGender === 'male' || g.targetGender === 'both').length;
  const bothGarmentCount = GARMENTS.filter(g => g.targetGender === 'both').length;

  const handleSaveLook = async () => {
    const r = await saved.save(config);
    setSaveFlash(r === 'saved' ? 'Đã lưu vào Tủ đồ' : r === 'duplicate' ? 'Look này đã được lưu' : r === 'error' ? 'Không lưu được look' : `Tủ đồ đầy (tối đa ${saved.max})`);
    window.setTimeout(() => setSaveFlash(null), 2000);
  };

  const openCompare = (keys?: string[]) => {
    setCompareSelection(keys);
    setActiveModal('comparison');
  };
  const closeQuiz = React.useCallback(() => {
    setActiveModal(null);
    try {
      localStorage.setItem('vietphuc-remix:quiz-seen', '1');
    } catch {
      /* ignore */
    }
  }, []);

  // Handle Escape while a lazy modal is still loading, and prevent stacked dialogs.
  useEffect(() => {
    if (!activeModal) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (activeModal === 'quiz') closeQuiz();
        else setActiveModal(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [activeModal, closeQuiz]);

  // Active section view for scroll
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Quick Randomize / Shuffle look
  const handleShuffle = () => {
    const randomGarment = GARMENTS[Math.floor(Math.random() * GARMENTS.length)];
    const randomColor = HERITAGE_COLORS[Math.floor(Math.random() * HERITAGE_COLORS.length)];
    const randomPattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
    const randomBottom = BOTTOMS[Math.floor(Math.random() * BOTTOMS.length)];
    const randomHeadwear = HEADWEAR[Math.floor(Math.random() * HEADWEAR.length)];
    const randomFootwear = FOOTWEAR[Math.floor(Math.random() * FOOTWEAR.length)];

    // 1-2 random accessories
    const shuffledAccessories = [...ACCESSORIES].sort(() => 0.5 - Math.random());
    const randomAccessories = shuffledAccessories.slice(0, Math.floor(Math.random() * 2) + 1).map(a => a.id);

    setConfig(prev => ({
      ...prev,
      garmentId: randomGarment.id,
      colorId: randomColor.id,
      customColorHex: undefined,
      patternId: randomPattern.id,
      bottomId: randomBottom.id,
      headwearId: randomHeadwear.id,
      footwearId: randomFootwear.id,
      accessories: randomAccessories
    }));
  };

  // Reset to default look
  const handleReset = () => {
    setConfig(DEFAULT_LOOK);
  };

  // Toggle accessory selection
  const handleToggleAccessory = (accId: AccessoryId) => {
    setConfig(prev => {
      const exists = prev.accessories.includes(accId);
      if (exists) {
        return { ...prev, accessories: prev.accessories.filter(id => id !== accId) };
      } else {
        if (prev.accessories.length >= 3) {
          // Limit to max 3 accessories for balance
          return { ...prev, accessories: [...prev.accessories.slice(1), accId] };
        }
        return { ...prev, accessories: [...prev.accessories, accId] };
      }
    });
  };

  const selectedGarment = GARMENTS.find(g => g.id === config.garmentId) || GARMENTS[0];
  const selectedColor = HERITAGE_COLORS.find(c => c.id === config.colorId) || HERITAGE_COLORS[0];

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 flex flex-col font-sans">
      {/* UI/UX Pro Max Accessibility Rule #45: Keyboard Skip-to-content Link */}
      <a
        href="#studio-remix"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-stone-900 focus:text-amber-300 focus:font-semibold focus:text-xs focus:rounded-xl focus:shadow-2xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
      >
        Nhảy đến phòng thử đồ (Skip to content)
      </a>

      {/* 1. TOP BAR CONTRACT: Exactly 3 zones (Brand wordmark, clean text nav links, primary actions) */}
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-stone-200/80 px-4 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Zone 1: Single text wordmark */}
          <a href="#" className="shrink-0 text-lg md:text-2xl font-serif font-bold tracking-tight text-stone-900 hover:text-amber-900 transition-colors whitespace-nowrap">
            VIỆT PHỤC REMIX
          </a>

          {/* Zone 2: nav – only on wide screens to avoid colliding with actions */}
          <nav className="hidden 2xl:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold text-stone-600 mx-6">
            <button onClick={() => scrollToSection('tu-do')} className="hover:text-stone-900 transition-colors">
              Tủ Đồ
            </button>
            <button onClick={() => scrollToSection('studio-remix')} className="hover:text-stone-900 transition-colors">
              Studio Phối Đồ
            </button>
            <button onClick={() => scrollToSection('cultural-checker')} className="hover:text-stone-900 transition-colors">
              Chuẩn Mực Di Sản
            </button>
            <button onClick={() => scrollToSection('harmony-engine')} className="hover:text-stone-900 transition-colors">
              Bảng Màu Ngũ Hành
            </button>
            <button onClick={() => scrollToSection('event-stylist')} className="hover:text-stone-900 transition-colors">
              Sự Kiện & Thời Tiết
            </button>
            <button onClick={() => scrollToSection('lookbook-gallery')} className="hover:text-stone-900 transition-colors">
              Lookbook Mẫu
            </button>
          </nav>

          {/* Zone 3: primary actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={() => setActiveModal('quiz')}
              aria-label="Quiz phong cách"
              title="Quiz phong cách"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-amber-800/40 bg-amber-50 text-xs font-semibold text-amber-900 hover:bg-amber-100 active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quiz phong cách</span>
            </button>
            <button
              onClick={() => openCompare()}
              aria-label="So sánh Look"
              title="So sánh Look"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100 active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-800" />
              <span className="hidden sm:inline">So sánh Look</span>
            </button>
            <button
              onClick={() => setActiveModal('lookbook')}
              aria-label="Xuất Lookbook"
              title="Xuất Lookbook"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-stone-900 text-xs font-semibold text-white hover:bg-stone-800 active:scale-[0.98] transition-all shadow-xs whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Xuất Lookbook</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-12">
        {/* 2. Hero Editorial Banner & Mission Statement */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-stone-900 via-stone-800 to-stone-900 text-white p-6 md:p-10 shadow-xl border border-stone-800">
          {/* Subtle Heritage Motifs in background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#FAF5E8_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Cổ Phục Việt Nam Gặp Gỡ Tinh Thần Gen Z</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-100 text-balance leading-tight">
              Phối Trang Phục Truyền Thống Đương Đại, Tôn Vinh Chiều Sâu Di Sản
            </h1>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Nền tảng giúp học sinh, sinh viên khám phá Áo Dài, Áo Ngũ Thân, Áo Tứ Thân, Áo Bà Ba, Áo Tấc, Áo Nhật Bình... và phối cùng phụ kiện hiện đại, mà vẫn giữ trọn sự tôn trọng với giá trị văn hóa.
            </p>

            {/* Quick stats & trust bar */}
            <div className="flex items-center flex-wrap gap-4 pt-2 text-xs text-stone-400">
              <span>{GARMENTS.length} Loại Trang Phục · 3 Vùng Miền</span>
              <span aria-hidden="true">·</span>
              <span>Bảng Màu Ngũ Hành Di Sản</span>
              <span aria-hidden="true">·</span>
              <span>Hệ Thống Thẩm Định Văn Hóa Thời Gian Thực</span>
            </div>

            <div className="pt-3">
              <button
                onClick={() => setActiveModal('quiz')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-stone-900 text-sm font-bold shadow-md transition-all"
              >
                <Wand2 className="w-4 h-4" />
                Trả lời 3 câu để nhận gợi ý phối đồ
              </button>
            </div>
          </div>
        </section>

        {/* 3. Interactive Remix Dressing Studio (Studio Phối Đồ) */}
        <section id="studio-remix" className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-amber-800 font-sans">
                01. DRESSING ROOM & MANNEQUIN
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-900">
                Phòng Thử Đồ Tương Tác Trực Quan
              </h2>
            </div>

            {/* Visualizer Utilities */}
            <div className="flex items-center gap-2">
              {saveFlash && (
                <span role="status" className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {saveFlash}
                </span>
              )}
              <button
                onClick={handleSaveLook}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors shadow-2xs ${
                  saved.isSaved(config)
                    ? 'border-amber-800/40 bg-amber-50 text-amber-900'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
                title="Lưu look vào Tủ đồ để so sánh"
              >
                {saved.isSaved(config) ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5 text-amber-800" />}
                <span>{saved.isSaved(config) ? 'Đã lưu' : 'Lưu look'}</span>
              </button>
              <button
                onClick={handleShuffle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 transition-colors shadow-2xs"
                title="Phối ngẫu nhiên một phong cách bất ngờ"
              >
                <Shuffle className="w-3.5 h-3.5 text-amber-800" />
                <span>Phối ngẫu nhiên</span>
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg border border-stone-200 text-stone-600 bg-white hover:bg-stone-50 transition-colors shadow-2xs"
                title="Đặt lại mặc định"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: Mannequin Visualizer & Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Mannequin Stage: High Fidelity 2D Heritage Visualizer */}
              <div className="relative group">
                <MannequinVisualizer config={config} isZoomed={isZoomed} />

                {/* Floating Canvas Controls */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/85 backdrop-blur-md p-1 rounded-lg border border-stone-200/80 shadow-xs z-30">
                  <button
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="p-1.5 rounded-md hover:bg-stone-100 text-stone-700 transition-colors"
                    title={isZoomed ? 'Thu nhỏ toàn thân' : 'Phóng to chi tiết áo'}
                  >
                    {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setActiveModal('layers')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-300 transition-colors shadow-2xs"
                    title="Cơ chế Layering (Mặt -> Áo -> Quần -> Phụ kiện) & Đổi màu Hex"
                  >
                    <Layers className="w-3.5 h-3.5 text-amber-800" />
                    <span>Lớp & Hex</span>
                  </button>
                </div>
              </div>

              {/* Avatar Model & Backdrop Switcher Strip */}
              <div className="p-3.5 bg-white rounded-xl border border-stone-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700">Dáng người mẫu:</span>
                  <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg">
                    {(['female', 'male', 'unisex'] as ModelGender[]).map(gender => (
                      <button
                        key={gender}
                        onClick={() => setConfig(prev => ({ ...prev, modelGender: gender }))}
                        className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                          config.modelGender === gender
                            ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        {gender === 'female' ? 'Nữ' : gender === 'male' ? 'Nam' : 'Unisex'}
                      </button>
                    ))}
                  </div>
                </div>

                {config.modelGender === 'male' && (
                  <p className="text-[11px] text-sky-900 bg-sky-50 px-2.5 py-1.5 rounded-lg border border-sky-200/60 leading-relaxed flex items-center gap-1.5">
                    <IconVietGenderMale size={16} />
                    <span><b>Dáng Nam:</b> Bờ vai vuông rộng, tư thế đĩnh đạc, búi tóc củ hành. Áo truyền thống chuẩn nam: Áo Tấc, Áo Ngũ Thân, Áo Giao Lĩnh, Áo Dài nam, Áo Bà Ba.</span>
                  </p>
                )}
                {config.modelGender === 'female' && (
                  <p className="text-[11px] text-rose-900 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200/60 leading-relaxed flex items-center gap-1.5">
                    <IconVietGenderFemale size={16} />
                    <span><b>Dáng Nữ:</b> Cổ kiêu thanh tú, bờ vai mềm mại, hoa tai ngọc, búi tóc cung đình đoan trang. Phù hợp trọn vẹn 7 mẫu áo truyền thống của phái nữ.</span>
                  </p>
                )}
                {config.modelGender === 'unisex' && (
                  <p className="text-[11px] text-amber-900 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200/60 leading-relaxed flex items-center gap-1.5">
                    <IconVietGenderUnisex size={16} />
                    <span><b>Dáng Unisex:</b> Tỷ lệ thanh lịch đương đại, tôn vinh trọn vẹn nét hài hòa của cổ phục Việt.</span>
                  </p>
                )}

                <div className="flex items-center justify-between text-xs border-t border-stone-100 pt-2.5">
                  <span className="font-semibold text-stone-700">Bối cảnh nền:</span>
                  <div className="flex items-center gap-1">
                    {[
                      { id: 'hoang-thanh', label: 'Cố Đô' },
                      { id: 'pho-co', label: 'Phố Cổ' },
                      { id: 'studio-zen', label: 'Tối Giản' },
                      { id: 'hieu-anh', label: 'Hiệu Ảnh' }
                    ].map(b => (
                      <button
                        key={b.id}
                        onClick={() => setConfig(prev => ({ ...prev, backdrop: b.id as any }))}
                        className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                          config.backdrop === b.id
                            ? 'bg-stone-900 text-white font-medium'
                            : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Wardrobe & Palette Customizer Tabs (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200/90 shadow-sm p-5 md:p-6 space-y-5">
              {/* Occasion & Event Filter Capsule Bar (Digital Wardrobe Workflow) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-800" />
                    <span>Lọc Theo Mùa & Dịp (Digital Wardrobe):</span>
                  </span>
                  <span className="text-[11px] text-stone-400">Gợi ý trang phục theo bối cảnh</span>
                </div>
                <OccasionFilterBar
                  selectedTag={occasionTag}
                  modelGender={config.modelGender}
                  onSelectTag={setOccasionTag}
                  onApplyPresetLook={patch => setConfig(prev => ({ ...prev, ...patch }))}
                />
              </div>

              {/* Category Segmented Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl overflow-x-auto text-xs font-medium no-scrollbar">
                {[
                  { id: 'garment', label: '1. Loại Áo' },
                  { id: 'color', label: '2. Màu Sắc' },
                  { id: 'pattern', label: '3. Hoa Văn' },
                  { id: 'bottom', label: '4. Hạ Y' },
                  { id: 'headwear', label: '5. Mũ / Khăn' },
                  { id: 'footwear', label: '6. Giày Dép' },
                  { id: 'accessories', label: '7. Phụ Kiện' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: Garment Type */}
              {activeTab === 'garment' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs flex-wrap gap-2">
                    <span className="font-semibold text-stone-700">Chọn dáng trang phục truyền thống:</span>
                    <span className="text-amber-800 font-medium">Hiện tại: {selectedGarment.name}</span>
                  </div>

                  {/* Gender Category Filter Bar */}
                  <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl overflow-x-auto text-xs no-scrollbar">
                    <span className="text-[11px] font-semibold text-stone-500 pl-2 pr-1 shrink-0">Phân loại:</span>
                    <button
                      onClick={() => setGarmentGenderFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                        garmentGenderFilter === 'all'
                          ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Tất cả ({GARMENTS.length})
                    </button>
                    <button
                      onClick={() => setGarmentGenderFilter('female')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                        garmentGenderFilter === 'female'
                          ? 'bg-rose-50 text-rose-900 border border-rose-200 shadow-2xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <IconVietGenderFemale size={14} />
                      <span>Dành cho Nữ</span>
                      <span className="text-[10px] opacity-75">({femaleGarmentCount})</span>
                    </button>
                    <button
                      onClick={() => setGarmentGenderFilter('male')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                        garmentGenderFilter === 'male'
                          ? 'bg-sky-50 text-sky-900 border border-sky-200 shadow-2xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <IconVietGenderMale size={14} />
                      <span>Dành cho Nam</span>
                      <span className="text-[10px] opacity-75">({maleGarmentCount})</span>
                    </button>
                    <button
                      onClick={() => setGarmentGenderFilter('both')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                        garmentGenderFilter === 'both'
                          ? 'bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <IconVietGenderUnisex size={14} />
                      <span>Cả Nam & Nữ</span>
                      <span className="text-[10px] opacity-75">({bothGarmentCount})</span>
                    </button>
                  </div>

                  {/* Dynasty Historical Era Filter Bar (UI/UX Pro Max Faceted Navigation) */}
                  <div className="flex items-center gap-1.5 p-1 bg-stone-100/80 rounded-xl overflow-x-auto text-xs no-scrollbar">
                    <span className="text-[11px] font-semibold text-stone-500 pl-2 pr-1 shrink-0">Triều đại:</span>
                    <button
                      onClick={() => setGarmentDynastyFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                        garmentDynastyFilter === 'all'
                          ? 'bg-amber-800 text-white shadow-2xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900 bg-white/70'
                      }`}
                    >
                      Mọi thời kỳ
                    </button>
                    <button
                      onClick={() => setGarmentDynastyFilter('ly-tran')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                        garmentDynastyFilter === 'ly-tran'
                          ? 'bg-amber-800 text-white shadow-2xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900 bg-white/70'
                      }`}
                    >
                      Lý - Trần (TK 11-14)
                    </button>
                    <button
                      onClick={() => setGarmentDynastyFilter('hau-le')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                        garmentDynastyFilter === 'hau-le'
                          ? 'bg-amber-800 text-white shadow-2xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900 bg-white/70'
                      }`}
                    >
                      Hậu Lê (TK 15-18)
                    </button>
                    <button
                      onClick={() => setGarmentDynastyFilter('nguyen')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                        garmentDynastyFilter === 'nguyen'
                          ? 'bg-amber-800 text-white shadow-2xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900 bg-white/70'
                      }`}
                    >
                      Triều Nguyễn (TK 19-20)
                    </button>
                    <button
                      onClick={() => setGarmentDynastyFilter('can-hien-dai')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                        garmentDynastyFilter === 'can-hien-dai'
                          ? 'bg-amber-800 text-white shadow-2xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900 bg-white/70'
                      }`}
                    >
                      Tân thời & Đương đại
                    </button>
                  </div>

                  {/* Contextual guidance if male mannequin currently has female-only garment selected */}
                  {config.modelGender === 'male' && selectedGarment.targetGender === 'female' && (
                    <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200/90 text-xs text-amber-900 flex items-start gap-2.5">
                      <IconVietGenderFemale size={22} className="shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Lưu ý phân định giới tính di sản:</p>
                        <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                          <b>{selectedGarment.name}</b> theo lịch sử là trang phục thiết kế dành cho nữ giới. Bạn có thể đổi sang người mẫu Nữ hoặc chọn áo truyền thống của Nam như <b>Áo Tấc</b>, <b>Áo Ngũ Thân</b>, <b>Áo Giao Lĩnh</b>, <b>Áo Dài nam</b>, <b>Áo Bà Ba</b>, <b>Áo Viên Lĩnh</b>.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredGarments.map(g => (
                      <div
                        key={g.id}
                        role="button"
                        tabIndex={0}
                        aria-pressed={config.garmentId === g.id}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setConfig(prev => ({ ...prev, garmentId: g.id })); } }}
                        onClick={() => setConfig(prev => ({ ...prev, garmentId: g.id }))}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all heritage-card-hover ${
                          config.garmentId === g.id
                            ? 'border-amber-800 bg-amber-50/50 ring-1 ring-amber-800 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-stone-50/30'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            {g.id === 'ao-vien-linh' ? (
                              <IconVietVienLinh size={22} className="text-amber-800" />
                            ) : (
                              <IconVietGarment size={22} className="text-amber-800" />
                            )}
                            <h4 className="font-serif font-bold text-stone-900 text-sm">{g.name}</h4>
                          </div>
                          {config.garmentId === g.id && (
                            <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        {/* Dynasty + Authenticity + Gender Badge + Occasion Match */}
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <p className="text-[11px] text-stone-500 font-medium">{g.dynasty}</p>
                          <AuthenticityBadge level={g.authenticity} />
                          {g.targetGender === 'female' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                              <IconVietGenderFemale size={12} />
                              <span>Nữ giới</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <IconVietGenderUnisex size={12} />
                              <span>Nam & Nữ</span>
                            </span>
                          )}
                          {occasionTag !== 'all' && isGarmentMatchingOccasion(g.id, occasionTag) && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-700" />
                              <span>Hợp dịp</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-stone-600 line-clamp-2 mt-1.5 leading-relaxed">{g.shortDesc}</p>

                        {/* Gender-specific cut/etiquette note */}
                        {g.genderNote && (
                          <p className="text-[11px] text-stone-600 bg-stone-100/70 rounded-md px-2 py-1 mt-2 border border-stone-200/60 leading-relaxed">
                            {g.genderNote}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: Heritage Color Palette */}
              {activeTab === 'color' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-stone-700">Bảng màu truyền thống Việt Nam:</span>
                    <span className="text-stone-500">Màu đã chọn: {selectedColor.name} (Hành {selectedColor.element})</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {HERITAGE_COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setConfig(prev => ({ ...prev, colorId: c.id, customColorHex: undefined }))}
                        className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                          config.colorId === c.id
                            ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <span
                          className="w-7 h-7 rounded-lg shrink-0 border border-stone-300 shadow-2xs mt-0.5"
                          style={{ backgroundColor: c.hex }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-stone-900 text-xs truncate">{c.name.split(' (')[0]}</span>
                            <span className="text-[10px] bg-stone-100 text-stone-600 px-1 rounded">
                              {c.element}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{c.meaning}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Custom Hex Color Customizer (Avatar Generator Workflow) */}
                  <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-stone-800">
                        <Palette className="w-3.5 h-3.5 text-amber-800" />
                        <span>Đổi màu tự do theo mã Hex (Avatar Generator Props):</span>
                      </div>
                      {config.customColorHex && (
                        <button
                          onClick={() => {
                            const { customColorHex, ...rest } = config;
                            setConfig(rest as OutfitConfig);
                          }}
                          className="text-[11px] text-stone-500 hover:text-stone-800 underline flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Trở về màu gốc
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={config.customColorHex || selectedColor.hex}
                        onChange={e => setConfig(prev => ({ ...prev, customColorHex: e.target.value }))}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-stone-300 p-0.5 bg-white shadow-2xs"
                        title="Chọn màu tự do"
                      />
                      <div className="relative w-36">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-xs">#</span>
                        <HexColorInput value={config.customColorHex || selectedColor.hex} onChange={hex => setConfig(prev => ({ ...prev, customColorHex: hex }))} className="w-full pl-6 pr-2.5 py-1.5 border border-stone-300 rounded-lg font-mono text-xs uppercase bg-white" />
                      </div>
                      <span className="text-[11px] text-stone-500">
                        {config.customColorHex ? 'Đang áp dụng màu Hex tùy chỉnh lên toàn bộ tà và tay áo' : 'Chọn ô màu để tùy biến mã Hex bất kỳ'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Pattern (Kho Hoa Văn Cổ & Đồ Án Điêu Khắc Đại Việt) */}
              {activeTab === 'pattern' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs flex-wrap gap-2">
                    <div>
                      <span className="font-semibold text-stone-800">Kho hoa văn & đồ án điêu khắc cổ truyền:</span>
                      <p className="text-[11px] text-stone-500 mt-0.5">Khảo cổ từ vương triều Lý, Trần, Lê sơ đến triều Nguyễn & gốm cổ</p>
                    </div>
                    <span className="text-amber-800 font-medium bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                      Hiện tại: {PATTERNS.find(p => p.id === config.patternId)?.name || 'Lụa Trơn'}
                    </span>
                  </div>

                  {/* Dynasty Historical Era Faceted Filter Bar (UI/UX Pro Max) */}
                  <div className="flex items-center gap-1.5 p-1 bg-stone-100/80 rounded-xl overflow-x-auto text-xs no-scrollbar">
                    <span className="text-[11px] font-semibold text-stone-500 pl-2 pr-1 shrink-0">Triều đại:</span>
                    <button
                      onClick={() => setPatternDynastyFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                        patternDynastyFilter === 'all'
                          ? 'bg-amber-800 text-white shadow-2xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900 bg-white/70'
                      }`}
                    >
                      Tất cả ({PATTERNS.length})
                    </button>
                    <button
                      onClick={() => setPatternDynastyFilter('ly-tran')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                        patternDynastyFilter === 'ly-tran'
                          ? 'bg-amber-800 text-white shadow-2xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900 bg-white/70'
                      }`}
                    >
                      Lý - Trần (2)
                    </button>
                    <button
                      onClick={() => setPatternDynastyFilter('le-so')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                        patternDynastyFilter === 'le-so'
                          ? 'bg-amber-800 text-white shadow-2xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900 bg-white/70'
                      }`}
                    >
                      Lê sơ (1)
                    </button>
                    <button
                      onClick={() => setPatternDynastyFilter('nguyen')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                        patternDynastyFilter === 'nguyen'
                          ? 'bg-amber-800 text-white shadow-2xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900 bg-white/70'
                      }`}
                    >
                      Triều Nguyễn (2)
                    </button>
                    <button
                      onClick={() => setPatternDynastyFilter('gom-dan-gian')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                        patternDynastyFilter === 'gom-dan-gian'
                          ? 'bg-amber-800 text-white shadow-2xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900 bg-white/70'
                      }`}
                    >
                      Gốm & Dệt Mộc (2)
                    </button>
                  </div>

                  {/* Pattern Cards Grid with Vector Previews & Heritage Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {filteredPatterns.map(p => {
                      const isSelected = config.patternId === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => setConfig(prev => ({ ...prev, patternId: p.id }))}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all heritage-card-hover ${
                            isSelected
                              ? 'border-amber-800 bg-amber-50/60 ring-1 ring-amber-800 shadow-xs'
                              : 'border-stone-200 hover:border-stone-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Cultural Vector Icon Preview Box */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 ${
                              isSelected
                                ? 'bg-amber-100/90 border-amber-300 shadow-2xs scale-105'
                                : 'bg-stone-50 border-stone-200 group-hover:bg-amber-50/50'
                            }`}>
                              {getPatternIcon(p.id, 26)}
                            </div>

                            {/* Card Content & Metadata */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="font-serif font-bold text-stone-900 text-sm truncate">{p.name}</h4>
                                {isSelected && (
                                  <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center shrink-0">
                                    <Check className="w-3 h-3" />
                                  </span>
                                )}
                              </div>

                              {/* Dynasty & Origin Badges */}
                              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                {p.dynasty && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                                    {p.dynasty}
                                  </span>
                                )}
                                <span className="text-[10px] text-stone-500 font-medium bg-stone-100 px-1.5 py-0.5 rounded">
                                  {p.culturalOrigin}
                                </span>
                              </div>

                              {/* Archaeological & Cultural Symbolism */}
                              <p className="text-xs text-stone-600 line-clamp-2 mt-1.5 leading-relaxed">
                                {p.description}
                              </p>

                              {/* Visual State Cue */}
                              {isSelected && (
                                <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-semibold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-300/80 w-fit">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-700 animate-pulse" />
                                  <span>Đang dệt / thêu lên áo</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: Lower Garment (Hạ Y) */}
              {activeTab === 'bottom' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-stone-700">Phối quần / chân váy:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BOTTOMS.map(b => (
                      <div
                        key={b.id}
                        onClick={() => setConfig(prev => ({ ...prev, bottomId: b.id }))}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all heritage-card-hover ${
                          config.bottomId === b.id
                            ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-900 text-xs">{b.name}</span>
                          <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded">
                            {b.category}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-1">{b.description}</p>
                        <p className="text-[11px] text-amber-900 mt-1 italic flex items-center gap-1">
                          <Lightbulb className="w-3 h-3 text-amber-700 shrink-0" />
                          <span>{b.genzTip}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: Headwear */}
              {activeTab === 'headwear' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-stone-700">Khăn, nón hoặc trang sức đầu:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {HEADWEAR.map(h => (
                      <div
                        key={h.id}
                        onClick={() => setConfig(prev => ({ ...prev, headwearId: h.id }))}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all heritage-card-hover ${
                          config.headwearId === h.id
                            ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-900 text-xs">{h.name}</span>
                          <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded">
                            {h.category}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-1">{h.description}</p>
                        <p className="text-[11px] text-amber-900 mt-1 italic flex items-center gap-1">
                          <Lightbulb className="w-3 h-3 text-amber-700 shrink-0" />
                          <span>{h.genzTip}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: Footwear */}
              {activeTab === 'footwear' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-stone-700">Giày dép (Truyền thống vs Streetwear Gen Z):</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {FOOTWEAR.map(f => (
                      <div
                        key={f.id}
                        onClick={() => setConfig(prev => ({ ...prev, footwearId: f.id }))}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all heritage-card-hover ${
                          config.footwearId === f.id
                            ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-900 text-xs">{f.name}</span>
                          <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded">
                            {f.category}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-1">{f.description}</p>
                        <p className="text-[11px] text-amber-900 mt-1 italic flex items-center gap-1">
                          <Lightbulb className="w-3 h-3 text-amber-700 shrink-0" />
                          <span>{f.genzTip}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: Accessories (Multi-select) */}
              {activeTab === 'accessories' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-stone-700">Phụ kiện & Trang sức điểm nhấn (Tối đa 3 món):</span>
                    <span className="text-stone-400 font-mono">{config.accessories.length} / 3 đã chọn</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ACCESSORIES.map(a => {
                      const isSelected = config.accessories.includes(a.id);
                      return (
                        <div
                          key={a.id}
                          onClick={() => handleToggleAccessory(a.id)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all heritage-card-hover ${
                            isSelected
                              ? 'border-amber-800 bg-amber-50/50 ring-1 ring-amber-800 shadow-xs'
                              : 'border-stone-200 hover:border-stone-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-stone-900 text-xs">{a.name}</span>
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center border text-[10px] ${
                              isSelected ? 'bg-amber-800 text-white border-amber-800' : 'border-stone-300'
                            }`}>
                              {isSelected && <Check className="w-3 h-3" />}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 mt-1">{a.description}</p>
                          <p className="text-[11px] text-amber-900 mt-1 italic flex items-center gap-1">
                            <Lightbulb className="w-3 h-3 text-amber-700 shrink-0" />
                            <span>{a.genzTip}</span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3b. Personal wardrobe (saved looks) */}
        <section id="tu-do" className="space-y-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-amber-800 font-sans">MY WARDROBE</span>
            <h2 className="font-serif text-2xl font-bold text-stone-900">Tủ Đồ Của Bạn</h2>
          </div>
          {saved.error && <p role="alert" className="text-sm text-red-800">{saved.error}</p>}
          <SavedLooksPanel
            looks={saved.looks}
            max={saved.max}
            currentLook={config}
            onApply={c => {
              setConfig(c);
              scrollToSection('studio-remix');
            }}
            onRemove={saved.remove}
            onRename={saved.rename}
            onCompare={keys => openCompare(keys)}
          />
        </section>

        {/* 4. Cultural Etiquette & Safe Heritage Checker */}
        <section id="cultural-checker" className="space-y-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-amber-800 font-sans">
              02. CULTURAL SAFEGUARD & ETIQUETTE
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-900">
              Kiểm Tra Chuẩn Mực & Bảo Đảm Giá Trị Văn Hóa
            </h2>
            <p className="text-stone-600 text-xs md:text-sm mt-0.5">
              Hệ thống tự động phân tích độ phù hợp với bối cảnh, cảnh báo những biến tấu làm sai lệch đặc trưng văn hóa và gợi ý cách mặc đoan trang.
            </p>
          </div>

          <CulturalEtiquetteChecker config={config} />
        </section>

        {/* 5. Color Harmony Engine & Weather Event Recommender */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Color Harmony Engine */}
          <section id="harmony-engine" className="space-y-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-amber-800 font-sans">
                03. COLOR HARMONY
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Thẩm Định Màu Sắc Ngũ Hành
              </h2>
            </div>
            <ColorHarmonyEngine config={config} />
          </section>

          {/* Right: Weather & Event Stylist */}
          <section id="event-stylist" className="space-y-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-amber-800 font-sans">
                04. EVENT & OCCASION
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Bối Cảnh Sự Kiện & Thời Tiết
              </h2>
            </div>
            <WeatherEventRecommender
              currentEvent={config.targetEvent}
              modelGender={config.modelGender}
              onSelectEvent={evtId => setConfig(prev => ({ ...prev, targetEvent: evtId }))}
              onApplyRecommendedCombo={updates => setConfig(prev => ({ ...prev, ...updates }))}
            />
          </section>
        </div>

        {/* 6. AI Stylist Consultant (Gemini API Powered) */}
        <section id="ai-stylist" className="space-y-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-indigo-700 font-sans">
              05. AI FASHION EXPERT
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Trợ Lý Stylist & Thẩm Định Trực Tiếp
            </h2>
            <p className="text-stone-600 text-xs md:text-sm mt-0.5">
              Trao đổi với AI Stylist am hiểu cổ phục để nhận lời khuyên tạo dáng, góc máy và cách remix tinh tế nhất.
            </p>
          </div>
          <AIStylistConsultant
            config={config}
            onApplyConfig={patch => setConfig(prev => ({ ...prev, ...patch }))}
          />
        </section>

        {/* 7. Curated Preset Lookbooks (Gallery) */}
        <section id="lookbook-gallery" className="space-y-6 pt-4 border-t border-stone-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-amber-800 font-sans">
                06. CURATED LOOKBOOK GALLERY
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-900">
                Bộ Sưu Tập Phối Sẵn Cảm Hứng Gen Z
              </h2>
            </div>
            <p className="text-xs text-stone-500">
              Chọn ngay 1 công thức phối đồ để áp dụng vào Studio chỉ với 1 click
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRESET_LOOKBOOKS.map(preset => (
              <div
                key={preset.id}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-heritage-card overflow-hidden flex flex-col hover:border-amber-800/60 transition-all heritage-card-hover group"
              >
                <div className="p-4 bg-stone-50/70 border-b border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      {preset.vibe}
                    </span>
                    <h3 className="font-serif font-bold text-stone-900 text-base">
                      {preset.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 flex-1 space-y-3 text-xs text-stone-600">
                  <p className="font-medium text-stone-800">{preset.subtitle}</p>
                  <p className="line-clamp-2 text-stone-600 leading-relaxed">{preset.tagline}</p>

                  <div className="p-2.5 bg-stone-50 rounded-lg text-[11px] text-stone-500 italic">
                    "{preset.curatorNotes}"
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => {
                      setConfig(preset.config);
                      scrollToSection('studio-remix');
                    }}
                    className="w-full py-2 px-3 rounded-lg border border-stone-300 hover:border-stone-900 text-stone-800 hover:bg-stone-900 hover:text-white transition-all text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <span>Áp dụng Look này</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-stone-200 bg-white py-8 px-4 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="font-serif text-sm font-semibold text-stone-800">
              Việt Phục Remix · Dự Án Văn Hóa & Phong Cách Trẻ
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5 max-w-xl">
              Phạm vi phiên bản hiện tại: trang phục truyền thống của người Kinh (Việt). Trang phục của 53 dân tộc anh em khác sẽ
              được bổ sung khi có tư liệu và sự tham vấn của cộng đồng. Nội dung mang tính giáo dục và đang chờ chuyên gia thẩm định.
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-1 text-stone-600">
            <span>Áo Dài · Ngũ Thân · Tứ Thân · Bà Ba · Áo Tấc · Nhật Bình · Giao Lĩnh</span>
            {FEEDBACK_URL ? (
              <a href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer" className="text-amber-800 hover:underline font-medium">
                Góp ý / báo sai thông tin văn hóa →
              </a>
            ) : (
              <span className="text-[11px] text-stone-400">Góp ý: đặt VITE_FEEDBACK_URL để hiện link biểu mẫu</span>
            )}
          </div>
        </div>
      </footer>

      {/* Modal Dialogs wrapped in Suspense for optimal bundle loading */}
      <React.Suspense fallback={null}>
        {isLookbookModalOpen && (
          <LookbookCardModal
            isOpen={isLookbookModalOpen}
            onClose={() => setActiveModal(null)}
            config={config}
            onSave={(c, name) => saved.save(c, name)}
            isSaved={saved.isSaved(config)}
          />
        )}

        {isQuizOpen && (
          <StyleQuizModal
            isOpen={isQuizOpen}
            onClose={closeQuiz}
            onApply={newConfig => {
              setConfig(newConfig);
              setTimeout(() => scrollToSection('studio-remix'), 50);
            }}
          />
        )}

        {isComparisonModalOpen && (
          <LookComparisonModal
            isOpen={isComparisonModalOpen}
            onClose={() => setActiveModal(null)}
            currentLook={config}
            savedLooks={saved.looks}
            initialSelection={compareSelection}
            onApplyLook={newConfig => setConfig(newConfig)}
          />
        )}

        {isLayerModalOpen && (
          <LayerInspectorModal
            isOpen={isLayerModalOpen}
            onClose={() => setActiveModal(null)}
            config={config}
            onChangeConfig={newConfig => setConfig(newConfig)}
          />
        )}
      </React.Suspense>
    </div>
  );
}
