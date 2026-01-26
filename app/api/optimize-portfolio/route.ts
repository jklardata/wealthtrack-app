import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { optimizePortfolio, calculateRiskScore, RISK_QUESTIONS } from '@/lib/portfolio-optimizer';
import type { RiskTolerance, OptimizationRequest } from '@/lib/types';

// GET - Get latest optimization or risk questions
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Return risk questionnaire
    if (action === 'questions') {
      return NextResponse.json({ questions: RISK_QUESTIONS });
    }

    const supabase = createServerSupabaseClient();

    // Get latest optimization
    const { data: optimization, error: optimizationError } = await supabase
      .from('portfolio_optimizations')
      .select('*')
      .eq('user_id', userId)
      .order('run_date', { ascending: false })
      .limit(1)
      .single();

    if (optimizationError && optimizationError.code !== 'PGRST116') {
      console.error('Error fetching optimization:', optimizationError);
      return NextResponse.json({ error: 'Failed to fetch optimization' }, { status: 500 });
    }

    // Get user settings for risk tolerance
    const { data: settings } = await supabase
      .from('user_settings')
      .select('risk_tolerance, risk_score, time_horizon')
      .eq('user_id', userId)
      .single();

    return NextResponse.json({
      optimization: optimization || null,
      settings: settings || null,
    });
  } catch (error) {
    console.error('Error in optimize-portfolio GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Run optimization or save risk assessment
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const supabase = createServerSupabaseClient();

    // Handle risk assessment submission
    if (body.action === 'assess_risk') {
      const { answers } = body;

      if (!answers || !Array.isArray(answers)) {
        return NextResponse.json({ error: 'Invalid answers' }, { status: 400 });
      }

      const result = calculateRiskScore(answers);

      // Save to user settings
      await supabase
        .from('user_settings')
        .upsert(
          {
            user_id: userId,
            risk_tolerance: result.tolerance,
            risk_score: result.score,
            time_horizon: result.timeHorizon,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      return NextResponse.json({
        success: true,
        result,
      });
    }

    // Handle portfolio optimization
    const {
      risk_tolerance,
      time_horizon,
      constraints,
    } = body as OptimizationRequest;

    if (!risk_tolerance || !time_horizon) {
      return NextResponse.json(
        { error: 'Risk tolerance and time horizon are required' },
        { status: 400 }
      );
    }

    // Get latest net worth entry
    const { data: netWorthEntry, error: netWorthError } = await supabase
      .from('net_worth_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (netWorthError || !netWorthEntry) {
      return NextResponse.json(
        { error: 'No net worth data found. Please add at least one entry first.' },
        { status: 400 }
      );
    }

    // Run optimization
    const result = optimizePortfolio(
      {
        stocks: netWorthEntry.stocks || 0,
        bonds: netWorthEntry.bonds || 0,
        cash: netWorthEntry.cash || 0,
        real_estate: netWorthEntry.real_estate || 0,
        other_assets: netWorthEntry.other_assets || 0,
      },
      risk_tolerance as RiskTolerance,
      time_horizon,
      constraints
    );

    // Save optimization result
    const { data: savedOptimization, error: saveError } = await supabase
      .from('portfolio_optimizations')
      .insert({
        user_id: userId,
        risk_tolerance,
        time_horizon,
        current_allocation: result.current_allocation,
        recommended_allocation: result.recommended_allocation,
        expected_return: result.expected_return,
        expected_volatility: result.expected_volatility,
        sharpe_ratio: result.sharpe_ratio,
        rebalancing_trades: result.rebalancing_trades,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving optimization:', saveError);
      // Still return the result even if save fails
    }

    return NextResponse.json({
      success: true,
      optimization: savedOptimization || result,
      result,
    });
  } catch (error) {
    console.error('Error in optimize-portfolio POST:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Mark optimization as applied
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { optimization_id } = await request.json();

    if (!optimization_id) {
      return NextResponse.json({ error: 'Optimization ID required' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('portfolio_optimizations')
      .update({
        applied: true,
        applied_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', optimization_id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating optimization:', error);
      return NextResponse.json({ error: 'Failed to update optimization' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in optimize-portfolio PATCH:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
