import { describe, it, expect } from 'vitest';
import { generateSmartInsights } from '../utils/weatherInsights';
import { OpenMeteoForecastResponse } from '../types/weather';

const mockInsightForecast: OpenMeteoForecastResponse = {
  latitude: 40.71,
  longitude: -74.00,
  generationtime_ms: 1,
  utc_offset_seconds: 0,
  timezone: 'America/New_York',
  timezone_abbreviation: 'EST',
  elevation: 10,
  current_units: {},
  current: {
    time: '2026-11-03T12:00:00Z',
    interval: 900,
    temperature_2m: 16,
    relative_humidity_2m: 60,
    apparent_temperature: 15.5,
    is_day: 1,
    precipitation: 0,
    rain: 0,
    showers: 0,
    snowfall: 0,
    weather_code: 1,
    cloud_cover: 20,
    pressure_msl: 1020,
    surface_pressure: 1018,
    wind_speed_10m: 10,
    wind_direction_10m: 180,
    wind_gusts_10m: 15
  },
  hourly_units: {},
  hourly: {
    time: Array.from({ length: 24 }).map((_, i) => `2026-11-03T${String(i).padStart(2, '0')}:00:00Z`),
    temperature_2m: Array(24).fill(16),
    relative_humidity_2m: Array(24).fill(60),
    dew_point_2m: Array(24).fill(8),
    apparent_temperature: Array(24).fill(15.5),
    precipitation_probability: [0, 0, 0, 0, 0, 0, 75, 80, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    precipitation: Array(24).fill(0),
    weather_code: Array(24).fill(1),
    pressure_msl: Array(24).fill(1020),
    cloud_cover: Array(24).fill(20),
    visibility: Array(24).fill(10000),
    wind_speed_10m: Array(24).fill(10),
    wind_direction_10m: Array(24).fill(180),
    uv_index: Array(24).fill(2)
  },
  daily_units: {},
  daily: {
    time: ['2026-11-03', '2026-11-04'],
    weather_code: [1, 2],
    temperature_2m_max: [18, 24], // 6 deg warmer tomorrow!
    temperature_2m_min: [10, 14],
    apparent_temperature_max: [17, 23],
    apparent_temperature_min: [9, 13],
    sunrise: ['2026-11-03T06:30:00Z', '2026-11-04T06:31:00Z'],
    sunset: ['2026-11-03T17:45:00Z', '2026-11-04T17:44:00Z'],
    daylight_duration: [40500, 40380],
    sunshine_duration: [30000, 28000],
    uv_index_max: [6.5, 7.0], // elevated midday UV
    precipitation_sum: [2.5, 0],
    precipitation_probability_max: [80, 10],
    wind_speed_10m_max: [15, 12],
    wind_gusts_10m_max: [22, 18],
    wind_direction_10m_dominant: [180, 190]
  }
};

describe('weatherInsights synthesizer', () => {
  it('detects rain expectation in the next 12 hours', () => {
    const insights = generateSmartInsights(mockInsightForecast, 'celsius');
    const rainAlert = insights.find(i => i.id === 'rain-alert');
    expect(rainAlert).toBeDefined();
    expect(rainAlert?.importance).toBe('high');
  });

  it('detects temperature increase tomorrow', () => {
    const insights = generateSmartInsights(mockInsightForecast, 'celsius');
    const tempTrend = insights.find(i => i.id === 'temp-trend');
    expect(tempTrend).toBeDefined();
    expect(tempTrend?.title).toContain('Warmer');
  });

  it('detects elevated midday UV warning', () => {
    const insights = generateSmartInsights(mockInsightForecast, 'celsius');
    const uvWarning = insights.find(i => i.id === 'uv-warning');
    expect(uvWarning).toBeDefined();
    expect(uvWarning?.title).toContain('UV');
  });
});

