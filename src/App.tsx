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
import { LookbookCardModal } from './components/LookbookCardModal';
import { LookComparisonModal } from './components/LookComparisonModal';
import { AuthenticityBadge } from './components/AuthenticityBadge';
import { StyleQuizModal } from './components/StyleQuizModal';
import { SavedLooksPanel } from './components/SavedLooksPanel';
import { useSavedLooks } from './hooks/useSavedLooks';
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
  BookmarkCheck
} from 'lucide-react';

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
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLookbookModalOpen, setIsLookbookModalOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [compareSelection, setCompareSelection] = useState<string[] | undefined>(undefined);
  const saved = useSavedLooks();
  const [saveFlash, setSaveFlash] = useState<string | null>(null);

  const handleSaveLook = () => {
    const r = saved.save(config);
    setSaveFlash(r === 'saved' ? 'Đã lưu vào Tủ đồ' : r === 'duplicate' ? 'Look này đã được lưu' : `Tủ đồ đầy (tối đa ${saved.max})`);
    window.setTimeout(() => setSaveFlash(null), 2000);
  };

  const openCompare = (keys?: string[]) => {
    setCompareSelection(keys);
    setIsComparisonModalOpen(true);
  };
  // Auto-open quiz for first-time visitors (not when arriving via a shared link)
  const [isQuizOpen, setIsQuizOpen] = useState(() => {
    try {
      const seen = localStorage.getItem('vietphuc-remix:quiz-seen');
      const shared = new URLSearchParams(window.location.search).has('look');
      return !seen && !shared;
    } catch {
      return false;
    }
  });

  const closeQuiz = React.useCallback(() => {
    setIsQuizOpen(false);
    try {
      localStorage.setItem('vietphuc-remix:quiz-seen', '1');
    } catch {
      /* ignore */
    }
  }, []);

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
      {/* 1. TOP BAR CONTRACT: Exactly 3 zones (Brand wordmark, clean text nav links, primary actions) */}
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-stone-200/80 px-4 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Zone 1: Single text wordmark */}
          <a href="#" className="text-xl md:text-2xl font-serif font-bold tracking-tight text-stone-900 hover:text-amber-900 transition-colors">
            VIỆT PHỤC REMIX
          </a>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-wider font-semibold text-stone-600">
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

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsQuizOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-800/40 bg-amber-50 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors whitespace-nowrap"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quiz phong cách</span>
            </button>
            <button
              onClick={() => openCompare()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors whitespace-nowrap"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-800" />
              <span className="hidden sm:inline">So sánh Look</span>
            </button>
            <button
              onClick={() => setIsLookbookModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-stone-900 text-xs font-semibold text-white hover:bg-stone-800 transition-colors shadow-xs whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Xuất Lookbook</span>
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
              Nền tảng sáng tạo giúp học sinh, sinh viên tự do khám phá vẻ đẹp của Áo Tấc, Áo Ngũ Thân, Áo Tứ Thân, Áo Nhật Bình... Phối cùng phụ kiện hiện đại một cách thời thượng mà vẫn giữ trọn vẹn sự tôn trọng với giá trị văn hóa tiền nhân.
            </p>

            {/* Quick stats & trust bar */}
            <div className="flex items-center flex-wrap gap-4 pt-2 text-xs text-stone-400">
              <span>6 Loại Cổ Phục Chuẩn Mực</span>
              <span aria-hidden="true">·</span>
              <span>Bảng Màu Ngũ Hành Di Sản</span>
              <span aria-hidden="true">·</span>
              <span>Hệ Thống Thẩm Định Văn Hóa Thời Gian Thực</span>
            </div>

            <div className="pt-3">
              <button
                onClick={() => setIsQuizOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 text-sm font-bold shadow-md transition-colors"
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
            {/* LEFT: Mannequin Visualizer & Avatar Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Mannequin Stage */}
              <div className="relative group">
                <MannequinVisualizer config={config} isZoomed={isZoomed} />

                {/* Floating Canvas Controls */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/85 backdrop-blur-md p-1 rounded-lg border border-stone-200/80 shadow-xs">
                  <button
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="p-1.5 rounded-md hover:bg-stone-100 text-stone-700 transition-colors"
                    title={isZoomed ? 'Thu nhỏ toàn thân' : 'Phóng to chi tiết áo'}
                  >
                    {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
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
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-stone-700">Chọn dáng trang phục truyền thống:</span>
                    <span className="text-amber-800 font-medium">Hiện tại: {selectedGarment.name}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {GARMENTS.map(g => (
                      <div
                        key={g.id}
                        onClick={() => setConfig(prev => ({ ...prev, garmentId: g.id }))}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          config.garmentId === g.id
                            ? 'border-amber-800 bg-amber-50/50 ring-1 ring-amber-800 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-stone-50/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif font-bold text-stone-900 text-sm">{g.name}</h4>
                          {config.garmentId === g.id && (
                            <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <p className="text-[11px] text-stone-500 font-medium">{g.dynasty}</p>
                          <AuthenticityBadge level={g.authenticity} />
                        </div>
                        <p className="text-xs text-stone-600 line-clamp-2 mt-1.5 leading-relaxed">{g.shortDesc}</p>
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
                        onClick={() => setConfig(prev => ({ ...prev, colorId: c.id }))}
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
                </div>
              )}

              {/* TAB 3: Pattern */}
              {activeTab === 'pattern' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-stone-700">Họa tiết dệt & thêu truyền thống:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PATTERNS.map(p => (
                      <div
                        key={p.id}
                        onClick={() => setConfig(prev => ({ ...prev, patternId: p.id }))}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          config.patternId === p.id
                            ? 'border-amber-800 bg-amber-50/50 ring-1 ring-amber-800 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-stone-900 text-xs">{p.name}</h4>
                          {config.patternId === p.id && <Check className="w-4 h-4 text-amber-800" />}
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">{p.culturalOrigin}</p>
                        <p className="text-xs text-stone-600 mt-1">{p.description}</p>
                      </div>
                    ))}
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
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
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
                        <p className="text-[11px] text-amber-800 mt-1 italic">💡 {b.genzTip}</p>
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
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
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
                        <p className="text-[11px] text-amber-800 mt-1 italic">💡 {h.genzTip}</p>
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
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
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
                        <p className="text-[11px] text-amber-800 mt-1 italic">💡 {f.genzTip}</p>
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
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
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
                              {isSelected ? '✓' : ''}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 mt-1">{a.description}</p>
                          <p className="text-[11px] text-amber-800 mt-1 italic">💡 {a.genzTip}</p>
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
          <AIStylistConsultant config={config} />
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
                className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden flex flex-col hover:border-amber-800/60 transition-all hover:shadow-md group"
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
            <p className="text-[11px] text-stone-400 mt-0.5">
              Lan tỏa tình yêu cổ phục Việt Nam qua lăng kính thời trang hiện đại văn minh.
            </p>
          </div>
          <div className="flex items-center gap-4 text-stone-600">
            <span>Áo Tấc · Ngũ Thân · Tứ Thân · Nhật Bình · Giao Lĩnh</span>
          </div>
        </div>
      </footer>

      {/* Modal Dialogs */}
      <LookbookCardModal
        isOpen={isLookbookModalOpen}
        onClose={() => setIsLookbookModalOpen(false)}
        config={config}
        onSave={(c, name) => saved.save(c, name)}
        isSaved={saved.isSaved(config)}
      />

      <StyleQuizModal
        isOpen={isQuizOpen}
        onClose={closeQuiz}
        onApply={newConfig => {
          setConfig(newConfig);
          setTimeout(() => scrollToSection('studio-remix'), 50);
        }}
      />

      <LookComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        currentLook={config}
        savedLooks={saved.looks}
        initialSelection={compareSelection}
        onApplyLook={newConfig => setConfig(newConfig)}
      />
    </div>
  );
}
