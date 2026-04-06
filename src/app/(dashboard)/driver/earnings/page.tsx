'use client';

import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Clock,
  Package,
  Calendar,
  Download,
  ChevronDown,
  Star,
  Route,
  CreditCard,
  CheckCircle2,
  ArrowUpRight,
  Banknote,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/ui/stats-card';
import { Select } from '@/components/ui/select';
import { Tabs } from '@/components/ui/tabs';
import { BarChart } from '@/components/dashboard/analytics-charts';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import type { TrendData } from '@/types';

const weeklyEarnings: TrendData[] = [
  { date: '2026-03-23', value: 245 },
  { date: '2026-03-24', value: 312 },
  { date: '2026-03-25', value: 189 },
  { date: '2026-03-26', value: 402 },
  { date: '2026-03-27', value: 278 },
  { date: '2026-03-28', value: 356 },
  { date: '2026-03-29', value: 190 },
  { date: '2026-03-30', value: 325 },
  { date: '2026-03-31', value: 410 },
  { date: '2026-04-01', value: 226 },
];

const payoutHistory = [
  { id: 'pay_001', date: '2026-03-29', amount: 1842.50, tips: 312.00, deliveries: 47, method: 'Direct Deposit', status: 'completed' as const, bank: 'Chase ****4821' },
  { id: 'pay_002', date: '2026-03-22', amount: 1654.00, tips: 278.00, deliveries: 42, method: 'Direct Deposit', status: 'completed' as const, bank: 'Chase ****4821' },
  { id: 'pay_003', date: '2026-03-15', amount: 1920.75, tips: 345.00, deliveries: 51, method: 'Direct Deposit', status: 'completed' as const, bank: 'Chase ****4821' },
  { id: 'pay_004', date: '2026-03-08', amount: 1580.25, tips: 265.00, deliveries: 39, method: 'Direct Deposit', status: 'completed' as const, bank: 'Chase ****4821' },
];

const deliveryBreakdown = [
  { type: 'Standard', count: 28, earnings: 420, avgPer: 15.00 },
  { type: 'Urgent', count: 14, earnings: 350, avgPer: 25.00 },
  { type: 'Critical', count: 5, earnings: 225, avgPer: 45.00 },
];

export default function DriverEarningsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('this_week');

  const totalEarnings = weeklyEarnings.reduce((sum, d) => sum + d.value, 0);
  const totalTips = 226.50;
  const totalDeliveries = 47;
  const avgPerDelivery = totalEarnings / totalDeliveries;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings & Payouts</h1>
          <p className="text-sm text-gray-500 mt-1">Track your earnings, tips, and payout history.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={[
              { value: 'today', label: 'Today' },
              { value: 'this_week', label: 'This Week' },
              { value: 'this_month', label: 'This Month' },
              { value: 'last_month', label: 'Last Month' },
              { value: 'custom', label: 'Custom Range' },
            ]}
          />
          <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />}>Export</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Earnings" value={formatCurrency(totalEarnings)} icon={<DollarSign className="h-5 w-5" />} color="green" trend={{ value: 12, label: 'vs last week' }} />
        <StatsCard title="Tips Earned" value={formatCurrency(totalTips)} icon={<Banknote className="h-5 w-5" />} color="blue" trend={{ value: 8, label: 'vs last week' }} />
        <StatsCard title="Deliveries" value={totalDeliveries} icon={<Package className="h-5 w-5" />} color="orange" trend={{ value: 5, label: 'vs last week' }} />
        <StatsCard title="Avg per Delivery" value={formatCurrency(avgPerDelivery)} icon={<TrendingUp className="h-5 w-5" />} color="purple" />
      </div>

      <Tabs
        variant="boxed"
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'payouts', label: 'Payout History', count: payoutHistory.length },
          { id: 'breakdown', label: 'Breakdown' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Earnings Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Earnings</CardTitle>
              </CardHeader>
              <BarChart
                data={weeklyEarnings}
                color="bg-emerald-500"
                height={200}
                formatValue={(v) => formatCurrency(v)}
                label="Last 10 days"
              />
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Performance</CardTitle></CardHeader>
              <div className="space-y-3">
                {[
                  { label: 'Avg Delivery Time', value: '32 min', icon: <Clock className="h-4 w-4" /> },
                  { label: 'Total Distance', value: '342 mi', icon: <Route className="h-4 w-4" /> },
                  { label: 'Rating', value: '4.9', icon: <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> },
                  { label: 'Acceptance Rate', value: '94%', icon: <CheckCircle2 className="h-4 w-4" /> },
                  { label: 'Online Hours', value: '38.5h', icon: <Clock className="h-4 w-4" /> },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {stat.icon} {stat.label}
                    </div>
                    <span className="text-sm font-bold text-gray-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
              <div className="text-center">
                <p className="text-sm text-emerald-600 font-semibold">Next Payout</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">{formatCurrency(totalEarnings + totalTips)}</p>
                <p className="text-xs text-gray-500 mt-1">Scheduled for April 5, 2026</p>
                <div className="mt-3 flex items-center justify-center gap-1 text-xs text-gray-400">
                  <CreditCard className="h-3 w-3" /> Chase ****4821
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'payouts' && (
        <div className="space-y-3">
          {payoutHistory.map((payout) => (
            <Card key={payout.id} hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{formatCurrency(payout.amount + payout.tips)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatCurrency(payout.amount)} base + {formatCurrency(payout.tips)} tips &middot; {payout.deliveries} deliveries
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(payout.date)} &middot; {payout.bank}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="success" size="sm">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Paid
                  </Badge>
                  <Button variant="ghost" size="xs" icon={<Download className="h-3 w-3" />}>Receipt</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'breakdown' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>By Priority Level</CardTitle></CardHeader>
            <div className="space-y-4">
              {deliveryBreakdown.map((item) => (
                <div key={item.type}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{item.type}</span>
                      <Badge variant="default" size="sm">{item.count} deliveries</Badge>
                    </div>
                    <span className="font-bold text-gray-900">{formatCurrency(item.earnings)}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        item.type === 'Standard' ? 'bg-blue-500' : item.type === 'Urgent' ? 'bg-orange-500' : 'bg-red-500'
                      )}
                      style={{ width: `${(item.earnings / deliveryBreakdown[0].earnings) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Avg: {formatCurrency(item.avgPer)} per delivery</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader><CardTitle>Earnings Breakdown</CardTitle></CardHeader>
            <div className="space-y-4">
              {[
                { label: 'Base Delivery Fees', amount: 995.00, pct: 60 },
                { label: 'Priority Bonuses', amount: 350.00, pct: 21 },
                { label: 'Distance Bonuses', amount: 88.50, pct: 5 },
                { label: 'Tips', amount: 226.50, pct: 14 },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(item.amount)}</span>
                    <span className="text-xs text-gray-400 w-8 text-right">{item.pct}%</span>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-gray-900">{formatCurrency(1660.00)}</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
