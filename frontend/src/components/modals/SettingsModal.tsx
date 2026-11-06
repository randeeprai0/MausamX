import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { 
  Settings, X, Thermometer, Wind, Gauge, Droplets, 
  RotateCcw, Eye 
} from 'lucide-react';
import { TempUnit, WindSpeedUnit, PressureUnit, PrecipitationUnit } from '../../types/settings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    settings, 
    setTempUnit, 
    setWindSpeedUnit, 
    setPressureUnit, 
    setPrecipitationUnit, 
    setAutoRefreshInterval,
    setReducedMotion,
    resetSettings 
  } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 id="settings-title" className="text-base font-bold text-white">
                Application Preferences
              </h2>
              <p className="text-xs text-slate-400">Customize units, telemetry interval, and visual appearance</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Temperature Unit */}
          <div className="space-y-2">
            <label className="font-bold text-slate-200 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-sky-400" />
              <span>Temperature Scale</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'celsius', label: 'Celsius (°C)' },
                { id: 'fahrenheit', label: 'Fahrenheit (°F)' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTempUnit(opt.id as TempUnit)}
                  className={`py-2 px-3 rounded-xl font-semibold border transition-all ${
                    settings.tempUnit === opt.id
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Wind Speed Unit */}
          <div className="space-y-2">
            <label className="font-bold text-slate-200 flex items-center gap-2">
              <Wind className="w-4 h-4 text-emerald-400" />
              <span>Wind Velocity Unit</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'kmh', label: 'km/h' },
                { id: 'mph', label: 'mph' },
                { id: 'ms', label: 'm/s' },
                { id: 'kn', label: 'knots' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setWindSpeedUnit(opt.id as WindSpeedUnit)}
                  className={`py-2 px-2 text-center rounded-xl font-semibold border transition-all ${
                    settings.windSpeedUnit === opt.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pressure Unit */}
          <div className="space-y-2">
            <label className="font-bold text-slate-200 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-indigo-400" />
              <span>Barometric Pressure Unit</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'hPa', label: 'hPa (mbar)' },
                { id: 'inHg', label: 'inHg' },
                { id: 'mmHg', label: 'mmHg' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPressureUnit(opt.id as PressureUnit)}
                  className={`py-2 px-3 text-center rounded-xl font-semibold border transition-all ${
                    settings.pressureUnit === opt.id
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Precipitation Unit */}
          <div className="space-y-2">
            <label className="font-bold text-slate-200 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Precipitation Depth Unit</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'mm', label: 'Millimeters (mm)' },
                { id: 'inch', label: 'Inches (in)' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPrecipitationUnit(opt.id as PrecipitationUnit)}
                  className={`py-2 px-3 rounded-xl font-semibold border transition-all ${
                    settings.precipitationUnit === opt.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Refresh */}
          <div className="space-y-2">
            <label className="font-bold text-slate-200 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Auto-Telemetry Synchronization</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { val: 0, label: 'Manual' },
                { val: 5, label: '5 min' },
                { val: 15, label: '15 min' },
                { val: 30, label: '30 min' }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setAutoRefreshInterval(opt.val)}
                  className={`py-2 px-2 text-center rounded-xl font-semibold border transition-all ${
                    settings.autoRefreshInterval === opt.val
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reduced Motion Accessibility */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                <span>Reduced Motion</span>
              </span>
              <p className="text-[11px] text-slate-400">Minimize ambient animations for accessibility</p>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={e => setReducedMotion(e.target.checked)}
              className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 bg-slate-800 border-slate-700"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-slate-950 flex items-center justify-between">
          <button
            type="button"
            onClick={resetSettings}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
          >
            Reset to Defaults
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition-colors shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
