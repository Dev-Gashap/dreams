'use client';

import {
  Zap,
  Target,
  Trophy,
  Gift,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  Award,
  MapPin,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency } from '@/lib/utils';

const activeChallenges = [
  {
    id: 'c_1',
    name: 'Weekend Warrior',
    description: 'Complete 15 deliveries between Fri-Sun',
    reward: 75,
    progress: 8,
    target: 15,
    expiresIn: '3 days',
    type: 'bonus',
    icon: <Flame className="h-5 w-5" />,
    color: 'from-red-500 to-orange-500',
  },
  {
    id: 'c_2',
    name: 'Prime Time Boost',
    description: 'Drive 5 hours between 11am-2pm or 5pm-8pm',
    reward: 40,
    progress: 3.2,
    target: 5,
    expiresIn: '5 days',
    type: 'hours',
    icon: <Clock className="h-5 w-5" />,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'c_3',
    name: 'Urgent Hero',
    description: 'Complete 10 urgent or critical priority orders',
    reward: 60,
    progress: 6,
    target: 10,
    expiresIn: '4 days',
    type: 'urgent',
    icon: <Zap className="h-5 w-5" />,
    color: 'from-orange-500 to-red-600',
  },
];

const surgeZones = [
  { area: 'Downtown Houston', multiplier: 2.0, activeUntil: '8:00 PM', color: 'bg-red-500' },
  { area: 'Memorial Park', multiplier: 1.5, activeUntil: '6:30 PM', color: 'bg-orange-500' },
  { area: 'The Woodlands', multiplier: 1.3, activeUntil: '7:00 PM', color: 'bg-amber-500' },
];

const upcomingChallenges = [
  { name: 'Friday Night Boost', description: 'Double pay on deliveries 6pm-midnight Friday', reward: 'Up to +$150' },
  { name: 'Morning Rush', description: 'Complete 8 deliveries before 10am', reward: '+$50' },
  { name: 'Perfect Week', description: 'Complete 25 deliveries with 5-star rating', reward: '+$200' },
];

const milestones = [
  { label: '1,000 deliveries', current: 1247, target: 1000, achieved: true, reward: 'Bronze badge' },
  { label: '2,500 deliveries', current: 1247, target: 2500, achieved: false, reward: 'Silver badge + $100 bonus' },
  { label: '5,000 deliveries', current: 1247, target: 5000, achieved: false, reward: 'Gold badge + $300 bonus' },
  { label: '10,000 deliveries', current: 1247, target: 10000, achieved: false, reward: 'Platinum badge + $750 bonus' },
];

export default function DriverIncentivesPage() {
  const activeBonusTotal = activeChallenges.reduce((sum, c) => sum + c.reward, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bonuses & Incentives</h1>
        <p className="text-sm text-gray-500 mt-1">Earn more by hitting challenges and driving during peak hours.</p>
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-orange-500 via-red-500 to-red-600 text-white border-transparent">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5" />
              <p className="text-sm font-bold uppercase tracking-wider">Available bonuses</p>
            </div>
            <p className="text-5xl font-extrabold">+{formatCurrency(activeBonusTotal)}</p>
            <p className="text-sm text-orange-100 mt-1">Complete active challenges this week to earn</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-orange-200 uppercase font-bold tracking-wider">This month earned</p>
            <p className="text-2xl font-extrabold mt-1">{formatCurrency(342)}</p>
            <p className="text-xs text-orange-100 mt-1">from 8 challenges completed</p>
          </div>
        </div>
      </Card>

      {/* Surge Zones */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Flame className="h-5 w-5 text-red-500" />
            Active surge zones
          </h2>
          <Badge variant="urgent" size="sm" dot pulse>Live</Badge>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {surgeZones.map((z) => (
            <Card key={z.area} className={cn('relative overflow-hidden',
              z.multiplier >= 2 ? 'border-red-300 bg-gradient-to-br from-red-50 to-white' :
              z.multiplier >= 1.5 ? 'border-orange-300 bg-gradient-to-br from-orange-50 to-white' :
              'border-amber-300 bg-gradient-to-br from-amber-50 to-white'
            )}>
              <div className={cn('absolute top-0 right-0 h-16 w-16 rounded-bl-full opacity-20', z.color)} />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className={cn('h-4 w-4',
                    z.multiplier >= 2 ? 'text-red-600' : z.multiplier >= 1.5 ? 'text-orange-600' : 'text-amber-600'
                  )} />
                  <p className="text-sm font-bold text-gray-900">{z.area}</p>
                </div>
                <p className="text-4xl font-extrabold text-gray-900">{z.multiplier}x</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Active until {z.activeUntil}
                </p>
                <Button variant="outline" size="sm" className="mt-3 w-full" icon={<MapPin className="h-3.5 w-3.5" />}>
                  Go to zone
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Active Challenges */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Target className="h-5 w-5 text-orange-500" />
          Active challenges
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {activeChallenges.map((c) => {
            const progressPercent = (c.progress / c.target) * 100;
            const remaining = c.target - c.progress;
            return (
              <Card key={c.id} className="relative overflow-hidden group">
                <div className={cn('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r', c.color)} />
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn('h-11 w-11 rounded-xl bg-gradient-to-br text-white flex items-center justify-center shadow-lg', c.color)}>
                    {c.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.description}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-700">{c.progress}/{c.target} complete</span>
                    <span className="text-xs text-gray-500">{remaining} to go</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={cn('h-full bg-gradient-to-r rounded-full transition-all', c.color)} style={{ width: `${Math.min(100, progressPercent)}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">Expires in {c.expiresIn}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-extrabold text-emerald-600">+{formatCurrency(c.reward)}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-semibold">reward</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Upcoming Challenges */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          Upcoming challenges
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {upcomingChallenges.map((c) => (
            <Card key={c.name} padding="sm" className="opacity-80">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center">
                  <Gift className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{c.description}</p>
                  <p className="text-xs font-bold text-emerald-600 mt-1.5">{c.reward}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          Career milestones
        </h2>
        <Card>
          <div className="space-y-4">
            {milestones.map((m) => {
              const pct = Math.min(100, (m.current / m.target) * 100);
              return (
                <div key={m.label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {m.achieved ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300 bg-white" />
                      )}
                      <div>
                        <p className={cn('text-sm font-bold', m.achieved ? 'text-gray-900' : 'text-gray-600')}>
                          {m.label}
                        </p>
                        <p className="text-xs text-gray-500">{m.reward}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{m.current.toLocaleString()}/{m.target.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden ml-7">
                    <div className={cn('h-full rounded-full',
                      m.achieved ? 'bg-emerald-500' : 'bg-amber-400'
                    )} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
