import { OpenMeteoAirQualityResponse } from '../types/airQuality';

export async function fetchAirQuality(
  latitude: number,
  longitude: number,
  timezone: string = 'auto',
  signal?: AbortSignal
): Promise<OpenMeteoAirQualityResponse | null> {
  const currentParams = [
    'european_aqi',
    'us_aqi',
    'pm10',
    'pm2_5',
    'carbon_monoxide',
    'nitrogen_dioxide',
    'sulphur_dioxide',
    'ozone',
    'uv_index'
  ].join(',');

  const hourlyParams = [
    'european_aqi',
    'us_aqi',
    'pm10',
    'pm2_5',
    'ozone'
  ].join(',');

  const queryParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: currentParams,
    hourly: hourlyParams,
    timezone: timezone || 'auto'
  });

  const directUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?${queryParams.toString()}`;

  try {
    const res = await fetch(directUrl, { signal });
    if (!res.ok) {
      throw new Error(`Air Quality API error: ${res.status}`);
    }
    const data: OpenMeteoAirQualityResponse = await res.json();
    return data;
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;

    // Fallback to proxy
    try {
      const proxyUrl = `/api/air-quality?${queryParams.toString()}`;
      const proxyRes = await fetch(proxyUrl, { signal });
      if (proxyRes.ok) {
        return await proxyRes.json();
      }
    } catch {}

    console.warn('[AirQuality] Telemetry not available for coordinates:', latitude, longitude);
    return null;
  }
}

