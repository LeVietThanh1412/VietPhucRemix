import React, { useState, useRef, useEffect } from 'react';
import { OutfitConfig } from '../types/vietphuc';
import { HERITAGE_COLORS, GARMENTS } from '../data/heritageData';
import { BackdropDefs } from './Backdrops';
import { 
  IconViet3D, 
  IconVietOrbit, 
  IconVietLighting, 
  IconVietFocus,
  IconVietGarment,
  IconPatternCucDayLy,
  IconPatternRongTran,
  IconPatternHacMayLe,
  IconPatternPlainSilk,
  IconPatternBatBuu,
  IconPatternChuTho,
  IconPatternChuDau
} from './VietIcons';
import { Bot, Sparkles, RotateCw, ZoomIn, ZoomOut, Check, Compass, Eye, Sun, Moon, Flame, Maximize2, ShieldCheck, Info } from 'lucide-react';

export type LightingMode = 'studio' | 'sunset' | 'lantern' | 'moonlight';
export type StudioAngle = 0 | 45 | 180 | -45;
export type MacroFocus = 'full' | 'collar' | 'sleeves' | 'belt' | 'back';

export interface AIActionDirective {
  type: 'rotate' | 'focus' | 'lighting' | 'pose' | 'apply';
  value: any;
  message?: string;
  source?: 'ai' | 'offline';
}

interface MannequinVisualizer3DProps {
  config: OutfitConfig;
  className?: string;
  isZoomed?: boolean;
  onUpdateConfig?: (patch: Partial<OutfitConfig>) => void;
  aiDirective?: AIActionDirective | null;
  onClearDirective?: () => void;
  onRequestAISuggestion?: (topic: string) => void;
}

// Cultural Annotation Guide for Macro Focus
const CULTURAL_ANNOTATIONS: Record<MacroFocus, { title: string; subtitle: string; desc: string; source: string }> = {
  full: {
    title: 'Toàn Cảnh Cổ Phục Đại Việt',
    subtitle: 'Tổng thể phom dáng chuẩn mực',
    desc: 'Bố cục cân đối giữa vạt áo, đai thắt lưng, tỷ lệ ống tay và tà áo theo đúng thư tịch và hiện vật lịch sử.',
    source: 'Bảo tàng Cổ vật Cung đình Huế & Bảo tàng Lịch sử Quốc gia'
  },
  collar: {
    title: 'Cổ Áo & Nẹp Khuy Cài Nách (Hữu Nhậm)',
    subtitle: 'Đặc trưng cốt lõi nhận diện Việt Phục',
    desc: 'Trang phục Việt dùng kiểu nẹp vạt lượn cánh cung sang nách phải, cài 5 khuy cúc đồng hoặc ngọc đại diện Ngũ Thường (Nhân, Nghĩa, Lễ, Trí, Tín), khác biệt hoàn toàn với cổ chéo bè to của Hán phục hay vạt thẳng của Kimono.',
    source: 'Trần Quang Đức, "Ngàn năm áo mũ" (2013)'
  },
  sleeves: {
    title: 'Ống Tay Thụng & Cửa Tay Lót Bạch La',
    subtitle: 'Phong thái khoan thai, đĩnh đạc',
    desc: 'Ống tay thụng Áo Tấc buông quá đầu gối khi chắp tay; Áo Nhật Bình viền ngũ sắc tượng trưng Ngũ hành (Kim - Mộc - Thủy - Hỏa - Thổ); Áo Viên Lĩnh tay rộng tôn nét uy nghiêm hoàng tộc.',
    source: 'Đoàn Thị Tình, "Trang phục Việt Nam" (2006)'
  },
  belt: {
    title: 'Đai Ngọc Lý - Trần & Dải Thắt Cung Đình',
    subtitle: 'Nghệ thuật phụ kiện hoàng gia Đại Việt',
    desc: 'Đai da gắn các phiến ngọc chữ nhật thời Lý - Trần với khóa hoa sen chạm lộng; Bao ruột tượng Quan họ quấn eo kết hợp dải lụa ngũ sắc buông thả tự nhiên bên hông.',
    source: 'Hiện vật khảo cổ Hoàng thành Thăng Long & Chùa Phật Tích'
  },
  back: {
    title: 'Đường Sống Lưng Áo (Cột Sống Di Sản)',
    subtitle: 'Biểu tượng của sự ngay thẳng, chính trực',
    desc: 'Khổ vải xưa hẹp (40cm) nên thân sau phải ghép đôi tạo thành đường may thẳng tắp dọc giữa lưng. Dân gian xem đây là lời nhắc nhở người mặc luôn giữ tâm tính quang minh chính đại.',
    source: 'Tư liệu nghiên cứu Hội Di Sản Văn Hóa Việt Nam'
  }
};

