import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudDrizzle,
  CloudRain, CloudSnow, Snowflake, CloudRainWind, CloudLightning,
  Zap, Star, MapPin
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { formatTemperature, getTemperatureUnitSymbol } from '../../utils/formatters';
import { getWeatherCondition } from '../../utils/weatherConditions';

const WeatherIconComponent: React.FC<{ iconName: string; className?: string }> = ({
  iconName,
  className = 'w-16 h-16'
}) => {
  switch (iconName) {
    case 'Sun': return <Sun className={`${className} text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]`} />;
    case 'Moon': return <Moon className={`${className} text-amber-100 drop-shadow-[0_0_12px_rgba(254,240,138,0.7)]`} />;
    case 'SunDim': return <Sun className={`${className} text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]`} />;
    case 'MoonStar': return <Moon className={`${className} text-amber-100 drop-shadow-[0_0_12px_rgba(254,240,138,0.7)]`} />;
    case 'CloudSun': return <CloudSun className={`${className} text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]`} />;
    case 'CloudMoon': return <CloudMoon className={`${className} text-amber-100 drop-shadow-[0_0_12px_rgba(254,240,138,0.6)]`} />;
    case 'Cloud': return <Cloud className={`${className} text-slate-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]`} />;
    case 'CloudFog': return <CloudFog className={`${className} text-teal-200 drop-shadow-[0_0_10px_rgba(153,246,228,0.4)]`} />;
    case 'CloudDrizzle': return <CloudDrizzle className={`${className} text-sky-300 drop-shadow-[0_0_10px_rgba(125,211,252,0.4)]`} />;
    case 'CloudRain': return <CloudRain className={`${className} text-sky-300 drop-shadow-[0_0_10px_rgba(125,211,252,0.5)]`} />;
    case 'CloudRainWind': return <CloudRainWind className={`${className} text-sky-300 drop-shadow-[0_0_10px_rgba(125,211,252,0.5)]`} />;
    case 'CloudSnow': return <CloudSnow className={`${className} text-sky-100 drop-shadow-[0_0_10px_rgba(224,242,254,0.5)]`} />;
    case 'Snowflake': return <Snowflake className={`${className} text-cyan-200 drop-shadow-[0_0_10px_rgba(165,243,252,0.5)]`} />;
    case 'CloudLightning': return <CloudLightning className={`${className} text-purple-300 drop-shadow-[0_0_12px_rgba(216,180,254,0.6)]`} />;
    case 'Zap': return <Zap className={`${className} text-rose-300 drop-shadow-[0_0_12px_rgba(253,164,175,0.6)]`} />;
    default: return <Sun className={`${className} text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]`} />;
  }
};

export const CurrentWeather: React.FC = () => {
  const { location, forecast, isFavorite, addFavorite, removeFavorite, requestGeolocation, geoLoading } = useWeather();
  const { settings } = useSettings();

  if (!forecast || !forecast.current) return null;

  const current = forecast.current;
  const condition = getWeatherCondition(current.weather_code, current.is_day);
  const isFav = isFavorite(location.id);

  const todayMin = forecast.daily?.temperature_2m_min?.[0];
  const todayMax = forecast.daily?.temperature_2m_max?.[0];

  const toggleFav = () => {
    if (isFav) {
      removeFavorite(location.id);
    } else {
      addFavorite(location);
    }
  };

  const rawTempNumber = Math.round(current.temperature_2m);
  const tempUnitSym = getTemperatureUnitSymbol(settings.tempUnit);

  const formatMinMax = () => {
    if (todayMax === undefined || todayMin === undefined) return null;
    const maxVal = Math.round(todayMax);
    const minVal = Math.round(todayMin);
    return `${maxVal}°/${minVal}°${tempUnitSym}`;
  };

  return (
    <motion.div
      className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center select-none"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* 1. Minimal Top Location Header (Matching Reference Image) */}
      <div className="w-full flex items-center justify-between px-2 mb-6">
        {/* Location Pin GPS Trigger */}
        <button
          type="button"
          onClick={requestGeolocation}
          disabled={geoLoading}
          className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          title="Detect current location"
          aria-label="Detect current location"
        >
          <MapPin className={`w-5 h-5 ${geoLoading ? 'animate-bounce text-sky-300' : ''}`} />
        </button>

        {/* City Name */}
        <div className="flex flex-col items-center">
          <motion.h1
            className="text-2xl sm:text-3xl font-bold text-white tracking-wide"
            style={{ textShadow: '0 2px 14px rgba(0,0,0,0.65)' }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {location.name}
          </motion.h1>
          {location.admin1 && (
            <span
              className="text-xs text-white/60 font-medium tracking-wide -mt-0.5"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
            >
              {location.admin1}, {location.country_code || location.country}
            </span>
          )}
        </div>

        {/* Favorite Star / Quick Action */}
        <button
          type="button"
          onClick={toggleFav}
          className={`p-2 rounded-full transition-all active:scale-90 ${
            isFav
              ? 'text-amber-400 bg-amber-400/10'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
          title={isFav ? 'Saved in favorites' : 'Add to favorite cities'}
          aria-label={isFav ? 'Saved in favorites' : 'Add to favorite cities'}
        >
          <Star className={`w-5 h-5 ${isFav ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* 2. Soothing Weather Icon */}
      <motion.div
        key={condition.iconName}
        className="my-2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <WeatherIconComponent
          iconName={condition.iconName}
          className="w-16 h-16 sm:w-20 sm:h-20 animate-float"
        />
      </motion.div>

      {/* 3. Big Minimalist Temperature (e.g. "32°C") */}
      <div className="flex items-start justify-center mt-1">
        <AnimatePresence mode="wait">
          <motion.span
            key={rawTempNumber + settings.tempUnit}
            className="text-7xl sm:text-8xl font-normal text-white tracking-tight leading-none"
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            {rawTempNumber}
          </motion.span>
        </AnimatePresence>
        <span
          className="text-3xl sm:text-4xl font-light text-white/85 ml-1 mt-1"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.45)' }}
        >
          {tempUnitSym}
        </span>
      </div>

      {/* 4. Weather Condition Label (e.g. "Partly Cloudy") */}
      <motion.p
        className="mt-2 text-xl font-medium text-white/95 tracking-wide"
        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.55)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {condition.label}
      </motion.p>

      {/* 5. Minimalist High / Low (e.g. "39°/25°C") */}
      {formatMinMax() && (
        <motion.p
          className="mt-1 text-sm font-medium text-white/75 tracking-wider"
          style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {formatMinMax()}
        </motion.p>
      )}

      {/* 6. Subtle Feels-like tag */}
      <motion.p
        className="mt-1 text-xs text-white/55 tracking-wide"
        style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        Feels like {formatTemperature(current.apparent_temperature, settings.tempUnit)}
      </motion.p>
    </motion.div>
  );
};
