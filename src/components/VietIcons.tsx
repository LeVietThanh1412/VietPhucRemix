import React from 'react';

export interface VietIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

/**
 * 1. BIỂU TƯỢNG ÁO CỔ PHỤC VIỆT NAM (IconVietGarment)
 * Thiết kế nguyên bản: Áo Tấc / Áo Ngũ Thân với cổ áo Lập Lĩnh đứng,
 * vạt cánh cung uốn lượn, 5 khuy cúc Ngũ Thường bằng đồng và tay áo buông rộng.
 */
export const IconVietGarment: React.FC<VietIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Biểu tượng Áo Cổ Phục Việt"
    {...props}
  >
    {/* Background soft tint */}
    <rect width="48" height="48" rx="10" fill="#FEF3C7" fillOpacity="0.4" />

    {/* Flowing Wide Sleeves */}
    <path
      d="M17 17 L6 22 C 5 29, 8 36, 13 37 L16 30 Z"
      fill="#DC2626"
      stroke="#7F1D1D"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M31 17 L42 22 C 43 29, 40 36, 35 37 L32 30 Z"
      fill="#DC2626"
      stroke="#7F1D1D"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />

    {/* Main Robe Torso & Flowing Hem */}
    <path
      d="M16 16 L32 16 L34 40 C 29 42, 19 42, 14 40 Z"
      fill="#DC2626"
      stroke="#7F1D1D"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />

    {/* Silk Sheen / Fold lines */}
    <path d="M21 21 L18 39" stroke="#EF4444" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
    <path d="M27 21 L30 39" stroke="#EF4444" strokeWidth="1" strokeLinecap="round" opacity="0.8" />

    {/* Inner White Collar (Cổ lót trắng) */}
    <path d="M20 16 L24 20 L28 16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

    {/* Lập Lĩnh (Standing High Collar) */}
    <path
      d="M20 12 L28 12 L28 17 L20 17 Z"
      fill="#B91C1C"
      stroke="#7F1D1D"
      strokeWidth="1.4"
    />
    <path d="M20 12 L28 12" stroke="#FEF08A" strokeWidth="1.5" />

    {/* 5 Traditional Gold Buttons (Ngũ Thường) */}
    <circle cx="27" cy="18" r="1.5" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
    <circle cx="26" cy="22" r="1.5" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
    <circle cx="25" cy="26" r="1.5" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
    <circle cx="24" cy="30" r="1.5" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
    <circle cx="23" cy="34" r="1.5" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
  </svg>
);

/**
 * 2. BIỂU TƯỢNG MŨ & KHĂN VẤN VIỆT NAM (IconVietHeadwear)
 * Thiết kế nguyên bản: Khăn vấn nhung đồng tâm kết hợp nếp chữ Nhân chữ V
 * của khăn đóng truyền thống Bắc Bộ & triều Nguyễn.
 */
export const IconVietHeadwear: React.FC<VietIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Biểu tượng Khăn Vấn & Mũ Cổ Phục"
    {...props}
  >
    <rect width="48" height="48" rx="10" fill="#FEF3C7" fillOpacity="0.4" />

    {/* Outer Velvet Roll */}
    <ellipse cx="24" cy="23" rx="17" ry="9" fill="#1C1917" stroke="#44403C" strokeWidth="1.6" />
    {/* Inner Concentric Velvet Folds */}
    <ellipse cx="24" cy="21" rx="14.5" ry="7.5" fill="#292524" stroke="#78716C" strokeWidth="1.2" />
    <ellipse cx="24" cy="19" rx="12" ry="6" fill="#1C1917" stroke="#44403C" strokeWidth="1" />

    {/* Distinctive V-Shaped Forehead Pleat (Nếp chữ Nhân) */}
    <path
      d="M19 19 L24 24 L29 19"
      stroke="#F59E0B"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* Gold Thread / Hair Pin Accents */}
    <circle cx="24" cy="24" r="1.2" fill="#FEF08A" />
    <path d="M12 28 C 12 36, 17 38, 24 38 C 31 38, 36 36, 36 28" stroke="#78350F" strokeWidth="1.2" strokeDasharray="2 2" fill="none" opacity="0.6" />
  </svg>
);

/**
 * 3. BIỂU TƯỢNG PHỤ KIỆN CỔ TRUYỀN (IconVietAccessory)
 * Thiết kế nguyên bản: Quạt giấy Dó nan tre Chàng Sơn kèm tua rua lụa đỏ
 * và kiềng bạc chạm hoa mai.
 */
