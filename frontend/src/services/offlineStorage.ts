import { get, set } from 'idb-keyval';
import { OpenMeteoForecastResponse } from '../types/weather';
import { OpenMeteoAirQualityResponse } from '../types/airQuality';
import { GeoLocation } from '../types/location';

export interface WeatherSnapshot {
  location: GeoLocation;
  weather: OpenMeteoForecastResponse;
  airQuality?: OpenMeteoAirQualityResponse | null;
  savedAt: string;
}

const SNAPSHOT_KEY = 'mausamx_offline_snapshot';
const FAVORITES_KEY = 'mausamx_favorite_cities';
const RECENT_KEY = 'mausamx_recent_searches';

const LEGACY_SNAPSHOT_KEY = 'atmos_offline_snapshot';
const LEGACY_FAVORITES_KEY = 'atmos_favorite_cities';
const LEGACY_RECENT_KEY = 'atmos_recent_searches';

export async function saveWeatherSnapshot(snapshot: WeatherSnapshot): Promise<void> {
  try {
    await set(SNAPSHOT_KEY, snapshot);
  } catch (err) {
    console.warn('[OfflineStorage] Failed to save snapshot in IndexedDB:', err);
    // Fallback to localStorage if IndexedDB is blocked
    try {
      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
    } catch {}
  }
}

export async function getSavedWeatherSnapshot(): Promise<WeatherSnapshot | null> {
  try {
    const data = await get<WeatherSnapshot>(SNAPSHOT_KEY);
    if (data) return data;
    const legacyData = await get<WeatherSnapshot>(LEGACY_SNAPSHOT_KEY);
    if (legacyData) return legacyData;
  } catch (err) {
    console.warn('[OfflineStorage] IndexedDB read failed, trying localStorage:', err);
  }

  try {
    const fallback = localStorage.getItem(SNAPSHOT_KEY) || localStorage.getItem(LEGACY_SNAPSHOT_KEY);
    if (fallback) {
      return JSON.parse(fallback);
    }
  } catch {}

  return null;
}

export function getFavoritesFromStorage(): GeoLocation[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY) || localStorage.getItem(LEGACY_FAVORITES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveFavoritesToStorage(favorites: GeoLocation[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch {}
}

export function getRecentSearches(): GeoLocation[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY) || localStorage.getItem(LEGACY_RECENT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function addRecentSearch(location: GeoLocation): void {
  try {
    const recents = getRecentSearches().filter(item => item.id !== location.id);
    recents.unshift(location);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recents.slice(0, 6)));
  } catch {}
}
