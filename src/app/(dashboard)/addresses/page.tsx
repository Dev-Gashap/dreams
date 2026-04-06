'use client';

import { useState } from 'react';
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Star,
  Home,
  Building2,
  Wrench,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { StaticMap } from '@/components/maps/live-map';
import { cn } from '@/lib/utils';
import type { Address } from '@/types';

interface SavedAddress extends Address {
  id: string;
  label: string;
  type: 'home' | 'office' | 'job_site' | 'warehouse' | 'other';
  is_default: boolean;
  notes?: string;
}

const savedAddresses: SavedAddress[] = [
  { id: 'addr_1', label: 'Office / HQ', type: 'office', street: '100 Main Street', city: 'Houston', state: 'TX', zip: '77001', country: 'US', lat: 29.760, lng: -95.370, is_default: true },
  { id: 'addr_2', label: 'Westfield Tower Job Site', type: 'job_site', street: '742 Evergreen Terrace', city: 'Houston', state: 'TX', zip: '77002', country: 'US', lat: 29.762, lng: -95.367, is_default: false, notes: 'Floor 12 — ask for site foreman at entrance' },
  { id: 'addr_3', label: 'Warehouse #3', type: 'warehouse', street: '4500 Warehouse Row', city: 'Houston', state: 'TX', zip: '77003', country: 'US', lat: 29.755, lng: -95.358, is_default: false },
  { id: 'addr_4', label: 'Home', type: 'home', street: '2200 Sunset Blvd', city: 'Houston', state: 'TX', zip: '77005', country: 'US', lat: 29.748, lng: -95.395, is_default: false },
  { id: 'addr_5', label: 'Lone Star Data Center', type: 'job_site', street: '100 Data Center Pkwy', city: 'Dallas', state: 'TX', zip: '75201', country: 'US', lat: 32.78, lng: -96.80, is_default: false, notes: 'Loading dock B — call 15 min before arrival' },
  { id: 'addr_6', label: 'Memorial Park Renovation', type: 'job_site', street: '2200 Construction Ave', city: 'Houston', state: 'TX', zip: '77003', country: 'US', lat: 29.764, lng: -95.382, is_default: false },
];

const typeIcons: Record<string, React.ReactNode> = {
  home: <Home className="h-4 w-4" />,
  office: <Building2 className="h-4 w-4" />,
  job_site: <Wrench className="h-4 w-4" />,
  warehouse: <MapPin className="h-4 w-4" />,
  other: <MapPin className="h-4 w-4" />,
};

const typeColors: Record<string, string> = {
  home: 'bg-blue-100 text-blue-600',
  office: 'bg-purple-100 text-purple-600',
  job_site: 'bg-orange-100 text-orange-600',
  warehouse: 'bg-emerald-100 text-emerald-600',
  other: 'bg-gray-100 text-gray-600',
};

export default function AddressBookPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [addresses, setAddresses] = useState(savedAddresses);

  const setDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, is_default: a.id === id })));
  };

  const removeAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Address Book</h1>
          <p className="text-sm text-gray-500 mt-1">Manage delivery addresses and saved job sites for faster checkout.</p>
        </div>
        <Button variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => setShowAdd(true)}>
          Add Address
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {addresses.map((addr) => (
          <Card key={addr.id} hover className={cn(addr.is_default && 'border-orange-300 ring-1 ring-orange-200')}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', typeColors[addr.type])}>
                  {typeIcons[addr.type]}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{addr.label}</p>
                  <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium', typeColors[addr.type])}>
                    {addr.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
              {addr.is_default && <Badge variant="urgent" size="sm"><Star className="h-3 w-3 mr-0.5" /> Default</Badge>}
            </div>

            <StaticMap address={addr} width={300} height={100} className="w-full mb-3" />

            <p className="text-sm text-gray-700">{addr.street}</p>
            <p className="text-xs text-gray-500">{addr.city}, {addr.state} {addr.zip}</p>
            {addr.notes && (
              <p className="text-xs text-orange-600 mt-2 bg-orange-50 p-2 rounded-lg">{addr.notes}</p>
            )}

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              {!addr.is_default && (
                <button onClick={() => setDefault(addr.id)} className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                  <Star className="h-3 w-3" /> Set Default
                </button>
              )}
              <div className="ml-auto flex gap-1">
                <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => removeAddress(addr.id)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Address Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add New Address">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowAdd(false); }}>
          <Input label="Label" placeholder='e.g., "Westfield Tower Job Site"' required />
          <Select
            label="Type"
            options={[
              { value: 'home', label: 'Home' },
              { value: 'office', label: 'Office' },
              { value: 'job_site', label: 'Job Site' },
              { value: 'warehouse', label: 'Warehouse' },
              { value: 'other', label: 'Other' },
            ]}
            placeholder="Select type"
          />
          <Input label="Street Address" placeholder="742 Evergreen Terrace" icon={<MapPin className="h-4 w-4" />} required />
          <div className="grid grid-cols-3 gap-4">
            <Input label="City" placeholder="Houston" required />
            <Input label="State" placeholder="TX" required />
            <Input label="ZIP" placeholder="77002" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Notes</label>
            <textarea className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none" rows={2} placeholder="Gate code, floor, contact person..." />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600" />
            <span className="text-sm text-gray-700">Set as default delivery address</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="submit" variant="primary" fullWidth icon={<CheckCircle2 className="h-4 w-4" />}>Save Address</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
