import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { ShieldCheck, ChevronDown, ChevronUp, BellRing } from 'lucide-react';
import { WeatherAlert } from '../../types/weather';

export const WeatherAlerts: React.FC = () => {
  const { alerts } = useWeather();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!alerts) return null;

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const getSeverityBadge = (severity: WeatherAlert['severity']) => {
    switch (severity) {
      case 'extreme':
        return 'bg-rose-500 text-white font-extrabold animate-pulse';
      case 'severe':
        return 'bg-red-500/20 text-red-400 border border-red-500/40 font-bold';
      case 'moderate':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold';
      case 'minor':
      default:
        return 'bg-sky-500/20 text-sky-400 border border-sky-500/40 font-medium';
    }
  };

  // If no official alerts are active for this region
  if (!alerts.available || alerts.alerts.length === 0) {
    return (
      <div className="rounded-3xl p-4 md:p-5 bg-slate-900/60 border border-white/5 backdrop-blur-xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-200">Official Severe Weather Watches & Warnings</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {alerts.message || 'No active severe weather advisories reported for this coordinates zone.'}
            </p>
          </div>
        </div>

        <span className="text-[10px] text-slate-500 hidden sm:inline font-mono">
          Feed: {alerts.source}
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-5 md:p-6 bg-slate-900/80 border border-red-500/30 backdrop-blur-xl shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm md:text-base font-bold text-red-400 flex items-center gap-2">
          <BellRing className="w-4 h-4 text-red-400 animate-bounce" />
          <span>Severe Weather Advisories ({alerts.alerts.length})</span>
        </h2>
        <span className="text-[10px] text-slate-400 font-mono">
          Source: {alerts.source}
        </span>
      </div>

      <div className="space-y-2.5">
        {alerts.alerts.map((alert) => {
          const isExpanded = expandedId === alert.id;

          return (
            <div
              key={alert.id}
              className="rounded-2xl bg-red-950/20 border border-red-500/30 p-3.5 space-y-2 transition-all"
            >
              <div 
                className="flex items-start justify-between gap-3 cursor-pointer"
                onClick={() => toggleExpand(alert.id)}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded-lg ${getSeverityBadge(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className="font-bold text-slate-100 text-xs md:text-sm">
                      {alert.event}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{alert.headline}</p>
                </div>

                <button
                  type="button"
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                  aria-label="Toggle alert details"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {isExpanded && (
                <div className="pt-2 border-t border-red-500/20 text-xs text-slate-300 space-y-2">
                  {alert.description && (
                    <p className="leading-relaxed whitespace-pre-line text-slate-300/90 font-light">
                      {alert.description}
                    </p>
                  )}
                  {alert.instruction && (
                    <div className="p-2.5 rounded-xl bg-red-900/30 border border-red-500/30 text-amber-200">
                      <strong>Recommended Action:</strong> {alert.instruction}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-400 flex gap-4 pt-1">
                    <span>Effective: {new Date(alert.effective).toLocaleString()}</span>
                    <span>Expires: {new Date(alert.expires).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
