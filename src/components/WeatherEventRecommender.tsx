import React from 'react';
import { EventId, WeatherId, OutfitConfig } from '../types/vietphuc';
import { EVENTS, EVENT_COMBOS } from '../data/heritageData';
import {
  CITIES,
  LiveWeather,
  adviseForWeather,
  describeWeatherCode,
  fetchLiveWeather,
  toWeatherId
} from '../utils/weatherService';
import { Calendar, CloudSun, Sparkles, Check, LocateFixed, Loader2, RefreshCw, WifiOff } from 'lucide-react';

interface WeatherEventRecommenderProps {
  currentEvent: EventId;
  onSelectEvent: (eventId: EventId) => void;
  onApplyRecommendedCombo: (configUpdate: Partial<OutfitConfig>) => void;
}

const WEATHERS: { id: WeatherId; label: string; temp: string; icon: string; advice: string }[] = [
  { id: 'xuan-se-lanh', label: 'Xuân Se Lạnh', temp: '19° - 24°C', icon: '🌸', advice: 'Lụa hoặc gấm dệt dày vừa là hợp nhất. Thêm khăn vấn để giữ ấm trán và tạo nét đài các.' },
  { id: 'ha-oi-nong', label: 'Hạ Nắng Ấm', temp: '29° - 35°C', icon: '☀️', advice: 'Ưu tiên tơ tằm Vạn Phúc thoáng khí, áo tứ thân với yếm lụa, hoặc ngũ thân tay chẽn gọn gàng.' },
  { id: 'thu-diu-mat', label: 'Thu Dịu Mát', temp: '23° - 27°C', icon: '🍂', advice: 'Mùa đẹp để chụp kỷ yếu và dạo phố. Phối cùng sneaker và kính mắt retro là điểm 10.' },
  { id: 'dong-lanh-gia', label: 'Đông Rét Mướt', temp: '14° - 18°C', icon: '❄️', advice: 'Chọn áo tấc hoặc ngũ thân lót đôi, kèm boot cổ thấp và một áo len mỏng cổ lọ bên trong.' }
];

const CITY_KEY = 'vietphuc-remix:city';

export const WeatherEventRecommender: React.FC<WeatherEventRecommenderProps> = ({
  currentEvent,
  onSelectEvent,
  onApplyRecommendedCombo
}) => {
  const [selectedWeather, setSelectedWeather] = React.useState<WeatherId>('xuan-se-lanh');
  const [cityId, setCityId] = React.useState<string>(() => localStorage.getItem(CITY_KEY) || 'ha-noi');
  const [live, setLive] = React.useState<LiveWeather | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  const load = React.useCallback(async (lat: number, lon: number, name: string) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    setError(null);
    try {
      const w = await fetchLiveWeather(lat, lon, name, ctrl.signal);
      setLive(w);
      setSelectedWeather(toWeatherId(w));
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        setError('Không tải được thời tiết (mất mạng?). Bạn vẫn có thể chọn mùa thủ công bên dưới.');
      }
    } finally {
      if (abortRef.current === ctrl) setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (cityId === 'gps') return;
    const city = CITIES.find(c => c.id === cityId) || CITIES[0];
    localStorage.setItem(CITY_KEY, city.id);
    load(city.lat, city.lon, city.name);
  }, [cityId, load]);

  React.useEffect(() => () => abortRef.current?.abort(), []);

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setError('Trình duyệt không hỗ trợ định vị.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCityId('gps');
        load(pos.coords.latitude, pos.coords.longitude, 'Vị trí của bạn');
      },
      () => {
        setLoading(false);
        setError('Bạn đã từ chối quyền vị trí. Hãy chọn thành phố thủ công.');
      },
      { timeout: 8000, maximumAge: 600000 }
    );
  };

  const refresh = () => {
    if (cityId === 'gps') return handleGeolocate();
    const city = CITIES.find(c => c.id === cityId) || CITIES[0];
    load(city.lat, city.lon, city.name);
  };

  const currentEventData = EVENTS.find(e => e.id === currentEvent) || EVENTS[0];
  const activeWeather = WEATHERS.find(w => w.id === selectedWeather) || WEATHERS[0];
  const baseCombo = { ...EVENT_COMBOS[currentEvent], targetEvent: currentEvent };
  const liveAdvice = live ? adviseForWeather(live, baseCombo) : null;
  const liveDesc = live ? describeWeatherCode(live.weatherCode) : null;

  const handleApplyCombo = () => {
    onApplyRecommendedCombo({ ...EVENT_COMBOS[currentEvent], ...(liveAdvice?.adjust ?? {}) });
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-800">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 text-sm md:text-base">Gợi Ý Theo Sự Kiện & Thời Tiết</h3>
            <p className="text-xs text-stone-500">Thời tiết thực tế + bối cảnh sự kiện → công thức phối phù hợp</p>
          </div>
        </div>
      </div>

      {/* Events Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">1. Sự kiện / Mục đích diện đồ:</label>
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

      {/* Live weather */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">2. Thời tiết hôm nay:</label>
          <div className="flex items-center gap-1.5">
            <select
              value={cityId}
              onChange={e => setCityId(e.target.value)}
              className="text-xs border border-stone-200 rounded-md px-2 py-1 bg-white"
              aria-label="Chọn thành phố"
            >
              {CITIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              {cityId === 'gps' && <option value="gps">Vị trí của bạn</option>}
            </select>
            <button onClick={handleGeolocate} className="p-1.5 rounded-md border border-stone-200 hover:bg-stone-100 text-stone-600" title="Dùng vị trí hiện tại">
              <LocateFixed className="w-3.5 h-3.5" />
            </button>
            <button onClick={refresh} disabled={loading} className="p-1.5 rounded-md border border-stone-200 hover:bg-stone-100 text-stone-600 disabled:opacity-50" title="Làm mới">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-600">
            <WifiOff className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {live && liveDesc && (
          <div className="p-3 rounded-lg border border-sky-100 bg-sky-50/50 text-xs flex items-center gap-3 flex-wrap">
            <span className="text-2xl" aria-hidden>{liveDesc.icon}</span>
            <div className="flex-1 min-w-[140px]">
              <div className="font-semibold text-stone-900">
                {live.placeName}: {live.temperature}°C · {liveDesc.label}
              </div>
              <div className="text-[11px] text-stone-500">
                Cảm giác {live.apparentTemperature}°C · {live.tempMin}°–{live.tempMax}°C · Ẩm {live.humidity}% · Mưa {live.rainChance}% · UV {live.uvMax}
              </div>
            </div>
            <span className="text-[10px] text-stone-400">Nguồn: Open-Meteo</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {WEATHERS.map(w => (
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
              <span className={`text-[10px] block mt-0.5 ${selectedWeather === w.id ? 'text-stone-300' : 'text-stone-400'}`}>{w.temp}</span>
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
            {liveAdvice && liveAdvice.tips.length > 0 && (
              <ul className="pt-1 space-y-1">
                {liveAdvice.tips.map((t, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-stone-700">
                    <span className="text-sky-600 shrink-0">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          onClick={handleApplyCombo}
          className="w-full py-2 px-3 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 shadow-xs mt-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span>{live ? 'Áp dụng công thức theo sự kiện + thời tiết hôm nay' : 'Áp dụng công thức phối chuẩn cho sự kiện này'}</span>
        </button>
      </div>
    </div>
  );
};
