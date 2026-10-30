import React from 'react';
import { CloudLightning, Moon, Sun, Star } from 'lucide-react';
import { TemperatureUnit } from '../types/weather';
import { LocationTarget } from '../hooks/useWeather';

interface HeaderProps {
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  onSelectPreset: (loc: LocationTarget) => void;
  activeLocationName: string;
  onOpenFavorites: () => void;
  favoritesCount: number;
}

const PRESET_CITIES: LocationTarget[] = [
  { name: 'San Francisco', region: 'CA', country: 'United States', latitude: 37.7749, longitude: -122.4194 },
  { name: 'London', region: 'England', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Tokyo', region: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
  { name: 'New York', region: 'NY', country: 'United States', latitude: 40.7128, longitude: -74.006 },
  { name: 'Sydney', region: 'NSW', country: 'Australia', latitude: -33.8688, longitude: 151.2093 },
];

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  isDark,
  onToggleDark,
  onSelectPreset,
  activeLocationName,
  onOpenFavorites,
  favoritesCount,
}) => {
  return (
    <header className="w-full border-b border-black/5 dark:border-white/10 backdrop-blur-md bg-white/40 dark:bg-slate-950/40 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <CloudLightning className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            SkyCast
          </span>
        </div>

        {/* Zone 2: Preset Quick-Switch Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium overflow-x-auto no-scrollbar">
          {PRESET_CITIES.map((city) => {
            const isActive = activeLocationName.toLowerCase() === city.name.toLowerCase();
            return (
              <button
                key={city.name}
                onClick={() => onSelectPreset(city)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {city.name}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Interactive Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Favorites shortcut */}
          <button
            onClick={onOpenFavorites}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            aria-label="View saved places"
          >
            <Star className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Favorites</span>
            {favoritesCount > 0 && (
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                ({favoritesCount})
              </span>
            )}
          </button>

          {/* Unit Toggle °C / °F */}
          <button
            onClick={onToggleUnit}
            className="flex items-center px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            aria-label={`Toggle units (currently ${unit === 'metric' ? '°C' : '°F'})`}
            title="Toggle between Celsius and Fahrenheit"
          >
            <span className={unit === 'metric' ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-400'}>°C</span>
            <span className="mx-1 text-slate-300 dark:text-slate-700">/</span>
            <span className={unit === 'imperial' ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-400'}>°F</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
