// Rate limiting for API routes
// Uses in-memory store for dev, Redis for production

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
  windowMs: number;     // Time window in milliseconds
  maxRequests: number;  // Max requests per window
  keyPrefix?: string;   // Prefix for identifying the limiter
}

const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  api: { windowMs: 60_000, maxRequests: 100 },        // 100 req/min for general API
  search: { windowMs: 60_000, maxRequests: 30 },       // 30 req/min for search
  auth: { windowMs: 300_000, maxRequests: 10 },        // 10 req/5min for auth
  upload: { windowMs: 60_000, maxRequests: 10 },       // 10 req/min for uploads
  webhook: { windowMs: 60_000, maxRequests: 200 },     // 200 req/min for webhooks
  orders: { windowMs: 60_000, maxRequests: 20 },       // 20 req/min for order creation
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

export function rateLimit(
  identifier: string,
  configName: string = 'api'
): RateLimitResult {
  const config = DEFAULT_CONFIGS[configName] || DEFAULT_CONFIGS.api;
  const key = `${config.keyPrefix || configName}:${identifier}`;
  const now = Date.now();

  // Clean expired entries periodically
  if (Math.random() < 0.01) {
    for (const [k, v] of store.entries()) {
      if (v.resetAt < now) store.delete(k);
    }
  }

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // New window
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    store.set(key, newEntry);
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: newEntry.resetAt,
      limit: config.maxRequests,
    };
  }

  // Existing window
  entry.count++;
  const allowed = entry.count <= config.maxRequests;

  return {
    allowed,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetAt: entry.resetAt,
    limit: config.maxRequests,
  };
}

// ---- Helper to get client IP ----
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real;
  return '127.0.0.1';
}

// ---- Rate limit headers ----
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetAt.toString(),
  };
}
