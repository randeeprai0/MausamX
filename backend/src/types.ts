export interface WeatherAlert {
  id: string;
  senderName: string;
  event: string;
  headline: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  effective: string;
  expires: string;
  urgency?: string;
  areas?: string[];
  instruction?: string;
}

export interface AlertResponse {
  available: boolean;
  source: string;
  alerts: WeatherAlert[];
  message?: string;
}

