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

/**
 * 18. BIỂU TƯỢNG ÁO VIÊN LĨNH THỜI LÝ - TRẦN (IconVietVienLinh)
 * Cổ áo tròn khép kín quanh cổ, tay áo thụng rộng và đai lưng ngọc tôn nghiêm.
 */
export const IconVietVienLinh: React.FC<VietIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Áo Viên Lĩnh Cổ Tròn"
    {...props}
  >
    <rect width="48" height="48" rx="10" fill="#FEF3C7" fillOpacity="0.4" />
    {/* Wide Flowing Ly-Tran Sleeves */}
    <path d="M16 18 L5 23 C 4 30, 7 38, 14 39 L17 31 Z" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
    <path d="M32 18 L43 23 C 44 30, 41 38, 34 39 L31 31 Z" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
    {/* Body Robe */}
    <path d="M16 17 L32 17 L34 41 C 29 43, 19 43, 14 41 Z" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
    {/* Round Collar (Viên Lĩnh) */}
    <ellipse cx="24" cy="17" rx="6" ry="4" fill="#FEF3C7" stroke="#78350F" strokeWidth="1.6" />
    <ellipse cx="24" cy="17" rx="4" ry="2.5" fill="none" stroke="#F59E0B" strokeWidth="1" />
    {/* Right shoulder placket button */}
    <circle cx="28" cy="18" r="1.5" fill="#78350F" />
    {/* Imperial Jade Sash */}
    <rect x="18" y="27" width="12" height="4" rx="1" fill="#451A03" stroke="#78350F" strokeWidth="0.8" />
    <circle cx="21" cy="29" r="1" fill="#A7F3D0" />
    <circle cx="24" cy="29" r="1" fill="#A7F3D0" />
    <circle cx="27" cy="29" r="1" fill="#A7F3D0" />
  </svg>
);

/**
 * 19. BIỂU TƯỢNG HOA CÚC DÂY THỜI LÝ (IconPatternCucDayLy)
 * Đường lượn hình sin kinh điển của mỹ thuật Phật giáo Đại Việt thế kỷ 11-12.
 */
export const IconPatternCucDayLy: React.FC<VietIconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Hoa Cúc Dây Thời Lý"
    {...props}
  >
    {/* Sinusoidal wave vine */}
    <path d="M2 12 Q 7 4 12 12 T 22 12" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    {/* Chrysanthemum flower head in upper wave */}
    <circle cx="7" cy="8" r="3.5" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.2" />
    <circle cx="7" cy="8" r="1.2" fill="#B45309" />
    {/* Chrysanthemum flower head in lower wave */}
    <circle cx="17" cy="16" r="3.5" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.2" />
    <circle cx="17" cy="16" r="1.2" fill="#B45309" />
  </svg>
);

/**
 * 20. BIỂU TƯỢNG RỒNG THỜI TRẦN (IconPatternRongTran)
 * Thân rồng khúc lượn dũng mãnh, biểu tượng hào khí Đông A quật cường thế kỷ 13-14.
 */
export const IconPatternRongTran: React.FC<VietIconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Rồng Thời Trần"
    {...props}
  >
    {/* Undulating robust dragon body */}
    <path
      d="M3 18 C 6 10, 10 20, 14 11 C 17 4, 21 11, 23 7"
      stroke="#B45309"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
    />
    {/* Dragon head crest & horn */}
    <path d="M3 18 L2 14 L5 16 Z" fill="#B45309" />
    {/* Sharp talons / claws */}
    <path d="M10 16 L8 20 M11 17 L11 21" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
    {/* Flame fin */}
    <path d="M16 8 Q 18 5 20 8" stroke="#D97706" strokeWidth="1.2" fill="none" />
  </svg>
);

/**
 * 21. BIỂU TƯỢNG HẠC MÂY THỜI LÊ SƠ (IconPatternHacMayLe)
 * Hạc tiên tung cánh giữa ngàn mây bồng bềnh thế kỷ 15.
 */
