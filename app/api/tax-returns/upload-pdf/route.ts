import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

/**
 * POST /api/tax-returns/upload-pdf
 *
 * Accepts TurboTax PDF files and parses them using pdfjs-dist (Mozilla PDF.js).
 * Extracts tax return data and imports directly into the database.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    try {
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Parse PDF and extract text
      console.log(`Parsing PDF: ${file.name}, size: ${buffer.length} bytes`);

      // Use pdfjs-dist (Mozilla PDF.js)
      const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

      // Load the PDF
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(buffer),
        useSystemFonts: true,
      });

      const pdfDocument = await loadingTask.promise;
      const numPages = pdfDocument.numPages;

      console.log(`PDF has ${numPages} pages`);

      // Extract text from all pages
      let fullText = '';
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      console.log(`Extracted ${fullText.length} characters from ${numPages} pages`);

      if (!fullText || fullText.length < 100) {
        return NextResponse.json({
          error: 'Could not extract text from PDF',
          details: `Only extracted ${fullText.length} characters. The PDF may be encrypted, scanned, or in an unsupported format.`,
        }, { status: 400 });
      }

      // Parse the tax return data
      const taxReturn = parseTurboTaxPDF(fullText, file.name);
      console.log(`Parsed tax return: year=${taxReturn.tax_year}, AGI=${taxReturn.agi}`);

      if (!taxReturn.tax_year || taxReturn.tax_year < 2000) {
        return NextResponse.json({
          error: 'Could not identify tax year',
          details: 'Make sure this is a TurboTax Form 1040 PDF',
        }, { status: 400 });
      }

      // Import to database
      const supabase = createServerSupabaseClient();
      const { error } = await supabase
        .from('tax_returns')
        .upsert(
          {
            user_id: userId,
            ...taxReturn,
            source: 'pdf_upload',
          },
          { onConflict: 'user_id,tax_year' }
        );

      if (error) {
        console.error('Database error:', error);
        return NextResponse.json({
          error: 'Failed to save tax return',
          details: error.message,
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        imported: 1,
        errors: [],
        filename: file.name,
        data: taxReturn,
      });

    } catch (error: any) {
      console.error('PDF parsing error:', error);
      console.error('Error stack:', error.stack);

      return NextResponse.json({
        error: 'Failed to parse PDF',
        details: error.message || 'Unknown error',
        errorType: error.constructor?.name || 'Unknown',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in PDF upload endpoint:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

/**
 * Parse TurboTax PDF text and extract tax return data
 */
