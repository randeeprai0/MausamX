import React from 'react';
import { SearchBar } from '../common/SearchBar';
import { UnitToggle } from '../common/UnitToggle';
import { ThemeToggle } from '../common/ThemeToggle';
import { useWeather } from '../../context/WeatherContext';
import { 
  CloudSun, Navigation, Star, Settings, Loader2 
} from 'lucide-react';

interface HeaderProps {
  onOpenFavorites: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenFavorites, onOpenSettings }) => {
  const { 
    requestGeolocation, 
    geoLoading, 
    favorites 
  } = useWeather();

  return (
    <header className="sticky top-0 z-30 w-full bg-black/10 backdrop-blur-sm border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2.5 cursor-pointer select-none">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-500 via-sky-400 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 border border-white/20">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">MAUSAM <span className="text-sky-400">X</span></span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  SMART
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 tracking-wide hidden sm:block">
                Atmospheric Intelligence
              </p>
            </div>
          </div>

          {/* Mobile Right Quick Action Icons */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              type="button"
              onClick={requestGeolocation}
              disabled={geoLoading}
              className="p-2 rounded-xl bg-black/20 border border-white/10 text-white/80 hover:text-white"
              title="Detect current location"
              aria-label="Detect current location"
            >
              {geoLoading ? <Loader2 className="w-4 h-4 animate-spin text-sky-400" /> : <Navigation className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onOpenFavorites}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white relative"
              title="Saved cities"
              aria-label="Saved cities"
            >
              <Star className="w-4 h-4" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 font-bold rounded-full text-[9px] flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-black/20 border border-white/10 text-white/80 hover:text-white"
              title="Settings"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Autocomplete Search Bar */}
        <div className="w-full md:flex-1 max-w-lg">
          <SearchBar />
        </div>

        {/* Desktop Controls Suite */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Current Geolocation Button */}
          <button
            type="button"
            onClick={requestGeolocation}
            disabled={geoLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50"
            title="Locate via GPS"
            aria-label="Locate via GPS"
          >
            {geoLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
            ) : (
              <Navigation className="w-3.5 h-3.5 text-sky-400" />
            )}
            <span>Current GPS</span>
          </button>

          {/* Favorites modal trigger */}
          <button
            type="button"
            onClick={onOpenFavorites}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all shadow-sm active:scale-95 relative"
            title="Favorite Cities"
            aria-label="Favorite Cities"
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>Saved</span>
            {favorites.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Unit Toggle */}
          <UnitToggle />

          {/* Theme Selector */}
          <ThemeToggle />

          {/* Settings Trigger */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-all shadow-sm active:scale-95"
            title="App Settings"
            aria-label="App Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
