import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { generateSmartInsights } from '../../utils/weatherInsights';
import { 
  CloudRain, TrendingUp, TrendingDown, Wind, SunDim, Sun, Sparkles, Lightbulb 
} from 'lucide-react';

const InsightIcon: React.FC<{ icon: string }> = ({ icon }) => {
  switch (icon) {
    case 'CloudRain': return <CloudRain className="w-5 h-5 text-sky-400" />;
    case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-rose-400" />;
    case 'TrendingDown': return <TrendingDown className="w-5 h-5 text-cyan-400" />;
    case 'Wind': return <Wind className="w-5 h-5 text-emerald-400" />;
    case 'SunDim': return <SunDim className="w-5 h-5 text-amber-400" />;
    case 'Sun': return <Sun className="w-5 h-5 text-amber-400" />;
    case 'Sparkles': return <Sparkles className="w-5 h-5 text-purple-400" />;
    default: return <Lightbulb className="w-5 h-5 text-yellow-400" />;
  }
};

export const WeatherInsights: React.FC = () => {
  const { forecast } = useWeather();
  const { settings } = useSettings();

  if (!forecast) return null;

  const insights = generateSmartInsights(forecast, settings.tempUnit);

  if (insights.length === 0) return null;

  return (
    <div className="rounded-3xl p-5 md:p-6 bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm md:text-base font-bold text-slate-100 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Smart Weather Insights</span>
        </h2>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
          Rule-Based Synthesizer
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {insights.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all ${
              item.importance === 'high'
                ? 'bg-sky-500/10 border-sky-500/30 hover:border-sky-500/50'
                : 'bg-white/5 border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
                <InsightIcon icon={item.icon} />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span>{item.title}</span>
                  {item.importance === 'high' && (
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-extrabold">
                      Priority
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