function parseTurboTaxPDF(text: string, filename: string): Record<string, any> {
  // Helper function to extract amounts using regex
  const parseAmount = (pattern: RegExp): number => {
    const match = text.match(pattern);
    if (match) {
      const amountStr = match[1]
        .replace(/,/g, '')
        .replace(/\$/g, '')
        .replace(/\(/g, '-')
        .replace(/\)/g, '')
        .trim();
      const num = parseFloat(amountStr);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  // Helper function to parse by line number (TurboTax format: "... line XX . . . AMOUNT")
  const parseByLine = (lineNum: string): number => {
    // Pattern: dots followed by line number, then amount ending with period or newline
    const patterns = [
      new RegExp(`\\.{2,}\\s*${lineNum}\\s+([\\d,]+)\\.`, 'i'),
      new RegExp(`\\.{2,}\\s*${lineNum}\\s+(-?[\\d,]+)(?:\\.|\\s|$)`, 'i'),
      new RegExp(`line\\s+${lineNum}[^\\d]*([\\d,]+)`, 'i'),
    ];

    for (const pattern of patterns) {
      const amount = parseAmount(pattern);
      if (amount !== 0) return amount;
    }
    return 0;
  };

  // Extract tax year
  const yearMatch = text.match(/(\d{4})\s*Form\s*1040/i) ||
                    text.match(/Tax\s*Year\s*(\d{4})/i);
  const tax_year = yearMatch ? parseInt(yearMatch[1]) : 0;

  // Extract filing status
  let filing_status = 'single';
  if (/married\s+filing\s+jointly/i.test(text)) {
    filing_status = 'married_filing_jointly';
  } else if (/married\s+filing\s+separately/i.test(text)) {
    filing_status = 'married_filing_separately';
  } else if (/head\s+of\s+household/i.test(text)) {
    filing_status = 'head_of_household';
  } else if (/qualifying\s+(widow|surviving)/i.test(text)) {
    filing_status = 'qualifying_widow';
  }

  // Parse Form 1040 lines
  // Line 1z/1a: Wages
  const wages = parseByLine('1z') || parseByLine('1a');

  // Line 2b: Taxable interest
  const interest_income = parseByLine('2b');

  // Line 3a: Qualified dividends
  const qualified_dividends = parseByLine('3a');

  // Line 3b: Ordinary dividends
  const dividend_income = parseByLine('3b');

  // Line 4b: IRA distributions
  const ira_distributions = Math.max(0, parseByLine('4b'));

  // Line 5b: Pensions
  const pension_income = parseByLine('5b');

  // Line 6b: Social Security
  const social_security = parseByLine('6b');

  // Line 7: Capital gains (can be negative)
  const capital_gains = parseByLine('7');

  // Line 8: Other income
  const other_income = parseByLine('8');

  // Line 9: Total income
  const total_income = parseByLine('9');

  // Line 10: Adjustments
  const adjustments = parseByLine('10');

  // Line 11: AGI
  const agi = parseByLine('11');

  // Line 12: Standard/itemized deduction
  const deduction_amount = parseByLine('12');

  // Determine deduction type
  const standardDeductions = [13850, 27700, 20800, 14600, 29200]; // Common amounts
  const deduction_type = standardDeductions.includes(deduction_amount) ? 'standard' : 'itemized';

  // Line 13: QBI deduction
  const qbi_deduction = parseByLine('13');

  // Line 15: Taxable income
  const taxable_income = parseByLine('15');

  // Line 24: Total tax
  const total_tax = parseByLine('24');

  // Line 25d: Federal withheld
  const federal_withheld = parseByLine('25d') || parseByLine('25a');

  // Line 26: Estimated payments
  const estimated_payments = parseByLine('26');

  // Line 34: Refund
  const refund_amount = parseByLine('34');

  // Line 37: Amount owed
  let amount_owed = parseByLine('37');
  if (refund_amount > 0) amount_owed = 0; // Can't have both

  // Self-employment income (Schedule C line 31 or Schedule 1 line 3)
  let business_income = parseAmount(/\b31\s+([-\d,]+)\./i);
  if (business_income === 0) {
    business_income = parseAmount(/Business\s+income[^.]*\.{2,}\s*3\s+([-\d,]+)\./i);
  }

  // Self-employment tax (Schedule 2)
  const se_tax = parseAmount(/Self-employment\s+tax[^.]*\.{2,}\s*\d+\s+([\d,]+)\./i);

  // SE deduction (Schedule 1)
  let se_deduction = parseAmount(/Deductible\s+part\s+of\s+self-employment\s+tax[^.]*\.{2,}\s*\d+\s+([\d,]+)\./i);
  if (se_deduction === 0 && se_tax > 0) {
    se_deduction = se_tax / 2; // Calculate if not found
  }

  const se_income = business_income > 0 ? business_income : 0;

  // Calculate effective tax rate
  const effective_tax_rate = agi > 0 ? total_tax / agi : 0;

  return {
    tax_year,
    filing_status,
    wages,
    interest_income,
    dividend_income,
    qualified_dividends,
    capital_gains,
    ira_distributions,
    pension_income,
    social_security,
    business_income,
    other_income,
    total_income,
    agi,
    adjustments,
    deduction_type,
    deduction_amount,
    qbi_deduction,
    taxable_income,
    total_tax,
    federal_withheld,
    estimated_payments,
    refund_amount,
    amount_owed,
    effective_tax_rate,
    se_income,
    se_tax,
    se_deduction,
    notes: `Imported from TurboTax PDF: ${filename}`,
  };
}
