'use client';

import { useState, useEffect } from 'react';
import {
  MapPin,
  Truck,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  Package,
  Navigation,
  Star,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { LiveMap } from '@/components/maps/live-map';
import { cn, formatCurrency } from '@/lib/utils';
import { mockDispatches, mockOrders } from '@/lib/mock-data';

export default function TrackingPage() {
  const dispatch = mockDispatches[0];
  const order = mockOrders.find((o) => o.id === dispatch?.order_id);
  const [eta, setEta] = useState(dispatch?.delivery_eta_minutes || 12);
  const [progress, setProgress] = useState(0.7);

  // Simulate live ETA countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setEta((prev) => Math.max(0, prev - 1));
      setProgress((prev) => Math.min(1, prev + 0.02));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!dispatch || !order) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Deliveries</h2>
          <p className="text-gray-500">You do not have any active deliveries to track right now.</p>
        </div>
      </div>
    );
  }

  const timelineEvents = [
    { time: '1:45 PM', event: 'Order placed', detail: order.order_number, done: true, icon: <Package className="h-4 w-4" /> },
    { time: '1:47 PM', event: 'Vendor confirmed', detail: order.vendor_name, done: true, icon: <CheckCircle2 className="h-4 w-4" /> },
    { time: '1:50 PM', event: 'Driver assigned', detail: dispatch.driver_name, done: true, icon: <Truck className="h-4 w-4" /> },
    { time: '2:05 PM', event: 'Picked up from vendor', detail: dispatch.pickup_address.street, done: true, icon: <Package className="h-4 w-4" /> },
    { time: '2:15 PM', event: 'En route to you', detail: `${dispatch.distance_miles} miles away`, done: true, icon: <Navigation className="h-4 w-4" /> },
    { time: `~2:${27 + eta}PM`, event: 'Estimated arrival', detail: order.delivery_address.street, done: false, icon: <MapPin className="h-4 w-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Tracking</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time delivery tracking for order {order.order_number}</p>
        </div>
        <Badge variant="urgent" dot pulse size="lg">
          <Truck className="h-4 w-4 mr-1" /> Live
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2 space-y-4">
          <Card padding="none" className="overflow-hidden relative">
            <LiveMap
              driverLocation={{
                lat: 29.7604 + (29.762 - 29.7604) * progress,
                lng: -95.3698 + (-95.367 - -95.3698) * progress,
                timestamp: Date.now(),
              }}
              pickupLocation={{ lat: dispatch.pickup_address.lat || 29.7604, lng: dispatch.pickup_address.lng || -95.3698 }}
              deliveryLocation={{ lat: dispatch.delivery_address.lat || 29.762, lng: dispatch.delivery_address.lng || -95.367 }}
              pickupLabel={dispatch.pickup_address.street.substring(0, 20)}
              deliveryLabel={dispatch.delivery_address.street.substring(0, 20)}
              driverLabel={dispatch.driver_name || 'Driver'}
              height="500px"
            />
            {/* ETA Banner */}
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl flex items-center justify-between ring-1 ring-gray-200/50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estimated Arrival</p>
                    <p className="text-2xl font-extrabold text-gray-900 leading-tight">{eta} minutes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Distance</p>
                  <p className="text-lg font-bold text-gray-900">{(dispatch.distance_miles! * (1 - progress)).toFixed(1)} mi</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Driver Card */}
          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
            <div className="flex items-center gap-4 mb-4">
              <Avatar name={dispatch.driver_name || 'Driver'} size="lg" status="online" />
              <div className="flex-1">
                <p className="font-bold text-gray-900">{dispatch.driver_name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium">4.9</span>
                  <span className="text-xs text-gray-500">(1,247 deliveries)</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{dispatch.vehicle_type} &middot; {dispatch.vehicle_plate}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" fullWidth icon={<Phone className="h-4 w-4" />}>
                Call
              </Button>
              <Button variant="outline" size="sm" fullWidth icon={<MessageSquare className="h-4 w-4" />}>
                Message
              </Button>
            </div>
          </Card>

          {/* Order Summary */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2">
                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product_name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">{formatCurrency(item.total_price)}</p>
              </div>
            ))}
            <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900">{formatCurrency(order.total)}</span>
            </div>
          </Card>

          {/* Delivery Timeline */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Delivery Timeline</h3>
            <div className="space-y-0">
              {timelineEvents.map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0',
                      event.done ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300'
                    )}>
                      {event.icon}
                    </div>
                    {i < timelineEvents.length - 1 && (
                      <div className={cn('w-0.5 h-8', event.done ? 'bg-orange-200' : 'bg-gray-200')} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={cn('text-sm font-medium', event.done ? 'text-gray-900' : 'text-gray-400')}>{event.event}</p>
                    <p className="text-xs text-gray-500">{event.detail}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
