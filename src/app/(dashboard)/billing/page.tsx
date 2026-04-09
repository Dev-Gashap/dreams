'use client';

import { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Star,
  Zap,
  Download,
  ArrowUpRight,
  Calendar,
  DollarSign,
  Users,
  Package,
  Shield,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Tabs } from '@/components/ui/tabs';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    period: 'Forever Free',
    description: 'For individuals and solo contractors',
    features: [
      'Up to 10 orders per month',
      'Standard delivery only',
      'Basic search & sourcing',
      'Email support',
      'Personal mode only',
      'Mobile app access',
    ],
    limits: {
      orders_per_month: 10,
      team_members: 1,
      api_calls: 0,
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 79,
    period: 'per month',
    description: 'For growing teams and businesses',
    popular: true,
    features: [
      'Unlimited orders',
      'Urgent & critical delivery',
      'Full sourcing engine',
      'Up to 10 team members',
      'Approval workflows',
      'Live tracking & dispatch',
      'Phone & chat support',
      'Spending reports',
      'Recurring orders',
      'Address book',
    ],
    limits: {
      orders_per_month: -1,
      team_members: 10,
      api_calls: 1000,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'Custom approval chains',
      'API access (unlimited)',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantees',
      'White-label options',
      'SSO / SAML',
      'Custom contracts',
    ],
    limits: {
      orders_per_month: -1,
      team_members: -1,
      api_calls: -1,
    },
  },
];

const invoices = [
  { id: 'inv_001', number: 'INV-2026-0042', date: '2026-04-01', amount: 79.00, status: 'paid', plan: 'Professional', period: 'Apr 2026' },
  { id: 'inv_002', number: 'INV-2026-0041', date: '2026-03-01', amount: 79.00, status: 'paid', plan: 'Professional', period: 'Mar 2026' },
  { id: 'inv_003', number: 'INV-2026-0040', date: '2026-02-01', amount: 79.00, status: 'paid', plan: 'Professional', period: 'Feb 2026' },
  { id: 'inv_004', number: 'INV-2026-0039', date: '2026-01-01', amount: 79.00, status: 'paid', plan: 'Professional', period: 'Jan 2026' },
];

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const currentPlan = 'professional';
  const usage = { orders: 247, members: 6, apiCalls: 342 };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your plan, payment methods, and invoices.</p>
      </div>

      <Tabs
        variant="boxed"
        tabs={[
          { id: 'overview', label: 'Current Plan' },
          { id: 'plans', label: 'Change Plan' },
          { id: 'invoices', label: 'Invoices', count: invoices.length },
          { id: 'payment', label: 'Payment Method' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Current Plan Card */}
          <Card className="bg-gradient-to-br from-orange-50 via-white to-red-50 border-orange-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-orange-600 fill-orange-500" />
                  <h2 className="text-2xl font-extrabold text-gray-900">Professional Plan</h2>
                </div>
                <p className="text-gray-600">For growing teams and businesses</p>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">$79</span>
                  <span className="text-gray-500">/ month</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Next billing date: April 30, 2026</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="urgent" icon={<ArrowUpRight className="h-4 w-4" />} onClick={() => { setActiveTab('plans'); }}>
                  Upgrade Plan
                </Button>
                <Button variant="ghost" size="sm">Cancel Plan</Button>
              </div>
            </div>
          </Card>

          {/* Usage */}
          <Card>
            <CardHeader><CardTitle>Plan Usage</CardTitle></CardHeader>
            <div className="space-y-4">
              {[
                { label: 'Orders this month', current: usage.orders, max: -1, icon: <Package className="h-4 w-4" />, color: 'bg-orange-500' },
                { label: 'Team members', current: usage.members, max: 10, icon: <Users className="h-4 w-4" />, color: 'bg-blue-500' },
                { label: 'API calls today', current: usage.apiCalls, max: 1000, icon: <Zap className="h-4 w-4" />, color: 'bg-purple-500' },
              ].map((item) => {
                const pct = item.max > 0 ? (item.current / item.max) * 100 : 0;
                const isUnlimited = item.max === -1;
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="text-gray-400">{item.icon}</div>
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {item.current} {isUnlimited ? '(unlimited)' : `/ ${item.max}`}
                      </span>
                    </div>
                    {!isUnlimited && (
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full', item.color)} style={{ width: `${Math.min(100, pct)}%` }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            return (
              <Card key={plan.id} className={cn(
                plan.popular && 'border-orange-500 shadow-lg shadow-orange-500/10 relative',
                isCurrent && 'ring-2 ring-emerald-500'
              )}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="urgent">Most Popular</Badge>
                  </div>
                )}
                {isCurrent && (
                  <Badge variant="success" className="mb-2"><CheckCircle2 className="h-3 w-3 mr-0.5" /> Current Plan</Badge>
                )}
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  {typeof plan.price === 'number' ? (
                    <>
                      <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                      <span className="text-gray-500">/{plan.period.includes('month') ? 'mo' : ''}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-extrabold text-gray-900">{plan.price}</span>
                  )}
                </div>
                <Button variant={isCurrent ? 'outline' : plan.popular ? 'urgent' : 'primary'} fullWidth size="lg" className="mt-6" disabled={isCurrent}>
                  {isCurrent ? 'Current Plan' : plan.id === 'enterprise' ? 'Contact Sales' : 'Switch Plan'}
                </Button>
                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Invoice</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Plan</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Period</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-mono font-semibold text-gray-900">{invoice.number}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{formatDate(invoice.date)}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{invoice.plan}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{invoice.period}</td>
                  <td className="py-3 px-4 text-sm font-bold text-gray-900">{formatCurrency(invoice.amount)}</td>
                  <td className="py-3 px-4">
                    <Badge variant="success" size="sm"><CheckCircle2 className="h-3 w-3 mr-0.5" /> Paid</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="xs" icon={<Download className="h-3 w-3" />}>PDF</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'payment' && (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
            <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-orange-200 bg-orange-50">
              <div className="h-12 w-16 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">Visa ending in 4242</p>
                <p className="text-xs text-gray-500">Expires 12/2027 &middot; Default payment method</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="ghost" size="sm">Remove</Button>
              </div>
            </div>
            <Button variant="outline" size="sm" icon={<CreditCard className="h-4 w-4" />} className="mt-3">
              Add Payment Method
            </Button>
          </Card>

          <Card>
            <CardHeader><CardTitle>Billing Address</CardTitle></CardHeader>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-medium">TurnerBuild Inc.</p>
              <p>100 Main Street</p>
              <p>Houston, TX 77001</p>
              <p>United States</p>
              <p className="text-xs text-gray-500 mt-2">Tax ID: 87-1234567</p>
            </div>
            <Button variant="outline" size="sm" className="mt-3">Update Address</Button>
          </Card>
        </div>
      )}
    </div>
  );
}
