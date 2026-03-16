import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { calculateProjection } from '@/lib/projection-calculator';
import type { IncomeSource, ExpenseCategory, ProjectionInput } from '@/lib/types';

// POST - Calculate projection on-demand
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Parse request body
    const body = await request.json();
    const {
      currentAge,
      currentNetWorth,
      expectedReturn,
      inflationRate,
      longevityAge,
    } = body;

    // Validate required fields
    if (
      currentAge === undefined ||
      currentNetWorth === undefined ||
      expectedReturn === undefined ||
      inflationRate === undefined
    ) {
      return NextResponse.json(
        {
          error: 'Missing required fields: currentAge, currentNetWorth, expectedReturn, inflationRate',
        },
        { status: 400 }
      );
    }

    // Fetch all income sources for user
    const { data: incomeSources, error: incomeError } = await supabase
      .from('income_sources')
      .select('*')
      .eq('user_id', userId);

    if (incomeError) {
      console.error('Error fetching income sources:', incomeError);
      return NextResponse.json({ error: 'Failed to fetch income sources' }, { status: 500 });
    }

    // Fetch all expense categories for user
    const { data: expenses, error: expenseError } = await supabase
      .from('expense_categories')
      .select('*')
      .eq('user_id', userId);

    if (expenseError) {
      console.error('Error fetching expenses:', expenseError);
      return NextResponse.json({ error: 'Failed to fetch expense categories' }, { status: 500 });
    }

    // Build projection input
    const input: ProjectionInput = {
      currentAge,
      currentNetWorth,
      expectedReturn,
      inflationRate,
      longevityAge,
      incomeSources: (incomeSources || []) as IncomeSource[],
      expenses: (expenses || []) as ExpenseCategory[],
    };

    // Calculate projection
    const projection = calculateProjection(input);

    return NextResponse.json({
      projection,
      metadata: {
        totalIncomeSources: incomeSources?.length || 0,
        totalExpenseCategories: expenses?.length || 0,
        projectionYears: projection.length,
      },
    });
  } catch (error) {
    console.error('Error calculating projection:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
