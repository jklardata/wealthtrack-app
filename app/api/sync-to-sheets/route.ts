import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { google } from 'googleapis';

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
        { error: 'No Google Sheet configured. Please create a sheet first.' },
        { status: 400 }
      );
    }

    const sheetId = settings.google_sheet_id;

    // Fetch net worth entries from database
    const { data: entries, error: entriesError } = await supabase
      .from('net_worth_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });

    if (entriesError) {
      return NextResponse.json(
        { error: 'Failed to fetch net worth entries' },
        { status: 500 }
      );
    }

    if (!entries || entries.length === 0) {
      return NextResponse.json(
        { error: 'No net worth entries to sync' },
        { status: 400 }
      );
    }

    // Initialize Google Sheets API
    const googleAuth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth: googleAuth });

    // Prepare data rows
    const rows = entries.map((entry) => [
      entry.date,
      entry.stocks || 0,
      entry.bonds || 0,
      entry.cash || 0,
      entry.real_estate || 0,
      entry.points_value || 0,
      entry.commodities || 0,
      entry.other_assets || 0,
      entry.total_debts || 0,
      entry.pre_tax_income || 0,
      entry.monthly_expenses || 0,
      entry.notes || '',
    ]);

    // Clear existing data (except header row)
    await sheets.spreadsheets.values.clear({
      spreadsheetId: sheetId,
      range: 'A2:L',
    });

    // Write new data
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'A2',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rows,
      },
    });

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
      synced: entries.length,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}`,
    });
  } catch (error) {
    console.error('Error syncing to sheets:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync data' },
      { status: 500 }
    );
  }
}
