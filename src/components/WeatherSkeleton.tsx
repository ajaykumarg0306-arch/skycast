import React from 'react';

export const WeatherSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero Card Skeleton */}
      <div className="rounded-3xl border border-white/20 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 sm:p-8 h-64 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="h-8 w-48 bg-slate-300/60 dark:bg-slate-800 rounded-xl" />
          <div className="h-4 w-32 bg-slate-200/60 dark:bg-slate-800/60 rounded-md" />
        </div>
        <div className="flex items-end justify-between">
          <div className="h-16 w-36 bg-slate-300/60 dark:bg-slate-800 rounded-2xl" />
          <div className="h-20 w-20 bg-slate-300/40 dark:bg-slate-800/40 rounded-full" />
        </div>
      </div>

      {/* Details Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl border border-white/20 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 h-28 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <div className="h-3 w-16 bg-slate-200/70 dark:bg-slate-800/70 rounded-md" />
              <div className="h-4 w-4 bg-slate-200/70 dark:bg-slate-800/70 rounded-full" />
            </div>
            <div className="space-y-1.5">
              <div className="h-6 w-20 bg-slate-300/70 dark:bg-slate-800 rounded-md" />
              <div className="h-3 w-28 bg-slate-200/50 dark:bg-slate-800/50 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* 24-Hour Strip Skeleton */}
      <div className="rounded-3xl border border-white/20 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 p-6 h-48 flex flex-col justify-between">
        <div className="h-5 w-40 bg-slate-300/60 dark:bg-slate-800 rounded-md" />
        <div className="flex gap-3 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="min-w-[80px] h-28 rounded-2xl bg-slate-200/40 dark:bg-slate-800/40 shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
