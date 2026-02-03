import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// PUT - Update expense category
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
      .from('expense_categories')
      .update({
        category_type: body.category_type,
        name: body.name,
        monthly_amount: body.monthly_amount,
        start_age_months: body.start_age_months || null,
        end_age_months: body.end_age_months || null,
        notes: body.notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to update expense category' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Expense category not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error updating expense category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete expense category
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
      .from('expense_categories')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to delete expense category' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting expense category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
