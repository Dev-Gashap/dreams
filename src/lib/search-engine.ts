// Advanced search engine abstraction layer
// Supports: local mock, Supabase full-text, Meilisearch, or Algolia

import type { Product, ProductSearchFilters, SearchResult, SearchFacets } from '@/types';
import { mockProducts } from '@/lib/mock-data';

type SearchProvider = 'local' | 'supabase' | 'meilisearch' | 'algolia';

const PROVIDER: SearchProvider = 'local'; // Switch when ready

// ---- Scoring & Relevance ----
function calculateRelevanceScore(product: Product, query: string): number {
  const q = query.toLowerCase();
  let score = 0;

  // Exact name match
  if (product.name.toLowerCase() === q) score += 100;
  // Name starts with query
  else if (product.name.toLowerCase().startsWith(q)) score += 80;
  // Name contains query
  else if (product.name.toLowerCase().includes(q)) score += 60;

  // SKU exact match
  if (product.sku.toLowerCase() === q) score += 90;

  // Brand match
  if (product.brand.toLowerCase().includes(q)) score += 40;

  // Tag match
  if (product.tags.some((t) => t.toLowerCase().includes(q))) score += 30;

  // Description match
  if (product.description.toLowerCase().includes(q)) score += 10;

  // Category match
  if (product.category.toLowerCase().includes(q)) score += 25;

  // Boost urgent-eligible products
  if (product.is_urgent_eligible) score += 5;

  // Boost in-stock products
  if (product.in_stock) score += 10;

  // Boost higher-rated products
  score += product.rating * 2;

  return score;
}

// ---- Typo tolerance (basic Levenshtein) ----
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function fuzzyMatch(text: string, query: string, maxDistance = 2): boolean {
  const words = text.toLowerCase().split(/\s+/);
  const queryWords = query.toLowerCase().split(/\s+/);

  return queryWords.every((qw) =>
    words.some((w) => w.includes(qw) || levenshtein(w.substring(0, qw.length + 2), qw) <= maxDistance)
  );
}

// ---- Synonym expansion ----
const SYNONYMS: Record<string, string[]> = {
  drill: ['driver', 'bore', 'driller'],
  saw: ['cutter', 'blade'],
  pipe: ['tube', 'tubing', 'conduit'],
  cable: ['wire', 'cord', 'line'],
  hammer: ['mallet', 'sledge'],
  wrench: ['spanner'],
  multimeter: ['meter', 'tester', 'dmm'],
  generator: ['genset', 'power supply'],
  respirator: ['mask', 'gas mask'],
  screwdriver: ['driver', 'bit driver'],
};

function expandQuery(query: string): string[] {
  const words = query.toLowerCase().split(/\s+/);
  const expanded = new Set(words);

  words.forEach((word) => {
    // Check if word has synonyms
    Object.entries(SYNONYMS).forEach(([key, syns]) => {
      if (word === key || syns.includes(word)) {
        expanded.add(key);
        syns.forEach((s) => expanded.add(s));
      }
    });
  });

  return Array.from(expanded);
}

