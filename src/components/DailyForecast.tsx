import React from 'react';
import { Droplets } from 'lucide-react';
import { DailyForecastItem } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  tempUnit: string;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, tempUnit }) => {
  // Compute overall min and max across all 7 days for relative visual bars
  const allMins = daily.map((d) => d.temp_min);
  const allMaxs = daily.map((d) => d.temp_max);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const tempRange = Math.max(globalMax - globalMin, 1);

  return (
    <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-sm p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          7-Day Outlook
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Weekly forecast, precipitation probability and thermal spectrum
        </p>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {daily.map((day, idx) => {
          // Relative percentage bar math
          const leftPercent = ((day.temp_min - globalMin) / tempRange) * 100;
          const barWidthPercent = Math.max(((day.temp_max - day.temp_min) / tempRange) * 100, 5);

          return (
            <div
              key={`${day.date}-${idx}`}
              className="py-3 sm:py-3.5 flex items-center justify-between gap-3 text-sm transition-colors hover:bg-black/2 dark:hover:bg-white/2 rounded-xl px-2"
            >
              {/* Day Name and Date */}
              <div className="w-24 sm:w-28 shrink-0">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {day.day_name}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                  {day.date.split('-').slice(1).join('/')}
                </div>
              </div>

              {/* Icon & Condition Label */}
              <div className="flex items-center gap-2.5 flex-1 min-w-[120px]">
                <WeatherIcon category={day.category} className="w-5 h-5 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 truncate hidden sm:inline">
                  {day.condition}
                </span>
              </div>

              {/* Rain Chance */}
              <div className="w-16 flex items-center gap-1 text-xs font-mono text-cyan-600 dark:text-cyan-400 shrink-0 justify-end">
                {day.precipitation_probability_max > 0 ? (
                  <>
                    <Droplets className="w-3.5 h-3.5 shrink-0" />
                    <span>{day.precipitation_probability_max}%</span>
                  </>
                ) : (
                  <span className="text-slate-300 dark:text-slate-600 font-sans text-xs">--</span>
                )}
              </div>

              {/* Min Temp */}
              <span className="w-9 text-right text-xs sm:text-sm font-semibold font-mono text-slate-400 dark:text-slate-500 shrink-0 tabular-nums">
                {day.temp_min}°
              </span>

              {/* Temperature Visual Range Bar */}
              <div className="w-24 sm:w-32 h-2 rounded-full bg-slate-200/80 dark:bg-slate-800 relative shrink-0 overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${barWidthPercent}%`,
                  }}
                />
              </div>

              {/* Max Temp */}
              <span className="w-9 text-right text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-white shrink-0 tabular-nums">
                {day.temp_max}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