export const IconVietAccessory: React.FC<VietIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Biểu tượng Phụ Kiện Cổ Truyền"
    {...props}
  >
    <rect width="48" height="48" rx="10" fill="#FEF3C7" fillOpacity="0.4" />

    {/* Silver Torque Arc (Kiềng Bạc Khắc Hoa Mai) */}
    <path
      d="M13 14 C 13 8, 35 8, 35 14"
      stroke="#94A3B8"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M13 14 C 13 8, 35 8, 35 14"
      stroke="#E2E8F0"
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="none"
    />
    {/* Torque Center Gem Pendant */}
    <circle cx="24" cy="11.5" r="1.8" fill="#F59E0B" stroke="#B45309" strokeWidth="0.6" />

    {/* Traditional Dó Paper Fan Arc (Quạt Giấy Dó) */}
    <path
      d="M17 33 L8 24 A 20 20 0 0 1 36 17 L27 28 Z"
      fill="#DC2626"
      stroke="#991B1B"
      strokeWidth="1.4"
    />
    {/* Bamboo Guard Stick & Radiating Ribs */}
    <line x1="22" y1="31" x2="10" y2="23" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="22" y1="31" x2="35" y2="18" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="22" y1="31" x2="16" y2="20" stroke="#FDE68A" strokeWidth="0.8" opacity="0.8" />
    <line x1="22" y1="31" x2="23" y2="18" stroke="#FDE68A" strokeWidth="0.8" opacity="0.8" />
    <line x1="22" y1="31" x2="29" y2="19" stroke="#FDE68A" strokeWidth="0.8" opacity="0.8" />

    {/* Brass Fan Pivot Rivet */}
    <circle cx="22" cy="31" r="2.2" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />

    {/* Red Silk Tassel (Tua Rua Lụa Đỏ Son Buông Rủ) */}
    <path d="M22 33 L21 41" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" />
    <ellipse cx="21" cy="42" rx="2.5" ry="1.8" fill="#991B1B" />
    <path d="M21 43 L20 46" stroke="#EF4444" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M22 43 L23 46" stroke="#EF4444" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/**
 * 4. BIỂU TƯỢNG HẠ Y - QUẦN LỤA & VÁY XẾP LY (IconVietBottom)
 * Thiết kế nguyên bản: Quần lụa ống suông buông rủ thanh lịch kèm
 * dải thắt lưng lụa ngũ sắc kết hoa.
 */
export const IconVietBottom: React.FC<VietIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Biểu tượng Hạ Y Quần Lụa & Chân Váy"
    {...props}
  >
    <rect width="48" height="48" rx="10" fill="#FEF3C7" fillOpacity="0.4" />

    {/* Silk Pants Silhouette */}
    <path
      d="M15 12 L33 12 L35 41 L27 41 L24 23 L21 41 L13 41 Z"
      fill="#FAF5EE"
      stroke="#78716C"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />

    {/* Pleat / Fabric Drape Shadow lines */}
    <path d="M19 14 L17 39" stroke="#D6D3D1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M29 14 L31 39" stroke="#D6D3D1" strokeWidth="1.2" strokeLinecap="round" />

    {/* Silk Waist Sash Band (Bao thắt lưng) */}
    <rect x="14" y="11" width="20" height="4" rx="1" fill="#047857" stroke="#064E3B" strokeWidth="1" />

    {/* Hanging Five-Color Silk Ribbons (Dải ngũ sắc rủ trước hông) */}
    <path d="M23 15 L22 28" stroke="#DC2626" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M25 15 L26 27" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/**
 * 5. BIỂU TƯỢNG HÀI THÊU & GUỐC MỘC (IconVietFootwear)
 * Thiết kế nguyên bản: Guốc mộc quai nhung đỏ thắm, đế gỗ vát cong lượn
 * và đinh tán hoa thị bằng đồng truyền thống.
 */
