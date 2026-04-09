'use client';

import { useState } from 'react';
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Code,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  ExternalLink,
  Webhook,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Tabs } from '@/components/ui/tabs';
import { cn, formatRelativeTime, formatDate } from '@/lib/utils';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  scopes: string[];
  createdAt: string;
  lastUsedAt?: string;
  status: 'active' | 'revoked';
  requestsToday: number;
}

const apiKeys: ApiKey[] = [
  {
    id: 'k_1',
    name: 'Production API',
    key: 'drm_live_sk_4f8a9c2e6b1d7e3f9a2c4e6b1d7e3f9a',
    prefix: 'drm_live_sk_4f8a',
    scopes: ['orders.read', 'orders.write', 'dispatch.read', 'tracking.read', 'inventory.read'],
    createdAt: '2026-01-15T10:00:00Z',
    lastUsedAt: '2026-04-01T14:22:00Z',
    status: 'active',
    requestsToday: 342,
  },
  {
    id: 'k_2',
    name: 'Mobile App',
    key: 'drm_live_sk_2c8e1a4d6f9b3e7c2a8e1d4f6b9c3e7a',
    prefix: 'drm_live_sk_2c8e',
    scopes: ['orders.read', 'tracking.read'],
    createdAt: '2026-02-20T10:00:00Z',
    lastUsedAt: '2026-04-01T13:45:00Z',
    status: 'active',
    requestsToday: 1284,
  },
  {
    id: 'k_3',
    name: 'Test/Dev (deprecated)',
    key: 'drm_test_sk_9d3f5b7c1e8a4d6f9b3c5e7a1d4f6b9c',
    prefix: 'drm_test_sk_9d3f',
    scopes: ['orders.read'],
    createdAt: '2026-01-01T10:00:00Z',
    lastUsedAt: '2026-02-15T10:00:00Z',
    status: 'revoked',
    requestsToday: 0,
  },
];

