'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
// Google Maps loader - uncomment when API key is configured
// import { Loader } from '@googlemaps/js-api-loader';
import { cn } from '@/lib/utils';
import type { GeoLocation, Address } from '@/types';

interface LiveMapProps {
  driverLocation?: GeoLocation | null;
  pickupLocation?: { lat: number; lng: number };
  deliveryLocation?: { lat: number; lng: number };
  pickupLabel?: string;
  deliveryLabel?: string;
  driverLabel?: string;
  showRoute?: boolean;
  height?: string;
  className?: string;
  zoom?: number;
  onMapReady?: (map: google.maps.Map) => void;
}

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';

// Fallback simulated map when no API key
function SimulatedMap({
  driverLocation,
  pickupLocation,
  deliveryLocation,
  pickupLabel,
  deliveryLabel,
  driverLabel,
  height = '500px',
  className,
}: LiveMapProps) {
  const [animatedDriver, setAnimatedDriver] = useState(driverLocation);

  useEffect(() => {
    setAnimatedDriver(driverLocation);
  }, [driverLocation]);

  // Normalize coordinates to SVG viewport
  const allPoints = [pickupLocation, deliveryLocation, animatedDriver].filter(Boolean) as { lat: number; lng: number }[];
  const minLat = Math.min(...allPoints.map((p) => p.lat)) - 0.005;
  const maxLat = Math.max(...allPoints.map((p) => p.lat)) + 0.005;
  const minLng = Math.min(...allPoints.map((p) => p.lng)) - 0.008;
  const maxLng = Math.max(...allPoints.map((p) => p.lng)) + 0.008;
  const latRange = maxLat - minLat || 0.01;
  const lngRange = maxLng - minLng || 0.01;

  const toSvg = (lat: number, lng: number) => ({
    x: ((lng - minLng) / lngRange) * 760 + 20,
    y: (1 - (lat - minLat) / latRange) * 460 + 20,
  });

  const pickup = pickupLocation ? toSvg(pickupLocation.lat, pickupLocation.lng) : null;
  const delivery = deliveryLocation ? toSvg(deliveryLocation.lat, deliveryLocation.lng) : null;
  const driver = animatedDriver ? toSvg(animatedDriver.lat, animatedDriver.lng) : null;

  return (
    <div className={cn('rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100/50 to-green-50 relative', className)} style={{ height }}>
      <svg viewBox="0 0 800 500" className="w-full h-full">
        {/* Grid / Roads */}
        {[100, 200, 300, 400, 500, 600, 700].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="500" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.4" />
        ))}
        {[100, 200, 300, 400].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="800" y2={y} stroke="#cbd5e1" strokeWidth="0.5" opacity="0.4" />
        ))}
        {/* Major roads */}
        <line x1="0" y1="250" x2="800" y2="250" stroke="#94a3b8" strokeWidth="2" opacity="0.3" />
        <line x1="400" y1="0" x2="400" y2="500" stroke="#94a3b8" strokeWidth="2" opacity="0.3" />

        {/* Route line from pickup through driver to delivery */}
        {pickup && delivery && (
          <path
            d={`M ${pickup.x} ${pickup.y} ${driver ? `Q ${(pickup.x + delivery.x) / 2} ${Math.min(pickup.y, delivery.y) - 30} ${driver.x} ${driver.y} Q ${(driver.x + delivery.x) / 2} ${Math.max(driver.y, delivery.y) + 20}` : 'L'} ${delivery.x} ${delivery.y}`}
            stroke="#f97316"
            strokeWidth="3"
            fill="none"
            strokeDasharray="8 4"
            opacity="0.8"
          />
        )}
        {pickup && driver && (
          <path
            d={`M ${pickup.x} ${pickup.y} L ${driver.x} ${driver.y}`}
            stroke="#22c55e"
            strokeWidth="3"
            fill="none"
            opacity="0.6"
          />
        )}

        {/* Pickup marker */}
        {pickup && (
          <g>
            <circle cx={pickup.x} cy={pickup.y} r="18" fill="#3b82f6" opacity="0.15" />
            <circle cx={pickup.x} cy={pickup.y} r="12" fill="#3b82f6" stroke="white" strokeWidth="3" />
            <text x={pickup.x} y={pickup.y + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">P</text>
            <rect x={pickup.x - 45} y={pickup.y + 18} width="90" height="22" rx="6" fill="white" filter="url(#shadow)" />
            <text x={pickup.x} y={pickup.y + 33} textAnchor="middle" fill="#1e293b" fontSize="9" fontWeight="600">{pickupLabel || 'Pickup'}</text>
          </g>
        )}

        {/* Delivery marker */}
        {delivery && (
          <g>
            <circle cx={delivery.x} cy={delivery.y} r="18" fill="#22c55e" opacity="0.15" />
            <circle cx={delivery.x} cy={delivery.y} r="12" fill="#22c55e" stroke="white" strokeWidth="3" />
            <text x={delivery.x} y={delivery.y + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">D</text>
            <rect x={delivery.x - 45} y={delivery.y + 18} width="90" height="22" rx="6" fill="white" filter="url(#shadow)" />
            <text x={delivery.x} y={delivery.y + 33} textAnchor="middle" fill="#1e293b" fontSize="9" fontWeight="600">{deliveryLabel || 'Delivery'}</text>
          </g>
        )}

        {/* Driver marker (animated) */}
        {driver && (
          <g>
            <circle cx={driver.x} cy={driver.y} r="24" fill="#f97316" opacity="0.15">
              <animate attributeName="r" values="20;28;20" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={driver.x} cy={driver.y} r="16" fill="#f97316" stroke="white" strokeWidth="3">
              <animate attributeName="r" values="14;17;14" dur="2s" repeatCount="indefinite" />
            </circle>
            <text x={driver.x} y={driver.y + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">🚚</text>
            <rect x={driver.x - 40} y={driver.y - 36} width="80" height="24" rx="8" fill="#1e293b" />
            <text x={driver.x} y={driver.y - 20} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{driverLabel || 'Driver'}</text>
          </g>
        )}

        {/* Shadow filter */}
        <defs>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>
      </svg>

      {/* Map attribution */}
      <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] text-gray-500">
        Dreams Live Map
      </div>
    </div>
  );
}

