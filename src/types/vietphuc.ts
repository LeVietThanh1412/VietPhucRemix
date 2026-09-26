export type GarmentId = 
  | 'ao-tac'
  | 'ao-ngu-than'
  | 'ao-tu-than'
  | 'ao-nhat-binh'
  | 'ao-giao-linh'
  | 'ao-dai-tan-thoi';

export type PatternId = 
  | 'plain-silk'
  | 'van-may'
  | 'hoa-sen'
  | 'bat-buu'
  | 'chu-tho'
  | 'chu-dau';

export type ColorId = 
  | 'do-chu-sa'
  | 'hoang-yen'
  | 'lam-cham'
  | 'ngoc-bich'
  | 'canh-sen'
  | 'tim-hue'
  | 'trang-nga'
  | 'den-mun'
  | 'cam-bat-trang';

export type BottomId = 
  | 'quan-lua-trang'
  | 'quan-lua-den'
  | 'vay-xep-ly'
  | 'quan-palazzo'
  | 'quan-jeans-suong';

export type HeadwearId = 
  | 'none'
  | 'khan-van'
  | 'khan-dong'
  | 'non-quai-thao'
  | 'non-la'
  | 'bom-ngoc-trai'
  | 'tram-cai-toc';

export type FootwearId = 
  | 'sneaker-trang'
  | 'guoc-moc'
  | 'giay-oxford'
  | 'sandal-toi-gian'
  | 'boot-da-co-thap';

export type AccessoryId = 
  | 'kinh-mat-y2k'
  | 'kinh-gong-tron'
  | 'kieng-bac'
  | 'choker-ngoc-trai'
  | 'tui-tote-cham'
  | 'tui-coi-dan'
  | 'quat-giay-do'
  | 'dai-ngu-sac';

export type EventId = 
  | 'tet-du-xuan'
  | 'ky-yeu-hoc-duong'
  | 'le-chua-tam-linh'
  | 'ca-phe-dao-pho'
  | 'dam-cuoi-ban-than'
  | 'bieu-dien-van-nghe';

export type WeatherId = 
  | 'xuan-se-lanh'
  | 'ha-oi-nong'
  | 'thu-diu-mat'
  | 'dong-lanh-gia';

export type ModelGender = 'female' | 'male' | 'unisex';

export interface GarmentDefinition {
  id: GarmentId;
  name: string;
  dynasty: string;
  shortDesc: string;
  culturalSignificance: string;
  features: string[];
  traditionalOccasions: string[];
  modernVibe: string;
  recommendedColors: ColorId[];
  etiquetteNotes: string[];
  /** Mức độ tư liệu: có hiện vật/ảnh tư liệu, phỏng dựng từ nguồn gián tiếp, hay cách tân hiện đại */
  authenticity: AuthenticityLevel;
  /** Ghi chú kiểm chứng: phân biệt dữ kiện lịch sử với cách diễn giải dân gian */
  verificationNote: string;
  sources: CulturalSource[];
}

export type AuthenticityLevel = 'documented' | 'reconstructed' | 'modern';

export interface CulturalSource {
  title: string;
  author?: string;
  publisher?: string;
  year?: string;
  type: 'book' | 'museum' | 'historical-record' | 'press';
  note?: string;
}

export interface ColorDefinition {
  id: ColorId;
  name: string;
  hex: string;
  element: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
  meaning: string;
  culturalBackground: string;
}

export interface PatternDefinition {
  id: PatternId;
  name: string;
  description: string;
  culturalOrigin: string;
  symbolism: string;
}

export interface ItemOption<T extends string> {
  id: T;
  name: string;
  category: string;
  description: string;
  genzTip: string;
  formality: 'formal' | 'semi-formal' | 'casual';
}

export interface OutfitConfig {
  garmentId: GarmentId;
  colorId: ColorId;
  patternId: PatternId;
  bottomId: BottomId;
  headwearId: HeadwearId;
  footwearId: FootwearId;
  accessories: AccessoryId[];
  targetEvent: EventId;
  modelGender: ModelGender;
  backdrop: 'hoang-thanh' | 'pho-co' | 'studio-zen' | 'hieu-anh';
}

export type AlertLevel = 'critical' | 'warning' | 'info' | 'kudos';

export interface CulturalAlert {
  id?: string;
  level: AlertLevel;
  title: string;
  message: string;
  guidance: string;
  /** Cơ sở văn hóa / lý do của luật */
  basis?: string;
}

export interface CulturalRule {
  id: string;
  level: AlertLevel;
  /** Nhóm luật để hiển thị/thống kê */
  category: 'boi-canh' | 'tang-lop' | 'vung-mien' | 'mau-sac' | 'hoa-van' | 'gioi' | 'cau-truc' | 'remix';
  when: (config: OutfitConfig) => boolean;
  title: string;
  message: string;
  guidance: string;
  basis: string;
}

export interface ColorHarmonyResult {
  score: number; // 0 - 100
  title: string;
  elementAnalysis: string;
  ratioAnalysis: string;
  advice: string;
  tags: string[];
}

export interface LookbookPreset {
  id: string;
  title: string;
  subtitle: string;
  vibe: string;
  tagline: string;
  config: OutfitConfig;
  story: string;
  curatorNotes: string;
}