// ---- Build facets ----
function buildFacets(products: Product[]): SearchFacets {
  const categoryMap = new Map<string, number>();
  const brandMap = new Map<string, number>();
  const vendorMap = new Map<string, { id: string; name: string; count: number }>();

  products.forEach((p) => {
    categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1);
    brandMap.set(p.brand, (brandMap.get(p.brand) || 0) + 1);
    if (!vendorMap.has(p.vendor_id)) {
      vendorMap.set(p.vendor_id, { id: p.vendor_id, name: p.vendor_name, count: 0 });
    }
    vendorMap.get(p.vendor_id)!.count++;
  });

  return {
    categories: Array.from(categoryMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    brands: Array.from(brandMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    price_ranges: [
      { label: 'Under $25', min: 0, max: 25, count: products.filter((p) => p.price < 25).length },
      { label: '$25 - $100', min: 25, max: 100, count: products.filter((p) => p.price >= 25 && p.price < 100).length },
      { label: '$100 - $500', min: 100, max: 500, count: products.filter((p) => p.price >= 100 && p.price < 500).length },
      { label: '$500 - $1000', min: 500, max: 1000, count: products.filter((p) => p.price >= 500 && p.price < 1000).length },
      { label: '$1000+', min: 1000, max: 999999, count: products.filter((p) => p.price >= 1000).length },
    ],
    vendors: Array.from(vendorMap.values()).sort((a, b) => b.count - a.count),
  };
}

// ---- Autocomplete suggestions ----
export function getSearchSuggestions(query: string, limit = 8): string[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const suggestions = new Set<string>();

  // Product name matches
  mockProducts.forEach((p) => {
    if (p.name.toLowerCase().includes(q)) suggestions.add(p.name);
    if (p.brand.toLowerCase().includes(q)) suggestions.add(p.brand);
    p.tags.forEach((t) => { if (t.includes(q)) suggestions.add(t); });
  });

  // Category matches
  const categories = ['Power Tools', 'Hand Tools', 'Electrical', 'Plumbing', 'HVAC', 'Networking', 'Safety Equipment'];
  categories.forEach((c) => { if (c.toLowerCase().includes(q)) suggestions.add(c); });

  return Array.from(suggestions).slice(0, limit);
}

// ---- Main search function ----
export async function searchProducts(filters: ProductSearchFilters): Promise<SearchResult> {
  // In production, switch on PROVIDER to call Meilisearch/Algolia/Supabase
  // For now, use local search with advanced features

  let results = [...mockProducts];
  const query = filters.query?.trim() || '';

  // Text search with relevance scoring, synonym expansion, and fuzzy matching
  if (query) {
    const expandedTerms = expandQuery(query);
    const expandedQuery = expandedTerms.join(' ');

    results = results
      .map((p) => ({
        product: p,
        score: Math.max(
          calculateRelevanceScore(p, query),
          calculateRelevanceScore(p, expandedQuery),
          fuzzyMatch(`${p.name} ${p.brand} ${p.tags.join(' ')}`, query) ? 20 : 0
        ),
      }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.product);
  }

  // Category filter
  if (filters.category) {
    results = results.filter((p) => p.category === filters.category);
  }

  // Price range
  if (filters.min_price !== undefined) results = results.filter((p) => p.price >= filters.min_price!);
  if (filters.max_price !== undefined) results = results.filter((p) => p.price <= filters.max_price!);

  // Brand filter
  if (filters.brand) results = results.filter((p) => p.brand === filters.brand);

  // Stock filter
  if (filters.in_stock_only) results = results.filter((p) => p.in_stock);

  // Urgent filter
  if (filters.urgent_only) results = results.filter((p) => p.is_urgent_eligible);

  // Rental filter
  if (filters.rental_available) results = results.filter((p) => p.is_rentable);

  // Vendor filter
  if (filters.vendor_id) results = results.filter((p) => p.vendor_id === filters.vendor_id);

  // Build facets before sorting/pagination
  const facets = buildFacets(results);

  // Sort (if not already sorted by relevance)
  if (!query || filters.sort_by !== 'relevance') {
    switch (filters.sort_by) {
      case 'price_asc': results.sort((a, b) => a.price - b.price); break;
      case 'price_desc': results.sort((a, b) => b.price - a.price); break;
      case 'rating': results.sort((a, b) => b.rating - a.rating); break;
      case 'delivery_speed': results.sort((a, b) => (a.estimated_delivery_minutes || 999) - (b.estimated_delivery_minutes || 999)); break;
      case 'newest': results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
    }
  }

  // Pagination
  const page = filters.page || 1;
  const perPage = filters.per_page || 20;
  const total = results.length;
  const paginated = results.slice((page - 1) * perPage, page * perPage);

  return {
    products: paginated,
    total,
    page,
    per_page: perPage,
    facets,
  };
}
