import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('api/contact handler', () => {
  const originalEnv = process.env.CONTACT_WEBHOOK_URL;
  const originalRate = process.env.CONTACT_RATE_LIMIT_MAX;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env.CONTACT_WEBHOOK_URL = 'https://hooks.example.test/inbound';
    delete process.env.CONTACT_RATE_LIMIT_MAX;
    globalThis.fetch = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }));
  });

  afterEach(() => {
    if (originalEnv === undefined) delete process.env.CONTACT_WEBHOOK_URL;
    else process.env.CONTACT_WEBHOOK_URL = originalEnv;
    if (originalRate === undefined) delete process.env.CONTACT_RATE_LIMIT_MAX;
    else process.env.CONTACT_RATE_LIMIT_MAX = originalRate;
    globalThis.fetch = originalFetch;
  });

  async function post(body: unknown, init?: { headers?: Record<string, string> }) {
    const { default: handler } = await import('./contact');
    return handler(
      new Request('https://schillingspartners.com/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...init?.headers },
        body: JSON.stringify(body),
      }),
    );
  }

  it('returns 405 for GET', async () => {
    const { default: handler } = await import('./contact');
    const res = await handler(new Request('https://example.com/api/contact', { method: 'GET' }));
    expect(res.status).toBe(405);
  });

  it('returns 413 when JSON body is too large', async () => {
    const { default: handler } = await import('./contact');
    const body = JSON.stringify({ pad: 'x'.repeat(40_000) });
    const res = await handler(
      new Request('https://example.com/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
      }),
    );
    expect(res.status).toBe(413);
  });

  it('returns 429 after rate limit per IP', async () => {
    process.env.CONTACT_RATE_LIMIT_MAX = '2';
    const headers = { 'x-forwarded-for': '203.0.113.50' };
    const payload = {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      matter: 'privacy' as const,
      region: 'uk' as const,
      budget: '25-75' as const,
      urgency: 'week' as const,
    };
    expect((await post(payload, { headers })).status).toBe(200);
    expect((await post(payload, { headers })).status).toBe(200);
    expect((await post(payload, { headers })).status).toBe(429);
  });

  it('returns 400 for invalid JSON', async () => {
    const { default: handler } = await import('./contact');
    const res = await handler(
      new Request('https://example.com/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: 'not-json{',
      }),
    );
    expect(res.status).toBe(400);
  });

  it('returns 503 when CONTACT_WEBHOOK_URL is unset', async () => {
    delete process.env.CONTACT_WEBHOOK_URL;
    const { default: handler } = await import('./contact');
    const res = await handler(
      new Request('https://example.com/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      }),
    );
    expect(res.status).toBe(503);
  });

  it('returns 200 for honeypot fill without forwarding', async () => {
    const res = await post({
      company_website: 'https://spam.test',
      email: 'a@b.co',
      fullName: 'Bot',
      matter: 'other',
      region: 'uk',
      budget: 'unknown',
      urgency: 'planning',
    });
    expect(res.status).toBe(200);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('returns 400 for invalid email', async () => {
    const res = await post({
      fullName: 'Valid Name',
      email: 'not-an-email',
      matter: 'privacy',
      region: 'uk',
      budget: '25-75',
      urgency: 'week',
    });
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid matter enum', async () => {
    const res = await post({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      matter: 'nope',
      region: 'uk',
      budget: '25-75',
      urgency: 'week',
    });
    expect(res.status).toBe(400);
  });

  it('forwards valid payload to webhook', async () => {
    const res = await post({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      matter: 'privacy',
      region: 'ie',
      budget: '150plus',
      urgency: 'immediate',
      locale: 'en-ie',
    });
    expect(res.status).toBe(200);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    const [, init] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.method).toBe('POST');
    const forwarded = JSON.parse(init.body as string);
    expect(forwarded.email).toBe('jane@example.com');
    expect(forwarded.matter).toBe('privacy');
  });

  it('returns 502 when webhook rejects', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response('upstream error', { status: 500 }),
    );
    const res = await post({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      matter: 'litigation',
      region: 'uk',
      budget: '75-150',
      urgency: 'month',
    });
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error).toBe('Upstream rejected the submission');
  });
});