export const IconPatternHacMayLe: React.FC<VietIconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Hạc Mây Thời Lê Sơ"
    {...props}
  >
    {/* Soaring Crane wings & body */}
    <path
      d="M12 7 L10 11 L4 9 L8 12 L10 14 L8 20 L11 15 L12 20 L13 14 L17 12 L21 9 L15 11 Z"
      fill="#FEF3C7"
      stroke="#B45309"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* Crane head & beak */}
    <circle cx="12" cy="5" r="1.2" fill="#B45309" />
    {/* Cloud swirls */}
    <path d="M2 17 Q 5 15 8 17" stroke="#D97706" strokeWidth="1" strokeLinecap="round" fill="none" />
    <path d="M16 6 Q 19 4 22 6" stroke="#D97706" strokeWidth="1" strokeLinecap="round" fill="none" />
  </svg>
);

/**
 * 22. BIỂU TƯỢNG LỤA TRƠN DỆT MỘC (IconPatternPlainSilk)
 * Ống thoi gỗ dệt lụa tơ tằm truyền thống Vạn Phúc / Nha Xá.
 */
export const IconPatternPlainSilk: React.FC<VietIconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Lụa Trơn Dệt Mộc"
    {...props}
  >
    {/* Weaving Shuttle (Con thoi dệt lụa gỗ) */}
    <path
      d="M3 12 C 5 7, 19 7, 21 12 C 19 17, 5 17, 3 12 Z"
      fill="#FEF3C7"
      stroke="#B45309"
      strokeWidth="1.2"
    />
    {/* Bobbin thread roll in center */}
    <rect x="9" y="10" width="6" height="4" rx="1" fill="#D97706" />
    <line x1="8" y1="12" x2="16" y2="12" stroke="#FFFFFF" strokeWidth="0.8" />
    {/* Flowing silk threads */}
    <path d="M15 12 Q 18 10 20 6" stroke="#D97706" strokeWidth="1" strokeLinecap="round" fill="none" />
    <path d="M9 12 Q 6 14 4 18" stroke="#D97706" strokeWidth="1" strokeLinecap="round" fill="none" />
  </svg>
);

/**
 * 23. BIỂU TƯỢNG BÁT BỬU CÁT TƯỜNG (IconPatternBatBuu)
 * Bát bửu cung đình triều Nguyễn: Pháp luân, Hoa sen, Nút thắt cát tường.
 */
export const IconPatternBatBuu: React.FC<VietIconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Bát Bửu Cát Tường"
    {...props}
  >
    {/* Concentric auspicious circle */}
    <circle cx="12" cy="12" r="8.5" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.2" />
    {/* Central Endless Knot / Dharmachakra cross */}
    <rect x="9.5" y="9.5" width="5" height="5" rx="1" fill="#D97706" stroke="#78350F" strokeWidth="0.8" />
    {/* 4 cardinal auspicious points */}
    <circle cx="12" cy="5.5" r="1.4" fill="#DC2626" />
    <circle cx="12" cy="18.5" r="1.4" fill="#DC2626" />
    <circle cx="5.5" cy="12" r="1.4" fill="#DC2626" />
    <circle cx="18.5" cy="12" r="1.4" fill="#DC2626" />
    {/* Diagonal petal lines */}
    <line x1="7.5" y1="7.5" x2="16.5" y2="16.5" stroke="#B45309" strokeWidth="0.9" />
    <line x1="7.5" y1="16.5" x2="16.5" y2="7.5" stroke="#B45309" strokeWidth="0.9" />
  </svg>
);

/**
 * 24. BIỂU TƯỢNG CHỮ THỌ TRIỀU NGUYỄN (IconPatternChuTho)
 * Chữ Thọ tròn chạm khắc trên ngai vàng, cung điện hoàng gia Huế.
 */
export const IconPatternChuTho: React.FC<VietIconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Chữ Thọ Triều Nguyễn"
    {...props}
  >
    {/* Circular Medallion */}
    <circle cx="12" cy="12" r="9" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.3" />
    {/* Horizontal bars of Shou character */}
    <line x1="6.5" y1="9" x2="17.5" y2="9" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="7" y1="12" x2="17" y2="12" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="6.5" y1="15" x2="17.5" y2="15" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />
    {/* Vertical central stem */}
    <line x1="12" y1="6" x2="12" y2="18" stroke="#78350F" strokeWidth="1.4" strokeLinecap="round" />
    {/* Top crown dot */}
    <circle cx="12" cy="4.5" r="0.8" fill="#B45309" />
  </svg>
);

