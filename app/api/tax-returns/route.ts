import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import type { TaxReturn, FilingStatus } from '@/lib/types';

// GET - Fetch all tax returns for user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('tax_returns')
      .select('*')
      .eq('user_id', userId)
      .order('tax_year', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch tax returns' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching tax returns:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Upload CSV or create single tax return
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    const supabase = createServerSupabaseClient();

    // Handle CSV upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      const text = await file.text();
      const result = await parseAndImportCSV(text, userId, supabase);
      return NextResponse.json(result);
    }

    // Handle JSON body (single record)
    const body = await request.json();

    // If body is an array, it's a bulk import - sanitize each record first
    if (Array.isArray(body)) {
      const sanitizedRecords: Partial<TaxReturn>[] = [];
      const errors: string[] = [];

      for (let i = 0; i < body.length; i++) {
        try {
          sanitizedRecords.push(sanitizeTaxReturn(body[i]));
        } catch (e) {
          errors.push(`Record ${i + 1}: ${e instanceof Error ? e.message : 'Invalid data'}`);
        }
      }

      if (sanitizedRecords.length === 0) {
        return NextResponse.json({ imported: 0, errors }, { status: 400 });
      }

      const result = await importTaxReturns(sanitizedRecords, userId, supabase, errors);
      return NextResponse.json(result);
    }

    // Single record upsert
    const { data, error } = await supabase
      .from('tax_returns')
      .upsert(
        {
          user_id: userId,
          ...sanitizeTaxReturn(body),
        },
        { onConflict: 'user_id,tax_year' }
      )
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to save tax return' }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error creating tax return:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Bulk delete tax returns
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ids, years } = await request.json();
    const supabase = createServerSupabaseClient();

    if (years && Array.isArray(years)) {
      // Delete by tax year
      const { error } = await supabase
        .from('tax_returns')
        .delete()
        .eq('user_id', userId)
        .in('tax_year', years);

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: 'Failed to delete tax returns' }, { status: 500 });
      }

      return NextResponse.json({ deleted: years.length });
    }

    if (ids && Array.isArray(ids)) {
      // Delete by ID
      const { error } = await supabase
        .from('tax_returns')
        .delete()
        .eq('user_id', userId)
        .in('id', ids);

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: 'Failed to delete tax returns' }, { status: 500 });
      }

      return NextResponse.json({ deleted: ids.length });
    }

    return NextResponse.json({ error: 'No IDs or years provided' }, { status: 400 });
  } catch (error) {
    console.error('Error deleting tax returns:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper: Parse CSV and import records
async function parseAndImportCSV(
  csvText: string,
  userId: string,
  supabase: ReturnType<typeof createServerSupabaseClient>
) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    return { imported: 0, errors: ['CSV file is empty or has no data rows'] };
  }

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const records: Partial<TaxReturn>[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) {
      errors.push(`Row ${i + 1}: Column count mismatch`);
      continue;
    }

    const record: Record<string, string | number> = {};
    headers.forEach((header, index) => {
      record[header] = values[index];
    });

    try {
      records.push(sanitizeTaxReturn(record));
    } catch (e) {
      errors.push(`Row ${i + 1}: ${e instanceof Error ? e.message : 'Invalid data'}`);
    }
  }

  if (records.length === 0) {
    return { imported: 0, errors };
  }

  return importTaxReturns(records, userId, supabase, errors);
}

// Helper: Import array of tax returns
async function importTaxReturns(
  records: Partial<TaxReturn>[],
  userId: string,
  supabase: ReturnType<typeof createServerSupabaseClient>,
  existingErrors: string[] = []
) {
  const errors = [...existingErrors];
  let imported = 0;

  for (const record of records) {
    const { error } = await supabase
      .from('tax_returns')
      .upsert(
        {
          user_id: userId,
          ...record,
        },
        { onConflict: 'user_id,tax_year' }
      );

    if (error) {
      errors.push(`Tax year ${record.tax_year}: ${error.message}`);
    } else {
      imported++;
    }
  }

  return { imported, errors };
}

// Helper: Parse a CSV line handling quoted values
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  return values;
}

// Helper: Sanitize and validate tax return data
function sanitizeTaxReturn(data: Record<string, unknown>): Partial<TaxReturn> {
  const filingStatusMap: Record<string, FilingStatus> = {
    single: 'single',
    married_filing_jointly: 'married_filing_jointly',
    'married filing jointly': 'married_filing_jointly',
    mfj: 'married_filing_jointly',
    married_filing_separately: 'married_filing_separately',
    'married filing separately': 'married_filing_separately',
    mfs: 'married_filing_separately',
    head_of_household: 'head_of_household',
    'head of household': 'head_of_household',
    hoh: 'head_of_household',
    qualifying_widow: 'qualifying_widow',
    'qualifying widow': 'qualifying_widow',
    qw: 'qualifying_widow',
  };

  const taxYear = parseInt(String(data.tax_year || '0'));
  if (!taxYear || taxYear < 2000 || taxYear > 2030) {
    throw new Error('Invalid tax year');
  }

  const filingStatus = filingStatusMap[String(data.filing_status || 'single').toLowerCase()];
  if (!filingStatus) {
    throw new Error('Invalid filing status');
  }

  const parseNumber = (value: unknown): number => {
    if (value === null || value === undefined || value === '') return 0;
    const num = parseFloat(String(value).replace(/[$,]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  return {
    tax_year: taxYear,
    filing_status: filingStatus,
    wages: parseNumber(data.wages),
    interest_income: parseNumber(data.interest_income),
    dividend_income: parseNumber(data.dividend_income),
    qualified_dividends: parseNumber(data.qualified_dividends),
    capital_gains: parseNumber(data.capital_gains),
    ira_distributions: parseNumber(data.ira_distributions),
    pension_income: parseNumber(data.pension_income),
    social_security: parseNumber(data.social_security),
    business_income: parseNumber(data.business_income),
    other_income: parseNumber(data.other_income),
    total_income: parseNumber(data.total_income),
    agi: parseNumber(data.agi),
    adjustments: parseNumber(data.adjustments),
    deduction_type: data.deduction_type === 'itemized' ? 'itemized' : 'standard',
    deduction_amount: parseNumber(data.deduction_amount),
    qbi_deduction: parseNumber(data.qbi_deduction),
    taxable_income: parseNumber(data.taxable_income),
    total_tax: parseNumber(data.total_tax),
    federal_withheld: parseNumber(data.federal_withheld),
    estimated_payments: parseNumber(data.estimated_payments),
    refund_amount: parseNumber(data.refund_amount),
    amount_owed: parseNumber(data.amount_owed),
    effective_tax_rate: parseNumber(data.effective_tax_rate),
    se_income: parseNumber(data.se_income),
    se_tax: parseNumber(data.se_tax),
    se_deduction: parseNumber(data.se_deduction),
    source: 'csv_upload',
    notes: data.notes ? String(data.notes) : null,
  };
}
