import React from 'react';
import { EventId, ModelGender, OutfitConfig } from '../types/vietphuc';
import { EVENT_COMBOS } from '../data/heritageData';
import { eventCombo } from '../utils/eventRecommendations';
import { Sparkles, Compass } from 'lucide-react';
import { 
  IconVietAllOccasions,
  IconVietOccasionTet,
  IconVietOccasionQuanHo,
  IconVietOccasionCungDinh,
  IconVietOccasionDaoPho,
  IconVietOccasionTamLinh,
  IconVietOccasionHocDuong
} from './VietIcons';

export type OccasionTag = 'all' | 'tet' | 'quan-ho' | 'cung-dinh' | 'dao-pho' | 'tam-linh' | 'hoc-duong';

export interface OccasionInfo {
  id: OccasionTag;
  label: string;
  Icon: React.FC<{ size?: number; className?: string }>;
  mappedEventId?: EventId;
  description: string;
  seasonVibe: string;
}

export const OCCASIONS_LIST: OccasionInfo[] = [
  {
    id: 'all',
    label: 'Tất cả dịp',
    Icon: IconVietAllOccasions,
    description: 'Toàn bộ kho tàng trang phục và phụ kiện di sản đương đại.',
    seasonVibe: 'Bốn mùa quanh năm'
  },
  {
    id: 'tet',
    label: 'Tết & Du Xuân',
    Icon: IconVietOccasionTet,
    mappedEventId: 'tet-du-xuan',
    description: 'Sắc đỏ Chu Sa, vàng Hoàng Yến tượng trưng cho may mắn, thịnh vượng đầu năm.',
    seasonVibe: 'Mùa Xuân · Se lạnh tươi mới'
  },
  {
    id: 'quan-ho',
    label: 'Hội Làng Quan Họ',
    Icon: IconVietOccasionQuanHo,
    mappedEventId: 'bieu-dien-van-nghe',
    description: 'Áo Tứ Thân, nón quai thao, dải thắt lưng ngũ sắc đậm tình Kinh Bắc mộc mạc.',
    seasonVibe: 'Đầu xuân hội hè dân gian'
  },
  {
    id: 'cung-dinh',
    label: 'Cung Đình & Cưới Hỏi',
    Icon: IconVietOccasionCungDinh,
    mappedEventId: 'dam-cuoi-ban-than',
    description: 'Áo Tấc, Áo Nhật Bình uy nghiêm, lễ nghi đường bàng cho hỷ sự và đại lễ.',
    seasonVibe: 'Trọng thể · Hôn lễ gia tiên'
  },
  {
    id: 'dao-pho',
    label: 'Streetwear Dạo Phố',
    Icon: IconVietOccasionDaoPho,
    mappedEventId: 'ca-phe-dao-pho',
    description: 'Áo Ngũ Thân tay chẽn phối cùng Sneaker, túi tote chàm năng động cho Gen Z.',
    seasonVibe: 'Thu dịu mát · Thường nhật'
  },
  {
    id: 'tam-linh',
    label: 'Đi Chùa Kính Lễ',
    Icon: IconVietOccasionTamLinh,
    mappedEventId: 'le-chua-tam-linh',
    description: 'Áo Giao Lĩnh vạt chéo kín đáo, màu Trắng Ngà thanh tịnh, đoan trang chốn thiền môn.',
    seasonVibe: 'Thanh tịnh · Trang nghiêm'
  },
  {
    id: 'hoc-duong',
    label: 'Kỷ Yếu Sĩ Tử',
    Icon: IconVietOccasionHocDuong,
    mappedEventId: 'ky-yeu-hoc-duong',
    description: 'Áo Ngũ Thân hoặc Giao Lĩnh sĩ tử Quốc Tử Giám, kính tròn học giả trí tuệ.',
    seasonVibe: 'Học đường · Tốt nghiệp'
  }
];

interface OccasionFilterBarProps {
  selectedTag: OccasionTag;
  modelGender: ModelGender;
  onSelectTag: (tag: OccasionTag) => void;
  onApplyPresetLook: (configPatch: Partial<OutfitConfig>) => void;
}

export const OccasionFilterBar: React.FC<OccasionFilterBarProps> = ({
  selectedTag,
  modelGender,
  onSelectTag,
  onApplyPresetLook
}) => {
  const currentOccasion = OCCASIONS_LIST.find(o => o.id === selectedTag) || OCCASIONS_LIST[0];
  const hasPreset = currentOccasion.mappedEventId && EVENT_COMBOS[currentOccasion.mappedEventId];

  const handleApplyCombo = () => {
    if (!currentOccasion.mappedEventId) return;
    const combo = EVENT_COMBOS[currentOccasion.mappedEventId];
    if (combo) {
      onApplyPresetLook(eventCombo(currentOccasion.mappedEventId, modelGender));
    }
  };

  return (
    <div className="space-y-3">
      {/* Scrollable Occasion Tag Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none select-none">
        {OCCASIONS_LIST.map(occ => {
          const isSelected = selectedTag === occ.id;
          return (
            <button
              key={occ.id}
              onClick={() => onSelectTag(occ.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? 'bg-amber-900 text-amber-50 shadow-xs ring-2 ring-amber-800/30'
                  : 'bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 border border-stone-200/90'
              }`}
            >
              <occ.Icon size={16} />
              <span>{occ.label}</span>
            </button>
          );
        })}
      </div>

      {/* Occasion Capsule Card with 1-Click Outfit Preset */}
      {selectedTag !== 'all' && (
        <div className="p-3 bg-gradient-to-r from-amber-50/90 to-orange-50/70 border border-amber-200/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs animate-in fade-in duration-150">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-amber-950 flex items-center gap-1.5">
                <currentOccasion.Icon size={18} />
                <span>{currentOccasion.label}</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900 font-medium">
                {currentOccasion.seasonVibe}
              </span>
            </div>
            <p className="text-xs text-stone-600">
              {currentOccasion.description}
            </p>
          </div>

          {hasPreset && (
            <button
              onClick={handleApplyCombo}
              className="px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-2xs transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Chạm Phối Chuẩn Dịp</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
