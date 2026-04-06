'use client';

import { useState } from 'react';
import { Store, Search, Star, MapPin, CheckCircle2, XCircle, Eye, Clock, Package, DollarSign, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Tabs } from '@/components/ui/tabs';
import { cn, formatCurrency } from '@/lib/utils';
import { mockVendors } from '@/lib/mock-data';

const pendingVendors = [
  { id: 'pv_1', name: 'FastTrack Rentals', type: 'rental_house', city: 'Houston', state: 'TX', appliedAt: '2026-03-30', categories: ['power_tools', 'heavy_equipment'] },
  { id: 'pv_2', name: 'Metro Electrical Supply', type: 'distributor', city: 'Dallas', state: 'TX', appliedAt: '2026-03-31', categories: ['electrical', 'telecom'] },
];

export default function AdminVendorsPage() {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Vendor Management</h1>
          <p className="text-sm text-gray-400 mt-1">Manage vendor partners, applications, and performance.</p>
        </div>
      </div>

      <Tabs
        variant="pills"
        tabs={[
          { id: 'active', label: 'Active Vendors', count: mockVendors.length },
          { id: 'pending', label: 'Pending Applications', count: pendingVendors.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'active' && (
        <div className="space-y-4">
          <Input placeholder="Search vendors..." icon={<Search className="h-4 w-4" />} className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500" />
          {mockVendors.map((vendor) => (
            <div key={vendor.id} className="bg-gray-900 rounded-xl border border-gray-800 p-5 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                    <Store className="h-7 w-7 text-orange-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">{vendor.company_name}</h3>
                      {vendor.is_verified && <Badge variant="success" size="sm"><CheckCircle2 className="h-3 w-3 mr-0.5" /> Verified</Badge>}
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5">{vendor.business_type} &middot; {vendor.address.city}, {vendor.address.state}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="h-4 w-4 fill-amber-400" />
                        <span className="text-sm font-bold">{vendor.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Package className="h-3.5 w-3.5" /> {vendor.total_orders.toLocaleString()} orders
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Clock className="h-3.5 w-3.5" /> {vendor.fulfillment_speed_avg_minutes}m avg
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <MapPin className="h-3.5 w-3.5" /> {vendor.service_radius_miles}mi radius
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{vendor.commission_rate}% commission</span>
                  <Button variant="outline" size="xs" icon={<Eye className="h-3 w-3" />} className="border-gray-700 text-gray-300">View</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingVendors.map((vendor) => (
            <div key={vendor.id} className="bg-gray-900 rounded-xl border border-amber-800/50 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Store className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{vendor.name}</h3>
                    <p className="text-sm text-gray-400">{vendor.type} &middot; {vendor.city}, {vendor.state} &middot; Applied {vendor.appliedAt}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="success" size="sm" icon={<CheckCircle2 className="h-4 w-4" />}>Approve</Button>
                  <Button variant="danger" size="sm" icon={<XCircle className="h-4 w-4" />}>Reject</Button>
                  <Button variant="outline" size="sm" icon={<Eye className="h-4 w-4" />} className="border-gray-700 text-gray-300">Review</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
