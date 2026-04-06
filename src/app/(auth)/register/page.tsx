'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Mail, Lock, User, Phone, Building2, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { AccountMode } from '@/types';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<AccountMode>('personal');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1500);
  };

  const accountTypes: { mode: AccountMode; title: string; description: string; icon: React.ReactNode }[] = [
    { mode: 'personal', title: 'Personal', description: 'For homeowners, DIY users, and independent technicians', icon: <User className="h-6 w-6" /> },
    { mode: 'business', title: 'Business', description: 'For companies, contractors, and field service teams', icon: <Building2 className="h-6 w-6" /> },
    { mode: 'vendor', title: 'Vendor', description: 'For stores, suppliers, and rental houses', icon: <Zap className="h-6 w-6" /> },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Dreams</span>
          </Link>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn('h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all', step >= s ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500')}>
                  {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                </div>
                <span className={cn('text-sm font-medium hidden sm:block', step >= s ? 'text-gray-900' : 'text-gray-400')}>
                  {s === 1 ? 'Account Type' : 'Your Details'}
                </span>
                {s < 2 && <div className={cn('w-12 h-0.5', step > 1 ? 'bg-orange-600' : 'bg-gray-200')} />}
              </div>
            ))}
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            {step === 1 ? 'Choose your account type' : 'Create your account'}
          </h1>
          <p className="text-gray-500 mb-8">
            {step === 1 ? 'Select how you plan to use Dreams' : 'Fill in your details to get started'}
          </p>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4 mb-8">
                {accountTypes.map((type) => (
                  <button
                    key={type.mode}
                    type="button"
                    onClick={() => setAccountType(type.mode)}
                    className={cn(
                      'w-full flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200',
                      accountType === type.mode
                        ? 'border-orange-500 bg-orange-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className={cn(
                      'h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0',
                      accountType === type.mode ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'
                    )}>
                      {type.icon}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{type.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{type.description}</p>
                    </div>
                    <div className={cn(
                      'h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ml-auto',
                      accountType === type.mode ? 'border-orange-600 bg-orange-600' : 'border-gray-300'
                    )}>
                      {accountType === type.mode && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 mb-8">
                <Input label="Full name" type="text" placeholder="John Doe" icon={<User className="h-4 w-4" />} required />
                <Input label="Email address" type="email" placeholder="you@company.com" icon={<Mail className="h-4 w-4" />} required />
                <Input label="Phone number" type="tel" placeholder="+1 (555) 000-0000" icon={<Phone className="h-4 w-4" />} required />
                {accountType === 'business' && (
                  <>
                    <Input label="Company name" type="text" placeholder="Your Company Inc." icon={<Building2 className="h-4 w-4" />} required />
                    <Select
                      label="Industry"
                      options={[
                        { value: 'construction', label: 'Construction' },
                        { value: 'electrical', label: 'Electrical' },
                        { value: 'plumbing', label: 'Plumbing' },
                        { value: 'hvac', label: 'HVAC' },
                        { value: 'telecom', label: 'Telecom & Networking' },
                        { value: 'facility_mgmt', label: 'Facility Management' },
                        { value: 'data_center', label: 'Data Center' },
                        { value: 'other', label: 'Other' },
                      ]}
                      placeholder="Select your industry"
                    />
                  </>
                )}
                {accountType === 'vendor' && (
                  <>
                    <Input label="Business name" type="text" placeholder="Your Store Name" icon={<Building2 className="h-4 w-4" />} required />
                    <Select
                      label="Business type"
                      options={[
                        { value: 'retailer', label: 'Retailer' },
                        { value: 'distributor', label: 'Distributor' },
                        { value: 'wholesaler', label: 'Wholesaler' },
                        { value: 'rental_house', label: 'Rental House' },
                        { value: 'manufacturer', label: 'Manufacturer' },
                        { value: 'warehouse', label: 'Warehouse' },
                      ]}
                      placeholder="Select business type"
                    />
                  </>
                )}
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    icon={<Lock className="h-4 w-4" />}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <label className="flex items-start gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 mt-0.5" required />
                  <span className="text-sm text-gray-600">
                    I agree to the <a href="#" className="text-orange-600 hover:underline">Terms of Service</a> and{' '}
                    <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>
                  </span>
                </label>
              </div>
            )}

            <div className="flex gap-3">
              {step > 1 && (
                <Button type="button" variant="outline" size="lg" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              <Button type="submit" variant="urgent" size="lg" fullWidth loading={loading} icon={<ArrowRight className="h-5 w-5" />} iconPosition="right">
                {step === 1 ? 'Continue' : 'Create Account'}
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative flex flex-col items-center justify-center px-16 text-white w-full">
          <h2 className="text-3xl font-extrabold mb-8 text-center">Why teams choose Dreams</h2>
          <div className="space-y-6 w-full max-w-sm">
            {[
              { stat: '45 min', label: 'average delivery time' },
              { stat: '50,000+', label: 'tools & materials available' },
              { stat: '99.2%', label: 'order fulfillment rate' },
              { stat: '3,000+', label: 'vendor partners' },
              { stat: '$2.4M', label: 'in downtime costs prevented' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 bg-white/5 rounded-xl p-4 backdrop-blur-sm">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold">{item.stat}</p>
                  <p className="text-sm text-gray-400">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
