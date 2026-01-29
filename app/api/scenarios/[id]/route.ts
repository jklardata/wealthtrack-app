import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import {
  calculateScenarioDerivedFields,
  validateScenarioInput,
  cloneScenario,
} from '@/lib/scenario-calculator';
import type { ScenarioInput, Scenario } from '@/lib/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/scenarios/[id]
 *
 * Get a single scenario by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('scenarios')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
      }
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch scenario' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching scenario:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/scenarios/[id]
 *
 * Update a scenario (full replacement)
 * Recalculates all derived fields
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    const { id } = await params;

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
      id,
    });

    const supabase = createServerSupabaseClient();

    // Verify ownership
    const { data: existing } = await supabase
      .from('scenarios')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
    }

    // If setting as baseline, clear any existing
    if (scenarioData.is_baseline) {
      await supabase
        .from('scenarios')
        .update({ is_baseline: false })
        .eq('user_id', userId)
        .eq('is_baseline', true)
        .neq('id', id);
    }

    // If setting as active, clear any existing
    if (scenarioData.is_active) {
      await supabase
        .from('scenarios')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('is_active', true)
        .neq('id', id);
    }

    // Update the scenario
    const { data, error } = await supabase
      .from('scenarios')
      .update({
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
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to update scenario' }, { status: 500 });
    }

    return NextResponse.json({
      data,
      warnings: validation.warnings.length > 0 ? validation.warnings : undefined,
    });
  } catch (error) {
    console.error('Error updating scenario:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/scenarios/[id]
 *
 * Delete a scenario
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from('scenarios')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to delete scenario' }, { status: 500 });
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Error deleting scenario:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/scenarios/[id]
 *
 * Partial update or special actions:
 * - action: 'set-baseline' - Set this scenario as baseline
 * - action: 'set-active' - Set this scenario as active
 * - action: 'clone' - Clone this scenario with a new name
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, ...updates } = body;

    const supabase = createServerSupabaseClient();

    // Fetch the existing scenario
    const { data: existing, error: fetchError } = await supabase
      .from('scenarios')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
    }

    // Handle special actions
    if (action === 'set-baseline') {
      // Clear existing baseline
      await supabase
        .from('scenarios')
        .update({ is_baseline: false })
        .eq('user_id', userId)
        .eq('is_baseline', true);

      // Set this as baseline
      const { data, error } = await supabase
        .from('scenarios')
        .update({ is_baseline: true })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: 'Failed to set baseline' }, { status: 500 });
      }

      // Also update user_settings
      await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          baseline_scenario_id: id,
        }, { onConflict: 'user_id' });

      return NextResponse.json({ data });
    }

    if (action === 'set-active') {
      // Clear existing active
      await supabase
        .from('scenarios')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('is_active', true);

      // Set this as active
      const { data, error } = await supabase
        .from('scenarios')
        .update({ is_active: true })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: 'Failed to set active' }, { status: 500 });
      }

      // Also update user_settings
      await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          active_scenario_id: id,
        }, { onConflict: 'user_id' });

      return NextResponse.json({ data });
    }

    if (action === 'clone') {
      const newName = updates.name || `${existing.name} (Copy)`;
      const clonedInput = cloneScenario(existing as Scenario, newName, updates);
      const clonedData = calculateScenarioDerivedFields(clonedInput);

      const { data, error } = await supabase
        .from('scenarios')
        .insert({
          ...clonedData,
          cloned_from_id: id,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: 'Failed to clone scenario' }, { status: 500 });
      }

      return NextResponse.json({ data }, { status: 201 });
    }

    // Regular partial update (recalculate derived fields)
    const mergedInput: ScenarioInput = {
      name: updates.name ?? existing.name,
      description: updates.description ?? existing.description,
      is_baseline: updates.is_baseline ?? existing.is_baseline,
      is_active: updates.is_active ?? existing.is_active,
      location_city_id: updates.location_city_id ?? existing.location_city_id,
      location_city_name: updates.location_city_name ?? existing.location_city_name,
      location_country: updates.location_country ?? existing.location_country,
      primary_income: updates.primary_income ?? existing.primary_income,
      consulting_income: updates.consulting_income ?? existing.consulting_income,
      consulting_years: updates.consulting_years ?? existing.consulting_years,
      consulting_tax_rate: updates.consulting_tax_rate ?? existing.consulting_tax_rate,
      annual_expenses: updates.annual_expenses ?? existing.annual_expenses,
      spending_weights: updates.spending_weights ?? existing.spending_weights,
      withdrawal_rate: updates.withdrawal_rate ?? existing.withdrawal_rate,
      expected_return: updates.expected_return ?? existing.expected_return,
      current_net_worth: updates.current_net_worth ?? existing.current_net_worth,
      annual_savings: updates.annual_savings ?? existing.annual_savings,
      risk_tolerance: updates.risk_tolerance ?? existing.risk_tolerance,
      time_horizon: updates.time_horizon ?? existing.time_horizon,
    };

    const scenarioData = calculateScenarioDerivedFields({
      ...mergedInput,
      user_id: userId,
      id,
    });

    const { data, error } = await supabase
      .from('scenarios')
      .update({
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
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to update scenario' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error patching scenario:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
