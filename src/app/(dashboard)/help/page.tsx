'use client';

import { useState } from 'react';
import {
  HelpCircle,
  Search,
  MessageSquare,
  Phone,
  Mail,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Zap,
  Package,
  Truck,
  Key,
  CreditCard,
  Users,
  Store,
  Shield,
  Clock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const faqCategories = [
  {
    name: 'Orders & Delivery',
    icon: <Package className="h-5 w-5" />,
    faqs: [
      { q: 'How fast can I get a delivery?', a: 'Delivery speed depends on your priority level. Critical orders can arrive in 15-25 minutes, urgent in 25-45 minutes, and standard in 45-90 minutes. Actual times vary by vendor location and driver availability.' },
      { q: 'What delivery methods are available?', a: 'Dreams offers multiple delivery methods: third-party courier, internal Dreams driver, warehouse runner, customer pickup, and drone delivery (for items under 5 lbs). The platform automatically selects the fastest eligible method.' },
      { q: 'Can I cancel an order?', a: 'Orders can be cancelled before they are picked up by the driver. Once picked up, cancellation may incur a restocking fee. Go to Orders, select the order, and click Cancel if the option is available.' },
      { q: 'How do I track my delivery?', a: 'Go to the Live Tracking page from the dashboard or click Track on any active order. You will see real-time driver location, ETA, and delivery timeline — similar to ride-sharing apps.' },
    ],
  },
  {
    name: 'Rentals',
    icon: <Key className="h-5 w-5" />,
    faqs: [
      { q: 'How do tool rentals work?', a: 'Browse the marketplace, select a rentable product, choose your rental period (hourly, daily, weekly, monthly), and place the order. A deposit is held on your card and refunded upon return of the item in good condition.' },
      { q: 'What happens if I return a rental late?', a: 'Late returns are charged at the daily rate for each additional day. You will receive reminder notifications before your rental is due. You can also extend your rental from the Rentals page.' },
      { q: 'What if a rented tool is damaged?', a: 'Minor wear from normal use is expected. Significant damage may result in partial or full forfeiture of your deposit. We recommend purchasing rental insurance for high-value equipment.' },
    ],
  },
  {
    name: 'Business Accounts',
    icon: <Users className="h-5 w-5" />,
    faqs: [
      { q: 'How do approval workflows work?', a: 'Company administrators can set spending limits and require approvals for team members. When a technician places an order above their limit, it goes to their manager for approval. Managers receive instant notifications.' },
      { q: 'Can I use purchase orders?', a: 'Yes. Business accounts can use PO numbers as a payment method. Orders are invoiced to your company account and due within your agreed net terms (typically Net-30).' },
      { q: 'How do I add team members?', a: 'Go to Team Management, click Invite Member, enter their email and select a role (Admin, Manager, Dispatcher, Technician, Viewer). They will receive an invitation to join your company account.' },
    ],
  },
  {
    name: 'Vendor Partners',
    icon: <Store className="h-5 w-5" />,
    faqs: [
      { q: 'How do I become a vendor?', a: 'Click "Become a Vendor" and complete the onboarding process. You will need business information, location, operating hours, and banking details. Applications are reviewed within 24-48 hours.' },
      { q: 'What is the commission rate?', a: 'Dreams charges a 12% commission on each order fulfilled through the platform. Payouts are processed weekly via direct deposit to your connected bank account.' },
      { q: 'How do I manage my inventory?', a: 'Use the Vendor Portal to add products, update stock levels, set pricing, and configure rental availability. You will receive alerts when stock runs low.' },
    ],
  },
  {
    name: 'Payments & Billing',
    icon: <CreditCard className="h-5 w-5" />,
    faqs: [
      { q: 'What payment methods are accepted?', a: 'We accept Visa, Mastercard, American Express, company accounts, purchase orders (for business accounts), and Dreams Wallet. All transactions are secured with 256-bit SSL encryption.' },
      { q: 'How do refunds work?', a: 'Refunds for cancelled orders are processed within 3-5 business days. Rental deposits are refunded upon item return inspection, typically within 24 hours.' },
      { q: 'Can I get an invoice for my order?', a: 'Yes. Every order generates a detailed invoice that can be downloaded as PDF or printed from the order confirmation page. Business accounts receive consolidated monthly invoices.' },
    ],
  },
];

const contactOptions = [
  { icon: <MessageSquare className="h-6 w-6" />, title: 'Live Chat', description: 'Chat with our support team in real-time', action: 'Start Chat', available: true, responseTime: '< 2 min' },
  { icon: <Phone className="h-6 w-6" />, title: 'Phone Support', description: 'Call us for immediate assistance', action: '1-800-DREAMS', available: true, responseTime: 'Instant' },
  { icon: <Mail className="h-6 w-6" />, title: 'Email Support', description: 'Send us a detailed message', action: 'support@dreams.app', available: true, responseTime: '< 4 hours' },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(faqCategories[0].name);

  const toggleFaq = (q: string) => {
    setExpandedFaq(expandedFaq === q ? null : q);
  };

  const currentCategory = faqCategories.find((c) => c.name === activeCategory) || faqCategories[0];

  const allFaqs = faqCategories.flatMap((c) => c.faqs.map((f) => ({ ...f, category: c.name })));
  const filteredFaqs = searchQuery
    ? allFaqs.filter(
        (f) =>
          f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentCategory.faqs;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="h-14 w-14 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="h-7 w-7 text-orange-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Help & Support</h1>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">Find answers to common questions or get in touch with our support team.</p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto">
        <Input
          placeholder="Search for help..."
          icon={<Search className="h-5 w-5" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-base py-3"
        />
      </div>

      {/* Contact Options */}
      <div className="grid sm:grid-cols-3 gap-4">
        {contactOptions.map((option) => (
          <Card key={option.title} hover className="text-center">
            <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-3">
              {option.icon}
            </div>
            <h3 className="font-bold text-gray-900">{option.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{option.description}</p>
            <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-400">
              <Clock className="h-3 w-3" /> {option.responseTime}
            </div>
            <Button variant="outline" size="sm" fullWidth className="mt-4">
              {option.action}
            </Button>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>

        {!searchQuery && (
          <div className="flex flex-wrap gap-2 mb-6">
            {faqCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  activeCategory === cat.name
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-2">
          {filteredFaqs.map((faq) => (
            <div key={faq.q} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFaq(faq.q)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-900 pr-4">{faq.q}</span>
                {expandedFaq === faq.q ? (
                  <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {expandedFaq === faq.q && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {searchQuery && filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="font-semibold text-gray-900">No results found</p>
            <p className="text-sm text-gray-500 mt-1">Try different keywords or contact our support team.</p>
          </div>
        )}
      </div>

      {/* Still need help */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white text-center">
        <Zap className="h-8 w-8 text-orange-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold mb-2">Still need help?</h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">Our support team is available 24/7 to help you with any questions or issues.</p>
        <div className="flex gap-3 justify-center">
          <Button variant="urgent" icon={<MessageSquare className="h-4 w-4" />}>Start Live Chat</Button>
          <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700" icon={<Phone className="h-4 w-4" />}>Call Support</Button>
        </div>
      </Card>
    </div>
  );
}
