import { OutfitConfig, WeatherId } from '../types/vietphuc';

export interface City {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export const CITIES: City[] = [
  { id: 'ha-noi', name: 'Hà Nội', lat: 21.0285, lon: 105.8542 },
  { id: 'bac-ninh', name: 'Bắc Ninh', lat: 21.1861, lon: 106.0763 },
  { id: 'hue', name: 'Huế', lat: 16.4637, lon: 107.5909 },
  { id: 'da-nang', name: 'Đà Nẵng', lat: 16.0544, lon: 108.2022 },
  { id: 'tp-hcm', name: 'TP. Hồ Chí Minh', lat: 10.8231, lon: 106.6297 },
  { id: 'can-tho', name: 'Cần Thơ', lat: 10.0452, lon: 105.7469 }
];

export interface LiveWeather {
  placeName: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  tempMax: number;
  tempMin: number;
  rainChance: number;
  uvMax: number;
  fetchedAt: string;
}

export type WeatherIconType = 'sun' | 'cloud-sun' | 'cloud' | 'cloud-fog' | 'cloud-drizzle' | 'cloud-rain' | 'cloud-lightning' | 'thermometer';

/** WMO weather code → Vietnamese label + icon */
export function describeWeatherCode(code: number): { label: string; icon: string; iconType: WeatherIconType } {
  if (code === 0) return { label: 'Trời quang', icon: '☀️', iconType: 'sun' };
  if (code === 1 || code === 2) return { label: 'Ít mây', icon: '🌤️', iconType: 'cloud-sun' };
  if (code === 3) return { label: 'Nhiều mây', icon: '☁️', iconType: 'cloud' };
  if (code === 45 || code === 48) return { label: 'Sương mù', icon: '🌫️', iconType: 'cloud-fog' };
  if (code >= 51 && code <= 57) return { label: 'Mưa phùn', icon: '🌦️', iconType: 'cloud-drizzle' };
  if (code >= 61 && code <= 67) return { label: 'Mưa', icon: '🌧️', iconType: 'cloud-rain' };
  if (code >= 80 && code <= 82) return { label: 'Mưa rào', icon: '🌧️', iconType: 'cloud-rain' };
  if ([95, 96, 99].includes(code)) return { label: 'Dông', icon: '⛈️', iconType: 'cloud-lightning' };
  return { label: 'Không xác định', icon: '🌡️', iconType: 'thermometer' };
}

export const isRainy = (w: LiveWeather) =>
  w.precipitation > 0.2 || w.rainChance >= 60 || (w.weatherCode >= 51 && w.weatherCode <= 99 && w.weatherCode !== 45 && w.weatherCode !== 48);

export async function fetchLiveWeather(lat: number, lon: number, placeName: string, signal?: AbortSignal): Promise<LiveWeather> {
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) throw new Error('Invalid weather coordinates');
  const params = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lon.toFixed(4),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max',
    timezone: 'auto',
    forecast_days: '1'
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal });
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
  const d = await res.json();
  const c = d?.current ?? {};
  const daily = d?.daily ?? {};
  const finite = (v: unknown, fallback = 0): number => typeof v === 'number' && Number.isFinite(v) ? v : fallback;
  if (![c.temperature_2m, c.apparent_temperature, c.relative_humidity_2m].every(v => typeof v === 'number' && Number.isFinite(v))) {
    throw new Error('Invalid weather data');
  }
  return {
    placeName,
    temperature: Math.round(c.temperature_2m),
    apparentTemperature: Math.round(c.apparent_temperature),
    humidity: Math.max(0, Math.min(100, Math.round(c.relative_humidity_2m))),
    precipitation: Math.max(0, finite(c.precipitation)),
    weatherCode: finite(c.weather_code, -1),
    windSpeed: Math.max(0, Math.round(finite(c.wind_speed_10m))),
    tempMax: Math.round(finite(daily.temperature_2m_max?.[0], c.temperature_2m)),
    tempMin: Math.round(finite(daily.temperature_2m_min?.[0], c.temperature_2m)),
    rainChance: Math.max(0, Math.min(100, finite(daily.precipitation_probability_max?.[0]))),
    uvMax: Math.max(0, Math.round(finite(daily.uv_index_max?.[0]))),
    fetchedAt: new Date().toISOString()
  };
}

