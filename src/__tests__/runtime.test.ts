import { afterEach, describe, expect, it, vi } from 'vitest';
import { createKeyRotation, createRateLimiter, parseGeminiKeys } from '../server/aiRuntime';
import { DEFAULT_LOOK } from '../utils/lookStorage';
import { loadSavedLooks, mutateSavedLooks, newSavedLook, SAVED_LOOKS_KEY } from '../utils/savedLooks';
import { shareImage } from '../utils/lookbookExport';
import { adviseForWeather, describeWeatherCode, fetchLiveWeather, LiveWeather } from '../utils/weatherService';

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('AI runtime', () => {
  it('deduplicates keys and falls back to the singular variable after placeholders', () => {
    expect(parseGeminiKeys('YOUR_KEY,MY_GEMINI_API_KEY', 'real-key')).toEqual(['real-key']);
    expect(parseGeminiKeys('"first", first; second\nsecond')).toEqual(['first', 'second']);
  });
  it('rotates concurrent requests independently and fails over on quota errors', async () => {
    const rotate = createKeyRotation(['a', 'b', 'c']);
    const seen: string[] = [];
    const run = async (key: string) => { seen.push(key); await Promise.resolve(); if (key === 'a') throw { status: 429 }; return key; };
    expect(await Promise.all([rotate(run, new AbortController().signal), rotate(run, new AbortController().signal)])).toEqual(['b', 'b']);
    expect(seen).toEqual(['a', 'b', 'b']);
    expect(await rotate(run, new AbortController().signal)).toBe('c');
  });
  it('does not burn every key for an invalid model or request', async () => {
    const run = vi.fn().mockRejectedValue({ status: 404 });
    await expect(createKeyRotation(['a', 'b'])(run, new AbortController().signal)).rejects.toMatchObject({ status: 404 });
    expect(run).toHaveBeenCalledTimes(1);
  });
  it('stops retrying immediately when a request is cancelled', async () => {
    const controller = new AbortController();
    const run = vi.fn(async () => { controller.abort(); throw { status: 429 }; });
    await expect(createKeyRotation(['a', 'b'])(run, controller.signal)).rejects.toHaveProperty('name', 'AbortError');
    expect(run).toHaveBeenCalledTimes(1);
  });
  it('does not reset limits at capacity and rejected calls do not extend the window', () => {
    const limited = createRateLimiter(1000, 2, 2);
    expect(limited('a', 0)).toBe(false);
    expect(limited('a', 1)).toBe(false);
    expect(limited('a', 500)).toBe(true);
    expect(limited('b', 501)).toBe(false);
    expect(limited('c', 502)).toBe(true);
    expect(limited('a', 503)).toBe(true);
    expect(limited('a', 1001)).toBe(false);
    expect(limited('b', 1502)).toBe(false);
    expect(limited('c', 1502)).toBe(true);
    expect(limited('c', 2002)).toBe(false);
  });
});

function storageMock() {
  const data = new Map<string, string>();
  vi.stubGlobal('localStorage', { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => data.set(key, value) });
  return data;
}

describe('durable wardrobe mutations', () => {
  it('rejects quota errors instead of claiming a save succeeded', async () => {
    vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => { throw new Error('QuotaExceededError'); } });
    await expect(mutateSavedLooks(current => ({ looks: [newSavedLook(DEFAULT_LOOK), ...current], result: 'saved' }))).rejects.toThrow('QuotaExceededError');
  });
  it('rejects inaccessible storage instead of replacing it with an empty wardrobe', async () => {
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('SecurityError'); } });
    expect(loadSavedLooks()).toEqual([]);
    await expect(mutateSavedLooks(current => ({ looks: current, result: 'duplicate' }))).rejects.toThrow('SecurityError');
  });
  it('reads fresh data inside a shared lock, preserving concurrent additions', async () => {
    const data = storageMock();
    let queue = Promise.resolve();
    const request = vi.fn((_name: string, run: () => unknown) => {
      const next = queue.then(run);
      queue = next.then(() => undefined, () => undefined);
      return next;
    });
    vi.stubGlobal('navigator', { locks: { request } });
    const one = newSavedLook(DEFAULT_LOOK);
    const two = newSavedLook({ ...DEFAULT_LOOK, customColorHex: '#123456' });
    await Promise.all([one, two].map(look => mutateSavedLooks(current => ({ looks: [look, ...current], result: 'saved' }))));
    expect(JSON.parse(data.get(SAVED_LOOKS_KEY)!)).toHaveLength(2);
    expect(request).toHaveBeenCalledTimes(2);
    await mutateSavedLooks(current => ({ looks: current.filter(l => l.id !== one.id), result: undefined }));
    expect(loadSavedLooks().map(l => l.id)).toEqual([two.id]);
  });
  it('filters duplicate or empty ids while preserving valid saved looks', () => {
    const data = storageMock();
    const look = newSavedLook(DEFAULT_LOOK);
    data.set(SAVED_LOOKS_KEY, JSON.stringify([null, { ...look, id: '' }, look, look]));
    expect(loadSavedLooks()).toEqual([look]);
  });
});

describe('browser and weather error paths', () => {
  it('falls back when canShare throws, but handles user cancellation', async () => {
    vi.stubGlobal('navigator', { share: vi.fn(), canShare: () => { throw new Error('Policy blocked'); } });
    expect(await shareImage(new Blob(), 'x.png', 'text', 'url')).toBe(false);
    vi.stubGlobal('navigator', { canShare: () => true, share: async () => { throw { name: 'AbortError' }; } });
    expect(await shareImage(new Blob(), 'x.png', 'text', 'url')).toBe(true);
  });
  it('keeps warm enclosed boots when rain and cold occur together', () => {
    const weather = { apparentTemperature: 10, precipitation: 1, rainChance: 90, weatherCode: 61 } as LiveWeather;
    expect(adviseForWeather(weather, { garmentId: 'ao-ba-ba', targetEvent: 'ca-phe-dao-pho', footwearId: 'guoc-moc' }).adjust.footwearId).toBe('boot-da-co-thap');
    expect(describeWeatherCode(-1).label).toBe('Không xác định');
  });
  it('validates coordinates and normalizes invalid optional weather readings', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ current: { temperature_2m: 25, apparent_temperature: 24, relative_humidity_2m: 150, precipitation: -2, wind_speed_10m: 'bad' }, daily: { temperature_2m_max: ['bad'], precipitation_probability_max: [120] } }) });
    vi.stubGlobal('fetch', fetch);
    await expect(fetchLiveWeather(NaN, 105, 'Test')).rejects.toThrow('coordinates');
    expect(fetch).not.toHaveBeenCalled();
    const weather = await fetchLiveWeather(21, 105, 'Test');
    expect(weather).toMatchObject({ temperature: 25, humidity: 100, precipitation: 0, windSpeed: 0, tempMax: 25, rainChance: 100 });
  });
});
