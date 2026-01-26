import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { createCreditCardsTemplateSpreadsheet } from '@/lib/google-sheets';

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user email from Clerk
    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Could not find user email' },
        { status: 400 }
      );
    }

    // Create the template spreadsheet
    const result = await createCreditCardsTemplateSpreadsheet(userEmail);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Automatically save the sheet ID to user settings
    const supabase = createServerSupabaseClient();

    await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: userId,
          credit_cards_sheet_id: result.spreadsheetId,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id',
        }
      );

    return NextResponse.json({
      success: true,
      spreadsheetId: result.spreadsheetId,
      spreadsheetUrl: result.spreadsheetUrl,
    });
  } catch (error) {
    console.error('Error creating credit cards template sheet:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create sheet' },
      { status: 500 }
    );
  }
}
