import { GeoLocation } from '../types/location';

export type MoonPhaseType =
  | 'new'
  | 'waxing-crescent'
  | 'first-quarter'
  | 'waxing-gibbous'
  | 'full'
  | 'waning-gibbous'
  | 'last-quarter'
  | 'waning-crescent';

export interface MoonPhaseInfo {
  phase: number; // 0.0 to 1.0 (0=New, 0.25=First Quarter, 0.5=Full, 0.75=Last Quarter)
  ageDays: number; // 0 to 29.53 days
  phaseType: MoonPhaseType;
  phaseLabel: string;
  illumination: number; // 0% to 100%
  svgPath: string; // SVG path string for illuminated portion (R=30, cx=41, cy=41)
  isSouthernHemisphere: boolean;
}

// Synodic lunar month: 29.53058867 days in ms
const SYNODIC_MONTH_MS = 29.53058867 * 24 * 60 * 60 * 1000;
// Reference astronomical New Moon: Jan 11, 2024 at 11:57 UTC
const REFERENCE_NEW_MOON_UTC = 1704974220000;

/**
 * Calculates the exact astronomical moon phase for a given city / location and date.
 * If crescent, returns crescent shape; if half/quarter, returns half; if gibbous, returns gibbous;
 * if full, returns full disk. Automatically mirrors illuminated orientation for Southern Hemisphere.
 */
export function getMoonPhase(location?: GeoLocation | null, date: Date = new Date()): MoonPhaseInfo {
  const targetTime = date.getTime();
  const isSouthernHemisphere = (location?.latitude ?? 0) < 0;

  const diff = (targetTime - REFERENCE_NEW_MOON_UTC) % SYNODIC_MONTH_MS;
  const phase = (diff < 0 ? diff + SYNODIC_MONTH_MS : diff) / SYNODIC_MONTH_MS;
  const ageDays = phase * 29.53058867;

  // Illumination percentage (0 to 100%)
  const illumination = Math.round(((1 - Math.cos(phase * 2 * Math.PI)) / 2) * 100);

  // SVG coordinate constants: center = (41, 41), radius = 30
  const R = 30;
  const cx = 41;
  const cy = 41;
  const topY = cy - R;
  const botY = cy + R;

  let phaseType: MoonPhaseType;
  let phaseLabel: string;
  let svgPath = '';

  // 1. New Moon (phase near 0 or 1)
  if (phase < 0.025 || phase > 0.975) {
    phaseType = 'new';
    phaseLabel = 'New Moon';
    svgPath = '';
  }
  // 2. Full Moon (phase near 0.5)
  else if (phase >= 0.475 && phase <= 0.525) {
    phaseType = 'full';
    phaseLabel = 'Full Moon';
    svgPath = `M ${cx},${topY} A ${R},${R} 0 1,0 ${cx},${botY} A ${R},${R} 0 1,0 ${cx},${topY} Z`;
  }
  // 3. Waxing phases (0.025 to 0.475) -> Northern hemisphere: right side illuminated
  else if (phase < 0.475) {
    const p = phase / 0.5; // Normalized progress 0 to 1
    const Rx = Math.max(0.1, R * Math.abs(2 * p - 1)).toFixed(1);
    const sweep = p < 0.5 ? 0 : 1;

    if (p < 0.42) {
      phaseType = 'waxing-crescent';
      phaseLabel = 'Waxing Crescent';
    } else if (p > 0.58) {
      phaseType = 'waxing-gibbous';
      phaseLabel = 'Waxing Gibbous';
    } else {
      phaseType = 'first-quarter';
      phaseLabel = 'First Quarter (Half Moon)';
    }

    svgPath = `M ${cx},${topY} A ${R},${R} 0 0,1 ${cx},${botY} A ${Rx},${R} 0 0,${sweep} ${cx},${topY} Z`;
  }
  // 4. Waning phases (0.525 to 0.975) -> Northern hemisphere: left side illuminated
  else {
    const p = (phase - 0.5) / 0.5; // Normalized progress 0 to 1
    const Rx = Math.max(0.1, R * Math.abs(2 * p - 1)).toFixed(1);
    const sweep = p < 0.5 ? 0 : 1;

    if (p < 0.42) {
      phaseType = 'waning-gibbous';
      phaseLabel = 'Waning Gibbous';
    } else if (p > 0.58) {
      phaseType = 'waning-crescent';
      phaseLabel = 'Waning Crescent';
    } else {
      phaseType = 'last-quarter';
      phaseLabel = 'Last Quarter (Half Moon)';
    }

    svgPath = `M ${cx},${topY} A ${R},${R} 0 0,0 ${cx},${botY} A ${Rx},${R} 0 0,${sweep} ${cx},${topY} Z`;
  }

  return {
    phase,
    ageDays,
    phaseType,
    phaseLabel,
    illumination,
    svgPath,
    isSouthernHemisphere,
  };
}

