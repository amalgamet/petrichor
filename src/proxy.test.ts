import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server';
import { createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { describe, it, expect } from 'vitest';
import { config, PUBLIC_ROUTES } from './proxy';

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
    expect(unstable_doesMiddlewareMatch({ config, url: '/api/webhooks' })).toBe(
      true,
    );
  });

  it('does not match static files', () => {
    expect(
      unstable_doesMiddlewareMatch({ config, url: '/_next/static/chunk.js' }),
    ).toBe(false);
  });

  it('does not match image files', () => {
    expect(unstable_doesMiddlewareMatch({ config, url: '/favicon.ico' })).toBe(
      false,
    );
  });
});

describe('public route matching', () => {
  const isPublicRoute = createRouteMatcher(PUBLIC_ROUTES);
  const req = (path: string) => new NextRequest(`http://localhost:3000${path}`);

  it('marks /sign-in as public', () => {
    expect(isPublicRoute(req('/sign-in'))).toBe(true);
  });

  it('marks /sign-in sub-paths as public', () => {
    expect(isPublicRoute(req('/sign-in/sso-callback'))).toBe(true);
  });

  it('marks /api/webhooks as public', () => {
    expect(isPublicRoute(req('/api/webhooks'))).toBe(true);
  });

  it('marks /api/webhooks sub-paths as public', () => {
    expect(isPublicRoute(req('/api/webhooks/clerk'))).toBe(true);
  });

  it('does not mark / as public', () => {
    expect(isPublicRoute(req('/'))).toBe(false);
  });

  it('does not mark /weather as public', () => {
    expect(isPublicRoute(req('/weather'))).toBe(false);
  });

  it('does not mark /api/geocode as public', () => {
    expect(isPublicRoute(req('/api/geocode'))).toBe(false);
  });
});
