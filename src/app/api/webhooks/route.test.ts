import { NextRequest } from 'next/server';
import { describe, it, expect, vi } from 'vitest';
import { POST } from './route';

describe('POST /api/webhooks', () => {
  it('exports a POST handler', () => {
    expect(POST).toBeDefined();
    expect(typeof POST).toBe('function');
  });

  it('returns 400 and logs error for requests with invalid webhook signature', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const request = new NextRequest('http://localhost:3000/api/webhooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'user.created', data: {} }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    expect(errorSpy).toHaveBeenCalledWith(
      'Webhook verification failed:',
      expect.any(Error),
    );

    errorSpy.mockRestore();
  });
});
