import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import type { NetWorthFormData } from '@/lib/types';

// DELETE - Bulk delete entries
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No entry IDs provided' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from('net_worth_entries')
      .delete()
      .eq('user_id', userId)
      .in('id', ids);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to delete entries' }, { status: 500 });
    }

    return NextResponse.json({ deleted: ids.length });
  } catch (error) {
    console.error('Error deleting net worth entries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('net_worth_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching net worth entries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: NetWorthFormData = await request.json();
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('net_worth_entries')
      .insert({
        user_id: userId,
        date: body.date,
        stocks: body.stocks || 0,
        bonds: body.bonds || 0,
        cash: body.cash || 0,
        real_estate: body.real_estate || 0,
        points_value: body.points_value || 0,
        other_assets: body.other_assets || 0,
        total_debts: body.total_debts || 0,
        notes: body.notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Entry for this date already exists' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error creating net worth entry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
