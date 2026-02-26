export function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SoloFI</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border:2px solid #000000;border-radius:2px;max-width:580px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding:24px 32px;border-bottom:2px solid #000000;">
              <span style="font-size:20px;font-weight:900;color:#000000;letter-spacing:-0.5px;">SoloFI</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 24px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:2px solid #000000;">
              <p style="margin:0;font-size:12px;color:#666666;line-height:1.5;">
                SoloFI · Built for self-employed professionals<br />
                <a href="https://solofi.io" style="color:#000000;">solofi.io</a> ·
                <a href="{{unsubscribe_url}}" style="color:#666666;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function p(text: string): string {
  return `<p style="margin:0 0 18px;font-size:16px;color:#111111;line-height:1.65;">${text}</p>`
}

function signature(name: string = 'Justin'): string {
  return `
    <p style="margin:24px 0 0;font-size:16px;color:#111111;line-height:1.65;">
      ${name}<br />
      <span style="color:#666666;font-size:14px;">Founder, SoloFI</span>
    </p>
  `
}

function ctaButton(text: string, url: string): string {
  return `
    <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background:#000000;border-radius:2px;">
          <a href="${url}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:-0.2px;">${text}</a>
        </td>
      </tr>
    </table>
  `
}

// ---- Email 1: Day 0 — Welcome ----
export function email1Html(firstName: string | null): string {
  const name = firstName || 'there'
  const body = `
    ${p(`Hey ${name},`)}
    ${p('Welcome to SoloFI.')}
    ${p('You signed up because you want clarity on your finances—not more noise. So let\'s start with one number: your net worth.')}
    ${p('Add your accounts here and SoloFI will track your trajectory automatically—whether you\'re growing, stalling, or drifting off course.')}
    ${ctaButton('Set up your net worth →', 'https://solofi.io/dashboard')}
    ${p('It takes 5 minutes. No bank linking. No permissions. Just your numbers.')}
    ${p('<strong>Not sure where to start?</strong> Run the <a href="https://solofi.io/tools/tax-savings-calculator" style="color:#000000;font-weight:700;">Tax Savings Calculator</a> first—most self-employed folks find $2k–$8k they\'re leaving on the table.')}
    ${signature()}
  `
  return emailWrapper(body)
}

// ---- Email 2: Day 3 — S-Corp Optimizer ----
export function email2Html(firstName: string | null): string {
  const name = firstName || 'there'
  const body = `
    ${p(`Hey ${name},`)}
    ${p('If you\'re running an S-Corp (or thinking about one), the single biggest lever you have is your owner salary.')}
    ${p('Too high—you overpay payroll taxes. Too low—the IRS flags it as tax evasion.')}
    ${p('The sweet spot saves most consultants $3,000–$8,000 per year. And almost no one hits it without modeling it first.')}
    ${p('SoloFI\'s S-Corp Optimizer finds that number in about 2 minutes:')}
    ${ctaButton('Run the S-Corp Optimizer →', 'https://solofi.io/scorp-calculator')}
    ${p('Plug in your revenue and it shows you exactly what salary to pay yourself, what you\'d save versus an LLC, and whether the S-Corp switch even makes sense at your income level.')}
    ${signature()}
    ${p('<span style="font-size:14px;color:#666666;">Already on an LLC? The comparison view shows you the crossover point—the exact revenue where S-Corp starts winning.</span>')}
  `
  return emailWrapper(body)
}

// ---- Email 3: Day 7 — Upgrade to Pro ----
export function email3Html(firstName: string | null): string {
  const name = firstName || 'there'
  const body = `
    ${p(`Hey ${name},`)}
    ${p('A CPA charges $400/session. A financial advisor takes 1% of your assets—on $500k, that\'s $5,000/year.')}
    ${p('SoloFI Pro is $10/month.')}
    ${p('Here\'s the math:')}
    <table cellpadding="0" cellspacing="0" style="margin:0 0 18px;width:100%;border:2px solid #000000;">
      <tr style="background:#000000;">
        <td style="padding:10px 16px;font-size:14px;font-weight:700;color:#ffffff;">Decision</td>
        <td style="padding:10px 16px;font-size:14px;font-weight:700;color:#ffffff;">Savings</td>
      </tr>
      <tr style="border-bottom:1px solid #e0e0e0;">
        <td style="padding:10px 16px;font-size:14px;color:#111111;">Roth conversion modeled correctly</td>
        <td style="padding:10px 16px;font-size:14px;color:#111111;font-weight:700;">$5k–$20k over a decade</td>
      </tr>
      <tr style="border-bottom:1px solid #e0e0e0;background:#f9f9f9;">
        <td style="padding:10px 16px;font-size:14px;color:#111111;">S-Corp salary optimized</td>
        <td style="padding:10px 16px;font-size:14px;color:#111111;font-weight:700;">$3k–$8k per year</td>
      </tr>
      <tr>
        <td style="padding:10px 16px;font-size:14px;color:#111111;">Capital gains timed right</td>
        <td style="padding:10px 16px;font-size:14px;color:#111111;font-weight:700;">Thousands avoided</td>
      </tr>
    </table>
    ${p('You don\'t need a financial advisor for these decisions. You need the model. That\'s what Pro gives you.')}
    ${p('<strong>What unlocks at Pro:</strong> Roth conversion ladder · Capital gains simulator · Tax-loss harvesting · Quarterly tax estimates · Saved scenario comparisons · Portfolio rebalancing')}
    ${p('Use <strong>EARLYWEALTH</strong> at checkout for 50% off your first year—that\'s $60 total, or $5/month.')}
    ${ctaButton('Upgrade to Pro →', 'https://solofi.io/pricing')}
    ${signature()}
    ${p('<span style="font-size:14px;color:#666666;">14-day money-back guarantee. Cancel anytime.</span>')}
  `
  return emailWrapper(body)
}
