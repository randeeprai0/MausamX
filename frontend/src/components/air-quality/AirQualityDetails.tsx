import React from 'react';
import { useWeather } from '../../context/WeatherContext';

interface PollutantRow {
  name: string;
  chemical: string;
  value?: number;
  unit: string;
  limit: number;
  description: string;
}

export const AirQualityDetails: React.FC = () => {
  const { airQuality } = useWeather();

  if (!airQuality || !airQuality.current) return null;

  const current = airQuality.current;

  const pollutants: PollutantRow[] = [
    {
      name: 'Fine Particulate Matter',
      chemical: 'PM2.5',
      value: current.pm2_5,
      unit: 'µg/m³',
      limit: 25,
      description: 'Tiny inhalable particles originating from combustion, vehicular exhaust and industry.'
    },
    {
      name: 'Coarse Particulates',
      chemical: 'PM10',
      value: current.pm10,
      unit: 'µg/m³',
      limit: 50,
      description: 'Dust, pollen, mold spores and larger airborne particulate matter.'
    },
    {
      name: 'Nitrogen Dioxide',
      chemical: 'NO₂',
      value: current.nitrogen_dioxide,
      unit: 'µg/m³',
      limit: 40,
      description: 'Emitted from road transport and power plants, inflaming airways.'
    },
    {
      name: 'Surface Ozone',
      chemical: 'O₃',
      value: current.ozone,
      unit: 'µg/m³',
      limit: 100,
      description: 'Formed through photochemical reactions between sunlight and volatile organics.'
    },
    {
      name: 'Carbon Monoxide',
      chemical: 'CO',
      value: current.carbon_monoxide,
      unit: 'µg/m³',
      limit: 10000,
      description: 'Odorless toxic gas resulting from incomplete fuel burning.'
    },
    {
      name: 'Sulphur Dioxide',
      chemical: 'SO₂',
      value: current.sulphur_dioxide,
      unit: 'µg/m³',
      limit: 20,
      description: 'Produced by industrial fossil fuels processing and smelting.'
    }
  ];

  return (
    <div className="rounded-3xl p-5 md:p-6 bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm md:text-base font-bold text-slate-100">
          Atmospheric Chemical Breakdown
        </h3>
        <span className="text-xs text-slate-400">WHO Guideline Limits</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {pollutants.map((item) => {
          const val = item.value ?? 0;
          const ratio = Math.min(100, Math.round((val / item.limit) * 100));
          const isHigh = ratio > 100;
          const isElevated = ratio > 70;

          return (
            <div key={item.chemical} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-100 text-xs">
                    <span>{item.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-sky-300 font-mono">
                      {item.chemical}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-slate-100">
                    {item.value !== undefined ? item.value.toFixed(1) : '--'}
                    <span className="text-[10px] font-normal text-slate-400 ml-1">{item.unit}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Target: &lt;{item.limit}</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isHigh ? 'bg-rose-500' : isElevated ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.max(5, Math.min(100, ratio))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