/** Map real temperature to the app's 4 seasonal presets (uses "feels like"). */
export function toWeatherId(w: LiveWeather, month = new Date().getMonth() + 1): WeatherId {
  const t = w.apparentTemperature;
  if (t >= 29) return 'ha-oi-nong';
  if (t <= 18) return 'dong-lanh-gia';
  if (t <= 24 && month >= 1 && month <= 4) return 'xuan-se-lanh';
  return 'thu-diu-mat';
}

export interface WeatherAdvice {
  tips: string[];
  /** Adjustments applied on top of the event combo */
  adjust: Partial<OutfitConfig>;
}

/** Material / footwear / headwear advice from live data. Respects ceremonial garments. */
export function adviseForWeather(w: LiveWeather, base: Partial<OutfitConfig>): WeatherAdvice {
  const tips: string[] = [];
  const adjust: Partial<OutfitConfig> = {};
  const ceremonial = ['ao-tac', 'ao-nhat-binh', 'ao-vien-linh'].includes(base.garmentId ?? '');
  const formalEvent = base.targetEvent === 'le-chua-tam-linh' || base.targetEvent === 'dam-cuoi-ban-than';

  if (w.apparentTemperature >= 32) {
    tips.push('Trời nóng: chọn lụa tơ tằm, đũi hoặc lanh mỏng, mặc một lớp. Tránh gấm dày và áo lót đôi.');
  } else if (w.apparentTemperature <= 16) {
    tips.push('Trời lạnh: mặc áo lót đôi (có lớp lót) hoặc thêm áo giữ nhiệt mỏng bên trong, nên che kín cổ. Gấm và nhung giữ ấm tốt.');
    adjust.footwearId = ceremonial || formalEvent ? 'giay-oxford' : 'boot-da-co-thap';
  } else if (w.apparentTemperature <= 22) {
    tips.push('Trời se lạnh: dùng gấm hoặc lụa dày vừa. Khăn vấn vừa giữ ấm vừa làm đẹp.');
  } else {
    tips.push('Trời dễ chịu: lụa hay gấm đều mặc được, là lúc đẹp nhất để chụp ảnh ngoài trời.');
  }

  if (isRainy(w)) {
    tips.push(`Khả năng mưa ${w.rainChance}%: tránh lụa màu nhạt dễ ố nước, guốc mộc dễ trơn trượt. Mang giày bít mũi đế chống trơn.`);
    if (!adjust.footwearId && (base.footwearId === 'guoc-moc' || base.footwearId === 'sandal-toi-gian')) {
      adjust.footwearId = ceremonial || formalEvent ? 'giay-oxford' : 'sneaker-trang';
    }
  }

  if (w.uvMax >= 8 && !isRainy(w)) {
    tips.push(`Chỉ số UV rất cao (${w.uvMax}): nên đội nón lá hoặc che ô, tránh chụp ảnh ngoài trời trong khoảng 10h–15h.`);
    const casual = !ceremonial && (base.targetEvent === 'ca-phe-dao-pho' || base.targetEvent === 'bieu-dien-van-nghe');
    if (casual && (base.headwearId === 'none' || base.headwearId === 'bom-ngoc-trai')) adjust.headwearId = 'non-la';
  }

  if (w.humidity >= 85) {
    tips.push(`Độ ẩm ${w.humidity}%: vải đũi và lanh thấm hút tốt hơn satin hoặc voan.`);
  }

  if (w.windSpeed >= 30) {
    tips.push('Gió mạnh: nên buộc gọn dải lụa và tà áo. Nón quai thao rộng vành dễ bị lật khi gió to.');
  }

  return { tips, adjust };
}
