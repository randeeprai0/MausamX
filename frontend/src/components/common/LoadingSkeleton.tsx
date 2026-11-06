import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 animate-pulse">
      {/* Hero Current Weather Skeleton */}
      <div className="h-72 rounded-3xl bg-slate-800/40 border border-white/5 p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-slate-700/50 rounded-xl" />
            <div className="h-4 w-32 bg-slate-700/30 rounded-lg" />
          </div>
          <div className="h-16 w-16 bg-slate-700/40 rounded-2xl" />
        </div>
        <div className="flex justify-between items-end">
          <div className="h-20 w-36 bg-slate-700/50 rounded-2xl" />
          <div className="h-5 w-52 bg-slate-700/30 rounded-lg" />
        </div>
      </div>

      {/* Hourly strip skeleton */}
      <div className="h-36 rounded-3xl bg-slate-800/30 border border-white/5 p-4 flex gap-4 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-1 min-w-[70px] h-full bg-slate-700/20 rounded-2xl flex flex-col items-center justify-between py-3">
            <div className="h-3 w-8 bg-slate-700/40 rounded" />
            <div className="h-6 w-6 bg-slate-700/50 rounded-full" />
            <div className="h-4 w-10 bg-slate-700/40 rounded" />
          </div>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-80 rounded-3xl bg-slate-800/30 border border-white/5 p-6" />
          <div className="h-64 rounded-3xl bg-slate-800/30 border border-white/5 p-6" />
        </div>
        <div className="space-y-6">
          <div className="h-96 rounded-3xl bg-slate-800/30 border border-white/5 p-6" />
          <div className="h-48 rounded-3xl bg-slate-800/30 border border-white/5 p-6" />
        </div>
      </div>
    </div>
  );
};

