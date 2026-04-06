'use client';

import { useState } from 'react';
import {
  Package,
  Upload,
  DollarSign,
  Tag,
  Plus,
  X,
  Save,
  Eye,
  Zap,
  Key,
  Image,
  Info,
  Trash2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { cn, CATEGORY_LABELS, formatCurrency } from '@/lib/utils';
import type { Product, RentalPeriod } from '@/types';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Partial<Product>;
  onSave: (data: Partial<Product>) => void;
}

export function ProductForm({ isOpen, onClose, product, onSave }: ProductFormProps) {
  const isEditing = !!product?.id;
  const [loading, setLoading] = useState(false);
  const [isRentable, setIsRentable] = useState(product?.is_rentable || false);
  const [isUrgent, setIsUrgent] = useState(product?.is_urgent_eligible || false);
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [specs, setSpecs] = useState<Record<string, string>>(product?.specifications || {});
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [rentalPrices, setRentalPrices] = useState(
    product?.rental_prices || [
      { period: 'daily' as RentalPeriod, price: 0, deposit: 0 },
    ]
  );

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const addSpec = () => {
    if (specKey.trim() && specValue.trim()) {
      setSpecs({ ...specs, [specKey.trim()]: specValue.trim() });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    onSave({
      ...product,
      tags,
      specifications: specs,
      is_rentable: isRentable,
      is_urgent_eligible: isUrgent,
      rental_prices: isRentable ? rentalPrices : undefined,
    });
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Product' : 'Add New Product'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-orange-600" /> Basic Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input label="Product Name" placeholder="DeWalt 20V MAX XR Hammer Drill Kit" defaultValue={product?.name} required />
            </div>
            <Input label="SKU" placeholder="DW-HMD-20V-XR" defaultValue={product?.sku} required />
            <Input label="Brand" placeholder="DeWalt" defaultValue={product?.brand} required />
            <Select
              label="Category"
              options={Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }))}
              placeholder="Select category"
            />
            <Input label="Subcategory" placeholder="e.g., Cordless Drills" defaultValue={product?.subcategory} />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
              rows={3}
              placeholder="Detailed product description..."
              defaultValue={product?.description}
            />
          </div>
          <div className="mt-4">
            <Input label="Short Description" placeholder="Brief summary for search results" defaultValue={product?.short_description} />
          </div>
        </div>

        {/* Images */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Image className="h-4 w-4 text-orange-600" /> Product Images
          </h3>
          <div className="flex gap-3 flex-wrap">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 w-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-500 cursor-pointer transition-colors"
              >
                <Upload className="h-5 w-5" />
                <span className="text-[10px] mt-1">Upload</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-orange-600" /> Pricing & Inventory
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Input label="Price" type="number" step="0.01" placeholder="299.99" defaultValue={product?.price?.toString()} icon={<DollarSign className="h-4 w-4" />} required />
            <Input label="Compare at Price" type="number" step="0.01" placeholder="349.99" defaultValue={product?.compare_at_price?.toString()} icon={<DollarSign className="h-4 w-4" />} hint="Original price for sale display" />
            <Input label="Stock Quantity" type="number" placeholder="50" defaultValue={product?.stock_quantity?.toString()} required />
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            <Input label="Min Order Qty" type="number" placeholder="1" defaultValue={product?.min_order_quantity?.toString() || '1'} />
            <Input label="Max Order Qty" type="number" placeholder="100" defaultValue={product?.max_order_quantity?.toString()} />
            <Input label="Weight (lbs)" type="number" step="0.1" placeholder="8.5" defaultValue={product?.weight_lbs?.toString()} />
          </div>
        </div>

        {/* Rental */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Key className="h-4 w-4 text-purple-600" /> Rental Options
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRentable}
                onChange={(e) => setIsRentable(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-orange-600"
              />
              <span className="text-sm text-gray-700">Enable rentals</span>
            </label>
          </div>
          {isRentable && (
            <div className="space-y-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
              {rentalPrices.map((rp, i) => (
                <div key={i} className="grid grid-cols-4 gap-3 items-end">
                  <Select
                    label={i === 0 ? 'Period' : undefined}
                    value={rp.period}
                    onChange={(e) => {
                      const updated = [...rentalPrices];
                      updated[i] = { ...rp, period: e.target.value as RentalPeriod };
                      setRentalPrices(updated);
                    }}
                    options={[
                      { value: 'hourly', label: 'Hourly' },
                      { value: 'daily', label: 'Daily' },
                      { value: 'weekly', label: 'Weekly' },
                      { value: 'monthly', label: 'Monthly' },
                    ]}
                  />
                  <Input
                    label={i === 0 ? 'Price' : undefined}
                    type="number"
                    step="0.01"
                    placeholder="45.00"
                    value={rp.price || ''}
                    onChange={(e) => {
                      const updated = [...rentalPrices];
                      updated[i] = { ...rp, price: parseFloat(e.target.value) || 0 };
                      setRentalPrices(updated);
                    }}
                  />
                  <Input
                    label={i === 0 ? 'Deposit' : undefined}
                    type="number"
                    step="0.01"
                    placeholder="100.00"
                    value={rp.deposit || ''}
                    onChange={(e) => {
                      const updated = [...rentalPrices];
                      updated[i] = { ...rp, deposit: parseFloat(e.target.value) || 0 };
                      setRentalPrices(updated);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setRentalPrices(rentalPrices.filter((_, j) => j !== i))}
                    className="p-2.5 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={<Plus className="h-3 w-3" />}
                onClick={() => setRentalPrices([...rentalPrices, { period: 'weekly' as RentalPeriod, price: 0, deposit: 0 }])}
              >
                Add Period
              </Button>
            </div>
          )}
        </div>

        {/* Delivery */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-600" /> Delivery Settings
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-orange-600"
              />
              <span className="text-sm text-gray-700">Urgent delivery eligible</span>
            </label>
          </div>
          {isUrgent && (
            <Input label="Estimated Delivery Time (minutes)" type="number" placeholder="45" defaultValue={product?.estimated_delivery_minutes?.toString()} hint="Average time from order to customer delivery" />
          )}
        </div>

        {/* Tags */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Tag className="h-4 w-4 text-orange-600" /> Tags
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="default" size="sm">
                {tag}
                <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))} className="ml-1 text-gray-400 hover:text-gray-600">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" variant="outline" size="md" onClick={addTag}>Add</Button>
          </div>
        </div>

        {/* Specifications */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-orange-600" /> Specifications
          </h3>
          {Object.entries(specs).length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                  <span><span className="text-gray-500">{key}:</span> <span className="font-medium">{value}</span></span>
                  <button type="button" onClick={() => { const s = { ...specs }; delete s[key]; setSpecs(s); }} className="text-gray-400 hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Input placeholder="Spec name" value={specKey} onChange={(e) => setSpecKey(e.target.value)} />
            <Input placeholder="Value" value={specValue} onChange={(e) => setSpecValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpec())} />
            <Button type="button" variant="outline" size="md" onClick={addSpec}>Add</Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" fullWidth loading={loading} icon={<Save className="h-4 w-4" />}>
            {isEditing ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
