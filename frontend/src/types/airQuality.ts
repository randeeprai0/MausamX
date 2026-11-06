export interface OpenMeteoAirQualityCurrent {
  time: string;
  interval: number;
  european_aqi?: number;
  us_aqi?: number;
  pm10?: number;
  pm2_5?: number;
  carbon_monoxide?: number;
  nitrogen_dioxide?: number;
  sulphur_dioxide?: number;
  ozone?: number;
  uv_index?: number;
}

export interface OpenMeteoAirQualityHourly {
  time: string[];
  european_aqi?: number[];
  us_aqi?: number[];
  pm10?: number[];
  pm2_5?: number[];
  carbon_monoxide?: number[];
  nitrogen_dioxide?: number[];
  sulphur_dioxide?: number[];
  ozone?: number[];
}

export interface OpenMeteoAirQualityResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: Record<string, string>;
  current?: OpenMeteoAirQualityCurrent;
  hourly_units: Record<string, string>;
  hourly?: OpenMeteoAirQualityHourly;
}

export type AQICategory = 
  | 'Good' 
  | 'Moderate' 
  | 'Unhealthy for Sensitive Groups' 
  | 'Unhealthy' 
  | 'Very Unhealthy' 
  | 'Hazardous';

export interface AQILevelInfo {
  category: AQICategory;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
  advice: string;
}

