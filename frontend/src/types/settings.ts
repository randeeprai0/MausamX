import { GeoLocation } from './location';

export type TempUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph' | 'ms' | 'kn';
export type PressureUnit = 'hPa' | 'inHg' | 'mmHg';
export type PrecipitationUnit = 'mm' | 'inch';
export type ThemeMode = 'dynamic' | 'dark' | 'light' | 'system';

export interface UserSettings {
  tempUnit: TempUnit;
  windSpeedUnit: WindSpeedUnit;
  pressureUnit: PressureUnit;
  precipitationUnit: PrecipitationUnit;
  theme: ThemeMode;
  autoRefreshInterval: number; // in minutes, 0 = manual
  reducedMotion: boolean;
  defaultCity?: GeoLocation;
}
