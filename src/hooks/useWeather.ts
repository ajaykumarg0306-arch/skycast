import { useState, useEffect, useCallback, useRef } from 'react';
import { TemperatureUnit, WeatherData, WeatherInsights } from '../types/weather';
import { fetchWeather, fetchInsights } from '../api/client';

export interface LocationTarget {
  name: string;
  region?: string;
  country: string;
  latitude: number;
  longitude: number;
}

// Default initial location: San Francisco, CA
export const DEFAULT_LOCATION: LocationTarget = {
  name: 'San Francisco',
  region: 'California',
  country: 'United States',
  latitude: 37.7749,
  longitude: -122.4194,
};

export function useWeather(units: TemperatureUnit) {
  const [currentLocation, setCurrentLocation] = useState<LocationTarget>(DEFAULT_LOCATION);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [insights, setInsights] = useState<WeatherInsights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState<boolean>(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadWeather = useCallback(
    async (loc: LocationTarget, unitType: TemperatureUnit, showSkeleton: boolean = true) => {
      if (showSkeleton) setLoading(true);
      setError(null);

      try {
        const data = await fetchWeather(
          loc.latitude,
          loc.longitude,
          unitType,
          loc.name,
          loc.region,
          loc.country
        );

        if (isMounted.current) {
          setWeatherData(data);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted.current) {
          const message = err instanceof Error ? err.message : 'Failed to load weather report.';
          setError(message);
          setLoading(false);
        }
      }
    },
    []
  );

  // Trigger AI insights when weatherData changes
  const loadInsights = useCallback(async (data: WeatherData) => {
    setLoadingInsights(true);
    setInsightsError(null);
    try {
      const result = await fetchInsights(data);
      if (isMounted.current) {
        setInsights(result);
        setLoadingInsights(false);
      }
    } catch {
      if (isMounted.current) {
        setInsightsError('Weather insights could not be generated at this time.');
        setLoadingInsights(false);
      }
    }
  }, []);

  // When location or units change, fetch fresh data
  useEffect(() => {
    loadWeather(currentLocation, units, true);
  }, [currentLocation, units, loadWeather]);

  // When weather data loads, fetch insights in background
  useEffect(() => {
    if (weatherData) {
      loadInsights(weatherData);
    }
  }, [weatherData, loadInsights]);

  const selectLocation = useCallback((location: LocationTarget) => {
    setCurrentLocation(location);
  }, []);

  const refresh = useCallback(() => {
    loadWeather(currentLocation, units, false);
    if (weatherData) {
      loadInsights(weatherData);
    }
  }, [currentLocation, units, weatherData, loadWeather, loadInsights]);

  const refreshInsightsOnly = useCallback(() => {
    if (weatherData) {
      loadInsights(weatherData);
    }
  }, [weatherData, loadInsights]);

  return {
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
  };
}
