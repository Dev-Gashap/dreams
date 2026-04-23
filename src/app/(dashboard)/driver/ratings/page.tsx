'use client';

import {
  Star,
  ThumbsUp,
  Clock,
  MapPin,
  MessageSquare,
  TrendingUp,
  Award,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn, formatRelativeTime } from '@/lib/utils';

const ratingStats = {
  overall: 4.9,
  total: 1247,
  distribution: [
    { stars: 5, count: 1120, pct: 89 },
    { stars: 4, count: 102, pct: 8 },
    { stars: 3, count: 15, pct: 1 },
    { stars: 2, count: 6, pct: 1 },
    { stars: 1, count: 4, pct: 1 },
  ],
  categories: [
    { name: 'On-time delivery', score: 4.95 },
    { name: 'Professionalism', score: 4.92 },
    { name: 'Communication', score: 4.88 },
    { name: 'Care with items', score: 4.90 },
  ],
};

const compliments = [
  { label: 'Professional', count: 342, icon: '👔' },
  { label: 'Quick', count: 287, icon: '⚡' },
  { label: 'Friendly', count: 198, icon: '😊' },
  { label: 'Careful', count: 164, icon: '🤝' },
  { label: 'Good communicator', count: 142, icon: '💬' },
  { label: 'Went above and beyond', count: 89, icon: '⭐' },
];

const recentReviews = [
  {
    id: 'r_1',
    rating: 5,
    customer: 'Alex M.',
    orderNumber: 'DRM-LK82F-X9A3',
    date: '2026-04-22T14:45:00Z',
    comment: 'Marcus was incredibly professional and got our drill to the job site in under 40 minutes. Saved our day!',
    compliments: ['Quick', 'Professional'],
  },
  {
    id: 'r_2',
    rating: 5,
    customer: 'Sarah C.',
    orderNumber: 'DRM-MN47K-B2C1',
    date: '2026-04-22T11:15:00Z',
    comment: 'Delivered a fragile splicer kit without a scratch. Called ahead so I could meet him at the loading dock. A+.',
    compliments: ['Careful', 'Good communicator'],
  },
  {
    id: 'r_3',
    rating: 5,
    customer: 'Mike T.',
    orderNumber: 'DRM-AB12C-D3E4',
    date: '2026-04-21T09:30:00Z',
    comment: 'Super friendly, helped me carry the boxes upstairs. Five stars.',
    compliments: ['Friendly', 'Went above and beyond'],
  },
  {
    id: 'r_4',
    rating: 4,
    customer: 'Rachel K.',
    orderNumber: 'DRM-EF56G-H7I8',
    date: '2026-04-20T16:00:00Z',
    comment: 'Great delivery, a few minutes late but Marcus kept me updated the whole time.',
    compliments: ['Good communicator'],
  },
];

const achievements = [
  { id: 'a_1', name: '1,000 Deliveries', description: 'Completed 1,000 successful deliveries', earned: true, earnedAt: '2025-12-15' },
  { id: 'a_2', name: '5-Star Week', description: 'Earned all 5-star ratings for a full week', earned: true, earnedAt: '2026-04-15' },
  { id: 'a_3', name: 'Top Performer', description: 'Top 5% of drivers in your city', earned: true, earnedAt: '2026-03-01' },
  { id: 'a_4', name: 'Urgent Hero', description: 'Completed 100 critical priority deliveries', earned: true, earnedAt: '2026-02-20' },
  { id: 'a_5', name: 'Veteran Driver', description: 'Drive for 2+ years with 4.8+ rating', earned: false, progress: 0.75 },
  { id: 'a_6', name: 'Mile Master', description: 'Drive 50,000+ miles', earned: false, progress: 0.68 },
];

export default function DriverRatingsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ratings & Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">Customer feedback and your performance stats.</p>
      </div>

      {/* Overall Rating Card */}
      <Card className="bg-gradient-to-br from-amber-50 via-white to-orange-50 border-amber-200">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Your overall rating</p>
            <div className="flex items-baseline gap-2 mt-2 justify-center md:justify-start">
              <p className="text-6xl font-extrabold text-gray-900">{ratingStats.overall}</p>
              <Star className="h-8 w-8 fill-amber-400 text-amber-400" />
            </div>
            <p className="text-sm text-gray-500 mt-1">From {ratingStats.total.toLocaleString()} ratings</p>
            <div className="mt-3 flex items-center gap-2 justify-center md:justify-start">
              <Badge variant="success" size="sm">
                <Award className="h-3 w-3 mr-0.5" /> Top 5% of drivers
              </Badge>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            {ratingStats.distribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm text-gray-500">{d.stars}</span>
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full',
                      d.stars >= 4 ? 'bg-emerald-500' : d.stars >= 3 ? 'bg-amber-500' : 'bg-red-500'
                    )}
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-16 text-right">{d.count} ({d.pct}%)</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Category Scores */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Category scores</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ratingStats.categories.map((cat) => (
            <Card key={cat.name} padding="sm">
              <p className="text-xs text-gray-500 font-semibold uppercase">{cat.name}</p>
              <div className="flex items-center gap-1 mt-1">
                <p className="text-2xl font-extrabold text-gray-900">{cat.score}</p>
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(cat.score / 5) * 100}%` }} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Compliments */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Compliments received</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {compliments.map((c) => (
            <Card key={c.label} padding="sm" className="text-center">
              <p className="text-3xl mb-1">{c.icon}</p>
              <p className="text-sm font-bold text-gray-900">{c.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{c.count}x</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((a) => (
            <Card key={a.id} className={cn(!a.earned && 'opacity-60')}>
              <div className="flex items-start gap-3">
                <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0',
                  a.earned ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-gray-100 text-gray-400'
                )}>
                  {a.earned ? <Award className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{a.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{a.description}</p>
                  {a.earned ? (
                    <p className="text-xs text-emerald-600 font-medium mt-1">Earned on {new Date(a.earnedAt || '').toLocaleDateString()}</p>
                  ) : (
                    <div className="mt-2">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(a.progress || 0) * 100}%` }} />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">{Math.round((a.progress || 0) * 100)}% complete</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Reviews */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Recent reviews</h2>
        <div className="space-y-3">
          {recentReviews.map((r) => (
            <Card key={r.id}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold">
                    {r.customer[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{r.customer}</p>
                    <p className="text-xs text-gray-500">Order {r.orderNumber}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn('h-4 w-4', i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200')} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(r.date)}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">&quot;{r.comment}&quot;</p>
              {r.compliments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {r.compliments.map((comp) => (
                    <Badge key={comp} variant="success" size="sm">
                      <ThumbsUp className="h-3 w-3 mr-0.5" /> {comp}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
