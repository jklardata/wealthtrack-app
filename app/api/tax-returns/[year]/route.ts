import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{ year: string }>;
}

// GET - Fetch single tax return by year
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { year } = await params;
    const taxYear = parseInt(year);

    if (isNaN(taxYear) || taxYear < 2000 || taxYear > 2030) {
      return NextResponse.json({ error: 'Invalid tax year' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('tax_returns')
      .select('*')
      .eq('user_id', userId)
      .eq('tax_year', taxYear)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Tax return not found' }, { status: 404 });
      }
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch tax return' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching tax return:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete tax return by year
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { year } = await params;
    const taxYear = parseInt(year);

    if (isNaN(taxYear) || taxYear < 2000 || taxYear > 2030) {
      return NextResponse.json({ error: 'Invalid tax year' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from('tax_returns')
      .delete()
      .eq('user_id', userId)
      .eq('tax_year', taxYear);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to delete tax return' }, { status: 500 });
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Error deleting tax return:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update tax return by year
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { year } = await params;
    const taxYear = parseInt(year);

    if (isNaN(taxYear) || taxYear < 2000 || taxYear > 2030) {
      return NextResponse.json({ error: 'Invalid tax year' }, { status: 400 });
    }

    const body = await request.json();
    const supabase = createServerSupabaseClient();

    // Remove fields that shouldn't be updated directly
    const { id, user_id, created_at, ...updateData } = body;

    const { data, error } = await supabase
      .from('tax_returns')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('tax_year', taxYear)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Tax return not found' }, { status: 404 });
      }
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to update tax return' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error updating tax return:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
