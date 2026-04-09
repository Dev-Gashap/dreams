'use client';

import { useState } from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Plus,
  Edit,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  Building2,
  Zap,
  Settings,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tabs } from '@/components/ui/tabs';
import { StatsCard } from '@/components/ui/stats-card';
import { cn, formatCurrency } from '@/lib/utils';

const warehouses = [
  { id: 'wh_1', name: 'Main Warehouse', location: 'Houston, TX', items: 342, value: 248920 },
  { id: 'wh_2', name: 'Dallas Branch', location: 'Dallas, TX', items: 187, value: 142800 },
  { id: 'wh_3', name: 'Austin Hub', location: 'Austin, TX', items: 124, value: 89400 },
];

const inventoryItems = [
  { id: 'inv_1', sku: 'DW-HMD-20V-XR', name: 'DeWalt 20V Hammer Drill', category: 'Power Tools', stock: 24, reorderPoint: 10, autoReorder: true, supplier: 'DeWalt Direct', lastRestock: '2026-03-25', warehouse: 'Main', value: 7199.76, status: 'in_stock' as const },
  { id: 'inv_2', sku: 'FLK-117-ELEC', name: 'Fluke 117 Multimeter', category: 'Electrical', stock: 8, reorderPoint: 15, autoReorder: true, supplier: 'Fluke Corporation', lastRestock: '2026-03-20', warehouse: 'Main', value: 1759.92, status: 'low_stock' as const },
  { id: 'inv_3', sku: 'NET-C6A-PL-1000', name: 'CAT6A Plenum Cable 1000ft', category: 'Networking', stock: 45, reorderPoint: 20, autoReorder: true, supplier: 'Belden', lastRestock: '2026-03-28', warehouse: 'Dallas', value: 17549.55, status: 'in_stock' as const },
  { id: 'inv_4', sku: 'HLT-TE70-ATC', name: 'Hilti Rotary Hammer TE 70', category: 'Power Tools', stock: 2, reorderPoint: 3, autoReorder: false, supplier: 'Hilti USA', lastRestock: '2026-03-15', warehouse: 'Main', value: 3798.00, status: 'critical' as const },
  { id: 'inv_5', sku: '3M-6900-LG', name: '3M Full Face Respirator', category: 'Safety', stock: 42, reorderPoint: 20, autoReorder: true, supplier: '3M Direct', lastRestock: '2026-03-22', warehouse: 'Austin', value: 6719.58, status: 'in_stock' as const },
  { id: 'inv_6', sku: 'KLN-32500-11', name: 'Klein 11-in-1 Screwdriver', category: 'Hand Tools', stock: 0, reorderPoint: 50, autoReorder: true, supplier: 'Klein Tools', lastRestock: '2026-03-10', warehouse: 'Main', value: 0, status: 'out_of_stock' as const },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  in_stock: { label: 'In Stock', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 className="h-3 w-3" /> },
  low_stock: { label: 'Low Stock', color: 'bg-amber-100 text-amber-700', icon: <TrendingDown className="h-3 w-3" /> },
  critical: { label: 'Critical', color: 'bg-orange-100 text-orange-700', icon: <AlertTriangle className="h-3 w-3" /> },
  out_of_stock: { label: 'Out of Stock', color: 'bg-red-100 text-red-700', icon: <AlertTriangle className="h-3 w-3" /> },
};

