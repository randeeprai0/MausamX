import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { WifiOff, Clock } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { isOffline, offlineSnapshot, lastUpdated } = useWeather();

  if (!isOffline && !offlineSnapshot) return null;
  if (!isOffline) return null;

  const savedTime = offlineSnapshot?.savedAt 
    ? new Date(offlineSnapshot.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
    : lastUpdated?.toLocaleTimeString() || 'Previously';

  return (
    <div className="bg-amber-500/20 border-b border-amber-500/30 backdrop-blur-md px-4 py-2.5 text-amber-200 text-xs flex items-center justify-between sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-2 max-w-2xl">
        <WifiOff className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
        <span>
          <strong>Offline Mode:</strong> You are currently disconnected. Showing cached weather snapshot for{' '}
          <span className="font-semibold text-white">{offlineSnapshot?.location.name || 'current city'}</span>.
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-amber-300/80 text-[11px] shrink-0">
        <Clock className="w-3.5 h-3.5" />
        <span>Saved {savedTime}</span>
      </div>
    </div>
  );
};

