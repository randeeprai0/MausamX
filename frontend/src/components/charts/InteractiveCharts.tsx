import React, { useState } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { formatTemperatureValue, getTemperatureUnitSymbol } from '../../utils/formatters';
import { Thermometer, Droplets, Wind, Calendar, BarChart3 } from 'lucide-react';

export const InteractiveCharts: React.FC = () => {
  const { forecast } = useWeather();
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState<'temp' | 'precip' | 'wind' | 'weekly'>('temp');

  if (!forecast || !forecast.hourly) return null;

  const hourly = forecast.hourly;
  const count = Math.min(24, hourly.time.length);

  // Hourly dataset (24h)
  const hourlyData = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(hourly.time[i]);
    const formattedHour = d.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    const rawTemp = hourly.temperature_2m[i];
    const displayTemp = formatTemperatureValue(rawTemp, settings.tempUnit);
    const rainProb = hourly.precipitation_probability[i] || 0;
    const precip = hourly.precipitation[i] || 0;
    const wind = Math.round(hourly.wind_speed_10m[i] || 0);

    hourlyData.push({
      time: formattedHour,
      temp: displayTemp,
      rawTemp,
      rainProb,
      precip,
      wind
    });
  }

  // Weekly dataset (7 days)
  const daily = forecast.daily;
  const weeklyData = [];
  if (daily && daily.time) {
    const dayCount = Math.min(7, daily.time.length);
    for (let i = 0; i < dayCount; i++) {
      const d = new Date(daily.time[i] + 'T00:00:00');
      const dayName = i === 0 ? 'Today' : d.toLocaleDateString([], { weekday: 'short' });
      const minVal = formatTemperatureValue(daily.temperature_2m_min[i], settings.tempUnit);
      const maxVal = formatTemperatureValue(daily.temperature_2m_max[i], settings.tempUnit);

      weeklyData.push({
        day: dayName,
        min: minVal,
        max: maxVal,
        rainProb: daily.precipitation_probability_max[i] || 0
      });
    }
  }

  // Custom glassmorphic tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl bg-slate-900/95 border border-white/15 p-3 shadow-2xl backdrop-blur-xl text-xs space-y-1">
          <p className="font-bold text-slate-200">{label}</p>
          {payload.map((item: any, idx: number) => (
            <p key={idx} className="flex items-center gap-2" style={{ color: item.color }}>
              <span className="font-medium">{item.name}:</span>
              <span className="font-bold">{item.value} {item.unit || ''}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-3xl p-5 md:p-6 bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-5">
      {/* Header and Tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-sm md:text-base font-bold text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-sky-400" />
          <span>Interactive Meteorological Analytics</span>
        </h2>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-2xl border border-white/10 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('temp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'temp'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temperature</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('precip')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'precip'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Precipitation</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wind')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'wind'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wind</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('weekly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'weekly'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Weekly Range</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Container */}
      <div className="h-64 md:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'temp' ? (
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="temp" 
                name="Temperature" 
                unit={getTemperatureUnitSymbol(settings.tempUnit)} 
                stroke="#38bdf8" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#tempGradient)" 
              />
            </AreaChart>
          ) : activeTab === 'precip' ? (
            <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="rainProb" 
                name="Rain Probability" 
                unit="%" 
                fill="#0ea5e9" 
                radius={[6, 6, 0, 0]} 
              />
            </BarChart>
          ) : activeTab === 'wind' ? (
            <LineChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="wind" 
                name="Wind Speed" 
                unit=" km/h" 
                stroke="#10b981" 
                strokeWidth={2.5} 
                dot={{ r: 3, fill: '#10b981' }} 
              />
            </LineChart>
          ) : (
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="max" 
                name="Max Temp" 
                unit={getTemperatureUnitSymbol(settings.tempUnit)} 
                fill="#f43f5e" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="min" 
                name="Min Temp" 
                unit={getTemperatureUnitSymbol(settings.tempUnit)} 
                fill="#38bdf8" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

