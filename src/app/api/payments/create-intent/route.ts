import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limit check
  const ip = getClientIp(request);
  const limit = rateLimit(ip, 'orders');
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: rateLimitHeaders(limit) }
    );
  }

  try {
    const { amount, currency = 'usd', metadata = {} } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // In production: create real Stripe PaymentIntent
    // const stripe = getServerStripe();
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount,
    //   currency,
    //   metadata,
    //   automatic_payment_methods: { enabled: true },
    // });
    // return NextResponse.json({ clientSecret: paymentIntent.client_secret, id: paymentIntent.id });

    // Mock response
    return NextResponse.json({
      clientSecret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(2)}`,
      id: `pi_mock_${Date.now()}`,
    }, { headers: rateLimitHeaders(limit) });
  } catch (error) {
    console.error('Payment intent error:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
