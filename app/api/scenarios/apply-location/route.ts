import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { CITIES } from '@/lib/col-data';
import {
  calculateScenarioDerivedFields,
  calculateAdjustedExpensesForCity,
} from '@/lib/scenario-calculator';
import { calculateEffectiveCOL } from '@/lib/retirement-calculator';

/**
 * POST /api/scenarios/apply-location
 *
 * Creates a new scenario from Geographic Arbitrage city selection.
 * This is the primary "bridge" between Geo-Arbitrage and Retirement Calculator.
 *
 * Body:
 * - city_id: string - Target city ID
 * - baseline_city_id?: string - Baseline city for COL comparison (defaults to 'nyc')
 * - baseline_annual_spend: number - Current annual spending in baseline city
 * - gross_income: number - Annual gross income
 * - current_net_worth: number - Current portfolio value
 * - consulting_income?: number - Optional consulting income
 * - consulting_years?: number - Optional consulting bridge years
 * - set_as_active?: boolean - Set this scenario as active (default true)
 *
 * Returns the created scenario with all derived fields
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      city_id,
      baseline_city_id = 'nyc',
      baseline_annual_spend,
      gross_income,
      current_net_worth,
      consulting_income = 0,
      consulting_years = 0,
      consulting_tax_rate = 0.25,
      withdrawal_rate = 0.04,
      expected_return = 0.05,
      spending_weights,
      set_as_active = true,
    } = body;

    // Validate required fields
    if (!city_id) {
      return NextResponse.json({ error: 'city_id is required' }, { status: 400 });
    }
    if (baseline_annual_spend === undefined || baseline_annual_spend < 0) {
      return NextResponse.json({ error: 'baseline_annual_spend is required' }, { status: 400 });
    }
    if (gross_income === undefined || gross_income < 0) {
      return NextResponse.json({ error: 'gross_income is required' }, { status: 400 });
    }
    if (current_net_worth === undefined) {
      return NextResponse.json({ error: 'current_net_worth is required' }, { status: 400 });
    }

    // Find city data
    const targetCity = CITIES.find((c) => c.city_id === city_id);
    if (!targetCity) {
      return NextResponse.json({ error: `City not found: ${city_id}` }, { status: 400 });
    }

    const baselineCity = CITIES.find((c) => c.city_id === baseline_city_id);
    if (!baselineCity) {
      return NextResponse.json({ error: `Baseline city not found: ${baseline_city_id}` }, { status: 400 });
    }

    // Calculate effective COL for both cities
    const weights = spending_weights || undefined;
    const baselineCOL = calculateEffectiveCOL(baselineCity, weights);
    const targetCOL = calculateEffectiveCOL(targetCity, weights);

    // Calculate adjusted expenses for target city
    const adjustedExpenses = calculateAdjustedExpensesForCity(
      baseline_annual_spend,
      baselineCOL,
      targetCOL
    );

    // Calculate annual savings (income - adjusted expenses)
    const annualSavings = Math.max(0, gross_income - adjustedExpenses);

    const supabase = createServerSupabaseClient();

    // If setting as active, clear any existing active scenario
    if (set_as_active) {
      await supabase
        .from('scenarios')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('is_active', true);
    }

    // Create the scenario
    const scenarioInput = {
      user_id: userId,
      name: `${targetCity.city_name} Plan`,
      description: `Created from Geographic Arbitrage analysis. Based on ${baseline_annual_spend.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}/year spending in ${baselineCity.city_name}.`,
      is_baseline: false,
      is_active: set_as_active,

      location_city_id: city_id,
      location_city_name: targetCity.city_name,
      location_country: targetCity.country,

      primary_income: gross_income,
      consulting_income,
      consulting_years,
      consulting_tax_rate,

      annual_expenses: adjustedExpenses,
      spending_weights: weights,

      withdrawal_rate,
      expected_return,
      current_net_worth,
      annual_savings: annualSavings,
    };

    // Calculate all derived fields
    const scenarioData = calculateScenarioDerivedFields(scenarioInput);

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

    // Update user_settings if set as active
    if (set_as_active && data) {
      await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          active_scenario_id: data.id,
        }, { onConflict: 'user_id' });
    }

    // Return with context about the COL adjustment
    return NextResponse.json({
      data,
      context: {
        baseline_city: baselineCity.city_name,
        baseline_col: baselineCOL,
        target_city: targetCity.city_name,
        target_col: targetCOL,
        col_ratio: targetCOL / baselineCOL,
        expense_adjustment: adjustedExpenses - baseline_annual_spend,
        expense_adjustment_percent: ((targetCOL / baselineCOL) - 1) * 100,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error applying location:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
