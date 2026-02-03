import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// PUT - Update income source
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const supabase = createServerSupabaseClient();

    // Update with user_id check
    const { data, error } = await supabase
      .from('income_sources')
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to update income source' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Income source not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error updating income source:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete income source
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const supabase = createServerSupabaseClient();

    // Delete with user_id check
    const { error } = await supabase
      .from('income_sources')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to delete income source' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting income source:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
