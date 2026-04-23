'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  Phone,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Truck,
  DollarSign,
  Clock,
  MapPin,
  Navigation,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DriverLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      window.location.href = '/driver';
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side - Driver themed visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />
        </div>

        {/* Simulated map */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 600">
          {[100, 200, 300, 400, 500, 600, 700].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="600" stroke="#6b7280" strokeWidth="0.5" />
          ))}
          {[100, 200, 300, 400, 500].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="800" y2={y} stroke="#6b7280" strokeWidth="0.5" />
          ))}
          <path d="M 100 400 Q 300 200 500 300 Q 700 400 750 150" stroke="#f97316" strokeWidth="3" fill="none" strokeDasharray="10 5" opacity="0.8" />
          <circle cx="100" cy="400" r="8" fill="#f97316" />
          <circle cx="750" cy="150" r="8" fill="#22c55e" />
        </svg>

        <div className="relative z-10 flex flex-col justify-center p-16 text-white w-full">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold">Dreams</span>
            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-bold rounded-full">DRIVERS</span>
          </div>

          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            Drive when you want.
            <br />
            <span className="text-orange-400">Earn what you need.</span>
          </h1>
          <p className="text-lg text-gray-300 mb-12 max-w-md">
            Flexible hours. Surge bonuses. Weekly payouts. Join 1,200+ drivers delivering with Dreams.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            {[
              { icon: <DollarSign className="h-5 w-5" />, label: 'Avg Earnings', value: '$28/hr' },
              { icon: <Clock className="h-5 w-5" />, label: 'Payouts', value: 'Weekly' },
              { icon: <MapPin className="h-5 w-5" />, label: 'Coverage', value: 'All Texas' },
              { icon: <Shield className="h-5 w-5" />, label: 'Insurance', value: 'Included' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                <div className="h-10 w-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center mb-2">
                  {stat.icon}
                </div>
                <p className="text-xs text-gray-400">{stat.label}</p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 max-w-md">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">New to Dreams?</p>
              <Link href="/driver-signup" className="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1 mt-0.5">
                Apply to drive <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Dreams</span>
            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">DRIVERS</span>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full mb-4">
              <Truck className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Driver Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome back, driver</h1>
            <p className="text-gray-500">Sign in to start accepting deliveries.</p>
          </div>

          {/* Method tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6">
            <button
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                authMethod === 'phone' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Phone
            </button>
            <button
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                authMethod === 'email' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Email
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMethod === 'phone' ? (
              <Input
                label="Phone number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                icon={<Phone className="h-4 w-4" />}
                required
                defaultValue="+1 (713) 555-0142"
              />
            ) : (
              <Input
                label="Email address"
                type="email"
                placeholder="driver@dreams.app"
                required
                defaultValue="marcus.j@dreams.app"
              />
            )}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                icon={<Lock className="h-4 w-4" />}
                required
                defaultValue="demo1234"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600" defaultChecked />
                <span className="text-sm text-gray-600">Keep me signed in</span>
              </label>
              <a href="#" className="text-sm font-medium text-orange-600 hover:text-orange-700">Forgot password?</a>
            </div>

            <Button type="submit" variant="urgent" size="lg" fullWidth loading={loading} icon={<Navigation className="h-5 w-5" />}>
              Sign In & Go Online
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-gray-50 px-3 text-gray-400 uppercase font-semibold tracking-wider">or</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Phone className="h-4 w-4" />
              Send me a login code via SMS
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              New driver?{' '}
              <Link href="/driver-signup" className="font-semibold text-orange-600 hover:text-orange-700">
                Apply to drive
              </Link>
            </p>
            <p className="text-xs text-gray-400 mt-3">
              <Link href="/login" className="hover:text-gray-600">Customer or business login →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
