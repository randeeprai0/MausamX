import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { calculateSunPosition } from '../../utils/formatters';
import { Sunrise, Sunset, Clock, SunMedium } from 'lucide-react';

export const SunriseSunset: React.FC = () => {
  const { forecast } = useWeather();

  if (!forecast || !forecast.daily || !forecast.daily.sunrise || !forecast.daily.sunset) {
    return null;
  }

  const sunriseStr = forecast.daily.sunrise[0];
  const sunsetStr = forecast.daily.sunset[0];
  const currentTimeStr = forecast.current?.time || new Date().toISOString();

  const daylightDurationSeconds = forecast.daily.daylight_duration?.[0] || 0;
  const daylightHours = Math.floor(daylightDurationSeconds / 3600);
  const daylightMinutes = Math.floor((daylightDurationSeconds % 3600) / 60);

  const sunData = calculateSunPosition(currentTimeStr, sunriseStr, sunsetStr);

  // Approximate arc position for SVG:
  // Circle arc parameter from x=20, y=70 to x=180, y=70
  // progress goes 0 to 100%. Angle goes from Math.PI to 0.
  const angleRad = Math.PI - (sunData.progress / 100) * Math.PI;
  const cx = 100;
  const cy = 70;
  const radius = 70;
  const sunX = cx + radius * Math.cos(angleRad);
  const sunY = cy - radius * Math.sin(angleRad);

  return (
    <div className="rounded-3xl p-5 md:p-6 bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm md:text-base font-bold text-slate-100 flex items-center gap-2">
          <SunMedium className="w-4 h-4 text-amber-400" />
          <span>Ephemeris & Solar Transit</span>
        </h2>
        <span className="text-xs text-sky-400 font-medium flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {sunData.daylightRemaining}
        </span>
      </div>

      {/* SVG Solar Arc Indicator */}
      <div className="relative flex flex-col items-center justify-center pt-2">
        <svg viewBox="0 0 200 85" className="w-full max-w-[280px] overflow-visible">
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.3" />
              <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#f97316" stop-opacity="0.3" />
            </linearGradient>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#fbbf24" stop-opacity="1" />
              <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
            </radialGradient>
          </defs>

          {/* Horizon baseline */}
          <line x1="15" y1="70" x2="185" y2="70" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Solar trajectory path */}
          <path
            d="M 30 70 A 70 70 0 0 1 170 70"
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Current Sun position marker */}
          {sunData.isDaytime && (
            <>
              {/* Sun ambient glow */}
              <circle cx={sunX} cy={sunY} r="12" fill="url(#sunGlow)" opacity="0.6" className="animate-pulse" />
              <circle cx={sunX} cy={sunY} r="6" fill="#fef08a" stroke="#f59e0b" strokeWidth="2" />
            </>
          )}

          {/* Moon marker if nighttime */}
          {!sunData.isDaytime && (
            <circle cx="100" cy="70" r="5" fill="#a5b4fc" opacity="0.7" />
          )}
        </svg>

        <div className="text-[11px] font-semibold text-slate-400 mt-1">
          {sunData.isDaytime ? `${sunData.progress}% Solar Day Elapsed` : 'Moonlight Hours'}
        </div>
      </div>

      {/* Sunrise & Sunset Bottom Grid */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/5">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
            <Sunrise className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Sunrise</div>
            <div className="text-sm font-bold text-slate-100">{sunData.formattedSunrise}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/5">
          <div className="p-2 rounded-xl bg-orange-500/15 text-orange-400">
            <Sunset className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Sunset</div>
            <div className="text-sm font-bold text-slate-100">{sunData.formattedSunset}</div>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-slate-400">
        Total Daylight Duration: <span className="font-semibold text-slate-200">{daylightHours}h {daylightMinutes}m</span>
      </div>
    </div>
  );
};