/**
 * 25. BIỂU TƯỢNG GỐM CHU ĐẬU (IconPatternChuDau)
 * Đồ án cúc phù dung lam chàm trên gốm sứ Chu Đậu thế kỷ 15-16.
 */
export const IconPatternChuDau: React.FC<VietIconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Gốm Chu Đậu"
    {...props}
  >
    {/* Porcelain ceramic vase body outline */}
    <path
      d="M7 6 C 6 10, 5 15, 7 19 L 17 19 C 19 15, 18 10, 17 6 Z"
      fill="#E0F2FE"
      stroke="#0284C7"
      strokeWidth="1.2"
    />
    <ellipse cx="12" cy="6" rx="5" ry="1.5" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1" />
    {/* Cobalt Blue Chrysanthemum Petals (Men Lam Chàm) */}
    <path
      d="M12 9 C 10 11, 10 13, 12 15 C 14 13, 14 11, 12 9 Z"
      fill="#0369A1"
    />
    <path
      d="M9 12 C 11 10, 13 10, 15 12 C 13 14, 11 14, 9 12 Z"
      fill="#0284C7"
      opacity="0.8"
    />
    <circle cx="12" cy="12" r="1.2" fill="#38BDF8" />
  </svg>
);

/**
 * 25b. BIỂU TƯỢNG HOA SEN KHẮC CHÌM THỜI LÝ - TRẦN (IconPatternHoaSen)
 * Cánh sen cách điệu theo phong cách mỹ thuật Phật giáo Đại Việt thế kỷ 11-13.
 */
export const IconPatternHoaSen: React.FC<VietIconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Hoa Sen Thời Lý - Trần"
    {...props}
  >
    {/* Background soft tint */}
    <circle cx="12" cy="12" r="9.5" fill="#FDF2F8" stroke="#DB2777" strokeWidth="1" strokeOpacity="0.6" />
    {/* Lotus Central Petal */}
    <path
      d="M12 4.5 C10 8.5, 10 13.5, 12 17 C14 13.5, 14 8.5, 12 4.5 Z"
      fill="#F472B6"
      stroke="#BE185D"
      strokeWidth="0.9"
    />
    {/* Left Petal */}
    <path
      d="M12 9 C8.5 10.5, 6 13, 7 16 C9.5 17, 11 15.5, 12 14"
      fill="#FBCFE8"
      stroke="#BE185D"
      strokeWidth="0.9"
    />
    {/* Right Petal */}
    <path
      d="M12 9 C15.5 10.5, 18 13, 17 16 C14.5 17, 13 15.5, 12 14"
      fill="#FBCFE8"
      stroke="#BE185D"
      strokeWidth="0.9"
    />
    {/* Lotus Base Calyx */}
    <ellipse cx="12" cy="17" rx="3.5" ry="1.2" fill="#059669" />
  </svg>
);

/**
 * 25c. BIỂU TƯỢNG VÂN MÂY NGŨ SẮC TRIỀU NGUYỄN (IconPatternVanMay)
 * Đồ án mây cuộn uyển chuyển đan xen hình sóng nước cát tường triều Nguyễn.
 */
export const IconPatternVanMay: React.FC<VietIconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Vân Mây Ngũ Sắc Triều Nguyễn"
    {...props}
  >
    {/* Cloud Swirls */}
    <path
      d="M6 14 C4.5 14, 3.5 12.8, 4 11.2 C4.5 9.8, 6.2 9.5, 7.5 10.2 C8.2 8, 11 7, 13 8.5 C14.5 7.5, 17 8.2, 17.5 10 C19.2 10, 20.5 11.2, 20 12.8 C19.5 14.2, 17.8 14.5, 16.5 14 Z"
      fill="#FEF3C7"
      stroke="#D97706"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
    {/* Inner auspicious swirl line */}
    <path
      d="M8 12.5 Q11 10.5 13.5 12 Q15.5 13 17 11.5"
      stroke="#B45309"
      strokeWidth="0.9"
      strokeLinecap="round"
      fill="none"
    />
    {/* Water ripple / tail underneath */}
    <path
      d="M5.5 16.5 C8 15.5, 11 17.5, 14 16 C16 15, 18 16.5, 19.5 16"
      stroke="#DC2626"
      strokeWidth="1"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

