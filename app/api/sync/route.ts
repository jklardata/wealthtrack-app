import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { fetchSheetData, getSheetMetadata } from '@/lib/google-sheets';

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Get user settings to find the sheet ID
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('google_sheet_id')
      .eq('user_id', userId)
      .single();

    if (settingsError || !settings?.google_sheet_id) {
      return NextResponse.json(
        { error: 'No Google Sheet configured. Please add your Sheet ID in settings.' },
        { status: 400 }
      );
    }

    const sheetId = settings.google_sheet_id;

    // Verify the sheet is accessible
    const metadata = await getSheetMetadata(sheetId);
    if (!metadata.valid) {
      const errorMsg = metadata.error || 'Unknown error';
      // Check for common errors
      if (errorMsg.includes('API has not been used') || errorMsg.includes('sheets.googleapis.com')) {
        return NextResponse.json(
          { error: 'Google Sheets API is not enabled. Please enable it at console.cloud.google.com/apis/library/sheets.googleapis.com' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: `Cannot access the Google Sheet: ${errorMsg}` },
        { status: 400 }
      );
    }

    // Fetch data from Google Sheet
    const sheetData = await fetchSheetData(sheetId);

    if (sheetData.length === 0) {
      return NextResponse.json(
        { error: 'No data found in the Google Sheet. Make sure your data starts at row 2.' },
        { status: 400 }
      );
    }

    // Upsert each row into the database
    let synced = 0;
    let errors = 0;

    for (const row of sheetData) {
      const { error } = await supabase.from('net_worth_entries').upsert(
        {
          user_id: userId,
          date: row.date,
          stocks: row.stocks,
          bonds: row.bonds,
          cash: row.cash,
          real_estate: row.real_estate,
          points_value: row.points_value,
          other_assets: row.other_assets,
          total_debts: row.total_debts,
          notes: row.notes || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,date',
        }
      );

      if (error) {
        console.error('Error upserting row:', error);
        errors++;
      } else {
        synced++;
      }
    }

    // Update last sync time
    await supabase
      .from('user_settings')
      .update({
        last_sync_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    return NextResponse.json({
      success: true,
      synced,
      errors,
      total: sheetData.length,
      sheetTitle: metadata.title,
    });
  } catch (error) {
    console.error('Error syncing data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync data' },
      { status: 500 }
    );
  }
}
