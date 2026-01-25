import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import type { CreditCardFormData } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('credit_cards')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Credit card not found' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching credit card:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body: CreditCardFormData = await request.json();
    const supabase = createServerSupabaseClient();

    // First verify the card belongs to this user
    const { data: existingCard, error: fetchError } = await supabase
      .from('credit_cards')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingCard) {
      return NextResponse.json({ error: 'Credit card not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('credit_cards')
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to update credit card' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error updating credit card:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from('credit_cards')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to delete credit card' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting credit card:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
