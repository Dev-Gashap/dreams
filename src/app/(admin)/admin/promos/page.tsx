'use client';

import { useState } from 'react';
import { Tag, Plus, Edit, Trash2, Copy, CheckCircle2, XCircle, Calendar, DollarSign, Percent, Users, Package } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

interface PromoCode {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_delivery';
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'disabled';
  targetAudience: 'all' | 'new_users' | 'business' | 'specific';
}

const promos: PromoCode[] = [
  { id: 'pc_1', code: 'DREAMS20', description: '20% off first order', type: 'percentage', value: 20, minOrder: 50, maxUses: 1000, usedCount: 342, startDate: '2026-03-01', endDate: '2026-04-30', status: 'active', targetAudience: 'new_users' },
  { id: 'pc_2', code: 'URGENTSAVE', description: '$10 off urgent delivery fee', type: 'fixed', value: 10, minOrder: 0, maxUses: 500, usedCount: 128, startDate: '2026-03-15', endDate: '2026-04-15', status: 'active', targetAudience: 'all' },
  { id: 'pc_3', code: 'FREEDELIVERY', description: 'Free standard delivery', type: 'free_delivery', value: 0, minOrder: 100, maxUses: 200, usedCount: 200, startDate: '2026-02-01', endDate: '2026-03-31', status: 'expired', targetAudience: 'all' },
  { id: 'pc_4', code: 'BIZ50', description: '$50 off for business accounts', type: 'fixed', value: 50, minOrder: 250, maxUses: 100, usedCount: 47, startDate: '2026-04-01', endDate: '2026-06-30', status: 'active', targetAudience: 'business' },
];

export default function AdminPromosPage() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Promo Codes</h1>
          <p className="text-sm text-gray-400 mt-1">Manage discount codes, promotions, and campaigns.</p>
        </div>
        <Button variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => setShowCreate(true)}>Create Promo</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Promos', value: promos.filter((p) => p.status === 'active').length, icon: <Tag className="h-5 w-5" />, color: 'bg-emerald-500/20 text-emerald-400' },
          { label: 'Total Redemptions', value: promos.reduce((s, p) => s + p.usedCount, 0), icon: <Users className="h-5 w-5" />, color: 'bg-blue-500/20 text-blue-400' },
          { label: 'Revenue Impact', value: '-$8,420', icon: <DollarSign className="h-5 w-5" />, color: 'bg-orange-500/20 text-orange-400' },
          { label: 'Conversion Rate', value: '34%', icon: <Percent className="h-5 w-5" />, color: 'bg-purple-500/20 text-purple-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center mb-3', stat.color)}>{stat.icon}</div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {promos.map((promo) => (
          <div key={promo.id} className={cn('bg-gray-900 rounded-xl border p-5', promo.status === 'active' ? 'border-gray-800' : 'border-gray-800/50 opacity-60')}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <code className="px-3 py-1 bg-gray-800 rounded-lg text-orange-400 font-mono font-bold text-lg">{promo.code}</code>
                  <Badge variant={promo.status === 'active' ? 'success' : promo.status === 'expired' ? 'default' : 'danger'} size="sm">
                    {promo.status}
                  </Badge>
                  <Badge variant="info" size="sm">
                    {promo.type === 'percentage' ? `${promo.value}% off` : promo.type === 'fixed' ? `${formatCurrency(promo.value)} off` : 'Free Delivery'}
                  </Badge>
                  <Badge variant="default" size="sm" className="bg-gray-800 text-gray-400">
                    {promo.targetAudience === 'all' ? 'All Users' : promo.targetAudience === 'new_users' ? 'New Users' : promo.targetAudience === 'business' ? 'Business' : 'Specific'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-300">{promo.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(promo.startDate)} — {formatDate(promo.endDate)}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {promo.usedCount} / {promo.maxUses} used</span>
                  {promo.minOrder > 0 && <span className="flex items-center gap-1"><Package className="h-3 w-3" /> Min order: {formatCurrency(promo.minOrder)}</span>}
                </div>
                <div className="mt-2 w-48 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(promo.usedCount / promo.maxUses) * 100}%` }} />
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-800 hover:text-white"><Copy className="h-4 w-4" /></button>
                <button className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-800 hover:text-white"><Edit className="h-4 w-4" /></button>
                <button className="p-1.5 rounded-lg text-gray-500 hover:bg-red-500/20 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Promo Code">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowCreate(false); }}>
          <Input label="Promo Code" placeholder="DREAMS20" hint="Uppercase, no spaces" required />
          <Input label="Description" placeholder="20% off first order for new users" required />
          <Select label="Discount Type" options={[
            { value: 'percentage', label: 'Percentage Off' },
            { value: 'fixed', label: 'Fixed Amount Off' },
            { value: 'free_delivery', label: 'Free Delivery' },
          ]} placeholder="Select type" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Discount Value" type="number" placeholder="20" />
            <Input label="Min Order Amount" type="number" placeholder="50" icon={<DollarSign className="h-4 w-4" />} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" required />
            <Input label="End Date" type="date" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Max Uses" type="number" placeholder="1000" />
            <Select label="Target Audience" options={[
              { value: 'all', label: 'All Users' },
              { value: 'new_users', label: 'New Users Only' },
              { value: 'business', label: 'Business Accounts' },
            ]} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" variant="primary" fullWidth icon={<Tag className="h-4 w-4" />}>Create Promo</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
