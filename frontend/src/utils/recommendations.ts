import { OpenMeteoForecastResponse } from '../types/weather';
import { formatTemperature } from './formatters';
import { TempUnit } from '../types/settings';

export interface ClothingAdvice {
  summary: string;
  items: Array<{
    name: string;
    icon: string;
    note: string;
    required: boolean;
  }>;
  tips: string[];
}

export function getClothingRecommendations(forecast: OpenMeteoForecastResponse, tempUnit: TempUnit = 'celsius'): ClothingAdvice {
  if (!forecast || !forecast.current) {
    return {
      summary: 'Checking atmospheric conditions...',
      items: [],
      tips: []
    };
  }

  const current = forecast.current;
  const temp = current.temperature_2m;
  const feelsLike = current.apparent_temperature;
  const rainProb = forecast.hourly?.precipitation_probability?.[0] || 0;
  const precip = current.precipitation || 0;
  const wind = current.wind_speed_10m;
  const uv = forecast.daily?.uv_index_max?.[0] || 0;

  const items: ClothingAdvice['items'] = [];
  const tips: string[] = [];

  // Rain checks
  const isRainingOrLikely = precip > 0.2 || rainProb >= 40 || [51,53,55,61,63,65,80,81,82,95,96,99].includes(current.weather_code);
  if (isRainingOrLikely) {
    items.push({
      name: 'Waterproof Umbrella / Raincoat',
      icon: 'Umbrella',
      note: precip > 1 ? 'Continuous rain in progress' : 'High chance of showers today',
      required: true
    });
    items.push({
      name: 'Water-resistant Shoes',
      icon: 'Footprints',
      note: 'Avoid puddles and damp terrain',
      required: false
    });
    tips.push('A water-repellent outer shell will keep you dry during sudden downpours.');
  }

  // Temperature bands
  if (feelsLike < 0) {
    items.push({
      name: 'Heavy Down Parka / Winter Coat',
      icon: 'Shield',
      note: `Freezing chill feels like ${formatTemperature(feelsLike, tempUnit)}`,
      required: true
    });
    items.push({
      name: 'Thermal Inner Layers',
      icon: 'Layers',
      note: 'Base layer to trap body warmth',
      required: true
    });
    items.push({
      name: 'Beanie & Insulated Gloves',
      icon: 'Smile',
      note: 'Protect extremities against frost',
      required: true
    });
    tips.push('Extreme sub-zero chill: limit skin exposure and maintain layered thermal insulation.');
  } else if (feelsLike < 12) {
    items.push({
      name: 'Warm Jacket / Coat',
      icon: 'Shirt',
      note: `Brisk conditions at ${formatTemperature(temp, tempUnit)}`,
      required: true
    });
    items.push({
      name: 'Fleece or Wool Sweater',
      icon: 'Layers',
      note: 'Cozy intermediate layer',
      required: false
    });
    tips.push('Morning and evening hours will feel notably cold; carry an extra layer.');
  } else if (feelsLike < 20) {
    items.push({
      name: 'Light Jacket / Cardigan',
      icon: 'Shirt',
      note: `Mild & comfortable (${formatTemperature(temp, tempUnit)})`,
      required: false
    });
    items.push({
      name: 'Long-sleeve Shirt or Denim',
      icon: 'Smile',
      note: 'Ideal all-day comfort',
      required: true
    });
    tips.push('Comfortable temperate weather: a light pullover handles breezy moments gracefully.');
  } else if (feelsLike < 28) {
    items.push({
      name: 'Breathable T-Shirt & Chinos',
      icon: 'Shirt',
      note: `Pleasant warmth (${formatTemperature(temp, tempUnit)})`,
      required: true
    });
    tips.push('Optimal comfort zone: natural cotton and linen fabrics offer breezy comfort.');
  } else {
    items.push({
      name: 'Light & Airy Moisture-Wicking Wear',
      icon: 'Shirt',
      note: `High heat (${formatTemperature(temp, tempUnit)})`,
      required: true
    });
    items.push({
      name: 'Sun Hat or Cap',
      icon: 'Sun',
      note: 'Direct solar protection',
      required: false
    });
    tips.push('High thermal load: hydrate frequently and stay in shaded or air-conditioned environments.');
  }

  // Wind advice
  if (wind >= 28) {
    items.push({
      name: 'Windbreaker Shell',
      icon: 'Wind',
      note: `Brisk wind blowing at ${Math.round(wind)} km/h`,
      required: false
    });
    tips.push('Wind chill effect is notable; a wind-resistant shell blocks convective heat loss.');
  }

  // UV protection
  if (uv >= 5) {
    items.push({
      name: 'UV400 Sunglasses & Sunscreen',
      icon: 'Glasses',
      note: `UV Index reaching ${uv.toFixed(1)}`,
      required: true
    });
    tips.push('Apply broad-spectrum SPF 30+ if venturing outside during midday.');
  }

  let summary = 'Optimal casual dress';
  if (isRainingOrLikely) {
    summary = 'Pack rain protection and wear waterproof layers';
  } else if (feelsLike < 5) {
    summary = 'Bundle up heavily in warm insulated winter wear';
  } else if (feelsLike < 16) {
    summary = 'Wear layers with a comfortable jacket or knitwear';
  } else if (feelsLike > 27) {
    summary = 'Wear light, loose-fitting clothes and protect against sun';
  }

  return { summary, items, tips };
}

