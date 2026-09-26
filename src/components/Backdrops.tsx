import React from 'react';
import { OutfitConfig } from '../types/vietphuc';

interface BackdropProps {
  uid: string;
}

export const BackdropDefs: React.FC<BackdropProps> = ({ uid }) => {
  return (
    <>
      {/* ─── Sky & Atmosphere Gradients ─── */}
      <linearGradient id={`${uid}bg-hoang-thanh`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#110D1F" />
        <stop offset="28%" stopColor="#2A1428" />
        <stop offset="60%" stopColor="#5E1A23" />
        <stop offset="82%" stopColor="#9A3C17" />
        <stop offset="100%" stopColor="#3B130E" />
      </linearGradient>

      <linearGradient id={`${uid}bg-pho-co`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#181024" />
        <stop offset="30%" stopColor="#461B2E" />
        <stop offset="65%" stopColor="#8C3A16" />
        <stop offset="88%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>

      <linearGradient id={`${uid}bg-hieu-anh`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FAF5EB" />
        <stop offset="45%" stopColor="#EFE2CD" />
        <stop offset="80%" stopColor="#DFC8AB" />
        <stop offset="100%" stopColor="#C2AC8A" />
      </linearGradient>

      <linearGradient id={`${uid}bg-studio-zen`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FAF7F0" />
        <stop offset="50%" stopColor="#F2E8DA" />
        <stop offset="100%" stopColor="#E4D5BE" />
      </linearGradient>

      {/* ─── Architectural & Material Gradients ─── */}
      <linearGradient id={`${uid}hoang-thanh-pillar`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#450808" />
        <stop offset="22%" stopColor="#7F1D1D" />
        <stop offset="50%" stopColor="#B91C1C" />
        <stop offset="78%" stopColor="#7F1D1D" />
        <stop offset="100%" stopColor="#300404" />
      </linearGradient>

      <linearGradient id={`${uid}hoang-thanh-tile`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>

      <linearGradient id={`${uid}hoang-thanh-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>

      <linearGradient id={`${uid}wall-hoian-left`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#6E2F0A" />
        <stop offset="25%" stopColor="#B45309" />
        <stop offset="65%" stopColor="#D97706" />
        <stop offset="90%" stopColor="#92400E" />
        <stop offset="100%" stopColor="#451A03" />
      </linearGradient>

      <linearGradient id={`${uid}wall-hoian-right`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#713F12" />
        <stop offset="30%" stopColor="#CA8A04" />
        <stop offset="70%" stopColor="#EAB308" />
        <stop offset="95%" stopColor="#A16207" />
        <stop offset="100%" stopColor="#422006" />
      </linearGradient>

      <linearGradient id={`${uid}tile-yinyang`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1C1917" />
        <stop offset="45%" stopColor="#292524" />
        <stop offset="75%" stopColor="#3E3D34" />
        <stop offset="100%" stopColor="#1C1917" />
      </linearGradient>

      <linearGradient id={`${uid}curtain-velvet`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#260305" />
        <stop offset="18%" stopColor="#5E0D14" />
        <stop offset="45%" stopColor="#991B1B" />
        <stop offset="60%" stopColor="#B91C1C" />
        <stop offset="82%" stopColor="#7F1D1D" />
        <stop offset="100%" stopColor="#1D0204" />
      </linearGradient>

      <linearGradient id={`${uid}gold-cord`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="40%" stopColor="#F59E0B" />
        <stop offset="75%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>

      <linearGradient id={`${uid}lotus-petal`} x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#FFFDF7" />
        <stop offset="60%" stopColor="#FCE7F3" />
        <stop offset="85%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#DB2777" />
      </linearGradient>

      {/* ─── Radial Lighting & Atmospheric Halos ─── */}
      <radialGradient id={`${uid}moon-glow`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FEF9C3" stopOpacity="0.85" />
        <stop offset="50%" stopColor="#FEF08A" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
      </radialGradient>

      <radialGradient id={`${uid}moon-halo-outer`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.45" />
        <stop offset="65%" stopColor="#FDE68A" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
      </radialGradient>

      <radialGradient id={`${uid}glow-red`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F87171" stopOpacity="0.9" />
        <stop offset="45%" stopColor="#DC2626" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
      </radialGradient>

      <radialGradient id={`${uid}glow-yellow`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FDE047" stopOpacity="0.9" />
        <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
      </radialGradient>

      <radialGradient id={`${uid}glow-green`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.85" />
        <stop offset="50%" stopColor="#0D9488" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
      </radialGradient>

      <radialGradient id={`${uid}glow-purple`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#C084FC" stopOpacity="0.85" />
        <stop offset="50%" stopColor="#7E22CE" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#7E22CE" stopOpacity="0" />
      </radialGradient>

      <radialGradient id={`${uid}spotlight-glow`} cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#FFFDF6" stopOpacity="0.95" />
        <stop offset="55%" stopColor="#FBF2E2" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#FBF2E2" stopOpacity="0" />
      </radialGradient>

      <radialGradient id={`${uid}zen-backlight`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.75" />
        <stop offset="55%" stopColor="#FDE68A" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
      </radialGradient>

      {/* ─── Indochine 1930s Encaustic Cement Tile Pattern (Gạch Bông Đông Dương) ─── */}
      <pattern id={`${uid}pattern-gach-bong`} width="44" height="44" patternUnits="userSpaceOnUse">
        <rect width="44" height="44" fill="#FAF6EE" stroke="#E7DEC8" strokeWidth="0.8" />
        {/* Outer geometric diamond */}
        <polygon points="22,2 42,22 22,42 2,22" fill="#EAD9BC" stroke="#D1BE9B" strokeWidth="0.8" />
        {/* Center 8-pointed star / floral medallion */}
        <circle cx="22" cy="22" r="8" fill="#3E2723" />
        <circle cx="22" cy="22" r="6" fill="#8D6E63" />
        <circle cx="22" cy="22" r="3" fill="#D7CCC8" />
        {/* Corner quadrant ornaments */}
        <circle cx="0" cy="0" r="6" fill="#8D6E63" />
        <circle cx="44" cy="0" r="6" fill="#8D6E63" />
        <circle cx="44" cy="44" r="6" fill="#8D6E63" />
        <circle cx="0" cy="44" r="6" fill="#8D6E63" />
        <circle cx="0" cy="0" r="3" fill="#FAF6EE" />
        <circle cx="44" cy="0" r="3" fill="#FAF6EE" />
        <circle cx="44" cy="44" r="3" fill="#FAF6EE" />
        <circle cx="0" cy="44" r="3" fill="#FAF6EE" />
      </pattern>

      {/* ─── Pure Vietnamese Architectural & Cultural Gradients ─── */}
      {/* Tre Ngà Việt Nam (Golden Ivory Bamboo) */}
      <linearGradient id={`${uid}viet-bamboo-stalk`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#A16207" />
        <stop offset="25%" stopColor="#EAB308" />
        <stop offset="55%" stopColor="#FEF08A" />
        <stop offset="85%" stopColor="#CA8A04" />
        <stop offset="100%" stopColor="#854D0E" />
      </linearGradient>

      {/* Khung Nguyệt Môn Gỗ Mun (Vietnamese Moon Gate) */}
      <linearGradient id={`${uid}viet-moon-gate`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3F2012" />
        <stop offset="45%" stopColor="#5C2E17" />
        <stop offset="80%" stopColor="#2E1408" />
        <stop offset="100%" stopColor="#1C0A02" />
      </linearGradient>

      {/* Vân Mây Hoàng Triều / Thời Lý (Lý Dynasty Cloud Scroll Gold) */}
      <linearGradient id={`${uid}viet-cloud-gold`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#FEF08A" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#D97706" stopOpacity="0.75" />
      </linearGradient>
    </>
  );
};

/** 1. HOÀNG THÀNH HUẾ (Cung Đình Triều Nguyễn) */
export const BackdropHoangThanh: React.FC<BackdropProps> = ({ uid }) => {
  return (
    <g id="backdrop-hoang-thanh">
      {/* Sky base */}
      <rect width="600" height="800" fill={`url(#${uid}bg-hoang-thanh)`} />

      {/* Distant Mountains (Núi Ngự Bình & Kim Phụng) */}
      <path
        d="M0 375 Q 85 340 170 355 Q 260 370 330 335 Q 430 315 520 345 Q 565 360 600 350 L 600 450 L 0 450 Z"
        fill="#1C1428"
        opacity="0.65"
      />
      <path
        d="M0 405 Q 120 375 240 395 Q 360 410 480 378 L 600 395 L 600 460 L 0 460 Z"
        fill="#261726"
        opacity="0.5"
      />

      {/* Celestial Imperial Full Moon */}
      <circle cx="300" cy="180" r="160" fill={`url(#${uid}moon-halo-outer)`} />
      <circle cx="300" cy="180" r="115" fill={`url(#${uid}moon-glow)`} />
      <circle cx="300" cy="180" r="82" fill="#FFFDF2" opacity="0.94" stroke="#FDE68A" strokeWidth="1.5" />
      {/* Moon surface marbling (Vân Nguyệt) */}
      <path d="M260 162 Q 285 145 320 155 Q 300 178 270 176 Z" fill="#EAD9BA" opacity="0.25" />
      <circle cx="280" cy="150" r="8" fill="#E5D0A8" opacity="0.18" />
      <circle cx="330" cy="195" r="11" fill="#E5D0A8" opacity="0.18" />

      {/* Auspicious Royal Clouds (Mây Ngũ Sắc Triều Nguyễn) */}
      <g opacity="0.8">
        {/* Left flowing cloud ribbon */}
        <path
          d="M20 145 C 50 125, 80 125, 105 140 C 130 120, 165 125, 185 142 C 215 130, 245 140, 255 160 C 235 178, 195 172, 175 160 C 145 175, 95 170, 65 158 C 45 168, 15 162, 20 145 Z"
          fill="#FED7AA"
          opacity="0.6"
          stroke="#FCD34D"
          strokeWidth="1.2"
        />
        {/* Right flowing cloud ribbon */}
        <path
          d="M580 170 C 550 150, 520 150, 495 165 C 470 145, 435 150, 415 168 C 385 155, 355 165, 345 185 C 365 202, 405 198, 425 185 C 455 200, 505 195, 535 182 C 555 192, 585 188, 580 170 Z"
          fill="#FDE68A"
          opacity="0.6"
          stroke="#FCD34D"
          strokeWidth="1.2"
        />
        {/* Subtle cloud drift across moon */}
        <path
          d="M210 215 C 240 205, 270 210, 295 205 C 330 200, 360 208, 390 200 C 370 214, 335 212, 310 215 C 275 220, 245 224, 210 215 Z"
          fill="#FED7AA"
          opacity="0.45"
        />
      </g>

      {/* Floating Golden Sparks / Fireflies */}
      {[
        { cx: 85, cy: 110, r: 1.5 },
        { cx: 140, cy: 90, r: 1.2 },
        { cx: 220, cy: 130, r: 1.8 },
        { cx: 380, cy: 115, r: 1.5 },
        { cx: 460, cy: 85, r: 1.2 },
        { cx: 520, cy: 130, r: 1.6 }
      ].map((dot, i) => (
        <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill="#FEF08A" opacity="0.75" />
      ))}

      {/* ─── Imperial Palace Architecture (Ngọ Môn / Điện Thái Hòa - Triều Nguyễn Thuần Việt) ─── */}
      <g id="palace-architecture">
        {/* UPPER ROOF TIER (Mái Thượng Cung Điện Huế) */}
        <g id="upper-roof">
          {/* Main Upper Roof Body - Authentic straight tropical pitch, no hyperbolic pagoda sag */}
          <polygon
            points="160,350 440,350 480,386 120,386"
            fill={`url(#${uid}hoang-thanh-tile)`}
            stroke="#92400E"
            strokeWidth="1.2"
          />
          {/* Straight Horizontal Eaves Band (Bờ Diềm Mái Thượng) */}
          <line x1="110" y1="386" x2="490" y2="386" stroke={`url(#${uid}hoang-thanh-gold)`} strokeWidth="3" />
          <line x1="110" y1="389" x2="490" y2="389" stroke="#78350F" strokeWidth="1" />

          {/* Authentic Huế Imperial Dragon Finials at Eave Corners (Đầu Đao Giao Long Cẩn Sành Sứ) */}
          {/* Left Corner Giao Long */}
          <path
            d="M110 386 C 96 384, 86 376, 90 366 C 94 372, 102 378, 114 383 Z"
            fill={`url(#${uid}hoang-thanh-gold)`}
            stroke="#92400E"
            strokeWidth="1"
          />
          <circle cx="92" cy="368" r="1.5" fill="#DC2626" />
          {/* Right Corner Giao Long */}
          <path
            d="M490 386 C 504 384, 514 376, 510 366 C 506 372, 498 378, 486 383 Z"
            fill={`url(#${uid}hoang-thanh-gold)`}
            stroke="#92400E"
            strokeWidth="1"
          />
          <circle cx="508" cy="368" r="1.5" fill="#DC2626" />

          {/* Straight Ridge Cap (Bờ Nóc Thẳng) */}
          <line x1="150" y1="350" x2="450" y2="350" stroke="#78350F" strokeWidth="3" />
          <line x1="152" y1="349" x2="448" y2="349" stroke={`url(#${uid}hoang-thanh-gold)`} strokeWidth="1.8" />

          {/* Central Ridge Crest: Lưỡng Long Chầu Nguyệt Triều Nguyễn (Hai rồng cẩn sứ chầu nguyệt châu) */}
          {/* Center Flame Jewel (Nguyệt Châu / Thái Cực Hỏa Diệm) */}
          <circle cx="300" cy="342" r="7" fill={`url(#${uid}hoang-thanh-gold)`} stroke="#B45309" strokeWidth="1" />
          <circle cx="300" cy="342" r="4.5" fill="#EF4444" />
          <circle cx="300" cy="342" r="2.2" fill="#FEF08A" />
          <path d="M296 337 Q 300 328 304 337" stroke="#EF4444" strokeWidth="1.8" fill="none" />
          {/* Left Dragon (Rồng chầu trái) */}
          <path
            d="M210 350 C 230 340, 252 346, 274 341 C 282 339, 288 342, 292 343"
            stroke={`url(#${uid}hoang-thanh-gold)`}
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M210 350 L 202 344 L 206 350 Z" fill={`url(#${uid}hoang-thanh-gold)`} stroke="#92400E" strokeWidth="0.8" />
          {/* Right Dragon (Rồng chầu phải) */}
          <path
            d="M390 350 C 370 340, 348 346, 326 341 C 318 339, 312 342, 308 343"
            stroke={`url(#${uid}hoang-thanh-gold)`}
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M390 350 L 398 344 L 394 350 Z" fill={`url(#${uid}hoang-thanh-gold)`} stroke="#92400E" strokeWidth="0.8" />

          {/* Yellow Glazed Tile Ridges (Ngói Ống Hoàng Lưu Ly) */}
          {[155, 185, 215, 245, 275, 300, 325, 355, 385, 415, 445].map((rx, idx) => (
            <line
              key={idx}
              x1={rx}
              y1="352"
              x2={rx + (rx - 300) * 0.18}
              y2="385"
              stroke="#FEF08A"
              strokeWidth="1.3"
              opacity="0.8"
            />
          ))}

          {/* Cổ Diêm (Khoảng Ngăn Giữa 2 Mái - Trang Trí Ô Hộc Thơ Cung Đình) */}
          <rect x="135" y="389" width="330" height="13" fill="#380909" stroke="#78350F" strokeWidth="0.8" />
          {[160, 205, 250, 295, 340, 385, 430].map((ox, i) => (
            <g key={i}>
              <rect x={ox - 16} y="391" width="32" height="9" rx="1" fill="#4D0F0F" stroke="#B45309" strokeWidth="0.6" />
              <line x1={ox - 10} y1="395" x2={ox + 10} y2="395" stroke="#FEF08A" strokeWidth="0.8" opacity="0.75" />
            </g>
          ))}
        </g>

        {/* LOWER ROOF TIER (Mái Hạ Trùng Thiềm - Phom Thẳng Thoát Nước Nhiệt Đới) */}
        <g id="lower-roof">
          {/* Straight Lower Roof Slope */}
          <polygon
            points="65,402 535,402 575,442 25,442"
            fill={`url(#${uid}hoang-thanh-tile)`}
            stroke="#92400E"
            strokeWidth="1.2"
          />
          {/* Straight Eaves Line */}
          <line x1="15" y1="442" x2="585" y2="442" stroke={`url(#${uid}hoang-thanh-gold)`} strokeWidth="3.5" />
          <line x1="15" y1="445" x2="585" y2="445" stroke="#78350F" strokeWidth="1" />

          {/* Lower Eave Corner Giao Long Finials */}
          <path
            d="M15 442 C 0 440, -8 430, -2 418 C 3 425, 10 432, 22 438 Z"
            fill={`url(#${uid}hoang-thanh-gold)`}
            stroke="#92400E"
            strokeWidth="1"
          />
          <path
            d="M585 442 C 600 440, 608 430, 602 418 C 597 425, 590 432, 578 438 Z"
            fill={`url(#${uid}hoang-thanh-gold)`}
            stroke="#92400E"
            strokeWidth="1"
          />

          {/* Glazed Tile Ridges Lower Roof */}
          {[45, 80, 115, 150, 185, 220, 255, 285, 315, 345, 380, 415, 450, 485, 520, 555].map((rx, idx) => (
            <line
              key={idx}
              x1={rx}
              y1="404"
              x2={rx + (rx - 300) * 0.16}
              y2="442"
              stroke="#FEF08A"
              strokeWidth="1.3"
              opacity="0.75"
            />
          ))}
          {/* Shaded Timber Under-beam & Bracket Frieze */}
          <rect x="28" y="445" width="544" height="15" fill="#240808" stroke="#450808" strokeWidth="0.8" />
          {[55, 95, 135, 175, 215, 255, 295, 335, 375, 415, 455, 495, 535].map((bx, i) => (
            <rect key={i} x={bx - 4} y="447" width="8" height="11" fill="#7F1D1D" stroke="#991B1B" strokeWidth="0.6" />
          ))}
        </g>

        {/* PALACE HALL, COLUMNS & WOODEN LATTICE (Cung Điện Cột Gỗ Lim Son) */}
        <g id="palace-hall">
          {/* Dark Red Lacquer Interior */}
          <rect x="55" y="482" width="490" height="195" fill="#260808" />

          {/* Traditional Carved Wooden Lattice Screens (Cửa Thượng Song Hạ Bản) */}
          <g opacity="0.6">
            {/* Screen Panels Between Columns */}
            <rect x="95" y="495" width="75" height="160" fill="#3B0D0D" stroke="#78350F" strokeWidth="1" />
            <rect x="195" y="495" width="205" height="160" fill="#330B0B" stroke="#78350F" strokeWidth="1" />
            <rect x="425" y="495" width="75" height="160" fill="#3B0D0D" stroke="#78350F" strokeWidth="1" />
            {/* Vertical Wood Slats (Thượng song) */}
            {[105, 120, 135, 150, 215, 235, 255, 275, 295, 315, 335, 355, 375, 435, 450, 465, 480].map((lx, i) => (
              <line key={i} x1={lx} y1="500" x2={lx} y2="600" stroke="#B45309" strokeWidth="1" />
            ))}
            {/* Lower Solid Panel (Hạ bản) with Carved Geometric Fretwork */}
            <rect x="100" y="605" width="65" height="45" fill="#4A1212" stroke="#78350F" strokeWidth="0.8" />
            <rect x="205" y="605" width="185" height="45" fill="#4A1212" stroke="#78350F" strokeWidth="0.8" />
            <rect x="430" y="605" width="65" height="45" fill="#4A1212" stroke="#78350F" strokeWidth="0.8" />
          </g>

          {/* 4 Grand Lim Wood Pillars (Cột Gỗ Lim Sơn Son Thếp Vàng) */}
          {/* Outer Left Pillar */}
          <rect x="75" y="482" width="20" height="195" fill={`url(#${uid}hoang-thanh-pillar)`} />
          <rect x="73" y="482" width="24" height="6" fill={`url(#${uid}hoang-thanh-gold)`} />
          <rect x="73" y="671" width="24" height="6" fill={`url(#${uid}hoang-thanh-gold)`} />
          {/* Inner Left Pillar */}
          <rect x="172" y="482" width="20" height="195" fill={`url(#${uid}hoang-thanh-pillar)`} />
          <rect x="170" y="482" width="24" height="6" fill={`url(#${uid}hoang-thanh-gold)`} />
          <rect x="170" y="671" width="24" height="6" fill={`url(#${uid}hoang-thanh-gold)`} />
          {/* Inner Right Pillar */}
          <rect x="408" y="482" width="20" height="195" fill={`url(#${uid}hoang-thanh-pillar)`} />
          <rect x="406" y="482" width="24" height="6" fill={`url(#${uid}hoang-thanh-gold)`} />
          <rect x="406" y="671" width="24" height="6" fill={`url(#${uid}hoang-thanh-gold)`} />
          {/* Outer Right Pillar */}
          <rect x="505" y="482" width="20" height="195" fill={`url(#${uid}hoang-thanh-pillar)`} />
          <rect x="503" y="482" width="24" height="6" fill={`url(#${uid}hoang-thanh-gold)`} />
          <rect x="503" y="671" width="24" height="6" fill={`url(#${uid}hoang-thanh-gold)`} />
        </g>

        {/* HANGING IMPERIAL PALACE LANTERNS (Đèn Lồng Cung Đình Bát Giác) */}
        {/* Left Lantern */}
        <g id="lantern-left" transform="translate(100, 465)">
          <line x1="0" y1="0" x2="0" y2="28" stroke="#78350F" strokeWidth="1.5" />
          <circle cx="0" cy="48" r="45" fill={`url(#${uid}glow-red)`} />
          {/* Lantern Canopy Roof */}
          <path d="M-18 28 L18 28 L24 35 L-24 35 Z" fill={`url(#${uid}hoang-thanh-gold)`} stroke="#78350F" strokeWidth="0.8" />
          {/* Silk Lantern Body */}
          <path d="M-18 35 L18 35 L14 65 L-14 65 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
          <circle cx="0" cy="48" r="10" fill="#FEF08A" opacity="0.6" />
          {/* Bottom Rim & Tassels */}
          <rect x="-14" y="65" width="28" height="4" fill={`url(#${uid}hoang-thanh-gold)`} />
          <line x1="0" y1="69" x2="0" y2="105" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-5" y1="69" x2="-6" y2="98" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="5" y1="69" x2="6" y2="98" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Right Lantern */}
        <g id="lantern-right" transform="translate(500, 465)">
          <line x1="0" y1="0" x2="0" y2="28" stroke="#78350F" strokeWidth="1.5" />
          <circle cx="0" cy="48" r="45" fill={`url(#${uid}glow-red)`} />
          {/* Lantern Canopy Roof */}
          <path d="M-18 28 L18 28 L24 35 L-24 35 Z" fill={`url(#${uid}hoang-thanh-gold)`} stroke="#78350F" strokeWidth="0.8" />
          {/* Silk Lantern Body */}
          <path d="M-18 35 L18 35 L14 65 L-14 65 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
          <circle cx="0" cy="48" r="10" fill="#FEF08A" opacity="0.6" />
          {/* Bottom Rim & Tassels */}
          <rect x="-14" y="65" width="28" height="4" fill={`url(#${uid}hoang-thanh-gold)`} />
          <line x1="0" y1="69" x2="0" y2="105" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-5" y1="69" x2="-6" y2="98" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="5" y1="69" x2="6" y2="98" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* THANH HOA STONE BALUSTRADE & PAVEMENT (Lan Can Đá Chạm Hoa Sen) */}
        <g id="stone-balustrade">
          {/* Carved Blue Stone Terrace Coping */}
          <rect x="40" y="670" width="520" height="18" fill="#57534E" stroke="#44403C" strokeWidth="1" />
          <line x1="40" y1="673" x2="560" y2="673" stroke="#D6D3D1" strokeWidth="1.5" />
          {/* Lotus relief carvings along balustrade (Chân quỳ dạ cá chạm sen) */}
          {[80, 140, 200, 260, 320, 380, 440, 500].map((lx, i) => (
            <path
              key={i}
              d={`M${lx - 12} 680 Q ${lx} 674 ${lx + 12} 680 Q ${lx} 686 ${lx - 12} 680 Z`}
              fill="#78716C"
              stroke="#A8A29E"
              strokeWidth="0.8"
            />
          ))}
          {/* Stone Lotus Bud Terminal Finials (Trụ Sen Búp Đá) */}
          {/* Left Post */}
          <rect x="52" y="650" width="14" height="25" fill="#44403C" />
          <path d="M52 650 Q 59 635 66 650 Z" fill="#78716C" stroke="#A8A29E" strokeWidth="1" />
          {/* Right Post */}
          <rect x="534" y="650" width="14" height="25" fill="#44403C" />
          <path d="M534 650 Q 541 635 548 650 Z" fill="#78716C" stroke="#A8A29E" strokeWidth="1" />

          {/* Imperial Courtyard Stone Pavement with Perspective Joints */}
          <rect x="0" y="688" width="600" height="112" fill="#2E231C" />
          {[0, 80, 160, 240, 320, 400, 480, 560].map((gx, idx) => (
            <line
              key={idx}
              x1={gx}
              y1="688"
              x2={gx + (gx - 300) * 0.45}
              y2="800"
              stroke="#57463A"
              strokeWidth="1.2"
            />
          ))}
          <line x1="0" y1="720" x2="600" y2="720" stroke="#44352B" strokeWidth="1" />
          <line x1="0" y1="760" x2="600" y2="760" stroke="#44352B" strokeWidth="1" />
        </g>
      </g>
    </g>
  );
};

/** 2. PHỐ CỔ HỘI AN & HÀ NỘI (Nhà Cổ, Hoa Giấy & Đèn Lồng Lung Linh) */
export const BackdropPhoCo: React.FC<BackdropProps> = ({ uid }) => {
  return (
    <g id="backdrop-pho-co">
      {/* Sunset twilight sky */}
      <rect width="600" height="800" fill={`url(#${uid}bg-pho-co)`} />

      {/* Distant Town Rooflines in Twilight Mist */}
      <path
        d="M0 340 L110 300 L220 350 L340 310 L450 345 L540 305 L600 330 L600 460 L0 460 Z"
        fill="#3F1D2C"
        opacity="0.45"
      />
      <path
        d="M60 380 L180 340 L300 395 L420 350 L560 385 L600 375 L600 500 L0 500 Z"
        fill="#5C2B1B"
        opacity="0.4"
      />

      {/* ─── LEFT ANCIENT SHOPHOUSE (Nhà Cổ Phía Trái) ─── */}
      <g id="shophouse-left">
        {/* Weathered Ochre Wall with Aged Patina */}
        <polygon points="0,170 190,210 185,690 0,690" fill={`url(#${uid}wall-hoian-left)`} />
        {/* Water-stain and moss aging patches */}
        <path d="M0 240 Q 60 250 110 240 Q 150 255 190 245 L 188 280 Q 90 270 0 285 Z" fill="#451A03" opacity="0.35" />
        <path d="M0 480 Q 50 490 100 485 L 98 520 Q 40 515 0 525 Z" fill="#2E1605" opacity="0.3" />

        {/* Hoi An Stepped Gable Curved Roof (Đầu Hồi Giật Cấp Quai Chảo) */}
        <path
          d="M0 160 Q 95 190 195 200 L 205 220 Q 95 210 0 185 Z"
          fill={`url(#${uid}tile-yinyang)`}
          stroke="#1C1917"
          strokeWidth="1.2"
        />
        {/* Curved ridge roll with moss (Bờ nóc phủ rêu) */}
        <path d="M0 158 Q 95 188 195 198" stroke="#4D7C0F" strokeWidth="3" fill="none" opacity="0.75" />
        <path d="M0 156 Q 95 186 195 196" stroke="#CA8A04" strokeWidth="1.5" fill="none" />

        {/* Upper French-Indochinese Wooden Louvered Window (Cửa Lá Sách Gỗ) */}
        <g id="window-left" transform="translate(45, 290)">
          {/* Dark wooden arch lintel */}
          <rect x="0" y="0" width="70" height="95" rx="3" fill="#1C1917" />
          {/* Candlelight Warm Glow from inside */}
          <rect x="8" y="8" width="54" height="79" fill="#F59E0B" opacity="0.7" />
          {/* Wooden Louvers (Lá sách nghiêng) */}
          {[18, 28, 38, 48, 58, 68, 78].map((wy, i) => (
            <line key={i} x1="12" y1={wy} x2="58" y2={wy} stroke="#3D2012" strokeWidth="2.5" />
          ))}
          {/* Half-open shutter casting shadow */}
          <polygon points="56,8 78,16 78,87 56,87" fill="#2B1408" stroke="#1C1917" strokeWidth="1" />
        </g>

        {/* Vintage Dark Teak Balcony with Turned Balusters (Lan Can Con Tiện Gỗ) */}
        <g id="balcony-left" transform="translate(15, 460)">
          <rect x="0" y="0" width="165" height="10" fill="#2E1508" stroke="#1C1917" strokeWidth="1" />
          {/* Turned timber spindles */}
          {[12, 30, 48, 66, 84, 102, 120, 138, 154].map((bx, i) => (
            <g key={i}>
              <line x1={bx} y1="10" x2={bx} y2="48" stroke="#3D2012" strokeWidth="3.5" />
              <circle cx={bx} cy="29" r="3" fill="#5A2E16" />
            </g>
          ))}
          <rect x="0" y="48" width="165" height="12" fill="#2E1508" stroke="#1C1917" strokeWidth="1" />
          {/* Cantilever wooden floor support beams */}
          <polygon points="20,60 32,85 45,60" fill="#261005" />
          <polygon points="90,60 102,85 115,60" fill="#261005" />
        </g>
      </g>

      {/* ─── RIGHT ANCIENT SHOPHOUSE (Nhà Cổ Phía Phải) ─── */}
      <g id="shophouse-right">
        {/* Weathered Ochre Wall */}
        <polygon points="410,215 600,165 600,690 415,690" fill={`url(#${uid}wall-hoian-right)`} />
        {/* Eave shadow */}
        <path d="M410 230 Q 500 215 600 185 L 600 230 Q 500 250 410 260 Z" fill="#422006" opacity="0.3" />

        {/* Curved Yin-Yang Tiled Roof */}
        <path
          d="M405 205 Q 505 195 600 155 L 600 180 Q 505 215 400 225 Z"
          fill={`url(#${uid}tile-yinyang)`}
          stroke="#1C1917"
          strokeWidth="1.2"
        />
        <path d="M405 203 Q 505 193 600 153" stroke="#4D7C0F" strokeWidth="3" fill="none" opacity="0.75" />
        <path d="M405 201 Q 505 191 600 151" stroke="#EAB308" strokeWidth="1.5" fill="none" />

        {/* Upper Shutter Window */}
        <g id="window-right" transform="translate(470, 290)">
          <rect x="0" y="0" width="65" height="90" rx="3" fill="#1C1917" />
          <rect x="6" y="6" width="53" height="78" fill="#F59E0B" opacity="0.45" />
          {[16, 26, 36, 46, 56, 66, 76].map((wy, i) => (
            <line key={i} x1="10" y1={wy} x2="55" y2={wy} stroke="#3D2012" strokeWidth="2.2" />
          ))}
          {/* Clay Flower Planter Box */}
          <rect x="-4" y="86" width="73" height="16" fill="#78350F" stroke="#451A03" strokeWidth="1" />
          {/* Green foliage in planter */}
          <circle cx="10" cy="84" r="8" fill="#15803D" />
          <circle cx="28" cy="82" r="9" fill="#16A34A" />
          <circle cx="46" cy="83" r="8" fill="#15803D" />
          <circle cx="62" cy="85" r="7" fill="#16A34A" />
        </g>
      </g>

      {/* ─── LUSH CASCADING BOUGAINVILLEA (Giàn Hoa Giấy Hội An) ─── */}
      <g id="bougainvillea">
        {/* Main gnarled wooden vines */}
        <path d="M0 90 Q 75 140 145 110 Q 185 95 230 145" stroke="#382012" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M50 120 Q 95 160 140 170 Q 180 180 205 220" stroke="#382012" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M600 95 Q 520 140 450 115 Q 410 100 375 135" stroke="#382012" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Flower clusters with multi-tone petals & green leaves */}
        {[
          { cx: 30, cy: 95, r: 12, c: '#BE185D' },
          { cx: 55, cy: 115, r: 15, c: '#E11D48' },
          { cx: 80, cy: 105, r: 14, c: '#F43F5E' },
          { cx: 105, cy: 130, r: 16, c: '#BE185D' },
          { cx: 130, cy: 120, r: 14, c: '#E11D48' },
          { cx: 155, cy: 145, r: 15, c: '#F43F5E' },
          { cx: 175, cy: 130, r: 13, c: '#BE185D' },
          { cx: 195, cy: 165, r: 16, c: '#E11D48' },
          { cx: 215, cy: 185, r: 12, c: '#F43F5E' },
          { cx: 125, cy: 165, r: 13, c: '#BE185D' },
          { cx: 150, cy: 190, r: 14, c: '#E11D48' },
          { cx: 170, cy: 220, r: 12, c: '#F43F5E' },
          // Right cluster
          { cx: 570, cy: 100, r: 13, c: '#BE185D' },
          { cx: 540, cy: 125, r: 15, c: '#E11D48' },
          { cx: 510, cy: 110, r: 14, c: '#F43F5E' },
          { cx: 480, cy: 135, r: 15, c: '#BE185D' },
          { cx: 450, cy: 120, r: 13, c: '#E11D48' },
          { cx: 420, cy: 145, r: 14, c: '#F43F5E' },
          { cx: 390, cy: 135, r: 12, c: '#BE185D' }
        ].map((f, i) => (
          <g key={i}>
            {/* Green leaf base */}
            <circle cx={f.cx - 4} cy={f.cy + 4} r={f.r * 0.65} fill="#15803D" opacity="0.8" />
            <circle cx={f.cx + 5} cy={f.cy - 3} r={f.r * 0.55} fill="#166534" opacity="0.8" />
            {/* Outer petals */}
            <circle cx={f.cx} cy={f.cy} r={f.r} fill={f.c} opacity="0.9" />
            {/* Core highlight */}
            <circle cx={f.cx + 2} cy={f.cy - 2} r={f.r * 0.5} fill="#FDA4AF" opacity="0.9" />
            <circle cx={f.cx - 1} cy={f.cy + 1} r={f.r * 0.25} fill="#FFF1F2" />
          </g>
        ))}

        {/* Falling petals drifting in breeze */}
        {[
          { cx: 180, cy: 260, r: 4 },
          { cx: 220, cy: 290, r: 3.5 },
          { cx: 240, cy: 340, r: 4 },
          { cx: 380, cy: 220, r: 3.8 },
          { cx: 410, cy: 280, r: 4.2 }
        ].map((p, i) => (
          <ellipse key={i} cx={p.cx} cy={p.cy} rx={p.r} ry={p.r * 0.6} fill="#F43F5E" opacity="0.85" transform={`rotate(${i * 25}, ${p.cx}, ${p.cy})`} />
        ))}
      </g>

      {/* ─── HOI AN SILK LANTERNS (Đèn Lồng Phố Hội Đa Sắc) ─── */}
      <g id="silk-lanterns">
        {/* Overhead suspension wires */}
        <path d="M0 135 Q 300 178 600 130" stroke="#451A03" strokeWidth="1.4" fill="none" opacity="0.5" />
        <path d="M0 165 Q 300 205 600 155" stroke="#451A03" strokeWidth="1.2" fill="none" opacity="0.4" />

        {/* Lantern 1: Teardrop Crimson Silk Lantern (Đèn Quả Trám Đỏ) */}
        <g transform="translate(85, 142)">
          <circle cx="0" cy="46" r="48" fill={`url(#${uid}glow-red)`} />
          <line x1="0" y1="0" x2="0" y2="18" stroke="#78350F" strokeWidth="1.5" />
          {/* Silk body */}
          <path d="M-18 24 C -28 44, -28 66, -16 86 L 16 86 C 28 66, 28 44, 18 24 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
          {/* Bamboo Ribs */}
          <path d="M0 24 Q -12 55 0 86" stroke="#B91C1C" strokeWidth="1" fill="none" />
          <path d="M0 24 Q 12 55 0 86" stroke="#B91C1C" strokeWidth="1" fill="none" />
          {/* Gold rims */}
          <ellipse cx="0" cy="24" rx="18" ry="4" fill="#F59E0B" />
          <ellipse cx="0" cy="86" rx="16" ry="4" fill="#F59E0B" />
          {/* Long silk tassel */}
          <line x1="0" y1="90" x2="0" y2="135" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Lantern 2: Saffron Yellow Round Melon Lantern (Đèn Tròn Hoàng Yến) */}
        <g transform="translate(515, 148)">
          <circle cx="0" cy="48" r="54" fill={`url(#${uid}glow-yellow)`} />
          <line x1="0" y1="0" x2="0" y2="20" stroke="#78350F" strokeWidth="1.5" />
          {/* Round pleated silk body */}
          <ellipse cx="0" cy="52" rx="28" ry="26" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
          {/* Vertical silk pleats */}
          <ellipse cx="0" cy="52" rx="18" ry="26" stroke="#D97706" strokeWidth="1" fill="none" />
          <ellipse cx="0" cy="52" rx="8" ry="26" stroke="#D97706" strokeWidth="1" fill="none" />
          <ellipse cx="0" cy="27" rx="14" ry="3.5" fill="#78350F" />
          <ellipse cx="0" cy="77" rx="14" ry="3.5" fill="#78350F" />
          <line x1="0" y1="80" x2="0" y2="128" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Lantern 3: Jade Green Oval Lantern (Đèn Trái Bí Xanh Ngọc) */}
        <g transform="translate(165, 185)" opacity="0.95">
          <circle cx="0" cy="38" r="42" fill={`url(#${uid}glow-green)`} />
          <line x1="0" y1="0" x2="0" y2="16" stroke="#78350F" strokeWidth="1.2" />
          <ellipse cx="0" cy="40" rx="19" ry="22" fill="#0D9488" stroke="#0F766E" strokeWidth="1" />
          <ellipse cx="0" cy="40" rx="10" ry="22" stroke="#14B8A6" strokeWidth="1" fill="none" />
          <line x1="0" y1="62" x2="0" y2="98" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Lantern 4: Royal Purple Hexagonal Lantern (Đèn Lục Giác Tím Huế) */}
        <g transform="translate(440, 200)" opacity="0.95">
          <circle cx="0" cy="38" r="42" fill={`url(#${uid}glow-purple)`} />
          <line x1="0" y1="0" x2="0" y2="16" stroke="#78350F" strokeWidth="1.2" />
          <path d="M-14 20 L14 20 L20 40 L14 60 L-14 60 L-20 40 Z" fill="#7E22CE" stroke="#6B21A8" strokeWidth="1" />
          <line x1="0" y1="60" x2="0" y2="96" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Lantern 5: Small Crimson Diamond Accent */}
        <g transform="translate(245, 218)" opacity="0.9">
          <circle cx="0" cy="28" r="28" fill={`url(#${uid}glow-red)`} />
          <line x1="0" y1="0" x2="0" y2="12" stroke="#78350F" strokeWidth="1" />
          <polygon points="0,15 14,30 0,45 -14,30" fill="#DC2626" stroke="#991B1B" strokeWidth="0.8" />
          <line x1="0" y1="45" x2="0" y2="72" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </g>

      {/* ─── ANCIENT STONE PAVED STREET & WARM REFLECTIONS ─── */}
      <g id="street-pavement">
        <rect x="0" y="680" width="600" height="120" fill="#292018" />
        {/* Receding Flagstones */}
        {[0, 75, 150, 225, 300, 375, 450, 525, 600].map((px, i) => (
          <line key={i} x1={px} y1="680" x2={px + (px - 300) * 0.4} y2="800" stroke="#423326" strokeWidth="1.4" />
        ))}
        <line x1="0" y1="715" x2="600" y2="715" stroke="#382A1F" strokeWidth="1" />
        <line x1="0" y1="755" x2="600" y2="755" stroke="#382A1F" strokeWidth="1" />
        {/* Warm lantern reflection puddles */}
        <ellipse cx="100" cy="740" rx="45" ry="12" fill="#DC2626" opacity="0.16" />
        <ellipse cx="490" cy="745" rx="55" ry="14" fill="#F59E0B" opacity="0.22" />
        <ellipse cx="180" cy="760" rx="35" ry="8" fill="#0D9488" opacity="0.14" />
      </g>
    </g>
  );
};

/** 3. HIỆU ẢNH ĐÔNG DƯƠNG 1930s (French-Indochine Salon & Rèm Nhung Quý Tộc) */
export const BackdropHieuAnh: React.FC<BackdropProps> = ({ uid }) => {
  return (
    <g id="backdrop-hieu-anh">
      {/* Vintage Salon Wall */}
      <rect width="600" height="800" fill={`url(#${uid}bg-hieu-anh)`} />

      {/* Theatrical Spotlight Cone Center Glow */}
      <ellipse cx="300" cy="380" rx="250" ry="320" fill={`url(#${uid}spotlight-glow)`} />

      {/* ─── FRENCH-INDOCHINE ARCHITECTURAL ARCHWAY ─── */}
      <g id="indochine-arch">
        {/* Outer Heavy Molded Arch */}
        <path
          d="M65 800 L65 340 Q 65 60 300 60 Q 535 60 535 340 L535 800"
          fill="none"
          stroke="#5C381E"
          strokeWidth="3.5"
        />
        {/* Inner Molded Arch with Bead Motif */}
        <path
          d="M80 800 L80 345 Q 80 80 300 80 Q 520 80 520 345 L520 800"
          fill="none"
          stroke="#854D0E"
          strokeWidth="1.8"
        />
        <path
          d="M92 800 L92 350 Q 92 95 300 95 Q 508 95 508 350 L508 800"
          fill="none"
          stroke="#B45309"
          strokeWidth="1.2"
          strokeDasharray="6 4"
        />

        {/* Decorative Sunburst Radiating Muntins (Nan Quạt Hoa Văn Kỷ Hà) */}
        {[0, 18, 36, 54, 72, 90, 108, 126, 144, 162, 180].map((deg, i) => (
          <line
            key={i}
            x1={300 + Math.cos((deg * Math.PI) / 180) * 115}
            y1={240 - Math.sin((deg * Math.PI) / 180) * 115}
            x2={300 + Math.cos((deg * Math.PI) / 180) * 155}
            y2={240 - Math.sin((deg * Math.PI) / 180) * 155}
            stroke="#78350F"
            strokeWidth="1.8"
          />
        ))}
        {/* Central Arch Rosette */}
        <circle cx="300" cy="240" r="14" fill="#3D1D09" stroke="#B45309" strokeWidth="1.5" />
        <circle cx="300" cy="240" r="6" fill="#F59E0B" />

        {/* Fluted Classical Pilasters on Flanks */}
        <rect x="60" y="340" width="24" height="340" fill="#45220D" opacity="0.3" />
        <line x1="68" y1="340" x2="68" y2="680" stroke="#78350F" strokeWidth="1.2" />
        <line x1="76" y1="340" x2="76" y2="680" stroke="#78350F" strokeWidth="1.2" />

        <rect x="516" y="340" width="24" height="340" fill="#45220D" opacity="0.3" />
        <line x1="524" y1="340" x2="524" y2="680" stroke="#78350F" strokeWidth="1.2" />
        <line x1="532" y1="340" x2="532" y2="680" stroke="#78350F" strokeWidth="1.2" />

        {/* Indochine Wooden Wainscoting Boiserie (Tấm Ốp Gỗ Gõ Đỏ) */}
        <rect x="0" y="520" width="90" height="160" fill="#3E1A0A" opacity="0.6" stroke="#5C260D" strokeWidth="1" />
        <rect x="12" y="535" width="66" height="130" fill="#2B1207" stroke="#78350F" strokeWidth="1" />

        <rect x="510" y="520" width="90" height="160" fill="#3E1A0A" opacity="0.6" stroke="#5C260D" strokeWidth="1" />
        <rect x="522" y="535" width="66" height="130" fill="#2B1207" stroke="#78350F" strokeWidth="1" />
      </g>

      {/* ─── LUXURIOUS THEATRE VELVET CURTAINS (Rèm Nhung Đỏ Quý Tộc) ─── */}
      <g id="theatre-curtains">
        {/* Top Scalloped Valance / Pelmet (Diềm Rèm Uốn Sóng Cổ Điển) */}
        <path
          d="M0 0 L600 0 L600 55 Q 525 75 450 55 Q 375 75 300 55 Q 225 75 150 55 Q 75 75 0 55 Z"
          fill={`url(#${uid}curtain-velvet)`}
          stroke="#380407"
          strokeWidth="1.5"
        />
        {/* Gold Bullion Fringe along Valance */}
        <path
          d="M0 55 Q 75 75 150 55 Q 225 75 300 55 Q 375 75 450 55 Q 525 75 600 55"
          stroke={`url(#${uid}gold-cord)`}
          strokeWidth="3"
          fill="none"
        />
        {/* Gold Fringe Tassels on Valance */}
        {[30, 75, 120, 180, 225, 270, 330, 375, 420, 480, 525, 570].map((tx, i) => (
          <line key={i} x1={tx} y1="62" x2={tx} y2="72" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        ))}

        {/* Left Heavy Velvet Drape */}
        <g id="drape-left">
          {/* Main draped velvet folds */}
          <path
            d="M0 50 L125 50 C 95 180, 135 360, 70 470 C 45 520, 0 550, 0 570 Z"
            fill={`url(#${uid}curtain-velvet)`}
            stroke="#2E0305"
            strokeWidth="1.5"
          />
          {/* Velvet highlight and shadow folds */}
          <path d="M35 50 C 30 200, 85 360, 55 480" stroke="#B91C1C" strokeWidth="2.5" fill="none" opacity="0.6" />
          <path d="M75 50 C 65 200, 110 360, 68 475" stroke="#450A0A" strokeWidth="2" fill="none" opacity="0.8" />
          <path d="M0 470 C 40 510, 80 560, 0 650 Z" fill={`url(#${uid}curtain-velvet)`} opacity="0.9" />

          {/* Heavy Braided Gold Cord & Bullion Tassel */}
          <g transform="translate(68, 465)">
            <ellipse cx="0" cy="0" rx="16" ry="7" fill={`url(#${uid}gold-cord)`} stroke="#78350F" strokeWidth="1" />
            <line x1="0" y1="6" x2="5" y2="35" stroke={`url(#${uid}gold-cord)`} strokeWidth="3" strokeLinecap="round" />
            <polygon points="1,35 9,35 7,65 3,65" fill={`url(#${uid}gold-cord)`} stroke="#78350F" strokeWidth="0.8" />
            {/* Tassel threads */}
            <line x1="3" y1="65" x2="1" y2="82" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="5" y1="65" x2="5" y2="84" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
            <line x1="7" y1="65" x2="9" y2="82" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </g>

        {/* Right Heavy Velvet Drape */}
        <g id="drape-right">
          <path
            d="M600 50 L475 50 C 505 180, 465 360, 530 470 C 555 520, 600 550, 600 570 Z"
            fill={`url(#${uid}curtain-velvet)`}
            stroke="#2E0305"
            strokeWidth="1.5"
          />
          <path d="M565 50 C 570 200, 515 360, 545 480" stroke="#B91C1C" strokeWidth="2.5" fill="none" opacity="0.6" />
          <path d="M525 50 C 535 200, 490 360, 532 475" stroke="#450A0A" strokeWidth="2" fill="none" opacity="0.8" />
          <path d="M600 470 C 560 510, 520 560, 600 650 Z" fill={`url(#${uid}curtain-velvet)`} opacity="0.9" />

          {/* Gold Tassel Tieback */}
          <g transform="translate(532, 465)">
            <ellipse cx="0" cy="0" rx="16" ry="7" fill={`url(#${uid}gold-cord)`} stroke="#78350F" strokeWidth="1" />
            <line x1="0" y1="6" x2="-5" y2="35" stroke={`url(#${uid}gold-cord)`} strokeWidth="3" strokeLinecap="round" />
            <polygon points="-1,35 -9,35 -7,65 -3,65" fill={`url(#${uid}gold-cord)`} stroke="#78350F" strokeWidth="0.8" />
            <line x1="-3" y1="65" x2="-1" y2="82" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="-5" y1="65" x2="-5" y2="84" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
            <line x1="-7" y1="65" x2="-9" y2="82" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </g>
      </g>

      {/* ─── VINTAGE PHOTOGRAPHIC SALON PROPS ─── */}
      {/* Left: Carved Rosewood Pedestal Stand with Lilies */}
      <g id="prop-stand" transform="translate(25, 575)">
        {/* Rosewood Stand */}
        <rect x="18" y="40" width="28" height="60" fill="#2E1205" stroke="#1A0A03" strokeWidth="1" />
        <rect x="12" y="36" width="40" height="8" rx="2" fill="#4A220D" stroke="#1A0A03" strokeWidth="1" />
        <rect x="14" y="96" width="36" height="8" rx="2" fill="#4A220D" stroke="#1A0A03" strokeWidth="1" />
        {/* Celadon Ceramic Vase */}
        <path d="M26 36 L38 36 L40 18 Q 32 14 24 18 Z" fill="#99F6E4" stroke="#0D9488" strokeWidth="1" />
        {/* White Lilies (Hoa Loa Kèn Tháng Tư) */}
        <path d="M30 18 Q 24 2 20 -8 Q 30 -4 34 16 Z" fill="#FFFDF5" stroke="#D1D5DB" strokeWidth="0.8" />
        <path d="M34 18 Q 38 4 45 -4 Q 38 4 36 16 Z" fill="#FFFDF5" stroke="#D1D5DB" strokeWidth="0.8" />
        <circle cx="28" cy="-2" r="1.5" fill="#F59E0B" />
        <circle cx="40" cy="2" r="1.5" fill="#F59E0B" />
      </g>

      {/* Right: Vintage 1930s Timber & Brass Bellows Camera Silhouette */}
      <g id="prop-camera" transform="translate(545, 540)" opacity="0.45">
        {/* Tripod Legs */}
        <line x1="15" y1="35" x2="-15" y2="140" stroke="#3D1D09" strokeWidth="2.5" />
        <line x1="15" y1="35" x2="15" y2="140" stroke="#3D1D09" strokeWidth="2.5" />
        <line x1="15" y1="35" x2="45" y2="140" stroke="#3D1D09" strokeWidth="2.5" />
        {/* Camera Box & Bellows */}
        <rect x="0" y="5" width="30" height="30" fill="#2E1508" stroke="#78350F" strokeWidth="1" />
        <polygon points="0,10 -12,14 -12,26 0,30" fill="#1C1917" />
        <circle cx="-14" cy="20" r="5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
      </g>

      {/* ─── AUTHENTIC ENCAUSTIC CEMENT TILE FLOOR (Sàn Gạch Bông Đông Dương) ─── */}
      <g id="cement-tile-floor">
        {/* Floor base with 1930s pattern */}
        <rect x="0" y="675" width="600" height="125" fill={`url(#${uid}pattern-gach-bong)`} />
        {/* Perspective floor overlay with spotlight reflection */}
        <rect x="0" y="675" width="600" height="125" fill="#FAF6EE" opacity="0.18" />
        <line x1="0" y1="675" x2="600" y2="675" stroke="#5C381E" strokeWidth="2" />
        {/* Subtle center stage light puddle */}
        <ellipse cx="300" cy="740" rx="180" ry="40" fill="#FFFDF2" opacity="0.25" />
      </g>
    </g>
  );
};

/** 4. KHÔNG GIAN TRÚC LÂM THIỀN TRÀ (Tối Giản, Đại Thiền Ensō & Bạch Liên Hoa) */
export const BackdropStudioZen: React.FC<BackdropProps> = ({ uid }) => {
  return (
    <g id="backdrop-studio-zen">
      {/* Handcrafted Vietnamese Dó Paper Background */}
      <rect width="600" height="800" fill={`url(#${uid}bg-studio-zen)`} />

      {/* Subtle Mulberry Paper Fibers Texture */}
      {[40, 110, 190, 280, 360, 440, 520, 580].map((fx, i) => (
        <line key={i} x1={fx} y1="0" x2={fx + (i % 2 === 0 ? 8 : -6)} y2="800" stroke="#D6C7AF" strokeWidth="0.6" opacity="0.3" strokeDasharray="18 24" />
      ))}

      {/* Central Ethereal Warm Backlight Halo */}
      <circle cx="300" cy="330" r="230" fill={`url(#${uid}zen-backlight)`} />

      {/* Floating Shimmering Gold-Leaf Flecks (Kim Tinh Dát Vàng) */}
      {[
        { cx: 160, cy: 150, r: 2.2 },
        { cx: 210, cy: 220, r: 1.8 },
        { cx: 390, cy: 170, r: 2.5 },
        { cx: 440, cy: 240, r: 1.6 },
        { cx: 180, cy: 410, r: 2 },
        { cx: 420, cy: 390, r: 2.2 },
        { cx: 260, cy: 110, r: 1.5 },
        { cx: 340, cy: 130, r: 1.8 }
      ].map((g, i) => (
        <circle key={i} cx={g.cx} cy={g.cy} r={g.r} fill="#F59E0B" opacity="0.55" />
      ))}

      {/* ─── PURE VIETNAMESE TRÚC LÂM ZEN ARCHITECTURE & SCENERY ─── */}
      {/* 1. MISTY SCENIC LANDSCAPE (Non Nước Trúc Lâm Yên Tử Nhìn Qua Nguyệt Môn) */}
      <g id="yen-tu-landscape">
        {/* Soft celestial mountain layers (Dãy Núi Mây Ngàn Yên Tử) */}
        <path
          d="M120 420 Q 210 320 300 350 Q 390 320 480 420 L 480 540 L 120 540 Z"
          fill="#D4C4AE"
          opacity="0.5"
        />
        <path
          d="M140 450 Q 230 380 320 410 Q 410 370 470 450 L 470 540 L 140 540 Z"
          fill="#BFAFA0"
          opacity="0.6"
        />
        {/* Distant Huệ Quang Stupa Silhouette (Bóng Tháp Cổ Huệ Quang Yên Tử) */}
        <g transform="translate(370, 345)" opacity="0.45">
          <polygon points="12,0 8,12 16,12" fill="#78716C" />
          <rect x="6" y="12" width="12" height="10" fill="#78716C" />
          <rect x="4" y="22" width="16" height="12" fill="#78716C" />
          <rect x="2" y="34" width="20" height="15" fill="#78716C" />
        </g>
      </g>

      {/* 2. TRADITIONAL VIETNAMESE MOON GATE (Cửa Vòm Nguyệt Môn Gỗ Mun Cổ Kính) */}
      <g id="vietnamese-moon-gate">
        {/* Outer Heavy Circular Rosewood Rim */}
        <circle
          cx="300"
          cy="340"
          r="215"
          fill="none"
          stroke={`url(#${uid}viet-moon-gate)`}
          strokeWidth="16"
        />
        {/* Inner Molded Gold/Bronze Bead Trim */}
        <circle cx="300" cy="340" r="207" fill="none" stroke="#B45309" strokeWidth="1.2" opacity="0.8" />
        <circle cx="300" cy="340" r="223" fill="none" stroke="#291207" strokeWidth="1.5" />

        {/* Decorative Moon Gate Corner Spandrels (Góc Hoa Văn Chạm Trổ Tứ Quý) */}
        {/* Top-Left Spandrel */}
        <path d="M70 110 L150 110 C 115 150, 95 190, 85 240 L85 130 Z" fill="#2E1408" opacity="0.15" />
        <path d="M70 110 Q 120 120 130 160 Q 100 170 85 220" stroke="#78350F" strokeWidth="1.2" fill="none" opacity="0.4" />
        {/* Top-Right Spandrel */}
        <path d="M530 110 L450 110 C 485 150, 505 190, 515 240 L515 130 Z" fill="#2E1408" opacity="0.15" />
        <path d="M530 110 Q 480 120 470 160 Q 500 170 515 220" stroke="#78350F" strokeWidth="1.2" fill="none" opacity="0.4" />

        {/* Traditional Vietnamese Lý Dynasty Cloud Scroll Motif (Vân Mây Thời Lý Cuộn Hình Dấu Hỏi) */}
        <g id="van-may-thoi-ly" opacity="0.85">
          {/* Upper Left Cloud Scroll */}
          <path
            d="M175 195 C 190 180, 215 185, 220 200 C 225 215, 205 225, 195 215 C 185 205, 195 190, 208 195 C 218 200, 216 210, 208 210"
            stroke={`url(#${uid}viet-cloud-gold)`}
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Upper Right Cloud Scroll */}
          <path
            d="M425 210 C 410 195, 385 200, 380 215 C 375 230, 395 240, 405 230 C 415 220, 405 205, 392 210 C 382 215, 384 225, 392 225"
            stroke={`url(#${uid}viet-cloud-gold)`}
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Vermilion Cinnabar Seal Stamp (Triện Ấn Son Đỏ Chữ Nôm 'Thiền' 禪 / 'An' 安 Thuần Việt) */}
        <g id="cinnabar-seal" transform="translate(460, 440)">
          {/* Double vermilion border */}
          <rect x="0" y="0" width="34" height="34" rx="3" fill="#B91C1C" stroke="#991B1B" strokeWidth="1" />
          <rect x="3" y="3" width="28" height="28" rx="1.5" fill="none" stroke="#FEF2F2" strokeWidth="1" opacity="0.85" />
          {/* Seal-Script Character "An" (Bình An, Tĩnh Lặng Trúc Lâm) */}
          <path
            d="M 17 8 L 17 11 M 10 12 L 24 12 M 12 12 L 12 17 M 22 12 L 22 17 M 10 18 L 24 18 M 14 20 C 13 25, 11 28, 9 30 M 17 19 L 17 29 M 17 24 L 23 24 M 20 20 L 23 30"
            stroke="#FEF2F2"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />
        </g>
      </g>

      {/* 3. VIETNAMESE GOLDEN IVORY BAMBOO (Rặng Tre Ngà / Tre Đằng Ngà Làng Quê Việt) */}
      <g id="vietnamese-bamboo-grove">
        {/* Distant bamboo stalks */}
        <g opacity="0.3">
          <line x1="60" y1="180" x2="55" y2="660" stroke="#CA8A04" strokeWidth="3" strokeLinecap="round" />
          <line x1="95" y1="160" x2="90" y2="660" stroke="#CA8A04" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Foreground Bamboo Grove on Left (Khóm Tre Ngà Thân Vàng Óng) */}
        <g transform="translate(48, 220)">
          {/* Culm 1: Golden Stalk with distinct joints */}
          <line x1="28" y1="0" x2="26" y2="120" stroke={`url(#${uid}viet-bamboo-stalk)`} strokeWidth="6" strokeLinecap="round" />
          <line x1="26" y1="126" x2="23" y2="255" stroke={`url(#${uid}viet-bamboo-stalk)`} strokeWidth="6.5" strokeLinecap="round" />
          <line x1="23" y1="261" x2="19" y2="440" stroke={`url(#${uid}viet-bamboo-stalk)`} strokeWidth="7" strokeLinecap="round" />
          {/* Joint Rings (Ngấn Đốt Tre) */}
          <ellipse cx="27" cy="123" rx="7" ry="2.6" fill="#78350F" />
          <ellipse cx="27" cy="123" rx="5" ry="1.5" fill="#FEF08A" />
          <ellipse cx="24" cy="258" rx="7.5" ry="2.8" fill="#78350F" />
          <ellipse cx="24" cy="258" rx="5.5" ry="1.6" fill="#FEF08A" />

          {/* Culm 2 */}
          <line x1="72" y1="70" x2="70" y2="205" stroke={`url(#${uid}viet-bamboo-stalk)`} strokeWidth="4.5" strokeLinecap="round" />
          <line x1="70" y1="211" x2="68" y2="390" stroke={`url(#${uid}viet-bamboo-stalk)`} strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="71" cy="208" rx="5.5" ry="2.2" fill="#78350F" />

          {/* Graceful Rustling Bamboo Leaves (Lá Tre Ngà Thanh Thoát) */}
          {/* Cluster at Joint 1 */}
          <path d="M27 123 C 50 106, 85 116, 120 112 C 85 128, 55 128, 27 123 Z" fill="#15803D" opacity="0.9" />
          <path d="M27 123 C 54 136, 94 149, 132 153 C 90 156, 56 145, 27 123 Z" fill="#166534" opacity="0.85" />
          <path d="M27 123 C 44 91, 74 86, 104 81 C 76 96, 52 106, 27 123 Z" fill="#4ADE80" opacity="0.75" />

          {/* Cluster at Joint 2 */}
          <path d="M24 258 C 54 244, 99 251, 142 246 C 99 264, 59 264, 24 258 Z" fill="#15803D" opacity="0.9" />
          <path d="M24 258 C 51 274, 91 286, 128 288 C 85 292, 53 282, 24 258 Z" fill="#166534" opacity="0.85" />

          {/* Cluster from Culm 2 */}
          <path d="M71 208 C 94 191, 129 201, 159 196 C 124 211, 96 211, 71 208 Z" fill="#166534" opacity="0.8" />
          <path d="M71 208 C 96 221, 134 231, 166 234 C 129 236, 99 228, 71 208 Z" fill="#15803D" opacity="0.85" />
        </g>

        {/* Slender Bamboo Spray Framing Top Right Corner */}
        <g transform="translate(500, 110)" opacity="0.75">
          <path d="M70 0 Q 30 70 0 110" stroke="#A16207" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M20 75 C -10 65, -40 70, -70 68 C -40 78, -15 78, 20 75 Z" fill="#166534" />
          <path d="M5 105 C -25 100, -55 110, -85 108 C -55 120, -25 118, 5 105 Z" fill="#15803D" />
          <path d="M35 50 C 5 40, -25 45, -55 42 C -25 52, 5 52, 35 50 Z" fill="#4ADE80" opacity="0.75" />
        </g>
      </g>

      {/* ─── SACRED LOTUS ON RIPPLING WATER (Bạch Liên Hoa & Mặt Nước Thiền) ─── */}
      <g id="sacred-lotus" transform="translate(450, 660)">
        {/* Concentric Expanding Water Ripples */}
        <ellipse cx="0" cy="20" rx="90" ry="16" fill="none" stroke="#A8A29E" strokeWidth="1.2" opacity="0.5" />
        <ellipse cx="0" cy="20" rx="65" ry="11" fill="none" stroke="#A8A29E" strokeWidth="1" strokeDasharray="6 6" opacity="0.6" />
        <ellipse cx="0" cy="20" rx="40" ry="7" fill="none" stroke="#78716C" strokeWidth="0.8" opacity="0.7" />

        {/* Floating Emerald Lotus Pad (Lá Sen Biếc Tròn) */}
        <ellipse cx="-45" cy="18" rx="42" ry="12" fill="#15803D" opacity="0.75" />
        <ellipse cx="-45" cy="18" rx="38" ry="10" fill="#166534" opacity="0.8" />
        {/* Radiating leaf veins */}
        <line x1="-45" y1="18" x2="-75" y2="12" stroke="#4ADE80" strokeWidth="0.8" opacity="0.6" />
        <line x1="-45" y1="18" x2="-20" y2="10" stroke="#4ADE80" strokeWidth="0.8" opacity="0.6" />
        <line x1="-45" y1="18" x2="-45" y2="28" stroke="#4ADE80" strokeWidth="0.8" opacity="0.6" />
        {/* Glistening Dewdrop */}
        <circle cx="-42" cy="14" r="2" fill="#FEF9C3" opacity="0.8" />

        {/* Blooming White Lotus (Bạch Liên Thanh Khiết) */}
        <g id="lotus-bloom" transform="translate(0, 0)">
          {/* Back outer petals */}
          <path d="M-22 15 C -30 -10, -10 -28, 0 -38 C 10 -28, 30 -10, 22 15 Z" fill={`url(#${uid}lotus-petal)`} stroke="#F472B6" strokeWidth="0.8" />
          <path d="M-28 15 C -40 -4, -25 -22, -10 -32 C -8 -15, -16 6, -28 15 Z" fill={`url(#${uid}lotus-petal)`} stroke="#F472B6" strokeWidth="0.8" />
          <path d="M28 15 C 40 -4, 25 -22, 10 -32 C 8 -15, 16 6, 28 15 Z" fill={`url(#${uid}lotus-petal)`} stroke="#F472B6" strokeWidth="0.8" />

          {/* Front inner petals */}
          <path d="M-15 16 C -20 2, -6 -18, 0 -26 C 6 -18, 20 2, 15 16 Z" fill="#FFFDF8" stroke="#F472B6" strokeWidth="0.8" />
          {/* Golden Seed Pod & Stamens */}
          <ellipse cx="0" cy="6" rx="8" ry="4" fill="#F59E0B" />
          <circle cx="-4" cy="5" r="1" fill="#78350F" />
          <circle cx="0" cy="5" r="1" fill="#78350F" />
          <circle cx="4" cy="5" r="1" fill="#78350F" />
        </g>

        {/* Detached Floating Lotus Petals */}
        <path d="M50 26 Q 65 18 72 26 Q 65 32 50 26 Z" fill={`url(#${uid}lotus-petal)`} opacity="0.85" />
        <path d="M-80 24 Q -95 18 -100 25 Q -94 30 -80 24 Z" fill={`url(#${uid}lotus-petal)`} opacity="0.7" />
      </g>
    </g>
  );
};

export const BackdropScene: React.FC<{ backdrop: OutfitConfig['backdrop']; uid: string }> = ({ backdrop, uid }) => {
  switch (backdrop) {
    case 'hoang-thanh':
      return <BackdropHoangThanh uid={uid} />;
    case 'pho-co':
      return <BackdropPhoCo uid={uid} />;
    case 'hieu-anh':
      return <BackdropHieuAnh uid={uid} />;
    case 'studio-zen':
    default:
      return <BackdropStudioZen uid={uid} />;
  }
};
