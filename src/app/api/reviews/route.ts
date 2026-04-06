import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit';

const mockReviews = [
  { id: 'r_1', product_id: 'prod_001', user_id: 'user_001', user_name: 'Mike Torres', rating: 5, title: 'Exactly what I needed', body: 'Had this delivered to a job site in 35 minutes. Quality is excellent.', photos: [], verified: true, helpful_count: 12, created_at: '2026-03-15T10:00:00Z' },
  { id: 'r_2', product_id: 'prod_001', user_id: 'user_002', user_name: 'Sarah Chen', rating: 4, title: 'Great product, fast delivery', body: 'Product works as advertised. Dreams delivery was incredibly fast.', photos: [], verified: true, helpful_count: 8, created_at: '2026-03-10T14:00:00Z' },
  { id: 'r_3', product_id: 'prod_001', user_id: 'user_003', user_name: 'James Rodriguez', rating: 5, title: 'A lifesaver for our crew', body: 'We had a critical tool failure mid-project. Ordered a replacement through Dreams and it was on site before lunch.', photos: [], verified: true, helpful_count: 24, created_at: '2026-02-28T09:00:00Z' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product_id');
  const sort = searchParams.get('sort') || 'newest';

  let reviews = [...mockReviews];

  if (productId) {
    reviews = reviews.filter((r) => r.product_id === productId);
  }

  switch (sort) {
    case 'newest': reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
    case 'highest': reviews.sort((a, b) => b.rating - a.rating); break;
    case 'lowest': reviews.sort((a, b) => a.rating - b.rating); break;
    case 'helpful': reviews.sort((a, b) => b.helpful_count - a.helpful_count); break;
  }

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percentage: reviews.length > 0 ? Math.round((reviews.filter((r) => r.rating === stars).length / reviews.length) * 100) : 0,
  }));

  return NextResponse.json({
    reviews,
    total: reviews.length,
    average_rating: Math.round(avgRating * 10) / 10,
    distribution,
  });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(ip, 'api');
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: rateLimitHeaders(limit) });
  }

  const body = await request.json();
  const { product_id, rating, title, body: reviewBody } = body;

  if (!product_id || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Invalid review data' }, { status: 400 });
  }

  const newReview = {
    id: `r_${Date.now()}`,
    product_id,
    user_id: 'user_001',
    user_name: 'Alex Morgan',
    rating,
    title: title || '',
    body: reviewBody || '',
    photos: [],
    verified: true,
    helpful_count: 0,
    created_at: new Date().toISOString(),
  };

  return NextResponse.json({ review: newReview }, { status: 201 });
}
