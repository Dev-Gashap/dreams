import { NextRequest, NextResponse } from 'next/server';
import { mockProducts } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category');
  const urgent = searchParams.get('urgent') === 'true';
  const rentable = searchParams.get('rentable') === 'true';
  const minPrice = parseFloat(searchParams.get('min_price') || '0');
  const maxPrice = parseFloat(searchParams.get('max_price') || '999999');
  const sortBy = searchParams.get('sort') || 'relevance';
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('per_page') || '20');

  let results = [...mockProducts];

  // Search filter
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    );
  }

  // Category filter
  if (category) {
    results = results.filter((p) => p.category === category);
  }

  // Urgent filter
  if (urgent) {
    results = results.filter((p) => p.is_urgent_eligible);
  }

  // Rental filter
  if (rentable) {
    results = results.filter((p) => p.is_rentable);
  }

  // Price filter
  results = results.filter((p) => p.price >= minPrice && p.price <= maxPrice);

  // Sort
  switch (sortBy) {
    case 'price_asc':
      results.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      results.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      results.sort((a, b) => b.rating - a.rating);
      break;
    case 'delivery_speed':
      results.sort((a, b) => (a.estimated_delivery_minutes || 999) - (b.estimated_delivery_minutes || 999));
      break;
  }

  // Pagination
  const total = results.length;
  const start = (page - 1) * perPage;
  const paginatedResults = results.slice(start, start + perPage);

  // Facets
  const allProducts = mockProducts;
  const categoryFacets = [...new Set(allProducts.map((p) => p.category))].map((cat) => ({
    name: cat,
    count: allProducts.filter((p) => p.category === cat).length,
  }));

  const brandFacets = [...new Set(allProducts.map((p) => p.brand))].map((brand) => ({
    name: brand,
    count: allProducts.filter((p) => p.brand === brand).length,
  }));

  return NextResponse.json({
    products: paginatedResults,
    total,
    page,
    per_page: perPage,
    facets: {
      categories: categoryFacets,
      brands: brandFacets,
    },
  });
}