export const IconVietFootwear: React.FC<VietIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Biểu tượng Guốc Mộc & Hài Cung Đình"
    {...props}
  >
    <rect width="48" height="48" rx="10" fill="#FEF3C7" fillOpacity="0.4" />

    {/* Curved Wooden Sole (Đế Gỗ Vát Eo Lượn Cong) */}
    <path
      d="M10 28 C 16 28, 20 25, 27 25 L 38 25 L 39 33 L 34 34 C 28 34, 25 36, 21 39 L 10 39 Z"
      fill="#B45309"
      stroke="#78350F"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Wood Grain Highlights */}
    <path d="M13 32 Q 23 30, 36 30" stroke="#FDE68A" strokeWidth="1" fill="none" opacity="0.6" />
    <rect x="10" y="38" width="28" height="2" fill="#1C1917" />

    {/* 3D Curved Velvet Strap (Quai Nhung Đỏ Thắm Ôm Mu Bàn Chân) */}
    <path
      d="M14 28 C 17 18, 30 18, 33 28"
      stroke="#991B1B"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M15 27 C 18 19, 29 19, 32 27"
      stroke="#EF4444"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />

    {/* Brass Flower-Head Nail Rivets (Đinh Tán Đồng Hoa Thị) */}
    <circle cx="14" cy="29" r="2" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
    <circle cx="14" cy="29" r="0.6" fill="#451A03" />
    <circle cx="33" cy="29" r="2" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
    <circle cx="33" cy="29" r="0.6" fill="#451A03" />
  </svg>
);

/**
 * 6. BIỂU TƯỢNG DÁNG NGƯỜI & KHUÔN MẶT (IconVietMannequin)
 * Thiết kế nguyên bản: Chân dung quý phái người Việt với cổ kiêu ba ngấn,
 * búi tóc cung đình đoan trang và hoa tai ngọc trai.
 */
export const IconVietMannequin: React.FC<VietIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Biểu tượng Dáng Người & Khuôn Mặt"
    {...props}
  >
    <rect width="48" height="48" rx="10" fill="#FEF3C7" fillOpacity="0.4" />

    {/* Low Chignon Hair Bun (Búi tóc đoan trang) */}
    <ellipse cx="24" cy="11" rx="8" ry="4.5" fill="#1C1917" />
    <ellipse cx="24" cy="10" rx="5" ry="3" fill="#292524" />

    {/* Hair Dome */}
    <path
      d="M16 19 C 14 12, 34 12, 32 19 C 32 26, 30 28, 24 28 C 18 28, 16 26, 16 19 Z"
      fill="#1C1917"
    />

    {/* Face Oval (Mặt Trái Xoan Thanh Tú) */}
    <path
      d="M17 19 C 17 14, 31 14, 31 19 C 31 26, 28 31, 24 31 C 20 31, 17 26, 17 19 Z"
      fill="#FCE7DC"
      stroke="#D4A895"
      strokeWidth="1.2"
    />

    {/* Willow-leaf Brows & Phoenix Eyes */}
    <path d="M19 19 Q 22 17.5, 23 19" stroke="#3D291F" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <path d="M25 19 Q 26 17.5, 29 19" stroke="#3D291F" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <circle cx="21" cy="21" r="0.9" fill="#1C1917" />
    <circle cx="27" cy="21" r="0.9" fill="#1C1917" />

    {/* Rosy Petal Lips (Môi Anh Đào) */}
    <path d="M22 27 Q 24 28.5, 26 27" stroke="#BE123C" strokeWidth="1.5" strokeLinecap="round" fill="none" />

    {/* Pearl Drop Earrings (Hoa Tai Ngọc Trai) */}
    <circle cx="16" cy="23" r="1.4" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="0.6" />
    <circle cx="32" cy="23" r="1.4" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="0.6" />

    {/* Slender Swan Neck (Cổ Kiêu Ba Ngấn) */}
    <path d="M21 31 L20 39 L28 39 L27 31 Z" fill="#FCE7DC" stroke="#D4A895" strokeWidth="1" />
  </svg>
);

/**
 * 7. BIỂU TƯỢNG BỐI CẢNH KIẾN TRÚC DI SẢN (IconVietBackdrop)
 * Thiết kế nguyên bản: Cổng tam quan Cố Đô Huế / Khuê Văn Các với mái đao cong vút,
 * đầu hồi ngạc ngư và Lưỡng Long Chầu Nguyệt chuẩn mực kiến trúc Việt Nam.
 */
