import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server';
import { describe, it, expect } from 'vitest';
import { config } from './proxy';

describe('proxy route matching', () => {
  it('matches the home page', () => {
    expect(unstable_doesMiddlewareMatch({ config, url: '/' })).toBe(true);
  });

  it('matches the weather page', () => {
    expect(
      unstable_doesMiddlewareMatch({ config, url: '/weather?lat=40&lon=-74' }),
    ).toBe(true);
  });

  it('matches API routes', () => {
    expect(
      unstable_doesMiddlewareMatch({ config, url: '/api/geocode?q=denver' }),
    ).toBe(true);
  });

  it('matches the webhook route', () => {
    expect(
      unstable_doesMiddlewareMatch({ config, url: '/api/webhooks' }),
    ).toBe(true);
  });

  it('does not match static files', () => {
    expect(
      unstable_doesMiddlewareMatch({ config, url: '/_next/static/chunk.js' }),
    ).toBe(false);
  });

  it('does not match image files', () => {
    expect(
      unstable_doesMiddlewareMatch({ config, url: '/favicon.ico' }),
    ).toBe(false);
  });
});
