import { describe, it, expect } from 'vitest';
import { getCitySceneryType } from '../utils/cityTheme';
import { GeoLocation } from '../types/location';

describe('getCitySceneryType', () => {
  it('maps Bhopal and default towns to windmill archetype matching reference image', () => {
    const bhopal: GeoLocation = {
      id: 1275841,
      name: 'Bhopal',
      latitude: 23.25,
      longitude: 77.41,
      country: 'India',
      country_code: 'IN',
      timezone: 'Asia/Kolkata',
    };
    expect(getCitySceneryType(bhopal)).toBe('windmill');
    expect(getCitySceneryType(null)).toBe('windmill');
  });

  it('maps mountainous cities and high elevations to mountains archetype', () => {
    const zurich: GeoLocation = {
      id: 2657896,
      name: 'Zurich',
      latitude: 47.37,
      longitude: 8.54,
      country: 'Switzerland',
      timezone: 'Europe/Zurich',
    };
    const highElevationTown: GeoLocation = {
      id: 999,
      name: 'Alpine Village',
      latitude: 46.0,
      longitude: 7.0,
      elevation: 1200,
      timezone: 'UTC',
    };
    expect(getCitySceneryType(zurich)).toBe('mountains');
    expect(getCitySceneryType(highElevationTown)).toBe('mountains');
  });

  it('maps coastal and beach cities to coastal archetype', () => {
    const goa: GeoLocation = {
      id: 1271157,
      name: 'Goa',
      latitude: 15.3,
      longitude: 74.1,
      country: 'India',
      timezone: 'Asia/Kolkata',
    };
    const miami: GeoLocation = {
      id: 4164138,
      name: 'Miami',
      latitude: 25.76,
      longitude: -80.19,
      country: 'United States',
      timezone: 'America/New_York',
    };
    expect(getCitySceneryType(goa)).toBe('coastal');
    expect(getCitySceneryType(miami)).toBe('coastal');
  });

  it('maps arid and desert locations to desert archetype', () => {
    const cairo: GeoLocation = {
      id: 360630,
      name: 'Cairo',
      latitude: 30.04,
      longitude: 31.23,
      country: 'Egypt',
      timezone: 'Africa/Cairo',
    };
    const jaipur: GeoLocation = {
      id: 1269515,
      name: 'Jaipur',
      latitude: 26.91,
      longitude: 75.78,
      country: 'India',
      admin1: 'Rajasthan',
      timezone: 'Asia/Kolkata',
    };
    expect(getCitySceneryType(cairo)).toBe('desert');
    expect(getCitySceneryType(jaipur)).toBe('desert');
  });

  it('maps major urban metropolises to skyline archetype', () => {
    const tokyo: GeoLocation = {
      id: 1850147,
      name: 'Tokyo',
      latitude: 35.68,
      longitude: 139.69,
      country: 'Japan',
      timezone: 'Asia/Tokyo',
    };
    const newYork: GeoLocation = {
      id: 5128581,
      name: 'New York',
      latitude: 40.71,
      longitude: -74.0,
      country: 'United States',
      timezone: 'America/New_York',
    };
    expect(getCitySceneryType(tokyo)).toBe('skyline');
    expect(getCitySceneryType(newYork)).toBe('skyline');
  });
});