export const IconVietBackdrop: React.FC<VietIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Biểu tượng Bối Cảnh Di Sản Việt Nam"
    {...props}
  >
    <rect width="48" height="48" rx="10" fill="#FEF3C7" fillOpacity="0.4" />

    {/* Straight Roof Ridge with Lưỡng Long Chầu Nguyệt (Rồng Thời Lý/Nguyễn) */}
    <line x1="12" y1="17" x2="36" y2="17" stroke="#78350F" strokeWidth="1.8" />
    <circle cx="24" cy="15" r="2.2" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />

    {/* Vietnamese Curved Upturned Eaves (Mái Đao Cong Vút) */}
    <path
      d="M8 21 C 14 18, 34 18, 40 21 L37 24 C 33 22, 15 22, 11 24 Z"
      fill="#B45309"
      stroke="#78350F"
      strokeWidth="1.2"
    />

    {/* Upper Pavilion Wall */}
    <rect x="15" y="24" width="18" height="7" fill="#FEF3C7" stroke="#78350F" strokeWidth="1.2" />

    {/* Vietnamese Moon Gate Window (Cửa Nguyệt Môn Tròn) */}
    <circle cx="24" cy="27.5" r="2.5" fill="#991B1B" stroke="#78350F" strokeWidth="0.8" />

    {/* Lower Tier Eaves */}
    <path
      d="M6 31 C 12 29, 36 29, 42 31 L39 34 C 35 32, 13 32, 9 34 Z"
      fill="#B45309"
      stroke="#78350F"
      strokeWidth="1.2"
    />

    {/* Pillars & Plinth (Cột Gỗ Lim & Bậc Thềm Đá) */}
    <rect x="13" y="34" width="3.5" height="8" fill="#78350F" />
    <rect x="31.5" y="34" width="3.5" height="8" fill="#78350F" />
    {/* Central Portal */}
    <path d="M20 42 L20 37 C 20 35, 28 35, 28 37 L28 42 Z" fill="#991B1B" stroke="#78350F" strokeWidth="1" />
    {/* Base stone foundation */}
    <rect x="5" y="42" width="38" height="3" rx="0.5" fill="#78716C" stroke="#44403C" strokeWidth="1" />
  </svg>
);

/**
 * 8. BIỂU TƯỢNG PHÂN ĐỊNH GIỚI TÍNH DI SẢN (Dành Cho Nam)
 */
export const IconVietGenderMale: React.FC<VietIconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Nam Giới"
    {...props}
  >
    {/* Male Head with Khăn Đóng chữ Nhân V-Fold */}
    <ellipse cx="12" cy="7" rx="4.5" ry="3" fill="#1E293B" stroke="#0F172A" strokeWidth="0.8" />
    <path d="M10 6 L12 8 L14 6" stroke="#94A3B8" strokeWidth="1" fill="none" strokeLinecap="round" />
    {/* Face */}
    <path d="M8 8 C 8 6, 16 6, 16 8 L 15.5 11 Q 15 13 12 13 Q 9 13 8.5 11 Z" fill="#F2D1BF" stroke="#B8866E" strokeWidth="0.8" />
    {/* Masculine Shoulders & Robe */}
    <path d="M4 22 L5 16 C 5 14, 8 13.5, 12 13.5 C 16 13.5, 19 14, 19 16 L20 22 Z" fill="#0369A1" stroke="#075985" strokeWidth="1" />
    <line x1="12" y1="13.5" x2="12" y2="22" stroke="#BAE6FD" strokeWidth="0.8" />
  </svg>
);

/**
 * 9. BIỂU TƯỢNG PHÂN ĐỊNH GIỚI TÍNH DI SẢN (Dành Cho Nữ)
 */
export const IconVietGenderFemale: React.FC<VietIconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Nữ Giới"
    {...props}
  >
    {/* Female Hair Chignon Bun & Velvet Khăn Vấn */}
    <circle cx="12" cy="4" r="2.2" fill="#181311" />
    <ellipse cx="12" cy="7" rx="4.8" ry="3" fill="#181311" stroke="#44403C" strokeWidth="0.8" />
    {/* Face & Pearl drop */}
    <path d="M8.5 8 C 8.5 6, 15.5 6, 15.5 8 C 15.5 11, 14 13.5, 12 13.5 C 10 13.5, 8.5 11, 8.5 8 Z" fill="#FCE7DC" stroke="#D4A895" strokeWidth="0.8" />
    <circle cx="7.8" cy="10" r="0.8" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="0.4" />
    <circle cx="16.2" cy="10" r="0.8" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="0.4" />
    {/* Gentle Sloping Shoulders & Flowing Yếm/Robe */}
    <path d="M5 22 L6.5 16 C 7 14, 9 13.5, 12 13.5 C 15 13.5, 17 14, 17.5 16 L19 22 Z" fill="#BE123C" stroke="#9F1239" strokeWidth="1" />
    <path d="M10 13.5 L12 16 L14 13.5" stroke="#FFFFFF" strokeWidth="0.8" fill="none" />
  </svg>
);