export const MannequinVisualizer3D: React.FC<MannequinVisualizer3DProps> = ({
  config,
  className = '',
  isZoomed = false,
  onUpdateConfig,
  aiDirective,
  onClearDirective,
  onRequestAISuggestion
}) => {
  const selectedColor = HERITAGE_COLORS.find(c => c.id === config.colorId) || HERITAGE_COLORS[0];
  const selectedGarment = GARMENTS.find(g => g.id === config.garmentId) || GARMENTS[0];
  const uid = 'vpatelier' + React.useId().replace(/[^a-zA-Z0-9]/g, '') + '-';

  const isMale = config.modelGender === 'male';
  const isFemale = config.modelGender === 'female';

  // Multi-Angle Perspective & Studio State
  const [currentAngle, setCurrentAngle] = useState<StudioAngle>(0);
  const [macroFocus, setMacroFocus] = useState<MacroFocus>('full');
  const [lightingMode, setLightingMode] = useState<LightingMode>('sunset');
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null);
  const [pedestalAngle, setPedestalAngle] = useState(0);
  const [isAutoOrbit, setIsAutoOrbit] = useState(false);

  // Drag interaction state for smooth orbit gestures
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const dragAccumRef = useRef(0);

  // Handle AI Directives
  useEffect(() => {
    if (!aiDirective) return;
    if (aiDirective.type === 'rotate') {
      const val = Number(aiDirective.value);
      if (val === 180) setCurrentAngle(180);
      else if (val > 0 && val <= 90) setCurrentAngle(45);
      else if (val < 0) setCurrentAngle(-45);
      else setCurrentAngle(0);
      setPedestalAngle(val);
      if (aiDirective.message) setActiveSpeech(aiDirective.message);
    } else if (aiDirective.type === 'lighting') {
      setLightingMode(aiDirective.value);
      if (aiDirective.message) setActiveSpeech(aiDirective.message);
    } else if (aiDirective.type === 'focus') {
      const f = aiDirective.value as MacroFocus;
      setMacroFocus(f);
      if (f === 'back') setCurrentAngle(180);
      else if (f === 'collar' || f === 'sleeves' || f === 'belt') setCurrentAngle(0);
      if (aiDirective.message) setActiveSpeech(aiDirective.message);
    } else if (aiDirective.type === 'pose') {
      if (aiDirective.value === 'cung-dinh') {
        setCurrentAngle(45);
        setPedestalAngle(45);
        setLightingMode('sunset');
        setMacroFocus('sleeves');
      } else if (aiDirective.value === 'si-tu') {
        setCurrentAngle(-45);
        setPedestalAngle(-45);
        setLightingMode('lantern');
        setMacroFocus('collar');
      } else if (aiDirective.value === 'kinh-bac') {
        setCurrentAngle(180);
        setPedestalAngle(180);
        setLightingMode('moonlight');
        setMacroFocus('back');
      }
      if (aiDirective.message) setActiveSpeech(aiDirective.message);
    }
  }, [aiDirective]);

  // Auto-Orbit loop
  useEffect(() => {
    if (!isAutoOrbit) return;
    const angles: StudioAngle[] = [0, 45, 180, -45];
    let idx = angles.indexOf(currentAngle);
    if (idx === -1) idx = 0;
    const timer = setInterval(() => {
      idx = (idx + 1) % angles.length;
      setCurrentAngle(angles[idx]);
      setPedestalAngle(angles[idx]);
    }, 2800);
    return () => clearInterval(timer);
  }, [isAutoOrbit, currentAngle]);

  // Drag Gesture Handler
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setIsAutoOrbit(false);
    setDragStartX(e.clientX);
    dragAccumRef.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    dragAccumRef.current = deltaX;
    setPedestalAngle(prev => prev + (deltaX > 0 ? 1.5 : -1.5));
    setDragStartX(e.clientX);

    // Switch discrete perspective when drag threshold exceeded
    if (deltaX > 60) {
      if (currentAngle === 0) setCurrentAngle(45);
      else if (currentAngle === 45) setCurrentAngle(180);
      else if (currentAngle === 180) setCurrentAngle(-45);
      else if (currentAngle === -45) setCurrentAngle(0);
    } else if (deltaX < -60) {
      if (currentAngle === 0) setCurrentAngle(-45);
      else if (currentAngle === -45) setCurrentAngle(180);
      else if (currentAngle === 180) setCurrentAngle(45);
      else if (currentAngle === 45) setCurrentAngle(0);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  // Color utilities
  const primaryHex = config.customColorHex || selectedColor.hex;
  const isDarkGarment = config.customColorHex
    ? (function (hex: string) {
        const clean = hex.replace('#', '');
        const r = parseInt(clean.length === 3 ? clean[0] + clean[0] : clean.substring(0, 2), 16) || 0;
        const g = parseInt(clean.length === 3 ? clean[1] + clean[1] : clean.substring(2, 4), 16) || 0;
        const b = parseInt(clean.length === 3 ? clean[2] + clean[2] : clean.substring(4, 6), 16) || 0;
        return (0.299 * r + 0.587 * g + 0.114 * b) < 140;
      })(config.customColorHex)
    : ['den-mun', 'lam-cham', 'tim-hue'].includes(selectedColor.id);
  const strokeColor = isDarkGarment ? 'rgba(255,255,255,0.32)' : 'rgba(28,25,23,0.22)';
  const highlightHex = isDarkGarment ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.45)';

  // Bottom color mapping
  let bottomFill = '#FAF7F0';
  let bottomStroke = '#DCD5C5';
  if (config.bottomId === 'quan-lua-den') {
    bottomFill = '#1C1917';
    bottomStroke = '#44403C';
  } else if (config.bottomId === 'quan-jeans-suong') {
    bottomFill = '#5A738E';
    bottomStroke = '#3D5269';
  } else if (config.bottomId === 'vay-xep-ly') {
    bottomFill = '#EFEAE2';
    bottomStroke = '#C8BDAB';
  } else if (config.bottomId === 'quan-palazzo') {
    bottomFill = '#D8D0C2';
    bottomStroke = '#B3A690';
  }

  // Lighting overlay styling
  const lightingBg = {
    studio: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.28) 0%, rgba(0,0,0,0.04) 80%)',
    sunset: 'radial-gradient(circle at 75% 25%, rgba(245, 158, 11, 0.35) 0%, rgba(180, 83, 9, 0.15) 50%, rgba(15, 23, 42, 0.35) 100%)',
    lantern: 'radial-gradient(circle at 25% 45%, rgba(239, 68, 68, 0.35) 0%, rgba(245, 158, 11, 0.2) 50%, rgba(24, 16, 36, 0.45) 100%)',
    moonlight: 'radial-gradient(circle at 50% 15%, rgba(186, 230, 253, 0.35) 0%, rgba(30, 58, 138, 0.2) 60%, rgba(15, 23, 42, 0.5) 100%)'
  }[lightingMode];

  // Dynamic ViewBox for Macro Focus Camera Zoom
  const getViewBox = () => {
    if (isZoomed) return "110 90 380 480";
    switch (macroFocus) {
      case 'collar':
        return "180 170 240 280"; // Zoom in collar & buttons
      case 'sleeves':
        return "80 250 320 360";  // Zoom in flowing sleeves
      case 'belt':
        return "190 310 220 250";  // Zoom in sash & jade belt
      case 'back':
        return "190 160 220 340";  // Zoom in back chignon & spine seam
      default:
        return "0 0 600 800";      // Full view
    }
  };

  return (
    <div className={`relative w-full aspect-[3/4] max-w-[540px] mx-auto overflow-hidden rounded-2xl shadow-xl border border-stone-200/90 bg-[#FAF7F2] transition-all duration-500 select-none ${className}`}>
      {/* 1. Ambient Lighting Filter */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-700 z-10"
        style={{ background: lightingBg }}
      />

      {/* 2. Top Control Bar: Mode Badge, Lighting, & Auto Orbit */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-stone-900/85 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-medium border border-white/20 shadow-xs pointer-events-auto">
          <IconViet3D size={14} className="text-amber-400" />
          <span className="font-semibold tracking-wide">ATELIER ĐA CHIỀU</span>
          <span className="text-amber-300 font-mono text-[10px] pl-1 border-l border-white/20">
            {currentAngle === 0 ? '0° Trực Diện' : currentAngle === 45 ? '45° Phối Cảnh' : currentAngle === 180 ? '180° Sau Lưng' : '-45° Nẹp Hữu Nhậm'}
          </span>
        </div>

        {/* Lighting Selector Pill */}
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-stone-200/90 shadow-2xs pointer-events-auto">
          <button
            onClick={() => setLightingMode('sunset')}
            className={`p-1.5 rounded-lg transition-colors ${lightingMode === 'sunset' ? 'bg-amber-100 text-amber-900 shadow-2xs' : 'text-stone-600 hover:bg-stone-100'}`}
            title="Hoàng hôn Cố Đô"
          >
            <Sun className="w-3.5 h-3.5 text-amber-600" />
          </button>
          <button
            onClick={() => setLightingMode('lantern')}
            className={`p-1.5 rounded-lg transition-colors ${lightingMode === 'lantern' ? 'bg-rose-100 text-rose-900 shadow-2xs' : 'text-stone-600 hover:bg-stone-100'}`}
            title="Đèn lồng Phố Cổ"
          >
            <Flame className="w-3.5 h-3.5 text-rose-600" />
          </button>
          <button
            onClick={() => setLightingMode('moonlight')}
            className={`p-1.5 rounded-lg transition-colors ${lightingMode === 'moonlight' ? 'bg-sky-100 text-sky-900 shadow-2xs' : 'text-stone-600 hover:bg-stone-100'}`}
            title="Ánh trăng Thăng Long"
          >
            <Moon className="w-3.5 h-3.5 text-sky-600" />
          </button>
          <button
            onClick={() => setIsAutoOrbit(!isAutoOrbit)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
              isAutoOrbit ? 'bg-emerald-100 text-emerald-900' : 'text-stone-700 hover:bg-stone-100'
            }`}
            title="Tự động xoay các góc nhìn"
          >
            <IconVietOrbit size={13} className={isAutoOrbit ? 'animate-spin' : ''} />
            <span className="text-[10px]">{isAutoOrbit ? 'Dừng' : 'Xoay'}</span>
          </button>
        </div>
      </div>

      {/* 3. AI Stylist Interactive Directive Speech Overlay */}
      {activeSpeech && (
        <div className="absolute top-14 left-3 right-3 z-30 animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-auto">
          <div className="bg-stone-900/90 backdrop-blur-md text-white p-3 rounded-xl border border-amber-500/40 shadow-lg flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">AI Stylist Hướng Dẫn Di Sản</span>
                <button
                  onClick={() => setActiveSpeech(null)}
                  className="text-stone-400 hover:text-white text-xs px-1"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-stone-200 mt-0.5 leading-relaxed">
                {activeSpeech}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Cultural Macro Annotation Modal Banner (When Focused) */}
      {macroFocus !== 'full' && (
        <div className="absolute top-14 left-3 right-3 z-30 animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-auto">
          <div className="bg-amber-950/90 backdrop-blur-md text-amber-100 p-3 rounded-xl border border-amber-500/50 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300">{CULTURAL_ANNOTATIONS[macroFocus].title}</span>
              </div>
              <button
                onClick={() => setMacroFocus('full')}
                className="text-[11px] px-2 py-0.5 rounded-md bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-700/50"
              >
                Thu Về Toàn Cảnh
              </button>
            </div>
            <p className="text-[11px] text-amber-100/90 mt-1 leading-relaxed">
              {CULTURAL_ANNOTATIONS[macroFocus].desc}
            </p>
            <div className="mt-1.5 pt-1 border-t border-amber-800/40 text-[9px] text-amber-400/80 font-mono flex items-center justify-between">
              <span>Nguồn khảo cứu: {CULTURAL_ANNOTATIONS[macroFocus].source}</span>
              <span className="text-amber-300 font-semibold">{selectedGarment.name}</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Main Atelier Interactive Stage */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full cursor-grab active:cursor-grabbing relative flex items-center justify-center touch-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={getViewBox()}
          className="w-full h-full object-contain select-none transition-all duration-500 ease-out"
          aria-label="Minh họa Phục Dựng Cổ Phục Đa Chiều"
        >
          <defs>
            <BackdropDefs uid={uid} />

            {/* Skin Shading */}
            <linearGradient id={`${uid}skin-female`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F4D3C2" />
              <stop offset="50%" stopColor="#FCE7DC" />
              <stop offset="100%" stopColor="#F0C7B2" />
            </linearGradient>

            <linearGradient id={`${uid}skin-male`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DEB19A" />
              <stop offset="50%" stopColor="#F2D1BF" />
              <stop offset="100%" stopColor="#D69F86" />
            </linearGradient>

            {/* Silk Sheen Overlay */}
            <linearGradient id={`${uid}silk-sheen`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.22" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity="0.16" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
            </linearGradient>

            {/* Pattern: Hoa Cúc Dây Thời Lý */}
            <pattern id={`${uid}pattern-cuc-day-ly`} width="54" height="54" patternUnits="userSpaceOnUse">
              <path d="M 0 27 C 14 9, 40 45, 54 27" fill="none" stroke={isDarkGarment ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.18)'} strokeWidth="1.5" />
              <circle cx="27" cy="27" r="3.5" fill="none" stroke={isDarkGarment ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.22)'} strokeWidth="1.3" />
            </pattern>

            {/* Pattern: Rồng Thời Trần */}
            <pattern id={`${uid}pattern-rong-thoi-tran`} width="68" height="68" patternUnits="userSpaceOnUse">
              <path d="M 6 50 C 15 26, 30 58, 46 28 C 54 14, 62 22, 60 36" fill="none" stroke={isDarkGarment ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.2)'} strokeWidth="2.2" strokeLinecap="round" />
            </pattern>

            {/* Pattern: Hạc Mây Thời Lê Sơ */}
            <pattern id={`${uid}pattern-hac-may-le`} width="62" height="62" patternUnits="userSpaceOnUse">
              <path d="M 31 33 C 29 25 33 19 37 15 C 38 14 41 15 40 17 Z" fill={isDarkGarment ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)'} stroke={isDarkGarment ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.22)'} strokeWidth="1.1" />
              <path d="M 32 25 C 21 19 11 23 5 31" fill="none" stroke={isDarkGarment ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'} strokeWidth="1.2" />
            </pattern>

            {/* Bronze Drum Rotating Turntable Pedestal Gradient */}
            <radialGradient id={`${uid}pedestal-grad`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="85%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#451A03" />
            </radialGradient>
          </defs>

          {/* ========================================================= */}
          {/* BRONZE DRUM PEDESTAL (Bục Đồng Đông Sơn Xoay Động)         */}
          {/* ========================================================= */}
          <g id="dongson-pedestal" transform="translate(300, 715)">
            <ellipse cx="0" cy="8" rx="140" ry="26" fill="rgba(0,0,0,0.25)" filter="blur(6px)" />
            <ellipse cx="0" cy="0" rx="145" ry="32" fill={`url(#${uid}pedestal-grad)`} stroke="#78350F" strokeWidth="2.5" />
            <ellipse cx="0" cy="0" rx="135" ry="28" fill="#1C1917" stroke="#92400E" strokeWidth="1.2" />
            <ellipse cx="0" cy="0" rx="122" ry="24" fill={`url(#${uid}pedestal-grad)`} opacity="0.4" />
            
            {/* Dynamic Rotating Directional Markers on Pedestal Rim */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
              const rad = ((deg + pedestalAngle) * Math.PI) / 180;
              const px = Math.cos(rad) * 115;
              const py = Math.sin(rad) * 20;
              return (
                <circle key={i} cx={px} cy={py} r="2.8" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
              );
            })}
          </g>

          {/* ================================================================= */}
          {/* PERSPECTIVE A: GÓC TRỰC DIỆN (0°)                                 */}
          {/* ================================================================= */}
          {currentAngle === 0 && (
            <g id="perspective-front" className="animate-in fade-in duration-300">
              {/* Torso & Head Base */}
              <ellipse cx="300" cy="180" rx="34" ry="46" fill={`url(#${uid}skin-${isMale ? 'male' : 'female'})`} stroke="#C2947F" strokeWidth="0.8" />
              {/* Face features */}
              <path d="M282 176 L294 176 M306 176 L318 176" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
              <path d="M300 178 L300 196 L305 197" stroke="#B8866E" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M292 208 Q 300 211 308 208" stroke="#9A3412" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Headwear Front */}
              {config.headwearId === 'khan-van' && (
                <g id="front-khan-van">
                  <ellipse cx="300" cy="150" rx="38" ry="16" fill="#1C1917" stroke="#44403C" strokeWidth="1.5" />
                  <path d="M288 152 L300 160 L312 152" stroke="#F59E0B" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                </g>
              )}
              {config.headwearId === 'khan-dong' && (
                <g id="front-khan-dong">
                  <ellipse cx="300" cy="150" rx="36" ry="15" fill="#1C1917" stroke="#44403C" strokeWidth="1.5" />
                  <path d="M292 148 L300 156 L308 148" stroke="#D97706" strokeWidth="1.8" fill="none" />
                </g>
              )}
              {config.headwearId === 'non-quai-thao' && (
                <ellipse cx="300" cy="145" rx="55" ry="14" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" />
              )}
              {config.headwearId === 'non-la' && (
                <path d="M300 105 L230 155 L370 155 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
              )}

              {/* Lower Garment (Quần lụa / Váy) */}
              <path d="M255 450 L345 450 L360 680 L310 680 L300 480 L290 680 L240 680 Z" fill={bottomFill} stroke={bottomStroke} strokeWidth="1.5" />

              {/* Inner White Collar (Cổ lót trắng) */}
              <path d="M286 244 L300 255 L314 244" stroke="#FFFFFF" strokeWidth="3.2" fill="none" strokeLinecap="round" />

              {/* UPPER GARMENTS (FRONT VIEW) */}
              {/* CASE 1: Áo Viên Lĩnh (Lý - Trần) */}
              {config.garmentId === 'ao-vien-linh' && (
                <g id="front-vien-linh">
                  <path d="M238 255 L118 335 C 102 445, 145 545, 202 562 L234 445 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M362 255 L482 335 C 498 445, 455 545, 398 562 L366 445 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M238 250 L362 250 L378 572 Q 300 588 222 572 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  {config.patternId !== 'plain-silk' && (
                    <path d="M238 250 L362 250 L378 572 Q 300 588 222 572 Z" fill={`url(#${uid}pattern-${config.patternId})`} opacity="0.8" />
                  )}
                  <path d="M238 250 L362 250 L378 572 Q 300 588 222 572 Z" fill={`url(#${uid}silk-sheen)`} />
                  {/* Cổ tròn Viên Lĩnh */}
                  <path d="M278 236 C 278 260, 322 260, 322 236 L 318 236 C 318 256, 282 256, 282 236 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M279 236 C 279 258, 321 258, 321 236" fill="none" stroke="#FAF7EE" strokeWidth="2.2" />
                  <path d="M318 244 Q 334 260 346 288" stroke={strokeColor} strokeWidth="1.6" fill="none" />
                  <circle cx="320" cy="245" r="3.2" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                  <circle cx="334" cy="265" r="3" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                  <circle cx="346" cy="288" r="3" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                  {/* Đai ngọc Lý - Trần */}
                  <rect x="248" y="354" width="104" height="18" rx="2.5" fill="#1C1917" stroke="#44403C" strokeWidth="1.2" />
                  {[256, 272, 318, 334].map((px, idx) => (
                    <rect key={idx} x={px} y="357" width="11" height="12" rx="1.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
                  ))}
                  <rect x="290" y="351" width="20" height="24" rx="3.5" fill="#D97706" stroke="#78350F" strokeWidth="1.2" />
                  <circle cx="300" cy="363" r="6" fill="#FCD34D" stroke="#B45309" strokeWidth="0.8" />
                  <path d="M296 375 L292 485 L300 485 L299 375 Z" fill="#991B1B" />
                  <path d="M301 375 L305 480 L311 480 L304 375 Z" fill="#D97706" />
                </g>
              )}

              {/* CASE 2: Áo Tấc (Triều Nguyễn) */}
              {config.garmentId === 'ao-tac' && (
                <g id="front-ao-tac">
                  <path d="M238 255 L125 330 C 110 435, 145 540, 195 560 L230 450 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M362 255 L475 330 C 490 435, 455 540, 405 560 L370 450 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M238 252 L362 252 L375 570 Q 300 585 225 570 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M238 252 L362 252 L375 570 Q 300 585 225 570 Z" fill={`url(#${uid}silk-sheen)`} />
                  {/* Cổ Lập Lĩnh */}
                  <path d="M284 238 L316 238 L318 255 L282 255 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M284 238 L316 238" stroke="#FAF7EE" strokeWidth="2.2" />
                  {/* Vạt nách cong cánh cung chuẩn Việt & 5 cúc khuy Ngũ Thường */}
                  <path d="M298 252 C 316 260, 324 278, 324 300 L 324 535" stroke={strokeColor} strokeWidth="1.2" strokeDasharray="3 2" fill="none" opacity="0.6" />
                  {[
                    { cx: 304, cy: 248 },
                    { cx: 318, cy: 268 },
                    { cx: 324, cy: 300 },
                    { cx: 324, cy: 342 },
                    { cx: 324, cy: 390 }
                  ].map((btn, idx) => (
                    <circle key={idx} cx={btn.cx} cy={btn.cy} r="3.6" fill="#FBBF24" stroke="#78350F" strokeWidth="0.9" />
                  ))}
                  <path d="M246 430 L230 568" stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M354 430 L370 568" stroke={strokeColor} strokeWidth="1.5" />
                </g>
              )}

              {/* CASE 3: Áo Ngũ Thân (Tay Chẽn) */}
              {config.garmentId === 'ao-ngu-than' && (
                <g id="front-ngu-than">
                  <path d="M242 255 C 216 295, 204 350, 222 435 L 244 425 C 230 360, 238 310, 260 262 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M358 255 C 384 295, 396 350, 378 435 L 356 425 C 370 360, 362 310, 340 262 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M242 252 L358 252 L368 535 Q 300 545 232 535 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M242 252 L358 252 L368 535 Q 300 545 232 535 Z" fill={`url(#${uid}silk-sheen)`} />
                  <path d="M284 238 L316 238 L318 254 L282 254 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M298 252 C 316 260, 324 278, 324 300 L 324 535" stroke={strokeColor} strokeWidth="1.5" fill="none" />
                  {[
                    { cx: 304, cy: 247 },
                    { cx: 318, cy: 268 },
                    { cx: 324, cy: 300 },
                    { cx: 324, cy: 342 },
                    { cx: 324, cy: 390 }
                  ].map((btn, idx) => (
                    <circle key={idx} cx={btn.cx} cy={btn.cy} r="3.2" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                  ))}
                  <rect x="220" y="426" width="18" height="7" rx="2" fill="#FAF5E8" stroke="#D1C7B7" strokeWidth="1" />
                  <rect x="362" y="426" width="18" height="7" rx="2" fill="#FAF5E8" stroke="#D1C7B7" strokeWidth="1" />
                </g>
              )}

              {/* CASE 4: Áo Nhật Bình (Triều Nguyễn) */}
              {config.garmentId === 'ao-nhat-binh' && (
                <g id="front-nhat-binh">
                  <path d="M246 255 L150 338 L188 485 L228 425 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M354 255 L450 338 L412 485 L372 425 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  {/* Ngũ Sắc Sleeve Bands */}
                  <path d="M160 355 L190 475" stroke="#0284C7" strokeWidth="4.5" />
                  <path d="M165 358 L195 478" stroke="#DC2626" strokeWidth="4.5" />
                  <path d="M170 361 L200 481" stroke="#FBBF24" strokeWidth="4.5" />
                  <path d="M440 355 L410 475" stroke="#0284C7" strokeWidth="4.5" />
                  <path d="M435 358 L405 478" stroke="#DC2626" strokeWidth="4.5" />
                  <path d="M430 361 L400 481" stroke="#FBBF24" strokeWidth="4.5" />
                  <path d="M246 250 L354 250 L370 565 Q 300 580 230 565 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  {/* Cổ chữ nhật Nhật Bình */}
                  <rect x="270" y="246" width="60" height="98" rx="3" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
                  <rect x="280" y="252" width="40" height="88" fill={primaryHex} />
                  <rect x="273" y="248" width="54" height="94" fill="none" stroke="#DC2626" strokeWidth="2.5" />
                  <rect x="276" y="250" width="48" height="90" fill="none" stroke="#FBBF24" strokeWidth="2" />
                  {/* Hai dải thắt thả trước ngực */}
                  <rect x="282" y="344" width="14" height="185" fill="#B45309" stroke="#78350F" strokeWidth="1" />
                  <rect x="304" y="344" width="14" height="185" fill="#B45309" stroke="#78350F" strokeWidth="1" />
                  {[365, 405, 445, 485].map((ry, i) => (
                    <g key={i}>
                      <circle cx="289" cy={ry} r="3.2" fill="#FEF08A" />
                      <circle cx="311" cy={ry} r="3.2" fill="#FEF08A" />
                    </g>
                  ))}
                </g>
              )}

              {/* CASE 5: Áo Giao Lĩnh */}
              {config.garmentId === 'ao-giao-linh' && (
                <g id="front-giao-linh">
                  <path d="M240 255 L150 355 L198 470 L238 415 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M360 255 L450 355 L402 470 L362 415 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M242 250 L358 250 L370 555 Q 300 570 230 555 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  {/* Cổ lót bạch la */}
                  <path d="M276 240 L324 350 L316 350 L268 244 Z" fill="#FAF8F5" stroke="#E2E8F0" strokeWidth="1.2" />
                  {/* Nẹp chéo Hữu nhậm */}
                  <path d="M324 240 L268 352 L280 352 L336 246 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.4" />
                  <line x1="276" y1="240" x2="324" y2="350" stroke={strokeColor} strokeWidth="1.8" />
                  <line x1="324" y1="240" x2="268" y2="352" stroke={strokeColor} strokeWidth="1.8" />
                  {/* Bao sái & ngọc khánh */}
                  <rect x="254" y="348" width="92" height="18" rx="2" fill="#1C1917" stroke="#44403C" strokeWidth="1.2" />
                  <ellipse cx="298" cy="357" rx="7" ry="6" fill="#292524" stroke="#44403C" strokeWidth="1" />
                  <circle cx="298" cy="357" r="3" fill="#D97706" />
                  <path d="M293 366 L287 485 L296 485 L299 366 Z" fill="#1C1917" stroke="#44403C" strokeWidth="0.8" />
                  <path d="M299 366 L305 478 L313 478 L305 366 Z" fill="#78350F" stroke="#B45309" strokeWidth="0.8" />
                  <circle cx="291" cy="488" r="3.8" fill="#A7F3D0" stroke="#059669" strokeWidth="0.8" />
                </g>
              )}

              {/* CASE 6: Áo Tứ Thân & Yếm Đào */}
              {config.garmentId === 'ao-tu-than' && (
                <g id="front-tu-than">
                  <path d="M252 252 L348 252 L366 565 Q 300 578 234 565 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M 252 254 C 224 290, 204 345, 218 438 L 240 432 C 230 365, 238 310, 264 262 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M 348 254 C 376 290, 396 345, 382 438 L 360 432 C 370 365, 362 310, 336 262 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  {/* Yếm Đào Cánh Sen */}
                  <path d="M286 244 Q 300 236 314 244" stroke="#FFFDF8" strokeWidth="2.8" fill="none" />
                  <path d="M 284 246 C 265 285, 262 335, 270 354 L 330 354 C 338 335, 335 285, 316 246 Q 300 258 284 246 Z" fill="#E11D48" stroke="#9F1239" strokeWidth="1.2" />
                  {/* Hai nẹp vạt trước */}
                  <path d="M 276 246 C 265 280, 260 320, 266 354 L 282 354 C 276 320, 278 280, 286 246 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M 324 246 C 335 280, 340 320, 334 354 L 318 354 C 324 320, 322 280, 314 246 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  {/* Bao Ruột Tượng Xanh Lá & Dải Lụa Đào Thả */}
                  <rect x="262" y="348" width="76" height="18" rx="3" fill="#059669" stroke="#047857" strokeWidth="1.2" />
                  <circle cx="300" cy="357" r="6" fill="#10B981" />
                  <path d="M 293 364 C 286 415, 282 460, 286 505 L 297 503 C 294 460, 298 415, 301 364 Z" fill="#F43F5E" stroke="#E11D48" strokeWidth="0.8" />
                  <path d="M 300 364 C 304 415, 316 460, 312 518 L 323 516 C 326 460, 314 415, 308 364 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="0.8" />
                </g>
              )}

              {/* CASE 7: Áo Dài Hiện Đại & Lemur */}
              {(config.garmentId === 'ao-dai-hien-dai' || config.garmentId === 'ao-dai-tan-thoi') && (
                <g id="front-ao-dai">
                  <path d="M260 250 L340 250 L332 345 L348 635 Q 300 648 252 635 L268 345 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M256 252 L224 350 L234 438 L252 436 L248 355 L270 262 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.2" />
                  <path d="M344 252 L376 350 L366 438 L348 436 L352 355 L330 262 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.2" />
                  <path d="M286 234 L314 234 L316 250 L284 250 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M314 250 Q 328 264 336 300" stroke={strokeColor} strokeWidth="1.2" fill="none" />
                </g>
              )}

              {/* CASE 8: Áo Bà Ba Nam Bộ */}
              {config.garmentId === 'ao-ba-ba' && (
                <g id="front-ao-ba-ba">
                  <path d="M248 250 L352 250 L358 465 Q 300 472 242 465 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M244 255 L198 365 L218 442 L244 435 L240 360 L264 262 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M356 255 L402 365 L382 442 L356 435 L360 360 L336 262 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  {/* Hàng cúc giữa & 2 túi */}
                  <line x1="300" y1="250" x2="300" y2="465" stroke={strokeColor} strokeWidth="1.5" />
                  {[265, 295, 330, 370, 410, 450].map((y, i) => (
                    <circle key={i} cx="300" cy={y} r="2.8" fill="#FDE68A" stroke="#78350F" strokeWidth="0.8" />
                  ))}
                  <rect x="256" y="415" width="28" height="32" rx="2" fill="none" stroke={strokeColor} strokeWidth="1.2" />
                  <rect x="316" y="415" width="28" height="32" rx="2" fill="none" stroke={strokeColor} strokeWidth="1.2" />
                </g>
              )}
            </g>
          )}

          {/* ================================================================= */}
          {/* PERSPECTIVE B: GÓC NGHIÊNG 3/4 CUNG ĐÌNH (45°) - TRUE 3D VOLUME     */}
          {/* ================================================================= */}
          {currentAngle === 45 && (
            <g id="perspective-three-quarter" className="animate-in fade-in duration-300">
              {/* Torso & Head with 3/4 Foreshortening */}
              <ellipse cx="288" cy="180" rx="30" ry="46" fill={`url(#${uid}skin-${isMale ? 'male' : 'female'})`} stroke="#C2947F" strokeWidth="0.8" />
              {/* 3/4 Face Profile Contour */}
              <path d="M272 176 L284 176 M296 176 L306 176" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
              <path d="M285 178 L283 196 L290 197" stroke="#B8866E" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M278 208 Q 286 211 294 208" stroke="#9A3412" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Headwear 3/4 tilt */}
              {config.headwearId === 'khan-van' && (
                <ellipse cx="288" cy="150" rx="34" ry="16" fill="#1C1917" stroke="#44403C" strokeWidth="1.5" transform="rotate(-6 288 150)" />
              )}
              {config.headwearId === 'khan-dong' && (
                <ellipse cx="288" cy="150" rx="32" ry="15" fill="#1C1917" stroke="#44403C" strokeWidth="1.5" transform="rotate(-6 288 150)" />
              )}
              {config.headwearId === 'non-quai-thao' && (
                <ellipse cx="288" cy="145" rx="52" ry="15" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" transform="rotate(-8 288 145)" />
              )}

              {/* Lower Garment 3/4 Cylindrical Volume */}
              <path d="M245 448 L330 452 L350 680 L295 680 L285 480 L275 680 L228 680 Z" fill={bottomFill} stroke={bottomStroke} strokeWidth="1.5" />

              {/* Rear Receding Sleeve (Lớp tay áo phía sau thu nhỏ phối cảnh) */}
              <path d="M340 260 L440 330 C 455 425, 425 510, 375 530 L345 435 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" opacity="0.85" />

              {/* 3/4 Volumetric Torso Wrap */}
              <path d="M228 252 L342 256 L356 565 Q 285 585 215 565 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              <path d="M228 252 L342 256 L356 565 Q 285 585 215 565 Z" fill={`url(#${uid}silk-sheen)`} />

              {/* Front Forward Sleeve (Lớp tay áo phía trước mở rộng có chiều sâu) */}
              <path d="M228 255 L108 335 C 92 445, 135 550, 195 568 L228 445 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              {/* Inner sleeve white lining peeking out (Lớp lót trắng bên trong cửa tay) */}
              <path d="M108 335 C 102 380, 118 440, 140 480" stroke="#FAF7EE" strokeWidth="2.2" fill="none" opacity="0.9" />

              {/* 3/4 Curved Collar wrap */}
              <ellipse cx="285" cy="242" rx="24" ry="10" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              <path d="M265 244 Q 285 252 305 244" stroke="#FAF7EE" strokeWidth="2" fill="none" />

              {/* 3/4 Curved Button Placket (Đường nẹp hữu nhậm lượn cong qua ngực phải) */}
              <path d="M285 250 C 304 260, 314 278, 314 300 L 314 540" stroke={strokeColor} strokeWidth="1.4" fill="none" />
              {[
                { cx: 290, cy: 248 },
                { cx: 304, cy: 268 },
                { cx: 312, cy: 300 },
                { cx: 312, cy: 342 },
                { cx: 312, cy: 390 }
              ].map((btn, idx) => (
                <circle key={idx} cx={btn.cx} cy={btn.cy} r="3.4" fill="#FBBF24" stroke="#78350F" strokeWidth="0.8" />
              ))}

              {/* 3/4 Waist Sash wrap around body */}
              <path d="M238 354 Q 285 368 332 358 L332 374 Q 285 384 238 370 Z" fill="#1C1917" stroke="#44403C" strokeWidth="1.2" />
              <path d="M278 372 L274 480 L282 480 L281 372 Z" fill="#991B1B" />
              <path d="M283 372 L287 475 L293 475 L286 372 Z" fill="#D97706" />
            </g>
          )}

          {/* ================================================================= */}
          {/* PERSPECTIVE C: GÓC QUAY LƯNG (180°) - SỐNG LƯNG & BÚI TÓC DI SẢN   */}
          {/* ================================================================= */}
          {currentAngle === 180 && (
            <g id="perspective-back" className="animate-in fade-in duration-300">
              {/* Back of Head */}
              <ellipse cx="300" cy="178" rx="34" ry="44" fill={`url(#${uid}skin-${isMale ? 'male' : 'female'})`} stroke="#C2947F" strokeWidth="0.8" />

              {/* Traditional Vietnamese Back Chignon / Topknot (Búi tóc củ tỏi / Búi tó cài trâm) */}
              <g id="back-chignon">
                <ellipse cx="300" cy="148" rx="22" ry="18" fill="#1C1917" />
                <ellipse cx="300" cy="146" rx="16" ry="12" fill="#292524" />
                {/* Traditional Jade/Silver Hairpin (Trâm ngọc cài ngang) */}
                <line x1="268" y1="148" x2="332" y2="148" stroke="#A7F3D0" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="268" cy="148" r="3.5" fill="#34D399" stroke="#059669" strokeWidth="0.8" />
                <circle cx="332" cy="148" r="2.5" fill="#FDE68A" />
              </g>

              {/* Headwear Back */}
              {config.headwearId === 'khan-van' && (
                <ellipse cx="300" cy="155" rx="38" ry="18" fill="#1C1917" stroke="#44403C" strokeWidth="1.5" />
              )}
              {config.headwearId === 'khan-dong' && (
                <ellipse cx="300" cy="155" rx="36" ry="17" fill="#1C1917" stroke="#44403C" strokeWidth="1.5" />
              )}

              {/* Lower Garment Back */}
              <path d="M255 450 L345 450 L360 680 L310 680 L300 480 L290 680 L240 680 Z" fill={bottomFill} stroke={bottomStroke} strokeWidth="1.5" />

              {/* Wide Back Sleeves */}
              <path d="M238 255 L125 330 C 110 435, 145 540, 195 560 L230 450 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              <path d="M362 255 L475 330 C 490 435, 455 540, 405 560 L370 450 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />

              {/* Main Back Robe */}
              <path d="M238 252 L362 252 L375 570 Q 300 585 225 570 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              <path d="M238 252 L362 252 L375 570 Q 300 585 225 570 Z" fill={`url(#${uid}silk-sheen)`} />

              {/* Back Collar Band */}
              <path d="M282 238 L318 238 L316 250 L284 250 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              <path d="M282 238 L318 238" stroke="#FAF7EE" strokeWidth="2.2" />

              {/* ============================================================= */}
              {/* THE LIVING SPINE SEAM (ĐƯỜNG SỐNG LƯNG ÁO VIỆT PHỤC)          */}
              {/* Biểu tượng sự chính trực, quang minh chính đại của người xưa */}
              {/* ============================================================= */}
              <g id="heritage-spine-seam">
                <line x1="300" y1="250" x2="300" y2="575" stroke={strokeColor} strokeWidth="2.2" />
                <line x1="299" y1="250" x2="299" y2="575" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.4" />
                {/* Visual Accent Pulse on Spine */}
                <circle cx="300" cy="380" r="3" fill="#FBBF24" opacity="0.8" />
              </g>

              {/* Back Waist Sash Knot & Cascading Ribbons */}
              <rect x="252" y="352" width="96" height="18" rx="2" fill="#1C1917" stroke="#44403C" strokeWidth="1.2" />
              <ellipse cx="300" cy="361" rx="8" ry="6" fill="#292524" />
              <path d="M294 368 L288 490 L297 490 L300 368 Z" fill="#991B1B" />
              <path d="M300 368 L305 485 L313 485 L306 368 Z" fill="#D97706" />
            </g>
          )}

          {/* ================================================================= */}
          {/* PERSPECTIVE D: GÓC NGHIÊNG TRÁI (-45°) - NẸP KHUY HỮU NHẬM        */}
          {/* ================================================================= */}
          {currentAngle === -45 && (
            <g id="perspective-left-profile" className="animate-in fade-in duration-300">
              <ellipse cx="312" cy="180" rx="30" ry="46" fill={`url(#${uid}skin-${isMale ? 'male' : 'female'})`} stroke="#C2947F" strokeWidth="0.8" />
              <path d="M304 176 L316 176 M324 176 L332 176" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
              <path d="M315 178 L317 196 L310 197" stroke="#B8866E" strokeWidth="1.2" fill="none" strokeLinecap="round" />

              <path d="M270 448 L355 452 L372 680 L325 680 L315 480 L305 680 L250 680 Z" fill={bottomFill} stroke={bottomStroke} strokeWidth="1.5" />

              {/* Left Sleeve Receding */}
              <path d="M260 260 L160 330 C 145 425, 175 510, 225 530 L255 435 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" opacity="0.85" />

              {/* Main Body */}
              <path d="M258 256 L372 252 L385 565 Q 315 585 244 565 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              <path d="M258 256 L372 252 L385 565 Q 315 585 244 565 Z" fill={`url(#${uid}silk-sheen)`} />

              {/* Right Sleeve Forward with Depth */}
              <path d="M372 255 L492 335 C 508 445, 465 550, 405 568 L372 445 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              <path d="M492 335 C 498 380, 482 440, 460 480" stroke="#FAF7EE" strokeWidth="2.2" fill="none" opacity="0.9" />

              {/* Detailed Button Placket Facing Observer */}
              <path d="M315 250 C 296 260, 286 278, 286 300 L 286 540" stroke={strokeColor} strokeWidth="1.6" fill="none" />
              {[
                { cx: 310, cy: 248 },
                { cx: 296, cy: 268 },
                { cx: 288, cy: 300 },
                { cx: 288, cy: 342 },
                { cx: 288, cy: 390 }
              ].map((btn, idx) => (
                <circle key={idx} cx={btn.cx} cy={btn.cy} r="3.4" fill="#FBBF24" stroke="#78350F" strokeWidth="0.8" />
              ))}
            </g>
          )}
        </svg>
      </div>

      {/* 6. Bottom Floating Toolbar: Studio Angle Presets & Macro Inspector */}
      <div className="absolute bottom-3 left-3 right-3 z-30 flex flex-col gap-2 pointer-events-none">
        {/* Macro Focus Selector Tabs */}
        <div className="flex items-center justify-between gap-1 bg-stone-900/80 backdrop-blur-md p-1 rounded-xl border border-white/15 shadow-lg pointer-events-auto">
          <span className="text-[10px] text-amber-300 font-semibold px-2 flex items-center gap-1">
            <Eye className="w-3 h-3 text-amber-400" />
            Soi Cận Cảnh:
          </span>
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setMacroFocus('full')}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                macroFocus === 'full' ? 'bg-amber-500 text-stone-950 font-bold shadow-xs' : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Toàn Cảnh
            </button>
            <button
              onClick={() => { setMacroFocus('collar'); setCurrentAngle(0); }}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                macroFocus === 'collar' ? 'bg-amber-500 text-stone-950 font-bold shadow-xs' : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Cổ Áo & 5 Khuy
            </button>
            <button
              onClick={() => { setMacroFocus('sleeves'); setCurrentAngle(0); }}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                macroFocus === 'sleeves' ? 'bg-amber-500 text-stone-950 font-bold shadow-xs' : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Ống Tay
            </button>
            <button
              onClick={() => { setMacroFocus('belt'); setCurrentAngle(0); }}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                macroFocus === 'belt' ? 'bg-amber-500 text-stone-950 font-bold shadow-xs' : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Đai Ngọc / Bao
            </button>
            <button
              onClick={() => { setMacroFocus('back'); setCurrentAngle(180); }}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                macroFocus === 'back' ? 'bg-amber-500 text-stone-950 font-bold shadow-xs' : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Sống Lưng
            </button>
          </div>
        </div>

        {/* Discrete Angle Presets */}
        <div className="flex items-center justify-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200/90 shadow-md pointer-events-auto">
          <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider pr-1 border-r border-stone-300">
            Góc Phối Cảnh:
          </span>
          <button
            onClick={() => { setCurrentAngle(0); setPedestalAngle(0); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              currentAngle === 0 ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            Trước 0°
          </button>
          <button
            onClick={() => { setCurrentAngle(45); setPedestalAngle(45); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              currentAngle === 45 ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            Nghiêng 45°
          </button>
          <button
            onClick={() => { setCurrentAngle(180); setPedestalAngle(180); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              currentAngle === 180 ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            Sau Lưng 180°
          </button>
          <button
            onClick={() => { setCurrentAngle(-45); setPedestalAngle(-45); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              currentAngle === -45 ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            Nẹp Phải -45°
          </button>
        </div>
      </div>
    </div>
  );
};
