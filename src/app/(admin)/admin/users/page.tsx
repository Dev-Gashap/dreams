'use client';

import { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle2,
  Mail,
  Shield,
  Download,
  Plus,
  User,
  Building2,
  Store,
  Truck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tabs } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { cn, formatDate } from '@/lib/utils';

const mockUsers = [
  { id: '1', name: 'Alex Morgan', email: 'alex@company.com', role: 'business', mode: 'business', company: 'TurnerBuild Inc', orders: 247, spent: 48920, joined: '2025-06-01', status: 'active', verified: true },
  { id: '2', name: 'Mike Torres', email: 'mike@torres.com', role: 'customer', mode: 'personal', company: null, orders: 34, spent: 4250, joined: '2025-08-15', status: 'active', verified: true },
  { id: '3', name: 'Sarah Chen', email: 'sarah@fieldtech.io', role: 'business', mode: 'business', company: 'FieldTech Solutions', orders: 156, spent: 28400, joined: '2025-07-22', status: 'active', verified: true },
  { id: '4', name: 'James Rodriguez', email: 'james@email.com', role: 'driver', mode: 'personal', company: null, orders: 0, spent: 0, joined: '2025-09-10', status: 'active', verified: true },
  { id: '5', name: 'Lisa Park', email: 'lisa@protools.com', role: 'vendor', mode: 'vendor', company: 'Pro Tool Supply', orders: 0, spent: 0, joined: '2025-06-15', status: 'active', verified: true },
  { id: '6', name: 'David Kim', email: 'david@test.com', role: 'customer', mode: 'personal', company: null, orders: 2, spent: 189, joined: '2026-03-20', status: 'suspended', verified: false },
  { id: '7', name: 'Rachel Adams', email: 'rachel@hvacpro.com', role: 'business', mode: 'business', company: 'HVAC Pro Services', orders: 89, spent: 15600, joined: '2025-10-05', status: 'active', verified: true },
  { id: '8', name: 'Carlos Vega', email: 'carlos@email.com', role: 'customer', mode: 'personal', company: null, orders: 12, spent: 1840, joined: '2025-11-18', status: 'active', verified: true },
];

const roleIcons: Record<string, React.ReactNode> = {
  customer: <User className="h-3 w-3" />,
  business: <Building2 className="h-3 w-3" />,
  vendor: <Store className="h-3 w-3" />,
  driver: <Truck className="h-3 w-3" />,
  admin: <Shield className="h-3 w-3" />,
};

const roleColors: Record<string, string> = {
  customer: 'bg-blue-500/20 text-blue-400',
  business: 'bg-purple-500/20 text-purple-400',
  vendor: 'bg-emerald-500/20 text-emerald-400',
  driver: 'bg-orange-500/20 text-orange-400',
  admin: 'bg-red-500/20 text-red-400',
};

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const filteredUsers = mockUsers.filter((u) => {
    const matchesSearch = !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesTab = activeTab === 'all' || (activeTab === 'active' && u.status === 'active') || (activeTab === 'suspended' && u.status === 'suspended');
    return matchesSearch && matchesRole && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-sm text-gray-400 mt-1">{mockUsers.length} total users on the platform.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />} className="border-gray-700 text-gray-300 hover:bg-gray-800">Export</Button>
          <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />}>Add User</Button>
        </div>
      </div>

      <Tabs
        variant="pills"
        tabs={[
          { id: 'all', label: 'All Users', count: mockUsers.length },
          { id: 'active', label: 'Active', count: mockUsers.filter((u) => u.status === 'active').length },
          { id: 'suspended', label: 'Suspended', count: mockUsers.filter((u) => u.status === 'suspended').length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="flex gap-3">
        <div className="flex-1">
          <Input placeholder="Search users..." icon={<Search className="h-4 w-4" />} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500" />
        </div>
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Roles' },
            { value: 'customer', label: 'Customers' },
            { value: 'business', label: 'Business' },
            { value: 'vendor', label: 'Vendors' },
            { value: 'driver', label: 'Drivers' },
          ]}
          className="bg-gray-900 border-gray-700 text-white w-40"
        />
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">User</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Company</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Orders</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Spent</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} size="sm" status={user.status === 'active' ? 'online' : 'offline'} />
                    <div>
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', roleColors[user.role])}>
                    {roleIcons[user.role]} {user.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-400">{user.company || '—'}</td>
                <td className="py-3 px-4 text-sm text-white font-medium">{user.orders}</td>
                <td className="py-3 px-4 text-sm text-white font-medium">${user.spent.toLocaleString()}</td>
                <td className="py-3 px-4 text-sm text-gray-400">{formatDate(user.joined)}</td>
                <td className="py-3 px-4">
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-medium',
                    user.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  )}>
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-800 hover:text-white"><Eye className="h-4 w-4" /></button>
                    <button className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-800 hover:text-white"><Mail className="h-4 w-4" /></button>
                    <button className="p-1.5 rounded-lg text-gray-500 hover:bg-red-500/20 hover:text-red-400"><Ban className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
