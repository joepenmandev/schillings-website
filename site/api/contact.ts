/**
 * Vercel Edge handler — forwards qualifying-form JSON to a **server-side** webhook (Zapier, Make, etc.).
 * Set `CONTACT_WEBHOOK_URL` in the Vercel project; never expose that URL in the browser.
 *
 * Optional **global** rate limit: set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (Vercel
 * integration or Upstash console). If unset, falls back to per-isolate in-memory limiting.
 *
 * Client: set `PUBLIC_FORM_ENDPOINT=/api/contact` (same-origin).
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const config = { runtime: 'edge' };

/** Max JSON body size (characters); qualifying form payloads are far smaller. */
const MAX_BODY_CHARS = 32_768;

const rateByIp = new Map<string, { minute: number; count: number }>();

let upstashRatelimit: Ratelimit | null | undefined;

type Payload = {
  locale?: string;
  matter?: string;
  region?: string;
  budget?: string;
  urgency?: string;
  fullName?: string;
  email?: string;
  organisation?: string;
  phone?: string;
  submittedAt?: string;
  company_website?: string;
};

function json(data: unknown, status: number, headers?: Record<string, string>) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...headers,
    },
  });
}

function clientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const cf = request.headers.get('cf-connecting-ip');
  if (cf?.trim()) return cf.trim();
  return 'unknown';
}

/** Max POSTs per IP per clock minute (in-memory path). Override in tests via `CONTACT_RATE_LIMIT_MAX`. */
function rateLimitMax(): number {
  const raw = process.env.CONTACT_RATE_LIMIT_MAX;
  if (raw == null || raw === '') return 30;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? Math.min(n, 500) : 30;
}

function getUpstashRatelimit(): Ratelimit | null {
  if (upstashRatelimit !== undefined) return upstashRatelimit;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url?.trim() || !token?.trim()) {
    upstashRatelimit = null;
    return null;
  }
  try {
    const redis = Redis.fromEnv();
    const n = Math.min(Math.max(rateLimitMax(), 1), 200);
    upstashRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(n, '1 m'),
      prefix: 'ratelimit/contact',
    });
    return upstashRatelimit;
  } catch {
    upstashRatelimit = null;
    return null;
  }
}

function consumeRateLimit(request: Request): Response | null {
  const max = rateLimitMax();
  const ip = clientIp(request);
  const minute = Math.floor(Date.now() / 60_000);
  let slot = rateByIp.get(ip);
  if (!slot || slot.minute !== minute) {
    slot = { minute, count: 0 };
    rateByIp.set(ip, slot);
  }
  slot.count += 1;
  if (slot.count > max) {
    return json({ error: 'Too many requests' }, 429, { 'retry-after': '60' });
  }
  if (rateByIp.size > 5000) {
    for (const [k, v] of rateByIp) {
      if (v.minute < minute - 1) rateByIp.delete(k);
    }
  }
  return null;
}

async function applyRateLimit(request: Request): Promise<Response | null> {
  const rl = getUpstashRatelimit();
  if (rl) {
    try {
      const { success } = await rl.limit(clientIp(request));
      if (!success) {
        return json({ error: 'Too many requests' }, 429, { 'retry-after': '60' });
      }
      return null;
    } catch {
      return consumeRateLimit(request);
    }
  }
  return consumeRateLimit(request);
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const lenHdr = request.headers.get('content-length');
  if (lenHdr) {
    const n = parseInt(lenHdr, 10);
    if (Number.isFinite(n) && n > MAX_BODY_CHARS) {
      return json({ error: 'Payload too large' }, 413);
    }
  }

  const rateResponse = await applyRateLimit(request);
  if (rateResponse) return rateResponse;

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    return json({ error: 'Server not configured: set CONTACT_WEBHOOK_URL on the deployment.' }, 503);
  }

  let text: string;
  try {
    text = await request.text();
  } catch {
    return json({ error: 'Invalid body' }, 400);
  }
  if (text.length > MAX_BODY_CHARS) {
    return json({ error: 'Payload too large' }, 413);
  }

  let body: Payload;
  try {
    body = JSON.parse(text) as Payload;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  if (body.company_website && String(body.company_website).trim()) {
    return json({ ok: true }, 200);
  }

  const email = (body.email ?? '').trim();
  const fullName = (body.fullName ?? '').trim();
  if (fullName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Invalid name or email' }, 400);
  }

  const allowedMatter = new Set([
    'reputation',
    'privacy',
    'litigation',
    'platform',
    'intelligence',
    'security',
    'other',
  ]);
  if (!body.matter || !allowedMatter.has(body.matter)) {
    return json({ error: 'Invalid matter' }, 400);
  }

  const allowedRegion = new Set(['uk', 'us', 'ie', 'other']);
  if (!body.region || !allowedRegion.has(body.region)) {
    return json({ error: 'Invalid region' }, 400);
  }

  const allowedBudget = new Set(['under', '25-75', '75-150', '150plus', 'unknown']);
  if (!body.budget || !allowedBudget.has(body.budget)) {
    return json({ error: 'Invalid budget' }, 400);
  }

  const allowedUrgency = new Set(['immediate', 'week', 'month', 'planning']);
  if (!body.urgency || !allowedUrgency.has(body.urgency)) {
    return json({ error: 'Invalid urgency' }, 400);
  }

  const forward = await fetch(webhook, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!forward.ok) {
    const textErr = await forward.text().catch(() => '');
    return json(
      { error: 'Upstream rejected the submission', detail: textErr.slice(0, 200) },
      502,
    );
  }

  return json({ ok: true }, 200);
}
