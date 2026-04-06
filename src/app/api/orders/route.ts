import { NextRequest, NextResponse } from 'next/server';
import { mockOrders } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');

  let orders = [...mockOrders];

  if (status) {
    orders = orders.filter((o) => o.status === status);
  }

  if (priority) {
    orders = orders.filter((o) => o.priority === priority);
  }

  return NextResponse.json({ orders, total: orders.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // In production, this creates an order in Supabase
  const newOrder = {
    id: `ord_${Date.now()}`,
    order_number: `DRM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    status: 'draft',
    ...body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return NextResponse.json({ order: newOrder }, { status: 201 });
}
