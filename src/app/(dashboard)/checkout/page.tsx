'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
  Truck,
  Zap,
  Package,
  Shield,
  Building2,
  User,
  FileText,
  AlertTriangle,
  Key,
  Info,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductImage } from '@/components/ui/product-image';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency, formatETA } from '@/lib/utils';
import { useCartStore, useAuthStore } from '@/store';
import type { DeliveryMethod, OrderPriority } from '@/types';

type CheckoutStep = 'delivery' | 'payment' | 'review';

export default function CheckoutPage() {
  const { items, getSubtotal, getTax, getDeliveryFee, getTotal, clearCart } = useCartStore();
  const { user, accountMode } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('delivery');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Form state
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('third_party_courier');
  const [priority, setPriority] = useState<OrderPriority>('standard');
  const [jobSiteName, setJobSiteName] = useState('');
  const [projectRef, setProjectRef] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [poNumber, setPoNumber] = useState('');
  const [requestApproval, setRequestApproval] = useState(false);

  const steps: { key: CheckoutStep; label: string; icon: React.ReactNode }[] = [
    { key: 'delivery', label: 'Delivery', icon: <Truck className="h-4 w-4" /> },
    { key: 'payment', label: 'Payment', icon: <CreditCard className="h-4 w-4" /> },
    { key: 'review', label: 'Review & Place', icon: <CheckCircle2 className="h-4 w-4" /> },
  ];

  const stepIndex = steps.findIndex((s) => s.key === currentStep);

  const urgentFee = priority === 'urgent' ? 15 : priority === 'critical' ? 35 : 0;
  const subtotal = getSubtotal();
  const tax = getTax();
  const deliveryFee = deliveryMethod === 'customer_pickup' ? 0 : getDeliveryFee();
  const total = subtotal + tax + deliveryFee + urgentFee;

  const deliveryMethods: { value: DeliveryMethod; label: string; description: string; eta: string; icon: React.ReactNode }[] = [
    { value: 'third_party_courier', label: 'Courier Delivery', description: 'Third-party driver delivers to your location', eta: '30-60 min', icon: <Truck className="h-5 w-5" /> },
    { value: 'internal_driver', label: 'Dreams Driver', description: 'Our dedicated driver for fastest delivery', eta: '20-45 min', icon: <Zap className="h-5 w-5" /> },
    { value: 'warehouse_runner', label: 'Warehouse Runner', description: 'Express pickup from nearest warehouse', eta: '15-30 min', icon: <Package className="h-5 w-5" /> },
    { value: 'customer_pickup', label: 'Customer Pickup', description: 'Pick up from vendor location yourself', eta: '15 min prep', icon: <MapPin className="h-5 w-5" /> },
    { value: 'drone_delivery', label: 'Drone Delivery', description: 'For items under 5 lbs — fastest option', eta: '10-20 min', icon: <Zap className="h-5 w-5" /> },
  ];

  const handlePlaceOrder = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    const num = `DRM-${Date.now().toString(36).toUpperCase().slice(-5)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setOrderNumber(num);
    setOrderPlaced(true);
    clearCart();
    setLoading(false);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-lg text-gray-600 mb-2">Your order has been submitted successfully.</p>
        <p className="text-sm text-gray-500 mb-8">Order Number: <span className="font-mono font-bold text-gray-900">{orderNumber}</span></p>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8 text-left">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="h-5 w-5 text-orange-600" />
            <span className="font-bold text-gray-900">Estimated Delivery</span>
          </div>
          <p className="text-2xl font-extrabold text-orange-600 mb-1">
            {priority === 'critical' ? '15-25 minutes' : priority === 'urgent' ? '25-45 minutes' : '45-90 minutes'}
          </p>
          <p className="text-sm text-gray-600">
            {deliveryMethod === 'customer_pickup'
              ? 'Your order will be ready for pickup shortly.'
              : 'You will receive real-time tracking updates once a driver is assigned.'}
          </p>
        </div>

        {requestApproval && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3 text-left">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">Pending Approval</p>
              <p className="text-sm text-gray-600">This order requires manager approval before it will be processed.</p>
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Link href="/orders">
            <Button variant="primary" size="lg" icon={<Package className="h-5 w-5" />}>
              View Order
            </Button>
          </Link>
          <Link href="/tracking">
            <Button variant="outline" size="lg" icon={<MapPin className="h-5 w-5" />}>
              Track Delivery
            </Button>
          </Link>
          <Link href="/marketplace">
            <Button variant="ghost" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add items from the marketplace before checking out.</p>
        <Link href="/marketplace">
          <Button variant="primary">Browse Marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/marketplace" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-0">
        {steps.map((step, i) => (
          <div key={step.key} className="flex items-center">
            <button
              onClick={() => i < stepIndex && setCurrentStep(step.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                currentStep === step.key
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/25'
                  : i < stepIndex
                  ? 'bg-orange-100 text-orange-700 cursor-pointer hover:bg-orange-200'
                  : 'bg-gray-100 text-gray-400 cursor-default'
              )}
            >
              {i < stepIndex ? <CheckCircle2 className="h-4 w-4" /> : step.icon}
              <span className="hidden sm:inline">{step.label}</span>
            </button>
            {i < steps.length - 1 && (
              <div className={cn('w-8 sm:w-16 h-0.5 mx-1', i < stepIndex ? 'bg-orange-500' : 'bg-gray-200')} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Delivery */}
          {currentStep === 'delivery' && (
            <>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-orange-600" /> Delivery Address</CardTitle></CardHeader>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Input label="Street Address" placeholder="742 Evergreen Terrace" icon={<MapPin className="h-4 w-4" />} defaultValue="742 Evergreen Terrace" />
                  </div>
                  <Input label="City" placeholder="Houston" defaultValue="Houston" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="State" placeholder="TX" defaultValue="TX" />
                    <Input label="ZIP Code" placeholder="77002" defaultValue="77002" />
                  </div>
                </div>
              </Card>

              {accountMode === 'business' && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-blue-600" /> Job Site Details</CardTitle></CardHeader>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Job Site Name" placeholder="e.g., Westfield Tower - Floor 12" value={jobSiteName} onChange={(e) => setJobSiteName(e.target.value)} />
                    <Input label="Project Reference" placeholder="e.g., PRJ-2026-0142" value={projectRef} onChange={(e) => setProjectRef(e.target.value)} />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Leave with site foreman, call before arrival, gate code, etc."
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
                      rows={3}
                    />
                  </div>
                </Card>
              )}

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5 text-orange-600" /> Delivery Method</CardTitle></CardHeader>
                <div className="space-y-3">
                  {deliveryMethods.map((method) => (
                    <button
                      key={method.value}
                      onClick={() => setDeliveryMethod(method.value)}
                      className={cn(
                        'w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all',
                        deliveryMethod === method.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className={cn(
                        'h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0',
                        deliveryMethod === method.value ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'
                      )}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{method.label}</p>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <Badge variant={method.value === 'drone_delivery' ? 'urgent' : 'default'} size="sm">
                          <Clock className="h-3 w-3 mr-1" /> {method.eta}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {method.value === 'customer_pickup' ? 'Free' : formatCurrency(12.99)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-orange-600" /> Priority Level</CardTitle></CardHeader>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { value: 'standard' as const, label: 'Standard', description: '45-90 min', fee: 0, color: 'border-gray-200 hover:border-gray-300' },
                    { value: 'urgent' as const, label: 'Urgent', description: '25-45 min', fee: 15, color: 'border-orange-200 hover:border-orange-400' },
                    { value: 'critical' as const, label: 'Critical', description: '15-25 min', fee: 35, color: 'border-red-200 hover:border-red-400' },
                  ]).map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPriority(p.value)}
                      className={cn(
                        'p-4 rounded-xl border-2 text-center transition-all',
                        priority === p.value
                          ? p.value === 'critical' ? 'border-red-500 bg-red-50' : p.value === 'urgent' ? 'border-orange-500 bg-orange-50' : 'border-gray-900 bg-gray-50'
                          : p.color
                      )}
                    >
                      <p className="font-bold text-gray-900">{p.label}</p>
                      <p className="text-sm text-gray-500 mt-1">{p.description}</p>
                      <p className="text-sm font-semibold mt-1">
                        {p.fee === 0 ? 'No extra fee' : `+${formatCurrency(p.fee)}`}
                      </p>
                    </button>
                  ))}
                </div>
              </Card>

              <div className="flex justify-end">
                <Button variant="urgent" size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right" onClick={() => setCurrentStep('payment')}>
                  Continue to Payment
                </Button>
              </div>
            </>
          )}

          {/* Step 2: Payment */}
          {currentStep === 'payment' && (
            <>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-orange-600" /> Payment Method</CardTitle></CardHeader>
                <div className="space-y-3">
                  {[
                    { value: 'card', label: 'Credit / Debit Card', description: 'Visa, Mastercard, Amex', icon: <CreditCard className="h-5 w-5" /> },
                    ...(accountMode === 'business' ? [
                      { value: 'company_account', label: 'Company Account', description: 'Charge to company billing', icon: <Building2 className="h-5 w-5" /> },
                      { value: 'po_number', label: 'Purchase Order', description: 'Use a PO number for invoicing', icon: <FileText className="h-5 w-5" /> },
                    ] : []),
                    { value: 'wallet', label: 'Dreams Wallet', description: 'Pay from your wallet balance', icon: <Shield className="h-5 w-5" /> },
                  ].map((method) => (
                    <button
                      key={method.value}
                      onClick={() => setPaymentMethod(method.value)}
                      className={cn(
                        'w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all',
                        paymentMethod === method.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className={cn(
                        'h-10 w-10 rounded-xl flex items-center justify-center',
                        paymentMethod === method.value ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'
                      )}>
                        {method.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{method.label}</p>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {paymentMethod === 'card' && (
                <Card>
                  <CardHeader><CardTitle>Card Details</CardTitle></CardHeader>
                  <div className="space-y-4">
                    <Input label="Cardholder Name" placeholder="Alex Morgan" defaultValue="Alex Morgan" />
                    <Input label="Card Number" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Expiry Date" placeholder="MM/YY" defaultValue="12/27" />
                      <Input label="CVC" placeholder="123" defaultValue="123" />
                    </div>
                  </div>
                </Card>
              )}

              {paymentMethod === 'po_number' && (
                <Card>
                  <CardHeader><CardTitle>Purchase Order</CardTitle></CardHeader>
                  <Input label="PO Number" placeholder="PO-2026-0001" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} icon={<FileText className="h-4 w-4" />} />
                </Card>
              )}

              {accountMode === 'business' && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-amber-500" /> Approval</CardTitle></CardHeader>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requestApproval}
                      onChange={(e) => setRequestApproval(e.target.checked)}
                      className="h-5 w-5 rounded border-gray-300 text-orange-600 mt-0.5"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Request manager approval before processing</p>
                      <p className="text-sm text-gray-500">Order will be held until a manager approves the request.</p>
                    </div>
                  </label>
                </Card>
              )}

              <div className="flex justify-between">
                <Button variant="outline" size="lg" icon={<ArrowLeft className="h-5 w-5" />} onClick={() => setCurrentStep('delivery')}>
                  Back
                </Button>
                <Button variant="urgent" size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right" onClick={() => setCurrentStep('review')}>
                  Review Order
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Review */}
          {currentStep === 'review' && (
            <>
              <Card>
                <CardHeader><CardTitle>Order Review</CardTitle></CardHeader>
                <div className="space-y-3">
                  {items.map((item) => {
                    const isRental = item.fulfillment_type === 'rent';
                    const rentalPrice = isRental && item.rental_period
                      ? item.product.rental_prices?.find((r) => r.period === item.rental_period)
                      : null;
                    const unitPrice = rentalPrice ? rentalPrice.price : item.product.price;
                    return (
                      <div key={item.product.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                        <ProductImage
                          productId={item.product.id}
                          category={item.product.category}
                          name={item.product.name}
                          size="md"
                          className="h-14 w-14 rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{item.product.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500">{item.product.brand} &middot; Qty: {item.quantity}</span>
                            {isRental && <Badge variant="info" size="sm"><Key className="h-3 w-3 mr-0.5" /> {item.rental_period}</Badge>}
                          </div>
                        </div>
                        <p className="font-bold text-gray-900">{formatCurrency(unitPrice * item.quantity)}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <h4 className="font-semibold text-gray-900 mb-3">Delivery Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="font-medium">{deliveryMethods.find((m) => m.value === deliveryMethod)?.label}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Priority</span>
                      <Badge variant={priority === 'critical' ? 'danger' : priority === 'urgent' ? 'urgent' : 'default'} size="sm">
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between"><span className="text-gray-500">ETA</span><span className="font-medium">{deliveryMethods.find((m) => m.value === deliveryMethod)?.eta}</span></div>
                    {jobSiteName && <div className="flex justify-between"><span className="text-gray-500">Job Site</span><span className="font-medium">{jobSiteName}</span></div>}
                  </div>
                </Card>
                <Card>
                  <h4 className="font-semibold text-gray-900 mb-3">Payment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="font-medium">{paymentMethod === 'card' ? 'Card ending 4242' : paymentMethod === 'po_number' ? `PO: ${poNumber}` : paymentMethod.replace('_', ' ')}</span></div>
                    {requestApproval && <div className="flex justify-between"><span className="text-amber-600">Approval</span><span className="font-medium text-amber-600">Required</span></div>}
                  </div>
                </Card>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" size="lg" icon={<ArrowLeft className="h-5 w-5" />} onClick={() => setCurrentStep('payment')}>
                  Back
                </Button>
                <Button variant="urgent" size="xl" loading={loading} icon={<CheckCircle2 className="h-5 w-5" />} onClick={handlePlaceOrder}>
                  Place Order — {formatCurrency(total)}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          <Card className="sticky top-20">
            <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 truncate max-w-[200px]">{item.quantity}x {item.product.name}</span>
                  <span className="font-medium text-gray-900 flex-shrink-0">{formatCurrency(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tax (8.25%)</span><span>{formatCurrency(tax)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>{deliveryMethod === 'customer_pickup' ? 'Free' : formatCurrency(deliveryFee)}</span></div>
              {urgentFee > 0 && (
                <div className="flex justify-between text-orange-600"><span>Priority Fee</span><span>+{formatCurrency(urgentFee)}</span></div>
              )}
              <div className="flex justify-between pt-3 border-t border-gray-100 text-base">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-gray-900">{formatCurrency(total)}</span>
              </div>
            </div>

            {items.some((i) => i.fulfillment_type === 'rent') && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-center gap-2 text-purple-700 text-sm font-medium">
                  <Info className="h-4 w-4" />
                  Rental deposits not included in total
                </div>
                <p className="text-xs text-purple-600 mt-1">Deposits are charged separately and refunded upon return.</p>
              </div>
            )}

            <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              <span className="text-xs text-emerald-700 font-medium">Secure checkout protected by 256-bit SSL</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
