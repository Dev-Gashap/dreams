import { NextRequest, NextResponse } from 'next/server';
import { mockDispatches, mockDrivers } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order_id');
  const driverId = searchParams.get('driver_id');

  let dispatches = [...mockDispatches];

  if (orderId) {
    dispatches = dispatches.filter((d) => d.order_id === orderId);
  }

  if (driverId) {
    dispatches = dispatches.filter((d) => d.driver_id === driverId);
  }

  return NextResponse.json({ dispatches });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { order_id, delivery_method } = body;

  // Find best available driver
  const availableDrivers = mockDrivers.filter((d) => d.is_available);

  if (availableDrivers.length === 0 && delivery_method !== 'customer_pickup') {
    return NextResponse.json(
      { error: 'No drivers available. Please try again or select customer pickup.' },
      { status: 409 }
    );
  }

  const assignedDriver = availableDrivers[0];

  const newDispatch = {
    id: `dsp_${Date.now()}`,
    order_id,
    driver_id: assignedDriver?.id,
    driver_name: assignedDriver?.full_name,
    driver_phone: assignedDriver?.phone,
    status: assignedDriver ? 'assigned' : 'pending',
    delivery_method,
    ...body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return NextResponse.json({ dispatch: newDispatch }, { status: 201 });
}
