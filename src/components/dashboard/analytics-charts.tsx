'use client';

import { cn, formatCurrency } from '@/lib/utils';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import type { TrendData } from '@/types';

interface BarChartProps {
  data: TrendData[];
  color?: string;
  height?: number;
  formatValue?: (v: number) => string;
  label?: string;
}

export function BarChart({ data, color = 'bg-orange-500', height = 160, formatValue, label }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div>
      {label && <p className="text-sm font-medium text-gray-500 mb-3">{label}</p>}
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((item, i) => {
          const barHeight = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap shadow-lg">
                  {formatValue ? formatValue(item.value) : item.value}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                </div>
              </div>
              <div
                className={cn('w-full rounded-t-md transition-all duration-300 hover:opacity-80 cursor-pointer', color)}
                style={{ height: `${barHeight}%`, minHeight: barHeight > 0 ? 4 : 0 }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-1.5 mt-2">
        {data.map((item, i) => (
          <div key={i} className="flex-1 text-center">
            <p className="text-[10px] text-gray-400">{item.date.slice(-2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DonutChartProps {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ segments, size = 160, centerLabel, centerValue }: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let accumulated = 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 160 160" className="transform -rotate-90">
          {segments.map((segment, i) => {
            const pct = total > 0 ? segment.value / total : 0;
            const offset = accumulated * circumference;
            accumulated += pct;
            return (
              <circle
                key={i}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="20"
                strokeDasharray={`${pct * circumference} ${circumference}`}
                strokeDashoffset={-offset}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && <p className="text-2xl font-bold text-gray-900">{centerValue}</p>}
            {centerLabel && <p className="text-xs text-gray-500">{centerLabel}</p>}
          </div>
        )}
      </div>
      <div className="space-y-2">
        {segments.map((segment, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.color }} />
            <span className="text-sm text-gray-600">{segment.label}</span>
            <span className="text-sm font-semibold text-gray-900 ml-auto">{segment.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface MetricRowProps {
  items: { label: string; value: string | number; change?: number; icon?: React.ReactNode }[];
}

export function MetricRow({ items }: MetricRowProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.label} className="p-4 rounded-xl bg-gray-50 text-center">
          {item.icon && <div className="flex justify-center mb-2 text-gray-400">{item.icon}</div>}
          <p className="text-2xl font-bold text-gray-900">{item.value}</p>
          <p className="text-xs text-gray-500 mt-1">{item.label}</p>
          {item.change !== undefined && (
            <p className={cn('text-xs font-medium mt-1', item.change >= 0 ? 'text-emerald-600' : 'text-red-600')}>
              {item.change >= 0 ? '+' : ''}{item.change}%
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function Sparkline({ data, color = '#f97316', width = 120, height = 32 }: SparklineProps) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
