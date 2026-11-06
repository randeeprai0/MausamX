import { GeoLocation } from '../types/location';
import { OpenMeteoForecastResponse } from '../types/weather';
import { OpenMeteoAirQualityResponse } from '../types/airQuality';
import { WeatherNewsArticle } from '../types/news';
import { getWeatherCondition } from '../utils/weatherConditions';

/**
 * Returns the appropriate official meteorological agency for a country.
 */
function getRegionalAgency(countryCode?: string, countryName?: string): string {
  const code = (countryCode || '').toUpperCase();
  const name = (countryName || '').toLowerCase();

  if (code === 'IN' || name.includes('india')) return 'India Meteorological Department (IMD)';
  if (code === 'US' || name.includes('united states')) return 'National Weather Service (NOAA / NWS)';
  if (code === 'GB' || name.includes('united kingdom')) return 'UK Met Office';
  if (code === 'JP' || name.includes('japan')) return 'Japan Meteorological Agency (JMA)';
  if (code === 'AU' || name.includes('australia')) return 'Bureau of Meteorology (BOM)';
  if (code === 'FR' || name.includes('france')) return 'Météo-France';
  if (code === 'DE' || name.includes('germany')) return 'Deutscher Wetterdienst (DWD)';
  if (code === 'CA' || name.includes('canada')) return 'Environment and Climate Change Canada';
  if (code === 'AE' || name.includes('emirates')) return 'National Centre of Meteorology (NCM)';
  return 'World Meteorological Organization (WMO Regional Bureau)';
}

/**
 * Generates timely, area-specific meteorological news articles and bulletins
 * based on the real-time Open-Meteo telemetry for that specific city and region.
 */
