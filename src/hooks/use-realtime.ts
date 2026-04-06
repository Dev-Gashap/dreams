'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { GeoLocation, DispatchStatus, OrderStatus } from '@/types';

// ---- Driver Location Tracking ----
export function useDriverTracking(dispatchId: string | null) {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [eta, setEta] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!dispatchId) return;

    // In production: subscribe to Supabase realtime channel
    // const channel = supabase.channel(`dispatch:${dispatchId}`)
    //   .on('broadcast', { event: 'location_update' }, (payload) => {
    //     setLocation(payload.payload as GeoLocation);
    //   })
    //   .on('broadcast', { event: 'eta_update' }, (payload) => {
    //     setEta(payload.payload.eta_minutes);
    //   })
    //   .subscribe();

    // Simulate movement for demo
    let currentLat = 29.7612;
    let currentLng = -95.3685;
    let currentEta = 12;

    intervalRef.current = setInterval(() => {
      currentLat += (Math.random() - 0.4) * 0.001;
      currentLng += (Math.random() - 0.4) * 0.001;
      currentEta = Math.max(0, currentEta - 0.5);

      setLocation({
        lat: currentLat,
        lng: currentLng,
        heading: Math.random() * 360,
        speed: 15 + Math.random() * 20,
        timestamp: Date.now(),
      });
      setEta(Math.round(currentEta));
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // channel.unsubscribe();
    };
  }, [dispatchId]);

  return { location, eta };
}

// ---- Order Status Subscription ----
export function useOrderStatus(orderId: string | null) {
  const [status, setStatus] = useState<OrderStatus | null>(null);

  useEffect(() => {
    if (!orderId) return;

    // In production:
    // const channel = supabase.channel(`order:${orderId}`)
    //   .on('postgres_changes', {
    //     event: 'UPDATE',
    //     schema: 'public',
    //     table: 'orders',
    //     filter: `id=eq.${orderId}`,
    //   }, (payload) => {
    //     setStatus(payload.new.status as OrderStatus);
    //   })
    //   .subscribe();

    // return () => { channel.unsubscribe(); };
  }, [orderId]);

  return { status };
}

// ---- Dispatch Status Subscription ----
export function useDispatchStatus(dispatchId: string | null) {
  const [status, setStatus] = useState<DispatchStatus | null>(null);

  useEffect(() => {
    if (!dispatchId) return;

    // In production:
    // const channel = supabase.channel(`dispatch_status:${dispatchId}`)
    //   .on('postgres_changes', {
    //     event: 'UPDATE',
    //     schema: 'public',
    //     table: 'dispatches',
    //     filter: `id=eq.${dispatchId}`,
    //   }, (payload) => {
    //     setStatus(payload.new.status as DispatchStatus);
    //   })
    //   .subscribe();

    // return () => { channel.unsubscribe(); };
  }, [dispatchId]);

  return { status };
}

// ---- Notifications Subscription ----
export function useRealtimeNotifications(userId: string | null) {
  const [newNotification, setNewNotification] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    if (!userId) return;

    // In production:
    // const channel = supabase.channel(`notifications:${userId}`)
    //   .on('postgres_changes', {
    //     event: 'INSERT',
    //     schema: 'public',
    //     table: 'notifications',
    //     filter: `user_id=eq.${userId}`,
    //   }, (payload) => {
    //     setNewNotification({
    //       title: payload.new.title,
    //       message: payload.new.message,
    //     });
    //     // Auto-clear after 5s
    //     setTimeout(() => setNewNotification(null), 5000);
    //   })
    //   .subscribe();

    // return () => { channel.unsubscribe(); };
  }, [userId]);

  return { newNotification };
}

// ---- Vendor Order Alerts ----
export function useVendorOrderAlerts(vendorId: string | null) {
  const [newOrder, setNewOrder] = useState<{ id: string; total: number } | null>(null);

  useEffect(() => {
    if (!vendorId) return;

    // In production:
    // const channel = supabase.channel(`vendor_orders:${vendorId}`)
    //   .on('postgres_changes', {
    //     event: 'INSERT',
    //     schema: 'public',
    //     table: 'orders',
    //     filter: `vendor_id=eq.${vendorId}`,
    //   }, (payload) => {
    //     setNewOrder({ id: payload.new.id, total: payload.new.total });
    //   })
    //   .subscribe();

    // return () => { channel.unsubscribe(); };
  }, [vendorId]);

  return { newOrder };
}

// ---- Geolocation (browser) ----
export function useGeolocation() {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        setError(err.message);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { position, error };
}

// ---- Countdown Timer ----
export function useCountdown(targetMinutes: number) {
  const [remaining, setRemaining] = useState(targetMinutes * 60);

  useEffect(() => {
    setRemaining(targetMinutes * 60);
  }, [targetMinutes]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return {
    minutes,
    seconds,
    formatted: `${minutes}:${seconds.toString().padStart(2, '0')}`,
    isExpired: remaining <= 0,
  };
}
