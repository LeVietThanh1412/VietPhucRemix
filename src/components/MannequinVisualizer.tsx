import React from 'react';
import { OutfitConfig } from '../types/vietphuc';
import { HERITAGE_COLORS, GARMENTS } from '../data/heritageData';

interface MannequinVisualizerProps {
  config: OutfitConfig;
  className?: string;
  isZoomed?: boolean;
}

export const MannequinVisualizer: React.FC<MannequinVisualizerProps> = ({
  config,
  className = '',
  isZoomed = false
}) => {
  const selectedColor = HERITAGE_COLORS.find(c => c.id === config.colorId) || HERITAGE_COLORS[0];
  const selectedGarment = GARMENTS.find(g => g.id === config.garmentId) || GARMENTS[0];

  // Helper colors
  const primaryHex = selectedColor.hex;
  const isDarkGarment = ['den-mun', 'lam-cham', 'tim-hue'].includes(selectedColor.id);
  const strokeColor = isDarkGarment ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.18)';
  const highlightHex = isDarkGarment ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.35)';

  // Bottom color mapping
  let bottomFill = '#FAF7F0';
  let bottomStroke = '#DCD5C5';
  if (config.bottomId === 'quan-lua-den') {
    bottomFill = '#1C1917';
    bottomStroke = '#44403C';
  } else if (config.bottomId === 'quan-jeans-suong') {
    bottomFill = '#607D8B';
    bottomStroke = '#455A64';
  } else if (config.bottomId === 'vay-xep-ly') {
    bottomFill = '#EFE9DF';
    bottomStroke = '#C8BDAB';
  } else if (config.bottomId === 'quan-palazzo') {
    bottomFill = '#D6CEBE';
    bottomStroke = '#B5A995';
  }

  // Backdrop gradient and decorative elements
  const renderBackdrop = () => {
    switch (config.backdrop) {
      case 'hoang-thanh':
        return (
          <g opacity="0.85">
            <rect width="600" height="800" fill="url(#bg-hoang-thanh)" />
            {/* Imperial Palace Silhouette */}
            <path
              d="M100 480 L180 430 L220 440 L300 390 L380 440 L420 430 L500 480 L520 650 L80 650 Z"
              fill="#261C14"
              opacity="0.12"
            />
            {/* Eaves & Curved Roof Lines */}
            <path d="M120 435 Q 210 395 300 390 Q 390 395 480 435" stroke="#B45309" strokeWidth="2.5" fill="none" opacity="0.3" />
            <circle cx="300" cy="240" r="140" fill="#FFFBEB" opacity="0.45" />
            <circle cx="300" cy="240" r="140" stroke="#FDE68A" strokeWidth="1" fill="none" opacity="0.3" />
          </g>
        );
      case 'pho-co':
        return (
          <g opacity="0.85">
            <rect width="600" height="800" fill="url(#bg-pho-co)" />
            {/* Old French Balcony & Lanterns */}
            <line x1="50" y1="120" x2="550" y2="120" stroke="#78350F" strokeWidth="1.5" opacity="0.25" />
            {/* Lantern 1 */}
            <path d="M120 120 L120 160 Q 140 180 120 220 Q 100 180 120 160 Z" fill="#DC2626" opacity="0.45" />
            <line x1="120" y1="220" x2="120" y2="250" stroke="#DC2626" strokeWidth="1.5" opacity="0.4" />
            {/* Lantern 2 */}
            <path d="M480 120 L480 170 Q 505 195 480 235 Q 455 195 480 170 Z" fill="#D97706" opacity="0.45" />
            <line x1="480" y1="235" x2="480" y2="265" stroke="#D97706" strokeWidth="1.5" opacity="0.4" />
            <circle cx="460" cy="180" r="90" fill="#FEF3C7" opacity="0.3" />
          </g>
        );
      case 'hieu-anh':
        return (
          <g opacity="0.85">
            <rect width="600" height="800" fill="url(#bg-hieu-anh)" />
            {/* Classic Indochine Photo Studio Arch */}
            <rect x="50" y="50" width="500" height="700" rx="250" fill="none" stroke="#78350F" strokeWidth="1.5" opacity="0.25" strokeDasharray="4 4" />
            <circle cx="300" cy="360" r="160" fill="#FAF6EE" opacity="0.6" />
          </g>
        );
      case 'studio-zen':
      default:
        return (
          <g opacity="0.85">
            <rect width="600" height="800" fill="url(#bg-studio-zen)" />
            <circle cx="300" cy="380" r="210" fill="#F5EFE6" opacity="0.7" />
            <circle cx="300" cy="380" r="210" stroke="#E5DEC9" strokeWidth="1.5" fill="none" opacity="0.5" />
          </g>
        );
    }
  };

  return (
    <div className={`relative w-full aspect-[3/4] max-w-[540px] mx-auto overflow-hidden rounded-2xl shadow-xl border border-stone-200/80 bg-[#FAF7F2] transition-all duration-300 ${className}`}>
      <svg
        viewBox={isZoomed ? "100 80 400 500" : "0 0 600 800"}
        className="w-full h-full object-contain select-none"
        aria-label="Minh họa phối trang phục Việt Phục Remix"
      >
        <defs>
          {/* Background Gradients */}
          <linearGradient id="bg-studio-zen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F9F6F0" />
            <stop offset="100%" stopColor="#EDE5D8" />
          </linearGradient>
          <linearGradient id="bg-hoang-thanh" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF7EE" />
            <stop offset="100%" stopColor="#EAD7C0" />
          </linearGradient>
          <linearGradient id="bg-pho-co" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FBF7EE" />
            <stop offset="100%" stopColor="#E2D4BE" />
          </linearGradient>
          <linearGradient id="bg-hieu-anh" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F7F1E5" />
            <stop offset="100%" stopColor="#D5C5AC" />
          </linearGradient>

          {/* Garment Silk Shading Gradient */}
          <linearGradient id="silk-sheen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.18" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="65%" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
          </linearGradient>

          {/* Pattern: Vân Mây Ngũ Sắc */}
          <pattern id="pattern-van-may" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 5 25 Q 15 10 25 25 Q 35 15 38 28 Q 20 35 5 25 Z"
              fill="none"
              stroke={isDarkGarment ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.12)'}
              strokeWidth="1.2"
            />
            <circle cx="20" cy="18" r="3" fill="none" stroke={isDarkGarment ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.1)'} strokeWidth="0.8" />
          </pattern>

          {/* Pattern: Hoa Sen Lý - Trần */}
          <pattern id="pattern-hoa-sen" width="50" height="50" patternUnits="userSpaceOnUse">
            <path
              d="M25 15 C20 22 20 28 25 35 C30 28 30 22 25 15 Z"
              fill={isDarkGarment ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'}
            />
            <path
              d="M18 20 C14 26 16 31 23 34 C19 28 19 23 18 20 Z"
              fill={isDarkGarment ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'}
            />
            <path
              d="M32 20 C36 26 34 31 27 34 C31 28 31 23 32 20 Z"
              fill={isDarkGarment ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'}
            />
          </pattern>

          {/* Pattern: Bát Bửu Cát Tường */}
          <pattern id="pattern-bat-buu" width="45" height="45" patternUnits="userSpaceOnUse">
            <circle cx="22.5" cy="22.5" r="9" fill="none" stroke={isDarkGarment ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.1)'} strokeWidth="1" />
            <path d="M15 22.5 L30 22.5 M22.5 15 L22.5 30" stroke={isDarkGarment ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.1)'} strokeWidth="1" />
          </pattern>

          {/* Pattern: Chữ Thọ */}
          <pattern id="pattern-chu-tho" width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="14" fill="none" stroke={isDarkGarment ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} strokeWidth="1.2" />
            <path d="M17 21 L33 21 M17 25 L33 25 M17 29 L33 29 M25 15 L25 35" stroke={isDarkGarment ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} strokeWidth="1" />
          </pattern>

          {/* Pattern: Chu Đậu */}
          <pattern id="pattern-chu-dau" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 0 20 Q 10 10 20 20 T 40 20" fill="none" stroke={isDarkGarment ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} strokeWidth="1.2" />
            <path d="M 0 26 Q 10 16 20 26 T 40 26" fill="none" stroke={isDarkGarment ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'} strokeWidth="1" />
          </pattern>
        </defs>

        {/* 1. Backdrop Rendering */}
        {renderBackdrop()}

        {/* Ground Shadow */}
        <ellipse cx="300" cy="740" rx="140" ry="18" fill="#1C1917" opacity="0.14" />

        {/* 2. Model Body Silhouette & Skin */}
        <g id="model-body">
          {/* Head & Neck */}
          <path d="M285 205 L285 245 L315 245 L315 205 Z" fill="#E8C9B5" stroke="#C89D86" strokeWidth="0.8" />
          {/* Face Oval */}
          <ellipse cx="300" cy="180" rx="36" ry="46" fill="#F5D9C8" stroke="#DAB39C" strokeWidth="0.8" />
          
          {/* Facial Features (Chic, Minimalist, Expressive) */}
          {/* Eyebrows */}
          <path d="M276 168 Q 287 165 293 168" stroke="#3D291F" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M307 168 Q 313 165 324 168" stroke="#3D291F" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          
          {/* Eyes (Gentle, friendly, confident) */}
          <path d="M277 176 Q 286 172 293 176" stroke="#261710" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M307 176 Q 314 172 323 176" stroke="#261710" strokeWidth="2" fill="none" strokeLinecap="round" />
          
          {/* Nose line */}
          <path d="M300 174 L300 187 L304 189" stroke="#C89D86" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          
          {/* Lips (Subtle red tint) */}
          <path d="M292 198 Q 300 202 308 198" stroke="#BE123C" strokeWidth="2.2" fill="none" strokeLinecap="round" />

          {/* Ears & Pearl Earring for female/unisex */}
          <ellipse cx="264" cy="180" rx="5" ry="9" fill="#E8C9B5" />
          <ellipse cx="336" cy="180" rx="5" ry="9" fill="#E8C9B5" />
          {config.modelGender !== 'male' && (
            <>
              <circle cx="264" cy="188" r="2.5" fill="#FDFBF7" stroke="#D1D5DB" strokeWidth="0.5" />
              <circle cx="336" cy="188" r="2.5" fill="#FDFBF7" stroke="#D1D5DB" strokeWidth="0.5" />
            </>
          )}

          {/* Modern Hair base */}
          {config.headwearId === 'none' && (
            config.modelGender === 'male' ? (
              <path
                d="M263 175 C 260 140, 340 140, 337 175 C 330 148, 270 148, 263 175 Z"
                fill="#241B18"
              />
            ) : (
              <g>
                {/* Flowing or bun hair */}
                <path
                  d="M260 178 C 255 130, 345 130, 340 178 C 345 220, 330 250, 330 250 L 325 240 C 330 210, 330 170, 300 148 C 270 170, 270 210, 275 240 L 270 250 C 270 250, 255 220, 260 178 Z"
                  fill="#1E1614"
                />
              </g>
            )
          )}
        </g>

        {/* 3. Lower Garment (Quần / Váy đi kèm) */}
        <g id="bottom-garment">
          {config.bottomId === 'vay-xep-ly' ? (
            /* Chân váy xếp ly dài */
            <g>
              <path
                d="M245 420 L220 670 Q 300 685 380 670 L355 420 Z"
                fill={bottomFill}
                stroke={bottomStroke}
                strokeWidth="1.5"
              />
              {/* Pleats vertical lines */}
              {[240, 260, 280, 300, 320, 340, 360].map((x, i) => (
                <line
                  key={i}
                  x1={245 + (x - 245) * 0.4}
                  y1="420"
                  x2={x}
                  y2="675"
                  stroke={bottomStroke}
                  strokeWidth="1"
                  opacity="0.8"
                />
              ))}
            </g>
          ) : (
            /* Quần ống suông (Lụa trắng, Lụa đen, Palazzo, Jeans) */
            <g>
              {/* Left Leg */}
              <path
                d="M255 420 L242 675 Q 268 680 294 675 L296 490 Z"
                fill={bottomFill}
                stroke={bottomStroke}
                strokeWidth="1.5"
              />
              {/* Right Leg */}
              <path
                d="M304 490 L306 675 Q 332 680 358 675 L345 420 Z"
                fill={bottomFill}
                stroke={bottomStroke}
                strokeWidth="1.5"
              />
              {/* Pant Seam & Fabric Shadow */}
              <line x1="300" y1="440" x2="300" y2="510" stroke={bottomStroke} strokeWidth="1.2" />
              {config.bottomId === 'quan-jeans-suong' && (
                <line x1="268" y1="440" x2="268" y2="675" stroke="#90A4AE" strokeWidth="1" strokeDasharray="3 2" />
              )}
            </g>
          )}
        </g>

        {/* 4. Footwear (Giày dép) */}
        <g id="footwear">
          {config.footwearId === 'sneaker-trang' && (
            <g>
              {/* Left Chunky Sneaker */}
              <path d="M236 675 L286 675 L290 695 Q 260 700 232 695 Z" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
              <rect x="230" y="692" width="62" height="12" rx="4" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1.2" />
              {/* Sneaker Accent */}
              <path d="M245 684 L275 684" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
              {/* Right Chunky Sneaker */}
              <path d="M312 675 L362 675 L366 695 Q 338 700 308 695 Z" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
              <rect x="306" y="692" width="62" height="12" rx="4" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1.2" />
              <path d="M321 684 L351 684" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}

          {config.footwearId === 'guoc-moc' && (
            <g>
              {/* Left Wooden Clog */}
              <path d="M244 680 L284 680 L286 696 L242 696 Z" fill="#B45309" stroke="#78350F" strokeWidth="1.2" />
              <path d="M250 674 Q 264 666 278 674" fill="none" stroke="#DC2626" strokeWidth="4.5" strokeLinecap="round" />
              {/* Right Wooden Clog */}
              <path d="M316 680 L356 680 L358 696 L314 696 Z" fill="#B45309" stroke="#78350F" strokeWidth="1.2" />
              <path d="M322 674 Q 336 666 350 674" fill="none" stroke="#DC2626" strokeWidth="4.5" strokeLinecap="round" />
            </g>
          )}

          {config.footwearId === 'giay-oxford' && (
            <g>
              {/* Oxford Brown/Black Leather */}
              <path d="M238 678 L288 678 L290 696 L234 696 Z" fill="#3E2723" stroke="#1B0000" strokeWidth="1.2" />
              <path d="M255 678 L265 678" stroke="#D7CCC8" strokeWidth="1.5" />
              <path d="M312 678 L362 678 L364 696 L308 696 Z" fill="#3E2723" stroke="#1B0000" strokeWidth="1.2" />
              <path d="M329 678 L339 678" stroke="#D7CCC8" strokeWidth="1.5" />
            </g>
          )}

          {config.footwearId === 'sandal-toi-gian' && (
            <g>
              <rect x="240" y="690" width="46" height="8" rx="2" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="1" />
              <line x1="250" y1="684" x2="276" y2="684" stroke="#5D4037" strokeWidth="2.5" />
              <rect x="314" y="690" width="46" height="8" rx="2" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="1" />
              <line x1="324" y1="684" x2="350" y2="684" stroke="#5D4037" strokeWidth="2.5" />
            </g>
          )}

          {config.footwearId === 'boot-da-co-thap' && (
            <g>
              <path d="M236 665 L286 665 L290 698 L232 698 Z" fill="#1C1917" stroke="#44403C" strokeWidth="1.2" />
              <path d="M312 665 L362 665 L366 698 L308 698 Z" fill="#1C1917" stroke="#44403C" strokeWidth="1.2" />
            </g>
          )}
        </g>

        {/* 5. Main Upper Garment (Lớp Áo Chính Theo Loại Việt Phục) */}
        <g id="main-garment">
          {/* Inner White Collar (Cổ lót trắng truyền thống) */}
          <path d="M288 238 L300 248 L312 238" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* CASE A: Áo Tấc (Áo Thụng Tay Rộng Triều Nguyễn) */}
          {config.garmentId === 'ao-tac' && (
            <g>
              {/* Flowing Wide Sleeves (Ống tay thụng buông dài 40cm) */}
              {/* Left Sleeve */}
              <path
                d="M245 255 L140 330 C 130 420, 160 520, 205 540 L235 440 Z"
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              {/* Right Sleeve */}
              <path
                d="M355 255 L460 330 C 470 420, 440 520, 395 540 L365 440 Z"
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              {/* Main Body (Vạt dài qua gối) */}
              <path
                d="M250 250 L350 250 L370 560 Q 300 575 230 560 Z"
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              {/* Pattern Texture Overlay */}
              {config.patternId !== 'plain-silk' && (
                <path
                  d="M250 250 L350 250 L370 560 Q 300 575 230 560 Z"
                  fill={`url(#pattern-${config.patternId})`}
                  opacity="0.8"
                />
              )}
              {/* Silk Sheen Overlay */}
              <path d="M250 250 L350 250 L370 560 Q 300 575 230 560 Z" fill="url(#silk-sheen)" />

              {/* Lập Lĩnh (Cổ áo đứng vuông vức) */}
              <path d="M285 236 L315 236 L317 252 L283 252 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              <path d="M285 236 L315 236" stroke="#FAF7EE" strokeWidth="2" />

              {/* 5 Cúc Khuy Áo Tấc (Ngũ Thường) */}
              {[254, 280, 310, 345, 385].map((y, idx) => (
                <g key={idx}>
                  <circle cx="308" cy={y} r="3.5" fill="#FBBF24" stroke="#78350F" strokeWidth="0.8" />
                  <path d="M302 280 L308 280" stroke="#78350F" strokeWidth="1" />
                </g>
              ))}

              {/* Vạt cong xẻ tà bên hông */}
              <path d="M250 430 L235 558" stroke={strokeColor} strokeWidth="1.5" />
              <path d="M350 430 L365 558" stroke={strokeColor} strokeWidth="1.5" />
            </g>
          )}

          {/* CASE B: Áo Ngũ Thân (Tay Chẽn) */}
          {config.garmentId === 'ao-ngu-than' && (
            <g>
              {/* Fitted Sleek Sleeves (Tay chẽn gọn gàng) */}
              <path d="M252 255 L215 360 L242 430 L260 415 L245 350 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              <path d="M348 255 L385 360 L358 430 L340 415 L355 350 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />

              {/* Main Body with gentle flare */}
              <path
                d="M252 250 L348 250 L362 525 Q 300 540 238 525 Z"
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              {config.patternId !== 'plain-silk' && (
                <path
                  d="M252 250 L348 250 L362 525 Q 300 540 238 525 Z"
                  fill={`url(#pattern-${config.patternId})`}
                  opacity="0.8"
                />
              )}
              <path d="M252 250 L348 250 L362 525 Q 300 540 238 525 Z" fill="url(#silk-sheen)" />

              {/* Lapel curve (Vạt nách cong đặc trưng ngũ thân) */}
              <path d="M300 252 Q 320 270 318 310 L 318 530" stroke={strokeColor} strokeWidth="1.5" fill="none" />

              {/* Cổ đứng & 5 khuy cúc đồng */}
              <path d="M286 236 L314 236 L316 252 L284 252 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              {[253, 276, 305, 340, 380].map((y, idx) => (
                <g key={idx}>
                  <circle cx="316" cy={y} r="3" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                </g>
              ))}

              {/* Wrist Cuffs (Cửa tay áo chẽn) */}
              <rect x="232" y="420" width="18" height="8" rx="2" fill="#FAF5E8" stroke="#D1C7B7" strokeWidth="1" />
              <rect x="350" y="420" width="18" height="8" rx="2" fill="#FAF5E8" stroke="#D1C7B7" strokeWidth="1" />
            </g>
          )}

          {/* CASE C: Áo Tứ Thân & Yếm Đào */}
          {config.garmentId === 'ao-tu-than' && (
            <g>
              {/* Inner Yếm Đào (Lotus Pink Silk Camisole) */}
              <path d="M282 245 Q 300 270 318 245 L 322 340 L 278 340 Z" fill="#E11D48" stroke="#9F1239" strokeWidth="1.2" />
              {/* Neck Ribbon of Yếm */}
              <path d="M292 245 Q 300 238 308 245" stroke="#FFE4E6" strokeWidth="2" fill="none" />

              {/* Open Outer 4-Panel Robe (2 Front Panels Tied or Flowing) */}
              {/* Sleeves */}
              <path d="M250 255 L200 370 L225 435 L245 425 L230 360 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              <path d="M350 255 L400 370 L375 435 L355 425 L370 360 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />

              {/* Back Panels showing at sides */}
              <path d="M250 255 L276 255 L260 550 L228 535 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              <path d="M350 255 L324 255 L340 550 L372 535 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />

              {/* Front Tied Panels (Hai vạt buộc chéo duyên dáng) */}
              <path d="M272 340 L285 415 L260 520 L248 510 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              <path d="M328 340 L315 415 L340 520 L352 510 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />

              {/* Dải Thắt Lưng Bao Lụa (Sash Ribbon) */}
              <rect x="270" y="340" width="60" height="20" rx="3" fill="#10B981" stroke="#047857" strokeWidth="1" />
              {/* Hanging sash ends */}
              <path d="M290 358 L285 460 L295 460 L300 358 Z" fill="#F59E0B" opacity="0.9" />
              <path d="M300 358 L308 450 L318 450 L310 358 Z" fill="#EC4899" opacity="0.9" />
            </g>
          )}

          {/* CASE D: Áo Nhật Bình (Triều Phục Hậu Phi) */}
          {config.garmentId === 'ao-nhat-binh' && (
            <g>
              {/* Wide Royal Sleeves with Five-Color Bands */}
              <path d="M246 255 L155 335 L190 480 L230 420 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              <path d="M354 255 L445 335 L410 480 L370 420 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />

              {/* Ngũ Sắc Sleeve Bands (Xanh, Đỏ, Vàng, Trắng, Chàm) */}
              <g>
                <path d="M165 350 L195 470" stroke="#0284C7" strokeWidth="4" />
                <path d="M169 352 L199 472" stroke="#DC2626" strokeWidth="4" />
                <path d="M173 354 L203 474" stroke="#FBBF24" strokeWidth="4" />
                <path d="M435 350 L405 470" stroke="#0284C7" strokeWidth="4" />
                <path d="M431 352 L401 472" stroke="#DC2626" strokeWidth="4" />
                <path d="M427 354 L397 474" stroke="#FBBF24" strokeWidth="4" />
              </g>

              {/* Main Robe */}
              <path d="M248 250 L352 250 L368 560 Q 300 575 232 560 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              {config.patternId !== 'plain-silk' && (
                <path d="M248 250 L352 250 L368 560 Q 300 575 232 560 Z" fill={`url(#pattern-${config.patternId})`} opacity="0.8" />
              )}
              <path d="M248 250 L352 250 L368 560 Q 300 575 232 560 Z" fill="url(#silk-sheen)" />

              {/* Distinctive Rectangular Collar (Cổ áo Nhật Bình) */}
              <rect x="272" y="246" width="56" height="95" rx="3" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
              {/* Inner rectangular cutout */}
              <rect x="282" y="252" width="36" height="85" fill={primaryHex} />

              {/* Embroidered Rainbow Border on Collar */}
              <rect x="275" y="248" width="50" height="90" fill="none" stroke="#DC2626" strokeWidth="2.5" />
              <rect x="278" y="250" width="44" height="86" fill="none" stroke="#FBBF24" strokeWidth="2" />

              {/* Dangling Embroidered Front Ribbons (Hai dải thắt trước ngực) */}
              <rect x="284" y="340" width="12" height="180" fill="#B45309" stroke="#78350F" strokeWidth="1" />
              <rect x="304" y="340" width="12" height="180" fill="#B45309" stroke="#78350F" strokeWidth="1" />
              {/* Golden Phoenix/Flower motifs on ribbons */}
              {[360, 400, 440, 480].map((ry, i) => (
                <g key={i}>
                  <circle cx="290" cy={ry} r="3" fill="#FEF08A" />
                  <circle cx="310" cy={ry} r="3" fill="#FEF08A" />
                </g>
              ))}
            </g>
          )}

          {/* CASE E: Áo Giao Lĩnh (Vạt Chéo Thời Lê) */}
          {config.garmentId === 'ao-giao-linh' && (
            <g>
              {/* Wide Classical Flowing Sleeves */}
              <path d="M248 255 L160 350 L205 460 L242 410 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              <path d="M352 255 L440 350 L395 460 L358 410 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />

              {/* Main Body */}
              <path d="M250 250 L350 250 L365 545 Q 300 560 235 545 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              {config.patternId !== 'plain-silk' && (
                <path d="M250 250 L350 250 L365 545 Q 300 560 235 545 Z" fill={`url(#pattern-${config.patternId})`} opacity="0.8" />
              )}
              <path d="M250 250 L350 250 L365 545 Q 300 560 235 545 Z" fill="url(#silk-sheen)" />

              {/* Iconic Crossed Collar (Vạt trái đè vạt phải) */}
              <path d="M272 238 L330 350 L315 350 L260 248 Z" fill="#FDFBF7" stroke="#D1D5DB" strokeWidth="1.5" />
              <path d="M328 238 L270 350 L285 350 L340 248 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.5" />
              <line x1="272" y1="238" x2="330" y2="350" stroke={strokeColor} strokeWidth="2" />

              {/* Waist Sash (Đai thắt lưng vải) */}
              <rect x="260" y="348" width="80" height="18" rx="2" fill="#292524" stroke="#44403C" strokeWidth="1.2" />
              <path d="M292 366 L288 470 L298 470 L302 366 Z" fill="#292524" />
            </g>
          )}

          {/* CASE F: Áo Dài Tân Thời / Lemur Cách Tân */}
          {config.garmentId === 'ao-dai-tan-thoi' && (
            <g>
              {/* Slim fitted sleeves */}
              <path d="M256 255 L225 360 L246 430 L262 418 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.2" />
              <path d="M344 255 L375 360 L354 430 L338 418 Z" fill={primaryHex} stroke={strokeColor} strokeWidth="1.2" />

              {/* Fitted Bodice with High Slits (Tà dài thướt tha) */}
              <path
                d="M258 250 L342 250 L332 340 L352 570 Q 300 580 248 570 L268 340 Z"
                fill={primaryHex}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              {config.patternId !== 'plain-silk' && (
                <path
                  d="M258 250 L342 250 L332 340 L352 570 Q 300 580 248 570 L268 340 Z"
                  fill={`url(#pattern-${config.patternId})`}
                  opacity="0.8"
                />
              )}
              <path d="M258 250 L342 250 L332 340 L352 570 Q 300 580 248 570 L268 340 Z" fill="url(#silk-sheen)" />

              {/* Lemur stylized collar (cổ tim hoặc cánh sen) */}
              <path d="M285 242 Q 300 256 315 242" stroke={strokeColor} strokeWidth="2" fill="none" />
              {/* Row of side pearl buttons */}
              {[254, 274, 296, 320].map((by, i) => (
                <circle key={i} cx="318 + (i * 2)" cy={by} r="2.5" fill="#FAF5FF" stroke="#A855F7" strokeWidth="0.6" />
              ))}
            </g>
          )}
        </g>

        {/* 6. Accessories On-Body (Kiềng bạc, Kính, Túi, Quạt, Khăn) */}
        <g id="accessories">
          {/* Kiềng Bạc Chạm Hoa Mai */}
          {config.accessories.includes('kieng-bac') && (
            <path
              d="M282 254 Q 300 274 318 254"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="5"
              strokeLinecap="round"
              filter="drop-shadow(0 2px 3px rgba(0,0,0,0.25))"
            />
          )}

          {/* Choker Ngọc Trai */}
          {config.accessories.includes('choker-ngoc-trai') && (
            <g>
              {[286, 292, 298, 304, 310, 314].map((cx, i) => (
                <circle key={i} cx={cx} cy={246 + Math.sin(i * 0.5) * 4} r="3" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="0.6" />
              ))}
            </g>
          )}

          {/* Kính Mắt Y2K Râm Retro */}
          {config.accessories.includes('kinh-mat-y2k') && (
            <g>
              {/* Left Lens Cat-eye */}
              <path d="M272 172 L294 174 L290 182 L274 180 Z" fill="#18181B" stroke="#27272A" strokeWidth="1" />
              {/* Right Lens Cat-eye */}
              <path d="M306 174 L328 172 L326 180 L310 182 Z" fill="#18181B" stroke="#27272A" strokeWidth="1" />
              {/* Bridge */}
              <line x1="294" y1="174" x2="306" y2="174" stroke="#18181B" strokeWidth="1.8" />
            </g>
          )}

          {/* Kính Gọng Tròn Thư Sinh */}
          {config.accessories.includes('kinh-gong-tron') && (
            <g>
              <circle cx="284" cy="176" r="8" fill="none" stroke="#B45309" strokeWidth="1.4" />
              <circle cx="316" cy="176" r="8" fill="none" stroke="#B45309" strokeWidth="1.4" />
              <line x1="292" y1="176" x2="308" y2="176" stroke="#B45309" strokeWidth="1.4" />
            </g>
          )}

          {/* Quạt Xếp Giấy Dó In Thơ Nôm */}
          {config.accessories.includes('quat-giay-do') && (
            <g transform="translate(355, 390) rotate(15)">
              <path d="M0 0 L40 -35 A 50 50 0 0 1 70 5 L0 0 Z" fill="#FEF3C7" stroke="#78350F" strokeWidth="1.2" />
              {/* Fan folds */}
              <line x1="0" y1="0" x2="48" y2="-22" stroke="#B45309" strokeWidth="0.8" />
              <line x1="0" y1="0" x2="58" y2="-10" stroke="#B45309" strokeWidth="0.8" />
              <line x1="0" y1="0" x2="65" y2="0" stroke="#B45309" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="3" fill="#DC2626" />
            </g>
          )}

          {/* Túi Tote Vải Chàm Thêu Thư Pháp */}
          {config.accessories.includes('tui-tote-cham') && (
            <g transform="translate(200, 390)">
              {/* Shoulder Strap */}
              <path d="M25 -60 Q 20 -20 20 0" stroke="#1E3A8A" strokeWidth="3" fill="none" />
              {/* Bag Body */}
              <rect x="0" y="0" width="50" height="60" rx="3" fill="#1E3A8A" stroke="#172554" strokeWidth="1.2" />
              {/* Embroidery character */}
              <circle cx="25" cy="30" r="12" fill="none" stroke="#FAF5FF" strokeWidth="1" strokeDasharray="2 2" />
              <text x="25" y="34" fontSize="12" fill="#FAF5FF" textAnchor="middle" fontFamily="serif">Việt</text>
            </g>
          )}

          {/* Túi Cói Mây Tre Đan */}
          {config.accessories.includes('tui-coi-dan') && (
            <g transform="translate(205, 400)">
              <path d="M20 -40 Q 20 -15 20 0" stroke="#78350F" strokeWidth="2.5" fill="none" />
              <circle cx="20" cy="22" r="22" fill="#D97706" stroke="#92400E" strokeWidth="1.2" />
              <circle cx="20" cy="22" r="16" fill="none" stroke="#FEF3C7" strokeWidth="1" strokeDasharray="3 2" />
            </g>
          )}
        </g>

        {/* 7. Headwear (Nón, Khăn đóng, Khăn vấn, Bờm, Trâm) */}
        <g id="headwear">
          {/* Khăn Vấn Nhung (Nữ & Unisex) */}
          {config.headwearId === 'khan-van' && (
            <g>
              {/* Velvet Rolls wrapping around head */}
              <ellipse cx="300" cy="150" rx="44" ry="20" fill="#1C1917" stroke="#44403C" strokeWidth="1.5" />
              <ellipse cx="300" cy="146" rx="42" ry="18" fill="#292524" stroke="#57534E" strokeWidth="1" />
              <ellipse cx="300" cy="142" rx="40" ry="16" fill="#1C1917" stroke="#44403C" strokeWidth="1" />
            </g>
          )}

          {/* Khăn Đóng Nam (Xếp Nếp Chữ Nhân) */}
          {config.headwearId === 'khan-dong' && (
            <g>
              <ellipse cx="300" cy="148" rx="42" ry="18" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
              {/* Distinctive V-fold on forehead */}
              <path d="M285 142 L300 152 L315 142" stroke="#94A3B8" strokeWidth="1.8" fill="none" />
            </g>
          )}

          {/* Nón Quai Thao (Nón Ba Tầm) */}
          {config.headwearId === 'non-quai-thao' && (
            <g>
              {/* Broad flat woven hat */}
              <ellipse cx="300" cy="125" rx="100" ry="24" fill="#FDE68A" stroke="#B45309" strokeWidth="1.8" />
              <ellipse cx="300" cy="125" rx="88" ry="20" fill="none" stroke="#D97706" strokeWidth="1" strokeDasharray="3 2" />
              {/* Thao Silk Ribbon dropping to waist */}
              <path d="M240 135 Q 230 250 240 400" stroke="#1C1917" strokeWidth="3" fill="none" />
              <path d="M360 135 Q 370 250 360 400" stroke="#1C1917" strokeWidth="3" fill="none" />
            </g>
          )}

          {/* Nón Lá Bài Thơ Xứ Huế */}
          {config.headwearId === 'non-la' && (
            <g>
              {/* Conical Hat */}
              <path d="M300 80 L210 155 Q 300 172 390 155 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
              {/* Rim & Ring Stitches */}
              <path d="M230 140 Q 300 154 370 140" fill="none" stroke="#FBBF24" strokeWidth="1" />
              <path d="M255 120 Q 300 132 345 120" fill="none" stroke="#FBBF24" strokeWidth="1" />
              {/* Silk Chin Strap */}
              <path d="M260 155 Q 300 215 340 155" stroke="#EC4899" strokeWidth="2.5" fill="none" />
            </g>
          )}

          {/* Bờm Ngọc Trai Cách Tân */}
          {config.headwearId === 'bom-ngoc-trai' && (
            <g>
              <path d="M265 168 A 38 42 0 0 1 335 168" stroke="#7C3AED" strokeWidth="7" fill="none" strokeLinecap="round" />
              {[272, 282, 292, 300, 308, 318, 328].map((px, i) => (
                <circle key={i} cx={px} cy={138 + Math.abs(px - 300) * 0.3} r="3.2" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="0.8" />
              ))}
            </g>
          )}

          {/* Trâm Bạc Cài Tóc */}
          {config.headwearId === 'tram-cai-toc' && (
            <g>
              {/* Bun with hair pin */}
              <circle cx="300" cy="132" r="18" fill="#1C1917" />
              <line x1="265" y1="126" x2="345" y2="136" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" />
              <circle cx="345" cy="136" r="5" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />
            </g>
          )}
        </g>

        {/* 8. Modern Editorial Floating Badges */}
        <g id="editorial-brand-corner">
          <text x="24" y="38" fill="#78350F" fontSize="11" letterSpacing="0.2em" textAnchor="start" fontFamily="sans-serif" fontWeight="600">
            VIỆT PHỤC REMIX
          </text>
          <text x="24" y="54" fill="#9CA3AF" fontSize="10" textAnchor="start" fontFamily="sans-serif">
            {selectedGarment.name.toUpperCase()}
          </text>
        </g>
      </svg>

      {/* Floating Mode Indicator Badge */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-stone-700 font-medium border border-stone-200/80 shadow-xs flex items-center gap-1.5 pointer-events-none">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedColor.hex }} />
        <span>{selectedColor.name.split(' (')[0]}</span>
        <span className="text-stone-300">/</span>
        <span>{selectedGarment.dynasty.split(' (')[0]}</span>
      </div>
    </div>
  );
};
