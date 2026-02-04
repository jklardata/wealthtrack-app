import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import type { IncomeSource } from '@/lib/types';

// GET - Fetch all income sources for authenticated user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Fetch all income sources
    const { data, error } = await supabase
      .from('income_sources')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch income sources' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching income sources:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new income source
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const body = await request.json();

    // Validate required fields
    if (!body.source_type || !body.name || body.annual_amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: source_type, name, annual_amount' },
        { status: 400 }
      );
    }

    // Insert with user_id
    const { data, error } = await supabase
      .from('income_sources')
      .insert({
        user_id: userId,
        source_type: body.source_type,
        name: body.name,
        annual_amount: body.annual_amount,
        start_age_months: body.start_age_months || null,
        stop_age_months: body.stop_age_months || null,
        growth_rate: body.growth_rate || null,
        pretax_deductions: body.pretax_deductions || 0,
        claiming_age_months: body.claiming_age_months || null,
        auto_estimate: body.auto_estimate || false,
        estimated_benefit: body.estimated_benefit || null,
        windfall_year: body.windfall_year || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to create income source' }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error creating income source:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
