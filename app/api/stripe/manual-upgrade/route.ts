import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// TEMPORARY: Manual upgrade endpoint for testing
// This bypasses Stripe and directly upgrades the user to Pro
export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Update or insert subscription record
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('subscriptions')
        .update({
          entitlement_tier: 'pro',
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating subscription:', error);
        return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          entitlement_tier: 'pro',
          status: 'active',
        });

      if (error) {
        console.error('Error creating subscription:', error);
        return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Manually upgraded to Pro (test mode)',
    });
  } catch (error) {
    console.error('Error in manual upgrade:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to upgrade'
    }, { status: 500 });
  }
}
