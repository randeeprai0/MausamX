import { TempUnit, WindSpeedUnit, PressureUnit, PrecipitationUnit } from '../types/settings';
import { AQILevelInfo } from '../types/airQuality';

export function formatTemperature(celsius: number, unit: TempUnit = 'celsius'): string {
  if (celsius === undefined || celsius === null || isNaN(celsius)) return '--°';
  if (unit === 'fahrenheit') {
    const f = (celsius * 9) / 5 + 32;
    return `${Math.round(f)}°`;
  }
  return `${Math.round(celsius)}°`;
}

export function formatTemperatureValue(celsius: number, unit: TempUnit = 'celsius'): number {
  if (celsius === undefined || isNaN(celsius)) return 0;
  if (unit === 'fahrenheit') {
    return Math.round(((celsius * 9) / 5 + 32) * 10) / 10;
  }
  return Math.round(celsius * 10) / 10;
}

export function getTemperatureUnitSymbol(unit: TempUnit = 'celsius'): string {
  return unit === 'fahrenheit' ? '°F' : '°C';
}

export function formatWindSpeed(kmh: number, unit: WindSpeedUnit = 'kmh'): string {
  if (kmh === undefined || isNaN(kmh)) return '--';
  switch (unit) {
    case 'mph':
      return `${Math.round(kmh * 0.621371)} mph`;
    case 'ms':
      return `${(kmh / 3.6).toFixed(1)} m/s`;
    case 'kn':
      return `${Math.round(kmh * 0.539957)} kn`;
    case 'kmh':
    default:
      return `${Math.round(kmh)} km/h`;
  }
}

export function formatPressure(hPa: number, unit: PressureUnit = 'hPa'): string {
  if (hPa === undefined || isNaN(hPa)) return '--';
  switch (unit) {
    case 'inHg':
      return `${(hPa * 0.02953).toFixed(2)} inHg`;
    case 'mmHg':
      return `${Math.round(hPa * 0.75006)} mmHg`;
    case 'hPa':
    default:
      return `${Math.round(hPa)} hPa`;
  }
}

