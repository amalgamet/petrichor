'use client';

import dynamic from 'next/dynamic';

export const UserButton = dynamic(
  () => import('@clerk/nextjs').then((mod) => mod.UserButton),
  {
    ssr: false,
    loading: () => (
      <div className="h-7 w-7 rounded-full bg-muted animate-pulse" />
    ),
  },
);
