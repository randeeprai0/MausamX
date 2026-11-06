import { OpenMeteoForecastResponse } from '../types/weather';
import { formatTemperature } from './formatters';
import { TempUnit } from '../types/settings';

export interface WeatherInsight {
  id: string;
  type: 'rain' | 'temperature' | 'wind' | 'uv' | 'comfort';
  icon: string;
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'info';
}

export function generateSmartInsights(forecast: OpenMeteoForecastResponse, tempUnit: TempUnit = 'celsius'): WeatherInsight[] {
  const insights: WeatherInsight[] = [];
  if (!forecast || !forecast.hourly || !forecast.daily) return insights;

  const current = forecast.current;
  const hourly = forecast.hourly;
  const daily = forecast.daily;

  // 1. Rain anticipation (next 12 hours)
  const next12HoursPrecip = hourly.precipitation_probability.slice(0, 12);
  const highRainHourIndex = next12HoursPrecip.findIndex(prob => prob >= 50);

  if (highRainHourIndex !== -1) {
    const rainTime = new Date(hourly.time[highRainHourIndex]);
    const formattedRainHour = rainTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const rainProb = next12HoursPrecip[highRainHourIndex];
    insights.push({
      id: 'rain-alert',
      type: 'rain',
      icon: 'CloudRain',
      title: 'Rain Expected Ahead',
      description: `Elevated rain chance (${rainProb}%) starting around ${formattedRainHour}. Keep an umbrella accessible.`,
      importance: 'high'
    });
  } else {
    const anyRain = next12HoursPrecip.some(prob => prob > 20);
    if (!anyRain) {
      insights.push({
        id: 'no-rain',
        type: 'rain',
        icon: 'Sun',
        title: 'Clear Skies & Dry Hours',
        description: 'Dry conditions forecast for the next 12 hours with virtually zero chance of precipitation.',
        importance: 'info'
      });
    }
  }

  // 2. Temperature shift (Today vs Tomorrow)
  if (daily.temperature_2m_max && daily.temperature_2m_max.length >= 2) {
    const todayMax = daily.temperature_2m_max[0];
    const tomorrowMax = daily.temperature_2m_max[1];
    const diff = tomorrowMax - todayMax;

    if (Math.abs(diff) >= 3) {
      const isWarmer = diff > 0;
      insights.push({
        id: 'temp-trend',
        type: 'temperature',
        icon: isWarmer ? 'TrendingUp' : 'TrendingDown',
        title: isWarmer ? 'Warmer Day Tomorrow' : 'Noticeable Cooling Tomorrow',
        description: `Tomorrow's peak will be ${formatTemperature(tomorrowMax, tempUnit)} (${Math.abs(Math.round(diff))}° ${isWarmer ? 'higher' : 'cooler'} than today).`,
        importance: 'medium'
      });
    }
  }

  // 3. Wind speed warning
  const currentWind = current.wind_speed_10m;
  const maxWindToday = daily.wind_speed_10m_max?.[0] || currentWind;
  if (currentWind >= 35 || maxWindToday >= 45) {
    insights.push({
      id: 'wind-warning',
      type: 'wind',
      icon: 'Wind',
      title: 'Brisk & Gusty Winds',
      description: `Strong gusts up to ${Math.round(daily.wind_gusts_10m_max?.[0] || currentWind * 1.3)} km/h expected. Secure loose outdoor items.`,
      importance: 'high'
    });
  }

  // 4. Midday UV Index alert
  const maxUVToday = daily.uv_index_max?.[0] || 0;
  if (maxUVToday >= 6) {
    insights.push({
      id: 'uv-warning',
      type: 'uv',
      icon: 'SunDim',
      title: 'Elevated Midday UV Radiation',
      description: `Peak UV Index will touch ${maxUVToday.toFixed(1)} between 11:00 AM and 3:00 PM. High SPF sunscreen & sunglasses recommended.`,
      importance: maxUVToday >= 8 ? 'high' : 'medium'
    });
  }

  // 5. Ideal diurnal comfort window
  const daytimeHours = hourly.time.slice(0, 24).map((timeStr, idx) => ({
    hour: new Date(timeStr).getHours(),
    temp: hourly.temperature_2m[idx],
    rainProb: hourly.precipitation_probability[idx],
    wind: hourly.wind_speed_10m[idx],
    time: timeStr
  })).filter(h => h.hour >= 8 && h.hour <= 19);

  const bestSlot = daytimeHours.find(h => h.temp >= 18 && h.temp <= 25 && h.rainProb < 20 && h.wind < 20);
  if (bestSlot) {
    const slotTime = new Date(bestSlot.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    insights.push({
      id: 'outdoor-prime',
      type: 'comfort',
      icon: 'Sparkles',
      title: 'Prime Outdoor Conditions',
      description: `Around ${slotTime}, pleasant temperature (${formatTemperature(bestSlot.temp, tempUnit)}) and gentle breeze make it prime for outside walks.`,
      importance: 'info'
    });
  }

  return insights;
}
