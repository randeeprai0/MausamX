import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { getEuropeanAQIInfo, getUSAQIInfo } from '../../utils/formatters';
import { Wind, Info } from 'lucide-react';

export const AirQualityCard: React.FC = () => {
  const { airQuality } = useWeather();
  const [scale, setScale] = useState<'eu' | 'us'>('eu');

  if (!airQuality || !airQuality.current) {
    return (
      <div className="rounded-3xl p-5 md:p-6 bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm md:text-base font-bold text-slate-100 flex items-center gap-2">
            <Wind className="w-4 h-4 text-emerald-400" />
            <span>Air Quality Index</span>
          </h2>
        </div>
        <div className="py-6 text-center text-slate-400 text-xs space-y-1">
          <p className="font-semibold text-slate-300">Air Quality Telemetry Unavailable</p>
          <p className="text-[11px] text-slate-500">
            Atmospheric dispersion station sensors are not currently active for this exact coordinate.
          </p>
        </div>
      </div>
    );
  }

  const current = airQuality.current;
  const euAqi = current.european_aqi ?? 25;
  const usAqi = current.us_aqi ?? Math.round(euAqi * 1.5);

  const activeAqi = scale === 'eu' ? euAqi : usAqi;
  const aqiInfo = scale === 'eu' ? getEuropeanAQIInfo(activeAqi) : getUSAQIInfo(activeAqi);

  return (
    <div className="rounded-3xl p-5 md:p-6 bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
      {/* Header with Scale switcher */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm md:text-base font-bold text-slate-100 flex items-center gap-2">
          <Wind className="w-4 h-4 text-emerald-400" />
          <span>Air Quality Index (AQI)</span>
        </h2>

        {/* Toggle between European AQI & US AQI */}
        <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setScale('eu')}
            className={`px-2 py-0.5 rounded-lg font-semibold transition-all ${
              scale === 'eu'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            European
          </button>
          <button
            type="button"
            onClick={() => setScale('us')}
            className={`px-2 py-0.5 rounded-lg font-semibold transition-all ${
              scale === 'us'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            US EPA
          </button>
        </div>
      </div>

      {/* Main Gauge & Category */}
      <div className={`p-4 rounded-2xl border ${aqiInfo.bgColor} ${aqiInfo.borderColor} flex flex-col md:flex-row items-center justify-between gap-4 transition-colors`}>
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black text-2xl text-white shadow-lg shrink-0"
            style={{ backgroundColor: aqiInfo.color }}
          >
            <span>{Math.round(activeAqi)}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider opacity-90">
              {scale === 'eu' ? 'EU' : 'US'} AQI
            </span>
          </div>

          <div>
            <div className={`text-base font-bold ${aqiInfo.textColor}`}>
              {aqiInfo.category}
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-sm leading-relaxed">
              {aqiInfo.advice}
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 text-right shrink-0">
          Scale: <span className="font-semibold text-slate-200">{scale === 'eu' ? '0 - 100+' : '0 - 500'}</span>
        </div>
      </div>

      {/* Pollutant Bar Overview */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">PM2.5 (Fine)</div>
          <div className="text-sm font-bold text-slate-100 mt-0.5">{current.pm2_5?.toFixed(1) ?? '--'} µg/m³</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Threshold: 25</div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">PM10 (Coarse)</div>
          <div className="text-sm font-bold text-slate-100 mt-0.5">{current.pm10?.toFixed(1) ?? '--'} µg/m³</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Threshold: 50</div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Ozone (O₃)</div>
          <div className="text-sm font-bold text-slate-100 mt-0.5">{current.ozone?.toFixed(1) ?? '--'} µg/m³</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Threshold: 100</div>
        </div>
      </div>

      {/* Non-medical Disclaimer */}
      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1">
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>General air quality guidance based on ambient particulate telemetry. Not medical advice.</span>
      </div>
    </div>
  );
};
