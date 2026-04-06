'use client';

import { useState } from 'react';
import {
  Users,
  Plus,
  Mail,
  Shield,
  Crown,
  Settings,
  MoreVertical,
  UserPlus,
  Trash2,
  Edit,
  Search,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Select } from '@/components/ui/select';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { mockTeamMembers } from '@/lib/mock-data';
import type { TeamRole } from '@/types';

const roleConfig: Record<TeamRole, { label: string; color: string; icon: React.ReactNode }> = {
  owner: { label: 'Owner', color: 'bg-amber-100 text-amber-700', icon: <Crown className="h-3 w-3" /> },
  admin: { label: 'Admin', color: 'bg-purple-100 text-purple-700', icon: <Shield className="h-3 w-3" /> },
  manager: { label: 'Manager', color: 'bg-blue-100 text-blue-700', icon: <Users className="h-3 w-3" /> },
  dispatcher: { label: 'Dispatcher', color: 'bg-orange-100 text-orange-700', icon: <Settings className="h-3 w-3" /> },
  technician: { label: 'Technician', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 className="h-3 w-3" /> },
  viewer: { label: 'Viewer', color: 'bg-gray-100 text-gray-700', icon: <Users className="h-3 w-3" /> },
};

export default function TeamPage() {
  const [showInvite, setShowInvite] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = mockTeamMembers.filter((m) =>
    m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage team members, roles, and spending permissions.</p>
        </div>
        <Button variant="primary" icon={<UserPlus className="h-4 w-4" />} onClick={() => setShowInvite(true)}>
          Invite Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-gray-900">{mockTeamMembers.length}</p>
          <p className="text-xs text-gray-500">Total Members</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-emerald-600">{mockTeamMembers.filter((m) => m.is_active).length}</p>
          <p className="text-xs text-gray-500">Active</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-blue-600">{mockTeamMembers.filter((m) => m.role === 'manager' || m.role === 'admin').length}</p>
          <p className="text-xs text-gray-500">Admins/Managers</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-orange-600">{mockTeamMembers.filter((m) => m.requires_approval).length}</p>
          <p className="text-xs text-gray-500">Require Approval</p>
        </Card>
      </div>

      <Input placeholder="Search team members..." icon={<Search className="h-4 w-4" />} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

      {/* Team Members Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Member</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Department</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Spending Limit</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Approval</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => {
              const role = roleConfig[member.role];
              return (
                <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={member.full_name} size="sm" status={member.is_active ? 'online' : 'offline'} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.full_name}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={role.color} variant="custom" size="sm">
                      {role.icon} {role.label}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{member.department || '—'}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {member.spending_limit ? formatCurrency(member.spending_limit) : 'Unlimited'}
                  </td>
                  <td className="py-3 px-4">
                    {member.requires_approval ? (
                      <Badge variant="warning" size="sm">Required</Badge>
                    ) : (
                      <Badge variant="success" size="sm">Not Required</Badge>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={member.is_active ? 'success' : 'default'} size="sm" dot>
                      {member.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {member.role !== 'owner' && (
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><Edit className="h-4 w-4" /></button>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      <Modal isOpen={showInvite} onClose={() => setShowInvite(false)} title="Invite Team Member">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowInvite(false); }}>
          <Input label="Email Address" type="email" placeholder="colleague@company.com" icon={<Mail className="h-4 w-4" />} required />
          <Input label="Full Name" type="text" placeholder="John Smith" required />
          <Select
            label="Role"
            options={[
              { value: 'admin', label: 'Admin — Full platform access' },
              { value: 'manager', label: 'Manager — Approve orders, manage team' },
              { value: 'dispatcher', label: 'Dispatcher — Manage deliveries' },
              { value: 'technician', label: 'Technician — Place orders (may need approval)' },
              { value: 'viewer', label: 'Viewer — Read-only access' },
            ]}
            placeholder="Select a role"
          />
          <Input label="Department" type="text" placeholder="e.g., HVAC, Electrical, IT" />
          <Input label="Spending Limit" type="number" placeholder="500" icon={<DollarSign className="h-4 w-4" />} hint="Leave empty for unlimited" />
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600" defaultChecked />
            <span className="text-sm text-gray-700">Require approval for orders</span>
          </label>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowInvite(false)}>Cancel</Button>
            <Button type="submit" variant="primary" fullWidth icon={<Mail className="h-4 w-4" />}>Send Invitation</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