/**
 * 10. BIỂU TƯỢNG UNISEX DI SẢN (Hòa Hợp Âm Dương - Mặt Trời Trống Đồng)
 */
export const IconVietGenderUnisex: React.FC<VietIconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Unisex Hòa Hợp"
    {...props}
  >
    {/* Bronze Drum Solar Medallion */}
    <circle cx="12" cy="12" r="9.5" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="3" fill="#D97706" />
    {/* 8 Radiating Sacred Sun Rays (Tia Sáng Trống Đồng Đông Sơn) */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <line
        key={i}
        x1="12"
        y1="5"
        x2="12"
        y2="7"
        stroke="#B45309"
        strokeWidth="1.4"
        strokeLinecap="round"
        transform={`rotate(${angle} 12 12)`}
      />
    ))}
  </svg>
);

/**
 * 11. BIỂU TƯỢNG DỊP TẾT & DU XUÂN (Hoa Đào / Hoa Mai Năm Cánh)
 */
export const IconVietOccasionTet: React.FC<VietIconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Tết & Du Xuân"
    {...props}
  >
    {/* 5 Petals of Vietnamese Plum/Peach Blossom */}
    {[0, 72, 144, 216, 288].map((angle, i) => (
      <ellipse
        key={i}
        cx="12"
        cy="7"
        rx="3.5"
        ry="4.5"
        fill="#F43F5E"
        stroke="#BE123C"
        strokeWidth="0.8"
        transform={`rotate(${angle} 12 12)`}
      />
    ))}
    {/* Blossom Center & Gold Stamen */}
    <circle cx="12" cy="12" r="2.8" fill="#FBBF24" stroke="#B45309" strokeWidth="0.8" />
    <circle cx="12" cy="12" r="1.2" fill="#DC2626" />
  </svg>
);

/**
 * 12. BIỂU TƯỢNG HỘI LÀNG QUAN HỌ (Nón Quai Thao Dân Gian)
 */
export const IconVietOccasionQuanHo: React.FC<VietIconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Hội Làng Quan Họ"
    {...props}
  >
    {/* Nón Ba Tầm Flat Conical Dome */}
    <ellipse cx="12" cy="9" rx="10" ry="4" fill="#FDE68A" stroke="#B45309" strokeWidth="1.2" />
    <ellipse cx="12" cy="9" rx="8" ry="2.8" fill="none" stroke="#D97706" strokeWidth="0.8" strokeDasharray="2 1.5" />
    <circle cx="12" cy="9" r="1.5" fill="#B45309" />
    {/* Flowing Thao Black Silk Ribbons dropping to chest */}
    <path d="M7 11 Q 5 16 6 22" stroke="#1C1917" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    <path d="M17 11 Q 19 16 18 22" stroke="#1C1917" strokeWidth="1.6" fill="none" strokeLinecap="round" />
  </svg>
);

/**
 * 13. BIỂU TƯỢNG CUNG ĐÌNH & CƯỚI HỎI (Kim Bảo Hoàng Gia & Vương Triều)
 */
export const IconVietOccasionCungDinh: React.FC<VietIconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Cung Đình & Cưới Hỏi"
    {...props}
  >
    {/* Vietnamese Imperial Seal / Royal Lotus Crest */}
    <path
      d="M4 18 L20 18 L18 10 L14 13 L12 6 L10 13 L6 10 Z"
      fill="#F59E0B"
      stroke="#78350F"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* Jade / Ruby Jewels */}
    <circle cx="12" cy="6" r="1.6" fill="#DC2626" stroke="#78350F" strokeWidth="0.6" />
    <circle cx="6" cy="10" r="1.2" fill="#047857" />
    <circle cx="18" cy="10" r="1.2" fill="#047857" />
    {/* Imperial Plinth */}
    <rect x="3" y="18" width="18" height="3" rx="0.5" fill="#B45309" stroke="#78350F" strokeWidth="0.8" />
  </svg>
);

