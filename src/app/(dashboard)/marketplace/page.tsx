'use client';

import { useState, useMemo } from 'react';
import {
  Star,
  Zap,
  Clock,
  ShoppingCart,
  Key,
  Heart,
  Eye,
  SlidersHorizontal,
  Grid3X3,
  List,
  X,
  Check,
  ChevronDown,
  Truck,
  Store,
  Package,
} from 'lucide-react';
import { SearchBar } from '@/components/ui/search-bar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Select } from '@/components/ui/select';
import { Tabs } from '@/components/ui/tabs';
import { cn, formatCurrency, formatETA, CATEGORY_LABELS } from '@/lib/utils';
import { mockProducts } from '@/lib/mock-data';
import { useCartStore, useSearchStore } from '@/store';
import type { Product, FulfillmentType, RentalPeriod, ProductCategory } from '@/types';

export default function MarketplacePage() {
  const { query, isUrgent, showFilters, setQuery, setUrgent, toggleFilters, filters, setFilters } = useSearchStore();
  const { addItem } = useCartStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('buy');
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>('daily');
  const [quantity, setQuantity] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    let results = [...mockProducts];
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (isUrgent) results = results.filter((p) => p.is_urgent_eligible);
    if (activeCategory !== 'all') results = results.filter((p) => p.category === activeCategory);
    if (filters.min_price) results = results.filter((p) => p.price >= (filters.min_price || 0));
    if (filters.max_price) results = results.filter((p) => p.price <= (filters.max_price || Infinity));
    if (filters.rental_available) results = results.filter((p) => p.is_rentable);

    switch (filters.sort_by) {
      case 'price_asc': results.sort((a, b) => a.price - b.price); break;
      case 'price_desc': results.sort((a, b) => b.price - a.price); break;
      case 'rating': results.sort((a, b) => b.rating - a.rating); break;
      case 'delivery_speed': results.sort((a, b) => (a.estimated_delivery_minutes || 999) - (b.estimated_delivery_minutes || 999)); break;
      case 'newest': results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
    }
    return results;
  }, [query, isUrgent, activeCategory, filters]);

  const handleAddToCart = (product: Product) => {
    addItem(product, quantity, fulfillmentType, fulfillmentType === 'rent' ? rentalPeriod : undefined);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const categoryTabs = [
    { id: 'all', label: 'All Items' },
    ...Object.entries(CATEGORY_LABELS)
      .filter(([key]) => mockProducts.some((p) => p.category === key))
      .map(([key, label]) => ({ id: key, label })),
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
        <p className="text-sm text-gray-500 mt-1">Find tools, materials, and equipment. Buy or rent. Standard or urgent delivery.</p>
      </div>

      {/* Search */}
      <SearchBar
        onSearch={setQuery}
        onFilterToggle={toggleFilters}
        isUrgent={isUrgent}
        onUrgentToggle={() => setUrgent(!isUrgent)}
        size="lg"
      />

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </h3>
            <button onClick={toggleFilters} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Select
              label="Sort By"
              value={filters.sort_by || 'relevance'}
              onChange={(e) => setFilters({ sort_by: e.target.value as 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'delivery_speed' | 'newest' })}
              options={[
                { value: 'relevance', label: 'Relevance' },
                { value: 'price_asc', label: 'Price: Low to High' },
                { value: 'price_desc', label: 'Price: High to Low' },
                { value: 'rating', label: 'Highest Rated' },
                { value: 'delivery_speed', label: 'Fastest Delivery' },
                { value: 'newest', label: 'Newest' },
              ]}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Price</label>
              <input
                type="number"
                placeholder="$0"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                onChange={(e) => setFilters({ min_price: Number(e.target.value) || undefined })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Price</label>
              <input
                type="number"
                placeholder="$9999"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                onChange={(e) => setFilters({ max_price: Number(e.target.value) || undefined })}
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.rental_available || false}
                  onChange={(e) => setFilters({ rental_available: e.target.checked || undefined })}
                  className="h-4 w-4 rounded border-gray-300 text-orange-600"
                />
                <span className="text-sm font-medium text-gray-700">Rental Available</span>
              </label>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.in_stock_only || false}
                  onChange={(e) => setFilters({ in_stock_only: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-orange-600"
                />
                <span className="text-sm font-medium text-gray-700">In Stock Only</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4">
        <Tabs tabs={categoryTabs} activeTab={activeCategory} onChange={setActiveCategory} variant="pills" />
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products found
          {query && <span> for &quot;{query}&quot;</span>}
          {isUrgent && <Badge variant="urgent" size="sm" className="ml-2">Urgent Only</Badge>}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={cn('p-2 rounded-lg', viewMode === 'grid' ? 'bg-gray-200 text-gray-900' : 'text-gray-400 hover:bg-gray-100')}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn('p-2 rounded-lg', viewMode === 'list' ? 'bg-gray-200 text-gray-900' : 'text-gray-400 hover:bg-gray-100')}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className={cn(
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'space-y-3'
      )}>
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={cn(
              'bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 group',
              viewMode === 'list' && 'flex'
            )}
          >
            {/* Image */}
            <div className={cn(
              'bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center relative',
              viewMode === 'grid' ? 'aspect-square' : 'w-48 flex-shrink-0'
            )}>
              <Package className="h-16 w-16 text-gray-300" />
              {product.compare_at_price && (
                <div className="absolute top-3 left-3">
                  <Badge variant="danger" size="sm">
                    {Math.round((1 - product.price / product.compare_at_price) * 100)}% OFF
                  </Badge>
                </div>
              )}
              {product.is_urgent_eligible && (
                <div className="absolute top-3 right-3">
                  <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <Zap className="h-4 w-4 text-white fill-white" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors shadow-sm"
                >
                  <Eye className="h-3.5 w-3.5" /> Quick View
                </button>
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className={cn('p-4', viewMode === 'list' && 'flex-1 flex flex-col justify-between')}>
              <div>
                <p className="text-xs text-gray-500 font-medium">{product.brand}</p>
                <h3 className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2 leading-snug">{product.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                  </div>
                  <span className="text-xs text-gray-400">({product.review_count})</span>
                </div>
                <div className="flex items-center flex-wrap gap-1.5 mt-2">
                  {product.is_rentable && (
                    <Badge variant="info" size="sm"><Key className="h-3 w-3 mr-0.5" /> Rental</Badge>
                  )}
                  {product.is_urgent_eligible && product.estimated_delivery_minutes && (
                    <Badge variant="urgent" size="sm"><Clock className="h-3 w-3 mr-0.5" /> {formatETA(product.estimated_delivery_minutes)}</Badge>
                  )}
                </div>
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
                  onClick={() => setSelectedProduct(product)}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => { setSelectedProduct(null); setQuantity(1); }}
          size="xl"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl aspect-square flex items-center justify-center relative">
              <Package className="h-24 w-24 text-gray-300" />
              {selectedProduct.is_urgent_eligible && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-full text-sm font-semibold">
                  <Zap className="h-4 w-4 fill-white" /> Urgent Eligible
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <p className="text-sm text-gray-500 font-medium">{selectedProduct.brand}</p>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">{selectedProduct.name}</h2>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{selectedProduct.rating}</span>
                </div>
                <span className="text-sm text-gray-400">({selectedProduct.review_count} reviews)</span>
                <span className="text-sm text-gray-400">|</span>
                <span className="text-sm text-gray-500">SKU: {selectedProduct.sku}</span>
              </div>

              <p className="text-sm text-gray-600 mt-4 leading-relaxed">{selectedProduct.description}</p>

              {/* Fulfillment Type */}
              {selectedProduct.is_rentable && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Fulfillment Type</p>
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
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">{formatCurrency(selectedProduct.price)}</span>
                    {selectedProduct.compare_at_price && (
                      <span className="text-lg text-gray-400 line-through">{formatCurrency(selectedProduct.compare_at_price)}</span>
                    )}
                  </div>
                ) : (
                  <div>
                    <Select
                      label="Rental Period"
                      value={rentalPeriod}
                      onChange={(e) => setRentalPeriod(e.target.value as RentalPeriod)}
                      options={selectedProduct.rental_prices?.map((r) => ({
                        value: r.period,
                        label: `${r.period.charAt(0).toUpperCase() + r.period.slice(1)} — ${formatCurrency(r.price)} + ${formatCurrency(r.deposit)} deposit`,
                      })) || []}
                    />
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500 ml-2">{selectedProduct.stock_quantity} in stock</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Sold by <span className="font-medium">{selectedProduct.vendor_name}</span></span>
                </div>
                {selectedProduct.is_urgent_eligible && (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-orange-700 font-medium">
                      Urgent delivery available — est. {formatETA(selectedProduct.estimated_delivery_minutes || 60)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-emerald-700">In Stock — {selectedProduct.stock_quantity} available</span>
                </div>
              </div>

              {/* Specifications */}
              {Object.keys(selectedProduct.specifications).length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Specifications</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1.5 px-2 bg-gray-50 rounded text-sm">
                        <span className="text-gray-500">{key}</span>
                        <span className="font-medium text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <Button
                  variant="urgent"
                  size="lg"
                  fullWidth
                  icon={<ShoppingCart className="h-5 w-5" />}
                  onClick={() => handleAddToCart(selectedProduct)}
                >
                  {fulfillmentType === 'buy' ? 'Add to Cart' : 'Rent Now'}
                </Button>
                <button className="p-3 rounded-xl border-2 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
