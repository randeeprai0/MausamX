import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { 
  Droplets, Wind, Compass, Gauge, Eye, Sun, Cloud, Thermometer 
} from 'lucide-react';
import { 
  formatWindSpeed, formatPressure, getWindDirectionCardinal, 
  getUVLevel, formatTemperature 
} from '../../utils/formatters';

export const WeatherDetails: React.FC = () => {
  const { forecast } = useWeather();
  const { settings } = useSettings();

  if (!forecast || !forecast.current) return null;

  const current = forecast.current;
  const hourly = forecast.hourly;

  const humidity = current.relative_humidity_2m;
  const windSpeed = current.wind_speed_10m;
  const windGusts = current.wind_gusts_10m;
  const windDir = current.wind_direction_10m;
  const pressure = current.pressure_msl || current.surface_pressure;
  
  // Visibility is typically available in hourly data
  const visibilityMeters = hourly?.visibility?.[0] || 10000;
  const visibilityKm = (visibilityMeters / 1000).toFixed(1);

  // UV index
  const uvVal = hourly?.uv_index?.[0] || forecast.daily?.uv_index_max?.[0] || 0;
  const uvInfo = getUVLevel(uvVal);

  const cloudCover = current.cloud_cover;
  const dewPoint = hourly?.dew_point_2m?.[0] || (current.temperature_2m - ((100 - humidity) / 5));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm md:text-base font-bold text-slate-100 flex items-center gap-2">
          <span>Atmospheric Parameters</span>
        </h2>
        <span className="text-xs text-slate-400">8 Telemetry Sensors</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* 1. Humidity */}
        <div className="rounded-2xl p-4 bg-slate-900/80 border border-white/10 backdrop-blur-xl flex flex-col justify-between hover:border-sky-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Humidity</span>
            <Droplets className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-100">{humidity}%</div>
            <p className="text-[11px] text-slate-400 mt-1">
              {humidity > 70 ? 'High moisture level' : humidity < 30 ? 'Dry air' : 'Comfortable balance'}
            </p>
          </div>
        </div>

        {/* 2. Wind Speed */}
        <div className="rounded-2xl p-4 bg-slate-900/80 border border-white/10 backdrop-blur-xl flex flex-col justify-between hover:border-sky-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Wind Speed</span>
            <Wind className="w-4 h-4 text-sky-300" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-100">
              {formatWindSpeed(windSpeed, settings.windSpeedUnit)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Gusts up to {formatWindSpeed(windGusts, settings.windSpeedUnit)}
            </p>
          </div>
        </div>

        {/* 3. Wind Direction */}
        <div className="rounded-2xl p-4 bg-slate-900/80 border border-white/10 backdrop-blur-xl flex flex-col justify-between hover:border-sky-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Direction</span>
            <Compass className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-slate-100">
                {getWindDirectionCardinal(windDir)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{Math.round(windDir)}° Azimuth</p>
            </div>
            {/* Compass rotating indicator */}
            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <div 
                className="w-0.5 h-6 bg-gradient-to-t from-transparent via-emerald-400 to-emerald-300 transform origin-center transition-transform duration-700"
                style={{ transform: `rotate(${windDir}deg)` }}
              />
            </div>
          </div>
        </div>

        {/* 4. Pressure */}
        <div className="rounded-2xl p-4 bg-slate-900/80 border border-white/10 backdrop-blur-xl flex flex-col justify-between hover:border-sky-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Barometer</span>
            <Gauge className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-100">
              {formatPressure(pressure, settings.pressureUnit)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {pressure > 1013 ? 'High pressure system' : 'Low pressure trough'}
            </p>
          </div>
        </div>

        {/* 5. Visibility */}
        <div className="rounded-2xl p-4 bg-slate-900/80 border border-white/10 backdrop-blur-xl flex flex-col justify-between hover:border-sky-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Visibility</span>
            <Eye className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-100">{visibilityKm} km</div>
            <p className="text-[11px] text-slate-400 mt-1">
              {parseFloat(visibilityKm) >= 10 ? 'Crystal clear horizon' : 'Restricted by haze/mist'}
            </p>
          </div>
        </div>

        {/* 6. UV Index */}
        <div className="rounded-2xl p-4 bg-slate-900/80 border border-white/10 backdrop-blur-xl flex flex-col justify-between hover:border-sky-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">UV Radiation</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-100">{uvVal.toFixed(1)}</span>
              <span className={`text-xs font-bold ${uvInfo.color}`}>{uvInfo.label}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{uvInfo.advice}</p>
          </div>
        </div>

        {/* 7. Cloud Cover */}
        <div className="rounded-2xl p-4 bg-slate-900/80 border border-white/10 backdrop-blur-xl flex flex-col justify-between hover:border-sky-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Cloud Cover</span>
            <Cloud className="w-4 h-4 text-blue-300" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-100">{cloudCover}%</div>
            <p className="text-[11px] text-slate-400 mt-1">
              {cloudCover > 80 ? 'Heavy overcast' : cloudCover > 30 ? 'Scattered clouds' : 'Clear expanse'}
            </p>
          </div>
        </div>

        {/* 8. Dew Point */}
        <div className="rounded-2xl p-4 bg-slate-900/80 border border-white/10 backdrop-blur-xl flex flex-col justify-between hover:border-sky-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Dew Point</span>
            <Thermometer className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-100">
              {formatTemperature(dewPoint, settings.tempUnit)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Condensation temperature threshold
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

