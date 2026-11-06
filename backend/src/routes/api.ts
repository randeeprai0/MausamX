import { Router, Request, Response } from 'express';
import axios from 'axios';
import { fetchWeatherAlerts } from '../services/alertService.js';

export const apiRouter = Router();

// In-memory simple cache to prevent hitting rate limits
const cache = new Map<string, { data: any; expiry: number }>();

function getCached(key: string) {
  const item = cache.get(key);
  if (item && item.expiry > Date.now()) {
    return item.data;
  }
  cache.delete(key);
  return null;
}

function setCached(key: string, data: any, ttlSeconds: number = 300) {
  cache.set(key, { data, expiry: Date.now() + ttlSeconds * 1000 });
}

// Health check endpoint
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Mausam X Backend Proxy & Alert Engine', timestamp: new Date().toISOString() });
});

// Weather Alerts endpoint
apiRouter.get('/alerts', async (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string);
  const lon = parseFloat(req.query.lon as string);

  if (isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({ error: 'Valid latitude (lat) and longitude (lon) are required' });
  }

  const cacheKey = `alerts:${lat.toFixed(2)},${lon.toFixed(2)}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  const result = await fetchWeatherAlerts(lat, lon);
  setCached(cacheKey, result, 600); // 10 min cache
  return res.json(result);
});

// Proxy for Open-Meteo Geocoding
apiRouter.get('/search', async (req: Request, res: Response) => {
  const name = req.query.name as string;
  if (!name || name.trim().length === 0) {
    return res.json({ results: [] });
  }

  const cacheKey = `geo:${name.toLowerCase().trim()}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: {
        name,
        count: req.query.count || 10,
        language: req.query.language || 'en',
        format: 'json'
      },
      timeout: 5000
    });
    setCached(cacheKey, response.data, 3600); // 1 hour cache for geo search
    return res.json(response.data);
  } catch (error: any) {
    return res.status(502).json({ error: 'Geocoding service unavailable', details: error.message });
  }
});

// Proxy for Open-Meteo Weather Forecast
apiRouter.get('/weather', async (req: Request, res: Response) => {
  const { latitude, longitude, timezone, current, hourly, daily } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'latitude and longitude are required' });
  }

  const cacheKey = `weather:${latitude}:${longitude}:${timezone || 'auto'}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: req.query,
      timeout: 7000
    });
    setCached(cacheKey, response.data, 300); // 5 min cache
    return res.json(response.data);
  } catch (error: any) {
    return res.status(502).json({ error: 'Weather service unavailable', details: error.message });
  }
});

// Proxy for Open-Meteo Air Quality
apiRouter.get('/air-quality', async (req: Request, res: Response) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'latitude and longitude are required' });
  }

  const cacheKey = `aqi:${latitude}:${longitude}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const response = await axios.get('https://air-quality-api.open-meteo.com/v1/air-quality', {
      params: req.query,
      timeout: 7000
    });
    setCached(cacheKey, response.data, 900); // 15 min cache
    return res.json(response.data);
  } catch (error: any) {
    return res.status(502).json({ error: 'Air quality service unavailable', details: error.message });
  }
});

// Popular curated weather cities endpoint
apiRouter.get('/curated-cities', (req: Request, res: Response) => {
  const curated = [
    { id: 5128581, name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
    { id: 2643743, name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
    { id: 1850147, name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
    { id: 2988507, name: 'Paris', country: 'France', admin1: 'Île-de-France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
    { id: 1275339, name: 'Mumbai', country: 'India', admin1: 'Maharashtra', latitude: 19.076, longitude: 72.8777, timezone: 'Asia/Kolkata' },
    { id: 2147714, name: 'Sydney', country: 'Australia', admin1: 'New South Wales', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
    { id: 292223, name: 'Dubai', country: 'United Arab Emirates', admin1: 'Dubai', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
    { id: 3451190, name: 'Rio de Janeiro', country: 'Brazil', admin1: 'Rio de Janeiro', latitude: -22.9068, longitude: -43.1729, timezone: 'America/Sao_Paulo' },
  ];
  res.json({ cities: curated });
});

