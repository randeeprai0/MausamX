import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { GeoLocation } from '../../types/location';
import { 
  Star, X, Trash2, ArrowRight, Scale 
} from 'lucide-react';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({ isOpen, onClose }) => {
  const { favorites, removeFavorite, setLocation, location: currentLocation } = useWeather();
  const [activeTab, setActiveTab] = useState<'favorites' | 'compare'>('favorites');
  const [selectedForComparison, setSelectedForComparison] = useState<GeoLocation[]>([]);

  if (!isOpen) return null;

  const handleSelectCity = (city: GeoLocation) => {
    setLocation(city);
    onClose();
  };

  const toggleCityForComparison = (city: GeoLocation) => {
    if (selectedForComparison.some(c => c.id === city.id)) {
      setSelectedForComparison(prev => prev.filter(c => c.id !== city.id));
    } else {
      if (selectedForComparison.length >= 3) {
        // limit comparison to 3 cities for optimal layout
        return;
      }
      setSelectedForComparison(prev => [...prev, city]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="favorites-title"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h2 id="favorites-title" className="text-base font-bold text-white">
                Saved Locations & Comparison
              </h2>
              <p className="text-xs text-slate-400">
                Manage your bookmarked cities and compare climate telemetry
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex px-5 pt-3 border-b border-white/5 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'favorites'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Saved Cities ({favorites.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('compare')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'compare'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>City Comparison ({selectedForComparison.length}/3)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'favorites' ? (
            favorites.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Star className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">No favorite cities saved yet</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the star icon on any city card to bookmark it for quick access and offline caching.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {favorites.map((city) => {
                  const isCurrent = city.id === currentLocation.id;
                  return (
                    <div
                      key={city.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        isCurrent
                          ? 'bg-sky-500/15 border-sky-500/40'
                          : 'bg-white/5 border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-slate-100">{city.name}</h3>
                            {isCurrent && (
                              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {city.admin1 ? `${city.admin1}, ` : ''}{city.country || 'Global'}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFavorite(city.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remove bookmark"
                          aria-label={`Remove ${city.name} from favorites`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => toggleCityForComparison(city)}
                          className={`text-xs flex items-center gap-1 font-medium ${
                            selectedForComparison.some(c => c.id === city.id)
                              ? 'text-sky-400'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>
                            {selectedForComparison.some(c => c.id === city.id) ? 'Selected' : 'Compare'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelectCity(city)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-400 px-3 py-1.5 rounded-xl transition-colors shadow-sm"
                        >
                          <span>Switch</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Comparison Tab */
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Select up to 3 saved cities to compare latitude, longitude, and climate details side-by-side.
              </div>

              {selectedForComparison.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <Scale className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-300 font-semibold">No cities selected for comparison</p>
                  <p className="text-[11px] text-slate-500">
                    Switch to the &quot;Saved Cities&quot; tab and tap &quot;Compare&quot; on any favorite city.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedForComparison.map((city) => (
                    <div
                      key={city.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-slate-100">{city.name}</h4>
                          <p className="text-xs text-slate-400">{city.country || 'Global'}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleCityForComparison(city)}
                          className="text-slate-500 hover:text-white"
                          aria-label="Deselect from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300">
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-slate-500">Coordinates:</span>
                          <span className="font-mono text-[11px]">{city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-slate-500">Timezone:</span>
                          <span className="font-mono text-[11px] truncate max-w-[120px]">{city.timezone || 'Auto'}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectCity(city)}
                        className="w-full text-center py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-semibold transition-colors border border-sky-500/30"
                      >
                        View Full Dashboard
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