export default function ApiKeysPage() {
  const [activeTab, setActiveTab] = useState('keys');
  const [showCreate, setShowCreate] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [showCreated, setShowCreated] = useState<string | null>(null);

  const handleCreate = () => {
    setShowCreated('drm_live_sk_8a3c5e7f1b9d4a6c8e1f3b5d7a9c2e4f');
    setShowCreate(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Keys & Webhooks</h1>
          <p className="text-sm text-gray-500 mt-1">Build custom integrations with the Dreams API.</p>
        </div>
        <Button variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => setShowCreate(true)}>
          Create API Key
        </Button>
      </div>

      <Tabs
        variant="boxed"
        tabs={[
          { id: 'keys', label: 'API Keys', count: apiKeys.filter((k) => k.status === 'active').length },
          { id: 'webhooks', label: 'Webhooks' },
          { id: 'docs', label: 'Documentation' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'keys' && (
        <>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Active Keys', value: apiKeys.filter((k) => k.status === 'active').length, icon: <Key className="h-5 w-5" />, color: 'bg-emerald-100 text-emerald-600' },
              { label: 'Requests Today', value: '1,626', icon: <Activity className="h-5 w-5" />, color: 'bg-blue-100 text-blue-600' },
              { label: 'Rate Limit', value: '1,000/min', icon: <Clock className="h-5 w-5" />, color: 'bg-orange-100 text-orange-600' },
            ].map((stat) => (
              <Card key={stat.label} padding="sm">
                <div className="flex items-center gap-3">
                  <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', stat.color)}>{stat.icon}</div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-3">
            {apiKeys.map((key) => (
              <Card key={key.id} className={cn(key.status === 'revoked' && 'opacity-60')}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Key className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">{key.name}</span>
                      <Badge variant={key.status === 'active' ? 'success' : 'default'} size="sm">{key.status}</Badge>
                    </div>
                    <code className="text-xs font-mono bg-gray-50 px-2 py-1 rounded text-gray-700">
                      {revealedKey === key.id ? key.key : `${key.prefix}${'•'.repeat(28)}`}
                    </code>
                    <button
                      onClick={() => setRevealedKey(revealedKey === key.id ? null : key.id)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      {revealedKey === key.id ? <EyeOff className="h-3.5 w-3.5 inline" /> : <Eye className="h-3.5 w-3.5 inline" />}
                    </button>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>Created {formatDate(key.createdAt)}</span>
                      {key.lastUsedAt && <span>Last used {formatRelativeTime(key.lastUsedAt)}</span>}
                      <span>{key.requestsToday} requests today</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {key.scopes.map((scope) => (
                        <Badge key={scope} variant="default" size="sm" className="font-mono text-[10px]">{scope}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"><Copy className="h-4 w-4" /></button>
                    <button className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeTab === 'webhooks' && (
        <div className="space-y-4">
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Webhook className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">https://api.yourcompany.com/webhooks/dreams</p>
                  <p className="text-xs text-gray-500 mt-0.5">Listening to: order.created, order.delivered, dispatch.assigned</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <Badge variant="success" size="sm">Active</Badge>
                    <span>Last delivery: 5 min ago</span>
                    <span>99.8% success rate</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </Card>
          <Button variant="primary" icon={<Plus className="h-4 w-4" />}>Add Webhook Endpoint</Button>
        </div>
      )}

      {activeTab === 'docs' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Code className="h-5 w-5 text-orange-600" /> Quick Start</CardTitle>
            </CardHeader>
            <p className="text-sm text-gray-600 mb-4">Get started with the Dreams API in minutes.</p>
            <div className="bg-gray-900 rounded-xl p-4 text-sm text-gray-100 font-mono overflow-x-auto">
              <pre>{`curl -X GET https://api.dreams.app/v1/orders \\
  -H "Authorization: Bearer drm_live_sk_..." \\
  -H "Content-Type: application/json"`}</pre>
            </div>
          </Card>

          <Card>
            <CardHeader><CardTitle>Available Endpoints</CardTitle></CardHeader>
            <div className="space-y-2">
              {[
                { method: 'GET', path: '/v1/orders', description: 'List all orders' },
                { method: 'POST', path: '/v1/orders', description: 'Create a new order' },
                { method: 'GET', path: '/v1/orders/{id}', description: 'Get order details' },
                { method: 'GET', path: '/v1/dispatch/{id}', description: 'Get dispatch tracking' },
                { method: 'GET', path: '/v1/products', description: 'Search products' },
                { method: 'POST', path: '/v1/webhooks', description: 'Register webhook endpoint' },
              ].map((ep) => (
                <div key={ep.path} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <span className={cn(
                    'px-2 py-0.5 rounded text-xs font-bold font-mono',
                    ep.method === 'GET' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                  )}>{ep.method}</span>
                  <code className="text-sm font-mono text-gray-900">{ep.path}</code>
                  <span className="text-xs text-gray-500">{ep.description}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" icon={<ExternalLink className="h-4 w-4" />} className="mt-4">
              Full API Reference
            </Button>
          </Card>
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create API Key">
        <div className="space-y-4">
          <Input label="Key Name" placeholder="Production API" required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scopes</label>
            <div className="space-y-2">
              {[
                { id: 'orders.read', label: 'orders.read', description: 'Read order data' },
                { id: 'orders.write', label: 'orders.write', description: 'Create and modify orders' },
                { id: 'dispatch.read', label: 'dispatch.read', description: 'Read dispatch and tracking data' },
                { id: 'inventory.read', label: 'inventory.read', description: 'Read product inventory' },
                { id: 'inventory.write', label: 'inventory.write', description: 'Update inventory levels' },
              ].map((scope) => (
                <label key={scope.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" defaultChecked={scope.id.endsWith('.read')} className="h-4 w-4 rounded border-gray-300 text-orange-600 mt-0.5" />
                  <div>
                    <code className="text-xs font-mono text-gray-900">{scope.label}</code>
                    <p className="text-xs text-gray-500">{scope.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button variant="primary" fullWidth icon={<Key className="h-4 w-4" />} onClick={handleCreate}>Create Key</Button>
          </div>
        </div>
      </Modal>

      {/* Show Created Key Once */}
      {showCreated && (
        <Modal isOpen={!!showCreated} onClose={() => setShowCreated(null)} title="API Key Created" size="md">
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900">Save this key now</p>
                <p className="text-xs text-amber-700 mt-0.5">You will only see this key once. Store it somewhere safe.</p>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <code className="text-sm font-mono text-emerald-400 break-all">{showCreated}</code>
            </div>
            <Button variant="primary" fullWidth icon={<Copy className="h-4 w-4" />}>Copy to Clipboard</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
