import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // TODO: sync to database when one exists
    console.log(`Clerk webhook: ${evt.type} (ID: ${evt.data.id})`);

    if (evt.type === 'user.created') {
      console.log('New user:', evt.data.id, evt.data.email_addresses);
    }

    if (evt.type === 'user.updated') {
      console.log('User updated:', evt.data.id);
    }

    if (evt.type === 'user.deleted') {
      console.log('User deleted:', evt.data.id);
    }

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
