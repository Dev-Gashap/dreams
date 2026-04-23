'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  Zap,
  Clock,
  ShoppingCart,
  Key,
  Heart,
  Share2,
  Truck,
  Store,
  Check,
  Shield,
  ChevronRight,
  Minus,
  Plus,
  MapPin,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Tabs } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { ProductImage } from '@/components/ui/product-image';
import { cn, formatCurrency, formatETA, CATEGORY_LABELS } from '@/lib/utils';
import { mockProducts, mockVendors } from '@/lib/mock-data';
import { useCartStore } from '@/store';
import type { FulfillmentType, RentalPeriod } from '@/types';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = mockProducts.find((p) => p.slug === slug) || mockProducts[0];
  const vendor = mockVendors.find((v) => v.id === product.vendor_id);
  const { addItem } = useCartStore();

  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('buy');
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>('daily');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);

  const relatedProducts = mockProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, quantity, fulfillmentType, fulfillmentType === 'rent' ? rentalPeriod : undefined);
  };

  const mockReviews = [
    { id: '1', name: 'Mike Torres', rating: 5, date: '2026-03-15', title: 'Exactly what I needed on site', body: 'Had this delivered to a job site in 35 minutes. Saved us from losing an entire day of work. Quality is excellent.', verified: true },
    { id: '2', name: 'Sarah Chen', rating: 4, date: '2026-03-10', title: 'Great product, fast delivery', body: 'Product works as advertised. Dreams delivery was incredibly fast. Would order again.', verified: true },
    { id: '3', name: 'James Rodriguez', rating: 5, date: '2026-02-28', title: 'A lifesaver for our crew', body: 'We had a critical tool failure mid-project. Ordered a replacement through Dreams and it was on site before lunch. Cannot recommend enough.', verified: true },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/marketplace" className="hover:text-gray-700 flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Marketplace
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-400">{CATEGORY_LABELS[product.category] || product.category}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-700 font-medium truncate">{product.name}</span>
      </div>

      {/* Product Main Section */}
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="relative">
            <ProductImage
              productId={product.id}
              category={product.category}
              name={product.name}
              size="full"
              className="aspect-square rounded-2xl"
            />
            {product.compare_at_price && (
              <div className="absolute top-4 left-4">
                <Badge variant="danger" size="lg">
                  {Math.round((1 - product.price / product.compare_at_price) * 100)}% OFF
                </Badge>
              </div>
            )}
            {product.is_urgent_eligible && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-full text-sm font-bold shadow-lg shadow-orange-500/30">
                <Zap className="h-4 w-4 fill-white" /> Urgent Eligible
              </div>
            )}
          </div>
          {/* Thumbnail strip */}
          <div className="flex gap-3 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-20 w-20 rounded-xl border-2 cursor-pointer overflow-hidden transition-all',
                  i === 1 ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <ProductImage
                  productId={product.id + '-' + i}
                  category={product.category}
                  name={product.name}
                  size="sm"
                  className="h-full w-full rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
              <h1 className="text-3xl font-extrabold text-gray-900 mt-1 leading-tight">{product.name}</h1>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={cn(
                  'p-2.5 rounded-xl border-2 transition-all',
                  isFavorite ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-gray-300'
                )}
              >
                <Heart className={cn('h-5 w-5', isFavorite && 'fill-red-500')} />
              </button>
              <button className="p-2.5 rounded-xl border-2 border-gray-200 text-gray-400 hover:border-gray-300">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn('h-5 w-5', i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200')} />
              ))}
            </div>
            <span className="font-bold text-gray-900">{product.rating}</span>
            <span className="text-sm text-gray-500">({product.review_count} reviews)</span>
            <span className="text-sm text-gray-300">|</span>
            <span className="text-sm text-gray-500">SKU: {product.sku}</span>
          </div>

          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

          {/* Fulfillment Toggle */}
          {product.is_rentable && (
            <div className="mt-6">
              <Tabs
                variant="boxed"
                tabs={[
                  { id: 'buy', label: 'Buy', icon: <ShoppingCart className="h-4 w-4" /> },
                  { id: 'rent', label: 'Rent', icon: <Key className="h-4 w-4" /> },
                ]}
                activeTab={fulfillmentType}
                onChange={(id) => setFulfillmentType(id as FulfillmentType)}
              />
            </div>
          )}

          {/* Price */}
          <div className="mt-6">
            {fulfillmentType === 'buy' ? (
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-gray-900">{formatCurrency(product.price)}</span>
                {product.compare_at_price && (
                  <span className="text-xl text-gray-400 line-through">{formatCurrency(product.compare_at_price)}</span>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <Select
                  label="Rental Period"
                  value={rentalPeriod}
                  onChange={(e) => setRentalPeriod(e.target.value as RentalPeriod)}
                  options={product.rental_prices?.map((r) => ({
                    value: r.period,
                    label: `${r.period.charAt(0).toUpperCase() + r.period.slice(1)} — ${formatCurrency(r.price)}`,
                  })) || []}
                />
                {product.rental_prices && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 text-sm text-purple-700">
                    Deposit required: {formatCurrency(product.rental_prices.find((r) => r.period === rentalPeriod)?.deposit || 0)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="mt-6 flex items-center gap-4">
            <p className="text-sm font-medium text-gray-700">Quantity</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-10 w-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-14 text-center text-lg font-bold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="h-10 w-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-sm text-gray-500">{product.stock_quantity} available</span>
          </div>

          {/* Info badges */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <Check className="h-5 w-5 text-emerald-500" />
              <span className="text-sm font-medium text-gray-700">In Stock</span>
            </div>
            {product.is_urgent_eligible && (
              <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl">
                <Truck className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">Est. {formatETA(product.estimated_delivery_minutes || 60)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <Store className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{product.vendor_name}</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <Shield className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Verified Vendor</span>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex gap-3">
            <Button variant="urgent" size="xl" fullWidth icon={<ShoppingCart className="h-5 w-5" />} onClick={handleAddToCart}>
              {fulfillmentType === 'buy' ? 'Add to Cart' : 'Rent Now'}
            </Button>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <Tabs
        variant="underline"
        tabs={[
          { id: 'description', label: 'Specifications' },
          { id: 'reviews', label: 'Reviews', count: product.review_count },
          { id: 'vendor', label: 'Vendor Info' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'description' && (
        <Card>
          <h3 className="font-bold text-gray-900 mb-4">Technical Specifications</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-500">{key}</span>
                <span className="text-sm font-semibold text-gray-900">{value}</span>
              </div>
            ))}
            {product.weight_lbs && (
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-500">Weight</span>
                <span className="text-sm font-semibold text-gray-900">{product.weight_lbs} lbs</span>
              </div>
            )}
          </div>
          {product.tags.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {/* Review Summary */}
          <Card>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-5xl font-extrabold text-gray-900">{product.rating}</p>
                <div className="flex gap-0.5 mt-2 justify-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn('h-4 w-4', i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200')} />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">{product.review_count} reviews</p>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const pct = stars === 5 ? 72 : stars === 4 ? 20 : stars === 3 ? 5 : stars === 2 ? 2 : 1;
                  return (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 w-6">{stars}</span>
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-400 w-8">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Individual Reviews */}
          {mockReviews.map((review) => (
            <Card key={review.id}>
              <div className="flex items-start gap-4">
                <Avatar name={review.name} size="md" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    {review.verified && <Badge variant="success" size="sm"><Check className="h-3 w-3 mr-0.5" /> Verified</Badge>}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn('h-3.5 w-3.5', i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200')} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <p className="font-medium text-gray-900 mt-2">{review.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{review.body}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                      <ThumbsUp className="h-4 w-4" /> Helpful
                    </button>
                    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                      <MessageSquare className="h-4 w-4" /> Reply
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'vendor' && vendor && (
        <Card>
          <div className="flex items-start gap-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
              <Store className="h-8 w-8 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{vendor.company_name}</h3>
              <p className="text-sm text-gray-500 mt-1">{vendor.description}</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{vendor.rating}</span>
                </div>
                <span className="text-sm text-gray-500">{vendor.total_orders.toLocaleString()} orders fulfilled</span>
                <span className="text-sm text-gray-500">Avg. {vendor.fulfillment_speed_avg_minutes} min fulfillment</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{vendor.address.street}, {vendor.address.city}, {vendor.address.state}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Truck className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Service radius: {vendor.service_radius_miles} miles</span>
              </div>
              <div className="flex gap-2 mt-1">
                {vendor.is_verified && <Badge variant="success" size="sm"><Shield className="h-3 w-3 mr-0.5" /> Verified</Badge>}
                <Badge variant="info" size="sm">{vendor.business_type}</Badge>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Related Products</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <Link key={p.id} href={`/marketplace/${p.slug}`}>
                <Card hover padding="none">
                  <ProductImage
                    productId={p.id}
                    category={p.category}
                    name={p.name}
                    size="lg"
                    className="aspect-square rounded-t-xl rounded-b-none"
                  />
                  <div className="p-4">
                    <p className="text-xs text-gray-500">{p.brand}</p>
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2 mt-0.5">{p.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(p.price)}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm">{p.rating}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
