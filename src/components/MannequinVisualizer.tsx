import React from 'react';
import { OutfitConfig } from '../types/vietphuc';
import { HERITAGE_COLORS, GARMENTS } from '../data/heritageData';
import { BackdropDefs, BackdropScene } from './Backdrops';

interface MannequinVisualizerProps {
  config: OutfitConfig;
  className?: string;
  isZoomed?: boolean;
  /** Hide the HTML overlay badge (e.g. for compact thumbnails) */
  hideBadge?: boolean;
  svgRef?: React.Ref<SVGSVGElement>;
}

export const MannequinVisualizer: React.FC<MannequinVisualizerProps> = ({
  config,
  className = '',
  isZoomed = false,
  hideBadge = false,
  svgRef
}) => {
  const selectedColor = HERITAGE_COLORS.find(c => c.id === config.colorId) || HERITAGE_COLORS[0];
  const selectedGarment = GARMENTS.find(g => g.id === config.garmentId) || GARMENTS[0];
  // Unique prefix so several mannequins on one page don't share <defs> ids
  const uid = 'vp' + React.useId().replace(/[^a-zA-Z0-9]/g, '') + '-';

  const isMale = config.modelGender === 'male';
  const isFemale = config.modelGender === 'female';

  // Helper colors - Avatar Generator dynamic hex support
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

  // Layer Visibility (Avatar Generator Stacking Pipeline)
  const showBackdrop = config.layerVisibility?.backdrop !== false;
  const showBody = config.layerVisibility?.body !== false;
  const showBottom = config.layerVisibility?.bottom !== false;
  const showFootwear = config.layerVisibility?.footwear !== false;
  const showGarment = config.layerVisibility?.garment !== false;
  const showAccessories = config.layerVisibility?.accessories !== false;
  const showHeadwear = config.layerVisibility?.headwear !== false;

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

  return (
    <div className={`relative w-full aspect-[3/4] max-w-[540px] mx-auto overflow-hidden rounded-2xl shadow-xl border border-stone-200/80 bg-[#FAF7F2] transition-all duration-300 ${className}`}>
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={isZoomed ? "110 90 380 480" : "0 0 600 800"}
        className="w-full h-full object-contain select-none"
        aria-label="Minh họa phối trang phục Việt Phục Remix"
      >
        <defs>
          {/* Rich Backdrop Scene Gradients & Patterns */}
          <BackdropDefs uid={uid} />

          {/* Skin Shading Gradients */}
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

          {/* Garment Silk Shading Gradient */}
          <linearGradient id={`${uid}silk-sheen`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.2" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.24" />
          </linearGradient>

          {/* Pattern: Vân Mây Ngũ Sắc */}
          <pattern id={`${uid}pattern-van-may`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 5 25 Q 15 10 25 25 Q 35 15 38 28 Q 20 35 5 25 Z"
              fill="none"
              stroke={isDarkGarment ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.14)'}
              strokeWidth="1.2"
            />
            <circle cx="20" cy="18" r="3" fill="none" stroke={isDarkGarment ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)'} strokeWidth="0.8" />
          </pattern>

          {/* Pattern: Hoa Sen Lý - Trần */}
          <pattern id={`${uid}pattern-hoa-sen`} width="50" height="50" patternUnits="userSpaceOnUse">
            <path
              d="M25 15 C20 22 20 28 25 35 C30 28 30 22 25 15 Z"
              fill={isDarkGarment ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.1)'}
            />
            <path
              d="M18 20 C14 26 16 31 23 34 C19 28 19 23 18 20 Z"
              fill={isDarkGarment ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.07)'}
            />
            <path
              d="M32 20 C36 26 34 31 27 34 C31 28 31 23 32 20 Z"
              fill={isDarkGarment ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.07)'}
            />
          </pattern>

          {/* Pattern: Bát Bửu Cát Tường */}
          <pattern id={`${uid}pattern-bat-buu`} width="45" height="45" patternUnits="userSpaceOnUse">
            <circle cx="22.5" cy="22.5" r="9" fill="none" stroke={isDarkGarment ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.12)'} strokeWidth="1" />
            <path d="M15 22.5 L30 22.5 M22.5 15 L22.5 30" stroke={isDarkGarment ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.12)'} strokeWidth="1" />
          </pattern>

          {/* Pattern: Chữ Thọ */}
          <pattern id={`${uid}pattern-chu-tho`} width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="14" fill="none" stroke={isDarkGarment ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.12)'} strokeWidth="1.2" />
            <path d="M17 21 L33 21 M17 25 L33 25 M17 29 L33 29 M25 15 L25 35" stroke={isDarkGarment ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.12)'} strokeWidth="1" />
          </pattern>

          {/* Pattern: Chu Đậu */}
          <pattern id={`${uid}pattern-chu-dau`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 0 20 Q 10 10 20 20 T 40 20" fill="none" stroke={isDarkGarment ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.12)'} strokeWidth="1.2" />
            <path d="M 0 26 Q 10 16 20 26 T 40 26" fill="none" stroke={isDarkGarment ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.07)'} strokeWidth="1" />
          </pattern>

          {/* Silver Chrome Gradient (Kiềng Bạc Chạm Hoa Mai) */}
          <linearGradient id={`${uid}silver-kieng`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="25%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="75%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>

          {/* Natural Wood Grain (Guốc Mộc Truyền Thống) */}
          <linearGradient id={`${uid}wood-clog`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="35%" stopColor="#B45309" />
            <stop offset="70%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>

          {/* Dó Paper Vermilion (Quạt Giấy Dó In Thơ Nôm) */}
          <linearGradient id={`${uid}fan-paper`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="45%" stopColor="#DC2626" />
            <stop offset="80%" stopColor="#B91C1C" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </linearGradient>

          {/* Burnished Leather (Giày Oxford Cổ Điển) */}
          <linearGradient id={`${uid}oxford-leather`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5C260D" />
            <stop offset="40%" stopColor="#3E1A0A" />
            <stop offset="85%" stopColor="#271006" />
            <stop offset="100%" stopColor="#140702" />
          </linearGradient>
        </defs>

        {/* 1. Backdrop Rendering */}
        {showBackdrop && <BackdropScene backdrop={config.backdrop} uid={uid} />}

        {/* Soft Realistic Ground Shadow */}
        {showBackdrop && (
          <>
            <ellipse cx="300" cy="742" rx="145" ry="18" fill="#1C1917" opacity="0.18" />
            <ellipse cx="300" cy="742" rx="90" ry="10" fill="#1C1917" opacity="0.12" />
          </>
        )}

        {/* 2. Model Body Silhouette & Anatomical Features (Nam / Nữ / Unisex) */}
        {showBody && (
          <g id="model-body">
          {/* NECK */}
          {isMale ? (
            /* Male Neck: Sturdy, upright, muscular */
            <path d="M282 208 L280 255 L320 255 L318 208 Z" fill={`url(#${uid}skin-male)`} stroke="#C2947F" strokeWidth="0.8" />
          ) : (
            /* Female/Unisex Neck: Slender, graceful "cổ kiêu ba ngấn" */
            <path d="M287 205 C 286 225 283 245 281 254 L 319 254 C 317 245 314 225 313 205 Z" fill={`url(#${uid}skin-female)`} stroke="#D4A895" strokeWidth="0.8" />
          )}

          {/* FACE OVAL & JAWLINE */}
          {isMale ? (
            /* Male Head: Square jaw, structured contours */
            <g id="male-head">
              <path
                d="M266 162 C 265 132, 335 132, 334 162 L 332 195 Q 328 224 300 227 Q 272 224 268 195 Z"
                fill={`url(#${uid}skin-male)`}
                stroke="#C2947F"
                strokeWidth="0.8"
              />
              {/* Male Eyebrows: Strong sword brows (Lông mày kiếm) */}
              <path d="M272 168 L 294 165" stroke="#261A14" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M306 165 L 328 168" stroke="#261A14" strokeWidth="2.8" strokeLinecap="round" />

              {/* Eyes: Resolute, confident */}
              <path d="M275 177 Q 285 173 294 177" stroke="#1C1917" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <circle cx="284" cy="177" r="1.8" fill="#1C1917" />
              <path d="M306 177 Q 315 173 325 177" stroke="#1C1917" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <circle cx="316" cy="177" r="1.8" fill="#1C1917" />

              {/* Nose: Straight, defined bridge */}
              <path d="M300 172 L 300 190 L 306 192" stroke="#B8866E" strokeWidth="1.5" fill="none" strokeLinecap="round" />

              {/* Lips: Natural, firm, dignified */}
              <path d="M290 204 Q 300 206 310 204" stroke="#9A3412" strokeWidth="2.2" fill="none" strokeLinecap="round" />

              {/* Ears */}
              <ellipse cx="264" cy="184" rx="4.5" ry="11" fill="#DEB19A" stroke="#C2947F" strokeWidth="0.7" />
              <ellipse cx="336" cy="184" rx="4.5" ry="11" fill="#DEB19A" stroke="#C2947F" strokeWidth="0.7" />

              {/* Male Hair: Traditional Vietnamese Topknot (Búi tó / Búi củ hành) or neat masculine cut */}
              {config.headwearId === 'none' && (
                <g id="male-hair">
                  {/* Topknot bun on crown */}
                  <ellipse cx="300" cy="132" rx="14" ry="12" fill="#1C1917" />
                  <rect x="292" y="138" width="16" height="5" rx="1.5" fill="#B45309" stroke="#78350F" strokeWidth="0.8" />
                  {/* Clean masculine hairline and sideburns */}
                  <path
                    d="M264 170 C 263 138, 337 138, 336 170 C 330 148, 270 148, 264 170 Z"
                    fill="#1C1917"
                  />
                  <path d="M265 170 L 267 186 L 270 182" fill="#1C1917" />
                  <path d="M335 170 L 333 186 L 330 182" fill="#1C1917" />
                </g>
              )}
            </g>
          ) : (
            /* Female/Unisex Head: Graceful oval, delicate facial contours */
            <g id="female-head">
              <path
                d="M268 165 C 267 132, 333 132, 332 165 C 332 198, 318 222, 300 225 C 282 222, 268 198, 268 165 Z"
                fill={`url(#${uid}skin-female)`}
                stroke="#D4A895"
                strokeWidth="0.8"
              />
              {/* Eyebrows: Soft willow-leaf arch (Lông mày lá liễu) */}
              <path d="M274 167 Q 286 163 294 167" stroke="#3D291F" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d="M306 167 Q 314 163 326 167" stroke="#3D291F" strokeWidth="1.8" fill="none" strokeLinecap="round" />

              {/* Eyes: Gentle phoenix eyes with soft double lids */}
              <path d="M276 175 Q 286 170 294 175" stroke="#1F1612" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <circle cx="285" cy="176" r="1.8" fill="#1F1612" />
              <path d="M306 175 Q 314 170 324 175" stroke="#1F1612" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <circle cx="315" cy="176" r="1.8" fill="#1F1612" />

              {/* Nose: Slender, gentle curve */}
              <path d="M300 173 L 300 189 L 305 191" stroke="#C49782" strokeWidth="1.3" fill="none" strokeLinecap="round" />

              {/* Lips: Rosy petal lips with soft Cupid's bow */}
              <path d="M291 202 Q 300 206 309 202" stroke="#BE123C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M294 202 Q 300 200 306 202" stroke="#E11D48" strokeWidth="1" fill="none" strokeLinecap="round" />

              {/* Ears & Pearl Earring */}
              <ellipse cx="265" cy="182" rx="4" ry="9" fill="#F4D3C2" />
              <ellipse cx="335" cy="182" rx="4" ry="9" fill="#F4D3C2" />
              {isFemale && (
                <>
                  {/* Left pearl drop earring with gold stud */}
                  <circle cx="265" cy="190" r="1.2" fill="#D97706" />
                  <circle cx="265" cy="194" r="3" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.6" />
                  {/* Right pearl drop earring with gold stud */}
                  <circle cx="335" cy="190" r="1.2" fill="#D97706" />
                  <circle cx="335" cy="194" r="3" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.6" />
                </>
              )}

              {/* Female Hair: Royal Low Bun & Soft Tendril (Búi tóc cung đình đoan trang) */}
              {config.headwearId === 'none' && (
                <g id="female-hair">
                  {/* Main Hair Dome & Sleek Center Parting */}
                  <path
                    d="M265 172 C 260 130, 340 130, 335 172 C 342 215, 335 255, 330 255 L 324 245 C 330 215, 330 165, 300 148 C 270 165, 270 215, 276 245 L 270 255 C 265 255, 258 215, 265 172 Z"
                    fill="#181311"
                  />
                  {/* Low Elegant Chignon Bun */}
                  <ellipse cx="300" cy="136" rx="20" ry="12" fill="#181311" />
                  <ellipse cx="300" cy="134" rx="14" ry="8" fill="#29201C" />
                  {/* Soft side lock curving delicately beside ear */}
                  <path d="M266 182 Q 268 205 272 215" stroke="#181311" strokeWidth="1.2" fill="none" />
                  <path d="M334 182 Q 332 205 328 215" stroke="#181311" strokeWidth="1.2" fill="none" />
                </g>
              )}
            </g>
          )}
        </g>
        )}

        {/* 3. Lower Garment (Quần lụa / Váy đi kèm) */}
        {showBottom && (
          <g id="bottom-garment">
          {config.bottomId === 'vay-xep-ly' ? (
            /* Chân váy xếp ly dài uyển chuyển */
            <g>
              <path
                d="M245 420 L220 675 Q 300 690 380 675 L355 420 Z"
                fill={bottomFill}
                stroke={bottomStroke}
                strokeWidth="1.5"
              />
              {/* Pleats vertical shadow lines */}
              {[238, 255, 272, 290, 300, 310, 328, 345, 362].map((x, i) => (
                <line
                  key={i}
                  x1={245 + (x - 245) * 0.38}
                  y1="420"
                  x2={x}
                  y2="678"
                  stroke={bottomStroke}
                  strokeWidth="1.2"
                  opacity="0.85"
                />
              ))}
            </g>
          ) : (
            /* Quần ống suông (Lụa trắng, Lụa đen, Palazzo, Jeans) */
            <g>
              {/* Left Leg */}
              <path
                d={isMale ? "M248 420 L234 680 Q 266 686 295 680 L296 490 Z" : "M252 420 L240 680 Q 268 686 295 680 L296 490 Z"}
                fill={bottomFill}
                stroke={bottomStroke}
                strokeWidth="1.5"
              />
              {/* Right Leg */}
              <path
                d={isMale ? "M305 490 L305 680 Q 334 686 366 680 L352 420 Z" : "M305 490 L305 680 Q 332 686 360 680 L348 420 Z"}
                fill={bottomFill}
                stroke={bottomStroke}
                strokeWidth="1.5"
              />
              {/* Pant Seam & Fabric Shadow */}
              <line x1="300" y1="440" x2="300" y2="515" stroke={bottomStroke} strokeWidth="1.4" />
              {config.bottomId === 'quan-jeans-suong' && (
                <>
                  <line x1="265" y1="440" x2="265" y2="680" stroke="#8CA0B3" strokeWidth="1" strokeDasharray="3 2" />
                  <line x1="335" y1="440" x2="335" y2="680" stroke="#8CA0B3" strokeWidth="1" strokeDasharray="3 2" />
                </>
              )}
            </g>
          )}
        </g>
        )}

        {/* 4. Footwear (Giày dép truyền thống & hiện đại với chi tiết nhận diện rõ rệt) */}
        {showFootwear && (
          <g id="footwear">
          {/* CHUNKY SNEAKER TRẮNG TỐI GIẢN */}
          {config.footwearId === 'sneaker-trang' && (
            <g id="footwear-sneaker">
              {/* Left Sneaker */}
              <g>
                {/* Thick Sculpted Midsole & Tread */}
                <path d="M228 684 L288 684 L292 702 Q 260 706 226 702 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.2" />
                <path d="M225 696 L293 696 L294 703 Q 260 707 225 703 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
                {/* Sole Grip Grooves */}
                <line x1="242" y1="697" x2="242" y2="702" stroke="#94A3B8" strokeWidth="1" />
                <line x1="258" y1="697" x2="258" y2="703" stroke="#94A3B8" strokeWidth="1" />
                <line x1="274" y1="697" x2="274" y2="702" stroke="#94A3B8" strokeWidth="1" />
                {/* Upper Leather Panels */}
                <path d="M234 682 C 246 682, 258 676, 276 678 L 286 684 L 232 684 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
                {/* Dynamic Wave Side Panel */}
                <path d="M245 684 Q 256 678 272 682" stroke="#DC2626" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                {/* Crisp Crossed Laces & Eyelets */}
                <line x1="252" y1="680" x2="264" y2="680" stroke="#94A3B8" strokeWidth="1.5" />
                <line x1="250" y1="682" x2="262" y2="682" stroke="#E2E8F0" strokeWidth="1.5" />
                <circle cx="248" cy="681" r="0.8" fill="#64748B" />
                <circle cx="266" cy="681" r="0.8" fill="#64748B" />
              </g>
              {/* Right Sneaker */}
              <g>
                <path d="M312 684 L372 684 L374 702 Q 340 706 308 702 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.2" />
                <path d="M307 696 L375 696 L375 703 Q 340 707 307 703 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
                <line x1="326" y1="697" x2="326" y2="702" stroke="#94A3B8" strokeWidth="1" />
                <line x1="342" y1="697" x2="342" y2="703" stroke="#94A3B8" strokeWidth="1" />
                <line x1="358" y1="697" x2="358" y2="702" stroke="#94A3B8" strokeWidth="1" />
                <path d="M314 684 C 324 676, 344 676, 366 682 L 368 684 L 314 684 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
                <path d="M328 682 Q 344 678 355 684" stroke="#DC2626" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                <line x1="336" y1="680" x2="348" y2="680" stroke="#94A3B8" strokeWidth="1.5" />
                <line x1="338" y1="682" x2="350" y2="682" stroke="#E2E8F0" strokeWidth="1.5" />
                <circle cx="334" cy="681" r="0.8" fill="#64748B" />
                <circle cx="352" cy="681" r="0.8" fill="#64748B" />
              </g>
            </g>
          )}

          {/* GUỐC MỘC QUAI NHUNG CỔ TRUYỀN (Đế Gỗ Lượn Cong & Đinh Tán Đồng) */}
          {config.footwearId === 'guoc-moc' && (
            <g id="footwear-guoc-moc">
              {/* Left Wooden Clog */}
              <g>
                {/* Curved Wooden Sole (Đế Gỗ Vát Gót Cong Lượn) */}
                <path
                  d="M236 684 C 248 684, 256 680, 268 680 L 288 680 L 290 694 L 280 696 C 272 696, 266 698, 260 701 L 236 701 Z"
                  fill={`url(#${uid}wood-clog)`}
                  stroke="#78350F"
                  strokeWidth="1"
                />
                {/* Wood grain highlight line */}
                <path d="M240 690 Q 260 688 286 688" stroke="#FDE68A" strokeWidth="0.8" opacity="0.6" fill="none" />
                {/* Rubber sole bottom rim */}
                <rect x="236" y="700" width="54" height="2" fill="#1C1917" />
                {/* 3D Curved Velvet Strap (Quai Nhung Đỏ Thắm Ôm Mu Chân) */}
                <path
                  d="M242 684 C 248 667, 274 667, 280 684"
                  fill="none"
                  stroke="#991B1B"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d="M243 683 C 249 669, 273 669, 279 683"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                {/* Brass Flower-Head Nail Rivets (Đinh Tán Đồng Hoa Thị Hai Bên Mép Guốc) */}
                <circle cx="242" cy="686" r="2.2" fill="#F59E0B" stroke="#78350F" strokeWidth="0.7" />
                <circle cx="242" cy="686" r="0.8" fill="#451A03" />
                <circle cx="280" cy="686" r="2.2" fill="#F59E0B" stroke="#78350F" strokeWidth="0.7" />
                <circle cx="280" cy="686" r="0.8" fill="#451A03" />
              </g>

              {/* Right Wooden Clog */}
              <g>
                <path
                  d="M312 684 C 324 684, 332 680, 344 680 L 364 680 L 366 694 L 356 696 C 348 696, 342 698, 336 701 L 312 701 Z"
                  fill={`url(#${uid}wood-clog)`}
                  stroke="#78350F"
                  strokeWidth="1"
                />
                <path d="M316 690 Q 336 688 362 688" stroke="#FDE68A" strokeWidth="0.8" opacity="0.6" fill="none" />
                <rect x="312" y="700" width="54" height="2" fill="#1C1917" />
                <path
                  d="M318 684 C 324 667, 350 667, 356 684"
                  fill="none"
                  stroke="#991B1B"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d="M319 683 C 325 669, 349 669, 355 683"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle cx="318" cy="686" r="2.2" fill="#F59E0B" stroke="#78350F" strokeWidth="0.7" />
                <circle cx="318" cy="686" r="0.8" fill="#451A03" />
                <circle cx="356" cy="686" r="2.2" fill="#F59E0B" stroke="#78350F" strokeWidth="0.7" />
                <circle cx="356" cy="686" r="0.8" fill="#451A03" />
              </g>
            </g>
          )}

          {/* GIÀY DA OXFORD / DERBY CỔ ĐIỂN (Đường May Mũi Brogue & Dây Buộc) */}
          {config.footwearId === 'giay-oxford' && (
            <g id="footwear-oxford">
              {/* Left Oxford */}
              <g>
                {/* Main Leather Shoe Upper with Heel Spring */}
                <path
                  d="M234 682 L 286 682 Q 292 688 290 697 L 232 697 Z"
                  fill={`url(#${uid}oxford-leather)`}
                  stroke="#1B0000"
                  strokeWidth="1"
                />
                {/* Stacked Leather Heel (Gót Da 2 Lớp) */}
                <rect x="232" y="697" width="18" height="5" fill="#140702" stroke="#3D1D09" strokeWidth="0.8" />
                <rect x="232" y="699" width="58" height="3" fill="#2E1408" />
                {/* Stitched Cap-Toe (Đường Chỉ Mũi Giày) */}
                <path d="M272 682 Q 278 688 284 695" stroke="#D7CCC8" strokeWidth="1" fill="none" opacity="0.85" />
                {/* Brogue Perforation Dots */}
                <circle cx="276" cy="688" r="0.6" fill="#F59E0B" />
                <circle cx="280" cy="691" r="0.6" fill="#F59E0B" />
                {/* Laced Facing & Tied Bow */}
                <line x1="250" y1="682" x2="260" y2="682" stroke="#E5E7EB" strokeWidth="1.2" />
                <line x1="251" y1="685" x2="261" y2="685" stroke="#E5E7EB" strokeWidth="1.2" />
                <circle cx="255" cy="680" r="1.5" fill="#D7CCC8" />
              </g>

              {/* Right Oxford */}
              <g>
                <path
                  d="M314 682 L 366 682 Q 372 688 370 697 L 312 697 Z"
                  fill={`url(#${uid}oxford-leather)`}
                  stroke="#1B0000"
                  strokeWidth="1"
                />
                <rect x="350" y="697" width="18" height="5" fill="#140702" stroke="#3D1D09" strokeWidth="0.8" />
                <rect x="312" y="699" width="58" height="3" fill="#2E1408" />
                <path d="M352 682 Q 346 688 340 695" stroke="#D7CCC8" strokeWidth="1" fill="none" opacity="0.85" />
                <circle cx="348" cy="688" r="0.6" fill="#F59E0B" />
                <circle cx="344" cy="691" r="0.6" fill="#F59E0B" />
                <line x1="328" y1="682" x2="338" y2="682" stroke="#E5E7EB" strokeWidth="1.2" />
                <line x1="329" y1="685" x2="339" y2="685" stroke="#E5E7EB" strokeWidth="1.2" />
                <circle cx="333" cy="680" r="1.5" fill="#D7CCC8" />
              </g>
            </g>
          )}

          {/* SANDAL DÂY DA QUAI MẢNH (Khóa Kim Loại & Quai Đan) */}
          {config.footwearId === 'sandal-toi-gian' && (
            <g id="footwear-sandal">
              {/* Left Sandal */}
              <g>
                <rect x="236" y="694" width="52" height="7" rx="2" fill="#EFEAE2" stroke="#A8A29E" strokeWidth="1" />
                {/* Thin Criss-Cross Leather Straps */}
                <line x1="242" y1="694" x2="278" y2="682" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="272" y1="694" x2="248" y2="682" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" />
                {/* Ankle Band & Miniature Brass Buckle */}
                <line x1="246" y1="682" x2="274" y2="682" stroke="#92400E" strokeWidth="1.8" />
                <rect x="274" y="680" width="4" height="4" rx="0.5" fill="#F59E0B" stroke="#78350F" strokeWidth="0.6" />
              </g>
              {/* Right Sandal */}
              <g>
                <rect x="312" y="694" width="52" height="7" rx="2" fill="#EFEAE2" stroke="#A8A29E" strokeWidth="1" />
                <line x1="318" y1="694" x2="354" y2="682" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="348" y1="694" x2="324" y2="682" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="322" y1="682" x2="350" y2="682" stroke="#92400E" strokeWidth="1.8" />
                <rect x="318" y="680" width="4" height="4" rx="0.5" fill="#F59E0B" stroke="#78350F" strokeWidth="0.6" />
              </g>
            </g>
          )}

          {/* CHELSEA BOOT DA CỔ THẤP (Miếng Thun Chữ V & Quai Kéo Gót) */}
          {config.footwearId === 'boot-da-co-thap' && (
            <g id="footwear-chelsea-boot">
              {/* Left Boot */}
              <g>
                {/* Ankle shaft */}
                <path
                  d="M232 662 L 284 662 L 290 698 L 228 698 Z"
                  fill="#1C1917"
                  stroke="#44403C"
                  strokeWidth="1.2"
                />
                {/* Heel Block */}
                <rect x="228" y="698" width="18" height="5" fill="#0C0A09" />
                <rect x="228" y="700" width="62" height="3" fill="#292524" />
                {/* Distinctive V-Shaped Elastic Side Gore (Thun Chữ V) */}
                <polygon points="252,662 266,662 260,684" fill="#292524" stroke="#57534E" strokeWidth="0.8" />
                <line x1="256" y1="664" x2="259" y2="680" stroke="#44403C" strokeWidth="0.8" />
                <line x1="262" y1="664" x2="260" y2="680" stroke="#44403C" strokeWidth="0.8" />
                {/* Heel Pull-Tab (Quai Kéo Sau Gót) */}
                <path d="M232 662 C 228 654, 236 652, 238 662" stroke="#78350F" strokeWidth="2.2" fill="none" />
              </g>

              {/* Right Boot */}
              <g>
                <path
                  d="M316 662 L 368 662 L 372 698 L 310 698 Z"
                  fill="#1C1917"
                  stroke="#44403C"
                  strokeWidth="1.2"
                />
                <rect x="354" y="698" width="18" height="5" fill="#0C0A09" />
                <rect x="310" y="700" width="62" height="3" fill="#292524" />
                <polygon points="334,662 348,662 342,684" fill="#292524" stroke="#57534E" strokeWidth="0.8" />
                <line x1="338" y1="664" x2="341" y2="680" stroke="#44403C" strokeWidth="0.8" />
                <line x1="344" y1="664" x2="342" y2="680" stroke="#44403C" strokeWidth="0.8" />
                <path d="M368 662 C 372 654, 364 652, 362 662" stroke="#78350F" strokeWidth="2.2" fill="none" />
              </g>
            </g>
          )}
        </g>
        )}

        {/* 5. Main Upper Garment (Lớp Áo Chính Theo Loại Việt Phục) */}
        {showGarment && (
          <g id="main-garment">
          {/* Inner White Collar (Cổ lót trắng truyền thống) */}
          <path d="M286 244 L300 255 L314 244" stroke="#FFFFFF" strokeWidth="3.2" fill="none" strokeLinecap="round" />

          {/* CASE A: Áo Tấc (Áo Thụng Tay Rộng Triều Nguyễn) */}
          {config.garmentId === 'ao-tac' && (
            <g id="garment-ao-tac">
              {/* Wide Sleeves (Ống tay thụng rộng uy nghiêm) */}
              {/* Left Sleeve */}
              <path
                d={isMale ? "M238 255 L125 330 C 110 435, 145 540, 195 560 L230 450 Z" : "M248 255 L140 330 C 130 425, 160 525, 205 545 L235 440 Z"}
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              {/* Right Sleeve */}
              <path
                d={isMale ? "M362 255 L475 330 C 490 435, 455 540, 405 560 L370 450 Z" : "M352 255 L460 330 C 470 425, 440 525, 395 545 L365 440 Z"}
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />

              {/* Main Body (Vạt dài qua gối) */}
              <path
                d={isMale ? "M238 252 L362 252 L375 570 Q 300 585 225 570 Z" : "M248 252 L352 252 L368 560 Q 300 575 232 560 Z"}
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />

              {/* Pattern Texture Overlay */}
              {config.patternId !== 'plain-silk' && (
                <path
                  d={isMale ? "M238 252 L362 252 L375 570 Q 300 585 225 570 Z" : "M248 252 L352 252 L368 560 Q 300 575 232 560 Z"}
                  fill={`url(#${uid}pattern-${config.patternId})`}
                  opacity="0.8"
                />
              )}
              {/* Silk Sheen Overlay */}
              <path
                d={isMale ? "M238 252 L362 252 L375 570 Q 300 585 225 570 Z" : "M248 252 L352 252 L368 560 Q 300 575 232 560 Z"}
                fill={`url(#${uid}silk-sheen)`}
              />

              {/* Lập Lĩnh (Cổ áo đứng vuông vức) */}
              <path d="M284 238 L316 238 L318 255 L282 255 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              <path d="M284 238 L316 238" stroke="#FAF7EE" strokeWidth="2.2" />

              {/* 5 Cúc Khuy Áo Tấc (Ngũ Thường) */}
              {[258, 286, 318, 354, 396].map((y, idx) => (
                <g key={idx}>
                  <circle cx="310" cy={y} r="3.6" fill="#FBBF24" stroke="#78350F" strokeWidth="0.8" />
                  <path d="M303 cy={y} L310 cy={y}" stroke="#78350F" strokeWidth="1" />
                </g>
              ))}

              {/* Vạt xẻ tà bên hông */}
              <path d="M246 430 L230 568" stroke={strokeColor} strokeWidth="1.5" />
              <path d="M354 430 L370 568" stroke={strokeColor} strokeWidth="1.5" />

              {/* Clasped Hands in wide sleeves (Chắp tay phong thái quân tử) */}
              {isMale && (
                <g id="male-clasped-hands" opacity="0.95">
                  <path d="M260 415 Q 300 435 340 415 L 335 435 Q 300 450 265 435 Z" fill={`url(#${uid}skin-male)`} stroke="#B8866E" strokeWidth="1" />
                </g>
              )}
            </g>
          )}

          {/* CASE B: Áo Ngũ Thân (Tay Chẽn) */}
          {config.garmentId === 'ao-ngu-than' && (
            <g id="garment-ao-ngu-than">
              {/* Fitted Sleek Sleeves (Tay chẽn lượn cong tự nhiên) */}
              <path
                d={
                  isMale
                    ? "M242 255 C 216 295, 204 350, 222 435 L 244 425 C 230 360, 238 310, 260 262 Z"
                    : "M252 255 C 226 295, 214 350, 232 430 L 254 420 C 240 355, 248 310, 268 262 Z"
                }
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              <path
                d={
                  isMale
                    ? "M358 255 C 384 295, 396 350, 378 435 L 356 425 C 370 360, 362 310, 340 262 Z"
                    : "M348 255 C 374 295, 386 350, 368 430 L 346 420 C 360 355, 352 310, 332 262 Z"
                }
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />

              {/* Main Body: Male is straight and dignified; Female has curved waist/hem */}
              <path
                d={
                  isMale
                    ? "M242 252 L358 252 L368 535 Q 300 545 232 535 Z"
                    : "M252 252 L348 252 L362 525 Q 300 542 238 525 Z"
                }
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              {config.patternId !== 'plain-silk' && (
                <path
                  d={
                    isMale
                      ? "M242 252 L358 252 L368 535 Q 300 545 232 535 Z"
                      : "M252 252 L348 252 L362 525 Q 300 542 238 525 Z"
                  }
                  fill={`url(#${uid}pattern-${config.patternId})`}
                  opacity="0.8"
                />
              )}
              <path
                d={
                  isMale
                    ? "M242 252 L358 252 L368 535 Q 300 545 232 535 Z"
                    : "M252 252 L348 252 L362 525 Q 300 542 238 525 Z"
                }
                fill={`url(#${uid}silk-sheen)`}
              />

              {/* Lapel curve (Vạt nách cong đặc trưng ngũ thân) */}
              <path d="M300 255 Q 324 275 320 315 L 320 535" stroke={strokeColor} strokeWidth="1.5" fill="none" />

              {/* Cổ đứng & 5 khuy cúc đồng */}
              <path d="M284 238 L316 238 L318 254 L282 254 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              {[256, 280, 310, 346, 388].map((y, idx) => (
                <g key={idx}>
                  <circle cx="318" cy={y} r="3.2" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                </g>
              ))}

              {/* Wrist Cuffs (Cửa tay áo chẽn có lót trắng) */}
              <rect x={isMale ? "218" : "228"} y="425" width="18" height="8" rx="2" fill="#FAF5E8" stroke="#D1C7B7" strokeWidth="1" />
              <rect x={isMale ? "364" : "354"} y="425" width="18" height="8" rx="2" fill="#FAF5E8" stroke="#D1C7B7" strokeWidth="1" />
            </g>
          )}

          {/* CASE C: Áo Tứ Thân & Yếm Đào (Truyền Thống Kinh Bắc Nữ Giới) */}
          {config.garmentId === 'ao-tu-than' && (
            <g id="garment-ao-tu-than">
              {/* Back Panels (Hai Thân Sau May Ghép Sống Lưng Liền Liền) */}
              <path
                d="M252 252 L348 252 L366 565 Q 300 578 234 565 Z"
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              {/* Pattern on back panels if selected */}
              {config.patternId !== 'plain-silk' && (
                <path
                  d="M252 252 L348 252 L366 565 Q 300 578 234 565 Z"
                  fill={`url(#${uid}pattern-${config.patternId})`}
                  opacity="0.8"
                />
              )}
              <path d="M252 252 L348 252 L366 565 Q 300 578 234 565 Z" fill={`url(#${uid}silk-sheen)`} />
              {/* Center Back Spine Seam (Đường May Sống Lưng Áo Tứ Thân) */}
              <line x1="300" y1="252" x2="300" y2="570" stroke={strokeColor} strokeWidth="1.3" opacity="0.75" />

              {/* Smooth Graceful Flowing Sleeves (Tay Áo Lụa Mềm Uốn Lượn) */}
              {/* Left Sleeve */}
              <path
                d="M 252 254 C 224 290, 204 345, 218 438 L 240 432 C 230 365, 238 310, 264 262 Z"
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              {/* Sleeve inner elbow fold shadow */}
              <path d="M216 350 Q 228 356 236 348" stroke={strokeColor} strokeWidth="1.2" fill="none" opacity="0.6" />
              {/* Right Sleeve */}
              <path
                d="M 348 254 C 376 290, 396 345, 382 438 L 360 432 C 370 365, 362 310, 336 262 Z"
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              <path d="M384 350 Q 372 356 364 348" stroke={strokeColor} strokeWidth="1.2" fill="none" opacity="0.6" />

              {/* Authentic Inner Yếm Đào (Cánh Sen Hồng Đào Thắm Đượm) */}
              <g id="yem-dao">
                {/* White Halter Ribbon around Neck (Dây Cổ Yếm Lụa Trắng Thắt Gáy) */}
                <path d="M286 244 Q 300 236 314 244" stroke="#FFFDF8" strokeWidth="2.8" fill="none" />
                <path d="M288 244 L 284 250 M 312 244 L 316 250" stroke="#FFFDF8" strokeWidth="2" />
                {/* Main Yếm Silhouette (Thân Yếm Hình Quả Tim / Cánh Sen) */}
                <path
                  d="M 284 246 C 265 285, 262 335, 270 354 L 330 354 C 338 335, 335 285, 316 246 Q 300 258 284 246 Z"
                  fill="#E11D48"
                  stroke="#9F1239"
                  strokeWidth="1.2"
                />
                {/* Soft Yếm Silk Sheen & Center Fold */}
                <path
                  d="M 284 246 C 274 285, 272 335, 278 354 L 300 354 L 300 254 Z"
                  fill="#BE123C"
                  opacity="0.35"
                />
                <line x1="300" y1="256" x2="300" y2="354" stroke="#9F1239" strokeWidth="0.8" opacity="0.6" />
                {/* Top Border Binding (Viền Cổ Yếm) */}
                <path d="M284 246 Q 300 258 316 246" stroke="#FFE4E6" strokeWidth="1.5" fill="none" />
              </g>

              {/* Outer Robe Front Lapels (Hai Nẹp Vạt Trước Ôm Khéo Yếm Đào) */}
              {/* Left Lapel (Nẹp Vạt Trái) */}
              <path
                d="M 276 246 C 265 280, 260 320, 266 354 L 282 354 C 276 320, 278 280, 286 246 Z"
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              <path d="M286 246 C 278 280, 276 320, 282 354" stroke="#FAF7EE" strokeWidth="1.2" opacity="0.85" />

              {/* Right Lapel (Nẹp Vạt Phải) */}
              <path
                d="M 324 246 C 335 280, 340 320, 334 354 L 318 354 C 324 320, 322 280, 314 246 Z"
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              <path d="M314 246 C 322 280, 324 320, 318 354" stroke="#FAF7EE" strokeWidth="1.2" opacity="0.85" />

              {/* Front Panels Below Waist (Hai Vạt Trước Thả Dáng Mềm Mại Hai Bên) */}
              {/* Left Front Flap */}
              <path
                d="M 266 354 L 284 425 L 264 545 L 238 532 L 254 420 Z"
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              <path d="M284 425 L 264 545" stroke="#FAF7EE" strokeWidth="1" opacity="0.6" />

              {/* Right Front Flap */}
              <path
                d="M 334 354 L 316 425 L 336 545 L 362 532 L 346 420 Z"
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              <path d="M316 425 L 336 545" stroke="#FAF7EE" strokeWidth="1" opacity="0.6" />

              {/* Dải Thắt Lưng Bao Lụa Ngũ Sắc Quan Họ (Bao Xanh & Dải Lụa Đào, Lụa Vàng) */}
              <g id="sash-ruot-tuong">
                {/* Bao Xanh Ruột Tượng Quấn Eo */}
                <rect x="262" y="348" width="76" height="18" rx="3" fill="#059669" stroke="#047857" strokeWidth="1.2" />
                <line x1="262" y1="357" x2="338" y2="357" stroke="#34D399" strokeWidth="1" opacity="0.75" />
                {/* Knotted Silk Rosette at Center (Nút Thắt Hoa Lụa) */}
                <circle cx="300" cy="357" r="7.5" fill="#047857" stroke="#065F46" strokeWidth="0.8" />
                <circle cx="300" cy="357" r="4.8" fill="#10B981" />
                <circle cx="300" cy="357" r="2" fill="#6EE7B7" />

                {/* Trailing Silk Ribbons Cascading Down (Dải Lụa Đào & Lụa Vàng Duyên Dáng) */}
                {/* Pink Silk Ribbon (Dải Lụa Đào) */}
                <path
                  d="M 293 364 C 286 415, 282 460, 286 505 L 297 503 C 294 460, 298 415, 301 364 Z"
                  fill="#F43F5E"
                  stroke="#E11D48"
                  strokeWidth="0.8"
                  opacity="0.95"
                />
                {/* Saffron Gold Ribbon (Dải Lụa Vàng Nghệ) */}
                <path
                  d="M 300 364 C 304 415, 316 460, 312 518 L 323 516 C 326 460, 314 415, 308 364 Z"
                  fill="#F59E0B"
                  stroke="#D97706"
                  strokeWidth="0.8"
                  opacity="0.95"
                />
                {/* Emerald Silk Accent Ribbon (Dải Ngọc Xanh) */}
                <path
                  d="M 297 364 C 296 425, 294 470, 292 485 L 302 485 C 304 470, 304 425, 303 364 Z"
                  fill="#10B981"
                  stroke="#059669"
                  strokeWidth="0.8"
                  opacity="0.9"
                />
              </g>

              {/* Wrist Cuffs with Inner White Lining */}
              <rect x="226" y="428" width="16" height="7" rx="2" fill="#FAF5E8" stroke="#D1C7B7" strokeWidth="1" />
              <rect x="358" y="428" width="16" height="7" rx="2" fill="#FAF5E8" stroke="#D1C7B7" strokeWidth="1" />
            </g>
          )}

          {/* CASE D: Áo Nhật Bình (Triều Phục Cung Đình Huế) */}
          {config.garmentId === 'ao-nhat-binh' && (
            <g id="garment-ao-nhat-binh">
              {/* Wide Royal Sleeves with Five-Color Bands */}
              <path d="M246 255 L150 338 L188 485 L228 425 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              <path d="M354 255 L450 338 L412 485 L372 425 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />

              {/* Ngũ Sắc Sleeve Bands (Xanh, Đỏ, Vàng, Trắng, Chàm) */}
              <g>
                <path d="M160 355 L190 475" stroke="#0284C7" strokeWidth="4.5" />
                <path d="M165 358 L195 478" stroke="#DC2626" strokeWidth="4.5" />
                <path d="M170 361 L200 481" stroke="#FBBF24" strokeWidth="4.5" />
                <path d="M440 355 L410 475" stroke="#0284C7" strokeWidth="4.5" />
                <path d="M435 358 L405 478" stroke="#DC2626" strokeWidth="4.5" />
                <path d="M430 361 L400 481" stroke="#FBBF24" strokeWidth="4.5" />
              </g>

              {/* Main Robe */}
              <path d="M246 250 L354 250 L370 565 Q 300 580 230 565 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              {config.patternId !== 'plain-silk' && (
                <path d="M246 250 L354 250 L370 565 Q 300 580 230 565 Z" fill={`url(#${uid}pattern-${config.patternId})`} opacity="0.8" />
              )}
              <path d="M246 250 L354 250 L370 565 Q 300 580 230 565 Z" fill={`url(#${uid}silk-sheen)`} />

              {/* Distinctive Rectangular Collar (Cổ áo Nhật Bình chữ nhật) */}
              <rect x="270" y="246" width="60" height="98" rx="3" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
              {/* Inner rectangular opening */}
              <rect x="280" y="252" width="40" height="88" fill={primaryHex} />

              {/* Embroidered Rainbow Border on Collar */}
              <rect x="273" y="248" width="54" height="94" fill="none" stroke="#DC2626" strokeWidth="2.5" />
              <rect x="276" y="250" width="48" height="90" fill="none" stroke="#FBBF24" strokeWidth="2" />

              {/* Dangling Embroidered Front Ribbons (Hai dải thắt thả trước ngực) */}
              <rect x="282" y="344" width="14" height="185" fill="#B45309" stroke="#78350F" strokeWidth="1" />
              <rect x="304" y="344" width="14" height="185" fill="#B45309" stroke="#78350F" strokeWidth="1" />
              {/* Golden Phoenix & Lotus motifs on ribbons */}
              {[365, 405, 445, 485].map((ry, i) => (
                <g key={i}>
                  <circle cx="289" cy={ry} r="3.2" fill="#FEF08A" />
                  <circle cx="311" cy={ry} r="3.2" fill="#FEF08A" />
                </g>
              ))}
            </g>
          )}

          {/* CASE E: Áo Giao Lĩnh (Vạt Chéo Thời Lý - Trần - Lê) */}
          {config.garmentId === 'ao-giao-linh' && (
            <g id="garment-ao-giao-linh">
              {/* Classical Flowing Sleeves */}
              <path
                d={isMale ? "M240 255 L150 355 L198 470 L238 415 Z" : "M248 255 L160 350 L205 460 L242 410 Z"}
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              <path
                d={isMale ? "M360 255 L450 355 L402 470 L362 415 Z" : "M352 255 L440 350 L395 460 L358 410 Z"}
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />

              {/* Main Body */}
              <path
                d={isMale ? "M242 250 L358 250 L370 555 Q 300 570 230 555 Z" : "M250 250 L350 250 L365 545 Q 300 560 235 545 Z"}
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              {config.patternId !== 'plain-silk' && (
                <path
                  d={isMale ? "M242 250 L358 250 L370 555 Q 300 570 230 555 Z" : "M250 250 L350 250 L365 545 Q 300 560 235 545 Z"}
                  fill={`url(#${uid}pattern-${config.patternId})`}
                  opacity="0.8"
                />
              )}
              <path
                d={isMale ? "M242 250 L358 250 L370 555 Q 300 570 230 555 Z" : "M250 250 L350 250 L365 545 Q 300 560 235 545 Z"}
                fill={`url(#${uid}silk-sheen)`}
              />

              {/* Crossed Collar (Hữu nhậm: Vạt trái đè lên vạt phải) */}
              <path d="M270 240 L332 355 L315 355 L256 248 Z" fill="#FDFBF7" stroke="#D1D5DB" strokeWidth="1.5" />
              <path d="M330 240 L268 355 L285 355 L344 248 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              <line x1="270" y1="240" x2="332" y2="355" stroke={strokeColor} strokeWidth="2.2" />

              {/* Waist Sash (Đai thắt lưng vải) */}
              <rect x="256" y="350" width="88" height="20" rx="2" fill="#292524" stroke="#44403C" strokeWidth="1.2" />
              <path d="M290 370 L285 475 L297 475 L301 370 Z" fill="#292524" />
            </g>
          )}

          {/* CASE F: Áo Dài Tân Thời / Lemur (1930s Nữ Giới) */}
          {config.garmentId === 'ao-dai-tan-thoi' && (
            <g id="garment-ao-dai-tan-thoi">
              {/* Slim fitted sleeves */}
              <path d="M256 255 L224 360 L246 430 L262 418 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.2" />
              <path d="M344 255 L376 360 L354 430 L338 418 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.2" />

              {/* Fitted Bodice with High Slits (Tà dài thướt tha, eo thon) */}
              <path
                d="M256 250 L344 250 L330 338 L354 580 Q 300 590 246 580 L270 338 Z"
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              {config.patternId !== 'plain-silk' && (
                <path
                  d="M256 250 L344 250 L330 338 L354 580 Q 300 590 246 580 L270 338 Z"
                  fill={`url(#${uid}pattern-${config.patternId})`}
                  opacity="0.8"
                />
              )}
              <path d="M256 250 L344 250 L330 338 L354 580 Q 300 590 246 580 L270 338 Z" fill={`url(#${uid}silk-sheen)`} />

              {/* Lemur stylized collar (cổ tim hoặc cánh sen cách điệu) */}
              <path d="M284 242 Q 300 258 316 242" stroke={strokeColor} strokeWidth="2.2" fill="none" />
              {/* Pearl buttons chéo vai */}
              {[255, 275, 298, 322].map((by, i) => (
                <circle key={i} cx={318 + i * 2.5} cy={by} r="2.6" fill="#FAF5FF" stroke="#A855F7" strokeWidth="0.6" />
              ))}
            </g>
          )}

          {/* CASE G: Áo Dài Hiện Đại (Tay Raglan) - Adaptable for Female & Male */}
          {config.garmentId === 'ao-dai-hien-dai' && (
            <g id="garment-ao-dai-hien-dai">
              {isMale ? (
                /* ÁO DÀI NAM HIỆN ĐẠI: Phom suông đứng đĩnh đạc, tà vừa qua gối, không chiết eo */
                <g id="ao-dai-nam">
                  {/* Back flap peeking behind legs */}
                  <path d="M246 345 L242 565 Q 300 575 358 565 L354 345 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.2" opacity="0.8" />
                  {/* Structured raglan sleeves */}
                  <path d="M242 254 L204 355 L218 438 L240 435 L236 360 L264 262 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  <path d="M358 254 L396 355 L382 438 L360 435 L364 360 L336 262 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  {/* Straight tailored torso */}
                  <path d="M242 250 L358 250 L360 560 Q 300 570 240 560 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  {config.patternId !== 'plain-silk' && (
                    <path d="M242 250 L358 250 L360 560 Q 300 570 240 560 Z" fill={`url(#${uid}pattern-${config.patternId})`} opacity="0.8" />
                  )}
                  <path d="M242 250 L358 250 L360 560 Q 300 570 240 560 Z" fill={`url(#${uid}silk-sheen)`} />
                  {/* Stand collar */}
                  <path d="M285 236 L315 236 L317 252 L283 252 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  {/* Male diagonal button placket */}
                  <path d="M315 252 Q 330 270 338 315" stroke={strokeColor} strokeWidth="1.5" fill="none" />
                  {[258, 276, 298, 322].map((y, i) => (
                    <circle key={i} cx={318 + i * 5} cy={y} r="2.8" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                  ))}
                  {/* Neat side slits */}
                  <path d="M240 370 L240 560" stroke={strokeColor} strokeWidth="1.2" />
                  <path d="M360 370 L360 560" stroke={strokeColor} strokeWidth="1.2" />
                </g>
              ) : (
                /* ÁO DÀI NỮ HIỆN ĐẠI: Chiết eo mềm mại, tà dài thướt tha chạm mắt cá chân */
                <g id="ao-dai-nu">
                  {/* Back flap peeking behind legs */}
                  <path d="M262 345 L244 645 Q 300 658 356 645 L338 345 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.2" opacity="0.85" />
                  {/* Long slim raglan sleeves to wrist */}
                  <path d="M256 252 L224 350 L234 438 L252 436 L248 355 L270 262 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.2" />
                  <path d="M344 252 L376 350 L366 438 L348 436 L352 355 L330 262 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.2" />
                  {/* Raglan diagonal seams */}
                  <path d="M286 246 L260 300" stroke={strokeColor} strokeWidth="1.2" />
                  <path d="M314 246 L340 300" stroke={strokeColor} strokeWidth="1.2" />
                  {/* Fitted bodice to natural waist */}
                  <path d="M260 250 L340 250 L332 345 L268 345 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  {/* Front flap floating down */}
                  <path d="M268 345 L332 345 L348 635 Q 300 648 252 635 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  {config.patternId !== 'plain-silk' && (
                    <path
                      d="M260 250 L340 250 L332 345 L348 635 Q 300 648 252 635 L268 345 Z"
                      fill={`url(#${uid}pattern-${config.patternId})`}
                      opacity="0.8"
                    />
                  )}
                  <path d="M260 250 L340 250 L332 345 L348 635 Q 300 648 252 635 L268 345 Z" fill={`url(#${uid}silk-sheen)`} />
                  {/* High slits at waist */}
                  <path d="M268 345 L264 352" stroke={strokeColor} strokeWidth="2" />
                  <path d="M332 345 L336 352" stroke={strokeColor} strokeWidth="2" />
                  {/* Stand mandarin collar */}
                  <path d="M286 234 L314 234 L316 250 L284 250 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
                  {/* Diagonal pearl buttons */}
                  <path d="M314 250 Q 328 264 336 300" stroke={strokeColor} strokeWidth="1.2" fill="none" />
                  {[256, 272, 290].map((y, i) => (
                    <circle key={i} cx={318 + i * 6} cy={y} r="2.2" fill={highlightHex} stroke={strokeColor} strokeWidth="0.6" />
                  ))}
                </g>
              )}
            </g>
          )}

          {/* CASE H: Áo Bà Ba Nam Bộ (Nam & Nữ) */}
          {config.garmentId === 'ao-ba-ba' && (
            <g id="garment-ao-ba-ba">
              {/* Loose long sleeves */}
              <path
                d={isMale ? "M244 255 L198 365 L218 442 L244 435 L240 360 L264 262 Z" : "M254 255 L214 365 L230 440 L254 434 L250 360 L270 262 Z"}
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              <path
                d={isMale ? "M356 255 L402 365 L382 442 L356 435 L360 360 L336 262 Z" : "M346 255 L386 365 L370 440 L346 434 L350 360 L330 262 Z"}
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />

              {/* Main Body: Male is relaxed/boxy; Female is gently cinched at waist */}
              <path
                d={
                  isMale
                    ? "M244 250 L356 250 L362 460 Q 300 468 238 460 Z"
                    : "M256 250 L344 250 L352 452 Q 300 460 248 452 Z"
                }
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              {config.patternId !== 'plain-silk' && (
                <path
                  d={
                    isMale
                      ? "M244 250 L356 250 L362 460 Q 300 468 238 460 Z"
                      : "M256 250 L344 250 L352 452 Q 300 460 248 452 Z"
                  }
                  fill={`url(#${uid}pattern-${config.patternId})`}
                  opacity="0.75"
                />
              )}
              <path
                d={
                  isMale
                    ? "M244 250 L356 250 L362 460 Q 300 468 238 460 Z"
                    : "M256 250 L344 250 L352 452 Q 300 460 248 452 Z"
                }
                fill={`url(#${uid}silk-sheen)`}
              />

              {/* Collarless neckline */}
              <path d="M282 246 Q 300 264 318 246" stroke={strokeColor} strokeWidth="2" fill="none" />
              {/* Center placket with buttons */}
              <line x1="300" y1="258" x2="300" y2="456" stroke={strokeColor} strokeWidth="1.4" />
              {[272, 305, 338, 372, 408].map((y, i) => (
                <circle key={i} cx="300" cy={y} r="2.8" fill={highlightHex} stroke={strokeColor} strokeWidth="0.8" />
              ))}

              {/* Two Lower Pockets (Hai túi vạt trước) */}
              <rect x={isMale ? "254" : "262"} y="405" width={isMale ? "32" : "28"} height={isMale ? "34" : "30"} rx="2" fill="none" stroke={strokeColor} strokeWidth="1.2" />
              <rect x={isMale ? "314" : "310"} y="405" width={isMale ? "32" : "28"} height={isMale ? "34" : "30"} rx="2" fill="none" stroke={strokeColor} strokeWidth="1.2" />

              {/* Side slits */}
              <path d="M246 430 L242 458" stroke={strokeColor} strokeWidth="2" />
              <path d="M354 430 L358 458" stroke={strokeColor} strokeWidth="2" />
            </g>
          )}
        </g>
        )}

        {/* 6. Articulated Model Hands (Bàn Tay Tự Nhiên & Cầm Phụ Kiện) */}
        {showBody && !(config.garmentId === 'ao-tac' && isMale) && (
          <g id="model-hands">
            {/* Left Hand: Grasps bag strap if present, otherwise rests gracefully */}
            <g id="left-hand">
              {config.accessories.includes('tui-coi-dan') || config.accessories.includes('tui-tote-cham') ? (
                /* Grasping bag strap */
                <g>
                  <path
                    d="M 222 432 L 220 448 C 220 458, 230 460, 234 452 L 232 432 Z"
                    fill={`url(#${uid}skin-${isMale ? 'male' : 'female'})`}
                    stroke="#C49782"
                    strokeWidth="0.8"
                  />
                  <path d="M 218 442 C 222 444, 226 446, 230 444" stroke="#B8866E" strokeWidth="1" fill="none" />
                  <ellipse cx="225" cy="448" rx="2.5" ry="4" fill={`url(#${uid}skin-${isMale ? 'male' : 'female'})`} stroke="#C49782" strokeWidth="0.6" />
                </g>
              ) : (
                /* Natural relaxed fingers */
                <g>
                  <path
                    d="M 222 432 L 220 450 C 219 458, 222 466, 224 466 C 226 466, 229 458, 230 450 L 232 432 Z"
                    fill={`url(#${uid}skin-${isMale ? 'male' : 'female'})`}
                    stroke="#C49782"
                    strokeWidth="0.8"
                  />
                  <line x1="223" y1="452" x2="223" y2="463" stroke="#C49782" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="226" y1="450" x2="226" y2="465" stroke="#C49782" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="228" y1="452" x2="228" y2="462" stroke="#C49782" strokeWidth="0.7" strokeLinecap="round" />
                </g>
              )}
            </g>

            {/* Right Hand: Holds fan if present, otherwise rests gracefully */}
            <g id="right-hand">
              {config.accessories.includes('quat-giay-do') ? (
                /* Elegantly holding fan pivot */
                <g>
                  <path
                    d="M 366 432 L 366 448 C 367 458, 376 460, 378 450 L 376 432 Z"
                    fill={`url(#${uid}skin-${isMale ? 'male' : 'female'})`}
                    stroke="#C49782"
                    strokeWidth="0.8"
                  />
                  <path d="M 364 444 C 368 442, 372 444, 376 446" stroke="#B8866E" strokeWidth="1" fill="none" />
                  <ellipse cx="367" cy="448" rx="2.5" ry="4.5" fill={`url(#${uid}skin-${isMale ? 'male' : 'female'})`} stroke="#C49782" strokeWidth="0.6" transform="rotate(-15, 367, 448)" />
                </g>
              ) : (
                /* Natural relaxed fingers */
                <g>
                  <path
                    d="M 366 432 L 368 450 C 369 458, 372 466, 374 466 C 376 466, 379 458, 378 450 L 376 432 Z"
                    fill={`url(#${uid}skin-${isMale ? 'male' : 'female'})`}
                    stroke="#C49782"
                    strokeWidth="0.8"
                  />
                  <line x1="371" y1="452" x2="371" y2="462" stroke="#C49782" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="373" y1="450" x2="373" y2="465" stroke="#C49782" strokeWidth="0.7" strokeLinecap="round" />
                  <line x1="376" y1="452" x2="376" y2="463" stroke="#C49782" strokeWidth="0.7" strokeLinecap="round" />
                </g>
              )}
            </g>
          </g>
        )}

        {/* 7. Accessories On-Body (Kiềng Bạc, Kính, Túi, Quạt Giấy Dó, Choker) */}
        {showAccessories && (
          <g id="accessories">
          {/* Kiềng Bạc Chạm Hoa Mai (Bạc Ta Chạm Khắc Tinh Xảo) */}
          {config.accessories.includes('kieng-bac') && (
            <g id="accessory-kieng-bac">
              <path
                d="M 276 254 Q 300 275 324 254"
                fill="none"
                stroke={`url(#${uid}silver-kieng)`}
                strokeWidth="6.5"
                strokeLinecap="round"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.35))"
              />
              <path
                d="M 278 253 Q 300 273 322 253"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                opacity="0.85"
                strokeLinecap="round"
              />
              <circle cx="288" cy="265" r="1.5" fill="#64748B" opacity="0.8" />
              <circle cx="300" cy="268" r="1.6" fill="#64748B" opacity="0.8" />
              <circle cx="312" cy="265" r="1.5" fill="#64748B" opacity="0.8" />
            </g>
          )}

          {/* Choker Ngọc Trai Nước Ngọt */}
          {config.accessories.includes('choker-ngoc-trai') && (
            <g id="accessory-choker-ngoc-trai">
              {[282, 288, 294, 300, 306, 312, 318].map((cx, i) => (
                <g key={i}>
                  <circle
                    cx={cx}
                    cy={246 + Math.sin((i / 6) * Math.PI) * 5}
                    r="3.5"
                    fill="#FFFFFF"
                    stroke="#E2E8F0"
                    strokeWidth="0.8"
                  />
                  <circle
                    cx={cx - 1}
                    cy={245 + Math.sin((i / 6) * Math.PI) * 5}
                    r="1"
                    fill="#FFFFFF"
                  />
                </g>
              ))}
              <circle cx="300" cy="254" r="3.2" fill="#F59E0B" stroke="#B45309" strokeWidth="0.6" />
              <circle cx="300" cy="254" r="1.2" fill="#FEF08A" />
            </g>
          )}

          {/* Kính Mắt Y2K Râm Retro */}
          {config.accessories.includes('kinh-mat-y2k') && (
            <g id="accessory-kinh-y2k">
              {/* Left Lens Cat-eye */}
              <path d="M270 172 L294 174 L290 182 L272 180 Z" fill="#18181B" stroke="#27272A" strokeWidth="1" />
              {/* Right Lens Cat-eye */}
              <path d="M306 174 L330 172 L328 180 L310 182 Z" fill="#18181B" stroke="#27272A" strokeWidth="1" />
              <line x1="294" y1="174" x2="306" y2="174" stroke="#18181B" strokeWidth="1.8" />
            </g>
          )}

          {/* Kính Gọng Tròn Thư Sinh */}
          {config.accessories.includes('kinh-gong-tron') && (
            <g id="accessory-kinh-tron">
              <circle cx="284" cy="176" r="8.5" fill="none" stroke="#B45309" strokeWidth="1.5" />
              <circle cx="316" cy="176" r="8.5" fill="none" stroke="#B45309" strokeWidth="1.5" />
              <line x1="292.5" y1="176" x2="307.5" y2="176" stroke="#B45309" strokeWidth="1.5" />
            </g>
          )}

          {/* Quạt Xếp Giấy Dó In Thơ Nôm (Cầm Tay Tự Nhiên & Nan Tre Chàng Sơn) */}
          {config.accessories.includes('quat-giay-do') && (
            <g id="accessory-quat-giay-do" transform="translate(370, 450) rotate(-12)">
              {/* Outer Bamboo Guard Sticks (Nan Cái Bằng Tre Già) */}
              <line x1="0" y1="0" x2="68" y2="-45" stroke="#78350F" strokeWidth="2.8" strokeLinecap="round" />
              <line x1="0" y1="0" x2="88" y2="12" stroke="#78350F" strokeWidth="2.8" strokeLinecap="round" />

              {/* Fan Leaf Arc (Mặt Quạt Giấy Dó Nhuộm Son Điệp) */}
              <path
                d="M 22 -15 L 68 -45 A 82 82 0 0 1 88 12 L 28 4 Z"
                fill={`url(#${uid}fan-paper)`}
                stroke="#991B1B"
                strokeWidth="1"
              />

              {/* 5 Inner Radiating Bamboo Ribs (Nan Tre Vót Chuốt Tinh Tế) */}
              {[
                { x1: 25, y1: -12, x2: 73, y2: -35 },
                { x1: 27, y1: -8, x2: 78, y2: -25 },
                { x1: 28, y1: -4, x2: 82, y2: -15 },
                { x1: 29, y1: 0, x2: 85, y2: -5 },
                { x1: 28, y1: 2, x2: 86, y2: 4 }
              ].map((rib, i) => (
                <line
                  key={i}
                  x1={rib.x1}
                  y1={rib.y1}
                  x2={rib.x2}
                  y2={rib.y2}
                  stroke="#78350F"
                  strokeWidth="0.9"
                  opacity="0.75"
                />
              ))}

              {/* Gold Plum Blossom / Nom Calligraphy on Dó Paper (Họa Tiết Nhành Mai Vàng / Thơ Nôm) */}
              <g opacity="0.85">
                <circle cx="58" cy="-18" r="3.2" fill="#FEF08A" stroke="#F59E0B" strokeWidth="0.6" />
                <circle cx="65" cy="-12" r="2.5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="0.5" />
                <circle cx="52" cy="-10" r="2.2" fill="#FEF08A" stroke="#F59E0B" strokeWidth="0.5" />
                <path d="M46 -6 Q 56 -14 68 -10" stroke="#FEF08A" strokeWidth="0.8" fill="none" />
              </g>

              {/* Brass Pivot Rivet (Chốt Đồng Thau) */}
              <circle cx="0" cy="0" r="3.2" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="1.2" fill="#451A03" />

              {/* Flowing Red Silk Tassel (Tua Rua Lụa Đỏ Son Buông Rủ) */}
              <line x1="0" y1="3" x2="2" y2="15" stroke="#DC2626" strokeWidth="1.8" />
              <ellipse cx="2" cy="17" rx="3.5" ry="2.5" fill="#991B1B" />
              <line x1="2" y1="19" x2="3" y2="44" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="0" y1="19" x2="-1" y2="41" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="4" y1="19" x2="6" y2="40" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          )}

          {/* Túi Tote Vải Chàm Thêu Thư Pháp */}
          {config.accessories.includes('tui-tote-cham') && (
            <g id="accessory-tui-tote">
              {/* Canvas Handles from hand (226, 448) to bag rim */}
              <path d="M 226 448 Q 206 468 206 488" stroke="#1E3A8A" strokeWidth="2.8" fill="none" strokeLinecap="round" />
              <path d="M 226 448 Q 242 468 242 488" stroke="#1E3A8A" strokeWidth="2.8" fill="none" strokeLinecap="round" />

              {/* Indigo Dyed Canvas Body */}
              <rect x="196" y="488" width="56" height="66" rx="3" fill="#1E3A8A" stroke="#172554" strokeWidth="1.5" />
              {/* Contrast Top-Stitching */}
              <rect x="199" y="491" width="50" height="60" rx="2" fill="none" stroke="#60A5FA" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.6" />

              {/* Embroidered Vietnamese Lotus / Seal Emblem */}
              <circle cx="224" cy="521" r="14" fill="#172554" stroke="#FAF5FF" strokeWidth="1.2" strokeDasharray="2 2" />
              <text x="224" y="525" fontSize="11" fill="#FAF5FF" textAnchor="middle" fontFamily="serif" fontWeight="bold">
                Việt
              </text>
            </g>
          )}

          {/* Túi Cói Mây Tre Đan (Làng Nghề Phú Vinh) */}
          {config.accessories.includes('tui-coi-dan') && (
            <g id="accessory-tui-coi">
              {/* Leather Strap from hand at (226, 448) down to bag */}
              <path d="M 226 448 Q 212 470 216 492" stroke="#78350F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 226 448 Q 238 470 234 492" stroke="#78350F" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* Bag Body - Handwoven Rattan Circle */}
              <circle cx="225" cy="515" r="26" fill={`url(#${uid}wood-clog)`} stroke="#78350F" strokeWidth="1.5" />
              {/* Woven Cane Webbing Rings & Dashes */}
              <circle cx="225" cy="515" r="21" fill="none" stroke="#FEF08A" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.8" />
              <circle cx="225" cy="515" r="15" fill="none" stroke="#78350F" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.85" />
              <circle cx="225" cy="515" r="9" fill="none" stroke="#FEF08A" strokeWidth="1" strokeDasharray="2 2" opacity="0.9" />

              {/* Center Wooden Button Clasp & Loop */}
              <circle cx="225" cy="502" r="3.2" fill="#451A03" stroke="#78350F" strokeWidth="0.8" />
              <path d="M222 494 Q 225 500 228 494" stroke="#78350F" strokeWidth="1.5" fill="none" />
            </g>
          )}
        </g>
        )}

        {/* 7. Headwear (Nón lá, Khăn đóng, Khăn vấn, Nón quai thao, Bờm, Trâm, Khăn rằn) */}
        {showHeadwear && (
          <g id="headwear">
          {/* Khăn Vấn Nhung (Nữ & Unisex) */}
          {config.headwearId === 'khan-van' && (
            <g id="headwear-khan-van">
              <ellipse cx="300" cy="148" rx="45" ry="21" fill="#1C1917" stroke="#44403C" strokeWidth="1.5" />
              <ellipse cx="300" cy="144" rx="43" ry="19" fill="#292524" stroke="#57534E" strokeWidth="1" />
              <ellipse cx="300" cy="140" rx="41" ry="17" fill="#1C1917" stroke="#44403C" strokeWidth="1" />
            </g>
          )}

          {/* Khăn Đóng Nam (Xếp Nếp Chữ Nhân V-fold) */}
          {config.headwearId === 'khan-dong' && (
            <g id="headwear-khan-dong">
              <ellipse cx="300" cy="146" rx="43" ry="19" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
              <ellipse cx="300" cy="142" rx="41" ry="17" fill="#334155" stroke="#1E293B" strokeWidth="1" />
              {/* Distinctive V-fold on forehead (Xếp nếp chữ Nhân) */}
              <path d="M284 140 L300 152 L316 140" stroke="#94A3B8" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* Nón Quai Thao (Nón Ba Tầm Dân Gian Bắc Bộ) */}
          {config.headwearId === 'non-quai-thao' && (
            <g id="headwear-non-quai-thao">
              <ellipse cx="300" cy="122" rx="105" ry="25" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
              <ellipse cx="300" cy="122" rx="92" ry="21" fill="none" stroke="#D97706" strokeWidth="1" strokeDasharray="3 2" />
              {/* Thao Silk Ribbon dropping to waist */}
              <path d="M235 132 Q 225 250 235 410" stroke="#1C1917" strokeWidth="3" fill="none" />
              <path d="M365 132 Q 375 250 365 410" stroke="#1C1917" strokeWidth="3" fill="none" />
            </g>
          )}

          {/* Nón Lá Bài Thơ Xứ Huế */}
          {config.headwearId === 'non-la' && (
            <g id="headwear-non-la">
              {/* Conical Hat */}
              <path d="M300 75 L205 155 Q 300 174 395 155 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
              {/* Rings & Stitches */}
              <path d="M228 140 Q 300 156 372 140" fill="none" stroke="#FBBF24" strokeWidth="1" />
              <path d="M252 120 Q 300 134 348 120" fill="none" stroke="#FBBF24" strokeWidth="1" />
              {/* Silk Chin Strap */}
              <path d="M258 155 Q 300 218 342 155" stroke="#EC4899" strokeWidth="2.5" fill="none" />
            </g>
          )}

          {/* Bờm Ngọc Trai Cách Tân */}
          {config.headwearId === 'bom-ngoc-trai' && (
            <g id="headwear-bom-ngoc-trai">
              <path d="M264 168 A 39 43 0 0 1 336 168" stroke="#7C3AED" strokeWidth="7" fill="none" strokeLinecap="round" />
              {[270, 280, 290, 300, 310, 320, 330].map((px, i) => (
                <circle key={i} cx={px} cy={136 + Math.abs(px - 300) * 0.32} r="3.4" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="0.8" />
              ))}
            </g>
          )}

          {/* Khăn Rằn Nam Bộ (quàng cổ, sọc caro đen trắng) */}
          {config.headwearId === 'khan-ran' && (
            <g id="headwear-khan-ran">
              <defs>
                <pattern id={`${uid}khan-ran`} width="8" height="8" patternUnits="userSpaceOnUse">
                  <rect width="8" height="8" fill="#F5F5F4" />
                  <rect width="4" height="4" fill="#1C1917" />
                  <rect x="4" y="4" width="4" height="4" fill="#1C1917" />
                </pattern>
              </defs>
              {/* Scarf wrapped around neck */}
              <path d="M274 236 Q 300 264 326 236 L 332 254 Q 300 282 268 254 Z" fill={`url(#${uid}khan-ran)`} stroke="#44403C" strokeWidth="1" />
              {/* Hanging ends */}
              <path d="M312 260 L322 335 L336 331 L324 256 Z" fill={`url(#${uid}khan-ran)`} stroke="#44403C" strokeWidth="1" />
              <path d="M300 264 L304 322 L316 322 L310 260 Z" fill={`url(#${uid}khan-ran)`} stroke="#44403C" strokeWidth="1" />
              {/* Hair stays visible */}
              {isMale ? (
                <path d="M264 170 C 263 138, 337 138, 336 170 C 330 148, 270 148, 264 170 Z" fill="#1C1917" />
              ) : (
                <path
                  d="M265 172 C 260 130, 340 130, 335 172 C 342 215, 335 255, 330 255 L 324 245 C 330 215, 330 165, 300 148 C 270 165, 270 215, 276 245 L 270 255 C 265 255, 258 215, 265 172 Z"
                  fill="#181311"
                />
              )}
            </g>
          )}

          {/* Trâm Bạc Cài Tóc */}
          {config.headwearId === 'tram-cai-toc' && (
            <g id="headwear-tram-cai-toc">
              <circle cx="300" cy="132" r="19" fill="#181311" />
              <line x1="262" y1="125" x2="348" y2="137" stroke="#E5E7EB" strokeWidth="3.2" strokeLinecap="round" />
              <circle cx="348" cy="137" r="5.5" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />
            </g>
          )}
        </g>
        )}

        {/* 8. Editorial Brand Watermark */}
        <g id="editorial-brand-corner">
          <text x="24" y="38" fill="#78350F" fontSize="11" letterSpacing="0.22em" textAnchor="start" fontFamily="sans-serif" fontWeight="700">
            VIỆT PHỤC REMIX
          </text>
          <text x="24" y="54" fill="#9CA3AF" fontSize="10" textAnchor="start" fontFamily="sans-serif">
            {selectedGarment.name.toUpperCase()} · {isMale ? 'DÁNG NAM' : isFemale ? 'DÁNG NỮ' : 'UNISEX'}
          </text>
        </g>
      </svg>

      {/* Floating Mode Indicator Badge */}
      {!hideBadge && (
        <div className="absolute bottom-3 left-3 bg-white/92 backdrop-blur-md px-2.5 py-1.2 rounded-md text-[11px] text-stone-700 font-medium border border-stone-200/80 shadow-xs flex items-center gap-1.5 pointer-events-none">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedColor.hex }} />
          <span>{selectedColor.name.split(' (')[0]}</span>
          <span className="text-stone-300">/</span>
          <span>{selectedGarment.name.split(' (')[0]}</span>
          <span className="text-stone-300">/</span>
          <span className="font-semibold text-amber-900">{isMale ? 'Nam' : isFemale ? 'Nữ' : 'Unisex'}</span>
        </div>
      )}
    </div>
  );
};
