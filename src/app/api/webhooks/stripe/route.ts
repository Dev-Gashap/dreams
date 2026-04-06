import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  try {
    // In production: verify webhook signature with Stripe
    // const stripe = getServerStripe();
    // const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);

    const event = JSON.parse(body);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        // Update order payment status to 'captured'
        // await supabase.from('orders').update({ payment_status: 'captured' }).eq('stripe_payment_intent_id', paymentIntent.id);
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const failedPayment = event.data.object;
        // Update order payment status to 'failed'
        // await supabase.from('orders').update({ payment_status: 'failed' }).eq('stripe_payment_intent_id', failedPayment.id);
        console.log('Payment failed:', failedPayment.id);
        break;
      }

      case 'charge.refunded': {
        const refund = event.data.object;
        // Update order payment status to 'refunded'
        console.log('Charge refunded:', refund.id);
        break;
      }

      case 'account.updated': {
        const account = event.data.object;
        // Update vendor's connected account status
        console.log('Vendor account updated:', account.id);
        break;
      }

      case 'transfer.created': {
        const transfer = event.data.object;
        // Log vendor payout
        console.log('Vendor payout created:', transfer.id);
        break;
      }

      default:
        console.log('Unhandled webhook event:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
