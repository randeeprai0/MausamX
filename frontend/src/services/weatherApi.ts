import { OpenMeteoForecastResponse, HourlyForecastItem, DailyForecastItem } from '../types/weather';

export async function fetchForecast(
  latitude: number,
  longitude: number,
  timezone: string = 'auto',
  signal?: AbortSignal
): Promise<OpenMeteoForecastResponse> {
  const currentParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'rain',
    'showers',
    'snowfall',
    'weather_code',
    'cloud_cover',
    'pressure_msl',
    'surface_pressure',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m'
  ].join(',');

  const hourlyParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'dew_point_2m',
    'apparent_temperature',
    'precipitation_probability',
    'precipitation',
    'weather_code',
    'pressure_msl',
    'cloud_cover',
    'visibility',
    'wind_speed_10m',
    'wind_direction_10m',
    'uv_index'
  ].join(',');

  const dailyParams = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'sunrise',
    'sunset',
    'daylight_duration',
    'sunshine_duration',
    'uv_index_max',
    'precipitation_sum',
    'precipitation_probability_max',
    'wind_speed_10m_max',
    'wind_gusts_10m_max',
    'wind_direction_10m_dominant'
  ].join(',');

  const queryParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: currentParams,
    hourly: hourlyParams,
    daily: dailyParams,
    timezone: timezone || 'auto'
  });

  const directUrl = `https://api.open-meteo.com/v1/forecast?${queryParams.toString()}`;

  try {
    const res = await fetch(directUrl, { signal });
    if (!res.ok) {
      throw new Error(`Open-Meteo Weather API responded with ${res.status}`);
    }
    const data: OpenMeteoForecastResponse = await res.json();
    return data;
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;

    // Try through backend proxy
    try {
      const proxyUrl = `/api/weather?${queryParams.toString()}`;
      const proxyRes = await fetch(proxyUrl, { signal });
      if (proxyRes.ok) {
        return await proxyRes.json();
      }
    } catch {}

    throw new Error(err.message || 'Unable to retrieve weather forecast');
  }
}

/**
 * Extracts and formats 24 hours of hourly forecast starting from the closest current hour
 */
export function processHourlyForecast(forecast: OpenMeteoForecastResponse): HourlyForecastItem[] {
  if (!forecast || !forecast.hourly || !forecast.hourly.time) return [];

  const hourly = forecast.hourly;
  const currentIso = forecast.current?.time;
  const now = currentIso ? new Date(currentIso) : new Date();

  // Find index closest to now
  let startIndex = 0;
  let minDiff = Infinity;
  hourly.time.forEach((t, i) => {
    const diff = Math.abs(new Date(t).getTime() - now.getTime());
    if (diff < minDiff) {
      minDiff = diff;
      startIndex = i;
    }
  });

  const sliceEnd = Math.min(startIndex + 24, hourly.time.length);
  const items: HourlyForecastItem[] = [];

  for (let i = startIndex; i < sliceEnd; i++) {
    const itemDate = new Date(hourly.time[i]);
    const isCurrentHour = i === startIndex;

    const formattedTime = isCurrentHour 
      ? 'Now' 
      : itemDate.toLocaleTimeString([], { hour: 'numeric', hour12: true });

    items.push({
      time: hourly.time[i],
      formattedTime,
      temperature: hourly.temperature_2m[i],
      feelsLike: hourly.apparent_temperature[i],
      weatherCode: hourly.weather_code[i],
      precipitationProbability: hourly.precipitation_probability[i] || 0,
      precipitation: hourly.precipitation[i] || 0,
      windSpeed: hourly.wind_speed_10m[i] || 0,
      windDirection: hourly.wind_direction_10m[i] || 0,
      humidity: hourly.relative_humidity_2m[i] || 0,
      uvIndex: hourly.uv_index?.[i] || 0,
      isCurrentHour
    });
  }

  return items;
}

/**
 * Extracts 7-day daily forecast with day names and formatted dates
 */
export function processDailyForecast(forecast: OpenMeteoForecastResponse): DailyForecastItem[] {
  if (!forecast || !forecast.daily || !forecast.daily.time) return [];

  const daily = forecast.daily;
  const days: DailyForecastItem[] = [];
  const count = Math.min(7, daily.time.length);

  for (let i = 0; i < count; i++) {
    const dateObj = new Date(daily.time[i] + 'T00:00:00');
    const isToday = i === 0;
    const dayName = isToday ? 'Today' : dateObj.toLocaleDateString([], { weekday: 'short' });
    const formattedDate = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

    days.push({
      date: daily.time[i],
      dayName,
      formattedDate,
      weatherCode: daily.weather_code[i],
      tempMin: daily.temperature_2m_min[i],
      tempMax: daily.temperature_2m_max[i],
      precipitationProbability: daily.precipitation_probability_max[i] || 0,
      precipitationSum: daily.precipitation_sum[i] || 0,
      sunrise: daily.sunrise[i],
      sunset: daily.sunset[i],
      uvIndexMax: daily.uv_index_max?.[i] || 0,
      windSpeedMax: daily.wind_speed_10m_max[i] || 0
    });
  }

  return days;
}

