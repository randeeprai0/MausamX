import { describe, it, expect } from 'vitest';
import { getClothingRecommendations, analyzeBestOutdoorTime } from '../utils/recommendations';
import { OpenMeteoForecastResponse } from '../types/weather';

const mockForecast: OpenMeteoForecastResponse = {
  latitude: 51.5,
  longitude: -0.12,
  generationtime_ms: 1,
  utc_offset_seconds: 0,
  timezone: 'Europe/London',
  timezone_abbreviation: 'GMT',
  elevation: 25,
  current_units: {},
  current: {
    time: '2026-11-03T12:00:00Z',
    interval: 900,
    temperature_2m: 8.5,
    relative_humidity_2m: 75,
    apparent_temperature: 6.2,
    is_day: 1,
    precipitation: 0,
    rain: 0,
    showers: 0,
    snowfall: 0,
    weather_code: 3,
    cloud_cover: 80,
    pressure_msl: 1018,
    surface_pressure: 1015,
    wind_speed_10m: 14.2,
    wind_direction_10m: 230,
    wind_gusts_10m: 22.0
  },
  hourly_units: {},
  hourly: {
    time: [
      '2026-11-03T08:00:00Z',
      '2026-11-03T09:00:00Z',
      '2026-11-03T10:00:00Z',
      '2026-11-03T11:00:00Z',
      '2026-11-03T12:00:00Z',
      '2026-11-03T13:00:00Z',
      '2026-11-03T14:00:00Z',
      '2026-11-03T15:00:00Z'
    ],
    temperature_2m: [6, 7, 8, 8.5, 9, 8.5, 8, 7],
    relative_humidity_2m: [80, 78, 75, 75, 72, 74, 76, 78],
    dew_point_2m: [3, 3.5, 4, 4, 4, 4, 3.5, 3],
    apparent_temperature: [4, 5, 6, 6.2, 7, 6.5, 6, 5],
    precipitation_probability: [10, 10, 5, 0, 0, 5, 10, 15],
    precipitation: [0, 0, 0, 0, 0, 0, 0, 0],
    weather_code: [3, 3, 2, 2, 1, 2, 3, 3],
    pressure_msl: [1017, 1017, 1018, 1018, 1018, 1017, 1017, 1016],
    cloud_cover: [85, 80, 60, 50, 40, 55, 70, 80],
    visibility: [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000],
    wind_speed_10m: [12, 13, 14, 14.2, 15, 14, 13, 12],
    wind_direction_10m: [220, 225, 230, 230, 235, 230, 225, 220],
    uv_index: [0.5, 1.2, 2.0, 2.5, 2.8, 2.1, 1.4, 0.6]
  },
  daily_units: {},
  daily: {
    time: ['2026-11-03'],
    weather_code: [3],
    temperature_2m_max: [9.5],
    temperature_2m_min: [4.2],
    apparent_temperature_max: [7.2],
    apparent_temperature_min: [2.1],
    sunrise: ['2026-11-03T07:05:00Z'],
    sunset: ['2026-11-03T16:30:00Z'],
    daylight_duration: [33900],
    sunshine_duration: [14400],
    uv_index_max: [2.8],
    precipitation_sum: [0],
    precipitation_probability_max: [15],
    wind_speed_10m_max: [16.5],
    wind_gusts_10m_max: [24.0],
    wind_direction_10m_dominant: [230]
  }
};

describe('recommendations utility', () => {
  it('recommends warm jacket and layers for 6°C feels-like chill', () => {
    const advice = getClothingRecommendations(mockForecast, 'celsius');
    expect(advice.items.some(i => i.name.includes('Warm Jacket'))).toBe(true);
    expect(advice.summary).toContain('jacket');
  });

  it('computes outdoor comfort scores for daylight hours', () => {
    const analysis = analyzeBestOutdoorTime(mockForecast);
    expect(analysis.hourlyScores.length).toBeGreaterThan(0);
    expect(analysis.bestWindow).not.toBe('Data unavailable');
  });
});

