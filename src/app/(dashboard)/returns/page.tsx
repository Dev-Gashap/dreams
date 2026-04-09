'use client';

import { useState } from 'react';
import {
  RotateCcw,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Truck,
  Camera,
  AlertTriangle,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tabs } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

interface ReturnRequest {
  id: string;
  number: string;
  orderId: string;
  orderNumber: string;
  productName: string;
  quantity: number;
  reason: 'defective' | 'wrong_item' | 'damaged' | 'not_needed' | 'changed_mind' | 'other';
  reasonText: string;
  status: 'requested' | 'approved' | 'in_transit' | 'received' | 'refunded' | 'denied';
  requestedAt: string;
  refundAmount: number;
  refundMethod: 'original_payment' | 'store_credit' | 'replacement';
  trackingNumber?: string;
}

const returns: ReturnRequest[] = [
  {
    id: 'rt_1',
    number: 'RTN-00012',
    orderId: 'ord_001',
    orderNumber: 'DRM-LK82F-X9A3',
    productName: 'DeWalt 20V MAX XR Hammer Drill Kit',
    quantity: 1,
    reason: 'damaged',
    reasonText: 'Received with cracked housing, cannot use on job site',
    status: 'in_transit',
    requestedAt: '2026-04-01T10:00:00Z',
    refundAmount: 299.99,
    refundMethod: 'replacement',
    trackingNumber: 'DRM-RTN-89234',
  },
  {
    id: 'rt_2',
    number: 'RTN-00011',
    orderId: 'ord_002',
    orderNumber: 'DRM-MN47K-B2C1',
    productName: 'CAT6A Plenum Cable 1000ft Box',
    quantity: 1,
    reason: 'wrong_item',
    reasonText: 'Vendor sent CAT5e instead of CAT6A as ordered',
    status: 'refunded',
    requestedAt: '2026-03-29T14:00:00Z',
    refundAmount: 389.99,
    refundMethod: 'original_payment',
  },
  {
    id: 'rt_3',
    number: 'RTN-00010',
    orderId: 'ord_004',
    orderNumber: 'DRM-AB12C-D3E4',
    productName: '3M Full Face Respirator 6900',
    quantity: 1,
    reason: 'changed_mind',
    reasonText: 'Wrong size, need different model',
    status: 'received',
    requestedAt: '2026-03-25T09:00:00Z',
    refundAmount: 159.99,
    refundMethod: 'store_credit',
  },
];

const reasonLabels: Record<string, string> = {
  defective: 'Defective Product',
  wrong_item: 'Wrong Item Sent',
  damaged: 'Damaged on Arrival',
  not_needed: 'No Longer Needed',
  changed_mind: 'Changed My Mind',
  other: 'Other',
};

const statusColors: Record<string, string> = {
  requested: 'bg-amber-100 text-amber-700',
  approved: 'bg-blue-100 text-blue-700',
  in_transit: 'bg-orange-100 text-orange-700',
  received: 'bg-purple-100 text-purple-700',
  refunded: 'bg-emerald-100 text-emerald-700',
  denied: 'bg-red-100 text-red-700',
};

export default function ReturnsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [showCreate, setShowCreate] = useState(false);

  const filteredReturns = returns.filter((r) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return ['requested', 'approved', 'in_transit', 'received'].includes(r.status);
    if (activeTab === 'completed') return ['refunded', 'denied'].includes(r.status);
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Returns & Refunds</h1>
          <p className="text-sm text-gray-500 mt-1">Request returns and track refund status.</p>
        </div>
        <Button variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => setShowCreate(true)}>
          Request Return
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-gray-900">{returns.length}</p>
          <p className="text-xs text-gray-500">Total Returns</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-orange-600">{returns.filter((r) => ['requested', 'approved', 'in_transit', 'received'].includes(r.status)).length}</p>
          <p className="text-xs text-gray-500">In Progress</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-emerald-600">{returns.filter((r) => r.status === 'refunded').length}</p>
          <p className="text-xs text-gray-500">Refunded</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(returns.reduce((s, r) => s + r.refundAmount, 0))}</p>
          <p className="text-xs text-gray-500">Total Refunded</p>
        </Card>
      </div>

      <Tabs
        variant="pills"
        tabs={[
          { id: 'all', label: 'All Returns', count: returns.length },
          { id: 'pending', label: 'In Progress', count: returns.filter((r) => ['requested', 'approved', 'in_transit', 'received'].includes(r.status)).length },
          { id: 'completed', label: 'Completed', count: returns.filter((r) => ['refunded', 'denied'].includes(r.status)).length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {filteredReturns.length === 0 ? (
        <EmptyState
          icon={<RotateCcw className="h-12 w-12" />}
          title="No returns"
          description="You have not requested any returns. Need to return something?"
          action={{ label: 'Request Return', onClick: () => setShowCreate(true) }}
        />
      ) : (
        <div className="space-y-4">
          {filteredReturns.map((ret) => (
            <Card key={ret.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                    <RotateCcw className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-mono font-semibold text-gray-900">{ret.number}</span>
                      <Badge className={statusColors[ret.status]} variant="custom" size="sm">
                        {ret.status.replace(/_/g, ' ')}
                      </Badge>
                      <Badge variant="default" size="sm">{reasonLabels[ret.reason]}</Badge>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{ret.productName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Qty: {ret.quantity} &middot; Order {ret.orderNumber}</p>
                    <p className="text-xs text-gray-600 mt-2 italic">&quot;{ret.reasonText}&quot;</p>
                    {ret.trackingNumber && (
                      <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                        <Truck className="h-3 w-3" /> Return tracking: {ret.trackingNumber}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">Requested {formatDate(ret.requestedAt)}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(ret.refundAmount)}</p>
                  <p className="text-xs text-gray-500 capitalize">{ret.refundMethod.replace(/_/g, ' ')}</p>
                  {ret.status === 'refunded' && (
                    <Badge variant="success" size="sm" className="mt-2">
                      <CheckCircle2 className="h-3 w-3 mr-0.5" /> Refunded
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Return Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Request a Return" size="md">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowCreate(false); }}>
          <Input label="Order Number" placeholder="DRM-XXXXX-XXXX" required />
          <Select label="Item to Return" options={[
            { value: 'item_1', label: 'DeWalt 20V Hammer Drill — $299.99' },
            { value: 'item_2', label: 'CAT6A Cable Box — $389.99' },
          ]} placeholder="Select item from order" />
          <Input label="Quantity" type="number" defaultValue="1" min="1" />
          <Select label="Reason for Return" options={[
            { value: 'defective', label: 'Defective Product' },
            { value: 'wrong_item', label: 'Wrong Item Sent' },
            { value: 'damaged', label: 'Damaged on Arrival' },
            { value: 'not_needed', label: 'No Longer Needed' },
            { value: 'changed_mind', label: 'Changed My Mind' },
            { value: 'other', label: 'Other' },
          ]} placeholder="Why are you returning this?" />
          <Select label="Preferred Refund Method" options={[
            { value: 'original_payment', label: 'Refund to Original Payment Method' },
            { value: 'store_credit', label: 'Store Credit (faster, +5% bonus)' },
            { value: 'replacement', label: 'Replacement Item' },
          ]} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Details</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
              rows={3}
              placeholder="Provide additional details about your return..."
              required
            />
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
            <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Upload photos (optional)</p>
            <p className="text-xs text-gray-400">Photos help us process your return faster</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">Returns must be requested within 30 days of delivery. Items must be in original condition.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" variant="primary" fullWidth icon={<RotateCcw className="h-4 w-4" />}>Submit Return Request</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
