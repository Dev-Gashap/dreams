'use client';

import { useState } from 'react';
import {
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  Filter,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportDialog({ isOpen, onClose }: ExportDialogProps) {
  const [format, setFormat] = useState<'csv' | 'pdf' | 'xlsx'>('csv');
  const [dateRange, setDateRange] = useState('this_month');
  const [includeItems, setIncludeItems] = useState(true);
  const [includePayments, setIncludePayments] = useState(true);
  const [includeDelivery, setIncludeDelivery] = useState(true);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setCompleted(true);
    setTimeout(() => {
      setCompleted(false);
      onClose();
    }, 2000);
  };

  const formats = [
    { value: 'csv' as const, label: 'CSV', description: 'Comma-separated values for spreadsheets', icon: <FileSpreadsheet className="h-5 w-5" /> },
    { value: 'pdf' as const, label: 'PDF', description: 'Formatted report with charts', icon: <FileText className="h-5 w-5" /> },
    { value: 'xlsx' as const, label: 'Excel', description: 'Microsoft Excel workbook', icon: <FileSpreadsheet className="h-5 w-5" /> },
  ];

  if (completed) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <div className="text-center py-6">
          <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Export Complete!</h3>
          <p className="text-sm text-gray-500 mt-1">Your file has been downloaded.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Orders" description="Download your order data in your preferred format.">
      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
          <div className="grid grid-cols-3 gap-3">
            {formats.map((f) => (
              <button
                key={f.value}
                onClick={() => setFormat(f.value)}
                className={cn(
                  'p-3 rounded-xl border-2 text-center transition-all',
                  format === f.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className={cn(
                  'h-10 w-10 rounded-lg flex items-center justify-center mx-auto mb-2',
                  format === f.value ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'
                )}>
                  {f.icon}
                </div>
                <p className="text-sm font-semibold text-gray-900">{f.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{f.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <Select
          label="Date Range"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          options={[
            { value: 'today', label: 'Today' },
            { value: 'this_week', label: 'This Week' },
            { value: 'this_month', label: 'This Month' },
            { value: 'last_month', label: 'Last Month' },
            { value: 'last_90_days', label: 'Last 90 Days' },
            { value: 'this_year', label: 'This Year' },
            { value: 'all_time', label: 'All Time' },
          ]}
        />

        {/* Include Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Include in Export</label>
          <div className="space-y-2">
            {[
              { label: 'Line Items (products, quantities, prices)', checked: includeItems, onChange: setIncludeItems },
              { label: 'Payment Details (method, status, transaction IDs)', checked: includePayments, onChange: setIncludePayments },
              { label: 'Delivery Info (method, address, driver, ETA)', checked: includeDelivery, onChange: setIncludeDelivery },
            ].map((opt) => (
              <label key={opt.label} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={opt.checked}
                  onChange={(e) => opt.onChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-orange-600"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            fullWidth
            loading={loading}
            icon={<Download className="h-4 w-4" />}
            onClick={handleExport}
          >
            Export {format.toUpperCase()}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
