import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { fetchConsultingIncomeSheetData, getSheetMetadata, aggregateConsultingIncomeByYear } from '@/lib/google-sheets';

// GET: Fetch consulting income data from Google Sheet
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Get user settings to find the consulting income sheet ID
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('consulting_income_sheet_id')
      .eq('user_id', userId)
      .single();

    if (settingsError || !settings?.consulting_income_sheet_id) {
      return NextResponse.json({
        data: [],
        aggregated: [],
        hasSheet: false,
        message: 'No consulting income sheet configured',
      });
    }

    const sheetId = settings.consulting_income_sheet_id;

    // Verify the sheet is accessible
    const metadata = await getSheetMetadata(sheetId);
    if (!metadata.valid) {
      return NextResponse.json(
        { error: `Cannot access the Google Sheet: ${metadata.error || 'Unknown error'}` },
        { status: 400 }
      );
    }

    // Fetch data from Google Sheet
    const sheetData = await fetchConsultingIncomeSheetData(sheetId);

    // Aggregate by year (for the next 20 years from current year)
    const currentYear = new Date().getFullYear();
    const aggregated = aggregateConsultingIncomeByYear(sheetData, currentYear, currentYear + 20);

    // Update last sync time
    await supabase
      .from('user_settings')
      .update({
        consulting_income_last_sync_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    return NextResponse.json({
      data: sheetData,
      aggregated,
      hasSheet: true,
      sheetTitle: metadata.title,
      totalRows: sheetData.length,
    });
  } catch (error) {
    console.error('Error fetching consulting income data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch consulting income data' },
      { status: 500 }
    );
  }
}
