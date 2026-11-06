import React from 'react';
import { CloudOff, RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Telemetry Synchronization Error',
  message = 'Unable to establish a stable connection with the meteorological servers. Please verify your connection or retry in a few moments.',
  onRetry
}) => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/80 border border-rose-500/20 backdrop-blur-xl shadow-2xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <CloudOff className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-100">{title}</h2>
          <p className="text-sm text-slate-400 leading-relaxed">{message}</p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all shadow-lg shadow-sky-500/25 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        )}
      </div>
    </div>
  );
};

export const EmptyState: React.FC<{ message?: string; actionText?: string; onAction?: () => void }> = ({
  message = 'No data available to display.',
  actionText,
  onAction
}) => {
  return (
    <div className="p-8 text-center rounded-2xl bg-slate-800/20 border border-white/5 space-y-3">
      <AlertTriangle className="w-6 h-6 text-slate-500 mx-auto" />
      <p className="text-xs text-slate-400">{message}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="text-xs text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-4"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

