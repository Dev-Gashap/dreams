'use client';

import { useState } from 'react';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Users,
  Package,
  PieChart,
  ArrowUpRight,
  Wallet,
  Target,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { StatsCard } from '@/components/ui/stats-card';
import { Badge } from '@/components/ui/badge';
import { BarChart, DonutChart } from '@/components/dashboard/analytics-charts';
import { cn, formatCurrency } from '@/lib/utils';

const spendingByDepartment = [
  { name: 'HVAC', spent: 14200, budget: 20000 },
  { name: 'Electrical', spent: 12800, budget: 15000 },
  { name: 'Field Operations', spent: 9400, budget: 12000 },
  { name: 'IT / Networking', spent: 8200, budget: 10000 },
  { name: 'Plumbing', spent: 4320, budget: 8000 },
];

const spendingByMember = [
  { name: 'Mike Torres', role: 'Manager', orders: 42, spent: 12400 },
  { name: 'Carlos Vega', role: 'Technician', orders: 28, spent: 6800 },
  { name: 'Rachel Kim', role: 'Technician', orders: 24, spent: 5200 },
  { name: 'Lisa Park', role: 'Dispatcher', orders: 18, spent: 8400 },
  { name: 'David Chen', role: 'Admin', orders: 12, spent: 3100 },
];

const monthlySpending = [
  { date: 'Oct', value: 32000 },
  { date: 'Nov', value: 38000 },
  { date: 'Dec', value: 28000 },
  { date: 'Jan', value: 42000 },
  { date: 'Feb', value: 36000 },
  { date: 'Mar', value: 48920 },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState('this_month');

  const totalBudget = spendingByDepartment.reduce((s, d) => s + d.budget, 0);
  const totalSpent = spendingByDepartment.reduce((s, d) => s + d.spent, 0);
  const budgetUsed = ((totalSpent / totalBudget) * 100).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Spending Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Track company spending, budgets, and team ordering patterns.</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onChange={(e) => setPeriod(e.target.value)} options={[
            { value: 'this_month', label: 'This Month' },
            { value: 'last_month', label: 'Last Month' },
            { value: 'q1', label: 'Q1 2026' },
            { value: 'ytd', label: 'Year to Date' },
          ]} />
          <Button variant="outline" icon={<Download className="h-4 w-4" />}>Export Report</Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Spent" value={formatCurrency(totalSpent)} icon={<DollarSign className="h-5 w-5" />} color="orange" trend={{ value: 12, label: 'vs last month' }} />
        <StatsCard title="Budget Used" value={`${budgetUsed}%`} icon={<Target className="h-5 w-5" />} color="blue" />
        <StatsCard title="Total Orders" value="247" icon={<Package className="h-5 w-5" />} color="purple" trend={{ value: 8, label: 'vs last month' }} />
        <StatsCard title="Avg Order Value" value={formatCurrency(totalSpent / 247)} icon={<Wallet className="h-5 w-5" />} color="green" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Spending Trend */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Monthly Spending Trend</CardTitle></CardHeader>
            <BarChart data={monthlySpending} color="bg-orange-500" height={200} formatValue={(v) => formatCurrency(v)} />
          </Card>
        </div>

        {/* Budget Overview */}
        <Card>
          <CardHeader><CardTitle>Budget Overview</CardTitle></CardHeader>
          <div className="text-center mb-4">
            <p className="text-3xl font-extrabold text-gray-900">{budgetUsed}%</p>
            <p className="text-sm text-gray-500">of {formatCurrency(totalBudget)} budget</p>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                parseFloat(budgetUsed) > 90 ? 'bg-red-500' : parseFloat(budgetUsed) > 75 ? 'bg-amber-500' : 'bg-emerald-500'
              )}
              style={{ width: `${Math.min(100, parseFloat(budgetUsed))}%` }}
            />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Spent</span><span className="font-bold">{formatCurrency(totalSpent)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Remaining</span><span className="font-bold text-emerald-600">{formatCurrency(totalBudget - totalSpent)}</span></div>
          </div>
          {parseFloat(budgetUsed) > 80 && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <span className="text-xs text-amber-700">Approaching budget limit</span>
            </div>
          )}
        </Card>
      </div>

      {/* Department Spending */}
      <Card>
        <CardHeader>
          <CardTitle>Spending by Department</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          {spendingByDepartment.map((dept) => {
            const pct = (dept.spent / dept.budget) * 100;
            return (
              <div key={dept.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-900">{dept.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">{formatCurrency(dept.spent)} / {formatCurrency(dept.budget)}</span>
                    <Badge variant={pct > 90 ? 'danger' : pct > 75 ? 'warning' : 'success'} size="sm">
                      {pct.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      pct > 90 ? 'bg-red-500' : pct > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                    )}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Top Spenders */}
      <Card>
        <CardHeader><CardTitle>Team Member Spending</CardTitle></CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Member</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Orders</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Total Spent</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Avg Order</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Share</th>
              </tr>
            </thead>
            <tbody>
              {spendingByMember.map((member) => (
                <tr key={member.name} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{member.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{member.role}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{member.orders}</td>
                  <td className="py-3 px-4 text-sm font-bold text-gray-900">{formatCurrency(member.spent)}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{formatCurrency(member.spent / member.orders)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(member.spent / spendingByMember[0].spent) * 100}%` }} />
                      </div>
                      <span className="text-xs text-gray-400">{((member.spent / totalSpent) * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Spending by Category */}
      <Card>
        <CardHeader><CardTitle>Spending by Category</CardTitle></CardHeader>
        <DonutChart
          segments={[
            { label: 'Power Tools', value: 18500, color: '#f97316' },
            { label: 'Electrical', value: 12400, color: '#3b82f6' },
            { label: 'Networking', value: 8900, color: '#8b5cf6' },
            { label: 'Plumbing', value: 4200, color: '#06b6d4' },
            { label: 'Safety', value: 3600, color: '#10b981' },
            { label: 'Other', value: 1320, color: '#6b7280' },
          ]}
          size={160}
          centerValue={formatCurrency(totalSpent)}
          centerLabel="total"
        />
      </Card>
    </div>
  );
}
