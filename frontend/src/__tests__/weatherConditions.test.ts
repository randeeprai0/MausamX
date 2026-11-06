import { describe, it, expect } from 'vitest';
import { getWeatherCondition } from '../utils/weatherConditions';

describe('weatherConditions utility', () => {
  it('identifies WMO 0 as Clear Sky (day vs night)', () => {
    const day = getWeatherCondition(0, 1);
    expect(day.label).toBe('Clear Sky');
    expect(day.themeType).toBe('clear-day');
    expect(day.iconName).toBe('Sun');

    const night = getWeatherCondition(0, 0);
    expect(night.label).toBe('Clear Sky');
    expect(night.themeType).toBe('clear-night');
    expect(night.iconName).toBe('Moon');
  });

  it('identifies WMO 61 as Slight Rain', () => {
    const rain = getWeatherCondition(61, 1);
    expect(rain.label).toBe('Slight Rain');
    expect(rain.themeType).toBe('rain');
    expect(rain.iconName).toBe('CloudRain');
  });

  it('identifies WMO 71 as Light Snow', () => {
    const snow = getWeatherCondition(71, 1);
    expect(snow.label).toBe('Light Snow');
    expect(snow.themeType).toBe('snow');
    expect(snow.iconName).toBe('Snowflake');
  });

  it('identifies WMO 95 as Thunderstorm', () => {
    const storm = getWeatherCondition(95, 1);
    expect(storm.label).toBe('Thunderstorm');
    expect(storm.themeType).toBe('thunderstorm');
    expect(storm.iconName).toBe('CloudLightning');
  });

  it('handles unknown codes gracefully with fallback', () => {
    const fallback = getWeatherCondition(999, 1);
    expect(fallback.label).toBe('Clear');
  });
});

