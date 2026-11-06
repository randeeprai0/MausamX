import { GeoLocation, GeocodingResponse } from '../types/location';

export async function searchCities(query: string, signal?: AbortSignal): Promise<GeoLocation[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery || cleanQuery.length < 2) {
    return [];
  }

  const directUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=10&language=en&format=json`;

  try {
    const response = await fetch(directUrl, { signal });
    if (!response.ok) {
      throw new Error(`Geocoding HTTP error: ${response.status}`);
    }
    const data: GeocodingResponse = await response.json();
    return data.results || [];
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw err; // propagates abort properly
    }

    // Attempt through backend proxy
    try {
      const fallbackUrl = `/api/search?name=${encodeURIComponent(cleanQuery)}`;
      const fbResponse = await fetch(fallbackUrl, { signal });
      if (fbResponse.ok) {
        const fbData: GeocodingResponse = await fbResponse.json();
        return fbData.results || [];
      }
    } catch {}

    console.warn('[Geocoding] Search failed:', err.message);
    return [];
  }
}

/**
 * Reverse geocoding helper using Open-Meteo or BigDataCloud reverse geocode free tier
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<GeoLocation> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en'
        }
      }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const cityName = addr.city || addr.town || addr.village || addr.municipality || addr.state || 'My Location';
      return {
        id: Math.round(latitude * 10000 + longitude),
        name: cityName,
        latitude,
        longitude,
        country: addr.country,
        country_code: addr.country_code ? addr.country_code.toUpperCase() : undefined,
        admin1: addr.state,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto'
      };
    }
  } catch (e) {
    console.warn('[ReverseGeocode] Reverse geocoding fetch failed, using fallback name:', e);
  }

  return {
    id: Math.round(latitude * 10000 + longitude),
    name: 'Current Location',
    latitude,
    longitude,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto'
  };
}

