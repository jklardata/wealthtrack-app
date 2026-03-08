import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import {
  email2Html,
  email3Html,
  leadMagnetDay3FreelanceChecklistHtml,
  leadMagnetDay3BankingSetupHtml,
  leadMagnetDay3FiCalculatorHtml,
  leadMagnetDay3RothConversionHtml,
  leadMagnetDay3TaxSavingsHtml,
  leadMagnetDay3NetWorthQuizHtml,
  leadMagnetDay3ScorpCalculatorHtml,
  leadMagnetDay3FeieCheckerHtml,
  leadMagnetDay3QuarterlyTaxHtml,
  leadMagnetDay3RateCalculatorHtml,
  leadMagnetDay7Html,
} from '@/lib/email-templates'

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

  // ---- Lead magnet nurture sequence ----
  const { data: leads, error: leadsError } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .lt('emails_sent', 2)

  if (leadsError) {
    console.error('Failed to fetch newsletter_subscribers:', leadsError)
  }

  for (const lead of leads ?? []) {
    const daysSinceSubscribed = Math.floor(
      (now.getTime() - new Date(lead.subscribed_at).getTime()) / (1000 * 60 * 60 * 24)
    )

    const day3Emails: Record<string, { subject: string; html: () => string }> = {
      freelance_checklist:        { subject: 'The tax mistake most freelancers make in year one', html: leadMagnetDay3FreelanceChecklistHtml },
      banking_setup:              { subject: 'The part of self-employed taxes most people get wrong', html: leadMagnetDay3BankingSetupHtml },
      fi_calculator:              { subject: 'The lever that matters more than income for reaching FI', html: leadMagnetDay3FiCalculatorHtml },
      roth_conversion_calculator: { subject: 'The Roth conversion rule that catches most people off guard', html: leadMagnetDay3RothConversionHtml },
      tax_calculator_lead_magnet: { subject: 'How most self-employed people actually capture their tax savings', html: leadMagnetDay3TaxSavingsHtml },
      net_worth_quiz:             { subject: 'Why tracking net worth changes your behavior (even when nothing else does)', html: leadMagnetDay3NetWorthQuizHtml },
      scorp_calculator:           { subject: 'The S-Corp question that determines how much you actually save', html: leadMagnetDay3ScorpCalculatorHtml },
      feie_checker:               { subject: 'What to actually do if you qualify for the FEIE', html: leadMagnetDay3FeieCheckerHtml },
      quarterly_tax_estimator:    { subject: 'You don\'t have to be exact — just clear this threshold', html: leadMagnetDay3QuarterlyTaxHtml },
      rate_calculator:            { subject: 'The real cost of undercharging (it\'s not what you think)', html: leadMagnetDay3RateCalculatorHtml },
    }

    const day3 = day3Emails[lead.source] ?? { subject: 'The tax mistake most freelancers make in year one', html: leadMagnetDay3FreelanceChecklistHtml }

    if (daysSinceSubscribed >= 3 && lead.emails_sent < 1) {
      const { error: sendError } = await resend.emails.send({
        from: 'Justin at SoloFI <justin@solofi.io>',
        to: lead.email,
        subject: day3.subject,
        html: day3.html(),
      })

      if (sendError) {
        console.error(`Failed to send lead magnet Day 3 to ${lead.email}:`, sendError)
        continue
      }

      await supabase
        .from('newsletter_subscribers')
        .update({ emails_sent: 1 })
        .eq('id', lead.id)

      sent++
    }

    if (daysSinceSubscribed >= 7 && lead.emails_sent < 2) {
      const { error: sendError } = await resend.emails.send({
        from: 'Justin at SoloFI <justin@solofi.io>',
        to: lead.email,
        subject: 'What SoloFI actually does (quick summary)',
        html: leadMagnetDay7Html(),
      })

      if (sendError) {
        console.error(`Failed to send lead magnet Day 7 to ${lead.email}:`, sendError)
        continue
      }

      await supabase
        .from('newsletter_subscribers')
        .update({ emails_sent: 2 })
        .eq('id', lead.id)

      sent++
    }
  }

  console.log(`Email drip cron: sent ${sent} emails`)
  return NextResponse.json({ ok: true, sent })
}
