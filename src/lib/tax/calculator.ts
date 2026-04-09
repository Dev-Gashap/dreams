// Tax calculation engine
// Supports US sales tax with state, county, and city rates
// Handles tax-exempt items, certificates, and B2B exemptions

import type { Address, OrderItem } from '@/types';

interface TaxRate {
  state: string;
  city?: string;
  county?: string;
  zip?: string;
  rate: number; // percentage as decimal (0.0825 = 8.25%)
}

interface TaxBreakdown {
  state_tax: number;
  county_tax: number;
  city_tax: number;
  total_tax: number;
  total_rate: number;
  jurisdiction: string;
}

interface TaxableItem {
  product_id: string;
  product_name: string;
  category: string;
  quantity: number;
  unit_price: number;
  is_taxable: boolean;
  tax_category?: 'standard' | 'food' | 'medical' | 'clothing' | 'digital';
}

// US state base sales tax rates (simplified)
const STATE_TAX_RATES: Record<string, number> = {
  AL: 0.04, AK: 0.00, AZ: 0.056, AR: 0.065, CA: 0.0725, CO: 0.029,
  CT: 0.0635, DE: 0.00, FL: 0.06, GA: 0.04, HI: 0.04, ID: 0.06,
  IL: 0.0625, IN: 0.07, IA: 0.06, KS: 0.065, KY: 0.06, LA: 0.0445,
  ME: 0.055, MD: 0.06, MA: 0.0625, MI: 0.06, MN: 0.06875, MS: 0.07,
  MO: 0.04225, MT: 0.00, NE: 0.055, NV: 0.0685, NH: 0.00, NJ: 0.06625,
  NM: 0.05125, NY: 0.04, NC: 0.0475, ND: 0.05, OH: 0.0575, OK: 0.045,
  OR: 0.00, PA: 0.06, RI: 0.07, SC: 0.06, SD: 0.045, TN: 0.07,
  TX: 0.0625, UT: 0.0485, VT: 0.06, VA: 0.043, WA: 0.065, WV: 0.06,
  WI: 0.05, WY: 0.04, DC: 0.06,
};

// Local tax additions for major cities (simplified)
const LOCAL_TAX_RATES: Record<string, { county: number; city: number }> = {
  'TX-Houston': { county: 0.01, city: 0.01 },
  'TX-Dallas': { county: 0.01, city: 0.01 },
  'TX-Austin': { county: 0.005, city: 0.01 },
  'CA-Los Angeles': { county: 0.0025, city: 0.0125 },
  'CA-San Francisco': { county: 0.0025, city: 0.0125 },
  'NY-New York': { county: 0.045, city: 0.045 },
};

// Calculate tax for an address
export function calculateTaxRate(address: Address): TaxBreakdown {
  const state = address.state?.toUpperCase() || '';
  const city = address.city || '';
  const stateTax = STATE_TAX_RATES[state] || 0;
  const localKey = `${state}-${city}`;
  const local = LOCAL_TAX_RATES[localKey] || { county: 0, city: 0 };

  const totalRate = stateTax + local.county + local.city;
  const jurisdiction = `${city ? city + ', ' : ''}${state}`;

  return {
    state_tax: stateTax,
    county_tax: local.county,
    city_tax: local.city,
    total_tax: 0, // calculated when applied to items
    total_rate: totalRate,
    jurisdiction,
  };
}

// Calculate tax on items
export function calculateOrderTax(items: TaxableItem[], deliveryAddress: Address, isExempt = false, exemptionCertificate?: string): {
  subtotal: number;
  taxable_amount: number;
  tax_breakdown: TaxBreakdown;
  total_tax: number;
  total: number;
  exemption_applied: boolean;
} {
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const taxableAmount = items
    .filter((item) => item.is_taxable)
    .reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  if (isExempt && exemptionCertificate) {
    return {
      subtotal,
      taxable_amount: 0,
      tax_breakdown: { state_tax: 0, county_tax: 0, city_tax: 0, total_tax: 0, total_rate: 0, jurisdiction: '' },
      total_tax: 0,
      total: subtotal,
      exemption_applied: true,
    };
  }

  const breakdown = calculateTaxRate(deliveryAddress);
  const stateTax = taxableAmount * breakdown.state_tax;
  const countyTax = taxableAmount * breakdown.county_tax;
  const cityTax = taxableAmount * breakdown.city_tax;
  const totalTax = stateTax + countyTax + cityTax;

  return {
    subtotal,
    taxable_amount: taxableAmount,
    tax_breakdown: {
      ...breakdown,
      state_tax: stateTax,
      county_tax: countyTax,
      city_tax: cityTax,
      total_tax: totalTax,
    },
    total_tax: Math.round(totalTax * 100) / 100,
    total: Math.round((subtotal + totalTax) * 100) / 100,
    exemption_applied: false,
  };
}

// Determine if a category is taxable
export function isCategoryTaxable(category: string, state: string): boolean {
  // Most states tax tools/equipment fully
  const taxableCategories = [
    'power_tools', 'hand_tools', 'safety_equipment', 'electrical',
    'plumbing', 'hvac', 'fasteners', 'lumber', 'concrete', 'roofing',
    'flooring', 'paint', 'measuring', 'welding', 'automotive',
    'heavy_equipment', 'landscaping', 'telecom', 'networking',
    'replacement_parts', 'consumables',
  ];
  return taxableCategories.includes(category);
}

// Get tax info for display
export function getTaxInfo(state: string): { name: string; rate: number; description: string } {
  const rate = STATE_TAX_RATES[state.toUpperCase()] || 0;
  return {
    name: `${state.toUpperCase()} Sales Tax`,
    rate,
    description: rate === 0 ? 'No state sales tax' : `${(rate * 100).toFixed(2)}% state tax`,
  };
}

// Validate exemption certificate (mock)
export function validateExemptionCertificate(certNumber: string): { valid: boolean; expires?: string; type?: string } {
  if (!certNumber || certNumber.length < 8) return { valid: false };
  return { valid: true, expires: '2027-12-31', type: 'Resale Exemption' };
}
