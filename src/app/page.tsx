'use client';

import Link from 'next/link';
import {
  Zap,
  Search,
  Truck,
  Clock,
  Shield,
  Users,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Star,
  Package,
  Wrench,
  Timer,
  Building2,
  Cpu,
  Cable,
  Hammer,
  ChevronRight,
  Play,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const stats = [
  { value: '15K+', label: 'Active Users' },
  { value: '42min', label: 'Avg Delivery' },
  { value: '50K+', label: 'Products' },
  { value: '99.2%', label: 'Fulfillment Rate' },
];

const features = [
  {
    icon: <Search className="h-6 w-6" />,
    title: 'Sourcing Engine',
    description: 'Searches stores, rental houses, suppliers, distributors, and warehouses to find exactly what you need — and where it is available right now.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: <Package className="h-6 w-6" />,
    title: 'Fulfillment Engine',
    description: 'Buy or rent. Route through approval if needed. Prepare for pickup or delivery. One seamless workflow from search to fulfilled order.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: 'Dispatch Engine',
    description: 'Chooses the fastest eligible delivery path — internal driver, third-party courier, warehouse runner, customer pickup, or drone delivery.',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Speed-First Design',
    description: 'Built for urgency. Every screen, every workflow, every decision tree is optimized to get your order placed and delivered as fast as possible.',
    color: 'bg-red-100 text-red-600',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Business Controls',
    description: 'Spending limits, approval workflows, team roles, project tracking, PO numbers, and full audit trails for enterprise operations.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: 'Live Tracking',
    description: 'Uber-style real-time driver tracking with live ETA, route visualization, and delivery status updates from dispatch to doorstep.',
    color: 'bg-amber-100 text-amber-600',
  },
];

const howItWorks = [
  { step: '01', title: 'Search & Source', description: 'Tell us what you need. Our sourcing engine finds it across vendors, rental houses, and suppliers near you.', icon: <Search className="h-8 w-8" /> },
  { step: '02', title: 'Buy or Rent', description: 'Choose to purchase or rent. Set your priority level. Add job site details and delivery instructions.', icon: <Wrench className="h-8 w-8" /> },
  { step: '03', title: 'Dispatch & Deliver', description: 'We select the fastest delivery method. Track your driver in real-time. Get your items on site.', icon: <Truck className="h-8 w-8" /> },
  { step: '04', title: 'Back to Work', description: 'Your tools arrive. Your team keeps working. The project stays on schedule. The day is saved.', icon: <CheckCircle2 className="h-8 w-8" /> },
];

const categories = [
  { name: 'Power Tools', icon: <Zap className="h-8 w-8" />, count: '4,200+' },
  { name: 'Hand Tools', icon: <Hammer className="h-8 w-8" />, count: '8,100+' },
  { name: 'Electrical', icon: <Cable className="h-8 w-8" />, count: '6,500+' },
  { name: 'Plumbing', icon: <Wrench className="h-8 w-8" />, count: '3,800+' },
  { name: 'Networking', icon: <Cpu className="h-8 w-8" />, count: '2,900+' },
  { name: 'Safety & PPE', icon: <Shield className="h-8 w-8" />, count: '5,400+' },
];

const useCases = [
  { icon: <Building2 className="h-5 w-5" />, title: 'General Contractors', description: "Missing materials won't stop the job. Get replacement parts, forgotten tools, or emergency supplies delivered to any job site." },
  { icon: <Cable className="h-5 w-5" />, title: 'Telecom & Data Center', description: 'Fiber splicers, cable testers, connectors — get specialized telecom equipment fast when your install schedule depends on it.' },
  { icon: <Wrench className="h-5 w-5" />, title: 'HVAC & Plumbing', description: "Replacement compressors, pipe fittings, brazing kits. Don't reschedule the service call — get the part delivered now." },
  { icon: <Users className="h-5 w-5" />, title: 'Field Service Teams', description: 'Equip technicians on the move. Dispatch tools directly to the next job site without warehouse detours.' },
];

const pricing = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    description: 'For individuals and solo contractors',
    features: ['Up to 10 orders/month', 'Standard delivery speed', 'Basic search & sourcing', 'Email support', 'Personal mode only'],
    cta: 'Get Started Free',
    featured: false,
  },
  {
    name: 'Professional',
    price: '$79',
    period: '/month',
    description: 'For growing teams and businesses',
    features: ['Unlimited orders', 'Priority & urgent delivery', 'Full sourcing engine', 'Team management (up to 10)', 'Approval workflows', 'Live tracking & dispatch', 'Phone & chat support'],
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: ['Everything in Professional', 'Unlimited team members', 'Custom approval chains', 'API access', 'Dedicated account manager', 'Custom integrations', 'SLA guarantees', 'Vendor network access'],
    cta: 'Contact Sales',
    featured: false,
  },
];

