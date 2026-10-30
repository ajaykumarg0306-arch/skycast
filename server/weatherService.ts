import { weatherCache, geocodeCache } from './cache';

export interface GeocodePlace {
  id: number;
  name: string;
  country: string;
  country_code: string;
  region?: string;
  lat: number;
  lon: number;
  timezone?: string;
}

export const WMO_CONDITIONS: Record<number, { label: string; category: string }> = {
  0: { label: 'Clear Sky', category: 'clear' },
  1: { label: 'Mainly Clear', category: 'clear' },
  2: { label: 'Partly Cloudy', category: 'partly_cloudy' },
  3: { label: 'Overcast', category: 'cloudy' },
  45: { label: 'Foggy', category: 'fog' },
  48: { label: 'Depositing Rime Fog', category: 'fog' },
  51: { label: 'Light Drizzle', category: 'drizzle' },
  53: { label: 'Moderate Drizzle', category: 'drizzle' },
  55: { label: 'Dense Drizzle', category: 'drizzle' },
  56: { label: 'Light Freezing Drizzle', category: 'drizzle' },
  57: { label: 'Dense Freezing Drizzle', category: 'drizzle' },
  61: { label: 'Slight Rain', category: 'rain' },
  63: { label: 'Moderate Rain', category: 'rain' },
  65: { label: 'Heavy Rain', category: 'rain' },
  66: { label: 'Light Freezing Rain', category: 'rain' },
  67: { label: 'Heavy Freezing Rain', category: 'rain' },
  71: { label: 'Slight Snow Fall', category: 'snow' },
  73: { label: 'Moderate Snow Fall', category: 'snow' },
  75: { label: 'Heavy Snow Fall', category: 'snow' },
  77: { label: 'Snow Grains', category: 'snow' },
  80: { label: 'Slight Rain Showers', category: 'rain' },
  81: { label: 'Moderate Rain Showers', category: 'rain' },
  82: { label: 'Violent Rain Showers', category: 'rain' },
  85: { label: 'Slight Snow Showers', category: 'snow' },
  86: { label: 'Heavy Snow Showers', category: 'snow' },
  95: { label: 'Thunderstorm', category: 'thunderstorm' },
  96: { label: 'Thunderstorm with Slight Hail', category: 'thunderstorm' },
  99: { label: 'Thunderstorm with Heavy Hail', category: 'thunderstorm' },
};

function getConditionInfo(code: number): { label: string; category: string } {
  return WMO_CONDITIONS[code] || { label: 'Variable Weather', category: 'partly_cloudy' };
}

