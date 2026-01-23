import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import type { NetWorthFormData } from '@/lib/types';

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
    const body: NetWorthFormData = await request.json();
    const supabase = createServerSupabaseClient();

    // First verify the entry belongs to this user
    const { data: existingEntry, error: fetchError } = await supabase
      .from('net_worth_entries')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingEntry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('net_worth_entries')
      .update({
        date: body.date,
        stocks: body.stocks || 0,
        bonds: body.bonds || 0,
        cash: body.cash || 0,
        real_estate: body.real_estate || 0,
        points_value: body.points_value || 0,
        other_assets: body.other_assets || 0,
        total_debts: body.total_debts || 0,
        notes: body.notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error updating net worth entry:', error);
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
      .from('net_worth_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting net worth entry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
