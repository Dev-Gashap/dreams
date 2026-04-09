'use client';

import { useState } from 'react';
import {
  Award,
  Star,
  Gift,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Crown,
  Sparkles,
  Trophy,
  Lock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { cn, formatCurrency } from '@/lib/utils';

const tiers = [
  { name: 'Bronze', minSpent: 0, color: 'from-orange-700 to-orange-900', textColor: 'text-orange-100', perks: ['1% cashback', 'Standard support'] },
  { name: 'Silver', minSpent: 5000, color: 'from-gray-400 to-gray-600', textColor: 'text-gray-100', perks: ['2% cashback', 'Priority support', 'Free standard delivery on orders > $200'] },
  { name: 'Gold', minSpent: 25000, color: 'from-amber-400 to-amber-600', textColor: 'text-amber-50', perks: ['3% cashback', '24/7 phone support', 'Free urgent delivery on orders > $500', 'Early access to new products'] },
  { name: 'Platinum', minSpent: 100000, color: 'from-slate-700 to-slate-900', textColor: 'text-slate-100', perks: ['5% cashback', 'Dedicated account manager', 'Free critical delivery', 'Custom pricing on bulk orders', 'Annual rebate program'] },
];

const rewards = [
  { id: 'r_1', name: '$25 Order Credit', cost: 2500, icon: <Gift className="h-6 w-6" />, available: true },
  { id: 'r_2', name: 'Free Urgent Delivery (1 use)', cost: 1500, icon: <Zap className="h-6 w-6" />, available: true },
  { id: 'r_3', name: '$100 Order Credit', cost: 9000, icon: <Gift className="h-6 w-6" />, available: true },
  { id: 'r_4', name: 'Free Premium Tool Rental (1 day)', cost: 5000, icon: <Award className="h-6 w-6" />, available: true },
  { id: 'r_5', name: '$500 Order Credit', cost: 42000, icon: <Crown className="h-6 w-6" />, available: false },
  { id: 'r_6', name: 'Annual Premium Membership', cost: 75000, icon: <Trophy className="h-6 w-6" />, available: false },
];

const recentActivity = [
  { id: 'a_1', type: 'earned', points: 295, description: 'Order DRM-LK82F-X9A3 ($295)', date: '2026-04-01' },
  { id: 'a_2', type: 'earned', points: 1802, description: 'Order DRM-MN47K-B2C1 ($1,802)', date: '2026-03-31' },
  { id: 'a_3', type: 'redeemed', points: -2500, description: 'Redeemed: $25 Order Credit', date: '2026-03-28' },
  { id: 'a_4', type: 'earned', points: 890, description: 'Order DRM-AB12C-D3E4 ($890)', date: '2026-03-27' },
  { id: 'a_5', type: 'bonus', points: 500, description: 'Referral bonus: Mike Torres joined', date: '2026-03-25' },
];

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const currentPoints = 8420;
  const lifetimeSpent = 48920;
  const currentTier = tiers.findIndex((t) => lifetimeSpent < (tiers[tiers.indexOf(t) + 1]?.minSpent || Infinity)) || 0;
  const tier = tiers[Math.max(0, currentTier)];
  const nextTier = tiers[currentTier + 1];
  const progressToNext = nextTier ? ((lifetimeSpent - tier.minSpent) / (nextTier.minSpent - tier.minSpent)) * 100 : 100;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dreams Rewards</h1>
        <p className="text-sm text-gray-500 mt-1">Earn points on every order. Unlock perks and exclusive rewards.</p>
      </div>

      {/* Status Card */}
      <Card padding="none" className="overflow-hidden">
        <div className={cn('bg-gradient-to-br p-8 text-white', tier.color)}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className={cn('h-6 w-6', tier.textColor)} />
                <span className={cn('text-sm font-semibold uppercase tracking-wider', tier.textColor)}>{tier.name} Member</span>
              </div>
              <p className="text-5xl font-extrabold">{currentPoints.toLocaleString()}</p>
              <p className={cn('text-sm mt-1', tier.textColor)}>points available</p>
            </div>
            <div className="text-right">
              <p className={cn('text-xs uppercase tracking-wider', tier.textColor)}>Lifetime Spent</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(lifetimeSpent)}</p>
            </div>
          </div>

          {nextTier && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className={tier.textColor}>{tier.name}</span>
                <span className={tier.textColor}>{Math.round(progressToNext)}% to {nextTier.name}</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${Math.min(100, progressToNext)}%` }} />
              </div>
              <p className={cn('text-xs mt-2', tier.textColor)}>
                Spend {formatCurrency(nextTier.minSpent - lifetimeSpent)} more to reach {nextTier.name}
              </p>
            </div>
          )}
        </div>
      </Card>

      <Tabs
        variant="boxed"
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'rewards', label: 'Redeem Rewards' },
          { id: 'tiers', label: 'Membership Tiers' },
          { id: 'history', label: 'Activity' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-sm">Current Perks</CardTitle></CardHeader>
            <ul className="space-y-2">
              {tier.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{perk}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">How to Earn</CardTitle></CardHeader>
            <div className="space-y-3">
              {[
                { label: 'Per $1 spent', points: '1 pt', icon: <TrendingUp className="h-4 w-4" /> },
                { label: 'Refer a friend', points: '500 pts', icon: <Star className="h-4 w-4" /> },
                { label: 'Write a review', points: '50 pts', icon: <Star className="h-4 w-4" /> },
                { label: 'Birthday bonus', points: '1,000 pts', icon: <Gift className="h-4 w-4" /> },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">{item.icon}{item.label}</div>
                  <span className="text-sm font-bold text-orange-600">{item.points}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Quick Redeem</CardTitle></CardHeader>
            <div className="space-y-2">
              {rewards.slice(0, 3).map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">{reward.icon}</div>
                    <span className="text-xs font-medium text-gray-900">{reward.name}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-700">{reward.cost.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" fullWidth className="mt-3" onClick={() => setActiveTab('rewards')}>
              View All Rewards
            </Button>
          </Card>
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => {
            const canAfford = currentPoints >= reward.cost;
            return (
              <Card key={reward.id} className={cn(!reward.available && 'opacity-60')}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center', canAfford && reward.available ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400')}>
                    {reward.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{reward.name}</p>
                    <p className="text-2xl font-extrabold text-orange-600 mt-1">{reward.cost.toLocaleString()} <span className="text-xs text-gray-400">pts</span></p>
                  </div>
                </div>
                {!reward.available ? (
                  <Button variant="outline" size="sm" fullWidth disabled icon={<Lock className="h-3 w-3" />}>
                    Higher Tier Required
                  </Button>
                ) : canAfford ? (
                  <Button variant="primary" size="sm" fullWidth icon={<Gift className="h-3 w-3" />}>Redeem Now</Button>
                ) : (
                  <Button variant="outline" size="sm" fullWidth disabled>
                    Need {(reward.cost - currentPoints).toLocaleString()} more
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'tiers' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((t, i) => {
            const isCurrent = i === currentTier;
            return (
              <Card key={t.name} className={cn(isCurrent && 'ring-2 ring-orange-500 shadow-lg')}>
                <div className={cn('h-20 -m-5 mb-4 bg-gradient-to-br rounded-t-xl flex items-center justify-center', t.color)}>
                  <Crown className={cn('h-10 w-10', t.textColor)} />
                </div>
                {isCurrent && <Badge variant="urgent" size="sm" className="mb-2">Current Tier</Badge>}
                <h3 className="text-xl font-bold text-gray-900">{t.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {t.minSpent === 0 ? 'Welcome tier' : `${formatCurrency(t.minSpent)}+ lifetime spent`}
                </p>
                <ul className="mt-4 space-y-2">
                  {t.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-1.5 text-xs text-gray-700">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-2">
          {recentActivity.map((activity) => (
            <Card key={activity.id} padding="sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'h-10 w-10 rounded-xl flex items-center justify-center',
                    activity.type === 'earned' ? 'bg-emerald-100 text-emerald-600' :
                    activity.type === 'redeemed' ? 'bg-orange-100 text-orange-600' :
                    'bg-purple-100 text-purple-600'
                  )}>
                    {activity.type === 'earned' ? <TrendingUp className="h-5 w-5" /> :
                     activity.type === 'redeemed' ? <Gift className="h-5 w-5" /> :
                     <Sparkles className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-400">{activity.date}</p>
                  </div>
                </div>
                <span className={cn('text-lg font-bold', activity.points > 0 ? 'text-emerald-600' : 'text-orange-600')}>
                  {activity.points > 0 ? '+' : ''}{activity.points.toLocaleString()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
