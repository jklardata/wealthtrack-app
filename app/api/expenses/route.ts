import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import type { ExpenseCategory } from '@/lib/types';

// GET - Fetch all expense categories for authenticated user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Check Pro status
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('entitlement_tier')
      .eq('user_id', userId)
      .single();

    if (subscription?.entitlement_tier === 'free') {
      return NextResponse.json({ error: 'Pro feature required' }, { status: 403 });
    }

    // Fetch all expense categories
    const { data, error } = await supabase
      .from('expense_categories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch expense categories' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching expense categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new expense category
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Check Pro status
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('entitlement_tier')
      .eq('user_id', userId)
      .single();

    if (subscription?.entitlement_tier === 'free') {
      return NextResponse.json({ error: 'Pro feature required' }, { status: 403 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.category_type || !body.name || body.monthly_amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: category_type, name, monthly_amount' },
        { status: 400 }
      );
    }

    // Insert with user_id
    const { data, error } = await supabase
      .from('expense_categories')
      .insert({
        user_id: userId,
        category_type: body.category_type,
        name: body.name,
        monthly_amount: body.monthly_amount,
        start_age_months: body.start_age_months || null,
        end_age_months: body.end_age_months || null,
        notes: body.notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to create expense category' }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error creating expense category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
