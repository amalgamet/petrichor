import { SignIn } from '@clerk/nextjs';
import { connection } from 'next/server';

export async function SignInContent() {
  await connection();

  return <SignIn />;
}
