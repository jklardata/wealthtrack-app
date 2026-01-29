import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { generateScenarioComparison } from '@/lib/scenario-calculator';
import type { Scenario } from '@/lib/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/scenarios/[id]/compare
 *
 * Compare a scenario against the baseline (or another specified scenario)
 *
 * Body:
 * - baseline_id?: string - Optional baseline scenario ID (defaults to user's baseline)
 *
 * Returns comparison with deltas and insight text
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    const { id: compareId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { baseline_id } = body;

    const supabase = createServerSupabaseClient();

    // Fetch the comparison scenario
    const { data: compareScenario, error: compareError } = await supabase
      .from('scenarios')
      .select('*')
      .eq('id', compareId)
      .eq('user_id', userId)
      .single();

    if (compareError || !compareScenario) {
      return NextResponse.json({ error: 'Comparison scenario not found' }, { status: 404 });
    }

    // Fetch the baseline scenario
    let baselineScenario: Scenario | null = null;

    if (baseline_id) {
      // Use specified baseline
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .eq('id', baseline_id)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: 'Baseline scenario not found' }, { status: 404 });
      }
      baselineScenario = data as Scenario;
    } else {
      // Use user's default baseline
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .eq('user_id', userId)
        .eq('is_baseline', true)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: 'No baseline scenario set. Create a baseline first or specify baseline_id.' },
          { status: 400 }
        );
      }
      baselineScenario = data as Scenario;
    }

    // Can't compare to itself
    if (baselineScenario.id === compareScenario.id) {
      return NextResponse.json(
        { error: 'Cannot compare a scenario to itself' },
        { status: 400 }
      );
    }

    // Generate comparison
    const comparison = generateScenarioComparison(
      baselineScenario,
      compareScenario as Scenario
    );

    // Check if this comparison already exists
    const { data: existingComparison } = await supabase
      .from('scenario_comparisons')
      .select('id')
      .eq('baseline_scenario_id', baselineScenario.id)
      .eq('compare_scenario_id', compareScenario.id)
      .single();

    // Upsert the comparison
    const comparisonData = {
      user_id: userId,
      baseline_scenario_id: baselineScenario.id,
      compare_scenario_id: compareScenario.id,
      delta_years_to_fi: isFinite(comparison.delta_years_to_fi)
        ? comparison.delta_years_to_fi
        : null,
      delta_required_net_worth: comparison.delta_required_net_worth,
      delta_annual_expenses: comparison.delta_annual_expenses,
      delta_savings_rate: comparison.delta_savings_rate,
      delta_fi_score: comparison.delta_fi_score,
      semi_retirement_feasible: comparison.semi_retirement_feasible,
      consulting_covers_percentage: comparison.consulting_covers_percentage,
      insight_text: comparison.insight_text,
    };

    let savedComparison;
    if (existingComparison) {
      // Update existing
      const { data, error } = await supabase
        .from('scenario_comparisons')
        .update(comparisonData)
        .eq('id', existingComparison.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating comparison:', error);
      }
      savedComparison = data;
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('scenario_comparisons')
        .insert(comparisonData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error inserting comparison:', error);
      }
      savedComparison = data;
    }

    // Return the full comparison with scenario objects
    return NextResponse.json({
      data: {
        ...comparison,
        id: savedComparison?.id,
        created_at: savedComparison?.created_at,
      },
    });
  } catch (error) {
    console.error('Error comparing scenarios:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
