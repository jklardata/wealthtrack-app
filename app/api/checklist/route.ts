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
      .select('checklist_progress')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Failed to fetch checklist' }, { status: 500 });
    }

    return NextResponse.json({ data: data?.checklist_progress || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { checkedItems } = await request.json();
    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: userId,
          checklist_progress: checkedItems,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      return NextResponse.json({ error: 'Failed to save checklist' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
