'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  ShoppingCart,
  Star,
  Zap,
  Key,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { ProductImage } from '@/components/ui/product-image';
import { formatCurrency, formatETA } from '@/lib/utils';
import { mockProducts } from '@/lib/mock-data';
import { useCartStore } from '@/store';

export default function FavoritesPage() {
  // Simulate some favorited products
  const [favorites, setFavorites] = useState(mockProducts.slice(0, 6));

  const { addItem } = useCartStore();

  const removeFavorite = (productId: string) => {
    setFavorites((prev) => prev.filter((p) => p.id !== productId));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Favorites</h1>
          <p className="text-sm text-gray-500 mt-1">
            {favorites.length} saved item{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>
        {favorites.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setFavorites([])}>
            Clear All
          </Button>
        )}
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-12 w-12" />}
          title="No favorites yet"
          description="Save tools and materials you use often for quick access. Browse the marketplace to start adding favorites."
          action={{ label: 'Browse Marketplace', onClick: () => window.location.href = '/marketplace' }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((product) => (
            <Card key={product.id} hover padding="none">
              <div className="relative">
                <ProductImage
                  productId={product.id}
                  category={product.category}
                  name={product.name}
                  size="lg"
                  className="aspect-[4/3] rounded-t-xl rounded-b-none"
                />
                <button
                  onClick={() => removeFavorite(product.id)}
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Heart className="h-4 w-4 fill-red-500" />
                </button>
                {product.is_urgent_eligible && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="urgent" size="sm">
                      <Zap className="h-3 w-3 mr-0.5 fill-orange-500" /> {formatETA(product.estimated_delivery_minutes || 60)}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 font-medium">{product.brand}</p>
                <Link href={`/marketplace/${product.slug}`}>
                  <h3 className="text-sm font-semibold text-gray-900 mt-0.5 line-clamp-2 hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.review_count})</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  {product.is_rentable && (
                    <Badge variant="info" size="sm"><Key className="h-3 w-3 mr-0.5" /> Rental</Badge>
                  )}
                  {product.in_stock ? (
                    <Badge variant="success" size="sm">In Stock</Badge>
                  ) : (
                    <Badge variant="danger" size="sm">Out of Stock</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</p>
                    {product.compare_at_price && (
                      <p className="text-xs text-gray-400 line-through">{formatCurrency(product.compare_at_price)}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={<ShoppingCart className="h-3.5 w-3.5" />}
                    onClick={() => addItem(product, 1, 'buy')}
                    disabled={!product.in_stock}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
