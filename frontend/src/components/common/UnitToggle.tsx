import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export const UnitToggle: React.FC = () => {
  const { settings, setTempUnit } = useSettings();

  return (
    <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-white/10 shadow-inner">
      <button
        type="button"
        onClick={() => setTempUnit('celsius')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
          settings.tempUnit === 'celsius'
            ? 'bg-sky-500 text-white shadow-md'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        aria-label="Switch to Celsius"
      >
        °C
      </button>
      <button
        type="button"
        onClick={() => setTempUnit('fahrenheit')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
          settings.tempUnit === 'fahrenheit'
            ? 'bg-sky-500 text-white shadow-md'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        aria-label="Switch to Fahrenheit"
      >
        °F
      </button>
    </div>
  );
};

