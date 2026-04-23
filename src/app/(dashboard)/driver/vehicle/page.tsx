'use client';

import { useState } from 'react';
import {
  Car,
  Truck,
  Plus,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  FileText,
  Wrench,
  Fuel,
  Activity,
  Camera,
  ChevronRight,
  Clock,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Tabs } from '@/components/ui/tabs';
import { cn, formatDate } from '@/lib/utils';

const vehicles = [
  {
    id: 'v_1',
    make: 'Ford',
    model: 'Transit 250',
    year: 2022,
    plate: 'TX-PRO-4281',
    color: 'White',
    type: 'van',
    primary: true,
    verified: true,
    insuranceExpires: '2026-08-15',
    registrationExpires: '2027-01-30',
    inspectionExpires: '2026-05-20',
    mileage: 48250,
    lastService: '2026-02-15',
    nextService: '2026-05-15',
    capacity: '500 lbs',
    mpg: 18,
    totalDeliveries: 1247,
    totalMiles: 8420,
  },
  {
    id: 'v_2',
    make: 'Toyota',
    model: 'RAV4',
    year: 2021,
    plate: 'TX-DRV-2849',
    color: 'Silver',
    type: 'car',
    primary: false,
    verified: true,
    insuranceExpires: '2026-11-20',
    registrationExpires: '2026-09-05',
    inspectionExpires: '2026-09-05',
    mileage: 34500,
    lastService: '2026-03-01',
    nextService: '2026-06-01',
    capacity: '150 lbs',
    mpg: 30,
    totalDeliveries: 245,
    totalMiles: 1820,
  },
];

const maintenanceHistory = [
  { id: 'm_1', date: '2026-02-15', vehicle: 'Transit 250', service: 'Oil change + Tire rotation', cost: 89.99, mileage: 47200 },
  { id: 'm_2', date: '2026-01-10', vehicle: 'Transit 250', service: 'Brake inspection', cost: 0, mileage: 45100 },
  { id: 'm_3', date: '2025-11-22', vehicle: 'Transit 250', service: 'State inspection', cost: 25.00, mileage: 42000 },
  { id: 'm_4', date: '2025-10-15', vehicle: 'Transit 250', service: 'Full service + Air filter', cost: 179.99, mileage: 40500 },
];

