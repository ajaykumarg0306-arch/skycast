import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, History, Star, Compass } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { fetchGeocode } from '../api/client';
import { GeocodeResult, SavedLocation } from '../types/weather';
import { LocationTarget } from '../hooks/useWeather';

interface SearchBarProps {
  onSelectLocation: (loc: LocationTarget) => void;
  onUseMyLocation: () => void;
  geoLoading: boolean;
  geoError: string | null;
  onClearGeoError: () => void;
  recentSearches: LocationTarget[];
  onAddRecentSearch: (loc: LocationTarget) => void;
  onClearRecentSearches: () => void;
  favorites: SavedLocation[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectLocation,
  onUseMyLocation,
  geoLoading,
  geoError,
  onClearGeoError,
  recentSearches,
  onAddRecentSearch,
  onClearRecentSearches,
  favorites,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Fetch autocomplete suggestions when debouncedQuery changes
  useEffect(() => {
    let active = true;

    async function loadSuggestions() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const places = await fetchGeocode(debouncedQuery);
        if (active) {
          setResults(places);
          setSelectedIndex(-1);
          setIsLoading(false);
          setIsOpen(true);
        }
      } catch (err) {
        if (active) {
          setResults([]);
          setIsLoading(false);
        }
      }
    }

    loadSuggestions();

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: LocationTarget) => {
    onSelectLocation(loc);
    onAddRecentSearch(loc);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalItems = query.trim() ? results.length : recentSearches.slice(0, 5).length;
    if (totalItems === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
      setIsOpen(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim() && results.length > 0) {
        const target = selectedIndex >= 0 ? results[selectedIndex] : results[0];
        handleSelect({
          name: target.name,
          region: target.admin1,
          country: target.country,
          latitude: target.latitude,
          longitude: target.longitude,
        });
      } else if (!query.trim() && recentSearches.length > 0 && selectedIndex >= 0) {
        handleSelect(recentSearches[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const isFavorite = (lat: number, lon: number) => {
    return favorites.some(
      (f) => Math.abs(f.latitude - lat) < 0.05 && Math.abs(f.longitude - lon) < 0.05
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative z-30" ref={containerRef}>
      <div className="flex items-center gap-2">
        {/* Search input container */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search city or location (e.g., Paris, Tokyo, Seattle)..."
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
            aria-label="Search city or location"
            aria-autocomplete="list"
            aria-controls="location-autocomplete-list"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                inputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Geolocation "Use my location" button */}
        <button
          onClick={onUseMyLocation}
          disabled={geoLoading}
          className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 transition-all shrink-0 cursor-pointer shadow-sm disabled:opacity-50"
          title="Use my current GPS location"
          aria-label="Use my current location"
        >
          {geoLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
          ) : (
            <Compass className="w-4 h-4 text-sky-500" />
          )}
          <span className="hidden sm:inline">My Location</span>
        </button>
      </div>

      {/* Geolocation permission warning banner */}
      {geoError && (
        <div className="mt-2 p-2.5 px-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between gap-2 shadow-xs">
          <span>{geoError}</span>
          <button
            onClick={onClearGeoError}
            className="text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 cursor-pointer"
            aria-label="Dismiss location warning"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Autocomplete / Recent Searches Dropdown */}
      {isOpen && (
        <div
          id="location-autocomplete-list"
          className="absolute left-0 right-0 mt-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-xl overflow-hidden z-50 text-sm"
        >
          {/* Autocomplete Results */}
          {query.trim().length > 0 ? (
            results.length > 0 ? (
              <div className="py-1">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Suggestions
                </div>
                {results.map((place, index) => {
                  const isFav = isFavorite(place.latitude, place.longitude);
                  return (
                    <button
                      key={`${place.id}-${index}`}
                      onClick={() =>
                        handleSelect({
                          name: place.name,
                          region: place.admin1,
                          country: place.country,
                          latitude: place.latitude,
                          longitude: place.longitude,
                        })
                      }
                      className={`w-full text-left px-3.5 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                        selectedIndex === index
                          ? 'bg-sky-50 dark:bg-slate-800 text-sky-900 dark:text-sky-300'
                          : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-900 dark:text-white truncate">
                          {place.name}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {[place.admin1, place.country].filter(Boolean).join(', ')}
                        </span>
                      </div>
                      {isFav && (
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : !isLoading ? (
              <div className="px-4 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                No matching cities found for &quot;{query}&quot;
              </div>
            ) : null
          ) : (
            /* Recent Searches & Favorites Quick Suggestions */
            <div>
              {recentSearches.length > 0 ? (
                <div>
                  <div className="px-3.5 py-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <History className="w-3 h-3" />
                      Recent Searches
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearRecentSearches();
                      }}
                      className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer lowercase"
                    >
                      clear
                    </button>
                  </div>
                  {recentSearches.slice(0, 5).map((loc, idx) => (
                    <button
                      key={`${loc.name}-${loc.latitude}-${idx}`}
                      onClick={() => handleSelect(loc)}
                      className={`w-full text-left px-3.5 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                        selectedIndex === idx
                          ? 'bg-sky-50 dark:bg-slate-800 text-sky-900 dark:text-sky-300'
                          : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-900 dark:text-white truncate">
                          {loc.name}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {[loc.region, loc.country].filter(Boolean).join(', ')}
                        </span>
                      </div>
                      {isFavorite(loc.latitude, loc.longitude) && (
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 text-center text-xs text-slate-400 dark:text-slate-500">
                  Type a city name to explore live conditions and 7-day outlook
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
