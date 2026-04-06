'use client';

import { useState } from 'react';
import {
  Truck,
  MapPin,
  Clock,
  User,
  Phone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Navigation,
  Package,
  Plus,
  Filter,
  Search,
  Star,
  Zap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Tabs } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { cn, formatStatus, formatETA, getStatusColor } from '@/lib/utils';
import { mockDrivers, mockDispatches, mockOrders } from '@/lib/mock-data';

export default function DispatchPage() {
  const [activeTab, setActiveTab] = useState('drivers');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dispatch Center</h1>
          <p className="text-sm text-gray-500 mt-1">Manage drivers, assign deliveries, and monitor dispatch operations.</p>
        </div>
        <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
          Add Driver
        </Button>
      </div>

      <Tabs
        variant="boxed"
        tabs={[
          { id: 'drivers', label: 'Drivers', icon: <Truck className="h-4 w-4" />, count: mockDrivers.length },
          { id: 'active', label: 'Active Dispatches', icon: <Navigation className="h-4 w-4" />, count: mockDispatches.length },
          { id: 'map', label: 'Map View', icon: <MapPin className="h-4 w-4" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'drivers' && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card padding="sm" className="text-center">
              <p className="text-2xl font-bold text-gray-900">{mockDrivers.length}</p>
              <p className="text-xs text-gray-500">Total Drivers</p>
            </Card>
            <Card padding="sm" className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{mockDrivers.filter((d) => d.is_available).length}</p>
              <p className="text-xs text-gray-500">Available</p>
            </Card>
            <Card padding="sm" className="text-center">
              <p className="text-2xl font-bold text-orange-600">{mockDrivers.filter((d) => !d.is_available && d.is_active).length}</p>
              <p className="text-xs text-gray-500">On Delivery</p>
            </Card>
            <Card padding="sm" className="text-center">
              <p className="text-2xl font-bold text-gray-400">{mockDrivers.filter((d) => !d.is_active).length}</p>
              <p className="text-xs text-gray-500">Offline</p>
            </Card>
          </div>

          {/* Driver List */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockDrivers.map((driver) => (
              <Card key={driver.id} hover>
                <div className="flex items-start gap-4">
                  <Avatar name={driver.full_name} size="lg" status={driver.is_available ? 'online' : driver.is_active ? 'busy' : 'offline'} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">{driver.full_name}</h3>
                      <Badge variant={driver.is_available ? 'success' : driver.is_active ? 'warning' : 'default'} size="sm">
                        {driver.is_available ? 'Available' : driver.is_active ? 'On Delivery' : 'Offline'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{driver.vehicle_make} {driver.vehicle_model} - {driver.vehicle_plate}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{driver.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">{driver.total_deliveries} deliveries</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                        {driver.vehicle_type}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                        Max {driver.max_weight_lbs} lbs
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                        {driver.service_area_miles} mi range
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <Button variant="outline" size="xs" icon={<Phone className="h-3 w-3" />}>Call</Button>
                      <Button variant="outline" size="xs" icon={<MapPin className="h-3 w-3" />}>Locate</Button>
                      {driver.is_available && (
                        <Button variant="primary" size="xs" icon={<Truck className="h-3 w-3" />}>Assign</Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'active' && (
        <div className="space-y-4">
          {mockDispatches.map((dispatch) => {
            const order = mockOrders.find((o) => o.id === dispatch.order_id);
            return (
              <Card key={dispatch.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar name={dispatch.driver_name || 'Driver'} size="md" status="busy" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{dispatch.driver_name}</h3>
                        <Badge className={getStatusColor(dispatch.status)} variant="custom" size="sm">
                          {formatStatus(dispatch.status)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {dispatch.vehicle_type} - {dispatch.vehicle_plate} | Order: {order?.order_number}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5">
                          <Package className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-gray-600">{dispatch.pickup_address.street}</span>
                        </div>
                        <span className="text-gray-300">→</span>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm text-gray-600">{dispatch.delivery_address.street}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-orange-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-lg font-bold">{dispatch.delivery_eta_minutes}m</span>
                    </div>
                    <p className="text-xs text-gray-500">{dispatch.distance_miles} miles</p>
                    <Button variant="outline" size="xs" className="mt-2" icon={<Navigation className="h-3 w-3" />}>
                      Track
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'map' && (
        <Card padding="none" className="overflow-hidden">
          <div className="h-[600px] bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 flex items-center justify-center relative">
            {/* Map placeholder with driver pins */}
            {mockDrivers.map((driver, i) => (
              <div
                key={driver.id}
                className="absolute"
                style={{ top: `${20 + i * 25}%`, left: `${15 + i * 25}%` }}
              >
                <div className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center shadow-lg ring-3 ring-white',
                  driver.is_available ? 'bg-emerald-500' : driver.is_active ? 'bg-orange-500' : 'bg-gray-400'
                )}>
                  <Truck className="h-5 w-5 text-white" />
                </div>
                <div className="mt-1 bg-white rounded-lg px-2 py-1 shadow-md text-[10px] font-medium text-gray-700 whitespace-nowrap text-center">
                  {driver.full_name.split(' ')[0]}
                </div>
              </div>
            ))}
            <div className="absolute bottom-4 left-4 bg-white rounded-xl p-3 shadow-lg">
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1"><div className="h-3 w-3 rounded-full bg-emerald-500" /> Available</div>
                <div className="flex items-center gap-1"><div className="h-3 w-3 rounded-full bg-orange-500" /> On Delivery</div>
                <div className="flex items-center gap-1"><div className="h-3 w-3 rounded-full bg-gray-400" /> Offline</div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
