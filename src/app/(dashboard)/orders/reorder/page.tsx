'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  Package,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Search,
  Clock,
  CheckCircle2,
  ArrowRight,
  Upload,
  FileText,
  Zap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { mockOrders, mockProducts } from '@/lib/mock-data';
import { useCartStore } from '@/store';

interface BulkItem {
  productId: string;
  name: string;
  sku: string;
  brand: string;
  price: number;
  quantity: number;
  available: boolean;
}

export default function ReorderPage() {
  const { addItem } = useCartStore();
  const [activeTab, setActiveTab] = useState('past_orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [bulkItems, setBulkItems] = useState<BulkItem[]>([]);
  const [bulkInput, setBulkInput] = useState('');

  // Build reorder list from past orders
  const pastOrderItems = mockOrders
    .filter((o) => ['delivered', 'completed'].includes(o.status))
    .flatMap((o) =>
      o.items.map((item) => ({
        ...item,
        orderNumber: o.order_number,
        orderDate: o.created_at,
        vendorName: o.vendor_name,
      }))
    );

  // Frequently ordered (mock)
  const frequentProducts = mockProducts.slice(0, 6);

  const handleReorderItem = (productId: string, quantity: number) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (product) {
      addItem(product, quantity, 'buy');
    }
  };

  const handleBulkParse = () => {
    const lines = bulkInput.split('\n').filter((l) => l.trim());
    const items: BulkItem[] = lines.map((line) => {
      const parts = line.split(/[,\t]/).map((s) => s.trim());
      const skuOrName = parts[0] || '';
      const qty = parseInt(parts[1]) || 1;

      const product = mockProducts.find(
        (p) => p.sku.toLowerCase() === skuOrName.toLowerCase() || p.name.toLowerCase().includes(skuOrName.toLowerCase())
      );

      return {
        productId: product?.id || '',
        name: product?.name || skuOrName,
        sku: product?.sku || skuOrName,
        brand: product?.brand || 'Unknown',
        price: product?.price || 0,
        quantity: qty,
        available: !!product,
      };
    });

    setBulkItems(items);
  };

  const addAllBulkToCart = () => {
    bulkItems.filter((i) => i.available).forEach((item) => {
      handleReorderItem(item.productId, item.quantity);
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quick Reorder</h1>
          <p className="text-sm text-gray-500 mt-1">Reorder from past orders, bulk import SKUs, or quickly add frequently ordered items.</p>
        </div>
        <Link href="/marketplace">
          <Button variant="outline" icon={<Search className="h-4 w-4" />}>Browse Marketplace</Button>
        </Link>
      </div>

      <Tabs
        variant="boxed"
        tabs={[
          { id: 'past_orders', label: 'Past Orders', icon: <Clock className="h-4 w-4" /> },
          { id: 'frequent', label: 'Frequently Ordered', icon: <RotateCcw className="h-4 w-4" /> },
          { id: 'bulk', label: 'Bulk Import', icon: <Upload className="h-4 w-4" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'past_orders' && (
        <div className="space-y-3">
          <Input
            placeholder="Search past order items..."
            icon={<Search className="h-4 w-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {pastOrderItems.length === 0 ? (
            <EmptyState
              icon={<Package className="h-12 w-12" />}
              title="No past orders"
              description="Complete some orders first, then you can quickly reorder from here."
            />
          ) : (
            pastOrderItems
              .filter((item) => !searchQuery || item.product_name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => (
                <Card key={`${item.id}-${item.orderNumber}`} hover>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.product_name}</p>
                        <p className="text-xs text-gray-500">
                          SKU: {item.sku} &middot; Qty: {item.quantity} &middot; {item.vendorName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Order {item.orderNumber} &middot; {formatDate(item.orderDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(item.unit_price)}</span>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<ShoppingCart className="h-3.5 w-3.5" />}
                        onClick={() => handleReorderItem(item.product_id, item.quantity)}
                      >
                        Reorder
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
          )}
        </div>
      )}

      {activeTab === 'frequent' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {frequentProducts.map((product) => (
            <Card key={product.id} hover>
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Package className="h-8 w-8 text-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2">{product.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{product.brand} &middot; {product.sku}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(product.price)}</span>
                    <Button
                      variant="primary"
                      size="xs"
                      icon={<Plus className="h-3 w-3" />}
                      onClick={() => addItem(product, 1, 'buy')}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'bulk' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" /> Paste SKUs or Product Names
              </CardTitle>
            </CardHeader>
            <p className="text-sm text-gray-500 mb-4">Enter one item per line. Optionally add quantity after a comma or tab.</p>
            <textarea
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm font-mono focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
              rows={10}
              placeholder={`DW-HMD-20V-XR, 2\nFLK-117-ELEC, 1\nKLN-32500-11, 6\ncopper pipe\ncat6a cable, 3`}
            />
            <div className="flex gap-3 mt-4">
              <Button variant="primary" icon={<Search className="h-4 w-4" />} onClick={handleBulkParse} fullWidth>
                Find Products
              </Button>
              <Button variant="outline" icon={<Upload className="h-4 w-4" />}>
                Upload CSV
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Results ({bulkItems.length} items)</CardTitle>
            </CardHeader>
            {bulkItems.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FileText className="h-12 w-12 mx-auto mb-3" />
                <p className="text-sm">Paste SKUs or names on the left and click Find Products</p>
              </div>
            ) : (
              <>
                <div className="space-y-2 max-h-80 overflow-auto">
                  {bulkItems.map((item, i) => (
                    <div key={i} className={cn(
                      'flex items-center justify-between p-3 rounded-lg',
                      item.available ? 'bg-gray-50' : 'bg-red-50'
                    )}>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          {item.available ? (
                            <Badge variant="success" size="sm"><CheckCircle2 className="h-3 w-3 mr-0.5" /> Found</Badge>
                          ) : (
                            <Badge variant="danger" size="sm">Not Found</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{item.sku} &middot; Qty: {item.quantity}</p>
                      </div>
                      {item.available && (
                        <span className="text-sm font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{bulkItems.filter((i) => i.available).length} of {bulkItems.length} found</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(bulkItems.filter((i) => i.available).reduce((sum, i) => sum + i.price * i.quantity, 0))}
                    </p>
                  </div>
                  <Button variant="urgent" icon={<ShoppingCart className="h-4 w-4" />} onClick={addAllBulkToCart}>
                    Add All to Cart
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
