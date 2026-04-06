'use client';

import { useState } from 'react';
import { AlertTriangle, MessageSquare, CheckCircle2, XCircle, Clock, Eye, DollarSign, User, Store } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils';

const disputes = [
  { id: 'd_1', orderNumber: 'DRM-AB12C-D3E4', customer: 'Mike Torres', vendor: 'Pro Tool Supply', type: 'damaged_item', reason: 'DeWalt drill arrived with cracked housing. Cannot use on job site.', amount: 299.99, status: 'open' as const, priority: 'high' as const, createdAt: '2026-04-01T10:00:00Z', messages: 3 },
  { id: 'd_2', orderNumber: 'DRM-EF56G-H7I8', customer: 'Sarah Chen', vendor: 'ElectroParts Direct', type: 'wrong_item', reason: 'Ordered CAT6A cable but received CAT5e. Need correct cable for data center install.', amount: 389.99, status: 'open' as const, priority: 'medium' as const, createdAt: '2026-03-31T14:00:00Z', messages: 5 },
  { id: 'd_3', orderNumber: 'DRM-JK90L-M1N2', customer: 'Carlos Vega', vendor: 'BuildRight Materials', type: 'late_delivery', reason: 'Order was marked urgent but delivered 2 hours late. Caused project delay.', amount: 15.00, status: 'open' as const, priority: 'low' as const, createdAt: '2026-03-30T09:00:00Z', messages: 2 },
  { id: 'd_4', orderNumber: 'DRM-OP34Q-R5S6', customer: 'Rachel Adams', vendor: 'Pro Tool Supply', type: 'missing_item', reason: 'Order was supposed to include 4 respirators but only 3 were in the box.', amount: 159.99, status: 'resolved' as const, priority: 'medium' as const, createdAt: '2026-03-28T11:00:00Z', messages: 7 },
];

const priorityColors: Record<string, string> = {
  high: 'bg-red-500/20 text-red-400',
  medium: 'bg-amber-500/20 text-amber-400',
  low: 'bg-blue-500/20 text-blue-400',
};

const typeLabels: Record<string, string> = {
  damaged_item: 'Damaged Item',
  wrong_item: 'Wrong Item Sent',
  late_delivery: 'Late Delivery',
  missing_item: 'Missing Item',
  overcharge: 'Overcharge',
  quality: 'Quality Issue',
};

export default function AdminDisputesPage() {
  const [activeTab, setActiveTab] = useState('open');

  const openDisputes = disputes.filter((d) => d.status === 'open');
  const resolvedDisputes = disputes.filter((d) => d.status === 'resolved');
  const currentList = activeTab === 'open' ? openDisputes : resolvedDisputes;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dispute Resolution</h1>
        <p className="text-sm text-gray-400 mt-1">Handle customer and vendor disputes.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Open Disputes', value: openDisputes.length, icon: <AlertTriangle className="h-5 w-5" />, color: 'bg-red-500/20 text-red-400' },
          { label: 'High Priority', value: openDisputes.filter((d) => d.priority === 'high').length, icon: <AlertTriangle className="h-5 w-5" />, color: 'bg-amber-500/20 text-amber-400' },
          { label: 'Resolved (30d)', value: resolvedDisputes.length, icon: <CheckCircle2 className="h-5 w-5" />, color: 'bg-emerald-500/20 text-emerald-400' },
          { label: 'Total Refunded', value: formatCurrency(459.98), icon: <DollarSign className="h-5 w-5" />, color: 'bg-purple-500/20 text-purple-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center mb-3', stat.color)}>{stat.icon}</div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <Tabs
        variant="pills"
        tabs={[
          { id: 'open', label: 'Open', count: openDisputes.length },
          { id: 'resolved', label: 'Resolved', count: resolvedDisputes.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {currentList.length === 0 ? (
        <EmptyState icon={<CheckCircle2 className="h-12 w-12" />} title="No disputes" description="All clear — no open disputes." />
      ) : (
        <div className="space-y-4">
          {currentList.map((dispute) => (
            <div key={dispute.id} className={cn('bg-gray-900 rounded-xl border p-5', dispute.status === 'open' ? 'border-gray-800' : 'border-gray-800/50')}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-mono font-semibold text-white">{dispute.orderNumber}</span>
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', priorityColors[dispute.priority])}>
                      {dispute.priority}
                    </span>
                    <Badge variant="default" size="sm" className="bg-gray-800 text-gray-400">
                      {typeLabels[dispute.type]}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300">{dispute.reason}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {dispute.customer}</span>
                    <span className="flex items-center gap-1"><Store className="h-3 w-3" /> {dispute.vendor}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {dispute.messages} messages</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatRelativeTime(dispute.createdAt)}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-white">{formatCurrency(dispute.amount)}</p>
                  <div className="flex gap-2 mt-2">
                    {dispute.status === 'open' && (
                      <>
                        <Button variant="success" size="xs" icon={<DollarSign className="h-3 w-3" />}>Refund</Button>
                        <Button variant="outline" size="xs" icon={<XCircle className="h-3 w-3" />} className="border-gray-700 text-gray-300">Deny</Button>
                      </>
                    )}
                    <Button variant="outline" size="xs" icon={<Eye className="h-3 w-3" />} className="border-gray-700 text-gray-300">View</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
