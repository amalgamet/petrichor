import { Suspense } from 'react';
import { SignInContent } from './sign-in-content';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="h-96 w-96 animate-pulse rounded-lg bg-muted" />
        }
      >
        <SignInContent />
      </Suspense>
    </div>
  );
}
