import React from 'react';
import { CloudAlert, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="rounded-3xl border border-rose-200/80 dark:border-rose-900/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg p-8 sm:p-12 text-center max-w-lg mx-auto my-8">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 mx-auto flex items-center justify-center mb-4">
        <CloudAlert className="w-7 h-7" />
      </div>

      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
        Unable to Load Weather Report
      </h2>

      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
        {message || 'An unexpected issue occurred while connecting to the meteorological services.'}
      </p>

      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    </div>
  );
};
