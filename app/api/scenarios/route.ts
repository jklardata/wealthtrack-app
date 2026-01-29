import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import {
  calculateScenarioDerivedFields,
  validateScenarioInput,
} from '@/lib/scenario-calculator';
import type { ScenarioInput } from '@/lib/types';

/**
 * GET /api/scenarios
 *
 * List all scenarios for the authenticated user
 * Optionally filter by is_baseline or is_active
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Parse query params for filtering
    const { searchParams } = new URL(request.url);
    const onlyBaseline = searchParams.get('baseline') === 'true';
    const onlyActive = searchParams.get('active') === 'true';

    let query = supabase
      .from('scenarios')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (onlyBaseline) {
      query = query.eq('is_baseline', true);
    }
    if (onlyActive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch scenarios' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/scenarios
 *
 * Create a new scenario
 * Calculates all derived fields from the input
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: ScenarioInput = await request.json();

    // Validate input
    const validation = validateScenarioInput(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    // Calculate derived fields
    const scenarioData = calculateScenarioDerivedFields({
      ...body,
      user_id: userId,
    });

    const supabase = createServerSupabaseClient();

    // If this is being set as baseline, clear any existing baseline
    if (scenarioData.is_baseline) {
      await supabase
        .from('scenarios')
        .update({ is_baseline: false })
        .eq('user_id', userId)
        .eq('is_baseline', true);
    }

    // If this is being set as active, clear any existing active
    if (scenarioData.is_active) {
      await supabase
        .from('scenarios')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('is_active', true);
    }

    // Insert the scenario
    const { data, error } = await supabase
      .from('scenarios')
      .insert({
        user_id: userId,
        name: scenarioData.name,
        description: scenarioData.description,
        is_baseline: scenarioData.is_baseline,
        is_active: scenarioData.is_active,
        location_city_id: scenarioData.location_city_id,
        location_city_name: scenarioData.location_city_name,
        location_country: scenarioData.location_country,
        effective_col_index: scenarioData.effective_col_index,
        primary_income: scenarioData.primary_income,
        consulting_income: scenarioData.consulting_income,
        consulting_years: scenarioData.consulting_years,
        consulting_tax_rate: scenarioData.consulting_tax_rate,
        annual_expenses: scenarioData.annual_expenses,
        spending_weights: scenarioData.spending_weights,
        withdrawal_rate: scenarioData.withdrawal_rate,
        expected_return: scenarioData.expected_return,
        current_net_worth: scenarioData.current_net_worth,
        annual_savings: scenarioData.annual_savings,
        annual_withdrawal_requirement: scenarioData.annual_withdrawal_requirement,
        required_net_worth: scenarioData.required_net_worth,
        years_to_fi: isFinite(scenarioData.years_to_fi) ? scenarioData.years_to_fi : null,
        savings_rate: scenarioData.savings_rate,
        fi_score: scenarioData.fi_score,
        risk_tolerance: scenarioData.risk_tolerance,
        time_horizon: scenarioData.time_horizon,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to create scenario' }, { status: 500 });
    }

    return NextResponse.json(
      {
        data,
        warnings: validation.warnings.length > 0 ? validation.warnings : undefined,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating scenario:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
