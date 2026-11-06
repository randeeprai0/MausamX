import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { getClothingRecommendations } from '../../utils/recommendations';
import { 
  Shirt, Umbrella, Footprints, Shield, Layers, Wind, Glasses, Sun, Sparkles 
} from 'lucide-react';

const ClothingIcon: React.FC<{ icon: string }> = ({ icon }) => {
  switch (icon) {
    case 'Umbrella': return <Umbrella className="w-5 h-5 text-sky-400" />;
    case 'Footprints': return <Footprints className="w-5 h-5 text-amber-400" />;
    case 'Shield': return <Shield className="w-5 h-5 text-cyan-400" />;
    case 'Layers': return <Layers className="w-5 h-5 text-indigo-400" />;
    case 'Wind': return <Wind className="w-5 h-5 text-teal-400" />;
    case 'Glasses': return <Glasses className="w-5 h-5 text-yellow-400" />;
    case 'Sun': return <Sun className="w-5 h-5 text-amber-400" />;
    default: return <Shirt className="w-5 h-5 text-blue-400" />;
  }
};

export const ClothingRecommendations: React.FC = () => {
  const { forecast } = useWeather();
  const { settings } = useSettings();

  if (!forecast) return null;

  const advice = getClothingRecommendations(forecast, settings.tempUnit);

  return (
    <div className="rounded-3xl p-5 md:p-6 bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm md:text-base font-bold text-slate-100 flex items-center gap-2">
          <Shirt className="w-4 h-4 text-sky-400" />
          <span>Weather-Adaptive Attire Guide</span>
        </h2>
        <span className="text-xs text-sky-400 font-semibold">{advice.summary}</span>
      </div>

      {/* Recommended Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {advice.items.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3 hover:border-sky-500/20 transition-all"
          >
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
              <ClothingIcon icon={item.icon} />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-100 truncate">{item.name}</span>
                {item.required && (
                  <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold">
                    Essential
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1">{item.note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Practical tips */}
      {advice.tips.length > 0 && (
        <div className="pt-2 border-t border-white/5 space-y-1">
          {advice.tips.map((tip, i) => (
            <p key={i} className="text-xs text-slate-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{tip}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
