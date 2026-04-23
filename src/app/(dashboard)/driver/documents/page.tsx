'use client';

import { useState } from 'react';
import {
  FileText,
  Download,
  DollarSign,
  Calendar,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Eye,
  FileCheck,
  Receipt,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

const taxYears = [
  { year: 2026, earnings: 42850, deliveries: 487, milesDriven: 12400, status: 'in_progress' },
  { year: 2025, earnings: 68420, deliveries: 1284, milesDriven: 34200, status: 'filed', form: '1099-NEC' },
  { year: 2024, earnings: 54200, deliveries: 1042, milesDriven: 28400, status: 'filed', form: '1099-NEC' },
];

const driverDocuments = [
  { id: 'd_1', name: "Driver's License", type: 'identity', expires: '2028-06-15', status: 'valid', uploadedAt: '2025-06-01' },
  { id: 'd_2', name: 'Social Security Card', type: 'identity', status: 'valid', uploadedAt: '2025-06-01' },
  { id: 'd_3', name: 'W-9 Form (Tax ID)', type: 'tax', status: 'valid', uploadedAt: '2025-06-01' },
  { id: 'd_4', name: 'Background Check Report', type: 'compliance', status: 'valid', uploadedAt: '2025-06-05' },
  { id: 'd_5', name: 'Safe Driver Certificate', type: 'certification', expires: '2027-08-10', status: 'valid', uploadedAt: '2025-08-10' },
  { id: 'd_6', name: 'Food Handler Certificate', type: 'certification', expires: '2026-05-15', status: 'expiring', uploadedAt: '2024-05-15' },
];

const monthlyEarnings = [
  { month: 'Jan', earnings: 5420, miles: 1480 },
  { month: 'Feb', earnings: 6280, miles: 1720 },
  { month: 'Mar', earnings: 7100, miles: 1980 },
  { month: 'Apr', earnings: 4200, miles: 1220 },
];

export default function DriverDocumentsPage() {
  const [activeTab, setActiveTab] = useState('tax');

  const currentYear = taxYears[0];
  const mileageDeduction = currentYear.milesDriven * 0.67;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documents & Taxes</h1>
        <p className="text-sm text-gray-500 mt-1">Access your tax forms, earnings reports, and driver documents.</p>
      </div>

      <Tabs
        variant="boxed"
        tabs={[
          { id: 'tax', label: 'Tax Center', icon: <Receipt className="h-4 w-4" /> },
          { id: 'earnings', label: 'Earnings Reports', icon: <DollarSign className="h-4 w-4" /> },
          { id: 'documents', label: 'My Documents', icon: <FileText className="h-4 w-4" />, count: driverDocuments.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'tax' && (
        <div className="space-y-6">
          {/* 2026 YTD Summary */}
          <Card className="bg-gradient-to-br from-orange-50 via-white to-red-50 border-orange-200">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <Badge variant="urgent" size="sm">Current tax year</Badge>
                <h2 className="text-3xl font-extrabold text-gray-900 mt-2">2026 Year to Date</h2>
                <p className="text-sm text-gray-600 mt-1">Your tax form will be available Jan 31, 2027</p>
              </div>
              <Button variant="outline" size="sm" icon={<Download className="h-3.5 w-3.5" />}>Download YTD Report</Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Gross earnings</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">{formatCurrency(currentYear.earnings)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Deliveries</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">{currentYear.deliveries}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Miles driven</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">{currentYear.milesDriven.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-emerald-700 font-semibold uppercase">Mileage deduction*</p>
                <p className="text-3xl font-extrabold text-emerald-600 mt-1">{formatCurrency(mileageDeduction)}</p>
                <p className="text-[10px] text-gray-500">$0.67/mi IRS rate</p>
              </div>
            </div>
          </Card>

          {/* Tax Forms */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Tax forms</h2>
            <div className="space-y-3">
              {taxYears.map((ty) => (
                <Card key={ty.year} hover>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn('h-14 w-14 rounded-xl flex items-center justify-center',
                        ty.status === 'filed' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                      )}>
                        <FileCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">Tax Year {ty.year}</p>
                        <p className="text-xs text-gray-500">
                          {ty.deliveries.toLocaleString()} deliveries &middot; {ty.milesDriven.toLocaleString()} miles
                        </p>
                        {ty.form && <p className="text-xs text-gray-500 mt-0.5">{ty.form}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(ty.earnings)}</p>
                        <p className="text-xs text-gray-500">Gross</p>
                      </div>
                      {ty.status === 'filed' ? (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" icon={<Eye className="h-3.5 w-3.5" />}>View</Button>
                          <Button variant="primary" size="sm" icon={<Download className="h-3.5 w-3.5" />}>Download</Button>
                        </div>
                      ) : (
                        <Badge variant="warning" size="sm">In progress</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Tax Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-blue-900 mb-2">Tax tips for drivers</p>
                <ul className="space-y-1.5 text-sm text-blue-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    As an independent contractor, you can deduct business expenses like mileage, phone usage, and gas
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    The standard mileage rate for 2026 is $0.67 per business mile
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    Track all receipts for vehicle maintenance, tolls, parking, and supplies
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    Consider making quarterly estimated tax payments to avoid penalties
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">2026 Monthly breakdown</h2>
              <Button variant="outline" size="sm" icon={<Download className="h-3.5 w-3.5" />}>Export CSV</Button>
            </div>
            <div className="space-y-3">
              {monthlyEarnings.map((m) => (
                <div key={m.month} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50">
                  <div className="w-12 text-center">
                    <p className="text-xs text-gray-500 font-semibold uppercase">{m.month}</p>
                    <p className="text-xs text-gray-400">2026</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700">{m.miles.toLocaleString()} miles driven</span>
                      <span className="font-bold text-gray-900">{formatCurrency(m.earnings)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${(m.earnings / 7500) * 100}%` }} />
                    </div>
                  </div>
                  <Button variant="ghost" size="xs" icon={<Download className="h-3 w-3" />}>PDF</Button>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <p className="text-xs text-gray-500 font-semibold uppercase">Weekly reports</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">Available</p>
              <Button variant="outline" size="sm" className="mt-3" icon={<Download className="h-3.5 w-3.5" />}>
                Download latest
              </Button>
            </Card>
            <Card>
              <p className="text-xs text-gray-500 font-semibold uppercase">Expense log</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$3,240</p>
              <Button variant="outline" size="sm" className="mt-3" icon={<Receipt className="h-3.5 w-3.5" />}>
                View expenses
              </Button>
            </Card>
            <Card>
              <p className="text-xs text-gray-500 font-semibold uppercase">Mileage log</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{currentYear.milesDriven.toLocaleString()} mi</p>
              <Button variant="outline" size="sm" className="mt-3" icon={<TrendingUp className="h-3.5 w-3.5" />}>
                View details
              </Button>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Button variant="primary" size="sm" icon={<Upload className="h-3.5 w-3.5" />}>Upload document</Button>
          </div>
          {driverDocuments.map((doc) => (
            <Card key={doc.id} padding="sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center',
                    doc.status === 'valid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  )}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      Uploaded {formatDate(doc.uploadedAt)}{doc.expires && ` &middot; Expires ${formatDate(doc.expires)}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={doc.status === 'valid' ? 'success' : 'warning'} size="sm">
                    {doc.status === 'valid' ? (
                      <><CheckCircle2 className="h-3 w-3 mr-0.5" /> Valid</>
                    ) : (
                      <><AlertTriangle className="h-3 w-3 mr-0.5" /> Expiring</>
                    )}
                  </Badge>
                  <Button variant="ghost" size="xs" icon={<Eye className="h-3 w-3" />}>View</Button>
                  <Button variant="ghost" size="xs" icon={<Download className="h-3 w-3" />}>Download</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
