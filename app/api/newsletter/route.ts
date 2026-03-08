import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServerSupabaseClient } from '@/lib/supabase';
import {
  freelanceChecklistWelcomeHtml,
  bankingSetupWelcomeHtml,
  fiCalculatorWelcomeHtml,
  rothConversionWelcomeHtml,
  taxSavingsWelcomeHtml,
  netWorthQuizWelcomeHtml,
  scorpCalculatorWelcomeHtml,
  feieCheckerWelcomeHtml,
  quarterlyTaxWelcomeHtml,
  rateCalculatorWelcomeHtml,
} from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

// Allow requests from the landing page
const ALLOWED_ORIGINS = [
  'https://solofi.io',
  'https://www.solofi.io',
  'http://localhost:3000',
  'http://127.0.0.1:5500', // Live Server for local dev
];

function getCorsHeaders(origin: string | null) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return NextResponse.json({}, { headers: getCorsHeaders(origin) });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    const body = await request.json();
    const { email, source } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = createServerSupabaseClient();

    // Check if email already exists
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    // Get subscriber ID (used for unsubscribe link)
    let subscriberId: string;
    if (existing) {
      subscriberId = existing.id;
    } else {
      const { data: newSub, error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: email.toLowerCase(),
          source: source || 'landing_page',
          subscribed_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error || !newSub) {
        console.error('Newsletter signup error:', error);
        return NextResponse.json(
          { error: 'Failed to subscribe. Please try again.' },
          { status: 500, headers: corsHeaders }
        );
      }
      subscriberId = newSub.id;
    }

    // Build unsubscribe URL using subscriber's UUID as token
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://solofi.io';
    const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${subscriberId}`;

    // Send welcome email for lead magnet sources
    const leadMagnetEmails: Record<string, { subject: string; html: () => string }> = {
      freelance_checklist:        { subject: 'Your Self Employment Financial Checklist', html: freelanceChecklistWelcomeHtml },
      banking_setup:              { subject: 'Your Freelancer Banking Setup Guide', html: bankingSetupWelcomeHtml },
      fi_calculator:              { subject: 'Your Financial Independence Comparison', html: fiCalculatorWelcomeHtml },
      roth_conversion_calculator: { subject: 'Your Roth Conversion Ladder Strategy', html: rothConversionWelcomeHtml },
      tax_calculator_lead_magnet: { subject: 'Your Tax Savings Breakdown', html: taxSavingsWelcomeHtml },
      net_worth_quiz:             { subject: 'Your Net Worth Tracking Results', html: netWorthQuizWelcomeHtml },
      scorp_calculator:           { subject: 'Your S-Corp Analysis', html: scorpCalculatorWelcomeHtml },
      feie_checker:               { subject: 'Your FEIE Eligibility Results', html: feieCheckerWelcomeHtml },
      quarterly_tax_estimator:    { subject: 'Your Quarterly Tax Estimate', html: quarterlyTaxWelcomeHtml },
      rate_calculator:            { subject: 'Your Freelance Rate Breakdown', html: rateCalculatorWelcomeHtml },
    };

    const leadMagnet = leadMagnetEmails[source];
    if (leadMagnet) {
      const html = leadMagnet.html().replace('{{unsubscribe_url}}', unsubscribeUrl);
      await resend.emails.send({
        from: 'Justin at SoloFI <justin@solofi.io>',
        to: email.toLowerCase(),
        subject: leadMagnet.subject,
        html,
      });
    }

    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500, headers: corsHeaders }
    );
  }
}