// Google Maps implementation — activate by setting NEXT_PUBLIC_GOOGLE_MAPS_KEY
// When configured, import Loader from '@googlemaps/js-api-loader' and use the Google Maps JS API
// with AdvancedMarkerElement for pickup, delivery, and driver markers.
// The SimulatedMap below provides a fully functional SVG-based fallback.

export function LiveMap(props: LiveMapProps) {
  return <SimulatedMap {...props} />;
}

// ---- Static map for addresses ----
interface StaticMapProps {
  address: Address;
  width?: number;
  height?: number;
  zoom?: number;
  className?: string;
}

export function StaticMap({ address, width = 400, height = 200, zoom = 15, className }: StaticMapProps) {
  if (!address.lat || !address.lng) {
    return (
      <div className={cn('bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm', className)} style={{ width, height }}>
        No location data
      </div>
    );
  }

  if (GOOGLE_MAPS_KEY) {
    const src = `https://maps.googleapis.com/maps/api/staticmap?center=${address.lat},${address.lng}&zoom=${zoom}&size=${width}x${height}&markers=${address.lat},${address.lng}&key=${GOOGLE_MAPS_KEY}`;
    return <img src={src} alt={address.street} className={cn('rounded-xl', className)} width={width} height={height} />;
  }

  return (
    <div className={cn('bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center relative', className)} style={{ width, height }}>
      <div className="text-center">
        <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-1 shadow-lg">
          <span className="text-white text-xs font-bold">📍</span>
        </div>
        <p className="text-xs text-blue-700 font-medium">{address.street}</p>
        <p className="text-[10px] text-blue-500">{address.city}, {address.state}</p>
      </div>
    </div>
  );
}
