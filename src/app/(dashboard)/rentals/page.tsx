'use client';

import { useState } from 'react';
import {
  Key,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  RotateCcw,
  Package,
  MapPin,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/ui/stats-card';
import { Tabs } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { cn, formatCurrency, formatDate, formatDateTime } from '@/lib/utils';

const mockRentals = [
  {
    id: 'rental_001',
    product_name: 'Hilti TE 70-ATC/AVR Rotary Hammer',
    brand: 'Hilti',
    sku: 'HLT-TE70-ATC',
    vendor_name: 'Pro Tool Supply',
    rental_period: 'weekly',
    daily_rate: 125,
    deposit: 750,
    start_date: '2026-03-28T08:00:00Z',
    end_date: '2026-04-04T18:00:00Z',
    status: 'active' as const,
    total_cost: 875,
    job_site: 'Westfield Tower - Floor 12',
    return_location: '1250 Industrial Blvd, Houston TX',
  },
  {
    id: 'rental_002',
    product_name: 'Fiber Optic Fusion Splicer Kit',
    brand: 'Signalfire',
    sku: 'FO-SPLICE-6M',
    vendor_name: 'ElectroParts Direct',
    rental_period: 'daily',
    daily_rate: 150,
    deposit: 1000,
    start_date: '2026-04-01T07:00:00Z',
    end_date: '2026-04-01T19:00:00Z',
    status: 'active' as const,
    total_cost: 150,
    job_site: 'Lone Star Data Center',
    return_location: '890 Tech Park Dr, Dallas TX',
  },
  {
    id: 'rental_003',
    product_name: 'Ridgid K-400 Drum Machine Drain Cleaner',
    brand: 'Ridgid',
    sku: 'RDG-K400-AF',
    vendor_name: 'BuildRight Materials',
    rental_period: 'daily',
    daily_rate: 85,
    deposit: 300,
    start_date: '2026-03-25T08:00:00Z',
    end_date: '2026-03-25T18:00:00Z',
    status: 'returned' as const,
    total_cost: 85,
    job_site: '555 Elm Street, Austin TX',
    return_location: '4500 Warehouse Row, Austin TX',
  },
];

export default function RentalsPage() {
  const [activeTab, setActiveTab] = useState('active');

  const activeRentals = mockRentals.filter((r) => r.status === 'active');
  const pastRentals = mockRentals.filter((r) => r.status === 'returned');

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rentals</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your tool and equipment rentals.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Rentals" value={activeRentals.length} icon={<Key className="h-5 w-5" />} color="purple" />
        <StatsCard title="Total Deposits" value={formatCurrency(activeRentals.reduce((s, r) => s + r.deposit, 0))} icon={<DollarSign className="h-5 w-5" />} color="blue" />
        <StatsCard title="Due Soon" value={activeRentals.filter((r) => getDaysRemaining(r.end_date) <= 2).length} icon={<AlertTriangle className="h-5 w-5" />} color="amber" />
        <StatsCard title="Lifetime Rentals" value={mockRentals.length} icon={<RotateCcw className="h-5 w-5" />} color="green" />
      </div>

      <Tabs
        variant="pills"
        tabs={[
          { id: 'active', label: 'Active', count: activeRentals.length },
          { id: 'history', label: 'History', count: pastRentals.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeRentals.length === 0 ? (
            <EmptyState
              icon={<Key className="h-12 w-12" />}
              title="No Active Rentals"
              description="You do not have any active equipment rentals. Browse the marketplace to rent tools."
              action={{ label: 'Browse Rentals', onClick: () => window.location.href = '/marketplace' }}
            />
          ) : (
            activeRentals.map((rental) => {
              const daysLeft = getDaysRemaining(rental.end_date);
              const isUrgent = daysLeft <= 1;
              const isDueSoon = daysLeft <= 2;

              return (
                <Card key={rental.id} className={cn(isUrgent && 'border-red-200 bg-red-50/30', isDueSoon && !isUrgent && 'border-amber-200 bg-amber-50/30')}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'h-14 w-14 rounded-xl flex items-center justify-center flex-shrink-0',
                        isUrgent ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-purple-600'
                      )}>
                        <Key className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{rental.product_name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{rental.brand} &middot; SKU: {rental.sku} &middot; {rental.vendor_name}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {formatDate(rental.start_date)} → {formatDate(rental.end_date)}
                            </span>
                          </div>
                          <Badge variant={isUrgent ? 'danger' : isDueSoon ? 'warning' : 'info'} size="sm" dot={isDueSoon} pulse={isUrgent}>
                            {daysLeft <= 0 ? 'Due Today' : `${daysLeft}d remaining`}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {rental.job_site}</span>
                          <span className="flex items-center gap-1"><RotateCcw className="h-3 w-3" /> Return: {rental.return_location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-500">Rate: {formatCurrency(rental.daily_rate)}/{rental.rental_period}</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{formatCurrency(rental.total_cost)}</p>
                      <p className="text-xs text-gray-500">Deposit: {formatCurrency(rental.deposit)}</p>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="xs" icon={<Clock className="h-3 w-3" />}>Extend</Button>
                        <Button variant={isUrgent ? 'danger' : 'primary'} size="xs" icon={<RotateCcw className="h-3 w-3" />}>Return</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-3">
          {pastRentals.map((rental) => (
            <Card key={rental.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{rental.product_name}</p>
                    <p className="text-xs text-gray-500">{formatDate(rental.start_date)} → {formatDate(rental.end_date)} &middot; {rental.vendor_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(rental.total_cost)}</p>
                  <Badge variant="success" size="sm">Returned</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
