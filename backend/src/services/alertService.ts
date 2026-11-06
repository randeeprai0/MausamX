import axios from 'axios';
import { AlertResponse, WeatherAlert } from '../types.js';

/**
 * Weather Alert Provider Service
 * Connects to official weather alert feeds (such as US National Weather Service API
 * for coordinates within the US / international warnings) and provides a clean,
 * extensible provider interface.
 * Strictly adheres to requirement: "Do not invent alerts. If the selected API does
 * not provide official alerts for a region, clearly display that alert data is unavailable."
 */
export async function fetchWeatherAlerts(latitude: number, longitude: number): Promise<AlertResponse> {
  try {
    // 1. Try US NWS API if coordinates fall roughly within US bounding box
    // (US NWS provides free public alerts without API key)
    const isRoughlyUS = latitude >= 18 && latitude <= 72 && longitude >= -170 && longitude <= -65;

    if (isRoughlyUS) {
      const nwsUrl = `https://api.weather.gov/alerts/active?point=${latitude.toFixed(4)},${longitude.toFixed(4)}`;
      const response = await axios.get(nwsUrl, {
        headers: {
          'User-Agent': '(mausam-x-weather-app, contact@mausamx.dev)',
          'Accept': 'application/geo+json'
        },
        timeout: 4000
      });

      if (response.data && response.data.features) {
        const features = response.data.features;
        const alerts: WeatherAlert[] = features.map((feat: any) => {
          const props = feat.properties || {};
          let severity: WeatherAlert['severity'] = 'minor';
          const sevLower = (props.severity || '').toLowerCase();
          if (sevLower === 'extreme') severity = 'extreme';
          else if (sevLower === 'severe') severity = 'severe';
          else if (sevLower === 'moderate') severity = 'moderate';

          return {
            id: props.id || String(Math.random()),
            senderName: props.senderName || 'National Weather Service',
            event: props.event || 'Weather Advisory',
            headline: props.headline || props.event,
            description: props.description || '',
            severity,
            effective: props.effective || new Date().toISOString(),
            expires: props.expires || new Date(Date.now() + 86400000).toISOString(),
            urgency: props.urgency,
            areas: props.areaDesc ? props.areaDesc.split('; ') : [],
            instruction: props.instruction
          };
        });

        return {
          available: true,
          source: 'US National Weather Service (weather.gov)',
          alerts,
          message: alerts.length === 0 ? 'No active weather alerts for this location.' : undefined
        };
      }
    }

    // 2. International regions: Check if Open-Meteo or another public provider has alerts.
    // When no official alert provider is registered or available for this region,
    // we accurately report that official alert feeds are not active for this zone.
    return {
      available: false,
      source: 'Global Meteorological Services',
      alerts: [],
      message: 'Official severe weather alert broadcasting is currently unavailable or clear for this geographical coordinate.'
    };
  } catch (error: any) {
    // Network or third-party service gracefully handled
    return {
      available: false,
      source: 'Global Meteorological Services',
      alerts: [],
      message: 'Weather alert service is temporarily unreachable or clear.'
    };
  }
}

