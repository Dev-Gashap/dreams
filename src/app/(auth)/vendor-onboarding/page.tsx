'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  Store,
  MapPin,
  Clock,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Package,
  DollarSign,
  Globe,
  Phone,
  Mail,
  Camera,
  Plus,
  Trash2,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type OnboardingStep = 'business' | 'location' | 'hours' | 'products' | 'banking' | 'review';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export default function VendorOnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>('business');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [hours, setHours] = useState(
    DAYS.map((day) => ({
      day,
      open: '07:00',
      close: '18:00',
      is_closed: day === 'sunday',
    }))
  );

  const [categories, setCategories] = useState<string[]>([]);

  const steps: { key: OnboardingStep; label: string; icon: React.ReactNode }[] = [
    { key: 'business', label: 'Business Info', icon: <Store className="h-4 w-4" /> },
    { key: 'location', label: 'Location', icon: <MapPin className="h-4 w-4" /> },
    { key: 'hours', label: 'Hours', icon: <Clock className="h-4 w-4" /> },
    { key: 'products', label: 'Products', icon: <Package className="h-4 w-4" /> },
    { key: 'banking', label: 'Banking', icon: <DollarSign className="h-4 w-4" /> },
    { key: 'review', label: 'Review', icon: <CheckCircle2 className="h-4 w-4" /> },
  ];

  const currentIndex = steps.findIndex((s) => s.key === step);

  const nextStep = () => {
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1].key);
    }
  };

  const prevStep = () => {
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1].key);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setCompleted(true);
    setLoading(false);
  };

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 p-8">
        <div className="max-w-md text-center">
          <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Application Submitted!</h1>
          <p className="text-gray-600 mb-2">Thank you for applying to become a Dreams vendor partner.</p>
          <p className="text-sm text-gray-500 mb-8">Our team will review your application within 24-48 hours. You will receive an email once your account is approved.</p>
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 text-left space-y-3">
            <h3 className="font-semibold text-gray-900">What happens next?</h3>
            {[
              'Our team reviews your business information',
              'We verify your location and service area',
              'You receive approval notification via email',
              'Set up your product catalog',
              'Start receiving orders!',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <span className="text-sm text-gray-600">{item}</span>
              </div>
            ))}
          </div>
          <Link href="/dashboard">
            <Button variant="primary" size="lg">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Dreams</span>
            <Badge variant="info" size="sm">Vendor Setup</Badge>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">Exit</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress */}
        <div className="flex items-center justify-between mb-10">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center flex-1">
              <button
                onClick={() => i <= currentIndex && setStep(s.key)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                  i === currentIndex ? 'bg-orange-600 text-white' :
                  i < currentIndex ? 'bg-orange-100 text-orange-700 cursor-pointer' :
                  'bg-gray-100 text-gray-400'
                )}
              >
                {i < currentIndex ? <CheckCircle2 className="h-4 w-4" /> : s.icon}
                <span className="hidden md:inline">{s.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={cn('flex-1 h-0.5 mx-2', i < currentIndex ? 'bg-orange-400' : 'bg-gray-200')} />
              )}
            </div>
          ))}
        </div>

        {/* Step: Business Info */}
        {step === 'business' && (
          <Card className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Business Information</h2>
            <p className="text-sm text-gray-500 mb-6">Tell us about your business so we can set up your vendor profile.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-6 mb-6">
                <div className="h-20 w-20 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-200 transition-colors">
                  <Camera className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Business Logo</p>
                  <p className="text-xs text-gray-500">Upload a logo for your vendor profile</p>
                </div>
              </div>
              <Input label="Business Name" placeholder="Your Tool Supply Co." icon={<Store className="h-4 w-4" />} required />
              <Select
                label="Business Type"
                options={[
                  { value: 'retailer', label: 'Retailer — Sells tools and materials to end users' },
                  { value: 'distributor', label: 'Distributor — Distributes from manufacturers' },
                  { value: 'wholesaler', label: 'Wholesaler — Bulk supply to businesses' },
                  { value: 'rental_house', label: 'Rental House — Rents equipment and tools' },
                  { value: 'manufacturer', label: 'Manufacturer — Makes tools or materials' },
                  { value: 'warehouse', label: 'Warehouse — Storage and fulfillment' },
                ]}
                placeholder="Select your business type"
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Contact Email" type="email" placeholder="sales@yourstore.com" icon={<Mail className="h-4 w-4" />} />
                <Input label="Contact Phone" type="tel" placeholder="+1 (555) 000-0000" icon={<Phone className="h-4 w-4" />} />
              </div>
              <Input label="Website (optional)" type="url" placeholder="https://yourstore.com" icon={<Globe className="h-4 w-4" />} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Description</label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
                  rows={4}
                  placeholder="Describe your business, what you sell, and why customers should choose you..."
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button variant="urgent" size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right" onClick={nextStep}>
                Continue
              </Button>
            </div>
          </Card>
        )}

        {/* Step: Location */}
        {step === 'location' && (
          <Card className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Location & Service Area</h2>
            <p className="text-sm text-gray-500 mb-6">Set your business address and delivery radius.</p>
            <div className="space-y-4">
              <Input label="Street Address" placeholder="1250 Industrial Blvd" icon={<MapPin className="h-4 w-4" />} required />
              <div className="grid sm:grid-cols-3 gap-4">
                <Input label="City" placeholder="Houston" />
                <Input label="State" placeholder="TX" />
                <Input label="ZIP Code" placeholder="77001" />
              </div>
              <Select
                label="Service Radius"
                options={[
                  { value: '10', label: '10 miles' },
                  { value: '15', label: '15 miles' },
                  { value: '25', label: '25 miles' },
                  { value: '35', label: '35 miles' },
                  { value: '50', label: '50 miles' },
                  { value: '75', label: '75 miles' },
                  { value: '100', label: '100 miles' },
                ]}
                placeholder="Select delivery radius"
              />
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-blue-600">Map preview will show your service area</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" size="lg" icon={<ArrowLeft className="h-5 w-5" />} onClick={prevStep}>Back</Button>
              <Button variant="urgent" size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right" onClick={nextStep}>Continue</Button>
            </div>
          </Card>
        )}

        {/* Step: Operating Hours */}
        {step === 'hours' && (
          <Card className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Operating Hours</h2>
            <p className="text-sm text-gray-500 mb-6">Set your business hours. Orders will only be processed during open hours.</p>
            <div className="space-y-3">
              {hours.map((h, i) => (
                <div key={h.day} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                  <div className="w-28">
                    <span className="text-sm font-medium text-gray-900 capitalize">{h.day}</span>
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!h.is_closed}
                      onChange={() => {
                        const updated = [...hours];
                        updated[i] = { ...h, is_closed: !h.is_closed };
                        setHours(updated);
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-orange-600"
                    />
                    <span className="text-sm text-gray-600">{h.is_closed ? 'Closed' : 'Open'}</span>
                  </label>
                  {!h.is_closed && (
                    <>
                      <input
                        type="time"
                        value={h.open}
                        onChange={(e) => {
                          const updated = [...hours];
                          updated[i] = { ...h, open: e.target.value };
                          setHours(updated);
                        }}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="time"
                        value={h.close}
                        onChange={(e) => {
                          const updated = [...hours];
                          updated[i] = { ...h, close: e.target.value };
                          setHours(updated);
                        }}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" size="lg" icon={<ArrowLeft className="h-5 w-5" />} onClick={prevStep}>Back</Button>
              <Button variant="urgent" size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right" onClick={nextStep}>Continue</Button>
            </div>
          </Card>
        )}

        {/* Step: Product Categories */}
        {step === 'products' && (
          <Card className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Product Categories</h2>
            <p className="text-sm text-gray-500 mb-6">Select the categories you sell or rent. You can add products after approval.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                'Power Tools', 'Hand Tools', 'Safety Equipment', 'Electrical',
                'Plumbing', 'HVAC', 'Fasteners & Hardware', 'Lumber & Wood',
                'Concrete & Masonry', 'Roofing', 'Flooring', 'Paint & Coatings',
                'Measuring & Layout', 'Welding', 'Automotive', 'Heavy Equipment',
                'Landscaping', 'Telecom & Cable', 'Networking & IT', 'Replacement Parts',
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    'p-3 rounded-xl border-2 text-sm font-medium text-left transition-all',
                    categories.includes(cat)
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  )}
                >
                  {categories.includes(cat) && <CheckCircle2 className="h-4 w-4 inline mr-1.5" />}
                  {cat}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600" />
                <span className="text-sm text-gray-700">I also offer tool and equipment rentals</span>
              </label>
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" size="lg" icon={<ArrowLeft className="h-5 w-5" />} onClick={prevStep}>Back</Button>
              <Button variant="urgent" size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right" onClick={nextStep}>Continue</Button>
            </div>
          </Card>
        )}

        {/* Step: Banking */}
        {step === 'banking' && (
          <Card className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Payout Information</h2>
            <p className="text-sm text-gray-500 mb-6">Set up your bank account to receive payouts from Dreams orders.</p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <Shield className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-800">Secure & Encrypted</p>
                <p className="text-xs text-emerald-600">Your banking information is encrypted and stored securely. We never share your details.</p>
              </div>
            </div>
            <div className="space-y-4">
              <Select
                label="Account Type"
                options={[
                  { value: 'checking', label: 'Checking Account' },
                  { value: 'savings', label: 'Savings Account' },
                ]}
                placeholder="Select account type"
              />
              <Input label="Account Holder Name" placeholder="Your Business Name LLC" />
              <Input label="Routing Number" placeholder="021000021" />
              <Input label="Account Number" placeholder="1234567890" type="password" />
              <Input label="Confirm Account Number" placeholder="1234567890" type="password" />
              <Input label="Tax ID / EIN" placeholder="XX-XXXXXXX" hint="Required for 1099 reporting" />
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600" />
                <span className="text-sm text-gray-700">I can also skip this step and set up payouts later</span>
              </label>
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" size="lg" icon={<ArrowLeft className="h-5 w-5" />} onClick={prevStep}>Back</Button>
              <Button variant="urgent" size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right" onClick={nextStep}>Continue</Button>
            </div>
          </Card>
        )}

        {/* Step: Review */}
        {step === 'review' && (
          <Card className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Review Your Application</h2>
            <p className="text-sm text-gray-500 mb-6">Please verify everything looks correct before submitting.</p>
            <div className="space-y-4">
              {[
                { label: 'Business Info', status: 'Complete', step: 'business' as OnboardingStep },
                { label: 'Location & Service Area', status: 'Complete', step: 'location' as OnboardingStep },
                { label: 'Operating Hours', status: 'Complete', step: 'hours' as OnboardingStep },
                { label: 'Product Categories', status: categories.length > 0 ? `${categories.length} selected` : 'Complete', step: 'products' as OnboardingStep },
                { label: 'Payout Information', status: 'Complete', step: 'banking' as OnboardingStep },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="success" size="sm">{item.status}</Badge>
                    <button onClick={() => setStep(item.step)} className="text-sm text-orange-600 hover:text-orange-700 font-medium">Edit</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Commission Structure</h3>
              <p className="text-sm text-gray-600">Dreams charges a <span className="font-bold">12% commission</span> on each order fulfilled through the platform. You receive payouts weekly via direct deposit.</p>
            </div>
            <label className="flex items-start gap-3 mt-4">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 mt-0.5" required />
              <span className="text-sm text-gray-700">
                I agree to the Dreams <a href="#" className="text-orange-600 hover:underline">Vendor Terms of Service</a>,{' '}
                <a href="#" className="text-orange-600 hover:underline">Commission Agreement</a>, and{' '}
                <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>.
              </span>
            </label>
            <div className="flex justify-between mt-6">
              <Button variant="outline" size="lg" icon={<ArrowLeft className="h-5 w-5" />} onClick={prevStep}>Back</Button>
              <Button variant="urgent" size="xl" loading={loading} icon={<CheckCircle2 className="h-5 w-5" />} onClick={handleSubmit}>
                Submit Application
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
