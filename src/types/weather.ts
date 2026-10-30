export type TemperatureUnit = 'metric' | 'imperial';

export interface GeocodeResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code: string;
  country: string;
  admin1?: string; // State or region
  admin2?: string;
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  wind_direction_cardinal: string;
  pressure: number;
  uv_index: number;
  visibility: number; // in km or miles
  precipitation: number;
  weather_code: number;
  condition: string;
  category: WeatherCategory;
  is_day: number;
  time: string;
}

export interface HourlyForecastItem {
  time: string;
  formatted_time: string;
  temperature: number;
  precipitation_probability: number;
  weather_code: number;
  condition: string;
  category: WeatherCategory;
  is_day: number;
  humidity: number;
  wind_speed: number;
}

export interface DailyForecastItem {
  date: string;
  day_name: string;
  temp_min: number;
  temp_max: number;
  weather_code: number;
  condition: string;
  category: WeatherCategory;
  precipitation_probability_max: number;
  sunrise: string;
  sunset: string;
  uv_index_max: number;
}

export interface WeatherData {
  location: {
    name: string;
    region?: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  units: {
    temp: '°C' | '°F';
    speed: 'km/h' | 'mph';
    pressure: 'hPa' | 'inHg';
    visibility: 'km' | 'mi';
    precipitation: 'mm' | 'in';
  };
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  cached_at: number;
}

export type WeatherCategory =
  | 'clear'
  | 'partly_cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm';

export interface WeatherInsights {
  headline: string;
  summary: string;
  clothingSuggestion: string;
  activityRecommendation: string;
  bestTimeToGoOut?: string;
  advisory?: string;
}

export interface SavedLocation {
  id: string;
  name: string;
  region?: string;
  country: string;
  latitude: number;
  longitude: number;
  addedAt: number;
}
