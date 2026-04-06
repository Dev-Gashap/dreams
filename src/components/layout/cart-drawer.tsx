'use client';

import { X, Plus, Minus, Trash2, ShoppingBag, Zap, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CartDrawer() {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, getSubtotal, getTax, getDeliveryFee, getTotal, clearCart } = useCartStore();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setCartOpen(false)} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-bold text-gray-900">Cart ({items.length})</h2>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium">
                Clear
              </button>
            )}
            <button onClick={() => setCartOpen(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-gray-200 mb-4" />
              <p className="text-lg font-semibold text-gray-900 mb-1">Your cart is empty</p>
              <p className="text-sm text-gray-500 mb-6">Find the tools and materials you need in our marketplace.</p>
              <Button onClick={() => setCartOpen(false)} variant="primary">
                <Link href="/marketplace">Browse Marketplace</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const isRental = item.fulfillment_type === 'rent';
                const rentalPrice = isRental && item.rental_period
                  ? item.product.rental_prices?.find((r) => r.period === item.rental_period)
                  : null;
                const unitPrice = rentalPrice ? rentalPrice.price : item.product.price;
                const lineTotal = unitPrice * item.quantity;

                return (
                  <div key={item.product.id} className="flex gap-4 p-3 rounded-xl bg-gray-50">
                    <div className="h-20 w-20 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.product.brand} &middot; {item.product.sku}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {isRental && (
                          <span className="px-1.5 py-0.5 text-xs rounded bg-purple-100 text-purple-700 font-medium">
                            Rental &middot; {item.rental_period}
                          </span>
                        )}
                        {item.product.is_urgent_eligible && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-xs rounded bg-orange-100 text-orange-700 font-medium">
                            <Zap className="h-3 w-3" /> Urgent
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="h-7 w-7 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="h-7 w-7 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="ml-2 p-1 rounded text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-gray-900">{formatCurrency(lineTotal)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with totals */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4 space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">{formatCurrency(getSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax (8.25%)</span>
                <span className="font-medium text-gray-900">{formatCurrency(getTax())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="font-medium text-gray-900">{formatCurrency(getDeliveryFee())}</span>
              </div>
              <div className="flex justify-between text-base pt-2 border-t border-gray-100">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-gray-900">{formatCurrency(getTotal())}</span>
              </div>
            </div>
            <Link href="/checkout" onClick={() => setCartOpen(false)}>
              <Button variant="urgent" size="lg" fullWidth icon={<ArrowRight className="h-5 w-5" />} iconPosition="right">
                Proceed to Checkout
              </Button>
            </Link>
            <p className="text-center text-xs text-gray-400">Estimated delivery in 30-60 minutes</p>
          </div>
        )}
      </div>
    </>
  );
}