/**
 * 14. BIỂU TƯỢNG STREETWEAR DẠO PHỐ (Áo Cách Tân Fusion)
 */
export const IconVietOccasionDaoPho: React.FC<VietIconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Streetwear Dạo Phố"
    {...props}
  >
    {/* Bamboo Minimalist Hanger */}
    <path d="M12 4 C 11 2, 13 2, 13 5 L 12 6 L 4 11 L 20 11 Z" stroke="#78350F" strokeWidth="1.2" fill="#FEF3C7" strokeLinejoin="round" />
    {/* Modernized Sleeveless / Minimal Robe */}
    <path d="M7 11 L6 21 L18 21 L17 11 Z" fill="#1E3A8A" stroke="#172554" strokeWidth="1.2" />
    {/* Contrast Lapel / Pocket */}
    <line x1="12" y1="11" x2="12" y2="21" stroke="#60A5FA" strokeWidth="1" strokeDasharray="2 1.5" />
    <rect x="8" y="14" width="3" height="3" rx="0.5" fill="#3B82F6" />
  </svg>
);

/**
 * 15. BIỂU TƯỢNG ĐI CHÙA KÍNH LỄ (Hoa Sen Lý - Trần & Thiền Môn)
 */
export const IconVietOccasionTamLinh: React.FC<VietIconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Đi Chùa Kính Lễ"
    {...props}
  >
    {/* Sacred Lotus Blossom (Hoa Sen Thời Lý) */}
    <path
      d="M12 4 C 13.5 8, 15 12, 12 17 C 9 12, 10.5 8, 12 4 Z"
      fill="#FB7185"
      stroke="#BE123C"
      strokeWidth="1"
    />
    <path
      d="M6 10 C 9 10, 12 14, 11 17 C 8 16, 5 13, 6 10 Z"
      fill="#FDA4AF"
      stroke="#BE123C"
      strokeWidth="0.8"
    />
    <path
      d="M18 10 C 15 10, 12 14, 13 17 C 16 16, 19 13, 18 10 Z"
      fill="#FDA4AF"
      stroke="#BE123C"
      strokeWidth="0.8"
    />
    {/* Ripple / Water pedestal */}
    <path d="M4 19 Q 12 21 20 19" stroke="#047857" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    <path d="M7 21 Q 12 22.5 17 21" stroke="#047857" strokeWidth="1" strokeLinecap="round" fill="none" />
  </svg>
);

/**
 * 16. BIỂU TƯỢNG KỶ YẾU SĨ TỬ (Bút Lông & Cuộn Thư Sĩ Tử Quốc Tử Giám)
 */
export const IconVietOccasionHocDuong: React.FC<VietIconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Kỷ Yếu Sĩ Tử"
    {...props}
  >
    {/* Bamboo Scholar Scroll (Thư Điệp Trúc Giản) */}
    <rect x="4" y="6" width="13" height="15" rx="1.5" fill="#FEF3C7" stroke="#78350F" strokeWidth="1.2" />
    <line x1="7" y1="9" x2="14" y2="9" stroke="#B45309" strokeWidth="1" strokeLinecap="round" />
    <line x1="7" y1="12" x2="14" y2="12" stroke="#B45309" strokeWidth="1" strokeLinecap="round" />
    <line x1="7" y1="15" x2="12" y2="15" stroke="#B45309" strokeWidth="1" strokeLinecap="round" />

    {/* Vietnamese Calligraphy Brush (Bút Lông) */}
    <path d="M19 4 L14 16 L12 18 L14 19 L15 18 L21 6 Z" fill="#78350F" stroke="#451A03" strokeWidth="0.8" />
    <path d="M12 18 L10 21 C 11 21, 13 21, 14 19 Z" fill="#1C1917" />
  </svg>
);

/**
 * 17. BIỂU TƯỢNG TẤT CẢ DỊP (Hoa Văn Sao Trống Đồng Đông Sơn)
 */
export const IconVietAllOccasions: React.FC<VietIconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Tất Cả Dịp"
    {...props}
  >
    <circle cx="12" cy="12" r="9" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="2.5" fill="#B45309" />
    {/* Sacred Concentric Dots & 4 Directions */}
    <path d="M12 4 L12 8" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M12 16 L12 20" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M4 12 L8 12" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M16 12 L20 12" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
