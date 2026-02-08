import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink, readFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';

const execAsync = promisify(exec);

/**
 * POST /api/tax-returns/upload-pdf
 *
 * Accepts TurboTax PDF files, parses them using the Python script,
 * and imports the data directly into the database.
 *
 * This eliminates the need for users to:
 * 1. Install Python dependencies
 * 2. Download the parser script
 * 3. Run CLI commands
 * 4. Manually upload CSV
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

    // Generate unique filenames for temporary files
    const tempId = randomUUID();
    const pdfPath = join(tmpdir(), `turbotax_${tempId}.pdf`);
    const csvPath = join(tmpdir(), `turbotax_${tempId}.csv`);

    try {
      // Save PDF to temporary file
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await writeFile(pdfPath, buffer);

      // Get the path to the Python parser script
      const scriptPath = join(process.cwd(), 'scripts', 'turbotax_parser.py');

      // Check if Python 3 is available
      let pythonCommand = 'python3';
      try {
        await execAsync('python3 --version');
      } catch {
        // Try 'python' if 'python3' doesn't exist
        try {
          await execAsync('python --version');
          pythonCommand = 'python';
        } catch {
          return NextResponse.json({
            error: 'Python 3 is not installed on the server',
            details: 'Please install Python 3 and the required dependencies (pdfplumber, pandas)',
          }, { status: 500 });
        }
      }

      // Run the Python parser
      console.log(`Parsing PDF: ${file.name}`);
      const command = `${pythonCommand} "${scriptPath}" "${pdfPath}" -o "${csvPath}"`;

      const { stdout, stderr } = await execAsync(command, {
        timeout: 30000, // 30 second timeout
      });

      console.log('Parser output:', stdout);
      if (stderr) {
        console.warn('Parser warnings:', stderr);
      }

      // Read the generated CSV
      const csvContent = await readFile(csvPath, 'utf-8');

      // Parse CSV and import to database (reuse existing logic)
      const result = await parseAndImportCSV(csvContent, userId);

      // Clean up temporary files
      await Promise.all([
        unlink(pdfPath).catch(() => {}),
        unlink(csvPath).catch(() => {}),
      ]);

      return NextResponse.json({
        success: true,
        imported: result.imported,
        errors: result.errors,
        filename: file.name,
      });

    } catch (error: any) {
      // Clean up on error
      await Promise.all([
        unlink(pdfPath).catch(() => {}),
        unlink(csvPath).catch(() => {}),
      ]);

      console.error('PDF parsing error:', error);

      // Provide helpful error messages
      if (error.message?.includes('pdfplumber')) {
        return NextResponse.json({
          error: 'PDF parsing library not installed',
          details: 'Server needs Python package: pip install pdfplumber pandas',
        }, { status: 500 });
      }

      if (error.message?.includes('timeout')) {
        return NextResponse.json({
          error: 'PDF parsing timed out',
          details: 'The PDF file may be too large or complex',
        }, { status: 500 });
      }

      return NextResponse.json({
        error: 'Failed to parse PDF',
        details: error.message || 'Unknown error',
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

// Helper: Parse CSV and import records
async function parseAndImportCSV(csvText: string, userId: string) {
  const supabase = createServerSupabaseClient();
  const lines = csvText.trim().split('\n');

  if (lines.length < 2) {
    return { imported: 0, errors: ['CSV file is empty or has no data rows'] };
  }

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const records: any[] = [];
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

    records.push(record);
  }

  if (records.length === 0) {
    return { imported: 0, errors };
  }

  // Import records to database
  let imported = 0;

  for (const record of records) {
    const { error } = await supabase
      .from('tax_returns')
      .upsert(
        {
          user_id: userId,
          tax_year: parseInt(String(record.tax_year || '0')),
          filing_status: String(record.filing_status || 'single'),
          wages: parseFloat(String(record.wages || '0')),
          interest_income: parseFloat(String(record.interest_income || '0')),
          dividend_income: parseFloat(String(record.dividend_income || '0')),
          qualified_dividends: parseFloat(String(record.qualified_dividends || '0')),
          capital_gains: parseFloat(String(record.capital_gains || '0')),
          ira_distributions: parseFloat(String(record.ira_distributions || '0')),
          pension_income: parseFloat(String(record.pension_income || '0')),
          social_security: parseFloat(String(record.social_security || '0')),
          business_income: parseFloat(String(record.business_income || '0')),
          other_income: parseFloat(String(record.other_income || '0')),
          total_income: parseFloat(String(record.total_income || '0')),
          agi: parseFloat(String(record.agi || '0')),
          adjustments: parseFloat(String(record.adjustments || '0')),
          deduction_type: record.deduction_type === 'itemized' ? 'itemized' : 'standard',
          deduction_amount: parseFloat(String(record.deduction_amount || '0')),
          qbi_deduction: parseFloat(String(record.qbi_deduction || '0')),
          taxable_income: parseFloat(String(record.taxable_income || '0')),
          total_tax: parseFloat(String(record.total_tax || '0')),
          federal_withheld: parseFloat(String(record.federal_withheld || '0')),
          estimated_payments: parseFloat(String(record.estimated_payments || '0')),
          refund_amount: parseFloat(String(record.refund_amount || '0')),
          amount_owed: parseFloat(String(record.amount_owed || '0')),
          effective_tax_rate: parseFloat(String(record.effective_tax_rate || '0')),
          se_income: parseFloat(String(record.se_income || '0')),
          se_tax: parseFloat(String(record.se_tax || '0')),
          se_deduction: parseFloat(String(record.se_deduction || '0')),
          source: 'pdf_upload',
          notes: record.notes ? String(record.notes) : null,
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
