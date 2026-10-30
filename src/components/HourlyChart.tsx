import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { HourlyForecastItem } from '../types/weather';

interface HourlyChartProps {
  hourly: HourlyForecastItem[];
  tempUnit: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: HourlyForecastItem;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps & { tempUnit: string }> = ({
  active,
  payload,
  tempUnit,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg p-3 text-xs">
        <div className="font-semibold text-slate-900 dark:text-white">
          {data.formatted_time}
        </div>
        <div className="text-slate-500 dark:text-slate-400 text-[11px] mb-1.5">
          {data.condition}
        </div>
        <div className="flex flex-col gap-1 font-mono text-[11px]">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">Temperature:</span>
            <span className="font-bold text-sky-600 dark:text-sky-400">
              {data.temperature}{tempUnit}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">Rain Chance:</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">
              {data.precipitation_probability}%
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">Humidity:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {data.humidity}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const HourlyChart: React.FC<HourlyChartProps> = ({ hourly, tempUnit }) => {
  const [metric, setMetric] = useState<'temp' | 'precip'>('temp');

  const chartData = hourly.slice(0, 24);

  // Compute domain bounds
  const temps = chartData.map((d) => d.temperature);
  const minTemp = Math.floor(Math.min(...temps) - 2);
  const maxTemp = Math.ceil(Math.max(...temps) + 2);

  return (
    <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-sm p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Hourly Trends
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive visualization over the next 24 hours
          </p>
        </div>

        {/* Metric Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setMetric('temp')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              metric === 'temp'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Temperature ({tempUnit})
          </button>
          <button
            onClick={() => setMetric('precip')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              metric === 'precip'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Precipitation (%)
          </button>
        </div>
      </div>

      <div className="w-full h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          {metric === 'temp' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis
                dataKey="formatted_time"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval={2}
              />
              <YAxis
                domain={[minTemp, maxTemp]}
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                unit={tempUnit}
              />
              <Tooltip content={<CustomTooltip tempUnit={tempUnit} />} />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#0ea5e9"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
            </AreaChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis
                dataKey="formatted_time"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval={2}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                unit="%"
              />
              <Tooltip content={<CustomTooltip tempUnit={tempUnit} />} />
              <Area
                type="monotone"
                dataKey="precipitation_probability"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#precipGradient)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
