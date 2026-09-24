import React from 'react';
import { EventId, WeatherId, OutfitConfig } from '../types/vietphuc';
import { EVENTS } from '../data/heritageData';
import { Calendar, CloudSun, Sparkles, Check } from 'lucide-react';

interface WeatherEventRecommenderProps {
  currentEvent: EventId;
  onSelectEvent: (eventId: EventId) => void;
  onApplyRecommendedCombo: (configUpdate: Partial<OutfitConfig>) => void;
}

export const WeatherEventRecommender: React.FC<WeatherEventRecommenderProps> = ({
  currentEvent,
  onSelectEvent,
  onApplyRecommendedCombo
}) => {
  const [selectedWeather, setSelectedWeather] = React.useState<WeatherId>('xuan-se-lanh');

  const weathers: { id: WeatherId; label: string; temp: string; icon: string; advice: string }[] = [
    { id: 'xuan-se-lanh', label: 'Xuân Se Lạnh', temp: '19° - 24°C', icon: '🌸', advice: 'Rất hợp lụa gấm dệt dày vừa, thêm khăn vấn giữ ấm trán và tạo nét đài các.' },
    { id: 'ha-oi-nong', label: 'Hạ Nắng Ấm', temp: '29° - 35°C', icon: '☀️', advice: 'Ưu tiên tơ tằm Vạn Phúc thoáng khí, áo tứ thân yếm lụa hoặc ngũ thân tay chẽn gọn gàng.' },
    { id: 'thu-diu-mat', label: 'Thu Hà Nội', temp: '23° - 27°C', icon: '🍂', advice: 'Mùa vàng chụp ảnh kỷ yếu và dạo phố! Phối cùng sneaker và kính mắt retro là điểm 10.' },
    { id: 'dong-lanh-gia', label: 'Đông Rét Mướt', temp: '14° - 18°C', icon: '❄️', advice: 'Chọn áo tấc hoặc ngũ thân lót đôi, phối kèm boot cổ thấp và áo len mỏng cổ lọ bên trong.' }
  ];

  const currentEventData = EVENTS.find(e => e.id === currentEvent) || EVENTS[0];

  const handleApplyCombo = () => {
    // Determine the best config for this event + weather
    if (currentEvent === 'tet-du-xuan') {
      onApplyRecommendedCombo({
        garmentId: 'ao-tac',
        colorId: 'do-chu-sa',
        bottomId: 'quan-lua-trang',
        headwearId: 'khan-van',
        footwearId: 'guoc-moc',
        backdrop: 'hoang-thanh'
      });
    } else if (currentEvent === 'ky-yeu-hoc-duong') {
      onApplyRecommendedCombo({
        garmentId: 'ao-ngu-than',
        colorId: 'lam-cham',
        bottomId: 'quan-lua-trang',
        headwearId: 'khan-van',
        footwearId: 'sneaker-trang',
        backdrop: 'pho-co'
      });
    } else if (currentEvent === 'le-chua-tam-linh') {
      onApplyRecommendedCombo({
        garmentId: 'ao-giao-linh',
        colorId: 'trang-nga',
        bottomId: 'quan-lua-den',
        headwearId: 'khan-dong',
        footwearId: 'giay-oxford',
        backdrop: 'studio-zen'
      });
    } else if (currentEvent === 'ca-phe-dao-pho') {
      onApplyRecommendedCombo({
        garmentId: 'ao-tu-than',
        colorId: 'canh-sen',
        bottomId: 'vay-xep-ly',
        headwearId: 'bom-ngoc-trai',
        footwearId: 'guoc-moc',
        backdrop: 'pho-co'
      });
    } else if (currentEvent === 'dam-cuoi-ban-than') {
      onApplyRecommendedCombo({
        garmentId: 'ao-nhat-binh',
        colorId: 'hoang-yen',
        bottomId: 'quan-lua-trang',
        headwearId: 'khan-van',
        footwearId: 'guoc-moc',
        backdrop: 'hoang-thanh'
      });
    } else {
      onApplyRecommendedCombo({
        garmentId: 'ao-tu-than',
        colorId: 'cam-bat-trang',
        bottomId: 'vay-xep-ly',
        headwearId: 'non-quai-thao',
        footwearId: 'guoc-moc',
        backdrop: 'pho-co'
      });
    }
  };

  const activeWeather = weathers.find(w => w.id === selectedWeather) || weathers[0];

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-800">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 text-sm md:text-base">
              Gợi Ý Theo Sự Kiện & Thời Tiết
            </h3>
            <p className="text-xs text-stone-500">
              Chọn bối cảnh thực tế để ứng dụng trang phục phù hợp nhất
            </p>
          </div>
        </div>
      </div>

      {/* Events Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
          1. Sự kiện / Mục đích diện đồ:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {EVENTS.map(evt => (
            <button
              key={evt.id}
              onClick={() => onSelectEvent(evt.id)}
              className={`p-2.5 rounded-lg text-left border transition-all text-xs ${
                currentEvent === evt.id
                  ? 'border-amber-800 bg-amber-50/60 text-stone-900 font-semibold shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white text-stone-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{evt.name}</span>
                {currentEvent === evt.id && <Check className="w-3.5 h-3.5 text-amber-800 shrink-0" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Weather Selector */}
      <div className="space-y-1.5 pt-1">
        <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
          2. Tiết trời & Khí hậu:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {weathers.map(w => (
            <button
              key={w.id}
              onClick={() => setSelectedWeather(w.id)}
              className={`p-2 rounded-lg text-left border transition-all text-xs ${
                selectedWeather === w.id
                  ? 'border-stone-900 bg-stone-900 text-white font-semibold shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-stone-50/80 text-stone-700'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>{w.icon}</span>
                <span className="truncate">{w.label}</span>
              </div>
              <span className={`text-[10px] block mt-0.5 ${selectedWeather === w.id ? 'text-stone-300' : 'text-stone-400'}`}>
                {w.temp}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Smart Advice Box */}
      <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200/80 text-xs space-y-2">
        <div className="flex items-start gap-2">
          <CloudSun className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-stone-900">
              Tư vấn cho "{currentEventData.name}" ({activeWeather.label}):
            </span>
            <p className="text-stone-600 leading-relaxed">
              {currentEventData.desc} {activeWeather.advice}
            </p>
          </div>
        </div>

        <button
          onClick={handleApplyCombo}
          className="w-full py-2 px-3 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 shadow-xs mt-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span>Áp dụng công thức phối chuẩn cho sự kiện này</span>
        </button>
      </div>
    </div>
  );
};