function degreesToCardinal(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * Geocodes city query to up to 5 matching places using Open-Meteo Geocoding API
 */
export async function searchGeocode(query: string): Promise<GeocodePlace[]> {
  const trimmed = query.trim().toLowerCase();
  const cacheKey = `geocode:${trimmed}`;
  const cached = geocodeCache.get<GeocodePlace[]>(cacheKey);
  if (cached) return cached;

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query
  )}&count=5&language=en&format=json`;

  const response = await fetch(url, {
    headers: { 'User-Agent': 'SkyCast/1.0' },
  });

  if (!response.ok) {
    throw new Error(`Geocoding service returned status ${response.status}`);
  }

  const data = (await response.json()) as { results?: Array<Record<string, unknown>> };
  if (!data.results || !Array.isArray(data.results)) {
    return [];
  }

  const places: GeocodePlace[] = data.results.map((item) => ({
    id: Number(item.id),
    name: String(item.name || ''),
    country: String(item.country || ''),
    country_code: String(item.country_code || ''),
    region: item.admin1 ? String(item.admin1) : undefined,
    lat: Number(item.latitude),
    lon: Number(item.longitude),
    timezone: item.timezone ? String(item.timezone) : undefined,
  }));

  geocodeCache.set(cacheKey, places);
  return places;
}

/**
 * Reverse geocode coordinates to a place name if possible
 */
export async function reverseGeocode(lat: number, lon: number): Promise<{ name: string; country: string; region?: string }> {
  try {
    // Open-Meteo doesn't have a direct reverse geocoding endpoint, but we can query bigdatacloud free client reverse or open-meteo nearby
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return {
        name: data.city || data.locality || data.principalSubdivision || 'Current Location',
        country: data.countryName || '',
        region: data.principalSubdivision || undefined,
      };
    }
  } catch {
    // Fallback if reverse geocoding is unavailable
  }
  return {
    name: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
    country: '',
  };
}

/**
 * Fetch and normalize weather data from Open-Meteo
 */
export async function getWeatherData(
  lat: number,
  lon: number,
  units: 'metric' | 'imperial' = 'metric',
  placeName?: string,
  regionName?: string,
  countryName?: string
) {
  const roundedLat = Number(lat.toFixed(2));
  const roundedLon = Number(lon.toFixed(2));
  const cacheKey = `weather:${roundedLat}:${roundedLon}:${units}`;

  const cached = weatherCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const tempUnit = units === 'imperial' ? 'fahrenheit' : 'celsius';
  const windUnit = units === 'imperial' ? 'mph' : 'kmh';
  const precipUnit = units === 'imperial' ? 'inch' : 'mm';

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,visibility,uv_index,is_day,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&precipitation_unit=${precipUnit}`;

  const response = await fetch(url, {
    headers: { 'User-Agent': 'SkyCast/1.0' },
  });

  if (!response.ok) {
    throw new Error(`Weather service returned HTTP ${response.status}`);
  }

  const raw = await response.json();

  // Determine place name if not provided
  let locationInfo = {
    name: placeName || '',
    region: regionName,
    country: countryName || '',
    latitude: lat,
    longitude: lon,
    timezone: raw.timezone || 'UTC',
  };

  if (!locationInfo.name) {
    const rev = await reverseGeocode(lat, lon);
    locationInfo.name = rev.name;
    locationInfo.country = rev.country;
    locationInfo.region = rev.region;
  }

  // Parse current conditions
  const currentRaw = raw.current || {};
  const hourlyRaw = raw.hourly || {};
  const dailyRaw = raw.daily || {};

  const currentCondition = getConditionInfo(currentRaw.weather_code);

  // Find index in hourly for the current hour
  const nowIso = currentRaw.time; // e.g. "2026-10-30T14:00"
  let currentHourIndex = 0;
  if (hourlyRaw.time && Array.isArray(hourlyRaw.time)) {
    const matchIndex = hourlyRaw.time.findIndex((t: string) => t >= nowIso);
    if (matchIndex !== -1) {
      currentHourIndex = matchIndex;
    }
  }

  // Current visibility from hourly
  const rawVisibility = hourlyRaw.visibility?.[currentHourIndex] ?? 10000;
  // Convert meters to km or miles
  const visibility =
    units === 'imperial'
      ? Math.round((rawVisibility / 1609.34) * 10) / 10
      : Math.round((rawVisibility / 1000) * 10) / 10;

  // Current UV index from hourly
  const uvIndex = Math.round((hourlyRaw.uv_index?.[currentHourIndex] ?? 0) * 10) / 10;

  const current = {
    temperature: Math.round(currentRaw.temperature_2m),
    feels_like: Math.round(currentRaw.apparent_temperature),
    humidity: Math.round(currentRaw.relative_humidity_2m),
    wind_speed: Math.round(currentRaw.wind_speed_10m * 10) / 10,
    wind_direction: currentRaw.wind_direction_10m,
    wind_direction_cardinal: degreesToCardinal(currentRaw.wind_direction_10m),
    pressure: Math.round(currentRaw.surface_pressure),
    uv_index: uvIndex,
    visibility,
    precipitation: Math.round((currentRaw.precipitation ?? 0) * 10) / 10,
    weather_code: currentRaw.weather_code,
    condition: currentCondition.label,
    category: currentCondition.category,
    is_day: currentRaw.is_day,
    time: currentRaw.time,
  };

  // Next 24 hours
  const hourlySliceCount = 24;
  const hourly = [];
  const hourlyTimes = hourlyRaw.time || [];

  for (let i = currentHourIndex; i < Math.min(currentHourIndex + hourlySliceCount, hourlyTimes.length); i++) {
    const timeStr = hourlyTimes[i];
    const condition = getConditionInfo(hourlyRaw.weather_code?.[i] ?? 0);
    const dateObj = new Date(timeStr);
    
    // Format hour nicely, e.g. "2 PM" or "14:00"
    const hour = dateObj.getHours();
    const formatted_time =
      i === currentHourIndex
        ? 'Now'
        : dateObj.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
          });

    hourly.push({
      time: timeStr,
      formatted_time,
      temperature: Math.round(hourlyRaw.temperature_2m?.[i] ?? 0),
      precipitation_probability: hourlyRaw.precipitation_probability?.[i] ?? 0,
      weather_code: hourlyRaw.weather_code?.[i] ?? 0,
      condition: condition.label,
      category: condition.category,
      is_day: hourlyRaw.is_day?.[i] ?? 1,
      humidity: Math.round(hourlyRaw.relative_humidity_2m?.[i] ?? 0),
      wind_speed: Math.round((hourlyRaw.wind_speed_10m?.[i] ?? 0) * 10) / 10,
    });
  }

  // Next 7 days
  const daily = [];
  const dailyTimes = dailyRaw.time || [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 0; i < Math.min(7, dailyTimes.length); i++) {
    const dateStr = dailyTimes[i];
    const dateObj = new Date(dateStr + 'T00:00:00');
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : daysOfWeek[dateObj.getDay()];
    const condition = getConditionInfo(dailyRaw.weather_code?.[i] ?? 0);

    // Extract sunrise/sunset times formatted (e.g., 06:42 AM)
    const sunriseIso = dailyRaw.sunrise?.[i] || '';
    const sunsetIso = dailyRaw.sunset?.[i] || '';
    const sunrise = sunriseIso ? sunriseIso.split('T')[1] || sunriseIso : '';
    const sunset = sunsetIso ? sunsetIso.split('T')[1] || sunsetIso : '';

    daily.push({
      date: dateStr,
      day_name: dayName,
      temp_min: Math.round(dailyRaw.temperature_2m_min?.[i] ?? 0),
      temp_max: Math.round(dailyRaw.temperature_2m_max?.[i] ?? 0),
      weather_code: dailyRaw.weather_code?.[i] ?? 0,
      condition: condition.label,
      category: condition.category,
      precipitation_probability_max: dailyRaw.precipitation_probability_max?.[i] ?? 0,
      sunrise,
      sunset,
      uv_index_max: Math.round((dailyRaw.uv_index_max?.[i] ?? 0) * 10) / 10,
    });
  }

  const normalized = {
    location: locationInfo,
    units: {
      temp: units === 'imperial' ? '°F' : '°C',
      speed: units === 'imperial' ? 'mph' : 'km/h',
      pressure: units === 'imperial' ? 'inHg' : 'hPa',
      visibility: units === 'imperial' ? 'mi' : 'km',
      precipitation: units === 'imperial' ? 'in' : 'mm',
    },
    current,
    hourly,
    daily,
    cached_at: Date.now(),
  };

  // Cache for 10 minutes
  weatherCache.set(cacheKey, normalized, 10 * 60 * 1000);

  return normalized;
}
