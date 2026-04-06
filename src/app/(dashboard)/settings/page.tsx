'use client';

import { useState } from 'react';
import {
  User,
  Building2,
  Bell,
  CreditCard,
  Shield,
  Palette,
  Globe,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Key,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tabs } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { useAuthStore } from '@/store';

export default function SettingsPage() {
  const { user, accountMode } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
    ...(accountMode === 'business' ? [{ id: 'company', label: 'Company', icon: <Building2 className="h-4 w-4" /> }] : []),
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="underline" />

      {activeTab === 'profile' && (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <Avatar name={user?.full_name || 'User'} size="xl" />
                <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg hover:bg-orange-700 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{user?.full_name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <p className="text-xs text-gray-400 mt-1">Member since {user?.created_at ? new Date(user.created_at).getFullYear() : '2025'}</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full Name" defaultValue={user?.full_name} icon={<User className="h-4 w-4" />} />
              <Input label="Email" type="email" defaultValue={user?.email} icon={<Mail className="h-4 w-4" />} />
              <Input label="Phone" type="tel" defaultValue={user?.phone} icon={<Phone className="h-4 w-4" />} />
              <Select
                label="Account Mode"
                value={accountMode}
                options={[
                  { value: 'personal', label: 'Personal' },
                  { value: 'business', label: 'Business' },
                  { value: 'vendor', label: 'Vendor' },
                ]}
              />
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="primary" icon={<Save className="h-4 w-4" />}>Save Changes</Button>
            </div>
          </Card>

          <Card>
            <CardHeader><CardTitle>Default Delivery Address</CardTitle></CardHeader>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Street Address" placeholder="123 Main St" icon={<MapPin className="h-4 w-4" />} />
              <Input label="Unit/Suite" placeholder="Apt 4B" />
              <Input label="City" placeholder="Houston" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="State" placeholder="TX" />
                <Input label="ZIP Code" placeholder="77001" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="primary" icon={<Save className="h-4 w-4" />}>Save Address</Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'company' && (
        <Card>
          <CardHeader><CardTitle>Company Information</CardTitle></CardHeader>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Company Name" placeholder="Your Company Inc." icon={<Building2 className="h-4 w-4" />} />
            <Select label="Industry" options={[
              { value: 'construction', label: 'Construction' },
              { value: 'electrical', label: 'Electrical' },
              { value: 'plumbing', label: 'Plumbing' },
              { value: 'hvac', label: 'HVAC' },
              { value: 'telecom', label: 'Telecom' },
              { value: 'other', label: 'Other' },
            ]} placeholder="Select industry" />
            <Select label="Company Size" options={[
              { value: 'solo', label: '1 (Solo)' },
              { value: 'small', label: '2-10' },
              { value: 'medium', label: '11-50' },
              { value: 'large', label: '51-200' },
              { value: 'enterprise', label: '200+' },
            ]} placeholder="Select size" />
            <Input label="Tax ID" placeholder="XX-XXXXXXX" />
            <Input label="Billing Email" type="email" placeholder="billing@company.com" />
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="primary" icon={<Save className="h-4 w-4" />}>Save Company Info</Button>
          </div>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card>
          <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
          <div className="space-y-4">
            {[
              { label: 'Order updates', description: 'Get notified when your order status changes', email: true, push: true },
              { label: 'Delivery alerts', description: 'Driver assigned, nearby, and delivered notifications', email: true, push: true },
              { label: 'Approval requests', description: 'When team members request order approvals', email: true, push: true },
              { label: 'Rental reminders', description: 'Return date reminders for active rentals', email: true, push: false },
              { label: 'Payment receipts', description: 'Confirmation when payments are processed', email: true, push: false },
              { label: 'Marketing & promotions', description: 'Product deals, vendor offers, and platform updates', email: false, push: false },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{pref.label}</p>
                  <p className="text-xs text-gray-500">{pref.description}</p>
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={pref.email} className="h-4 w-4 rounded border-gray-300 text-orange-600" />
                    <span className="text-xs text-gray-500">Email</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={pref.push} className="h-4 w-4 rounded border-gray-300 text-orange-600" />
                    <span className="text-xs text-gray-500">Push</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="primary" icon={<Save className="h-4 w-4" />}>Save Preferences</Button>
          </div>
        </Card>
      )}

      {activeTab === 'billing' && (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Current Plan</CardTitle></CardHeader>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
              <div>
                <p className="text-lg font-bold text-gray-900">Professional Plan</p>
                <p className="text-sm text-gray-600">$79/month — billed monthly</p>
              </div>
              <Button variant="outline">Upgrade Plan</Button>
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle>Payment Methods</CardTitle></CardHeader>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200">
              <div className="h-10 w-16 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                <p className="text-xs text-gray-500">Expires 12/2027</p>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
            <Button variant="outline" size="sm" className="mt-3" icon={<CreditCard className="h-4 w-4" />}>
              Add Payment Method
            </Button>
          </Card>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
            <div className="space-y-4 max-w-md">
              <Input label="Current Password" type="password" icon={<Key className="h-4 w-4" />} />
              <Input label="New Password" type="password" icon={<Key className="h-4 w-4" />} />
              <Input label="Confirm New Password" type="password" icon={<Key className="h-4 w-4" />} />
            </div>
            <div className="mt-6">
              <Button variant="primary" icon={<Save className="h-4 w-4" />}>Update Password</Button>
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle>Two-Factor Authentication</CardTitle></CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">Add an extra layer of security to your account.</p>
                <p className="text-xs text-gray-500 mt-1">Currently disabled</p>
              </div>
              <Button variant="outline" icon={<Shield className="h-4 w-4" />}>Enable 2FA</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