export function generateLocationWeatherNews(
  location: GeoLocation,
  forecast?: OpenMeteoForecastResponse,
  airQuality?: OpenMeteoAirQualityResponse | null
): WeatherNewsArticle[] {
  const cityName = location.name || 'Regional';
  const regionName = location.admin1 ? `${location.admin1}, ${location.country || ''}` : location.country || 'the region';
  const agency = getRegionalAgency(location.country_code, location.country);

  const current = forecast?.current;
  const daily = forecast?.daily;
  const condition = current ? getWeatherCondition(current.weather_code, current.is_day) : null;

  const currentTemp = current ? Math.round(current.temperature_2m) : 25;
  const maxTemp = daily?.temperature_2m_max?.[0] !== undefined ? Math.round(daily.temperature_2m_max[0]) : currentTemp + 4;
  const minTemp = daily?.temperature_2m_min?.[0] !== undefined ? Math.round(daily.temperature_2m_min[0]) : currentTemp - 5;
  const windSpeed = current ? Math.round(current.wind_speed_10m) : 12;
  const humidity = current ? Math.round(current.relative_humidity_2m) : 55;
  const pressure = current ? Math.round(current.surface_pressure) : 1012;
  const precipProb = forecast?.hourly?.precipitation_probability?.[0] ?? 0;
  const uvMax = daily?.uv_index_max?.[0] ?? 6;

  const aqiEur = airQuality?.current?.european_aqi ?? 35;
  const pm25 = airQuality?.current?.pm2_5 ? Math.round(airQuality.current.pm2_5 * 10) / 10 : 18;

  const articles: WeatherNewsArticle[] = [];

  // Article 1: Primary Synoptic Weather Bulletin for this City
  const isRainy = (current?.rain ?? 0) > 0 || (current?.weather_code ?? 0) >= 51;
  const isHighWind = windSpeed > 30;
  const isHot = maxTemp >= 35;

  let headline1 = `${cityName} Weather Dispatch: ${condition?.label || 'Moderate Conditions'} with highs of ${maxTemp}°C`;
  let severity1: 'normal' | 'advisory' | 'watch' = 'normal';

  if (isRainy) {
    headline1 = `${cityName} Precipitation Advisory: Active showers and moist front over ${cityName}`;
    severity1 = 'advisory';
  } else if (isHighWind) {
    headline1 = `Wind Advisory for ${cityName}: Sustained gusts recorded up to ${windSpeed} km/h`;
    severity1 = 'advisory';
  } else if (isHot) {
    headline1 = `Elevated Temperature Alert: ${cityName} registers highs touching ${maxTemp}°C`;
    severity1 = 'watch';
  }

  articles.push({
    id: `synoptic-${location.id}`,
    title: headline1,
    summary: `Local sensors across ${cityName} report ${condition?.description?.toLowerCase() || 'steady atmospheric conditions'} with current temperatures at ${currentTemp}°C and relative humidity around ${humidity}%.`,
    fullReport: `The latest meteorological telemetry from stations in ${regionName} confirms a surface barometric pressure of ${pressure} hPa with wind velocities averaging ${windSpeed} km/h. Daytime thermal peaks will reach ${maxTemp}°C while nocturnal cooling is projected to bring lows to ${minTemp}°C. Precipitation probability for the ongoing forecast cycle sits at ${precipProb}%. Meteorologists advise residents to plan outdoor schedules accordingly.`,
    source: agency,
    category: isRainy || isHighWind || isHot ? 'Advisories' : 'Forecast Outlook',
    publishedAt: '25m ago',
    readTime: '2 min read',
    severity: severity1,
    metrics: [
      { label: 'Current Temp', value: `${currentTemp}°C` },
      { label: 'Day Range', value: `${minTemp}° / ${maxTemp}°C` },
      { label: 'Wind Speed', value: `${windSpeed} km/h` },
      { label: 'Humidity', value: `${humidity}%` },
    ],
  });

  // Article 2: Air Quality & Atmospheric Health Dispatch
  let aqiQualityText = 'Good';
  let aqiSeverity: 'normal' | 'advisory' | 'watch' = 'normal';
  if (aqiEur > 80 || pm25 > 50) {
    aqiQualityText = 'Unhealthy';
    aqiSeverity = 'watch';
  } else if (aqiEur > 50 || pm25 > 25) {
    aqiQualityText = 'Moderate';
    aqiSeverity = 'advisory';
  }

  articles.push({
    id: `air-${location.id}`,
    title: `Atmospheric Quality Index: ${cityName} records ${aqiQualityText} dispersion levels`,
    summary: `Ambient air sensors in the ${cityName} municipal corridor measure PM2.5 concentrations at ${pm25} µg/m³, reflecting European AQI index reading of ${aqiEur}.`,
    fullReport: `Continuous environmental monitoring across ${regionName} indicates particulate concentrations influenced by regional wind drift and thermal inversion. Particulate matter PM2.5 was recorded at ${pm25} µg/m³. Atmospheric scientists note that ventilation indices will fluctuate during early morning and late evening cycles. Individuals sensitive to aerosol particulates are encouraged to monitor real-time indices.`,
    source: 'Regional Environmental Protection & Air Monitoring Bureau',
    category: 'Air Quality',
    publishedAt: '1h ago',
    readTime: '2 min read',
    severity: aqiSeverity,
    metrics: [
      { label: 'European AQI', value: `${aqiEur}` },
      { label: 'PM2.5 Level', value: `${pm25} µg/m³` },
      { label: 'Dispersion', value: aqiQualityText },
    ],
  });

  // Article 3: 7-Day Synoptic Trend & Regional Outlook
  const daysTrend = daily?.temperature_2m_max && daily.temperature_2m_max.length > 3
    ? daily.temperature_2m_max[3] > maxTemp ? 'a gradual warming trend' : 'a stable cooling transition'
    : 'consistent seasonal temperatures';

  articles.push({
    id: `trend-${location.id}`,
    title: `7-Day Climate Perspective: Projected synoptic transition for ${cityName}`,
    summary: `Numerical forecasting models predict ${daysTrend} throughout the upcoming week across ${regionName}, with steady barometric stabilization.`,
    fullReport: `Analysis of multi-model ensemble trajectories indicates that the broader synoptic boundary over ${regionName} will experience ${daysTrend}. Atmospheric humidity is anticipated to average ${humidity}% over the rolling 7-day period. Agricultural and urban infrastructure sectors can anticipate predictable meteorological windows suitable for routine logistics and transit.`,
    source: agency,
    category: 'Forecast Outlook',
    publishedAt: '2h ago',
    readTime: '3 min read',
    severity: 'normal',
    metrics: [
      { label: 'Weekly Trend', value: daysTrend.split(' ')[1] || 'Stable' },
      { label: 'Barometric Trend', value: `${pressure} hPa` },
      { label: 'Precip Risk', value: precipProb > 40 ? 'Moderate' : 'Low' },
    ],
  });

  // Article 4: Solar Transit & UV Advisory
  let uvSeverity: 'normal' | 'advisory' | 'watch' = 'normal';
  let uvLabel = 'Moderate';
  if (uvMax >= 8) {
    uvSeverity = 'watch';
    uvLabel = 'Very High';
  } else if (uvMax >= 6) {
    uvSeverity = 'advisory';
    uvLabel = 'High';
  }

  articles.push({
    id: `solar-${location.id}`,
    title: `Solar Transit Bulletin: Peak UV Index of ${uvMax.toFixed(1)} (${uvLabel}) anticipated in ${cityName}`,
    summary: `Solar ephemeris telemetry for ${cityName} indicates peak ultraviolet irradiance concentrated between 11:30 AM and 2:45 PM solar time.`,
    fullReport: `Clear to partly cloudy atmospheric column allows direct solar radiation transmission across ${regionName}. With the UV index reaching a zenith of ${uvMax.toFixed(1)}, standard sun safety precautions (protective eyewear, breathable sun-blocking attire, and hydration) are advised for individuals working outdoors during midday hours.`,
    source: 'Solar & Heliophysics Meteorological Division',
    category: 'Climate',
    publishedAt: '3h ago',
    readTime: '1 min read',
    severity: uvSeverity,
    metrics: [
      { label: 'Max UV Index', value: `${uvMax.toFixed(1)}` },
      { label: 'Exposure Risk', value: uvLabel },
      { label: 'Peak Window', value: '11:30 - 14:45' },
    ],
  });

  return articles;
}

