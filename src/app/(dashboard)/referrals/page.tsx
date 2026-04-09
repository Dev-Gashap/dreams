'use client';

import { useState } from 'react';
import {
  Users,
  Copy,
  Share2,
  Mail,
  MessageSquare,
  Check,
  DollarSign,
  TrendingUp,
  Gift,
  Star,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

const referrals = [
  { id: 'ref_1', name: 'Mike Torres', email: 'mike@torres.com', status: 'active' as const, joinedAt: '2026-03-15', earnedAmount: 50, totalOrders: 12 },
  { id: 'ref_2', name: 'Sarah Chen', email: 'sarah@fieldtech.io', status: 'active' as const, joinedAt: '2026-02-20', earnedAmount: 75, totalOrders: 28 },
  { id: 'ref_3', name: 'James Rodriguez', email: 'james@email.com', status: 'pending' as const, joinedAt: '2026-04-01', earnedAmount: 0, totalOrders: 0 },
  { id: 'ref_4', name: 'Lisa Park', email: 'lisa@company.com', status: 'active' as const, joinedAt: '2026-01-10', earnedAmount: 50, totalOrders: 18 },
];

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'ALEX2026';
  const referralUrl = `https://dreams-delta-virid.vercel.app/register?ref=${referralCode}`;
  const totalEarned = referrals.reduce((s, r) => s + r.earnedAmount, 0);
  const activeReferrals = referrals.filter((r) => r.status === 'active').length;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Referral Program</h1>
        <p className="text-sm text-gray-500 mt-1">Invite friends and earn $50 for each referral that places their first order.</p>
      </div>

      {/* Hero Card */}
      <Card padding="none" className="overflow-hidden">
        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 p-8 text-white">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="h-6 w-6" />
              <span className="text-sm font-bold uppercase tracking-wider">Refer & Earn</span>
            </div>
            <h2 className="text-3xl font-extrabold mb-3">Give $25, Get $50</h2>
            <p className="text-orange-100 mb-6">Your friends get $25 off their first order. You get $50 in store credit when they complete it.</p>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-xs uppercase tracking-wider text-orange-200 mb-1">Your Referral Code</p>
              <div className="flex items-center justify-between">
                <code className="text-2xl font-bold font-mono">{referralCode}</code>
                <button
                  onClick={() => copyToClipboard(referralCode)}
                  className="px-3 py-1.5 bg-white text-orange-600 rounded-lg text-sm font-semibold flex items-center gap-1.5 hover:bg-orange-50 transition-colors"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-gray-900">{referrals.length}</p>
          <p className="text-xs text-gray-500">Total Invited</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-emerald-600">{activeReferrals}</p>
          <p className="text-xs text-gray-500">Active Referrals</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalEarned)}</p>
          <p className="text-xs text-gray-500">Earned</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-purple-600">{referrals.reduce((s, r) => s + r.totalOrders, 0)}</p>
          <p className="text-xs text-gray-500">Their Orders</p>
        </Card>
      </div>

      {/* Share */}
      <Card>
        <CardHeader><CardTitle>Share Your Link</CardTitle></CardHeader>
        <div className="flex gap-2 mb-4">
          <Input value={referralUrl} readOnly className="font-mono text-xs" />
          <Button variant="primary" icon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} onClick={() => copyToClipboard(referralUrl)}>
            {copied ? 'Copied' : 'Copy Link'}
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Email', icon: <Mail className="h-5 w-5" />, color: 'bg-blue-100 text-blue-600 hover:bg-blue-200' },
            { name: 'SMS', icon: <MessageSquare className="h-5 w-5" />, color: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' },
            { name: 'Twitter', icon: <Share2 className="h-5 w-5" />, color: 'bg-sky-100 text-sky-600 hover:bg-sky-200' },
            { name: 'LinkedIn', icon: <Share2 className="h-5 w-5" />, color: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200' },
          ].map((option) => (
            <button key={option.name} className={cn('flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-colors', option.color)}>
              {option.icon}
              {option.name}
            </button>
          ))}
        </div>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader><CardTitle>How It Works</CardTitle></CardHeader>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { step: 1, title: 'Share Your Code', description: 'Send your unique referral link to friends and colleagues', icon: <Share2 className="h-6 w-6" /> },
            { step: 2, title: 'They Sign Up', description: 'They get $25 off their first order when they use your code', icon: <Users className="h-6 w-6" /> },
            { step: 3, title: 'You Earn', description: 'You get $50 in store credit when they complete their first order', icon: <DollarSign className="h-6 w-6" /> },
          ].map((step) => (
            <div key={step.step} className="text-center">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/20">
                {step.icon}
              </div>
              <p className="font-bold text-gray-900">{step.step}. {step.title}</p>
              <p className="text-sm text-gray-500 mt-1">{step.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Referrals List */}
      <Card>
        <CardHeader><CardTitle>Your Referrals</CardTitle></CardHeader>
        <div className="space-y-3">
          {referrals.map((ref) => (
            <div key={ref.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Avatar name={ref.name} size="sm" status={ref.status === 'active' ? 'online' : 'away'} />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{ref.name}</p>
                  <p className="text-xs text-gray-500">{ref.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">{formatCurrency(ref.earnedAmount)}</p>
                  <p className="text-xs text-gray-400">{ref.totalOrders} orders</p>
                </div>
                <Badge variant={ref.status === 'active' ? 'success' : 'warning'} size="sm">
                  {ref.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
