import React from 'react';
import {
  Droplets,
  Wind,
  Gauge,
  SunMedium,
  Eye,
  CloudRain,
  Sunrise,
  Sunset,
} from 'lucide-react';
import { WeatherData } from '../types/weather';
import { getUvTier } from '../utils/weatherCodes';

interface DetailsGridProps {
  weather: WeatherData;
}

export const DetailsGrid: React.FC<DetailsGridProps> = ({ weather }) => {
  const { current, units, daily } = weather;
  const today = daily[0];
  const uvTier = getUvTier(current.uv_index);

  // Humidity assessment
  const getHumidityDesc = (h: number) => {
    if (h < 30) return 'Dry air';
    if (h <= 60) return 'Comfortable humidity';
    return 'High moisture';
  };

  // Pressure description
  const getPressureDesc = (p: number) => {
    if (p > 1015) return 'High pressure · Stable';
    if (p < 1005) return 'Low pressure · System';
    return 'Standard pressure';
  };

  // Visibility description
  const getVisibilityDesc = (v: number, unit: string) => {
    const isKm = unit === 'km';
    const num = isKm ? v : v * 1.6;
    if (num >= 10) return 'Excellent clear view';
    if (num >= 5) return 'Good visibility';
    return 'Reduced visibility';
  };

  const details = [
    {
      title: 'Humidity',
      value: `${current.humidity}%`,
      subtext: getHumidityDesc(current.humidity),
      icon: Droplets,
      iconColor: 'text-sky-500',
    },
    {
      title: 'Wind Status',
      value: `${current.wind_speed} ${units.speed}`,
      subtext: `Direction: ${current.wind_direction_cardinal} (${current.wind_direction}°)`,
      icon: Wind,
      iconColor: 'text-teal-500',
    },
    {
      title: 'UV Index',
      value: `${current.uv_index}`,
      subtext: uvTier.label,
      extraText: uvTier.description,
      icon: SunMedium,
      iconColor: uvTier.color,
    },
    {
      title: 'Air Pressure',
      value: `${current.pressure} ${units.pressure}`,
      subtext: getPressureDesc(current.pressure),
      icon: Gauge,
      iconColor: 'text-indigo-500',
    },
    {
      title: 'Visibility',
      value: `${current.visibility} ${units.visibility}`,
      subtext: getVisibilityDesc(current.visibility, units.visibility),
      icon: Eye,
      iconColor: 'text-blue-500',
    },
    {
      title: 'Precipitation',
      value: `${current.precipitation} ${units.precipitation}`,
      subtext: today ? `Chance: ${today.precipitation_probability_max}%` : 'Today',
      icon: CloudRain,
      iconColor: 'text-cyan-500',
    },
    {
      title: 'Sunrise',
      value: today?.sunrise || '--:--',
      subtext: 'Dawn light',
      icon: Sunrise,
      iconColor: 'text-amber-500',
    },
    {
      title: 'Sunset',
      value: today?.sunset || '--:--',
      subtext: 'Dusk twilight',
      icon: Sunset,
      iconColor: 'text-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {details.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-xs flex flex-col justify-between transition-transform hover:-translate-y-0.5 duration-200"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-medium tracking-wide">{item.title}</span>
              <Icon className={`w-4 h-4 ${item.iconColor}`} />
            </div>

            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
                {item.value}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {item.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
