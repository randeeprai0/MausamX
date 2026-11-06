import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { processHourlyForecast } from '../../services/weatherApi';
import { formatTemperature } from '../../utils/formatters';
import { getWeatherCondition } from '../../utils/weatherConditions';
import {
  Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudDrizzle,
  CloudRain, CloudSnow, Snowflake, CloudRainWind, CloudLightning, Zap
} from 'lucide-react';

const HourlyIcon: React.FC<{ iconName: string }> = ({ iconName }) => {
  switch (iconName) {
    case 'Sun': return <Sun className="w-5 h-5 text-amber-300" />;
    case 'Moon': return <Moon className="w-5 h-5 text-amber-100" />;
    case 'SunDim': return <Sun className="w-5 h-5 text-amber-300" />;
    case 'MoonStar': return <Moon className="w-5 h-5 text-amber-100" />;
    case 'CloudSun': return <CloudSun className="w-5 h-5 text-amber-300" />;
    case 'CloudMoon': return <CloudMoon className="w-5 h-5 text-amber-100" />;
    case 'Cloud': return <Cloud className="w-5 h-5 text-slate-300" />;
    case 'CloudFog': return <CloudFog className="w-5 h-5 text-teal-300" />;
    case 'CloudDrizzle': return <CloudDrizzle className="w-5 h-5 text-sky-300" />;
    case 'CloudRain': return <CloudRain className="w-5 h-5 text-sky-400" />;
    case 'CloudRainWind': return <CloudRainWind className="w-5 h-5 text-sky-400" />;
    case 'CloudSnow': return <CloudSnow className="w-5 h-5 text-sky-200" />;
    case 'Snowflake': return <Snowflake className="w-5 h-5 text-cyan-200" />;
    case 'CloudLightning': return <CloudLightning className="w-5 h-5 text-purple-400" />;
    case 'Zap': return <Zap className="w-5 h-5 text-rose-400" />;
    default: return <Sun className="w-5 h-5 text-amber-300" />;
  }
};

export const HourlyForecast: React.FC = () => {
  const { forecast } = useWeather();
  const { settings } = useSettings();

  if (!forecast) return null;
  const items = processHourlyForecast(forecast);

  return (
    <div
      className="w-full max-w-5xl mx-auto rounded-t-[32px] transition-all select-none"
      style={{
        background: 'rgba(7, 16, 32, 0.65)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.35)',
      }}
    >
      {/* 1. Pill grab handle matching reference image */}
      <div className="pt-2 pb-1 flex justify-center">
        <div className="w-10 h-1 rounded-full bg-white/25 hover:bg-white/40 transition-colors" />
      </div>

      {/* 2. Scroll strip with Time, Icon, Label, and Temp */}
      <div
        className="flex overflow-x-auto scrollbar-none snap-x snap-mandatory px-3 py-2 pb-4 gap-2"
        tabIndex={0}
        aria-label="Hourly weather timeline"
      >
        {items.map((item, idx) => {
          const condition = getWeatherCondition(
            item.weatherCode,
            new Date(item.time).getHours() >= 6 && new Date(item.time).getHours() < 19
          );

          // Short condition label (e.g. "Clear", "Cloudy", "Rain")
          const shortLabel = condition.label.split(' ')[0];

          return (
            <div
              key={`${item.time}-${idx}`}
              className={`flex-none w-[68px] snap-start rounded-2xl flex flex-col items-center justify-between gap-1.5 py-2.5 px-1 transition-all ${
                item.isCurrentHour
                  ? 'bg-white/15 ring-1 ring-white/35 shadow-lg shadow-black/20'
                  : 'hover:bg-white/10'
              }`}
            >
              {/* Time (e.g. 8:00PM) */}
              <span
                className={`text-[11px] tracking-tight leading-none ${
                  item.isCurrentHour ? 'text-white font-bold' : 'text-white/65 font-medium'
                }`}
              >
                {item.formattedTime}
              </span>

              {/* Weather Icon */}
              <div className="my-0.5">
                <HourlyIcon iconName={condition.iconName} />
              </div>

              {/* Condition Label (e.g. Clear, Cloudy) - exactly like reference image */}
              <span className="text-[10px] text-white/70 font-medium leading-none truncate max-w-[60px]">
                {shortLabel}
              </span>

              {/* Temperature */}
              <span
                className={`text-xs font-semibold leading-none ${
                  item.isCurrentHour ? 'text-white' : 'text-white/85'
                }`}
              >
                {formatTemperature(item.temperature, settings.tempUnit)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
