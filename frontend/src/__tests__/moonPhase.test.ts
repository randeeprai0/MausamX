import { describe, it, expect } from 'vitest';
import { getMoonPhase } from '../utils/moonPhase';
import { GeoLocation } from '../types/location';

describe('getMoonPhase', () => {
  it('returns valid moon phase and illumination for current date', () => {
    const bhopal: GeoLocation = {
      id: 1275841,
      name: 'Bhopal',
      latitude: 23.25,
      longitude: 77.41,
      country: 'India',
      timezone: 'Asia/Kolkata',
    };

    const moonInfo = getMoonPhase(bhopal);
    expect(moonInfo.phase).toBeGreaterThanOrEqual(0);
    expect(moonInfo.phase).toBeLessThanOrEqual(1);
    expect(moonInfo.illumination).toBeGreaterThanOrEqual(0);
    expect(moonInfo.illumination).toBeLessThanOrEqual(100);
    expect(moonInfo.phaseLabel).toBeTruthy();
    expect(moonInfo.isSouthernHemisphere).toBe(false);
  });

  it('detects southern hemisphere locations correctly', () => {
    const sydney: GeoLocation = {
      id: 2147714,
      name: 'Sydney',
      latitude: -33.86,
      longitude: 151.2,
      country: 'Australia',
      timezone: 'Australia/Sydney',
    };

    const moonInfo = getMoonPhase(sydney);
    expect(moonInfo.isSouthernHemisphere).toBe(true);
  });

  it('calculates crescent, half/quarter, and full moon shapes accurately', () => {
    // Reference new moon Jan 11, 2024 at 11:57 UTC
    const refNewMoon = new Date('2024-01-11T11:57:00Z');

    // Day 0: New Moon
    const newMoon = getMoonPhase(null, refNewMoon);
    expect(newMoon.phaseType).toBe('new');
    expect(newMoon.illumination).toBeLessThan(5);

    // Day ~4 (Waxing Crescent)
    const crescentDate = new Date(refNewMoon.getTime() + 4 * 24 * 60 * 60 * 1000);
    const crescentMoon = getMoonPhase(null, crescentDate);
    expect(crescentMoon.phaseType).toBe('waxing-crescent');
    expect(crescentMoon.svgPath).toContain('A');

    // Day ~7.4 (First Quarter / Half Moon)
    const quarterDate = new Date(refNewMoon.getTime() + 7.4 * 24 * 60 * 60 * 1000);
    const halfMoon = getMoonPhase(null, quarterDate);
    expect(halfMoon.phaseType).toBe('first-quarter');
    expect(halfMoon.illumination).toBeGreaterThan(45);
    expect(halfMoon.illumination).toBeLessThan(55);

    // Day ~14.76 (Full Moon)
    const fullDate = new Date(refNewMoon.getTime() + 14.76 * 24 * 60 * 60 * 1000);
    const fullMoon = getMoonPhase(null, fullDate);
    expect(fullMoon.phaseType).toBe('full');
    expect(fullMoon.illumination).toBeGreaterThan(95);

    // Day ~22.1 (Last Quarter / Half Moon)
    const lastQuarterDate = new Date(refNewMoon.getTime() + 22.1 * 24 * 60 * 60 * 1000);
    const lastHalfMoon = getMoonPhase(null, lastQuarterDate);
    expect(lastHalfMoon.phaseType).toBe('last-quarter');
    expect(lastHalfMoon.illumination).toBeGreaterThan(45);
    expect(lastHalfMoon.illumination).toBeLessThan(55);
  });
});

