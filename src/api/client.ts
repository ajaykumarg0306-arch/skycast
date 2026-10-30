import { GeocodeResult, TemperatureUnit, WeatherData, WeatherInsights } from '../types/weather';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchGeocode(query: string): Promise<GeocodeResult[]> {
  if (!query.trim()) return [];

  const res = await fetch(`/api/geocode?q=${encodeURIComponent(query.trim())}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new ApiError(res.status, errorData.error || `Geocoding request failed with status ${res.status}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchWeather(
  lat: number,
  lon: number,
  units: TemperatureUnit = 'metric',
  name?: string,
  region?: string,
  country?: string
): Promise<WeatherData> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    units,
  });

  if (name) params.append('name', name);
  if (region) params.append('region', region);
  if (country) params.append('country', country);

  const res = await fetch(`/api/weather?${params.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new ApiError(res.status, errorData.error || `Weather request failed with status ${res.status}`);
  }

  return res.json();
}

export async function fetchInsights(weatherData: WeatherData): Promise<WeatherInsights> {
  const res = await fetch('/api/weather/insights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(weatherData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new ApiError(res.status, errorData.error || `Insights generation failed with status ${res.status}`);
  }

  return res.json();
}

export async function checkHealth(): Promise<{ status: string; uptime: number }> {
  const res = await fetch('/api/health');
  if (!res.ok) throw new ApiError(res.status, 'Health check failed');
  return res.json();
}