export default function DriverVehiclePage() {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [showAdd, setShowAdd] = useState(false);

  const getDaysUntil = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your delivery vehicles and maintenance records.</p>
        </div>
        <Button variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => setShowAdd(true)}>
          Add Vehicle
        </Button>
      </div>

      <Tabs
        variant="boxed"
        tabs={[
          { id: 'vehicles', label: 'Vehicles', icon: <Car className="h-4 w-4" />, count: vehicles.length },
          { id: 'maintenance', label: 'Maintenance', icon: <Wrench className="h-4 w-4" />, count: maintenanceHistory.length },
          { id: 'documents', label: 'Documents', icon: <FileText className="h-4 w-4" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'vehicles' && (
        <div className="space-y-6">
          {vehicles.map((v) => {
            const insuranceDays = getDaysUntil(v.insuranceExpires);
            const registrationDays = getDaysUntil(v.registrationExpires);
            const inspectionDays = getDaysUntil(v.inspectionExpires);
            const needsAttention = insuranceDays < 30 || registrationDays < 30 || inspectionDays < 30;

            return (
              <Card key={v.id} className={cn(v.primary && 'ring-2 ring-orange-500')}>
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Vehicle Photo */}
                  <div className="lg:w-64 flex-shrink-0">
                    <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                      {v.type === 'van' || v.type === 'truck' ? (
                        <Truck className="h-24 w-24 text-gray-600" />
                      ) : (
                        <Car className="h-24 w-24 text-gray-600" />
                      )}
                      {v.primary && (
                        <Badge variant="urgent" size="sm" className="absolute top-2 left-2">Primary</Badge>
                      )}
                      <button className="absolute bottom-2 right-2 h-9 w-9 rounded-lg bg-white/90 text-gray-600 flex items-center justify-center hover:bg-white">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      {v.verified && <Badge variant="success" size="sm"><CheckCircle2 className="h-3 w-3 mr-0.5" /> Verified</Badge>}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-extrabold text-gray-900">{v.year} {v.make} {v.model}</h2>
                        <p className="text-sm text-gray-500">{v.color} &middot; {v.plate} &middot; {v.capacity} capacity</p>
                      </div>
                      <Button variant="outline" size="sm" icon={<Edit className="h-3.5 w-3.5" />}>Edit</Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-500 font-semibold uppercase">Mileage</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{v.mileage.toLocaleString()}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-500 font-semibold uppercase">Deliveries</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{v.totalDeliveries.toLocaleString()}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-500 font-semibold uppercase">Miles driven</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{v.totalMiles.toLocaleString()}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-500 font-semibold uppercase">MPG</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{v.mpg}</p>
                      </div>
                    </div>

                    {/* Documents Status */}
                    <div className="space-y-2">
                      {[
                        { label: 'Insurance', expires: v.insuranceExpires, days: insuranceDays },
                        { label: 'Registration', expires: v.registrationExpires, days: registrationDays },
                        { label: 'Inspection', expires: v.inspectionExpires, days: inspectionDays },
                      ].map((doc) => (
                        <div key={doc.label} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-2">
                            <FileText className={cn('h-4 w-4', doc.days < 30 ? 'text-amber-500' : 'text-gray-400')} />
                            <span className="text-sm text-gray-700">{doc.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Expires {formatDate(doc.expires)}</span>
                            <Badge variant={doc.days < 14 ? 'danger' : doc.days < 30 ? 'warning' : 'success'} size="sm">
                              {doc.days < 0 ? 'Expired' : `${doc.days}d`}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    {needsAttention && (
                      <div className="mt-4 flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                        <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-900">Documents expiring soon</p>
                          <p className="text-xs text-amber-700">Please upload updated documents before expiration.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card padding="sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Next service</p>
                  <p className="text-sm font-bold text-gray-900">May 15, 2026</p>
                </div>
              </div>
            </Card>
            <Card padding="sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last service</p>
                  <p className="text-sm font-bold text-gray-900">Feb 15, 2026</p>
                </div>
              </div>
            </Card>
            <Card padding="sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Fuel className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">YTD maintenance cost</p>
                  <p className="text-sm font-bold text-gray-900">$294.98</p>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">Maintenance history</h2>
              <Button variant="outline" size="sm" icon={<Plus className="h-3.5 w-3.5" />}>Log service</Button>
            </div>
            <div className="space-y-2">
              {maintenanceHistory.map((m) => (
                <Card key={m.id} padding="sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Wrench className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{m.service}</p>
                        <p className="text-xs text-gray-500">{m.vehicle} &middot; {m.mileage.toLocaleString()} mi</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{m.cost === 0 ? 'Free' : `$${m.cost.toFixed(2)}`}</p>
                      <p className="text-xs text-gray-500">{formatDate(m.date)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-3">
          {[
            { name: 'Driver License', expires: '2028-06-15', status: 'valid' },
            { name: 'Vehicle Insurance (Transit 250)', expires: '2026-08-15', status: 'valid' },
            { name: 'Vehicle Insurance (RAV4)', expires: '2026-11-20', status: 'valid' },
            { name: 'Vehicle Registration (Transit 250)', expires: '2027-01-30', status: 'valid' },
            { name: 'Vehicle Registration (RAV4)', expires: '2026-09-05', status: 'valid' },
            { name: 'State Inspection (Transit 250)', expires: '2026-05-20', status: 'expiring' },
          ].map((doc) => (
            <Card key={doc.name} padding="sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center',
                    doc.status === 'valid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  )}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">Expires {formatDate(doc.expires)}</p>
                  </div>
                </div>
                <Badge variant={doc.status === 'valid' ? 'success' : 'warning'} size="sm">
                  {doc.status === 'valid' ? 'Valid' : 'Expiring'}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add a Vehicle">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowAdd(false); }}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Make" placeholder="Ford" required />
            <Input label="Model" placeholder="Transit 250" required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Year" placeholder="2022" required />
            <Input label="Color" placeholder="White" />
            <Input label="License Plate" placeholder="TX-ABC-1234" required />
          </div>
          <Input label="VIN" placeholder="1FTBW2CM5JKB12345" />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="submit" variant="primary" fullWidth icon={<Car className="h-4 w-4" />}>Add Vehicle</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
