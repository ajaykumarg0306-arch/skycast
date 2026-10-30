import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Droplets } from 'lucide-react';
import { HourlyForecastItem } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface HourlyStripProps {
  hourly: HourlyForecastItem[];
  tempUnit: string;
}

export const HourlyStrip: React.FC<HourlyStripProps> = ({ hourly, tempUnit }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            24-Hour Forecast
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hourly temperature, conditions & precipitation chance
          </p>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Strip */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth"
      >
        {hourly.map((item, index) => {
          const isCurrent = index === 0;
          return (
            <div
              key={`${item.time}-${index}`}
              className={`flex flex-col items-center justify-between p-3.5 rounded-2xl min-w-[82px] border transition-all ${
                isCurrent
                  ? 'border-sky-500/50 bg-sky-50/70 dark:bg-sky-950/40 shadow-xs'
                  : 'border-white/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-800/40 hover:bg-white/80 dark:hover:bg-slate-800/80'
              }`}
            >
              {/* Time Label */}
              <span
                className={`text-xs font-semibold whitespace-nowrap ${
                  isCurrent
                    ? 'text-sky-600 dark:text-sky-400'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {item.formatted_time}
              </span>

              {/* Weather Icon */}
              <div className="my-2.5">
                <WeatherIcon
                  category={item.category}
                  isDay={item.is_day}
                  className="w-7 h-7"
                />
              </div>

              {/* Temperature */}
              <span className="text-sm font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {item.temperature}{tempUnit}
              </span>

              {/* Precipitation Probability */}
              <div className="mt-2 flex items-center gap-1 text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
                <Droplets className="w-3 h-3" />
                <span>{item.precipitation_probability}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
