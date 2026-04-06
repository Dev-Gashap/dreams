import { loadStripe, type Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
  }
  return stripePromise;
}

// ---- Server-side Stripe (used in API routes) ----
export function getServerStripe() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Stripe = require('stripe');
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-12-18.acacia',
  });
}

// ---- Create Payment Intent ----
export async function createPaymentIntent(amount: number, currency: string, metadata: Record<string, string>) {
  const response = await fetch('/api/payments/create-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: Math.round(amount * 100), currency, metadata }),
  });

  if (!response.ok) throw new Error('Failed to create payment intent');
  return response.json();
}

// ---- Create Vendor Connected Account ----
export async function createVendorAccount(vendorId: string, email: string) {
  const response = await fetch('/api/payments/create-vendor-account', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vendorId, email }),
  });

  if (!response.ok) throw new Error('Failed to create vendor account');
  return response.json();
}

// ---- Create Transfer to Vendor ----
export async function createVendorPayout(vendorStripeAccountId: string, amount: number, orderId: string) {
  const response = await fetch('/api/payments/vendor-payout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      destination: vendorStripeAccountId,
      amount: Math.round(amount * 100),
      orderId,
    }),
  });

  if (!response.ok) throw new Error('Failed to create vendor payout');
  return response.json();
}
