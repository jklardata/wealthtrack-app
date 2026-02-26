import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { email2Html, email3Html } from '@/lib/email-templates'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  // Verify Vercel cron secret
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()

  const { data: users, error } = await supabase
    .from('email_sequences')
    .select('*')
    .eq('is_pro', false)

  if (error) {
    console.error('Failed to fetch email_sequences:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  let sent = 0

  for (const user of users ?? []) {
    const daysSinceSignup = Math.floor(
      (now.getTime() - new Date(user.signed_up_at).getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSinceSignup === 3 && user.emails_sent < 2) {
      const { error: sendError } = await resend.emails.send({
        from: 'Justin at SoloFI <justin@solofi.io>',
        to: user.email,
        subject: 'Are you paying yourself the wrong salary?',
        html: email2Html(user.first_name),
      })

      if (sendError) {
        console.error(`Failed to send Email 2 to ${user.email}:`, sendError)
        continue
      }

      await supabase
        .from('email_sequences')
        .update({ emails_sent: 2 })
        .eq('user_id', user.user_id)

      sent++
    }

    if (daysSinceSignup === 7 && user.emails_sent < 3) {
      const { error: sendError } = await resend.emails.send({
        from: 'Justin at SoloFI <justin@solofi.io>',
        to: user.email,
        subject: 'What $10/month actually buys you',
        html: email3Html(user.first_name),
      })

      if (sendError) {
        console.error(`Failed to send Email 3 to ${user.email}:`, sendError)
        continue
      }

      await supabase
        .from('email_sequences')
        .update({ emails_sent: 3 })
        .eq('user_id', user.user_id)

      sent++
    }
  }

  console.log(`Email drip cron: sent ${sent} emails`)
  return NextResponse.json({ ok: true, sent })
}
