'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  MapPin,
  Clock,
  DollarSign,
  Truck,
  Zap,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Route,
  Navigation,
  Timer,
  Star,
  Weight,
  Phone,
  ArrowRight,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils';

interface DeliveryRequest {
  id: string;
  orderNumber: string;
  priority: 'standard' | 'urgent' | 'critical';
  pickupVendor: string;
  pickupAddress: string;
  pickupDistance: number;
  deliveryAddress: string;
  deliveryDistance: number;
  totalDistance: number;
  itemCount: number;
  totalWeight: number;
  payout: number;
  surge: number;
  estimatedMinutes: number;
  expiresIn: number;
  customerName: string;
  items: string[];
  requestedAt: string;
}

const availableDeliveries: DeliveryRequest[] = [
  {
    id: 'd_1',
    orderNumber: 'DRM-LK82F-X9A3',
    priority: 'urgent',
    pickupVendor: 'Pro Tool Supply',
    pickupAddress: '1250 Industrial Blvd',
    pickupDistance: 1.2,
    deliveryAddress: '742 Evergreen Terrace',
    deliveryDistance: 4.8,
    totalDistance: 6.0,
    itemCount: 1,
    totalWeight: 8.5,
    payout: 22.50,
    surge: 1.5,
    estimatedMinutes: 38,
    expiresIn: 45,
    customerName: 'Alex M.',
    items: ['DeWalt 20V Hammer Drill Kit'],
    requestedAt: '2026-04-22T14:10:00Z',
  },
  {
    id: 'd_2',
    orderNumber: 'DRM-MN47K-B2C1',
    priority: 'critical',
    pickupVendor: 'ElectroParts Direct',
    pickupAddress: '890 Tech Park Dr',
    pickupDistance: 2.4,
    deliveryAddress: 'Lone Star Data Center',
    deliveryDistance: 8.2,
    totalDistance: 10.6,
    itemCount: 3,
    totalWeight: 42.0,
    payout: 48.00,
    surge: 2.0,
    estimatedMinutes: 52,
    expiresIn: 30,
    customerName: 'Sarah C.',
    items: ['CAT6A Cable Box', 'Fluke 117 Multimeter x2', 'Tool kit'],
    requestedAt: '2026-04-22T14:08:00Z',
  },
  {
    id: 'd_3',
    orderNumber: 'DRM-AB12C-D3E4',
    priority: 'standard',
    pickupVendor: 'BuildRight Materials',
    pickupAddress: '4500 Warehouse Row',
    pickupDistance: 3.1,
    deliveryAddress: '555 Elm Street',
    deliveryDistance: 2.8,
    totalDistance: 5.9,
    itemCount: 5,
    totalWeight: 18.0,
    payout: 15.75,
    surge: 1.0,
    estimatedMinutes: 45,
    expiresIn: 120,
    customerName: 'Mike T.',
    items: ['Copper pipe x 3', 'Fittings kit', 'Solder'],
    requestedAt: '2026-04-22T14:05:00Z',
  },
];

const activeDeliveries = [
  {
    id: 'a_1',
    orderNumber: 'DRM-PQ99R-T5F8',
    status: 'en_route_to_pickup' as const,
    pickupVendor: 'Pro Tool Supply',
    deliveryAddress: '200 Commerce St',
    eta: 8,
    payout: 28.00,
    customerName: 'James R.',
    customerPhone: '+1-713-555-0234',
  },
];

const completedToday = [
  { id: 'c_1', orderNumber: 'DRM-EF34G-H7I8', time: '1:15 PM', duration: '32 min', payout: 18.00, tip: 5.00, rating: 5 },
  { id: 'c_2', orderNumber: 'DRM-JK67L-M9N2', time: '11:45 AM', duration: '28 min', payout: 22.50, tip: 3.00, rating: 5 },
  { id: 'c_3', orderNumber: 'DRM-OP23Q-R4S6', time: '10:20 AM', duration: '45 min', payout: 32.00, tip: 8.00, rating: 4 },
];

const priorityConfig: Record<string, { label: string; color: string; surge?: string }> = {
  critical: { label: 'CRITICAL', color: 'bg-red-100 text-red-700 border border-red-300' },
  urgent: { label: 'URGENT', color: 'bg-orange-100 text-orange-700 border border-orange-300' },
  standard: { label: 'STANDARD', color: 'bg-gray-100 text-gray-700' },
};

