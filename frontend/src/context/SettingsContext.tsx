import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserSettings, TempUnit, WindSpeedUnit, PressureUnit, PrecipitationUnit, ThemeMode } from '../types/settings';

const DEFAULT_SETTINGS: UserSettings = {
  tempUnit: 'celsius',
  windSpeedUnit: 'kmh',
  pressureUnit: 'hPa',
  precipitationUnit: 'mm',
  theme: 'dynamic',
  autoRefreshInterval: 15,
  reducedMotion: false,
};

const SETTINGS_STORAGE_KEY = 'mausamx_settings_v1';
const LEGACY_SETTINGS_KEY = 'atmos_settings_v1';

interface SettingsContextType {
  settings: UserSettings;
  setTempUnit: (unit: TempUnit) => void;
  setWindSpeedUnit: (unit: WindSpeedUnit) => void;
  setPressureUnit: (unit: PressureUnit) => void;
  setPrecipitationUnit: (unit: PrecipitationUnit) => void;
  setTheme: (theme: ThemeMode) => void;
  setAutoRefreshInterval: (minutes: number) => void;
  setReducedMotion: (reduced: boolean) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY) || localStorage.getItem(LEGACY_SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {}
    return DEFAULT_SETTINGS;
  });

  // Sync settings with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Handle system theme / reduced motion listeners
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      if (settings.theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else if (settings.theme === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
      } else if (settings.theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
          root.classList.remove('light');
        } else {
          root.classList.add('light');
          root.classList.remove('dark');
        }
      }
      // 'dynamic' theme class will be managed by WeatherContext alongside weather condition
    };

    applyTheme();

    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [settings.theme]);

  const setTempUnit = (tempUnit: TempUnit) => setSettings(s => ({ ...s, tempUnit }));
  const setWindSpeedUnit = (windSpeedUnit: WindSpeedUnit) => setSettings(s => ({ ...s, windSpeedUnit }));
  const setPressureUnit = (pressureUnit: PressureUnit) => setSettings(s => ({ ...s, pressureUnit }));
  const setPrecipitationUnit = (precipitationUnit: PrecipitationUnit) => setSettings(s => ({ ...s, precipitationUnit }));
  const setTheme = (theme: ThemeMode) => setSettings(s => ({ ...s, theme }));
  const setAutoRefreshInterval = (autoRefreshInterval: number) => setSettings(s => ({ ...s, autoRefreshInterval }));
  const setReducedMotion = (reducedMotion: boolean) => setSettings(s => ({ ...s, reducedMotion }));

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(s => ({ ...s, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setTempUnit,
        setWindSpeedUnit,
        setPressureUnit,
        setPrecipitationUnit,
        setTheme,
        setAutoRefreshInterval,
        setReducedMotion,
        updateSettings,
        resetSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

