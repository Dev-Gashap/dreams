'use client';

import { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Copy,
  Trash2,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Zap,
  DollarSign,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface TimeSlot {
  day: string;
  startHour: number;
  endHour: number;
  available: boolean;
  estimatedEarnings: number;
  surge?: number;
}

export default function DriverSchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [schedule, setSchedule] = useState<TimeSlot[]>([
    { day: 'Mon', startHour: 7, endHour: 12, available: true, estimatedEarnings: 140 },
    { day: 'Mon', startHour: 15, endHour: 19, available: true, estimatedEarnings: 120, surge: 1.3 },
    { day: 'Tue', startHour: 8, endHour: 16, available: true, estimatedEarnings: 210 },
    { day: 'Wed', startHour: 7, endHour: 12, available: true, estimatedEarnings: 140 },
    { day: 'Thu', startHour: 15, endHour: 20, available: true, estimatedEarnings: 175, surge: 1.5 },
    { day: 'Fri', startHour: 14, endHour: 22, available: true, estimatedEarnings: 280, surge: 1.8 },
    { day: 'Sat', startHour: 9, endHour: 18, available: true, estimatedEarnings: 240, surge: 1.5 },
  ]);

  const totalHours = schedule.reduce((sum, s) => sum + (s.endHour - s.startHour), 0);
  const estimatedWeeklyEarnings = schedule.reduce((sum, s) => sum + s.estimatedEarnings, 0);

  // Demand heatmap data
  const demandByHour = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    level: h < 6 ? 0 : h < 9 ? 2 : h < 12 ? 3 : h < 14 ? 1 : h < 17 ? 2 : h < 20 ? 3 : h < 22 ? 2 : 1,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule & Availability</h1>
          <p className="text-sm text-gray-500 mt-1">Plan your driving hours to maximize earnings.</p>
        </div>
        <Button variant="primary" icon={<Plus className="h-4 w-4" />}>Add time block</Button>
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Scheduled hours</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">{totalHours}h</p>
          <p className="text-xs text-emerald-600 mt-1">On track for your weekly goal</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Est. earnings</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-1">${estimatedWeeklyEarnings}</p>
          <p className="text-xs text-gray-500 mt-1">Based on avg demand</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Peak slots</p>
          <p className="text-3xl font-extrabold text-orange-600 mt-1">{schedule.filter((s) => s.surge).length}</p>
          <p className="text-xs text-gray-500 mt-1">High-demand hours</p>
        </Card>
        <Card padding="sm" className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-orange-600" />
            <p className="text-xs text-orange-700 font-semibold uppercase tracking-wider">Boost</p>
          </div>
          <p className="text-sm font-bold text-gray-900">Add Friday 8-10 PM</p>
          <p className="text-xs text-orange-600 mt-0.5">Earn ~$60 more (2x surge)</p>
        </Card>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset(weekOffset - 1)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-lg font-bold text-gray-900">
              {weekOffset === 0 ? 'This week' : weekOffset === 1 ? 'Next week' : `Week ${weekOffset + 1}`}
            </p>
            <p className="text-xs text-gray-500">April 21 - 27, 2026</p>
          </div>
          <button onClick={() => setWeekOffset(weekOffset + 1)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Copy className="h-3.5 w-3.5" />}>Copy last week</Button>
        </div>
      </div>

      {/* Weekly Calendar Grid */}
      <Card padding="none" className="overflow-hidden">
        <div className="grid grid-cols-[80px_repeat(7,_1fr)] divide-x divide-gray-100">
          {/* Header */}
          <div className="bg-gray-50 p-3 border-b border-gray-200" />
          {DAYS.map((day, i) => (
            <div key={day} className="bg-gray-50 p-3 border-b border-gray-200 text-center">
              <p className="text-xs text-gray-500 font-semibold uppercase">{day}</p>
              <p className="text-lg font-bold text-gray-900">{21 + i}</p>
            </div>
          ))}

          {/* Time rows (6 AM - 11 PM) */}
          {Array.from({ length: 17 }, (_, i) => i + 6).map((hour) => (
            <>
              <div key={`label-${hour}`} className="p-2 text-right text-xs text-gray-500 border-b border-gray-50">
                {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
              {DAYS.map((day) => {
                const slot = schedule.find((s) => s.day === day && hour >= s.startHour && hour < s.endHour);
                const demand = demandByHour[hour]?.level || 0;
                return (
                  <button
                    key={`${day}-${hour}`}
                    className={cn(
                      'p-2 border-b border-gray-50 text-left relative min-h-[48px] transition-colors',
                      slot
                        ? slot.surge
                          ? 'bg-orange-100 border-orange-300'
                          : 'bg-emerald-100 border-emerald-300'
                        : demand === 3
                        ? 'bg-orange-50/30 hover:bg-orange-50'
                        : demand === 2
                        ? 'bg-amber-50/30 hover:bg-amber-50'
                        : 'hover:bg-gray-50'
                    )}
                  >
                    {slot && hour === slot.startHour && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-900">Available</p>
                        {slot.surge && (
                          <div className="flex items-center gap-0.5 mt-0.5">
                            <Zap className="h-2.5 w-2.5 text-orange-600" />
                            <p className="text-[10px] font-bold text-orange-700">{slot.surge}x</p>
                          </div>
                        )}
                      </div>
                    )}
                    {!slot && demand === 3 && hour >= 7 && (
                      <div className="absolute top-1 right-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500" title="High demand" />
                      </div>
                    )}
                  </button>
                );
              })}
            </>
          ))}
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-gray-100 flex items-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-emerald-200 border border-emerald-300" />
            Your availability
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-orange-200 border border-orange-300" />
            Surge hours
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            High demand predicted
          </div>
        </div>
      </Card>

      {/* Scheduled Time Blocks */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Scheduled blocks</h2>
        <div className="space-y-2">
          {schedule.map((slot, i) => (
            <Card key={i} padding="sm" hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 text-center">
                    <p className="text-xs text-gray-500 font-semibold uppercase">{slot.day}</p>
                    <p className="text-xs text-gray-400">Apr 21</p>
                  </div>
                  <div className="h-px w-8 bg-gray-200" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {slot.startHour > 12 ? `${slot.startHour - 12}:00 PM` : slot.startHour === 12 ? '12:00 PM' : `${slot.startHour}:00 AM`} - {slot.endHour > 12 ? `${slot.endHour - 12}:00 PM` : slot.endHour === 12 ? '12:00 PM' : `${slot.endHour}:00 AM`}
                    </p>
                    <p className="text-xs text-gray-500">{slot.endHour - slot.startHour} hours</p>
                  </div>
                  {slot.surge && (
                    <Badge variant="urgent" size="sm">
                      <Zap className="h-3 w-3 mr-0.5" /> {slot.surge}x surge expected
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-600">~${slot.estimatedEarnings}</p>
                    <p className="text-[10px] text-gray-400">estimated</p>
                  </div>
                  <button
                    onClick={() => setSchedule(schedule.filter((_, idx) => idx !== i))}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
