'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  Truck,
  DollarSign,
  Clock,
  Shield,
  Gift,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Car,
  Bike,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';

type VehicleType = 'car' | 'van' | 'truck' | 'motorcycle' | 'bicycle';

const vehicleTypes: { id: VehicleType; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'car', label: 'Car / Sedan', icon: <Car className="h-5 w-5" />, desc: 'Up to 150 lbs' },
  { id: 'van', label: 'Cargo Van', icon: <Truck className="h-5 w-5" />, desc: 'Up to 1,000 lbs' },
  { id: 'truck', label: 'Pickup / Truck', icon: <Truck className="h-5 w-5" />, desc: 'Up to 2,000 lbs' },
  { id: 'motorcycle', label: 'Motorcycle', icon: <Bike className="h-5 w-5" />, desc: 'Small packages' },
  { id: 'bicycle', label: 'Bicycle', icon: <Bike className="h-5 w-5" />, desc: 'Urban delivery' },
];

export default function DriverSignupPage() {
  const [step, setStep] = useState(1);
  const [vehicleType, setVehicleType] = useState<VehicleType>('car');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      window.location.href = '/driver-onboarding';
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Header */}
      <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Dreams</span>
            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">DRIVERS</span>
          </Link>
          <Link href="/driver-login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Already a driver? Sign in
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
            <Truck className="h-3.5 w-3.5" /> Driver Application
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Deliver with Dreams.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Drive on your schedule.</span>
          </h1>
          <p className="text-lg text-gray-600">
            Tell us about yourself and your vehicle. Takes less than 3 minutes.
          </p>
        </div>

        {/* Benefits Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 max-w-4xl mx-auto">
          {[
            { icon: <DollarSign className="h-5 w-5" />, label: '$28/hr avg', desc: 'Top performers' },
            { icon: <Clock className="h-5 w-5" />, label: 'Flexible hours', desc: 'Set your own' },
            { icon: <Gift className="h-5 w-5" />, label: 'Surge bonuses', desc: 'Peak hours +40%' },
            { icon: <Shield className="h-5 w-5" />, label: 'Insurance', desc: 'On every delivery' },
          ].map((b) => (
            <div key={b.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-2">
                {b.icon}
              </div>
              <p className="text-sm font-bold text-gray-900">{b.label}</p>
              <p className="text-xs text-gray-500">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Multi-step Form */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-200 max-w-2xl mx-auto overflow-hidden">
          {/* Progress */}
          <div className="border-b border-gray-100 p-6">
            <div className="flex items-center gap-3">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-3 flex-1">
                  <div className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all',
                    step >= s ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-400'
                  )}>
                    {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                  </div>
                  <div className="flex-1">
                    <p className={cn('text-xs font-bold uppercase tracking-wider', step >= s ? 'text-gray-900' : 'text-gray-400')}>
                      {s === 1 ? 'About you' : s === 2 ? 'Your vehicle' : 'Get started'}
                    </p>
                  </div>
                  {s < 3 && <div className={cn('h-0.5 flex-1', step > s ? 'bg-orange-500' : 'bg-gray-200')} />}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="First name" placeholder="Marcus" required />
                  <Input label="Last name" placeholder="Johnson" required />
                </div>
                <Input label="Email address" type="email" placeholder="you@email.com" icon={<Mail className="h-4 w-4" />} required />
                <Input label="Phone number" type="tel" placeholder="+1 (555) 000-0000" icon={<Phone className="h-4 w-4" />} required />
                <Input label="City" placeholder="Houston, TX" icon={<MapPin className="h-4 w-4" />} required />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of birth</label>
                  <div className="grid grid-cols-3 gap-3">
                    <Select options={[{ value: '1', label: 'Month' }, { value: '1', label: 'January' }, { value: '2', label: 'February' }]} />
                    <Select options={Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))} placeholder="Day" />
                    <Select options={Array.from({ length: 60 }, (_, i) => ({ value: String(1965 + i), label: String(1965 + i) }))} placeholder="Year" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">You must be at least 21 years old to drive with Dreams.</p>
                </div>
              </>
            )}

            {/* Step 2: Vehicle */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What will you use to deliver?</label>
                  <div className="space-y-2">
                    {vehicleTypes.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVehicleType(v.id)}
                        className={cn(
                          'w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                          vehicleType === v.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div className={cn(
                          'h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0',
                          vehicleType === v.id ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'
                        )}>
                          {v.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{v.label}</p>
                          <p className="text-xs text-gray-500">{v.desc}</p>
                        </div>
                        <div className={cn(
                          'h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                          vehicleType === v.id ? 'border-orange-600 bg-orange-600' : 'border-gray-300'
                        )}>
                          {vehicleType === v.id && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Make" placeholder="Ford" required />
                  <Input label="Model" placeholder="Transit 250" required />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Year" placeholder="2022" required />
                  <Input label="License plate" placeholder="TX-ABC-1234" required />
                </div>
              </>
            )}

            {/* Step 3: Final */}
            {step === 3 && (
              <>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <p className="font-semibold text-emerald-900">You are almost ready!</p>
                  </div>
                  <p className="text-sm text-emerald-700">After you create your account, we will guide you through uploading documents, passing a background check, and going online.</p>
                </div>

                <Input label="Create a password" type="password" placeholder="At least 8 characters" required />
                <Input label="Referral code (optional)" placeholder="Enter code if you have one" icon={<User className="h-4 w-4" />} />

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 mt-0.5" required defaultChecked />
                  <span className="text-sm text-gray-600">
                    I agree to the <a href="#" className="text-orange-600 hover:underline">Driver Terms</a>, <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>, and consent to a background check.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 mt-0.5" defaultChecked />
                  <span className="text-sm text-gray-600">
                    Send me driving tips, bonus alerts, and platform updates via SMS.
                  </span>
                </label>
              </>
            )}

            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <Button type="button" variant="outline" size="lg" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              <Button
                type="submit"
                variant="urgent"
                size="lg"
                fullWidth
                loading={loading}
                icon={<ArrowRight className="h-5 w-5" />}
                iconPosition="right"
              >
                {step === 3 ? 'Create Account & Continue' : 'Continue'}
              </Button>
            </div>
          </form>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
          <div>
            <p className="text-3xl font-extrabold text-gray-900">1,200+</p>
            <p className="text-sm text-gray-500">Active drivers</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-gray-900">4.9★</p>
            <p className="text-sm text-gray-500">Driver satisfaction</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-gray-900">$2.4M</p>
            <p className="text-sm text-gray-500">Paid out this month</p>
          </div>
        </div>
      </main>
    </div>
  );
}
