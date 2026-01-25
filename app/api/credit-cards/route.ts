import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import type { CreditCardFormData } from '@/lib/types';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('credit_cards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch credit cards' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching credit cards:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreditCardFormData = await request.json();
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('credit_cards')
      .insert({
        user_id: userId,
        card_name: body.card_name,
        last_four: body.last_four || null,
        status: body.status || 'active',
        signup_bonus: body.signup_bonus || null,
        sub_requirement: body.sub_requirement || null,
        current_spend: body.current_spend || 0,
        sub_deadline: body.sub_deadline || null,
        got_bonus: body.got_bonus || false,
        annual_fee: body.annual_fee || 0,
        signup_date: body.signup_date || null,
        annual_fee_date: body.annual_fee_date || null,
        close_date: body.close_date || null,
        notes: body.notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to create credit card' }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error creating credit card:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