export interface OutdoorHourScore {
  timeStr: string;
  hour: number;
  formattedHour: string;
  score: number; // 0 to 100
  label: 'Prime' | 'Great' | 'Fair' | 'Poor';
  color: string;
  reason: string;
  temperature: number;
  rainProbability: number;
}

export interface OutdoorActivityAnalysis {
  bestWindow: string;
  overallRating: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
  hourlyScores: OutdoorHourScore[];
  recommendation: string;
}

export function analyzeBestOutdoorTime(forecast: OpenMeteoForecastResponse): OutdoorActivityAnalysis {
  if (!forecast || !forecast.hourly) {
    return {
      bestWindow: 'Data unavailable',
      overallRating: 'Moderate',
      hourlyScores: [],
      recommendation: 'Awaiting forecast telemetry'
    };
  }

  const hourly = forecast.hourly;
  const hoursToCheck = Math.min(24, hourly.time.length);

  const scores: OutdoorHourScore[] = [];

  for (let i = 0; i < hoursToCheck; i++) {
    const time = new Date(hourly.time[i]);
    const hourNum = time.getHours();

    // Daylight focus: 6:00 to 20:00
    if (hourNum < 6 || hourNum > 20) continue;

    const temp = hourly.temperature_2m[i];
    const rainProb = hourly.precipitation_probability[i] || 0;
    const precip = hourly.precipitation[i] || 0;
    const wind = hourly.wind_speed_10m[i] || 0;
    const uv = hourly.uv_index?.[i] || 0;

    let score = 100;
    const reasons: string[] = [];

    // Rain penalty
    if (precip > 0.5 || rainProb > 50) {
      score -= 60;
      reasons.push('High rain probability');
    } else if (rainProb > 25) {
      score -= 25;
      reasons.push('Chance of light rain');
    }

    // Temperature scoring
    if (temp < 5) {
      score -= 40;
      reasons.push('Freezing temperatures');
    } else if (temp < 14) {
      score -= 15;
      reasons.push('Chilly');
    } else if (temp > 32) {
      score -= 40;
      reasons.push('Excessive heat');
    } else if (temp > 28) {
      score -= 15;
      reasons.push('Warm');
    }

    // Wind penalty
    if (wind > 35) {
      score -= 30;
      reasons.push('Very windy');
    } else if (wind > 22) {
      score -= 10;
      reasons.push('Breezy');
    }

    // High UV penalty
    if (uv > 8) {
      score -= 15;
      reasons.push('Severe UV radiation');
    }

    score = Math.max(10, Math.min(100, score));

    let label: OutdoorHourScore['label'] = 'Fair';
    let color = 'text-yellow-400';

    if (score >= 80) {
      label = 'Prime';
      color = 'text-emerald-400';
    } else if (score >= 65) {
      label = 'Great';
      color = 'text-sky-400';
    } else if (score >= 45) {
      label = 'Fair';
      color = 'text-amber-400';
    } else {
      label = 'Poor';
      color = 'text-rose-400';
    }

    scores.push({
      timeStr: hourly.time[i],
      hour: hourNum,
      formattedHour: time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      score,
      label,
      color,
      reason: reasons.length > 0 ? reasons.join(' • ') : 'Ideal temperature & clear conditions',
      temperature: temp,
      rainProbability: rainProb
    });
  }

  // Find peak window
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const best = sorted[0];

  let overallRating: OutdoorActivityAnalysis['overallRating'] = 'Good';
  let bestWindow = 'No ideal daytime window';
  let recommendation = 'Check updated radar before scheduling outdoor activities.';

  if (best && best.score >= 75) {
    overallRating = 'Excellent';
    bestWindow = `${best.formattedHour} (${best.score}/100 Score)`;
    recommendation = `Optimal window around ${best.formattedHour}. Low rain probability and comfortable temperature make it perfect for running, sports or walking.`;
  } else if (best && best.score >= 55) {
    overallRating = 'Good';
    bestWindow = `${best.formattedHour}`;
    recommendation = `Decent conditions around ${best.formattedHour}. Wear appropriate layers and stay aware of shifting clouds.`;
  } else if (best) {
    overallRating = 'Moderate';
    bestWindow = `${best.formattedHour}`;
    recommendation = 'Atmospheric conditions are sub-optimal due to precipitation, wind, or extreme temperatures.';
  }

  return {
    bestWindow,
    overallRating,
    hourlyScores: scores,
    recommendation
  };
}
