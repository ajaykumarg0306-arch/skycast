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

interface WeatherIconProps {
  category: WeatherCategory;
  isDay?: number;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  category,
  isDay = 1,
  className = 'w-6 h-6',
  size,
}) => {
  const isNight = isDay === 0;

  switch (category) {
    case 'clear':
      return isNight ? (
        <Moon size={size} className={`${className} text-indigo-300 dark:text-indigo-200 fill-indigo-300/20`} />
      ) : (
        <Sun size={size} className={`${className} text-amber-500 fill-amber-400/30 animate-pulse-slow`} />
      );

    case 'partly_cloudy':
      return isNight ? (
        <CloudMoon size={size} className={`${className} text-indigo-200 fill-indigo-200/20`} />
      ) : (
        <CloudSun size={size} className={`${className} text-amber-400`} />
      );

    case 'cloudy':
      return <Cloud size={size} className={`${className} text-slate-400 dark:text-slate-300 fill-slate-400/20`} />;

    case 'fog':
      return <CloudFog size={size} className={`${className} text-slate-300 dark:text-slate-400`} />;

    case 'drizzle':
      return <CloudDrizzle size={size} className={`${className} text-sky-400`} />;

    case 'rain':
      return <CloudRain size={size} className={`${className} text-blue-500 dark:text-cyan-400`} />;

    case 'thunderstorm':
      return <CloudLightning size={size} className={`${className} text-purple-500 dark:text-purple-400 fill-purple-400/20`} />;

    case 'snow':
      return <Snowflake size={size} className={`${className} text-sky-300 dark:text-sky-200`} />;

    default:
      return <Wind size={size} className={`${className} text-slate-400`} />;
  }
};
