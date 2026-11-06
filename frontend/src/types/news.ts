export type NewsCategory = 'All' | 'Advisories' | 'Forecast Outlook' | 'Air Quality' | 'Climate';

export interface WeatherNewsArticle {
  id: string;
  title: string;
  summary: string;
  fullReport: string;
  source: string;
  category: 'Advisories' | 'Forecast Outlook' | 'Air Quality' | 'Climate';
  publishedAt: string;
  readTime: string;
  severity: 'normal' | 'advisory' | 'watch';
  metrics?: {
    label: string;
    value: string;
  }[];
}

