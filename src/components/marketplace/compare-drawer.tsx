'use client';

import Link from 'next/link';
import {
  X,
  GitCompareArrows,
  Package,
  Star,
  Zap,
  Minus,
  Key,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductImage } from '@/components/ui/product-image';
import { formatCurrency, formatETA } from '@/lib/utils';
import { useCartStore } from '@/store';
import type { Product } from '@/types';

interface CompareDrawerProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
}

export function CompareDrawer({ products, isOpen, onClose, onRemove }: CompareDrawerProps) {
  const { addItem } = useCartStore();

  if (!isOpen || products.length === 0) return null;

  // Get all unique specification keys
  const allSpecs = new Set<string>();
  products.forEach((p) => {
    Object.keys(p.specifications).forEach((k) => allSpecs.add(k));
  });

  const comparisonRows: { label: string; getValue: (p: Product) => React.ReactNode }[] = [
    {
      label: 'Price',
      getValue: (p) => (
        <div>
          <span className="text-lg font-bold text-gray-900">{formatCurrency(p.price)}</span>
          {p.compare_at_price && (
            <span className="text-xs text-gray-400 line-through ml-1">{formatCurrency(p.compare_at_price)}</span>
          )}
        </div>
      ),
    },
    {
      label: 'Brand',
      getValue: (p) => <span className="font-medium">{p.brand}</span>,
    },
    {
      label: 'Rating',
      getValue: (p) => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="font-bold">{p.rating}</span>
          <span className="text-xs text-gray-400">({p.review_count})</span>
        </div>
      ),
    },
    {
      label: 'Stock',
      getValue: (p) => (
        <Badge variant={p.stock_quantity > 10 ? 'success' : p.stock_quantity > 0 ? 'warning' : 'danger'} size="sm">
          {p.stock_quantity > 0 ? `${p.stock_quantity} available` : 'Out of Stock'}
        </Badge>
      ),
    },
    {
      label: 'Urgent Delivery',
      getValue: (p) => p.is_urgent_eligible ? (
        <div className="flex items-center gap-1 text-orange-600">
          <Zap className="h-4 w-4 fill-orange-500" />
          <span className="text-sm font-medium">{formatETA(p.estimated_delivery_minutes || 60)}</span>
        </div>
      ) : (
        <span className="text-gray-400"><Minus className="h-4 w-4" /></span>
      ),
    },
    {
      label: 'Rental Available',
      getValue: (p) => p.is_rentable ? (
        <div className="flex items-center gap-1 text-purple-600">
          <Key className="h-4 w-4" />
          <span className="text-sm font-medium">Yes</span>
        </div>
      ) : (
        <span className="text-gray-400"><Minus className="h-4 w-4" /></span>
      ),
    },
    {
      label: 'Weight',
      getValue: (p) => p.weight_lbs ? <span>{p.weight_lbs} lbs</span> : <span className="text-gray-400">—</span>,
    },
    {
      label: 'Vendor',
      getValue: (p) => <span className="text-sm">{p.vendor_name}</span>,
    },
    ...Array.from(allSpecs).map((spec) => ({
      label: spec,
      getValue: (p: Product) => (
        <span className={p.specifications[spec] ? 'font-medium' : 'text-gray-400'}>
          {p.specifications[spec] || '—'}
        </span>
      ),
    })),
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <GitCompareArrows className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-bold text-gray-900">Compare Products ({products.length})</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-auto flex-1">
          <table className="w-full">
            <thead className="sticky top-0 bg-white z-10">
              <tr>
                <th className="text-left py-4 px-4 w-40 bg-gray-50 text-xs font-semibold text-gray-400 uppercase border-b">Feature</th>
                {products.map((product) => (
                  <th key={product.id} className="py-4 px-4 border-b min-w-[200px]">
                    <div className="relative">
                      <button
                        onClick={() => onRemove(product.id)}
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center hover:bg-red-100 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <ProductImage
                        productId={product.id}
                        category={product.category}
                        name={product.name}
                        size="md"
                        className="h-24 rounded-lg mb-2"
                      />
                      <Link href={`/marketplace/${product.slug}`} className="text-sm font-semibold text-gray-900 hover:text-orange-600 line-clamp-2">
                        {product.name}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? 'bg-gray-50/50' : ''}>
                  <td className="py-3 px-4 text-sm font-medium text-gray-500 border-r border-gray-100">{row.label}</td>
                  {products.map((product) => (
                    <td key={product.id} className="py-3 px-4 text-sm text-gray-900">
                      {row.getValue(product)}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Add to Cart Row */}
              <tr className="border-t-2 border-gray-200">
                <td className="py-4 px-4 text-sm font-medium text-gray-500">Action</td>
                {products.map((product) => (
                  <td key={product.id} className="py-4 px-4">
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      icon={<ShoppingCart className="h-4 w-4" />}
                      onClick={() => addItem(product, 1, 'buy')}
                    >
                      Add to Cart
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ---- Compare Bar (sticky at bottom) ----
interface CompareBarProps {
  products: Product[];
  onCompare: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function CompareBar({ products, onCompare, onRemove, onClear }: CompareBarProps) {
  if (products.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-orange-500 shadow-2xl px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GitCompareArrows className="h-5 w-5 text-orange-600" />
          <span className="text-sm font-semibold text-gray-900">
            {products.length} product{products.length !== 1 ? 's' : ''} to compare
          </span>
          <div className="flex gap-2 ml-2">
            {products.map((p) => (
              <div key={p.id} className="relative">
                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
                <button
                  onClick={() => onRemove(p.id)}
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gray-800 text-white flex items-center justify-center"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onClear} className="text-sm text-gray-500 hover:text-gray-700">Clear</button>
          <Button variant="urgent" size="sm" icon={<GitCompareArrows className="h-4 w-4" />} onClick={onCompare} disabled={products.length < 2}>
            Compare {products.length >= 2 ? `(${products.length})` : '— Add more'}
          </Button>
        </div>
      </div>
    </div>
  );
}
