import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    return NextResponse.json({ data: data || null });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const supabase = createServerSupabaseClient();

    // Build the update object dynamically to only include provided fields
    const updateData: Record<string, unknown> = {
      user_id: userId,
      updated_at: new Date().toISOString(),
    };

    // Only update fields that are explicitly provided in the request
    if ('google_sheet_id' in body) {
      updateData.google_sheet_id = body.google_sheet_id || null;
    }
    if ('credit_cards_sheet_id' in body) {
      updateData.credit_cards_sheet_id = body.credit_cards_sheet_id || null;
    }
    if ('current_age' in body) {
      updateData.current_age = body.current_age;
    }
    if ('desired_retirement_age' in body) {
      updateData.desired_retirement_age = body.desired_retirement_age;
    }
    // New personal information fields
    if ('full_name' in body) {
      updateData.full_name = body.full_name || null;
    }
    if ('date_of_birth' in body) {
      updateData.date_of_birth = body.date_of_birth || null;
    }
    if ('marital_status' in body) {
      updateData.marital_status = body.marital_status || null;
    }
    if ('number_of_dependents' in body) {
      updateData.number_of_dependents = body.number_of_dependents;
    }
    if ('state_of_residence' in body) {
      updateData.state_of_residence = body.state_of_residence || null;
    }
    if ('tax_filing_status' in body) {
      updateData.tax_filing_status = body.tax_filing_status || null;
    }
    if ('risk_tolerance' in body) {
      updateData.risk_tolerance = body.risk_tolerance || null;
    }
    if ('life_expectancy_assumption' in body) {
      updateData.life_expectancy_assumption = body.life_expectancy_assumption;
    }
    if ('employer_name' in body) {
      updateData.employer_name = body.employer_name || null;
    }
    if ('phone_number' in body) {
      updateData.phone_number = body.phone_number || null;
    }
    if ('onboarding_completed' in body) {
      updateData.onboarding_completed = body.onboarding_completed;
    }

    // Upsert settings
    const { data, error } = await supabase
      .from('user_settings')
      .upsert(updateData, {
        onConflict: 'user_id',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
