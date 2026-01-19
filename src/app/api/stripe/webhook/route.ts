// src/app/api/stripe/webhook/route.ts
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const schoolId = session.metadata?.schoolId;
    if (!schoolId) {
      return new NextResponse('Webhook Error: Missing schoolId in metadata', { status: 400 });
    }

    try {
      // Dynamically import the admin client factory (lazy)
      const adminModule = await import('@/utils/supabase/admin');
      const supabaseAdmin = adminModule.createAdminClient();

      const { error } = await supabaseAdmin
        .from('driving_school')
        .update({ is_premium: true })
        .eq('id', schoolId);

      if (error) {
        console.error('Error updating school to premium:', error);
        return new NextResponse('Webhook Error: Could not update school status', { status: 500 });
      }
    } catch (err: any) {
      console.error('Admin client error or env not set:', err?.message || err);
      return new NextResponse('Server misconfigured for admin actions', { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
