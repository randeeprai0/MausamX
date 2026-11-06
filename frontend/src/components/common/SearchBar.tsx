import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, X, Loader2, History, AlertCircle } from 'lucide-react';
import { GeoLocation } from '../../types/location';
import { searchCities } from '../../services/geocodingApi';
import { useWeather } from '../../context/WeatherContext';
import { getRecentSearches, addRecentSearch } from '../../services/offlineStorage';

export const SearchBar: React.FC = () => {
  const { setLocation } = useWeather();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [recentSearches, setRecentSearches] = useState<GeoLocation[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, [isOpen]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search with AbortController for cancelling outdated requests
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setSelectedIndex(-1);

    // Cancel existing pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const data = await searchCities(trimmed, controller.signal);
        setResults(data);
        setHasSearched(true);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setResults([]);
          setHasSearched(true);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const selectCity = useCallback((loc: GeoLocation) => {
    setLocation(loc);
    addRecentSearch(loc);
    setQuery('');
    setIsOpen(false);
    setResults([]);
    setHasSearched(false);
  }, [setLocation]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const listToNavigate = results.length > 0 ? results : (query.length < 2 ? recentSearches : []);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < listToNavigate.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : listToNavigate.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < listToNavigate.length) {
        selectCity(listToNavigate[selectedIndex]);
      } else if (results.length > 0) {
        selectCity(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearQuery = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search city, region or country..."
          className="w-full pl-10 pr-10 py-2 text-sm bg-slate-900/80 hover:bg-slate-900 focus:bg-slate-950 text-slate-100 placeholder-slate-400 rounded-2xl border border-white/10 focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/30 transition-all outline-none backdrop-blur-md shadow-inner"
          aria-label="Search city worldwide"
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />
        {isLoading ? (
          <Loader2 className="absolute right-3.5 w-4 h-4 text-sky-400 animate-spin" />
        ) : query.length > 0 ? (
          <button
            type="button"
            onClick={clearQuery}
            className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Clear search query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : null}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            <ul className="p-1.5" role="listbox">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Matching Cities ({results.length})
              </div>
              {results.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const region = [item.admin1, item.country].filter(Boolean).join(', ');
                return (
                  <li
                    key={`${item.id}-${idx}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => selectCity(item)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                      isSelected
                        ? 'bg-sky-500/20 text-white font-medium border border-sky-500/30'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-white/5 text-sky-400 shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-100 truncate">{item.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{region || 'Coordinates unavailable'}</div>
                    </div>
                    {item.country_code && (
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                        {item.country_code}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : hasSearched && !isLoading ? (
            <div className="p-6 text-center text-slate-400">
              <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-70" />
              <p className="text-xs font-medium text-slate-300">No matching cities found for &quot;{query}&quot;</p>
              <p className="text-[11px] text-slate-500 mt-1">Check spelling or try searching for a major nearby metropolitan area.</p>
            </div>
          ) : query.length < 2 && recentSearches.length > 0 ? (
            <div className="p-1.5">
              <div className="flex items-center justify-between px-3 py-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3 h-3 text-sky-400" /> Recent Locations
                </span>
              </div>
              <ul role="listbox">
                {recentSearches.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <li
                      key={`recent-${item.id}-${idx}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => selectCity(item)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer text-xs transition-colors ${
                        isSelected
                          ? 'bg-sky-500/20 text-white font-medium border border-sky-500/30'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <History className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div className="flex-1 truncate">
                        <span className="font-medium text-slate-200">{item.name}</span>
                        <span className="text-slate-400 text-[11px] ml-1.5">({item.country || 'Global'})</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="p-5 text-center text-slate-400 text-xs">
              Type at least 2 letters to search any city worldwide...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