export function formatPrecipitation(mm: number, unit: PrecipitationUnit = 'mm'): string {
  if (mm === undefined || isNaN(mm)) return '--';
  if (unit === 'inch') {
    return `${(mm * 0.0393701).toFixed(2)} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

export function getWindDirectionCardinal(degrees: number): string {
  if (degrees === undefined || isNaN(degrees)) return '--';
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function getUVLevel(uv: number): { label: string; color: string; advice: string } {
  if (uv < 3) return { label: 'Low', color: 'text-emerald-400', advice: 'No protection required. Safe outdoors.' };
  if (uv < 6) return { label: 'Moderate', color: 'text-yellow-400', advice: 'Wear sunglasses & sun protection around midday.' };
  if (uv < 8) return { label: 'High', color: 'text-amber-500', advice: 'Sun protection essential. Seek shade midday.' };
  if (uv < 11) return { label: 'Very High', color: 'text-rose-500', advice: 'Extra protection required. Avoid direct sun.' };
  return { label: 'Extreme', color: 'text-purple-500', advice: 'Avoid sun exposure outside. High risk of skin damage.' };
}

export function getEuropeanAQIInfo(aqi: number): AQILevelInfo {
  if (aqi <= 20) {
    return {
      category: 'Good',
      color: '#10b981',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      description: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
      advice: 'Air quality is ideal for outdoor activities.'
    };
  } else if (aqi <= 40) {
    return {
      category: 'Moderate',
      color: '#3b82f6',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      description: 'Air quality is acceptable; however, some pollutants may cause moderate health concern for sensitive individuals.',
      advice: 'Sensitive individuals should observe symptoms.'
    };
  } else if (aqi <= 60) {
    return {
      category: 'Unhealthy for Sensitive Groups',
      color: '#f59e0b',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
      advice: 'Reduce prolonged or heavy outdoor exertion if sensitive.'
    };
  } else if (aqi <= 80) {
    return {
      category: 'Unhealthy',
      color: '#ef4444',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
      description: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects.',
      advice: 'Wear a protective mask and limit outdoor activities.'
    };
  } else if (aqi <= 100) {
    return {
      category: 'Very Unhealthy',
      color: '#a855f7',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      description: 'Health alert: The risk of health effects is increased for everyone.',
      advice: 'Avoid prolonged outdoor exertion. Keep windows closed.'
    };
  } else {
    return {
      category: 'Hazardous',
      color: '#881337',
      bgColor: 'bg-rose-950/40',
      borderColor: 'border-rose-600/50',
      textColor: 'text-rose-400',
      description: 'Health warning of emergency conditions: The entire population is more likely to be affected.',
      advice: 'Remain indoors and run high-efficiency air filtration.'
    };
  }
}

export function getUSAQIInfo(aqi: number): AQILevelInfo {
  if (aqi <= 50) {
    return {
      category: 'Good',
      color: '#10b981',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      description: 'Air quality is satisfactory and poses negligible risk.',
      advice: 'Great air quality for outdoor workouts and leisure.'
    };
  } else if (aqi <= 100) {
    return {
      category: 'Moderate',
      color: '#eab308',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
      description: 'Air quality is acceptable for most people.',
      advice: 'Extremely sensitive individuals should monitor outdoor exposure.'
    };
  } else if (aqi <= 150) {
    return {
      category: 'Unhealthy for Sensitive Groups',
      color: '#f97316',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      description: 'Sensitive groups may experience health effects.',
      advice: 'People with respiratory or heart disease should limit outdoor exertion.'
    };
  } else if (aqi <= 200) {
    return {
      category: 'Unhealthy',
      color: '#ef4444',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
      description: 'Some members of the general public may experience health effects.',
      advice: 'Active children and adults should avoid prolonged outdoor exertion.'
    };
  } else if (aqi <= 300) {
    return {
      category: 'Very Unhealthy',
      color: '#9333ea',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      description: 'Health alert: everyone may experience serious effects.',
      advice: 'Everyone should avoid physical outdoor exertion.'
    };
  } else {
    return {
      category: 'Hazardous',
      color: '#7f1d1d',
      bgColor: 'bg-rose-950/40',
      borderColor: 'border-rose-600/50',
      textColor: 'text-rose-400',
      description: 'Emergency warnings for the entire population.',
      advice: 'Stay indoors with air purifiers operating.'
    };
  }
}

/**
 * Calculates sun progress percentage (0 to 100) and daylight status
 */
export function calculateSunPosition(currentTimeStr: string, sunriseStr: string, sunsetStr: string): {
  progress: number;
  isDaytime: boolean;
  formattedSunrise: string;
  formattedSunset: string;
  daylightRemaining: string;
} {
  const current = new Date(currentTimeStr).getTime();
  const sunrise = new Date(sunriseStr).getTime();
  const sunset = new Date(sunsetStr).getTime();

  const formattedSunrise = new Date(sunriseStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const formattedSunset = new Date(sunsetStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  const isDaytime = current >= sunrise && current <= sunset;
  let progress = 0;

  if (current < sunrise) {
    progress = 0;
  } else if (current > sunset) {
    progress = 100;
  } else {
    const totalDaylight = sunset - sunrise;
    const elapsed = current - sunrise;
    progress = Math.min(100, Math.max(0, (elapsed / totalDaylight) * 100));
  }

  let daylightRemaining = '';
  if (isDaytime) {
    const remainingMs = sunset - current;
    const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
    const remainingMins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    daylightRemaining = `${remainingHours}h ${remainingMins}m remaining`;
  } else {
    daylightRemaining = 'Night';
  }

  return {
    progress: Math.round(progress),
    isDaytime,
    formattedSunrise,
    formattedSunset,
    daylightRemaining
  };
}
