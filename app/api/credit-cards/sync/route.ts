import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { fetchCreditCardsSheetData } from '@/lib/google-sheets';

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Get user settings to find the credit cards sheet ID
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('credit_cards_sheet_id')
      .eq('user_id', userId)
      .single();

    if (settingsError || !settings?.credit_cards_sheet_id) {
      return NextResponse.json(
        { error: 'No credit cards Google Sheet connected. Please set up a sheet in Settings.' },
        { status: 400 }
      );
    }

    // Fetch data from Google Sheets
    const sheetData = await fetchCreditCardsSheetData(settings.credit_cards_sheet_id);

    // Delete existing credit cards for this user (replace with sheet data)
    await supabase
      .from('credit_cards')
      .delete()
      .eq('user_id', userId);

    // Insert new data from sheet
    if (sheetData.length > 0) {
      const cardsToInsert = sheetData.map((row) => ({
        user_id: userId,
        card_name: row.card_name,
        last_four: row.last_four || null,
        status: row.status,
        signup_bonus: row.signup_bonus || null,
        sub_requirement: row.sub_requirement || null,
        current_spend: row.current_spend || 0,
        sub_deadline: row.sub_deadline || null,
        got_bonus: row.got_bonus,
        annual_fee: row.annual_fee || 0,
        signup_date: row.signup_date || null,
        annual_fee_date: row.annual_fee_date || null,
        close_date: row.close_date || null,
        notes: row.notes || null,
      }));

      const { error: insertError } = await supabase
        .from('credit_cards')
        .insert(cardsToInsert);

      if (insertError) {
        console.error('Error inserting credit cards:', insertError);
        return NextResponse.json(
          { error: 'Failed to save credit cards data' },
          { status: 500 }
        );
      }
    }

    // Update last sync timestamp
    await supabase
      .from('user_settings')
      .update({
        credit_cards_last_sync_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    // Fetch the newly synced cards to return
    const { data: cards, error: cardsError } = await supabase
      .from('credit_cards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (cardsError) {
      return NextResponse.json(
        { error: 'Failed to fetch synced cards' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: cards,
      syncedCount: sheetData.length,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error syncing credit cards from sheet:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync data' },
      { status: 500 }
    );
  }
}
