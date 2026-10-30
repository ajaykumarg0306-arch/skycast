import React from 'react';
import { Star, RefreshCw, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { WeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface HeroCardProps {
  weather: WeatherData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  weather,
  isFavorite,
  onToggleFavorite,
  onRefresh,
  isRefreshing,
}) => {
  const { current, location, units, daily } = weather;
  const todayDaily = daily[0];

  // Format local date and time nicely
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg p-6 sm:p-8 transition-all">
      {/* Background radial glow */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-40 dark:opacity-20"
        style={{
          background:
            current.category === 'clear'
              ? 'radial-gradient(circle, #f59e0b 0%, transparent 70%)'
              : current.category === 'rain'
              ? 'radial-gradient(circle, #0284c7 0%, transparent 70%)'
              : 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* Left Column: Location & Temperature */}
        <div className="flex-1">
          {/* Header Row: Location Title & Actions */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {location.name}
                </h1>
                <button
                  onClick={onToggleFavorite}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star
                    className={`w-5 h-5 transition-transform active:scale-125 ${
                      isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
                    }`}
                  />
                </button>
              </div>

              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                {[location.region, location.country].filter(Boolean).join(', ')}
              </p>
            </div>

            {/* Refresh button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Refresh weather data"
              aria-label="Refresh weather data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-500' : ''}`} />
            </button>
          </div>

          {/* Temperature and Condition Presentation */}
          <div className="mt-6 flex items-baseline gap-4">
            <span className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 dark:text-white font-mono tabular-nums">
              {current.temperature}
              <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-400 dark:text-slate-500 ml-1">
                {units.temp}
              </span>
            </span>

            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200">
                {current.condition}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Feels like {current.feels_like}{units.temp}
              </span>
            </div>
          </div>

          {/* High / Low for Today & Date */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
            {todayDaily && (
              <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-lg font-mono">
                <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                  {todayDaily.temp_max}{units.temp}
                </span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span className="flex items-center text-sky-600 dark:text-sky-400">
                  <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                  {todayDaily.temp_min}{units.temp}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Weather Artwork / Big Icon */}
        <div className="flex sm:flex-col items-center justify-between sm:justify-center p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-white/40 to-white/10 dark:from-white/5 dark:to-transparent border border-white/30 dark:border-white/5 shrink-0 self-stretch sm:self-auto sm:min-w-[180px]">
          <div className="p-3">
            <WeatherIcon
              category={current.category}
              isDay={current.is_day}
              className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md"
            />
          </div>
          <div className="text-right sm:text-center mt-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
              Atmosphere
            </span>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {current.is_day ? 'Daytime' : 'Nighttime'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
