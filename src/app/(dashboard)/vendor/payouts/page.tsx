'use client';

import { useState } from 'react';
import { DollarSign, Download, CheckCircle2, Clock, CreditCard, TrendingUp, Calendar, Banknote, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/ui/stats-card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Tabs } from '@/components/ui/tabs';
import { BarChart } from '@/components/dashboard/analytics-charts';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

const payoutHistory = [
  { id: 'vp_1', date: '2026-03-29', gross: 6240, commission: 748.80, net: 5491.20, orders: 47, status: 'completed' as const },
  { id: 'vp_2', date: '2026-03-22', gross: 5820, commission: 698.40, net: 5121.60, orders: 42, status: 'completed' as const },
  { id: 'vp_3', date: '2026-03-15', gross: 7100, commission: 852.00, net: 6248.00, orders: 54, status: 'completed' as const },
  { id: 'vp_4', date: '2026-03-08', gross: 4980, commission: 597.60, net: 4382.40, orders: 38, status: 'completed' as const },
];

const weeklyRevenue = [
  { date: 'W1', value: 4980 }, { date: 'W2', value: 7100 },
  { date: 'W3', value: 5820 }, { date: 'W4', value: 6240 },
  { date: 'W5', value: 5400 },
];

export default function VendorPayoutsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const totalGross = payoutHistory.reduce((s, p) => s + p.gross, 0);
  const totalNet = payoutHistory.reduce((s, p) => s + p.net, 0);
  const totalCommission = payoutHistory.reduce((s, p) => s + p.commission, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
          <p className="text-sm text-gray-500 mt-1">Track your revenue, commissions, and payout schedule.</p>
        </div>
        <Button variant="outline" icon={<Download className="h-4 w-4" />}>Export</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Gross Revenue" value={formatCurrency(totalGross)} icon={<DollarSign className="h-5 w-5" />} color="green" trend={{ value: 12, label: 'vs prior' }} />
        <StatsCard title="Net Payouts" value={formatCurrency(totalNet)} icon={<Banknote className="h-5 w-5" />} color="blue" />
        <StatsCard title="Commission Paid" value={formatCurrency(totalCommission)} icon={<TrendingUp className="h-5 w-5" />} color="orange" subtitle="12% rate" />
        <StatsCard title="Next Payout" value={formatCurrency(5400)} icon={<Calendar className="h-5 w-5" />} color="purple" subtitle="April 5, 2026" />
      </div>

      <Tabs variant="boxed" tabs={[
        { id: 'overview', label: 'Revenue Chart' },
        { id: 'history', label: 'Payout History', count: payoutHistory.length },
      ]} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <Card>
          <CardHeader><CardTitle>Weekly Revenue</CardTitle></CardHeader>
          <BarChart data={weeklyRevenue} color="bg-emerald-500" height={200} formatValue={(v) => formatCurrency(v)} />
        </Card>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Period</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Orders</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Gross</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Commission</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Net Payout</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payoutHistory.map((payout) => (
                <tr key={payout.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">Week of {formatDate(payout.date)}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{payout.orders}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{formatCurrency(payout.gross)}</td>
                  <td className="py-3 px-4 text-sm text-orange-600">-{formatCurrency(payout.commission)}</td>
                  <td className="py-3 px-4 text-sm font-bold text-emerald-600">{formatCurrency(payout.net)}</td>
                  <td className="py-3 px-4"><Badge variant="success" size="sm"><CheckCircle2 className="h-3 w-3 mr-0.5" /> Paid</Badge></td>
                  <td className="py-3 px-4 text-right"><Button variant="ghost" size="xs" icon={<Download className="h-3 w-3" />}>PDF</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bank Info */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-blue-500" /> Payout Method</CardTitle></CardHeader>
        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200">
          <div className="h-12 w-16 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Chase Business Checking ****4821</p>
            <p className="text-xs text-gray-500">Payouts processed every Friday &middot; Direct deposit</p>
          </div>
          <Button variant="outline" size="sm">Update</Button>
        </div>
      </Card>
    </div>
  );
}
