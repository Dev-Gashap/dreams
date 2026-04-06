'use client';

import { Settings, Globe, DollarSign, Truck, Shield, Bell, Database, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Configure global platform settings.</p>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><DollarSign className="h-5 w-5 text-orange-400" /> Commission & Fees</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Default Commission Rate (%)" type="number" defaultValue="12" className="bg-gray-800 border-gray-700 text-white" />
          <Input label="Standard Delivery Fee ($)" type="number" step="0.01" defaultValue="12.99" className="bg-gray-800 border-gray-700 text-white" />
          <Input label="Urgent Fee ($)" type="number" step="0.01" defaultValue="15.00" className="bg-gray-800 border-gray-700 text-white" />
          <Input label="Critical Fee ($)" type="number" step="0.01" defaultValue="35.00" className="bg-gray-800 border-gray-700 text-white" />
          <Input label="Tax Rate (%)" type="number" step="0.01" defaultValue="8.25" className="bg-gray-800 border-gray-700 text-white" />
          <Input label="Driver Base Pay ($)" type="number" step="0.01" defaultValue="8.50" className="bg-gray-800 border-gray-700 text-white" />
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Truck className="h-5 w-5 text-orange-400" /> Delivery Settings</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Max Delivery Radius (miles)" type="number" defaultValue="50" className="bg-gray-800 border-gray-700 text-white" />
          <Input label="Drone Max Weight (lbs)" type="number" defaultValue="5" className="bg-gray-800 border-gray-700 text-white" />
          <Select label="Default Delivery Method" options={[
            { value: 'auto', label: 'Auto-select fastest' },
            { value: 'third_party_courier', label: 'Third-party Courier' },
            { value: 'internal_driver', label: 'Internal Driver' },
          ]} className="bg-gray-800 border-gray-700 text-white" />
          <Input label="ETA Buffer (minutes)" type="number" defaultValue="10" className="bg-gray-800 border-gray-700 text-white" />
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Shield className="h-5 w-5 text-orange-400" /> Security</h2>
        <div className="space-y-3">
          {[
            { label: 'Require email verification for new accounts', checked: true },
            { label: 'Require 2FA for admin accounts', checked: true },
            { label: 'Auto-suspend accounts after 5 failed login attempts', checked: true },
            { label: 'Require vendor identity verification', checked: true },
            { label: 'Enable rate limiting on API endpoints', checked: true },
          ].map((setting) => (
            <label key={setting.label} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 cursor-pointer">
              <span className="text-sm text-gray-300">{setting.label}</span>
              <input type="checkbox" defaultChecked={setting.checked} className="h-4 w-4 rounded border-gray-600 text-orange-600 bg-gray-700" />
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" size="lg" icon={<Save className="h-5 w-5" />}>Save All Settings</Button>
      </div>
    </div>
  );
}
