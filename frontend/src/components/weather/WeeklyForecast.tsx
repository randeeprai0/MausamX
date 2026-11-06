import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { processDailyForecast } from '../../services/weatherApi';
import { formatTemperature } from '../../utils/formatters';
import { getWeatherCondition } from '../../utils/weatherConditions';
import {
  Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudDrizzle,
  CloudRain, CloudSnow, Snowflake, CloudRainWind, CloudLightning,
  Zap, Calendar, Droplets
} from 'lucide-react';

const DailyIcon: React.FC<{ iconName: string }> = ({ iconName }) => {
  switch (iconName) {
    case 'Sun': return <Sun className="w-5 h-5 text-amber-400" />;
    case 'Moon': return <Moon className="w-5 h-5 text-indigo-300" />;
    case 'SunDim': return <Sun className="w-5 h-5 text-amber-300" />;
    case 'MoonStar': return <Moon className="w-5 h-5 text-indigo-200" />;
    case 'CloudSun': return <CloudSun className="w-5 h-5 text-amber-300" />;
    case 'CloudMoon': return <CloudMoon className="w-5 h-5 text-indigo-300" />;
    case 'Cloud': return <Cloud className="w-5 h-5 text-slate-300" />;
    case 'CloudFog': return <CloudFog className="w-5 h-5 text-teal-300" />;
    case 'CloudDrizzle': return <CloudDrizzle className="w-5 h-5 text-sky-300" />;
    case 'CloudRain': return <CloudRain className="w-5 h-5 text-sky-400" />;
    case 'CloudRainWind': return <CloudRainWind className="w-5 h-5 text-sky-400" />;
    case 'CloudSnow': return <CloudSnow className="w-5 h-5 text-sky-200" />;
    case 'Snowflake': return <Snowflake className="w-5 h-5 text-cyan-200" />;
    case 'CloudLightning': return <CloudLightning className="w-5 h-5 text-purple-400" />;
    case 'Zap': return <Zap className="w-5 h-5 text-rose-400" />;
    default: return <Sun className="w-5 h-5 text-amber-400" />;
  }
};

export const WeeklyForecast: React.FC = () => {
  const { forecast } = useWeather();
  const { settings } = useSettings();

  if (!forecast) return null;
  const days = processDailyForecast(forecast);

  // Overall min and max across all 7 days for the temperature range sliders
  const allMins = days.map(d => d.tempMin);
  const allMaxs = days.map(d => d.tempMax);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const totalSpan = Math.max(1, globalMax - globalMin);

  return (
    <div className="rounded-3xl p-5 md:p-6 bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm md:text-base font-bold text-slate-100 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky-400" />
          <span>7-Day Synoptic Forecast</span>
        </h2>
        <span className="text-xs text-slate-400 font-mono">
          Weekly Span {formatTemperature(globalMin, settings.tempUnit)} - {formatTemperature(globalMax, settings.tempUnit)}
        </span>
      </div>

      <div className="divide-y divide-white/5 space-y-1">
        {days.map((day) => {
          const condition = getWeatherCondition(day.weatherCode, true);

          // Calculate offset percentages for temperature range visualization bar
          const leftPercent = Math.max(0, ((day.tempMin - globalMin) / totalSpan) * 100);
          const rightPercent = Math.min(100, ((day.tempMax - globalMin) / totalSpan) * 100);
          const widthPercent = Math.max(6, rightPercent - leftPercent);

          return (
            <div
              key={day.date}
              className="pt-2.5 pb-2 flex items-center justify-between gap-3 text-xs md:text-sm hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
            >
              {/* Day Name & Date */}
              <div className="w-24 shrink-0">
                <div className="font-semibold text-slate-100">{day.dayName}</div>
                <div className="text-[10px] text-slate-400">{day.formattedDate}</div>
              </div>

              {/* Weather Icon and Rain probability */}
              <div className="flex items-center gap-2.5 w-24 shrink-0">
                <DailyIcon iconName={condition.iconName} />
                {day.precipitationProbability > 0 ? (
                  <span className="flex items-center gap-0.5 text-[11px] font-medium text-sky-400">
                    <Droplets className="w-2.5 h-2.5" />
                    <span>{day.precipitationProbability}%</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 font-light">0%</span>
                )}
              </div>

              {/* Min Temp */}
              <span className="w-10 text-right text-xs font-medium text-slate-400">
                {formatTemperature(day.tempMin, settings.tempUnit)}
              </span>

              {/* Horizontal Temperature Bar */}
              <div className="flex-1 max-w-[160px] h-2 bg-slate-800/80 rounded-full relative overflow-hidden mx-1">
                <div
                  className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`
                  }}
                />
              </div>

              {/* Max Temp */}
              <span className="w-10 text-left text-xs font-bold text-slate-100">
                {formatTemperature(day.tempMax, settings.tempUnit)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
