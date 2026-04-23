'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  CheckCircle2,
  Clock,
  Upload,
  FileText,
  Shield,
  CreditCard,
  Camera,
  AlertTriangle,
  ArrowRight,
  Lock,
  Loader2,
  Car,
  User,
  Fingerprint,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type StepStatus = 'pending' | 'in_progress' | 'complete' | 'blocked';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: StepStatus;
  estimatedTime: string;
}

export default function DriverOnboardingPage() {
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'profile',
      title: 'Profile photo',
      description: 'Upload a clear, recent photo of yourself',
      icon: <User className="h-5 w-5" />,
      status: 'complete',
      estimatedTime: '1 min',
    },
    {
      id: 'license',
      title: "Driver's license",
      description: 'Upload the front and back of your license',
      icon: <FileText className="h-5 w-5" />,
      status: 'complete',
      estimatedTime: '2 min',
    },
    {
      id: 'vehicle',
      title: 'Vehicle documents',
      description: 'Registration, insurance, and inspection',
      icon: <Car className="h-5 w-5" />,
      status: 'in_progress',
      estimatedTime: '3 min',
    },
    {
      id: 'background',
      title: 'Background check',
      description: 'SSN verification and criminal record check',
      icon: <Fingerprint className="h-5 w-5" />,
      status: 'pending',
      estimatedTime: '2-3 days',
    },
    {
      id: 'banking',
      title: 'Payout setup',
      description: 'Add your bank account for weekly payouts',
      icon: <CreditCard className="h-5 w-5" />,
      status: 'pending',
      estimatedTime: '2 min',
    },
  ]);

  const [activeStep, setActiveStep] = useState(2); // vehicle docs
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<Record<string, boolean>>({});

  const completedCount = steps.filter((s) => s.status === 'complete').length;
  const progressPercent = (completedCount / steps.length) * 100;

  const handleFileUpload = (docId: string) => {
    setFiles({ ...files, [docId]: true });
  };

  const handleNext = () => {
    const updated = [...steps];
    updated[activeStep].status = 'complete';
    if (activeStep + 1 < steps.length) {
      updated[activeStep + 1].status = 'in_progress';
      setActiveStep(activeStep + 1);
    }
    setSteps(updated);
  };

  const currentStep = steps[activeStep];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Dreams</span>
            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">DRIVER SETUP</span>
          </Link>
          <Link href="/driver" className="text-sm font-medium text-gray-500 hover:text-gray-900">
            Save and exit
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Let&apos;s get you on the road</h1>
          <p className="text-gray-500">Complete these steps to start accepting deliveries.</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-sm font-bold text-gray-700">{completedCount} / {steps.length}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Steps List */}
          <div className="lg:col-span-1">
            <Card padding="sm">
              <div className="space-y-1">
                {steps.map((step, i) => (
                  <button
                    key={step.id}
                    onClick={() => step.status !== 'pending' && setActiveStep(i)}
                    disabled={step.status === 'pending'}
                    className={cn(
                      'w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all',
                      activeStep === i ? 'bg-orange-50 border-2 border-orange-200' : 'hover:bg-gray-50 border-2 border-transparent',
                      step.status === 'pending' && 'opacity-60 cursor-not-allowed'
                    )}
                  >
                    <div className={cn(
                      'h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                      step.status === 'complete' ? 'bg-emerald-100 text-emerald-600' :
                      step.status === 'in_progress' ? 'bg-orange-100 text-orange-600' :
                      'bg-gray-100 text-gray-400'
                    )}>
                      {step.status === 'complete' ? <CheckCircle2 className="h-5 w-5" /> : step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                      <p className="text-xs text-gray-500 truncate">{step.description}</p>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                        <Clock className="h-3 w-3" /> {step.estimatedTime}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700 mb-1">
                <Shield className="h-4 w-4" />
                <p className="text-xs font-bold uppercase tracking-wider">Secure</p>
              </div>
              <p className="text-xs text-blue-700">All documents are encrypted and only used for verification. We never share your information.</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                  {currentStep.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{currentStep.title}</h2>
                  <p className="text-sm text-gray-500">{currentStep.description}</p>
                </div>
              </div>

              {/* Step-specific content */}
              {currentStep.id === 'profile' && (
                <ProfileStep />
              )}
              {currentStep.id === 'license' && (
                <LicenseStep onUpload={handleFileUpload} files={files} />
              )}
              {currentStep.id === 'vehicle' && (
                <VehicleStep onUpload={handleFileUpload} files={files} />
              )}
              {currentStep.id === 'background' && (
                <BackgroundStep />
              )}
              {currentStep.id === 'banking' && (
                <BankingStep />
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                {activeStep > 0 && (
                  <Button variant="outline" onClick={() => setActiveStep(activeStep - 1)}>
                    Back
                  </Button>
                )}
                <Button
                  variant="urgent"
                  icon={<ArrowRight className="h-4 w-4" />}
                  iconPosition="right"
                  loading={loading}
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 1 ? 'Finish Setup' : 'Save & Continue'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProfileStep() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <div className="relative">
          <div className="h-32 w-32 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <User className="h-16 w-16 text-white" />
          </div>
          <button className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-orange-600 border-4 border-white text-white flex items-center justify-center hover:bg-orange-700 transition-colors">
            <Camera className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="text-center">
        <p className="font-semibold text-gray-900">Upload a clear photo of yourself</p>
        <p className="text-xs text-gray-500 mt-1">Front-facing, well-lit, without sunglasses or hat</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {['Good lighting', 'Face clearly visible', 'No filters'].map((tip) => (
          <div key={tip} className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
            <p className="text-xs text-emerald-700 font-medium">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LicenseStep({ onUpload, files }: { onUpload: (id: string) => void; files: Record<string, boolean> }) {
  return (
    <div className="space-y-4">
      {['license_front', 'license_back'].map((doc) => (
        <DocumentUpload
          key={doc}
          id={doc}
          title={doc === 'license_front' ? 'Front of license' : 'Back of license'}
          description="JPG, PNG, or PDF, up to 10MB"
          uploaded={files[doc]}
          onUpload={onUpload}
        />
      ))}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Input label="License number" placeholder="DL12345678" />
        <Input label="Expiration date" type="date" />
      </div>
    </div>
  );
}

function VehicleStep({ onUpload, files }: { onUpload: (id: string) => void; files: Record<string, boolean> }) {
  return (
    <div className="space-y-4">
      <DocumentUpload id="registration" title="Vehicle registration" description="Current registration document" uploaded={files.registration} onUpload={onUpload} />
      <DocumentUpload id="insurance" title="Proof of insurance" description="Current policy declaration page" uploaded={files.insurance} onUpload={onUpload} />
      <DocumentUpload id="inspection" title="Vehicle inspection (optional)" description="If required in your state" uploaded={files.inspection} onUpload={onUpload} />
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Input label="Insurance policy #" placeholder="ABC-123-456" />
        <Input label="Policy expires" type="date" />
      </div>
    </div>
  );
}

function BackgroundStep() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900">Secure background check</p>
          <p className="text-xs text-blue-700 mt-0.5">We partner with Checkr to verify driving history and criminal records. Results in 1-3 business days.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Social Security Number" placeholder="XXX-XX-XXXX" type="password" icon={<Lock className="h-4 w-4" />} />
          <Input label="Date of birth" type="date" />
        </div>
        <Input label="Home address" placeholder="123 Main St, City, State" />
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <p className="font-semibold text-gray-900 mb-3">What we will check</p>
        <ul className="space-y-2 text-sm">
          {[
            'Criminal record (national & county)',
            'Sex offender registry',
            'Motor vehicle records (past 7 years)',
            'Identity verification',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {item}
            </li>
          ))}
        </ul>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 mt-0.5" />
        <span className="text-sm text-gray-600">
          I authorize Dreams and Checkr to obtain my background report and understand that I must pass to drive.
        </span>
      </label>
    </div>
  );
}

function BankingStep() {
  return (
    <div className="space-y-4">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <Lock className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-900">Your banking info is encrypted end-to-end</p>
          <p className="text-xs text-emerald-700 mt-0.5">We use Stripe to process payouts. Dreams never stores full account numbers.</p>
        </div>
      </div>

      <Input label="Account holder name" placeholder="Marcus Johnson" />
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Routing number" placeholder="021000021" />
        <Input label="Account number" placeholder="••••1234" type="password" />
      </div>
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-900 mb-1">How payouts work</p>
        <p className="text-xs text-gray-600">You&apos;ll receive payouts every Friday for deliveries completed Mon-Sun of the prior week. Instant payouts available for a small fee.</p>
      </div>
    </div>
  );
}

function DocumentUpload({ id, title, description, uploaded, onUpload }: { id: string; title: string; description: string; uploaded?: boolean; onUpload: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onUpload(id)}
      className={cn(
        'w-full flex items-center gap-4 p-4 rounded-xl border-2 border-dashed text-left transition-all',
        uploaded ? 'border-emerald-300 bg-emerald-50' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
      )}
    >
      <div className={cn(
        'h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0',
        uploaded ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
      )}>
        {uploaded ? <CheckCircle2 className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
      </div>
      <div className="flex-1">
        <p className={cn('font-semibold', uploaded ? 'text-emerald-900' : 'text-gray-900')}>{title}</p>
        <p className="text-xs text-gray-500">{uploaded ? 'Uploaded successfully' : description}</p>
      </div>
      {!uploaded && <span className="text-sm font-medium text-orange-600">Upload</span>}
    </button>
  );
}
