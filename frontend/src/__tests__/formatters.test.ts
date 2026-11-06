import { describe, it, expect } from 'vitest';
import { 
  formatTemperature, 
  formatWindSpeed, 
  formatPressure, 
  getWindDirectionCardinal, 
  getUVLevel, 
  getEuropeanAQIInfo, 
  getUSAQIInfo, 
  calculateSunPosition 
} from '../utils/formatters';

describe('formatters utility', () => {
  describe('formatTemperature', () => {
    it('formats celsius correctly with degree symbol', () => {
      expect(formatTemperature(20, 'celsius')).toBe('20°');
      expect(formatTemperature(0, 'celsius')).toBe('0°');
      expect(formatTemperature(-5.4, 'celsius')).toBe('-5°');
    });

    it('converts to fahrenheit accurately', () => {
      // 0 C = 32 F
      expect(formatTemperature(0, 'fahrenheit')).toBe('32°');
      // 25 C = 77 F
      expect(formatTemperature(25, 'fahrenheit')).toBe('77°');
      // 100 C = 212 F
      expect(formatTemperature(100, 'fahrenheit')).toBe('212°');
    });

    it('handles NaN or missing gracefully', () => {
      expect(formatTemperature(NaN)).toBe('--°');
    });
  });

  describe('formatWindSpeed', () => {
    it('converts km/h to mph', () => {
      expect(formatWindSpeed(100, 'mph')).toBe('62 mph');
    });

    it('converts km/h to m/s', () => {
      expect(formatWindSpeed(36, 'ms')).toBe('10.0 m/s');
    });

    it('converts km/h to knots', () => {
      expect(formatWindSpeed(10, 'kn')).toBe('5 kn');
    });

    it('defaults to km/h', () => {
      expect(formatWindSpeed(24, 'kmh')).toBe('24 km/h');
    });
  });

  describe('formatPressure', () => {
    it('formats hPa correctly', () => {
      expect(formatPressure(1013, 'hPa')).toBe('1013 hPa');
    });

    it('formats inHg correctly', () => {
      expect(formatPressure(1013.25, 'inHg')).toBe('29.92 inHg');
    });

    it('formats mmHg correctly', () => {
      expect(formatPressure(1013.25, 'mmHg')).toBe('760 mmHg');
    });
  });

  describe('getWindDirectionCardinal', () => {
    it('maps 0 deg to North (N)', () => {
      expect(getWindDirectionCardinal(0)).toBe('N');
      expect(getWindDirectionCardinal(360)).toBe('N');
    });

    it('maps 90 deg to East (E)', () => {
      expect(getWindDirectionCardinal(90)).toBe('E');
    });

    it('maps 180 deg to South (S)', () => {
      expect(getWindDirectionCardinal(180)).toBe('S');
    });

    it('maps 270 deg to West (W)', () => {
      expect(getWindDirectionCardinal(270)).toBe('W');
    });
  });

  describe('getUVLevel', () => {
    it('returns Low for UV < 3', () => {
      expect(getUVLevel(1.5).label).toBe('Low');
    });

    it('returns Moderate for 3 <= UV < 6', () => {
      expect(getUVLevel(4.2).label).toBe('Moderate');
    });

    it('returns Very High for 8 <= UV < 11', () => {
      expect(getUVLevel(9.0).label).toBe('Very High');
    });

    it('returns Extreme for UV >= 11', () => {
      expect(getUVLevel(12).label).toBe('Extreme');
    });
  });

  describe('Air Quality Indices', () => {
    it('maps European AQI categories accurately', () => {
      expect(getEuropeanAQIInfo(15).category).toBe('Good');
      expect(getEuropeanAQIInfo(35).category).toBe('Moderate');
      expect(getEuropeanAQIInfo(55).category).toBe('Unhealthy for Sensitive Groups');
      expect(getEuropeanAQIInfo(75).category).toBe('Unhealthy');
      expect(getEuropeanAQIInfo(95).category).toBe('Very Unhealthy');
      expect(getEuropeanAQIInfo(120).category).toBe('Hazardous');
    });

    it('maps US EPA AQI categories accurately', () => {
      expect(getUSAQIInfo(40).category).toBe('Good');
      expect(getUSAQIInfo(80).category).toBe('Moderate');
      expect(getUSAQIInfo(130).category).toBe('Unhealthy for Sensitive Groups');
      expect(getUSAQIInfo(170).category).toBe('Unhealthy');
      expect(getUSAQIInfo(250).category).toBe('Very Unhealthy');
      expect(getUSAQIInfo(350).category).toBe('Hazardous');
    });
  });

  describe('calculateSunPosition', () => {
    it('computes 50% midday solar progression accurately', () => {
      const sunrise = '2026-06-21T06:00:00Z';
      const sunset = '2026-06-21T18:00:00Z';
      const midday = '2026-06-21T12:00:00Z';

      const result = calculateSunPosition(midday, sunrise, sunset);
      expect(result.progress).toBe(50);
      expect(result.isDaytime).toBe(true);
    });

    it('identifies nighttime when past sunset', () => {
      const sunrise = '2026-06-21T06:00:00Z';
      const sunset = '2026-06-21T18:00:00Z';
      const midnight = '2026-06-21T23:00:00Z';

      const result = calculateSunPosition(midnight, sunrise, sunset);
      expect(result.progress).toBe(100);
      expect(result.isDaytime).toBe(false);
    });
  });
});

