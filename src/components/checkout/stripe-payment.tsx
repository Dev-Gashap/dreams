'use client';

import { useState } from 'react';
import { CreditCard, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, formatCurrency } from '@/lib/utils';

interface StripePaymentProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  loading?: boolean;
}

export function StripePayment({ amount, onSuccess, onError, loading }: StripePaymentProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'amex' | 'unknown'>('unknown');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\D/g, '').substring(0, 16);
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 2) return v.substring(0, 2) + '/' + v.substring(2);
    return v;
  };

  const detectCardBrand = (number: string) => {
    const clean = number.replace(/\D/g, '');
    if (clean.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'mastercard';
    if (clean.startsWith('3') && (clean[1] === '4' || clean[1] === '7')) return 'amex';
    return 'unknown';
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    setCardNumber(formatted);
    setCardBrand(detectCardBrand(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setProcessing(true);

    try {
      // In production: use Stripe.js Elements
      // const stripe = await getStripe();
      // const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      //   payment_method: { card: elements.getElement(CardElement), billing_details: { name } }
      // });

      // Simulate payment processing
      await new Promise((r) => setTimeout(r, 2000));

      const cleanNumber = cardNumber.replace(/\D/g, '');
      if (cleanNumber.length < 16) {
        throw new Error('Invalid card number');
      }

      // Mock success
      const mockPaymentId = `pi_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      onSuccess(mockPaymentId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Payment failed';
      setError(msg);
      onError(msg);
    } finally {
      setProcessing(false);
    }
  };

  const brandLogos: Record<string, React.ReactNode> = {
    visa: <div className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">VISA</div>,
    mastercard: <div className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">MC</div>,
    amex: <div className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">AMEX</div>,
    unknown: null,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Card Preview */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-12 -mb-12" />
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <CreditCard className="h-8 w-8 text-gray-400" />
            {brandLogos[cardBrand]}
          </div>
          <p className="text-xl tracking-[0.25em] font-mono mb-6">
            {cardNumber || '•••• •••• •••• ••••'}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 uppercase">Card Holder</p>
              <p className="text-sm font-medium">{name || 'YOUR NAME'}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase">Expires</p>
              <p className="text-sm font-medium">{expiry || 'MM/YY'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Form */}
      <Input
        label="Cardholder Name"
        placeholder="Alex Morgan"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <div className="relative">
        <Input
          label="Card Number"
          placeholder="4242 4242 4242 4242"
          value={cardNumber}
          onChange={(e) => handleCardNumberChange(e.target.value)}
          icon={<CreditCard className="h-4 w-4" />}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Expiry Date"
          placeholder="MM/YY"
          value={expiry}
          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
          required
        />
        <Input
          label="CVC"
          placeholder="123"
          value={cvc}
          onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
          type="password"
          required
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="urgent"
        size="lg"
        fullWidth
        loading={processing || loading}
        icon={<Lock className="h-5 w-5" />}
      >
        Pay {formatCurrency(amount)}
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <Lock className="h-3 w-3" />
        <span>Secured by 256-bit SSL encryption</span>
      </div>
    </form>
  );
}
