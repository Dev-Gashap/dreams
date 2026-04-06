'use client';

import { useState } from 'react';
import { FileText, Search, Filter, Download, User, Shield, Clock, Eye, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatDateTime } from '@/lib/utils';

const auditEvents = [
  { id: 'ae_1', timestamp: '2026-04-01T14:22:00Z', actor: 'Alex Morgan', actorRole: 'admin', action: 'order.created', resource: 'Order DRM-LK82F-X9A3', details: 'Created urgent order for DeWalt Hammer Drill', ip: '192.168.1.45' },
  { id: 'ae_2', timestamp: '2026-04-01T14:20:00Z', actor: 'System', actorRole: 'system', action: 'dispatch.assigned', resource: 'Dispatch DSP-001', details: 'Auto-assigned driver Marcus Johnson to order DRM-LK82F-X9A3', ip: '10.0.0.1' },
  { id: 'ae_3', timestamp: '2026-04-01T13:15:00Z', actor: 'Alex Morgan', actorRole: 'admin', action: 'approval.approved', resource: 'Approval APR-002', details: 'Approved $1,802.76 order from Carlos Vega', ip: '192.168.1.45' },
  { id: 'ae_4', timestamp: '2026-04-01T10:30:00Z', actor: 'Rachel Kim', actorRole: 'technician', action: 'order.created', resource: 'Order DRM-PQ29R', details: 'Requested fiber splicer kit rental ($2,499)', ip: '192.168.1.78' },
  { id: 'ae_5', timestamp: '2026-04-01T09:00:00Z', actor: 'Carlos Vega', actorRole: 'technician', action: 'order.created', resource: 'Order DRM-AB12C', details: 'Created order for drain cleaner rental', ip: '192.168.1.92' },
  { id: 'ae_6', timestamp: '2026-03-31T16:00:00Z', actor: 'Admin', actorRole: 'admin', action: 'vendor.approved', resource: 'Vendor FastTrack Rentals', details: 'Approved vendor application for FastTrack Rentals LLC', ip: '10.0.0.1' },
  { id: 'ae_7', timestamp: '2026-03-31T14:30:00Z', actor: 'System', actorRole: 'system', action: 'payment.captured', resource: 'Payment PI-28491', details: 'Captured $1,802.76 for order DRM-MN47K-B2C1', ip: '10.0.0.1' },
  { id: 'ae_8', timestamp: '2026-03-31T12:00:00Z', actor: 'Mike Torres', actorRole: 'manager', action: 'team.invited', resource: 'User david@company.com', details: 'Invited David Chen as Admin to company account', ip: '192.168.1.55' },
  { id: 'ae_9', timestamp: '2026-03-31T10:00:00Z', actor: 'Admin', actorRole: 'admin', action: 'settings.updated', resource: 'Platform Settings', details: 'Updated commission rate from 15% to 12%', ip: '10.0.0.1' },
  { id: 'ae_10', timestamp: '2026-03-30T09:00:00Z', actor: 'System', actorRole: 'system', action: 'user.suspended', resource: 'User david@test.com', details: 'Auto-suspended after 5 failed login attempts', ip: '10.0.0.1' },
];

const actionColors: Record<string, string> = {
  'order.created': 'bg-blue-500/20 text-blue-400',
  'order.cancelled': 'bg-red-500/20 text-red-400',
  'dispatch.assigned': 'bg-orange-500/20 text-orange-400',
  'approval.approved': 'bg-emerald-500/20 text-emerald-400',
  'approval.rejected': 'bg-red-500/20 text-red-400',
  'payment.captured': 'bg-emerald-500/20 text-emerald-400',
  'payment.refunded': 'bg-amber-500/20 text-amber-400',
  'vendor.approved': 'bg-emerald-500/20 text-emerald-400',
  'team.invited': 'bg-purple-500/20 text-purple-400',
  'settings.updated': 'bg-amber-500/20 text-amber-400',
  'user.suspended': 'bg-red-500/20 text-red-400',
};

export default function AuditLogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filtered = auditEvents.filter((e) => {
    const matchesSearch = !searchQuery || e.actor.toLowerCase().includes(searchQuery.toLowerCase()) || e.details.toLowerCase().includes(searchQuery.toLowerCase()) || e.resource.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'all' || e.action.startsWith(actionFilter);
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Log</h1>
          <p className="text-sm text-gray-400 mt-1">Complete activity log for compliance and security monitoring.</p>
        </div>
        <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />} className="border-gray-700 text-gray-300">Export Log</Button>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <Input placeholder="Search events..." icon={<Search className="h-4 w-4" />} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500" />
        </div>
        <Select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} options={[
          { value: 'all', label: 'All Actions' },
          { value: 'order', label: 'Orders' },
          { value: 'dispatch', label: 'Dispatch' },
          { value: 'approval', label: 'Approvals' },
          { value: 'payment', label: 'Payments' },
          { value: 'vendor', label: 'Vendors' },
          { value: 'team', label: 'Team' },
          { value: 'settings', label: 'Settings' },
          { value: 'user', label: 'Users' },
        ]} className="bg-gray-900 border-gray-700 text-white w-40" />
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Timestamp</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actor</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Action</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Resource</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Details</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">IP</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((event) => (
              <tr key={event.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                <td className="py-3 px-4 text-xs text-gray-400 font-mono whitespace-nowrap">{formatDateTime(event.timestamp)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white">{event.actor}</span>
                    <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium',
                      event.actorRole === 'admin' ? 'bg-red-500/20 text-red-400' :
                      event.actorRole === 'system' ? 'bg-gray-700 text-gray-400' :
                      'bg-blue-500/20 text-blue-400'
                    )}>{event.actorRole}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={cn('px-2 py-0.5 rounded text-xs font-mono font-medium', actionColors[event.action] || 'bg-gray-700 text-gray-400')}>
                    {event.action}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-300">{event.resource}</td>
                <td className="py-3 px-4 text-xs text-gray-500 max-w-xs truncate">{event.details}</td>
                <td className="py-3 px-4 text-xs text-gray-600 font-mono">{event.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
