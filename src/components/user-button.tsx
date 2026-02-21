'use client';

import dynamic from 'next/dynamic';

export const UserButton = dynamic(
  () => import('@clerk/nextjs').then((mod) => mod.UserButton),
  { ssr: false },
);
