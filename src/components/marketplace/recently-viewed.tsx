'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Package, Star, ChevronRight } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import type { Product } from '@/types';

const STORAGE_KEY = 'dreams_recently_viewed';
const MAX_ITEMS = 8;

export function addToRecentlyViewed(product: Product) {
  if (typeof window === 'undefined') return;
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Product[];
    const filtered = stored.filter((p) => p.id !== product.id);
    const updated = [product, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable
  }
}

export function useRecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Product[];
      setProducts(stored);
    } catch {
      setProducts([]);
    }
  }, []);

  return products;
}

export function RecentlyViewedSection() {
  const products = useRecentlyViewed();

  if (products.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-400" />
          Recently Viewed
        </h3>
        <Link href="/marketplace" className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
          View All <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/marketplace/${product.slug}`}
            className="flex-shrink-0 w-40 bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all"
          >
            <div className="h-28 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
              <Package className="h-10 w-10 text-gray-300" />
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-500">{product.brand}</p>
              <p className="text-xs font-semibold text-gray-900 line-clamp-2 mt-0.5 leading-snug">{product.name}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-gray-900">{formatCurrency(product.price)}</span>
                <div className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-gray-500">{product.rating}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
