import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GeoLocation } from '../types/location';
import { OpenMeteoForecastResponse, AlertResponse } from '../types/weather';
import { OpenMeteoAirQualityResponse } from '../types/airQuality';
import { fetchForecast } from '../services/weatherApi';
import { fetchAirQuality } from '../services/airQualityApi';
import { alertService } from '../services/alertApi';
import { reverseGeocode } from '../services/geocodingApi';
import { 
  getFavoritesFromStorage, 
  saveFavoritesToStorage, 
  saveWeatherSnapshot, 
  getSavedWeatherSnapshot,
  WeatherSnapshot 
} from '../services/offlineStorage';
import { useSettings } from './SettingsContext';
import { getWeatherCondition, WeatherConditionInfo } from '../utils/weatherConditions';

const DEFAULT_LOCATION: GeoLocation = {
  id: 2643743,
  name: 'London',
  country: 'United Kingdom',
  admin1: 'England',
  latitude: 51.5085,
  longitude: -0.1257,
  timezone: 'Europe/London'
};

interface WeatherContextType {
  location: GeoLocation;
  setLocation: (loc: GeoLocation) => void;
  forecast: OpenMeteoForecastResponse | undefined;
  airQuality: OpenMeteoAirQualityResponse | null | undefined;
  alerts: AlertResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetchWeather: () => void;
  favorites: GeoLocation[];
  addFavorite: (loc: GeoLocation) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  requestGeolocation: () => Promise<void>;
  geoLoading: boolean;
  geoError: string | null;
  isOffline: boolean;
  offlineSnapshot: WeatherSnapshot | null;
  lastUpdated: Date | null;
  activeConditionInfo: WeatherConditionInfo | null;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const queryClient = useQueryClient();

  const [location, setLocation] = useState<GeoLocation>(() => {
    return settings.defaultCity || DEFAULT_LOCATION;
  });

  const [favorites, setFavorites] = useState<GeoLocation[]>(() => getFavoritesFromStorage());
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlineSnapshot, setOfflineSnapshot] = useState<WeatherSnapshot | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Monitor online / offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      queryClient.invalidateQueries({ queryKey: ['weather'] });
    };

    const handleOffline = async () => {
      setIsOffline(true);
      const snapshot = await getSavedWeatherSnapshot();
      if (snapshot) {
        setOfflineSnapshot(snapshot);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queryClient]);

  // Query: Weather Forecast
  const {
    data: forecast,
    isLoading: isForecastLoading,
    isError: isForecastError,
    error: forecastError,
    refetch: refetchForecast
  } = useQuery({
    queryKey: ['weather', location.latitude, location.longitude, location.timezone],
    queryFn: async ({ signal }) => {
      const data = await fetchForecast(location.latitude, location.longitude, location.timezone, signal);
      setLastUpdated(new Date());

      // Save offline snapshot asynchronously
      saveWeatherSnapshot({
        location,
        weather: data,
        savedAt: new Date().toISOString()
      }).catch(() => {});

      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: settings.autoRefreshInterval > 0 ? settings.autoRefreshInterval * 60 * 1000 : false,
    retry: 2,
    enabled: !isOffline
  });

  // Query: Air Quality
  const {
    data: airQuality,
  } = useQuery({
    queryKey: ['airQuality', location.latitude, location.longitude, location.timezone],
    queryFn: async ({ signal }) => {
      return await fetchAirQuality(location.latitude, location.longitude, location.timezone, signal);
    },
    staleTime: 1000 * 60 * 15,
    retry: 1,
    enabled: !isOffline
  });

  // Query: Alerts
  const {
    data: alerts,
  } = useQuery({
    queryKey: ['alerts', location.latitude, location.longitude],
    queryFn: async ({ signal }) => {
      return await alertService.fetchAlerts(location.latitude, location.longitude, signal);
    },
    staleTime: 1000 * 60 * 10,
    retry: 1,
    enabled: !isOffline
  });

  // Effective Weather Data (Live or Offline Snapshot)
  const effectiveForecast = isOffline && offlineSnapshot ? offlineSnapshot.weather : forecast;
  const effectiveAirQuality = isOffline && offlineSnapshot ? offlineSnapshot.airQuality : airQuality;

  // Active Condition Info
  const activeConditionInfo = effectiveForecast && effectiveForecast.current
    ? getWeatherCondition(effectiveForecast.current.weather_code, effectiveForecast.current.is_day)
    : null;

  // Sync Dynamic theme to HTML root
  useEffect(() => {
    if (settings.theme === 'dynamic' && activeConditionInfo) {
      const root = document.documentElement;
      const isNight = activeConditionInfo.themeType.includes('night') || activeConditionInfo.themeType === 'thunderstorm';
      if (isNight) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('dark'); // Mausam X maintains sleek dark glass styling by default, with rich atmospheric tint
      }
    }
  }, [settings.theme, activeConditionInfo]);

  // Favorites handlers
  const addFavorite = useCallback((loc: GeoLocation) => {
    setFavorites(prev => {
      if (prev.some(item => item.id === loc.id)) return prev;
      const updated = [loc, ...prev];
      saveFavoritesToStorage(updated);
      return updated;
    });
  }, []);

  const removeFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const updated = prev.filter(item => item.id !== id);
      saveFavoritesToStorage(updated);
      return updated;
    });
  }, []);

  const isFavorite = useCallback((id: number) => {
    return favorites.some(item => item.id === id);
  }, [favorites]);

  // Geolocation request
  const requestGeolocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const userLocation = await reverseGeocode(lat, lon);
          setLocation(userLocation);
          setGeoError(null);
        } catch (err: any) {
          setGeoError('Failed to determine location details.');
        } finally {
          setGeoLoading(false);
        }
      },
      (err) => {
        setGeoLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setGeoError('Location permission denied. Please search for your city manually.');
            break;
          case err.POSITION_UNAVAILABLE:
            setGeoError('Location position unavailable.');
            break;
          case err.TIMEOUT:
            setGeoError('Location request timed out.');
            break;
          default:
            setGeoError('Unable to detect current location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, []);

  const refetchWeather = useCallback(() => {
    refetchForecast();
    queryClient.invalidateQueries({ queryKey: ['airQuality'] });
    queryClient.invalidateQueries({ queryKey: ['alerts'] });
  }, [refetchForecast, queryClient]);

  return (
    <WeatherContext.Provider
      value={{
        location,
        setLocation,
        forecast: effectiveForecast,
        airQuality: effectiveAirQuality,
        alerts,
        isLoading: isForecastLoading && !effectiveForecast,
        isError: isForecastError && !effectiveForecast,
        error: forecastError as Error | null,
        refetchWeather,
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        requestGeolocation,
        geoLoading,
        geoError,
        isOffline,
        offlineSnapshot,
        lastUpdated,
        activeConditionInfo
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export function useWeather(): WeatherContextType {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
