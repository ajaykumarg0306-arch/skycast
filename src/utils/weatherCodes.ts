import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  Snowflake,
  Wind,
} from 'lucide-react';
import { WeatherCategory } from '../types/weather';

export interface WeatherConditionInfo {
  label: string;
  category: WeatherCategory;
  iconName: string;
}

/**
 * Standard WMO Weather interpretation codes (WW)
 */
export const WMO_CODE_MAP: Record<number, { label: string; category: WeatherCategory }> = {
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

export function getWeatherCondition(code: number): { label: string; category: WeatherCategory } {
  return WMO_CODE_MAP[code] || { label: 'Variable Weather', category: 'partly_cloudy' };
}

/**
 * Returns dynamic Tailwind background gradients based on weather category and day/night state.
 */
export function getAtmosphereBackground(category: WeatherCategory, isDay: number = 1): {
  bgGradient: string;
  cardBg: string;
  cardBorder: string;
  accentColor: string;
  glowColor: string;
} {
  const isNight = isDay === 0;

  if (isNight) {
    switch (category) {
      case 'clear':
        return {
          bgGradient: 'from-slate-950 via-indigo-950 to-slate-900',
          cardBg: 'bg-indigo-950/40 backdrop-blur-md',
          cardBorder: 'border-indigo-800/40',
          accentColor: 'text-indigo-400',
          glowColor: 'rgba(99, 102, 241, 0.15)',
        };
      case 'thunderstorm':
        return {
          bgGradient: 'from-gray-950 via-purple-950 to-zinc-950',
          cardBg: 'bg-purple-950/40 backdrop-blur-md',
          cardBorder: 'border-purple-800/40',
          accentColor: 'text-purple-400',
          glowColor: 'rgba(168, 85, 247, 0.18)',
        };
      case 'rain':
      case 'drizzle':
        return {
          bgGradient: 'from-slate-950 via-cyan-950 to-slate-900',
          cardBg: 'bg-cyan-950/40 backdrop-blur-md',
          cardBorder: 'border-cyan-800/40',
          accentColor: 'text-cyan-400',
          glowColor: 'rgba(6, 182, 212, 0.15)',
        };
      case 'snow':
        return {
          bgGradient: 'from-slate-950 via-blue-950 to-slate-900',
          cardBg: 'bg-blue-950/40 backdrop-blur-md',
          cardBorder: 'border-blue-800/40',
          accentColor: 'text-sky-300',
          glowColor: 'rgba(125, 211, 252, 0.15)',
        };
      default:
        return {
          bgGradient: 'from-slate-950 via-slate-900 to-zinc-900',
          cardBg: 'bg-slate-900/50 backdrop-blur-md',
          cardBorder: 'border-slate-800/60',
          accentColor: 'text-blue-400',
          glowColor: 'rgba(59, 130, 246, 0.12)',
        };
    }
  }

  // Daytime styling
  switch (category) {
    case 'clear':
      return {
        bgGradient: 'from-sky-400 via-blue-500 to-amber-200 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950',
        cardBg: 'bg-white/80 dark:bg-slate-900/60 backdrop-blur-md',
        cardBorder: 'border-white/40 dark:border-slate-800/60',
        accentColor: 'text-amber-500 dark:text-amber-400',
        glowColor: 'rgba(245, 158, 11, 0.2)',
      };
    case 'partly_cloudy':
      return {
        bgGradient: 'from-sky-300 via-blue-400 to-indigo-300 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900',
        cardBg: 'bg-white/80 dark:bg-slate-900/60 backdrop-blur-md',
        cardBorder: 'border-white/40 dark:border-slate-800/60',
        accentColor: 'text-sky-600 dark:text-sky-400',
        glowColor: 'rgba(14, 165, 233, 0.18)',
      };
    case 'cloudy':
      return {
        bgGradient: 'from-slate-300 via-zinc-400 to-slate-400 dark:from-slate-950 dark:via-zinc-900 dark:to-slate-900',
        cardBg: 'bg-white/85 dark:bg-slate-900/60 backdrop-blur-md',
        cardBorder: 'border-white/50 dark:border-slate-800/60',
        accentColor: 'text-slate-700 dark:text-slate-300',
        glowColor: 'rgba(148, 163, 184, 0.15)',
      };
    case 'fog':
      return {
        bgGradient: 'from-zinc-200 via-slate-300 to-stone-300 dark:from-zinc-950 dark:via-slate-900 dark:to-neutral-900',
        cardBg: 'bg-white/85 dark:bg-slate-900/60 backdrop-blur-md',
        cardBorder: 'border-white/50 dark:border-slate-800/60',
        accentColor: 'text-zinc-600 dark:text-zinc-400',
        glowColor: 'rgba(161, 161, 170, 0.15)',
      };
    case 'drizzle':
    case 'rain':
      return {
        bgGradient: 'from-cyan-600 via-blue-700 to-slate-700 dark:from-slate-950 dark:via-cyan-950 dark:to-slate-900',
        cardBg: 'bg-white/85 dark:bg-slate-900/60 backdrop-blur-md',
        cardBorder: 'border-white/40 dark:border-slate-800/60',
        accentColor: 'text-cyan-600 dark:text-cyan-400',
        glowColor: 'rgba(6, 182, 212, 0.2)',
      };
    case 'thunderstorm':
      return {
        bgGradient: 'from-indigo-800 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-zinc-950',
        cardBg: 'bg-white/85 dark:bg-slate-900/60 backdrop-blur-md',
        cardBorder: 'border-white/40 dark:border-slate-800/60',
        accentColor: 'text-purple-600 dark:text-purple-400',
        glowColor: 'rgba(168, 85, 247, 0.25)',
      };
    case 'snow':
      return {
        bgGradient: 'from-sky-200 via-indigo-200 to-blue-300 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900',
        cardBg: 'bg-white/85 dark:bg-slate-900/60 backdrop-blur-md',
        cardBorder: 'border-white/50 dark:border-slate-800/60',
        accentColor: 'text-sky-500 dark:text-sky-300',
        glowColor: 'rgba(125, 211, 252, 0.25)',
      };
    default:
      return {
        bgGradient: 'from-sky-400 via-blue-500 to-indigo-500 dark:from-slate-950 dark:via-slate-900 dark:to-zinc-900',
        cardBg: 'bg-white/80 dark:bg-slate-900/60 backdrop-blur-md',
        cardBorder: 'border-white/40 dark:border-slate-800/60',
        accentColor: 'text-blue-600 dark:text-blue-400',
        glowColor: 'rgba(59, 130, 246, 0.2)',
      };
  }
}

/**
 * Convert degree wind direction to cardinal string (N, NE, E, SE, S, SW, W, NW)
 */
export function degreesToCardinal(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * Returns UV index tier description and color class
 */
export function getUvTier(uv: number): { label: string; color: string; description: string } {
  if (uv <= 2) return { label: 'Low', color: 'text-emerald-500 dark:text-emerald-400', description: 'No protection needed' };
  if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-500 dark:text-yellow-400', description: 'Protection required during midday' };
  if (uv <= 7) return { label: 'High', color: 'text-orange-500 dark:text-orange-400', description: 'Sunscreen and hat recommended' };
  if (uv <= 10) return { label: 'Very High', color: 'text-red-500 dark:text-red-400', description: 'Avoid direct midday sun' };
  return { label: 'Extreme', color: 'text-purple-500 dark:text-purple-400', description: 'Take all precautions' };
}
