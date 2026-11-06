import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { analyzeBestOutdoorTime } from '../../utils/recommendations';
import { formatTemperature } from '../../utils/formatters';
import { Sparkles, Activity } from 'lucide-react';

export const OutdoorActivity: React.FC = () => {
  const { forecast } = useWeather();
  const { settings } = useSettings();

  if (!forecast) return null;

  const analysis = analyzeBestOutdoorTime(forecast);

  return (
    <div className="rounded-3xl p-5 md:p-6 bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-sm md:text-base font-bold text-slate-100 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Optimal Outdoor Activity Windows</span>
        </h2>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Peak Window:</span>
          <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
            {analysis.bestWindow}
          </span>
        </div>
      </div>

      {/* Main summary message */}
      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300 leading-relaxed">
          {analysis.recommendation}
        </p>
      </div>

      {/* Hourly Comfort Timeline Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
        {analysis.hourlyScores.slice(0, 6).map((item) => (
          <div
            key={item.timeStr}
            className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-between text-center gap-2 hover:border-white/15 transition-all"
          >
            <div className="text-[11px] font-semibold text-slate-400">{item.formattedHour}</div>

            {/* Score Ring / Pill */}
            <div className="flex flex-col items-center">
              <span className={`text-xl font-black ${item.color}`}>
                {item.score}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${item.color}`}>
                {item.label}
              </span>
            </div>

            <div className="text-xs font-semibold text-slate-200">
              {formatTemperature(item.temperature, settings.tempUnit)}
            </div>

            <div className="text-[10px] text-slate-400 line-clamp-1" title={item.reason}>
              {item.reason}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
