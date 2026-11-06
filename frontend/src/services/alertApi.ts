import { AlertResponse, WeatherAlert } from '../types/weather';

export interface AlertProvider {
  name: string;
  fetchAlerts(lat: number, lon: number, signal?: AbortSignal): Promise<AlertResponse>;
}

export class PublicWeatherAlertProvider implements AlertProvider {
  name = 'National Weather Service & Official Meteorological Advisories';

  async fetchAlerts(lat: number, lon: number, signal?: AbortSignal): Promise<AlertResponse> {
    // 1. Try our backend proxy first
    try {
      const res = await fetch(`/api/alerts?lat=${lat}&lon=${lon}`, { signal });
      if (res.ok) {
        const data: AlertResponse = await res.json();
        return data;
      }
    } catch {}

    // 2. Direct US NWS GeoJSON API if in US bounds
    const isRoughlyUS = lat >= 18 && lat <= 72 && lon >= -170 && lon <= -65;
    if (isRoughlyUS) {
      try {
        const nwsRes = await fetch(
          `https://api.weather.gov/alerts/active?point=${lat.toFixed(4)},${lon.toFixed(4)}`,
          {
            headers: {
              'Accept': 'application/geo+json'
            },
            signal
          }
        );
        if (nwsRes.ok) {
          const json = await nwsRes.json();
          const features = json.features || [];
          const alerts: WeatherAlert[] = features.map((f: any) => {
            const p = f.properties || {};
            let severity: WeatherAlert['severity'] = 'minor';
            const s = (p.severity || '').toLowerCase();
            if (s === 'extreme') severity = 'extreme';
            else if (s === 'severe') severity = 'severe';
            else if (s === 'moderate') severity = 'moderate';

            return {
              id: p.id || String(Math.random()),
              senderName: p.senderName || 'National Weather Service',
              event: p.event || 'Severe Weather Statement',
              headline: p.headline || p.event,
              description: p.description || '',
              severity,
              effective: p.effective || new Date().toISOString(),
              expires: p.expires || new Date(Date.now() + 86400000).toISOString(),
              urgency: p.urgency,
              areas: p.areaDesc ? p.areaDesc.split('; ') : [],
              instruction: p.instruction
            };
          });

          return {
            available: true,
            source: 'US National Weather Service (weather.gov)',
            alerts,
            message: alerts.length === 0 ? 'No active severe weather watches or warnings.' : undefined
          };
        }
      } catch (err: any) {
        if (err.name === 'AbortError') throw err;
      }
    }

    // Default authentic report for regions without public unauthenticated alert feeds
    return {
      available: false,
      source: 'Global Meteorological Services',
      alerts: [],
      message: 'Official meteorological emergency warnings are clear or feed is unavailable for this coordinate.'
    };
  }
}

export const alertService = new PublicWeatherAlertProvider();

