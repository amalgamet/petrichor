import { NextRequest } from 'next/server';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from './route';

vi.mock('@clerk/nextjs/webhooks', () => ({
  verifyWebhook: vi.fn(),
}));

const mockVerify = vi.mocked(verifyWebhook);

type WebhookEvent = Awaited<ReturnType<typeof verifyWebhook>>;

function mockEvent(type: string, data: Record<string, unknown>) {
  mockVerify.mockResolvedValue({ type, data } as unknown as WebhookEvent);
}

function makeRequest() {
  return new NextRequest('http://localhost:3000/api/webhooks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
}

describe('POST /api/webhooks', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it('returns 200 for a verified webhook', async () => {
    mockEvent('user.updated', { id: 'user_123' });

    const response = await POST(makeRequest());

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('Webhook received');
  });

  it('logs user ID and emails for user.created events', async () => {
    const emails = [{ email_address: 'test@example.com' }];
    mockEvent('user.created', { id: 'user_abc', email_addresses: emails });

    await POST(makeRequest());

    expect(logSpy).toHaveBeenCalledWith('New user:', 'user_abc', emails);
  });

  it('logs user ID for user.updated events', async () => {
    mockEvent('user.updated', { id: 'user_456' });

    await POST(makeRequest());

    expect(logSpy).toHaveBeenCalledWith('User updated:', 'user_456');
  });

  it('logs user ID for user.deleted events', async () => {
    mockEvent('user.deleted', { id: 'user_789' });

    await POST(makeRequest());

    expect(logSpy).toHaveBeenCalledWith('User deleted:', 'user_789');
  });

  it('returns 400 and logs error when verification fails', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockVerify.mockRejectedValue(new Error('Invalid signature'));

    const response = await POST(makeRequest());

    expect(response.status).toBe(400);
    expect(errorSpy).toHaveBeenCalledWith(
      'Webhook verification failed:',
      expect.any(Error),
    );
    errorSpy.mockRestore();
  });
});