const testimonials = [
  { name: 'Robert Chen', role: 'Project Manager, TurnerBuild', quote: "Dreams saved us on a Friday afternoon when our supplier couldn't deliver the fiber splicer we needed. Had it on site in 38 minutes.", rating: 5 },
  { name: 'Maria Santos', role: 'HVAC Technician', quote: 'I used to lose 2-3 hours driving to stores when I forgot a part. Now I open Dreams and it is delivered before I finish the current task.', rating: 5 },
  { name: 'David Park', role: 'Operations Director, DataVault', quote: 'The approval workflows and team controls make it safe to give every technician ordering power. No more bottleneck at the purchasing desk.', rating: 5 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-8">
              <Zap className="h-4 w-4 fill-orange-500" />
              Rapid Rescue Dispatch Platform
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
              Get Critical Tools
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                Delivered Fast
              </span>
            </h1>

            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              When a missing tool, broken part, or delayed delivery threatens to stop work —
              Dreams finds it, dispatches it, and delivers it faster than anyone else.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button variant="urgent" size="xl" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right">
                  Start Ordering Now
                </Button>
              </Link>
              <Button variant="outline" size="xl" icon={<Play className="h-5 w-5" />}>
                Watch Demo
              </Button>
            </div>

            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual - Dashboard Preview */}
          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="bg-gray-900 rounded-2xl shadow-2xl shadow-gray-900/20 p-2 ring-1 ring-gray-800">
              <div className="bg-gray-800 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 bg-gray-700 rounded-lg text-xs text-gray-400">app.dreams.io/dashboard</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-8">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Active Orders', value: '3', color: 'border-l-orange-500' },
                      { label: 'In Transit', value: '1', color: 'border-l-blue-500' },
                      { label: 'Delivered Today', value: '5', color: 'border-l-emerald-500' },
                      { label: 'Avg Delivery', value: '42m', color: 'border-l-purple-500' },
                    ].map((card) => (
                      <div key={card.label} className={cn('bg-white rounded-lg p-4 border-l-4 shadow-sm', card.color)}>
                        <p className="text-xs text-gray-500">{card.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-gray-900">Recent Orders</p>
                        <span className="text-xs text-orange-600 font-medium">View All</span>
                      </div>
                      {[
                        { name: 'DeWalt Hammer Drill', status: 'In Transit', eta: '12 min', statusColor: 'text-orange-600 bg-orange-50' },
                        { name: 'Fluke 117 Multimeter x2', status: 'Delivered', eta: '', statusColor: 'text-emerald-600 bg-emerald-50' },
                        { name: 'Ridgid K-400 Drain Cleaner', status: 'Pending', eta: 'Approval', statusColor: 'text-yellow-600 bg-yellow-50' },
                      ].map((order, i) => (
                        <div key={i} className="flex items-center justify-between py-2.5 border-t border-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{order.name}</p>
                            {order.eta && <p className="text-xs text-gray-400 mt-0.5">ETA: {order.eta}</p>}
                          </div>
                          <span className={cn('px-2 py-1 rounded-full text-xs font-medium', order.statusColor)}>{order.status}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm font-semibold text-gray-900 mb-3">Live Tracking</p>
                      <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-1/4 left-1/3 h-0.5 w-16 bg-blue-400 rotate-45" />
                          <div className="absolute top-1/2 left-1/4 h-0.5 w-20 bg-blue-300 -rotate-12" />
                          <div className="absolute bottom-1/3 right-1/4 h-0.5 w-14 bg-blue-400 rotate-12" />
                        </div>
                        <div className="relative">
                          <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 animate-pulse">
                            <Truck className="h-4 w-4 text-white" />
                          </div>
                          <p className="text-xs font-bold text-blue-800 mt-2 text-center">ETA 12 min</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-3">Platform Features</p>
            <h2 className="text-4xl font-extrabold text-gray-900">Three Engines. One Workflow. Zero Delays.</h2>
            <p className="mt-4 text-lg text-gray-600">Dreams combines sourcing, fulfillment, and dispatch into a single rescue workflow designed to keep your work moving.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="group p-6 rounded-2xl border border-gray-200 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300">
                <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center mb-4', feature.color)}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-3">How It Works</p>
            <h2 className="text-4xl font-extrabold text-gray-900">From Emergency to Delivery in Minutes</h2>
            <p className="mt-4 text-lg text-gray-600">Four steps between &quot;we need it now&quot; and &quot;it is here.&quot;</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="relative text-center">
                {i < 3 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-orange-300 to-orange-100" />
                )}
                <div className="relative mx-auto h-24 w-24 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-orange-500/20">
                  {step.icon}
                  <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Preview */}
      <section id="marketplace" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-3">Marketplace</p>
            <h2 className="text-4xl font-extrabold text-gray-900">50,000+ Tools & Materials</h2>
            <p className="mt-4 text-lg text-gray-600">From a single screwdriver to a fusion splicer. Buy or rent. Standard or urgent.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div key={cat.name} className="group flex flex-col items-center p-6 rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="h-16 w-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition-colors mb-4">
                  {cat.icon}
                </div>
                <p className="text-sm font-semibold text-gray-900 text-center">{cat.name}</p>
                <p className="text-xs text-gray-500 mt-1">{cat.count} items</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/marketplace">
              <Button variant="outline" size="lg" icon={<ChevronRight className="h-5 w-5" />} iconPosition="right">
                Browse All Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-3">Who It Is For</p>
              <h2 className="text-4xl font-extrabold mb-6">Built for Every Trade. Designed for Urgency.</h2>
              <p className="text-lg text-gray-400 mb-10">
                Whether you are a solo handyman or an enterprise with 500 technicians, Dreams adapts to your workflow and gets your team what they need, when they need it.
              </p>
              <div className="space-y-6">
                {useCases.map((uc) => (
                  <div key={uc.title} className="flex gap-4">
                    <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 flex-shrink-0">
                      {uc.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">{uc.title}</h3>
                      <p className="text-sm text-gray-400">{uc.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                    <Timer className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Urgent Order Placed</p>
                    <p className="text-xs text-gray-400">2 minutes ago</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { time: '0:00', event: 'Order submitted - DeWalt Hammer Drill', done: true },
                    { time: '0:12', event: 'Vendor confirmed - Pro Tool Supply', done: true },
                    { time: '0:45', event: 'Driver assigned - Marcus J.', done: true },
                    { time: '2:30', event: 'Order picked up, en route', done: true },
                    { time: '~38m', event: 'Estimated delivery', done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn('h-6 w-6 rounded-full flex items-center justify-center', item.done ? 'bg-emerald-500' : 'bg-gray-600 border-2 border-orange-500 animate-pulse')}>
                          {item.done && <CheckCircle2 className="h-4 w-4 text-white" />}
                        </div>
                        {i < 4 && <div className={cn('w-0.5 h-6', item.done ? 'bg-emerald-500/30' : 'bg-gray-700')} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-300">{item.event}</p>
                        <p className="text-xs text-gray-500">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-3">Testimonials</p>
            <h2 className="text-4xl font-extrabold text-gray-900">Trusted by Teams That Cannot Afford Downtime</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">&quot;{t.quote}&quot;</p>
                <div>
                  <p className="font-bold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-3">Pricing</p>
            <h2 className="text-4xl font-extrabold text-gray-900">Plans for Every Scale</h2>
            <p className="mt-4 text-lg text-gray-600">Start free. Scale when you need more power, teams, and integrations.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'rounded-2xl p-8 border-2 transition-all duration-300',
                  plan.featured ? 'border-orange-500 shadow-xl shadow-orange-500/10 relative' : 'border-gray-200 hover:border-gray-300'
                )}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs font-bold rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-500">{plan.period}</span>}
                </div>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                <div className="mt-8">
                  <Button variant={plan.featured ? 'urgent' : 'outline'} fullWidth size="lg">
                    {plan.cta}
                  </Button>
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle2 className={cn('h-5 w-5 flex-shrink-0 mt-0.5', plan.featured ? 'text-orange-500' : 'text-gray-400')} />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 text-orange-400 text-sm font-semibold mb-8">
            <Zap className="h-4 w-4 fill-orange-400" />
            Stop losing time. Start saving the day.
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Your Plan B Platform for
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">When Work Cannot Wait</span>
          </h2>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
            Join thousands of contractors, technicians, and companies that trust Dreams to rescue their projects when ordinary fulfillment fails.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button variant="urgent" size="xl" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right">
                Get Started for Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="xl" className="text-gray-300 hover:text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Dreams</span>
              </div>
              <p className="text-sm">Rapid rescue, sourcing, and dispatch platform for critical tools and materials.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">For Contractors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Enterprises</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Vendors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Drivers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2026 Dreams. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-sm hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-sm hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
