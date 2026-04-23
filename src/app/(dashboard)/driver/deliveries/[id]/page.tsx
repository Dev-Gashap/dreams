'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Navigation,
  Phone,
  MessageSquare,
  Package,
  MapPin,
  CheckCircle2,
  Camera,
  FileSignature,
  AlertTriangle,
  Clock,
  Truck,
  QrCode,
  Scan,
  User,
  DollarSign,
  Route,
  Copy,
  ChevronRight,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { LiveMap } from '@/components/maps/live-map';
import { cn, formatCurrency } from '@/lib/utils';

type DeliveryStep = 'en_route_pickup' | 'arrived_pickup' | 'picked_up' | 'en_route_delivery' | 'arrived_delivery' | 'delivered';

const stepOrder: DeliveryStep[] = ['en_route_pickup', 'arrived_pickup', 'picked_up', 'en_route_delivery', 'arrived_delivery', 'delivered'];

export default function ActiveDeliveryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [currentStep, setCurrentStep] = useState<DeliveryStep>('en_route_pickup');
  const [showScanner, setShowScanner] = useState(false);
  const [showPhotoProof, setShowPhotoProof] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [issueModalOpen, setIssueModalOpen] = useState(false);

  const delivery = {
    id,
    orderNumber: 'DRM-LK82F-X9A3',
    payout: 28.00,
    surge: 1.5,
    estimatedEarnings: 42.00,
    pickupVendor: 'Pro Tool Supply',
    pickupAddress: '1250 Industrial Blvd, Houston TX 77001',
    pickupContact: 'Terry (warehouse)',
    pickupPhone: '+1-713-555-2100',
    pickupLat: 29.7604,
    pickupLng: -95.3698,
    deliveryAddress: '742 Evergreen Terrace, Houston TX 77002',
    deliveryLat: 29.762,
    deliveryLng: -95.367,
    customerName: 'Alex Morgan',
    customerPhone: '+1-713-555-0100',
    customerNote: 'Leave with site foreman at the entrance. Ask for Mike.',
    jobSite: 'Westfield Tower - Floor 12',
    items: [
      { name: 'DeWalt 20V MAX XR Hammer Drill Kit', quantity: 1, sku: 'DW-HMD-20V-XR' },
    ],
    distance: 4.2,
  };

  const stepIndex = stepOrder.indexOf(currentStep);
  const progress = (stepIndex / (stepOrder.length - 1));

  const handleNextStep = () => {
    const nextIdx = stepIndex + 1;
    if (nextIdx < stepOrder.length) {
      setCurrentStep(stepOrder[nextIdx]);
    }
  };

  const stepInfo: Record<DeliveryStep, { title: string; description: string; action: string; icon: React.ReactNode }> = {
    en_route_pickup: { title: 'Head to pickup', description: `Drive to ${delivery.pickupVendor}`, action: 'Arrived at pickup', icon: <Navigation className="h-5 w-5" /> },
    arrived_pickup: { title: 'At pickup location', description: 'Scan package QR or mark as picked up', action: 'Package picked up', icon: <Package className="h-5 w-5" /> },
    picked_up: { title: 'Package secured', description: 'Confirm items and head to delivery', action: 'Start delivery', icon: <CheckCircle2 className="h-5 w-5" /> },
    en_route_delivery: { title: 'On the way', description: `Delivering to ${delivery.customerName}`, action: 'Arrived at delivery', icon: <Truck className="h-5 w-5" /> },
    arrived_delivery: { title: 'At delivery location', description: 'Confirm delivery with photo or signature', action: 'Complete delivery', icon: <MapPin className="h-5 w-5" /> },
    delivered: { title: 'Delivered!', description: 'Great work. Payout will be added to today\'s total.', action: 'View earnings', icon: <CheckCircle2 className="h-5 w-5" /> },
  };

  const current = stepInfo[currentStep];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/driver/deliveries" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-semibold text-gray-900">{delivery.orderNumber}</span>
              <Badge variant="urgent" size="sm" dot pulse>Live</Badge>
              {delivery.surge > 1 && <Badge variant="warning" size="sm">{delivery.surge}x surge</Badge>}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Active delivery &middot; Expected earnings {formatCurrency(delivery.estimatedEarnings)}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" icon={<AlertTriangle className="h-4 w-4" />} onClick={() => setIssueModalOpen(true)}>
          Report Issue
        </Button>
      </div>

      {/* Progress Bar */}
      <Card>
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center',
              currentStep === 'delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
            )}>
              {current.icon}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{current.title}</p>
              <p className="text-sm text-gray-500">{current.description}</p>
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="grid grid-cols-6 gap-1 mt-2 text-[10px] text-gray-500">
            {stepOrder.map((step, i) => (
              <div key={step} className={cn('text-center', i <= stepIndex ? 'text-orange-600 font-semibold' : 'text-gray-400')}>
                {step.replace(/_/g, ' ')}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 space-y-6">
          <Card padding="none" className="overflow-hidden relative">
            <LiveMap
              driverLocation={{
                lat: delivery.pickupLat + (delivery.deliveryLat - delivery.pickupLat) * progress,
                lng: delivery.pickupLng + (delivery.deliveryLng - delivery.pickupLng) * progress,
                timestamp: Date.now(),
              }}
              pickupLocation={{ lat: delivery.pickupLat, lng: delivery.pickupLng }}
              deliveryLocation={{ lat: delivery.deliveryLat, lng: delivery.deliveryLng }}
              pickupLabel={delivery.pickupVendor}
              deliveryLabel={delivery.customerName}
              driverLabel="You"
              height="460px"
            />

            {/* Nav Controls Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <Button variant="primary" size="md" icon={<Navigation className="h-4 w-4" />} className="shadow-lg">
                Navigate
              </Button>
            </div>
          </Card>

          {/* Main Action */}
          <Card className={cn(
            currentStep === 'delivered' ? 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200' : 'bg-gradient-to-br from-orange-50 to-white border-orange-200'
          )}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Next step</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{current.action}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {currentStep === 'arrived_pickup' && 'Scan the QR code on the package to verify'}
                  {currentStep === 'arrived_delivery' && 'Take a photo or collect signature'}
                  {currentStep === 'delivered' && 'Delivery completed successfully'}
                </p>
              </div>
              <div className="flex gap-2">
                {currentStep === 'arrived_pickup' && (
                  <Button variant="outline" size="lg" icon={<QrCode className="h-5 w-5" />} onClick={() => setShowScanner(true)}>
                    Scan QR
                  </Button>
                )}
                {currentStep === 'arrived_delivery' && (
                  <>
                    <Button variant="outline" size="lg" icon={<Camera className="h-5 w-5" />} onClick={() => setShowPhotoProof(true)}>
                      Photo
                    </Button>
                    <Button variant="outline" size="lg" icon={<FileSignature className="h-5 w-5" />} onClick={() => setShowSignature(true)}>
                      Signature
                    </Button>
                  </>
                )}
                <Button variant="urgent" size="lg" icon={<ChevronRight className="h-5 w-5" />} iconPosition="right" onClick={handleNextStep}>
                  {current.action}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Pickup Info */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Package className="h-4 w-4" />
              </div>
              <p className="font-bold text-gray-900">Pickup</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">{delivery.pickupVendor}</p>
            <p className="text-xs text-gray-500 mt-0.5">{delivery.pickupAddress}</p>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="xs" icon={<Phone className="h-3 w-3" />}>Call</Button>
              <Button variant="outline" size="xs" icon={<Navigation className="h-3 w-3" />}>Navigate</Button>
            </div>
            <div className="mt-3 p-2 rounded-lg bg-gray-50 text-xs text-gray-600">
              <span className="font-semibold">Contact:</span> {delivery.pickupContact}
            </div>
          </Card>

          {/* Delivery Info */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <MapPin className="h-4 w-4" />
              </div>
              <p className="font-bold text-gray-900">Delivery</p>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                {delivery.customerName.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{delivery.customerName}</p>
                <p className="text-xs text-gray-500">{delivery.jobSite}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">{delivery.deliveryAddress}</p>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="xs" icon={<Phone className="h-3 w-3" />}>Call</Button>
              <Button variant="outline" size="xs" icon={<MessageSquare className="h-3 w-3" />}>Chat</Button>
            </div>
            {delivery.customerNote && (
              <div className="mt-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                <p className="text-xs font-bold text-orange-900 mb-1">Customer note:</p>
                <p className="text-xs text-orange-700">{delivery.customerNote}</p>
              </div>
            )}
          </Card>

          {/* Items */}
          <Card>
            <p className="font-bold text-gray-900 mb-2">Items ({delivery.items.length})</p>
            {delivery.items.map((item, i) => (
              <div key={i} className="flex items-start gap-2 py-2 border-b border-gray-100 last:border-0">
                <div className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                  {item.quantity}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 line-clamp-1">{item.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono">{item.sku}</p>
                </div>
              </div>
            ))}
          </Card>

          {/* Earnings Preview */}
          <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">You&apos;ll Earn</p>
            <div className="flex items-baseline gap-1 mt-1">
              <p className="text-3xl font-extrabold text-gray-900">{formatCurrency(delivery.estimatedEarnings)}</p>
              <span className="text-xs text-gray-500">+ tip</span>
            </div>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Base</span><span>{formatCurrency(delivery.payout)}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Surge ({delivery.surge}x)</span><span>+{formatCurrency(delivery.estimatedEarnings - delivery.payout)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <Modal isOpen={showScanner} onClose={() => setShowScanner(false)} title="Scan Package QR Code">
        <div className="text-center space-y-4">
          <div className="mx-auto h-64 w-64 rounded-2xl border-4 border-dashed border-orange-400 bg-gray-900 flex items-center justify-center relative overflow-hidden">
            <Scan className="h-20 w-20 text-orange-500" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse" />
          </div>
          <p className="text-sm text-gray-600">Point your camera at the package QR code to verify the items.</p>
          <Button variant="primary" onClick={() => { setShowScanner(false); handleNextStep(); }}>
            Simulate Successful Scan
          </Button>
        </div>
      </Modal>

      {/* Photo Proof Modal */}
      <Modal isOpen={showPhotoProof} onClose={() => setShowPhotoProof(false)} title="Photo Proof of Delivery">
        <div className="space-y-4">
          <div className="h-64 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center">
            <Camera className="h-16 w-16 text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">Take a photo of the delivered package</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
            Tips: Ensure the package is clearly visible. Include the location (doorstep, foreman, etc.) if possible.
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPhotoProof(false)}>Cancel</Button>
            <Button variant="primary" fullWidth icon={<Camera className="h-4 w-4" />} onClick={() => { setShowPhotoProof(false); handleNextStep(); }}>
              Capture Photo
            </Button>
          </div>
        </div>
      </Modal>

      {/* Signature Modal */}
      <Modal isOpen={showSignature} onClose={() => setShowSignature(false)} title="Collect Signature">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Have the recipient sign below to confirm delivery.</p>
          <div className="h-48 rounded-xl border-2 border-gray-200 bg-gray-50 flex items-center justify-center relative">
            <p className="text-sm text-gray-400 italic">Signature pad</p>
            <p className="absolute bottom-2 left-3 text-[10px] text-gray-400">Sign here</p>
          </div>
          <Input placeholder="Printed name" />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowSignature(false)}>Clear</Button>
            <Button variant="primary" fullWidth icon={<CheckCircle2 className="h-4 w-4" />} onClick={() => { setShowSignature(false); handleNextStep(); }}>
              Confirm Signature
            </Button>
          </div>
        </div>
      </Modal>

      {/* Issue Modal */}
      <Modal isOpen={issueModalOpen} onClose={() => setIssueModalOpen(false)} title="Report an Issue">
        <div className="space-y-3">
          {[
            { label: 'Customer not available', icon: <User className="h-4 w-4" /> },
            { label: 'Wrong items at pickup', icon: <Package className="h-4 w-4" /> },
            { label: 'Cannot access delivery location', icon: <MapPin className="h-4 w-4" /> },
            { label: 'Vehicle issue', icon: <Truck className="h-4 w-4" /> },
            { label: 'Other', icon: <AlertTriangle className="h-4 w-4" /> },
          ].map((issue) => (
            <button
              key={issue.label}
              className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-left transition-all"
              onClick={() => setIssueModalOpen(false)}
            >
              <div className="h-8 w-8 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center">{issue.icon}</div>
              <span className="text-sm font-medium text-gray-900">{issue.label}</span>
              <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}

function Input({ placeholder }: { placeholder: string }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
    />
  );
}
