import React from 'react';
import { Sparkles, Shirt, Compass, AlertCircle, RefreshCw, Clock } from 'lucide-react';
import { WeatherInsights } from '../types/weather';

interface AiInsightsCardProps {
  insights: WeatherInsights | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  cityName: string;
}

export const AiInsightsCard: React.FC<AiInsightsCardProps> = ({
  insights,
  loading,
  error,
  onRefresh,
  cityName,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-sky-200/50 dark:border-sky-900/40 bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-purple-500/10 dark:from-sky-950/40 dark:via-indigo-950/30 dark:to-slate-900/60 backdrop-blur-md shadow-sm p-5 sm:p-6 transition-all">
      {/* Decorative subtle ambient glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 rounded-full bg-sky-400/10 dark:bg-sky-500/10 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-600 dark:text-sky-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Weather Insights
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI analysis & lifestyle guidance for {cityName}
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-sky-300/40 dark:border-sky-800/40 bg-white/60 dark:bg-slate-800/60 text-sky-700 dark:text-sky-300 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
          title="Regenerate weather insights"
          aria-label="Refresh insights"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Content Body */}
      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin mb-3" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Synthesizing atmospheric telemetry & styling recommendations...
          </span>
        </div>
      ) : error ? (
        <div className="py-4 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : insights ? (
        <div className="space-y-4 relative z-10">
          {/* Headline & Summary */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {insights.headline}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {insights.summary}
            </p>
          </div>

          {/* Structured Guidance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Clothing Advice */}
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-black/5 dark:border-white/5 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <Shirt className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  What to Wear
                </div>
                <div className="text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                  {insights.clothingSuggestion}
                </div>
              </div>
            </div>

            {/* Activity Recommendation */}
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-black/5 dark:border-white/5 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  Activities & Outing
                </div>
                <div className="text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                  {insights.activityRecommendation}
                </div>
              </div>
            </div>
          </div>

          {/* Footer note: Timing & Advisory */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400 border-t border-black/5 dark:border-white/5">
            {insights.bestTimeToGoOut && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-500" />
                <span>Optimal window: {insights.bestTimeToGoOut}</span>
              </div>
            )}
            {insights.advisory && (
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>{insights.advisory}</span>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
