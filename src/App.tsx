/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { HeroCard } from './components/HeroCard';
import { DetailsGrid } from './components/DetailsGrid';
import { HourlyStrip } from './components/HourlyStrip';
import { HourlyChart } from './components/HourlyChart';
import { DailyForecast } from './components/DailyForecast';
import { AiInsightsCard } from './components/AiInsightsCard';
import { FavoritesModal } from './components/FavoritesModal';
import { WeatherSkeleton } from './components/WeatherSkeleton';
import { ErrorMessage } from './components/ErrorMessage';
import { useWeather, LocationTarget } from './hooks/useWeather';
import { useGeolocation } from './hooks/useGeolocation';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TemperatureUnit, SavedLocation } from './types/weather';
import { getAtmosphereBackground } from './utils/weatherCodes';

export default function App() {
  // Persistent Units Preference (°C / °F)
  const [unit, setUnit] = useLocalStorage<TemperatureUnit>('skycast_unit_pref', 'metric');

  // Persistent Theme Preference (dark / light, defaults to system)
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('skycast_theme_pref', () => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Persistent Favorites & Recent Searches
  const [favorites, setFavorites] = useLocalStorage<SavedLocation[]>('skycast_favorites', [
    {
      id: 'sf-preset',
      name: 'San Francisco',
      region: 'CA',
      country: 'United States',
      latitude: 37.7749,
      longitude: -122.4194,
      addedAt: Date.now(),
    },
    {
      id: 'tokyo-preset',
      name: 'Tokyo',
      region: 'Tokyo',
      country: 'Japan',
      latitude: 35.6762,
      longitude: 139.6503,
      addedAt: Date.now(),
    },
    {
      id: 'london-preset',
      name: 'London',
      region: 'England',
      country: 'United Kingdom',
      latitude: 51.5074,
      longitude: -0.1278,
      addedAt: Date.now(),
    },
  ]);

  const [recentSearches, setRecentSearches] = useLocalStorage<LocationTarget[]>('skycast_recent_searches', []);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Apply dark theme class to document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Weather data & location coordinator
  const {
    currentLocation,
    weatherData,
    loading,
    error,
    selectLocation,
    refresh,
    insights,
    loadingInsights,
    insightsError,
    refreshInsightsOnly,
  } = useWeather(unit);

  // Browser Geolocation hook
  const {
    loading: geoLoading,
    error: geoError,
    getCurrentLocation,
    clearError: clearGeoError,
  } = useGeolocation();

  // Atmosphere dynamic background
  const atmosphere = weatherData
    ? getAtmosphereBackground(weatherData.current.category, weatherData.current.is_day)
    : getAtmosphereBackground('clear', 1);

  // Handle "Use my location"
  const handleUseMyLocation = () => {
    getCurrentLocation((lat, lon) => {
      selectLocation({
        name: 'My Location',
        country: '',
        latitude: lat,
        longitude: lon,
      });
    });
  };

  // Add to recent searches
  const handleAddRecentSearch = (loc: LocationTarget) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (item) => Math.abs(item.latitude - loc.latitude) > 0.01 || Math.abs(item.longitude - loc.longitude) > 0.01
      );
      return [loc, ...filtered].slice(0, 8);
    });
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Check if current location is in favorites
  const isCurrentFavorite = favorites.some(
    (f) =>
      Math.abs(f.latitude - currentLocation.latitude) < 0.05 &&
      Math.abs(f.longitude - currentLocation.longitude) < 0.05
  );

  const handleToggleFavorite = () => {
    if (isCurrentFavorite) {
      setFavorites((prev) =>
        prev.filter(
          (f) =>
            Math.abs(f.latitude - currentLocation.latitude) >= 0.05 ||
            Math.abs(f.longitude - currentLocation.longitude) >= 0.05
        )
      );
    } else {
      const newFav: SavedLocation = {
        id: `fav-${Date.now()}`,
        name: weatherData?.location.name || currentLocation.name,
        region: weatherData?.location.region || currentLocation.region,
        country: weatherData?.location.country || currentLocation.country,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        addedAt: Date.now(),
      };
      setFavorites((prev) => [newFav, ...prev]);
    }
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div
      className={`min-h-screen text-slate-900 dark:text-slate-100 bg-gradient-to-br ${atmosphere.bgGradient} transition-colors duration-700 flex flex-col`}
    >
      {/* Top Bar navigation */}
      <Header
        unit={unit}
        onToggleUnit={() => setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'))}
        isDark={theme === 'dark'}
        onToggleDark={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        onSelectPreset={(city) => {
          selectLocation(city);
          handleAddRecentSearch(city);
        }}
        activeLocationName={weatherData?.location.name || currentLocation.name}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Search & Location Bar */}
        <SearchBar
          onSelectLocation={selectLocation}
          onUseMyLocation={handleUseMyLocation}
          geoLoading={geoLoading}
          geoError={geoError}
          onClearGeoError={clearGeoError}
          recentSearches={recentSearches}
          onAddRecentSearch={handleAddRecentSearch}
          onClearRecentSearches={handleClearRecentSearches}
          favorites={favorites}
        />

        {/* Viewport Content States */}
        {loading && !weatherData ? (
          <WeatherSkeleton />
        ) : error && !weatherData ? (
          <ErrorMessage message={error} onRetry={refresh} />
        ) : weatherData ? (
          <div className="space-y-6">
            {/* Top Section: Hero Card + AI Weather Insights Side-by-Side or Stacked */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <HeroCard
                  weather={weatherData}
                  isFavorite={isCurrentFavorite}
                  onToggleFavorite={handleToggleFavorite}
                  onRefresh={handleManualRefresh}
                  isRefreshing={isRefreshing}
                />
              </div>
              <div className="lg:col-span-1">
                <AiInsightsCard
                  insights={insights}
                  loading={loadingInsights}
                  error={insightsError}
                  onRefresh={refreshInsightsOnly}
                  cityName={weatherData.location.name}
                />
              </div>
            </div>

            {/* Middle Section: Atmospheric Details Grid */}
            <DetailsGrid weather={weatherData} />

            {/* Hourly Section: 24-Hour Strip + Recharts Temperature Trend Chart */}
            <div className="space-y-6">
              <HourlyStrip
                hourly={weatherData.hourly}
                tempUnit={weatherData.units.temp}
              />
              <HourlyChart
                hourly={weatherData.hourly}
                tempUnit={weatherData.units.temp}
              />
            </div>

            {/* Bottom Section: 7-Day Forecast */}
            <DailyForecast
              daily={weatherData.daily}
              tempUnit={weatherData.units.temp}
            />
          </div>
        ) : null}
      </main>

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelect={(loc) => {
          selectLocation(loc);
          handleAddRecentSearch(loc);
        }}
        onRemove={handleRemoveFavorite}
      />

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-white/10 py-6 mt-12 bg-white/20 dark:bg-slate-950/20 backdrop-blur-xs text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">SkyCast</span> · Real-time meteorological intelligence powered by Open-Meteo & Gemini AI.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>In-memory 10m cache active</span>
            <span>·</span>
            <span>Zero API keys required for weather</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