export default function DriverDeliveriesPage() {
  const [activeTab, setActiveTab] = useState('available');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deliveries</h1>
          <p className="text-sm text-gray-500 mt-1">Available requests and your active deliveries.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-semibold text-emerald-700">You are Online</span>
        </div>
      </div>

      {/* Earnings Strip */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-gray-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Today&apos;s Earnings</p>
              <p className="text-3xl font-extrabold mt-1">{formatCurrency(184.50)}</p>
            </div>
            <div className="h-12 w-px bg-gray-700" />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Completed</p>
              <p className="text-2xl font-bold mt-1">{completedToday.length}</p>
            </div>
            <div className="h-12 w-px bg-gray-700 hidden sm:block" />
            <div className="hidden sm:block">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Rating</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <p className="text-2xl font-bold">4.9</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 rounded-lg px-3 py-2">
            <TrendingUp className="h-4 w-4 text-orange-400" />
            <div>
              <p className="text-xs font-bold text-orange-400">Surge Active</p>
              <p className="text-[11px] text-orange-300">Up to 2.0x in Downtown</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        variant="boxed"
        tabs={[
          { id: 'available', label: 'Available', icon: <Zap className="h-4 w-4" />, count: availableDeliveries.length },
          { id: 'active', label: 'Active', icon: <Truck className="h-4 w-4" />, count: activeDeliveries.length },
          { id: 'completed', label: 'Completed Today', icon: <CheckCircle2 className="h-4 w-4" />, count: completedToday.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Search */}
      {activeTab === 'available' && (
        <div className="flex gap-3">
          <div className="flex-1">
            <Input placeholder="Search by vendor, address..." icon={<Search className="h-4 w-4" />} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Button variant="outline" icon={<Filter className="h-4 w-4" />}>Filters</Button>
        </div>
      )}

      {/* Available Deliveries */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          {availableDeliveries.length === 0 ? (
            <EmptyState icon={<Package className="h-12 w-12" />} title="No deliveries available" description="We'll show new requests here as they come in." />
          ) : (
            availableDeliveries.map((d) => {
              const priority = priorityConfig[d.priority];
              return (
                <Card key={d.id} className="hover:border-orange-300 transition-colors">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Main info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider', priority.color)}>
                          {d.priority === 'critical' && <Zap className="h-3 w-3 inline -mt-0.5 mr-0.5" />}
                          {priority.label}
                        </span>
                        {d.surge > 1 && (
                          <Badge variant="urgent" size="sm">
                            <TrendingUp className="h-3 w-3 mr-0.5" /> {d.surge}x surge
                          </Badge>
                        )}
                        <span className="text-sm font-mono font-semibold text-gray-900">{d.orderNumber}</span>
                        <span className="text-xs text-gray-400">&middot; {formatRelativeTime(d.requestedAt)}</span>
                      </div>

                      {/* Route */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                              <Package className="h-4 w-4" />
                            </div>
                            <div className="w-0.5 h-6 bg-gray-200 my-1" />
                            <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                              <MapPin className="h-4 w-4" />
                            </div>
                          </div>
                          <div className="flex-1 space-y-4">
                            <div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-gray-900">{d.pickupVendor}</p>
                                <span className="text-xs text-gray-500">{d.pickupDistance} mi away</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">{d.pickupAddress}</p>
                            </div>
                            <div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-gray-900">{d.deliveryAddress}</p>
                                <span className="text-xs text-gray-500">{d.deliveryDistance} mi</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">Customer: {d.customerName}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Items & Details */}
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Package className="h-3.5 w-3.5" /> {d.itemCount} item{d.itemCount !== 1 ? 's' : ''}</span>
                        <span className="flex items-center gap-1"><Weight className="h-3.5 w-3.5" /> {d.totalWeight} lbs</span>
                        <span className="flex items-center gap-1"><Route className="h-3.5 w-3.5" /> {d.totalDistance} mi total</span>
                        <span className="flex items-center gap-1"><Timer className="h-3.5 w-3.5" /> ~{d.estimatedMinutes} min</span>
                      </div>
                      {d.items.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2 italic line-clamp-1">{d.items.join(', ')}</p>
                      )}
                    </div>

                    {/* Payout & Actions */}
                    <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 lg:min-w-[180px]">
                      <div className="text-right">
                        <p className="text-3xl font-extrabold text-emerald-600">{formatCurrency(d.payout)}</p>
                        <p className="text-[11px] text-gray-500 uppercase font-semibold tracking-wider">Payout{d.surge > 1 ? ' + surge' : ''}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-orange-600">
                          <Clock className="h-3 w-3" /> Expires in {d.expiresIn}s
                        </div>
                      </div>
                      <div className="flex gap-2 lg:flex-col lg:w-full">
                        <Link href={`/driver/deliveries/${d.id}`} className="flex-1 lg:w-full">
                          <Button variant="success" size="md" fullWidth icon={<CheckCircle2 className="h-4 w-4" />}>
                            Accept
                          </Button>
                        </Link>
                        <Button variant="outline" size="md" icon={<XCircle className="h-4 w-4" />}>
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Active Deliveries */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeDeliveries.length === 0 ? (
            <EmptyState icon={<Truck className="h-12 w-12" />} title="No active deliveries" description="Accept a delivery to get started." />
          ) : (
            activeDeliveries.map((d) => (
              <Card key={d.id} className="border-2 border-orange-500 bg-gradient-to-br from-orange-50 to-white">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                      <Truck className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono font-semibold text-gray-900">{d.orderNumber}</span>
                        <Badge variant="urgent" size="sm" dot pulse>Active</Badge>
                      </div>
                      <p className="text-sm text-gray-700">En route to {d.pickupVendor}</p>
                      <p className="text-xs text-gray-500">Delivery: {d.deliveryAddress}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-orange-600">{d.eta}m</p>
                    <p className="text-xs text-gray-500 uppercase font-semibold">ETA</p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="xs" icon={<Phone className="h-3 w-3" />}>Call</Button>
                      <Link href={`/driver/deliveries/${d.id}`}>
                        <Button variant="urgent" size="xs" icon={<ArrowRight className="h-3 w-3" />}>Open</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Completed Today */}
      {activeTab === 'completed' && (
        <div className="space-y-3">
          {completedToday.map((d) => (
            <Card key={d.id} padding="sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{d.orderNumber}</p>
                    <p className="text-xs text-gray-500">Completed at {d.time} &middot; {d.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: d.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(d.payout + d.tip)}</p>
                    {d.tip > 0 && <p className="text-[10px] text-emerald-600">incl. {formatCurrency(d.tip)} tip</p>}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
