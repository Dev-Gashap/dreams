// Driver Route Optimization Engine
// Uses greedy nearest-neighbor with priority weighting

import type { GeoLocation, OrderPriority } from '@/types';

interface DeliveryStop {
  id: string;
  orderId: string;
  type: 'pickup' | 'delivery';
  lat: number;
  lng: number;
  address: string;
  priority: OrderPriority;
  estimatedMinutes: number;
  timeWindowStart?: Date;
  timeWindowEnd?: Date;
}

interface OptimizedRoute {
  stops: DeliveryStop[];
  totalDistanceMiles: number;
  totalDurationMinutes: number;
  estimatedFuelCost: number;
  savings: {
    distanceSavedMiles: number;
    timeSavedMinutes: number;
    percentImprovement: number;
  };
}

// Haversine distance between two lat/lng points
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Estimated driving time (avg 25 mph city, 45 mph highway)
function estimateDriveTime(distanceMiles: number): number {
  return Math.round(distanceMiles * 2.4); // ~25mph average
}

// Priority weight — critical stops get pulled earlier
function priorityWeight(priority: OrderPriority): number {
  switch (priority) {
    case 'critical': return 3.0;
    case 'urgent': return 2.0;
    case 'standard': return 1.0;
  }
}

// ---- Main optimization function ----
export function optimizeRoute(
  driverLocation: GeoLocation,
  stops: DeliveryStop[]
): OptimizedRoute {
  if (stops.length === 0) {
    return { stops: [], totalDistanceMiles: 0, totalDurationMinutes: 0, estimatedFuelCost: 0, savings: { distanceSavedMiles: 0, timeSavedMinutes: 0, percentImprovement: 0 } };
  }

  // Calculate naive (unoptimized) distance
  let naiveDistance = 0;
  let prevLat = driverLocation.lat;
  let prevLng = driverLocation.lng;
  for (const stop of stops) {
    naiveDistance += haversineDistance(prevLat, prevLng, stop.lat, stop.lng);
    prevLat = stop.lat;
    prevLng = stop.lng;
  }

  // Group stops: pickups first (by proximity), then deliveries sorted by priority + proximity
  const pickups = stops.filter((s) => s.type === 'pickup');
  const deliveries = stops.filter((s) => s.type === 'delivery');

  // Nearest-neighbor with priority weighting
  function sortByWeightedDistance(remaining: DeliveryStop[], fromLat: number, fromLng: number): DeliveryStop[] {
    if (remaining.length === 0) return [];

    const scored = remaining.map((stop) => {
      const dist = haversineDistance(fromLat, fromLng, stop.lat, stop.lng);
      const weight = priorityWeight(stop.priority);
      // Lower score = pick first. Priority reduces effective distance.
      const score = dist / weight;
      return { stop, score, dist };
    });

    scored.sort((a, b) => a.score - b.score);
    const next = scored[0];
    const rest = remaining.filter((s) => s.id !== next.stop.id);

    return [next.stop, ...sortByWeightedDistance(rest, next.stop.lat, next.stop.lng)];
  }

  // Optimize pickup order
  const optimizedPickups = sortByWeightedDistance(pickups, driverLocation.lat, driverLocation.lng);

  // After pickups, optimize delivery order
  const lastPickup = optimizedPickups.length > 0
    ? optimizedPickups[optimizedPickups.length - 1]
    : { lat: driverLocation.lat, lng: driverLocation.lng };

  const optimizedDeliveries = sortByWeightedDistance(deliveries, lastPickup.lat, lastPickup.lng);

  const optimizedStops = [...optimizedPickups, ...optimizedDeliveries];

  // Calculate optimized total distance
  let totalDistance = 0;
  let totalDuration = 0;
  prevLat = driverLocation.lat;
  prevLng = driverLocation.lng;

  for (const stop of optimizedStops) {
    const segDist = haversineDistance(prevLat, prevLng, stop.lat, stop.lng);
    totalDistance += segDist;
    totalDuration += estimateDriveTime(segDist);
    totalDuration += stop.estimatedMinutes; // Time at stop
    prevLat = stop.lat;
    prevLng = stop.lng;
  }

  const distanceSaved = naiveDistance - totalDistance;
  const timeSaved = estimateDriveTime(distanceSaved);
  const percentImprovement = naiveDistance > 0 ? Math.round((distanceSaved / naiveDistance) * 100) : 0;
  const fuelCost = totalDistance * 0.15; // $0.15/mile estimate

  return {
    stops: optimizedStops,
    totalDistanceMiles: Math.round(totalDistance * 10) / 10,
    totalDurationMinutes: totalDuration,
    estimatedFuelCost: Math.round(fuelCost * 100) / 100,
    savings: {
      distanceSavedMiles: Math.round(distanceSaved * 10) / 10,
      timeSavedMinutes: timeSaved,
      percentImprovement,
    },
  };
}

// ---- ETA Calculator ----
export function calculateETA(
  driverLat: number,
  driverLng: number,
  destLat: number,
  destLng: number,
  trafficMultiplier = 1.3 // 30% buffer for traffic
): { distanceMiles: number; etaMinutes: number } {
  const distance = haversineDistance(driverLat, driverLng, destLat, destLng);
  const baseTime = estimateDriveTime(distance);
  const etaMinutes = Math.round(baseTime * trafficMultiplier);

  return {
    distanceMiles: Math.round(distance * 10) / 10,
    etaMinutes,
  };
}

// ---- Batch Assignment ----
// Assigns orders to nearest available drivers
export function assignOrdersToDrivers(
  orders: { id: string; lat: number; lng: number; priority: OrderPriority }[],
  drivers: { id: string; lat: number; lng: number; maxWeight: number; isAvailable: boolean }[]
): Map<string, string[]> {
  const assignments = new Map<string, string[]>(); // driverId -> orderIds
  const availableDrivers = drivers.filter((d) => d.isAvailable);
  const sortedOrders = [...orders].sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority));

  for (const order of sortedOrders) {
    let bestDriver: typeof availableDrivers[0] | null = null;
    let bestDistance = Infinity;

    for (const driver of availableDrivers) {
      const currentOrders = assignments.get(driver.id)?.length || 0;
      if (currentOrders >= 3) continue; // Max 3 orders per driver

      const dist = haversineDistance(driver.lat, driver.lng, order.lat, order.lng);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestDriver = driver;
      }
    }

    if (bestDriver) {
      const existing = assignments.get(bestDriver.id) || [];
      assignments.set(bestDriver.id, [...existing, order.id]);
    }
  }

  return assignments;
}