/**
 * 26. BIỂU TƯỢNG MÔ HÌNH 3D VIỆT PHỤC (IconViet3D)
 * Khối đa giác 3D chạm khắc hoa văn Đại Việt.
 */
export const IconViet3D: React.FC<VietIconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Mô hình 3D Việt Phục"
    {...props}
  >
    {/* Isometric 3D Cube with Vietnamese Bronze/Gold Tone */}
    <path d="M12 2 L21 7 L12 12 L3 7 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M3 7 L12 12 L12 22 L3 17 Z" fill="#D97706" stroke="#92400E" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M12 12 L21 7 L21 17 L12 22 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.2" strokeLinejoin="round" />
    {/* Concentric Center Lotus Accent on top face */}
    <circle cx="12" cy="7" r="1.8" fill="#B45309" />
    <path d="M12 4 L12 10 M7.5 7 L16.5 7" stroke="#FEF3C7" strokeWidth="0.8" />
  </svg>
);

/**
 * 27. BIỂU TƯỢNG XOAY 360 ĐỘ 3D ORBIT (IconVietOrbit)
 * Vòng quay hoàng đạo 360 độ xung quanh trục trang phục di sản.
 */
export const IconVietOrbit: React.FC<VietIconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Xoay 360 độ 3D"
    {...props}
  >
    {/* 3D Orbit Ellipse Ring */}
    <ellipse cx="12" cy="12" rx="9.5" ry="4.5" stroke="#B45309" strokeWidth="1.4" strokeDasharray="3 1.5" />
    <path d="M21.5 12 L21.5 9.5 L19 12 Z" fill="#B45309" />
    <path d="M2.5 12 L2.5 14.5 L5 12 Z" fill="#B45309" />
    {/* Upright Center Axis with Jade Gem */}
    <line x1="12" y1="3" x2="12" y2="21" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2.8" fill="#FEF3C7" stroke="#78350F" strokeWidth="1" />
    <circle cx="12" cy="12" r="1.2" fill="#DC2626" />
  </svg>
);

/**
 * 28. BIỂU TƯỢNG ÁNH SÁNG STUDIO 3D (IconVietLighting)
 * Đèn lồng phố cổ / ánh hoàng hôn chiếu rọi trang phục.
 */
export const IconVietLighting: React.FC<VietIconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Ánh sáng 3D"
    {...props}
  >
    {/* Traditional Lantern / Sun source */}
    <circle cx="12" cy="10" r="5" fill="#FEF08A" stroke="#B45309" strokeWidth="1.2" />
    <ellipse cx="12" cy="10" rx="2.5" ry="5" fill="none" stroke="#D97706" strokeWidth="0.8" />
    {/* Lantern Top/Bottom Mounts */}
    <rect x="10" y="4" width="4" height="1.5" rx="0.5" fill="#78350F" />
    <rect x="10" y="14.5" width="4" height="1.5" rx="0.5" fill="#78350F" />
    {/* Hanging Tassel */}
    <path d="M12 16 L12 21" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="21" r="1.2" fill="#991B1B" />
    {/* Radiating Light Beams */}
    <path d="M4 6 L2 4 M20 6 L22 4 M3 10 L1 10 M21 10 L23 10" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/**
 * 29. BIỂU TƯỢNG TIÊU ĐIỂM CHI TIẾT 3D (IconVietFocus)
 * Kính ngắm tiêu điểm soi đường nét hoa văn & sống lưng.
 */
export const IconVietFocus: React.FC<VietIconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Tiêu điểm 3D"
    {...props}
  >
    {/* 4 Corner Crosshairs */}
    <path d="M4 8 L4 4 L8 4" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 4 L20 4 L20 8" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M20 16 L20 20 L16 20" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 20 L4 20 L4 16" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
    {/* Center Target Disc */}
    <circle cx="12" cy="12" r="3.5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="1.5" fill="#DC2626" />
  </svg>
);


