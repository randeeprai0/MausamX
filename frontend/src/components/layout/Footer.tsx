import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { CloudSun, ExternalLink, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lastUpdated, refetchWeather, isOffline } = useWeather();

  const formattedTime = lastUpdated 
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
    : 'Recently';

  return (
    <footer className="w-full border-t border-white/5 bg-slate-950/80 py-8 px-4 mt-12 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Copyright */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
            <CloudSun className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-200">Mausam X – Smart Weather Experience</div>
            <p className="text-[11px] text-slate-500">
              Commercial-grade meteorological intelligence platform
            </p>
          </div>
        </div>

        {/* Telemetry Status & Manual Sync */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
            <span>
              {isOffline ? 'Offline snapshot' : `Telemetry synced: ${formattedTime}`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => refetchWeather()}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Force refresh weather data"
            aria-label="Force refresh weather data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mandatory API Attributions */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400">
          <span>Attributions:</span>
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 underline underline-offset-2 flex items-center gap-0.5"
          >
            <span>Open-Meteo</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <span>•</span>
          <a
            href="https://www.rainviewer.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 underline underline-offset-2 flex items-center gap-0.5"
          >
            <span>RainViewer</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <span>•</span>
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 underline underline-offset-2 flex items-center gap-0.5"
          >
            <span>OpenStreetMap</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};