export default function VendorInventoryPage() {
  const [activeTab, setActiveTab] = useState('items');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = inventoryItems.filter((item) => {
    const matchesWarehouse = warehouseFilter === 'all' || item.warehouse === warehouseFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWarehouse && matchesStatus && matchesSearch;
  });

  const totalValue = inventoryItems.reduce((s, i) => s + i.value, 0);
  const lowStockCount = inventoryItems.filter((i) => i.status === 'low_stock' || i.status === 'critical').length;
  const outOfStockCount = inventoryItems.filter((i) => i.status === 'out_of_stock').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500 mt-1">Track stock across warehouses with automatic reorder alerts.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<Settings className="h-4 w-4" />}>Auto-Reorder Rules</Button>
          <Button variant="primary" icon={<Plus className="h-4 w-4" />}>Add Item</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Items" value={inventoryItems.length.toString()} icon={<Package className="h-5 w-5" />} color="blue" />
        <StatsCard title="Inventory Value" value={formatCurrency(totalValue)} icon={<TrendingUp className="h-5 w-5" />} color="green" />
        <StatsCard title="Low Stock Alerts" value={lowStockCount.toString()} icon={<AlertTriangle className="h-5 w-5" />} color="amber" />
        <StatsCard title="Out of Stock" value={outOfStockCount.toString()} icon={<TrendingDown className="h-5 w-5" />} color="red" />
      </div>

      <Tabs
        variant="boxed"
        tabs={[
          { id: 'items', label: 'Items', count: inventoryItems.length },
          { id: 'warehouses', label: 'Warehouses', count: warehouses.length },
          { id: 'reorder', label: 'Auto-Reorder Queue', count: lowStockCount },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'items' && (
        <>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input placeholder="Search inventory..." icon={<Search className="h-4 w-4" />} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={warehouseFilter} onChange={(e) => setWarehouseFilter(e.target.value)} options={[
              { value: 'all', label: 'All Warehouses' },
              { value: 'Main', label: 'Main Warehouse' },
              { value: 'Dallas', label: 'Dallas Branch' },
              { value: 'Austin', label: 'Austin Hub' },
            ]} className="w-44" />
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'in_stock', label: 'In Stock' },
              { value: 'low_stock', label: 'Low Stock' },
              { value: 'critical', label: 'Critical' },
              { value: 'out_of_stock', label: 'Out of Stock' },
            ]} className="w-40" />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Item</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">SKU</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Reorder At</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Warehouse</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Auto</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Value</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const status = statusConfig[item.status];
                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-600 font-mono">{item.sku}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={cn('text-sm font-bold', item.stock === 0 ? 'text-red-600' : item.stock <= item.reorderPoint ? 'text-amber-600' : 'text-gray-900')}>
                            {item.stock}
                          </span>
                          {item.stock <= item.reorderPoint && item.stock > 0 && <TrendingDown className="h-3.5 w-3.5 text-amber-500" />}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{item.reorderPoint}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{item.warehouse}</td>
                      <td className="py-3 px-4">
                        {item.autoReorder ? <Zap className="h-4 w-4 text-emerald-500" /> : <span className="text-gray-300 text-xs">—</span>}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">{formatCurrency(item.value)}</td>
                      <td className="py-3 px-4">
                        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', status.color)}>
                          {status.icon} {status.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"><RotateCcw className="h-4 w-4" /></button>
                          <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"><Edit className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'warehouses' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {warehouses.map((wh) => (
            <Card key={wh.id} hover>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{wh.name}</h3>
                  <p className="text-xs text-gray-500">{wh.location}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{wh.items}</p>
                      <p className="text-xs text-gray-500">items</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">{formatCurrency(wh.value)}</p>
                      <p className="text-xs text-gray-500">value</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'reorder' && (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-900">{lowStockCount + outOfStockCount} items need reordering</p>
              <p className="text-xs text-amber-700 mt-0.5">Auto-reorder is enabled for {inventoryItems.filter((i) => i.autoReorder && (i.status === 'low_stock' || i.status === 'critical' || i.status === 'out_of_stock')).length} items.</p>
            </div>
          </div>
          {inventoryItems.filter((i) => i.status !== 'in_stock').map((item) => (
            <Card key={item.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.sku} &middot; Supplier: {item.supplier}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{item.stock} / {item.reorderPoint}</p>
                    <p className="text-xs text-gray-500">stock / reorder at</p>
                  </div>
                  {item.autoReorder ? (
                    <Badge variant="success" size="sm"><Zap className="h-3 w-3 mr-0.5" /> Auto-ordering</Badge>
                  ) : (
                    <Button variant="primary" size="xs">Reorder Now</Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
