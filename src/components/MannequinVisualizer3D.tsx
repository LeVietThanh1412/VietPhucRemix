import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { Bot, Sparkles, RotateCw, ZoomIn, ZoomOut, Check, Compass, Eye, Sun, Moon, Flame } from 'lucide-react';

export type LightingMode = 'studio' | 'sunset' | 'lantern' | 'moonlight';

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
  const uid = 'vp3d' + React.useId().replace(/[^a-zA-Z0-9]/g, '') + '-';

  const isMale = config.modelGender === 'male';
  const isFemale = config.modelGender === 'female';

  // 3D Orbit & Perspective State
  const [rotationY, setRotationY] = useState(0); // in degrees: -180 to 180
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartAngle, setDragStartAngle] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [lightingMode, setLightingMode] = useState<LightingMode>('sunset');
  const [focusedElement, setFocusedElement] = useState<'collar' | 'sleeves' | 'belt' | 'back' | 'pattern' | null>(null);
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Helper colors
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

  // Handle AI Directives
  useEffect(() => {
    if (!aiDirective) return;
    if (aiDirective.type === 'rotate') {
      const targetAngle = Number(aiDirective.value) || 0;
      setRotationY(targetAngle);
      if (aiDirective.message) setActiveSpeech(aiDirective.message);
    } else if (aiDirective.type === 'lighting') {
      setLightingMode(aiDirective.value);
      if (aiDirective.message) setActiveSpeech(aiDirective.message);
    } else if (aiDirective.type === 'focus') {
      setFocusedElement(aiDirective.value);
      if (aiDirective.message) setActiveSpeech(aiDirective.message);
    } else if (aiDirective.type === 'pose') {
      if (aiDirective.value === 'cung-dinh') {
        setRotationY(35);
        setLightingMode('sunset');
        setFocusedElement('sleeves');
      } else if (aiDirective.value === 'si-tu') {
        setRotationY(-25);
        setLightingMode('lantern');
        setFocusedElement('collar');
      } else if (aiDirective.value === 'kinh-bac') {
        setRotationY(180);
        setLightingMode('moonlight');
        setFocusedElement('back');
      }
      if (aiDirective.message) setActiveSpeech(aiDirective.message);
    }
  }, [aiDirective]);

  // Auto rotation loop
  useEffect(() => {
    if (!isAutoRotating) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }
    const step = () => {
      setRotationY(prev => {
        const next = (prev + 0.6) % 360;
        return next > 180 ? next - 360 : next;
      });
      animFrameRef.current = requestAnimationFrame(step);
    };
    animFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoRotating]);

  // Pointer drag to orbit
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setDragStartX(e.clientX);
    setDragStartAngle(rotationY);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    // 1px delta = 0.65 degrees rotation
    let newAngle = (dragStartAngle + deltaX * 0.65) % 360;
    if (newAngle > 180) newAngle -= 360;
    if (newAngle < -180) newAngle += 360;
    setRotationY(Math.round(newAngle));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  // Normalized angle from 0 to 360
  const normalizedAngle = ((rotationY % 360) + 360) % 360;
  // Determine if viewing back: between 110 deg and 250 deg
  const isBackView = normalizedAngle >= 110 && normalizedAngle <= 250;
  // Determine if viewing 3/4 angle
  const isProfileView = (normalizedAngle >= 55 && normalizedAngle < 110) || (normalizedAngle > 250 && normalizedAngle <= 305);

  // Lighting overlay styling
  const lightingBg = {
    studio: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.25) 0%, rgba(0,0,0,0.05) 80%)',
    sunset: 'radial-gradient(circle at 75% 25%, rgba(245, 158, 11, 0.35) 0%, rgba(180, 83, 9, 0.15) 50%, rgba(15, 23, 42, 0.4) 100%)',
    lantern: 'radial-gradient(circle at 25% 45%, rgba(239, 68, 68, 0.35) 0%, rgba(245, 158, 11, 0.2) 50%, rgba(24, 16, 36, 0.5) 100%)',
    moonlight: 'radial-gradient(circle at 50% 15%, rgba(186, 230, 253, 0.35) 0%, rgba(30, 58, 138, 0.2) 60%, rgba(15, 23, 42, 0.55) 100%)'
  }[lightingMode];

  // Dynamic ground shadow transformation based on rotation angle and lighting
  const shadowScaleX = 1 + Math.abs(Math.sin((rotationY * Math.PI) / 180)) * 0.25;
  const shadowSkew = Math.sin((rotationY * Math.PI) / 180) * 15;

  return (
    <div className={`relative w-full aspect-[3/4] max-w-[540px] mx-auto overflow-hidden rounded-2xl shadow-xl border border-stone-200/90 bg-[#FAF7F2] transition-all duration-300 select-none ${className}`}>
      {/* 1. Ambient 3D Atmosphere & Lighting Filter */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-700 z-10"
        style={{ background: lightingBg }}
      />

      {/* 2. Top Bar: 3D Mode Indicator & Quick Angle Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-medium border border-white/20 shadow-xs pointer-events-auto">
          <IconViet3D size={14} className="text-amber-400" />
          <span className="font-semibold tracking-wide">3D STUDIO</span>
          <span className="text-stone-300 font-mono text-[10px] pl-1 border-l border-white/20">
            {Math.round(rotationY)}° {isBackView ? 'Mặt Sau' : isProfileView ? 'Góc Nghiêng' : 'Mặt Trước'}
          </span>
        </div>

        {/* Lighting Selector Dropdown Pill */}
        <div className="flex items-center gap-1 bg-white/85 backdrop-blur-md p-1 rounded-xl border border-stone-200/90 shadow-2xs pointer-events-auto">
          <button
            onClick={() => setLightingMode('sunset')}
            className={`p-1.5 rounded-lg transition-colors ${lightingMode === 'sunset' ? 'bg-amber-100 text-amber-900 shadow-2xs' : 'text-stone-600 hover:bg-stone-100'}`}
            title="Ánh hoàng hôn Cố Đô (Ấm áp, tôn tà áo)"
          >
            <Sun className="w-3.5 h-3.5 text-amber-600" />
          </button>
          <button
            onClick={() => setLightingMode('lantern')}
            className={`p-1.5 rounded-lg transition-colors ${lightingMode === 'lantern' ? 'bg-rose-100 text-rose-900 shadow-2xs' : 'text-stone-600 hover:bg-stone-100'}`}
            title="Đèn lồng Phố Cổ (Lung linh huyền ảo)"
          >
            <Flame className="w-3.5 h-3.5 text-rose-600" />
          </button>
          <button
            onClick={() => setLightingMode('moonlight')}
            className={`p-1.5 rounded-lg transition-colors ${lightingMode === 'moonlight' ? 'bg-sky-100 text-sky-900 shadow-2xs' : 'text-stone-600 hover:bg-stone-100'}`}
            title="Ánh trăng rằm Thăng Long (Thanh tao)"
          >
            <Moon className="w-3.5 h-3.5 text-sky-600" />
          </button>
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
              isAutoRotating ? 'bg-emerald-100 text-emerald-900' : 'text-stone-700 hover:bg-stone-100'
            }`}
            title="Bật/Tắt xoay 360 độ tự động"
          >
            <IconVietOrbit size={14} className={isAutoRotating ? 'animate-spin' : ''} />
            <span className="text-[10px]">{isAutoRotating ? 'Dừng' : 'Xoay 360°'}</span>
          </button>
        </div>
      </div>

      {/* 3. AI Stylist Interactive Speech Bubble on 3D Stage */}
      {activeSpeech && (
        <div className="absolute top-14 left-3 right-3 z-30 animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-auto">
          <div className="bg-stone-900/90 backdrop-blur-md text-white p-3 rounded-xl border border-amber-500/40 shadow-lg flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">AI Stylist Tương Tác 3D</span>
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

      {/* 4. Interactive 3D Orbit Stage Canvas */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full cursor-grab active:cursor-grabbing relative flex items-center justify-center touch-none"
        style={{ perspective: '1100px' }}
      >
        {/* 3D Rotating Mannequin Wrapper with 3D Transform */}
        <div
          className="w-full h-full relative transition-transform ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotationY}deg)`,
            transitionDuration: isDragging ? '0ms' : '220ms'
          }}
        >
          {/* SVG Mannequin Projection */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={isZoomed ? "110 90 380 480" : "0 0 600 800"}
            className="w-full h-full object-contain select-none"
            aria-label="Minh họa 3D Việt Phục"
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

              <linearGradient id={`${uid}silk-sheen`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.2" />
                <stop offset="30%" stopColor="#ffffff" stopOpacity="0.14" />
                <stop offset="70%" stopColor="#ffffff" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
              </linearGradient>

              {/* Pattern: Hoa Cúc Dây Thời Lý */}
              <pattern id={`${uid}pattern-cuc-day-ly`} width="54" height="54" patternUnits="userSpaceOnUse">
                <path d="M 0 27 C 14 9, 40 45, 54 27" fill="none" stroke={isDarkGarment ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.18)'} strokeWidth="1.5" />
                <circle cx="27" cy="27" r="3.5" fill="none" stroke={isDarkGarment ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.22)'} strokeWidth="1.3" />
                <circle cx="27" cy="27" r="1.5" fill={isDarkGarment ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.16)'} />
              </pattern>

              {/* Pattern: Rồng Thời Trần */}
              <pattern id={`${uid}pattern-rong-thoi-tran`} width="68" height="68" patternUnits="userSpaceOnUse">
                <path d="M 6 50 C 15 26, 30 58, 46 28 C 54 14, 62 22, 60 36" fill="none" stroke={isDarkGarment ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.2)'} strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 16 34 L 20 28 L 24 36 L 30 30 L 34 40" fill="none" stroke={isDarkGarment ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.22)'} strokeWidth="1.3" />
              </pattern>

              {/* Pattern: Hạc Mây Thời Lê Sơ */}
              <pattern id={`${uid}pattern-hac-may-le`} width="62" height="62" patternUnits="userSpaceOnUse">
                <path d="M 31 33 C 29 25 33 19 37 15 C 38 14 41 15 40 17 Z" fill={isDarkGarment ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)'} stroke={isDarkGarment ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.22)'} strokeWidth="1.1" />
                <path d="M 32 25 C 21 19 11 23 5 31" fill="none" stroke={isDarkGarment ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'} strokeWidth="1.2" />
              </pattern>

              {/* Bronze Drum Rotating Pedestal Gradient */}
              <radialGradient id={`${uid}pedestal-grad`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FEF3C7" />
                <stop offset="40%" stopColor="#F59E0B" />
                <stop offset="85%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#451A03" />
              </radialGradient>
            </defs>

            {/* 3D ROTATING LOTUS PEDESTAL (Bệ Quay Bát Giác Hoa Sen) */}
            <g id="turntable-pedestal" transform="translate(300, 715)">
              {/* Outer Base Drop Shadow */}
              <ellipse cx="0" cy="8" rx={140 * shadowScaleX} ry="26" fill="rgba(0,0,0,0.25)" filter="blur(6px)" />
              {/* Wooden / Bronze Pedestal Rim */}
              <ellipse cx="0" cy="0" rx="145" ry="32" fill={`url(#${uid}pedestal-grad)`} stroke="#78350F" strokeWidth="2.5" />
              <ellipse cx="0" cy="0" rx="135" ry="28" fill="#1C1917" stroke="#92400E" strokeWidth="1.2" />
              <ellipse cx="0" cy="0" rx="122" ry="24" fill={`url(#${uid}pedestal-grad)`} opacity="0.4" />
              {/* Lotus Petals & Rotating Radial Markers */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
                const rad = ((deg + rotationY) * Math.PI) / 180;
                const px = Math.cos(rad) * 115;
                const py = Math.sin(rad) * 20;
                return (
                  <circle key={i} cx={px} cy={py} r="2.8" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
                );
              })}
            </g>

            {/* ========================================================= */}
            {/* VIEW A: FRONT VIEW (0° - 60° and -60° to 0°)              */}
            {/* ========================================================= */}
            {!isBackView && (
              <g id="mannequin-front-projection" className="transition-opacity duration-300">
                {/* 1. Torso & Arms Base */}
                <path d="M280 205 L280 255 L320 255 L320 205 Z" fill={`url(#${uid}skin-${isMale ? 'male' : 'female'})`} stroke="#C2947F" strokeWidth="0.8" />

                {/* Head */}
                <ellipse cx="300" cy="180" rx="34" ry="46" fill={`url(#${uid}skin-${isMale ? 'male' : 'female'})`} stroke="#C2947F" strokeWidth="0.8" />
                {/* Face details */}
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
                {config.headwearId === 'non-la' && (
                  <path d="M300 105 L230 155 L370 155 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
                )}
                {config.headwearId === 'non-quai-thao' && (
                  <ellipse cx="300" cy="145" rx="55" ry="14" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" />
                )}

                {/* Lower Garment (Quần lụa / Váy) */}
                <path d="M255 450 L345 450 L360 680 L310 680 L300 480 L290 680 L240 680 Z" fill={bottomFill} stroke={bottomStroke} strokeWidth="1.5" />

                {/* UPPER GARMENTS (FRONT) */}
                {config.garmentId === 'ao-vien-linh' && (
                  <g id="3d-front-ao-vien-linh">
                    {/* Wide Ly-Tran Sleeves */}
                    <path d="M238 255 L118 335 C 102 445, 145 545, 202 562 L234 445 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    <path d="M362 255 L482 335 C 498 445, 455 545, 398 562 L366 445 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    {/* Main Body */}
                    <path d="M238 250 L362 250 L378 572 Q 300 588 222 572 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    {config.patternId !== 'plain-silk' && (
                      <path d="M238 250 L362 250 L378 572 Q 300 588 222 572 Z" fill={`url(#${uid}pattern-${config.patternId})`} opacity="0.8" />
                    )}
                    <path d="M238 250 L362 250 L378 572 Q 300 588 222 572 Z" fill={`url(#${uid}silk-sheen)`} />
                    {/* Round Collar Viên Lĩnh */}
                    <path d="M278 236 C 278 260, 322 260, 322 236 L 318 236 C 318 256, 282 256, 282 236 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    <path d="M279 236 C 279 258, 321 258, 321 236" fill="none" stroke="#FAF7EE" strokeWidth="2.2" />
                    <path d="M318 244 Q 334 260 346 288" stroke={strokeColor} strokeWidth="1.6" fill="none" />
                    {/* Jade Belt Lý - Trần */}
                    <rect x="248" y="354" width="104" height="18" rx="2.5" fill="#1C1917" stroke="#44403C" strokeWidth="1.2" />
                    {[256, 272, 318, 334].map((px, idx) => (
                      <rect key={idx} x={px} y="357" width="11" height="12" rx="1.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
                    ))}
                    <rect x="290" y="351" width="20" height="24" rx="3.5" fill="#D97706" stroke="#78350F" strokeWidth="1.2" />
                    <circle cx="300" cy="363" r="6" fill="#FCD34D" stroke="#B45309" strokeWidth="0.8" />
                    {/* Trailing Ribbons */}
                    <path d="M296 375 L292 485 L300 485 L299 375 Z" fill="#991B1B" />
                    <path d="M301 375 L305 480 L311 480 L304 375 Z" fill="#D97706" />
                  </g>
                )}

                {config.garmentId === 'ao-tac' && (
                  <g id="3d-front-ao-tac">
                    <path d="M238 255 L125 330 C 110 435, 145 540, 195 560 L230 450 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    <path d="M362 255 L475 330 C 490 435, 455 540, 405 560 L370 450 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    <path d="M238 252 L362 252 L375 570 Q 300 585 225 570 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    <path d="M284 238 L316 238 L318 255 L282 255 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    {[258, 286, 318, 354, 396].map((y, idx) => (
                      <circle key={idx} cx="310" cy={y} r="3.6" fill="#FBBF24" stroke="#78350F" strokeWidth="0.8" />
                    ))}
                  </g>
                )}

                {config.garmentId === 'ao-giao-linh' && (
                  <g id="3d-front-ao-giao-linh">
                    <path d="M240 255 L150 355 L198 470 L238 415 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    <path d="M360 255 L450 355 L402 470 L362 415 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    <path d="M242 250 L358 250 L370 555 Q 300 570 230 555 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    {/* Vạt chéo Giao Lĩnh */}
                    <path d="M270 240 L332 355 L315 355 L256 248 Z" fill="#FDFBF7" stroke="#D1D5DB" strokeWidth="1.5" />
                    <path d="M330 240 L268 355 L285 355 L344 248 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    <rect x="256" y="350" width="88" height="20" rx="2" fill="#292524" />
                  </g>
                )}

                {config.garmentId === 'ao-tu-than' && (
                  <g id="3d-front-ao-tu-than">
                    <path d="M252 252 L348 252 L366 565 Q 300 578 234 565 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    <path d="M 284 246 C 265 285, 262 335, 270 354 L 330 354 C 338 335, 335 285, 316 246 Z" fill="#E11D48" stroke="#9F1239" strokeWidth="1.2" />
                    <rect x="262" y="348" width="76" height="18" rx="3" fill="#059669" />
                    <path d="M 293 364 C 286 415, 282 460, 286 505 L 297 503 Z" fill="#F43F5E" />
                    <path d="M 300 364 C 304 415, 316 460, 312 518 L 323 516 Z" fill="#F59E0B" />
                  </g>
                )}

                {/* Default fallback for other garments */}
                {!['ao-vien-linh', 'ao-tac', 'ao-giao-linh', 'ao-tu-than'].includes(config.garmentId) && (
                  <g id="3d-front-generic-robe">
                    <path d="M242 250 L358 250 L368 545 Q 300 555 232 545 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    <path d="M284 238 L316 238 L318 254 L282 254 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    {[256, 280, 310, 346].map((y, i) => (
                      <circle key={i} cx="316" cy={y} r="3" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                    ))}
                  </g>
                )}
              </g>
            )}

            {/* ========================================================= */}
            {/* VIEW B: BACK VIEW (110° to 250°)                           */}
            {/* ========================================================= */}
            {isBackView && (
              <g id="mannequin-back-projection" className="transition-opacity duration-300">
                {/* Back Neck & Hair Bun */}
                <path d="M280 205 L280 255 L320 255 L320 205 Z" fill={`url(#${uid}skin-${isMale ? 'male' : 'female'})`} stroke="#C2947F" strokeWidth="0.8" />
                <ellipse cx="300" cy="175" rx="34" ry="44" fill="#1C1917" stroke="#3D291F" strokeWidth="1" />
                
                {/* Back Bun / Topknot */}
                {isMale ? (
                  <ellipse cx="300" cy="140" rx="16" ry="14" fill="#0C0A09" stroke="#78350F" strokeWidth="1.2" />
                ) : (
                  <g id="female-back-chignon">
                    <ellipse cx="300" cy="185" rx="20" ry="15" fill="#0C0A09" stroke="#78350F" strokeWidth="1.2" />
                    {/* Jade Hairpin Trâm Cài Ngọc */}
                    <line x1="270" y1="180" x2="330" y2="190" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="330" cy="190" r="3.5" fill="#A7F3D0" stroke="#059669" strokeWidth="0.8" />
                  </g>
                )}

                {/* Khăn Vấn từ phía sau gáy */}
                {config.headwearId === 'khan-van' && (
                  <g id="back-khan-van">
                    <ellipse cx="300" cy="155" rx="38" ry="18" fill="#1C1917" stroke="#44403C" strokeWidth="1.5" />
                    <line x1="262" y1="155" x2="338" y2="155" stroke="#78716C" strokeWidth="1.2" opacity="0.6" />
                  </g>
                )}

                {/* Lower Garment (Tà Quần Lụa Sau) */}
                <path d="M255 450 L345 450 L360 680 L310 680 L300 480 L290 680 L240 680 Z" fill={bottomFill} stroke={bottomStroke} strokeWidth="1.5" />

                {/* BACK GARMENT DETAILS BY FORM */}
                {/* 1. Áo Tứ Thân Mặt Sau: Sống Lưng Ghép Đôi Kinh Điển */}
                {config.garmentId === 'ao-tu-than' && (
                  <g id="3d-back-ao-tu-than">
                    <path d="M252 250 L348 250 L366 565 Q 300 578 234 565 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    {/* Cột mốc di sản: Đường sống lưng áo Tứ Thân */}
                    <line x1="300" y1="250" x2="300" y2="570" stroke={isDarkGarment ? '#FFFFFF' : '#78350F'} strokeWidth="2" strokeDasharray="3,1" />
                    {/* Dây buộc cổ yếm thắt sau gáy */}
                    <circle cx="300" cy="245" r="4.5" fill="#FFFDF8" stroke="#D1D5DB" strokeWidth="1" />
                    <path d="M298 245 L294 265 M302 245 L306 265" stroke="#FFFDF8" strokeWidth="2" />
                    {/* Dải thắt lưng ruột tượng xanh ôm vòng qua hông */}
                    <rect x="256" y="348" width="88" height="18" rx="2" fill="#047857" stroke="#065F46" strokeWidth="1.2" />
                  </g>
                )}

                {/* 2. Áo Viên Lĩnh Mặt Sau: Trường Bào & Đai Ngọc Thời Trần */}
                {config.garmentId === 'ao-vien-linh' && (
                  <g id="3d-back-ao-vien-linh">
                    {/* Wide Sleeves back */}
                    <path d="M238 255 L118 335 C 102 445, 145 545, 202 562 L234 445 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    <path d="M362 255 L482 335 C 498 445, 455 545, 398 562 L366 445 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    {/* Thân Sau Trường Bào */}
                    <path d="M238 250 L362 250 L378 572 Q 300 588 222 572 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    {config.patternId !== 'plain-silk' && (
                      <path d="M238 250 L362 250 L378 572 Q 300 588 222 572 Z" fill={`url(#${uid}pattern-${config.patternId})`} opacity="0.8" />
                    )}
                    {/* Viền cổ tròn sau gáy */}
                    <path d="M280 236 C 280 250, 320 250, 320 236 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    {/* Đai ngọc chạy đều qua thắt lưng sau */}
                    <rect x="246" y="354" width="108" height="18" rx="2.5" fill="#1C1917" stroke="#44403C" strokeWidth="1.2" />
                    {[254, 274, 294, 314, 334].map((px, idx) => (
                      <rect key={idx} x={px} y="357" width="12" height="12" rx="1.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
                    ))}
                    {/* Đường may sống lưng chính trực */}
                    <line x1="300" y1="250" x2="300" y2="575" stroke={strokeColor} strokeWidth="1.5" opacity="0.75" />
                  </g>
                )}

                {/* 3. Các loại áo khác nhìn từ mặt sau (Áo Tấc, Ngũ Thân, Giao Lĩnh, Nhật Bình) */}
                {config.garmentId !== 'ao-tu-than' && config.garmentId !== 'ao-vien-linh' && (
                  <g id="3d-back-generic-robe">
                    <path d="M238 250 L362 250 L372 565 Q 300 580 228 565 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                    {config.patternId !== 'plain-silk' && (
                      <path d="M238 250 L362 250 L372 565 Q 300 580 228 565 Z" fill={`url(#${uid}pattern-${config.patternId})`} opacity="0.8" />
                    )}
                    {/* Sống lưng chuẩn mực */}
                    <line x1="300" y1="250" x2="300" y2="570" stroke={strokeColor} strokeWidth="1.8" />
                    {/* Nẹp cổ sau */}
                    <path d="M284 238 L316 238 L318 252 L282 252 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  </g>
                )}
              </g>
            )}

            {/* AI Focus Beacon Effect */}
            {focusedElement && (
              <g id="ai-focus-beacon" className="animate-pulse">
                {focusedElement === 'collar' && <circle cx="300" cy="245" r="30" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 2" />}
                {focusedElement === 'belt' && <rect x="240" y="345" width="120" height="35" rx="8" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 2" />}
                {focusedElement === 'back' && <line x1="300" y1="250" x2="300" y2="570" stroke="#F59E0B" strokeWidth="3.5" strokeDasharray="6 3" />}
                {focusedElement === 'sleeves' && (
                  <>
                    <circle cx="170" cy="380" r="38" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 2" />
                    <circle cx="430" cy="380" r="38" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 2" />
                  </>
                )}
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* 5. Bottom Interactive Controls: Preset Angles & Orbit Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-1.5 z-30">
        {/* Preset Angle Buttons */}
        <div className="flex items-center gap-1 bg-stone-900/85 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-md">
          <button
            onClick={() => setRotationY(0)}
            className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all ${
              Math.abs(rotationY) < 15 ? 'bg-amber-500 text-stone-950 font-bold shadow-2xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            Trước (0°)
          </button>
          <button
            onClick={() => setRotationY(45)}
            className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all ${
              rotationY >= 30 && rotationY <= 65 ? 'bg-amber-500 text-stone-950 font-bold shadow-2xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            Nghiêng (45°)
          </button>
          <button
            onClick={() => setRotationY(180)}
            className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all ${
              isBackView ? 'bg-amber-500 text-stone-950 font-bold shadow-2xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            Lưng (180°)
          </button>
          <button
            onClick={() => setRotationY(-45)}
            className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all ${
              rotationY <= -30 && rotationY >= -65 ? 'bg-amber-500 text-stone-950 font-bold shadow-2xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            Nghiêng Trái (-45°)
          </button>
        </div>

        {/* Drag Hint / Focus Toggle */}
        <div className="hidden sm:flex items-center gap-1 bg-white/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-stone-200 text-[10px] text-stone-600 font-medium shadow-2xs">
          <IconVietOrbit size={13} className="text-amber-800" />
          <span>Kéo chuột / chạm để xoay 360°</span>
        </div>
      </div>
    </div>
  );
};
