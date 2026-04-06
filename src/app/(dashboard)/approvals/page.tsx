'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Zap,
  Package,
  DollarSign,
  MessageSquare,
  User,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Tabs } from '@/components/ui/tabs';
import { Modal } from '@/components/ui/modal';
import { EmptyState } from '@/components/ui/empty-state';
import { cn, formatCurrency, formatRelativeTime, formatStatus, getPriorityColor } from '@/lib/utils';
import { mockApprovals } from '@/lib/mock-data';
import type { ApprovalRequest } from '@/types';

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [responseNote, setResponseNote] = useState('');

  const pendingApprovals = mockApprovals.filter((a) => a.status === 'pending');
  const resolvedApprovals = mockApprovals.filter((a) => a.status !== 'pending');

  const handleApprove = (id: string) => {
    setSelectedApproval(null);
    setResponseNote('');
  };

  const handleReject = (id: string) => {
    setSelectedApproval(null);
    setResponseNote('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Approvals</h1>
        <p className="text-sm text-gray-500 mt-1">Review and approve order requests from your team.</p>
      </div>

      {pendingApprovals.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            You have <span className="font-bold">{pendingApprovals.length}</span> pending approval request{pendingApprovals.length !== 1 ? 's' : ''} requiring your attention.
          </p>
        </div>
      )}

      <Tabs
        variant="pills"
        tabs={[
          { id: 'pending', label: 'Pending', count: pendingApprovals.length },
          { id: 'resolved', label: 'Resolved', count: resolvedApprovals.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 className="h-12 w-12" />}
              title="All caught up"
              description="There are no pending approvals right now. Your team is all set."
            />
          ) : (
            pendingApprovals.map((approval) => (
              <Card key={approval.id} className="border-l-4 border-l-amber-400">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar name={approval.requested_by_name} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{approval.requested_by_name}</h3>
                        <Badge className={getPriorityColor(approval.priority)} variant="custom" size="sm">
                          {approval.priority === 'urgent' && <Zap className="h-3 w-3 mr-0.5" />}
                          {formatStatus(approval.priority)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{approval.reason}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Package className="h-3.5 w-3.5" />
                          {approval.items_summary}
                        </div>
                        <span className="text-gray-300">|</span>
                        <span className="text-xs text-gray-400">{formatRelativeTime(approval.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(approval.amount)}</p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="success" size="sm" icon={<CheckCircle2 className="h-4 w-4" />} onClick={() => handleApprove(approval.id)}>
                        Approve
                      </Button>
                      <Button variant="danger" size="sm" icon={<XCircle className="h-4 w-4" />} onClick={() => setSelectedApproval(approval)}>
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'resolved' && (
        <div className="space-y-3">
          {resolvedApprovals.length === 0 ? (
            <EmptyState
              icon={<Clock className="h-12 w-12" />}
              title="No resolved approvals"
              description="Resolved approvals will appear here."
            />
          ) : (
            resolvedApprovals.map((approval) => (
              <Card key={approval.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={approval.requested_by_name} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{approval.requested_by_name}</p>
                      <p className="text-xs text-gray-500">{approval.items_summary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">{formatCurrency(approval.amount)}</span>
                    <Badge variant={approval.status === 'approved' ? 'success' : 'danger'} size="sm">
                      {approval.status === 'approved' ? 'Approved' : 'Rejected'}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Reject Modal */}
      {selectedApproval && (
        <Modal isOpen={!!selectedApproval} onClose={() => setSelectedApproval(null)} title="Reject Request" size="sm">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to reject the request from <strong>{selectedApproval.requested_by_name}</strong> for{' '}
              <strong>{formatCurrency(selectedApproval.amount)}</strong>?
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason (optional)</label>
              <textarea
                value={responseNote}
                onChange={(e) => setResponseNote(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
                rows={3}
                placeholder="Explain why this request is being rejected..."
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setSelectedApproval(null)}>Cancel</Button>
              <Button variant="danger" fullWidth icon={<XCircle className="h-4 w-4" />} onClick={() => handleReject(selectedApproval.id)}>
                Confirm Rejection
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
