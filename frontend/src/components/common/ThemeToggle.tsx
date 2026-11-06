import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { ThemeMode } from '../../types/settings';
import { Sparkles, Moon, Sun, Monitor, ChevronDown } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { settings, setTheme } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes: Array<{ mode: ThemeMode; label: string; icon: React.ReactNode }> = [
    { mode: 'dynamic', label: 'Dynamic Weather', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { mode: 'dark', label: 'Dark Mode', icon: <Moon className="w-4 h-4 text-indigo-400" /> },
    { mode: 'light', label: 'Light Mode', icon: <Sun className="w-4 h-4 text-yellow-400" /> },
    { mode: 'system', label: 'System Default', icon: <Monitor className="w-4 h-4 text-slate-400" /> },
  ];

  const currentTheme = themes.find(t => t.mode === settings.theme) || themes[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs font-medium text-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/50"
        title="Theme Selector"
        aria-label="Theme Selector"
      >
        {currentTheme.icon}
        <span className="hidden md:inline">{currentTheme.label}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2.5 py-1">
            Display Theme
          </div>
          {themes.map(t => (
            <button
              key={t.mode}
              type="button"
              onClick={() => {
                setTheme(t.mode);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                settings.theme === t.mode
                  ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

