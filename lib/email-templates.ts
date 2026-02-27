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
    ${p('Welcome to SoloFI. You signed up because you want clarity on your finances, not more noise. So let\'s start with one number: your net worth.')}
    ${p('Add your accounts and SoloFI will track your trajectory automatically.')}
    ${ctaButton('Set up your net worth →', 'https://solofi.io/dashboard')}
    ${p('It takes 5 minutes. No bank linking. No permissions. Just your numbers.')}
    ${p('Want to understand the numbers behind your finances? The <a href="https://solofi.io/learn" style="color:#000000;font-weight:700;">Learn</a> section has guides on taxes, S-Corps, retirement, and more—written for self-employed professionals, not accountants.')}
    ${signature()}
  `
  return emailWrapper(body)
}

// ---- Email 2: Day 3 — Self-Employed Financial Checklist ----
export function email2Html(firstName: string | null): string {
  const name = firstName || 'there'
  const body = `
    ${p(`Hey ${name},`)}
    ${p('Most people go self-employed and wing the financial side. They pick up a business account here, figure out taxes later, and hope it all works out.')}
    ${p('It usually doesn\'t—at least not efficiently.')}
    ${p('The Self-Employed Financial Checklist walks you through exactly what to set up: business banking, tax accounts, retirement, insurance, and more. In the right order, so nothing falls through the cracks.')}
    ${ctaButton('Get the Checklist →', 'https://solofi.io/freelance-checklist')}
    ${p('Takes 10 minutes to read. Saves you from the mistakes most freelancers make in year one.')}
    ${p('Want to go deeper on taxes? Download the <a href="https://crxddnkwehlwtqegidaf.supabase.co/storage/v1/object/public/assets/handbooks/self-employed-tax-handbook.pdf" style="color:#000000;font-weight:700;">Self-Employed Tax Handbook (PDF)</a>—covers everything from quarterly estimates to deductions to S-Corp strategy.')}
    ${signature()}
  `
  return emailWrapper(body)
}

// ---- Email 3: Day 7 — Soft sell / Trajectory ----
export function email3Html(firstName: string | null): string {
  const name = firstName || 'there'
  const body = `
    ${p(`Hey ${name},`)}
    ${p('Most self-employed professionals have no idea if they\'re actually building wealth—or just staying busy.')}
    ${p('SoloFI\'s Trajectory tool shows you exactly where you\'re headed based on your current net worth, savings rate, and timeline. No guesswork.')}
    ${ctaButton('Check your trajectory →', 'https://solofi.io/dashboard')}
    ${p('If the number looks off, that\'s usually a signal to look at three things: your tax setup, your retirement contributions, and your rate.')}
    ${p('We cover all three inside SoloFI. Some tools are free, and Pro unlocks the deeper modeling if you ever need it.')}
    ${signature()}
  `
  return emailWrapper(body)
}
