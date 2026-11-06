import { describe, it, expect } from 'vitest';
import { generateLocationWeatherNews } from '../services/weatherNewsService';
import { GeoLocation } from '../types/location';
import { OpenMeteoForecastResponse } from '../types/weather';

describe('generateLocationWeatherNews', () => {
  const bhopal: GeoLocation = {
    id: 1275841,
    name: 'Bhopal',
    latitude: 23.25,
    longitude: 77.41,
    country: 'India',
    country_code: 'IN',
    admin1: 'Madhya Pradesh',
    timezone: 'Asia/Kolkata',
  };

  const mockForecast = {
    latitude: 23.25,
    longitude: 77.41,
    generationtime_ms: 0.5,
    utc_offset_seconds: 19800,
    timezone: 'Asia/Kolkata',
    timezone_abbreviation: 'IST',
    elevation: 500,
    current: {
      time: '2026-11-06T20:00',
      interval: 900,
      temperature_2m: 32.0,
      relative_humidity_2m: 45,
      apparent_temperature: 34.0,
      is_day: 0,
      precipitation: 0,
      rain: 0,
      showers: 0,
      snowfall: 0,
      weather_code: 2,
      cloud_cover: 35,
      pressure_msl: 1012,
      surface_pressure: 1010,
      wind_speed_10m: 14.5,
      wind_direction_10m: 180,
      wind_gusts_10m: 20.0,
    },
    daily: {
      time: ['2026-11-06'],
      weather_code: [2],
      temperature_2m_max: [39.0],
      temperature_2m_min: [25.0],
      apparent_temperature_max: [40.0],
      apparent_temperature_min: [26.0],
      sunrise: ['2026-11-06T06:15'],
      sunset: ['2026-11-06T17:45'],
      daylight_duration: [41400],
      sunshine_duration: [36000],
      uv_index_max: [7.5],
      precipitation_sum: [0],
      precipitation_probability_max: [10],
      wind_speed_10m_max: [18.0],
      wind_gusts_10m_max: [24.0],
      wind_direction_10m_dominant: [190],
    },
  };

  it('generates articles customized with location name and meteorological values', () => {
    const articles = generateLocationWeatherNews(bhopal, mockForecast as unknown as OpenMeteoForecastResponse, null);
    expect(articles.length).toBeGreaterThanOrEqual(3);

    // First article mentions Bhopal and temperature
    expect(articles[0].title).toContain('Bhopal');
    expect(articles[0].source).toContain('India Meteorological Department');
    expect(articles[0].metrics?.some((m) => m.value.includes('32°C'))).toBe(true);
  });

  it('assigns appropriate meteorological categories and agencies', () => {
    const articles = generateLocationWeatherNews(bhopal, mockForecast as unknown as OpenMeteoForecastResponse, null);
    const categories = articles.map((a) => a.category);
    expect(categories).toContain('Forecast Outlook');
    expect(categories).toContain('Air Quality');
    expect(categories).toContain('Climate');
  });

  it('adapts agency for United States location', () => {
    const newYork: GeoLocation = {
      id: 5128581,
      name: 'New York',
      latitude: 40.71,
      longitude: -74.0,
      country: 'United States',
      country_code: 'US',
      timezone: 'America/New_York',
    };
    const articles = generateLocationWeatherNews(newYork, mockForecast as unknown as OpenMeteoForecastResponse, null);
    expect(articles[0].source).toContain('National Weather Service');
  });
});
