import { google } from 'googleapis';
import type { SheetRow, CreditCardSheetRow, CreditCardStatus, ConsultingIncomeSheetRow, ConsultingIncomeType } from './types';

const SERVICE_ACCOUNT_EMAIL = 'wealthtrack-sheets@wealth-tracker-485215.iam.gserviceaccount.com';

// Initialize Google Sheets API with service account (read-only)
function getGoogleSheetsClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return google.sheets({ version: 'v4', auth });
}

// Initialize Google Sheets API with full access for creating sheets
function getGoogleSheetsClientFull() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
    ],
  });

  return {
    sheets: google.sheets({ version: 'v4', auth }),
    drive: google.drive({ version: 'v3', auth }),
  };
}

export async function fetchSheetData(sheetId: string): Promise<SheetRow[]> {
  const sheets = getGoogleSheetsClient();

  // Fetch data from the first sheet, assuming headers in row 1
  // Expected columns: Date, Stocks, Bonds, Cash, Real Estate, Points Value, Commodities, Other Assets, Total Debts, Notes, Pre-tax Monthly Income, Monthly Expenses
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'A2:L1000', // Skip header row, get up to 1000 rows
  });

  const rows = response.data.values || [];

  return rows
    .filter((row) => row[0]) // Filter out rows without a date
    .map((row) => ({
      date: parseDate(row[0]),
      stocks: parseNumber(row[1]),
      bonds: parseNumber(row[2]),
      cash: parseNumber(row[3]),
      real_estate: parseNumber(row[4]),
      points_value: parseNumber(row[5]),
      commodities: parseNumber(row[6]),
      other_assets: parseNumber(row[7]),
      total_debts: parseNumber(row[8]),
      notes: row[9] || undefined,
      pre_tax_income: parseNumber(row[10]),
      monthly_expenses: parseNumber(row[11]),
    }));
}

function parseDate(value: string): string {
  if (!value) return new Date().toISOString().split('T')[0];

  // Try to parse various date formats
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }

  // Handle MM/DD/YYYY format
  const parts = value.split('/');
  if (parts.length === 3) {
    const [month, day, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return new Date().toISOString().split('T')[0];
}

function parseNumber(value: string | undefined): number {
  if (!value) return 0;
  // Remove currency symbols, commas, and whitespace
  const cleaned = value.toString().replace(/[$,\s]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export async function getSheetMetadata(sheetId: string): Promise<{ title: string | null; valid: boolean; error?: string }> {
  const sheets = getGoogleSheetsClient();

  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
      fields: 'properties.title',
    });

    return {
      title: response.data.properties?.title || 'Unknown',
      valid: true,
    };
  } catch (error: unknown) {
    const err = error as { message?: string; code?: number };
    console.error('Google Sheets API error:', err);
    return {
      title: null,
      valid: false,
      error: err.message || 'Unknown error',
    };
  }
}

export async function createTemplateSpreadsheet(userEmail: string): Promise<{
  spreadsheetId: string;
  spreadsheetUrl: string;
  error?: string
}> {
  const { sheets, drive } = getGoogleSheetsClientFull();

  try {
    // Create the spreadsheet with template
    const createResponse = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: 'WealthTrack - Net Worth Tracker',
        },
        sheets: [
          {
            properties: {
              title: 'Net Worth',
              gridProperties: {
                frozenRowCount: 1,
              },
            },
            data: [
              {
                startRow: 0,
                startColumn: 0,
                rowData: [
                  {
                    values: [
                      { userEnteredValue: { stringValue: 'Date' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Stocks' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Bonds' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Cash' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Real Estate' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Points Value' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Commodities' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Other Assets' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Total Debts' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Notes' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Pre-tax Monthly Income' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Monthly Expenses' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                    ],
                  },
                  // Sample row with example data
                  {
                    values: [
                      { userEnteredValue: { stringValue: new Date().toISOString().split('T')[0] } },
                      { userEnteredValue: { numberValue: 50000 }, userEnteredFormat: { numberFormat: { type: 'CURRENCY' } } },
                      { userEnteredValue: { numberValue: 10000 }, userEnteredFormat: { numberFormat: { type: 'CURRENCY' } } },
                      { userEnteredValue: { numberValue: 15000 }, userEnteredFormat: { numberFormat: { type: 'CURRENCY' } } },
                      { userEnteredValue: { numberValue: 0 }, userEnteredFormat: { numberFormat: { type: 'CURRENCY' } } },
                      { userEnteredValue: { numberValue: 5000 }, userEnteredFormat: { numberFormat: { type: 'CURRENCY' } } },
                      { userEnteredValue: { numberValue: 0 }, userEnteredFormat: { numberFormat: { type: 'CURRENCY' } } },
                      { userEnteredValue: { numberValue: 0 }, userEnteredFormat: { numberFormat: { type: 'CURRENCY' } } },
                      { userEnteredValue: { numberValue: 0 }, userEnteredFormat: { numberFormat: { type: 'CURRENCY' } } },
                      { userEnteredValue: { stringValue: 'Sample entry - update with your data' } },
                      { userEnteredValue: { numberValue: 8000 }, userEnteredFormat: { numberFormat: { type: 'CURRENCY' } } },
                      { userEnteredValue: { numberValue: 5000 }, userEnteredFormat: { numberFormat: { type: 'CURRENCY' } } },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    const spreadsheetId = createResponse.data.spreadsheetId;
    if (!spreadsheetId) {
      throw new Error('Failed to create spreadsheet');
    }

    // Auto-resize columns
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: 0,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: 12,
              },
            },
          },
        ],
      },
    });

    // Share with service account (so it can read later)
    await drive.permissions.create({
      fileId: spreadsheetId,
      requestBody: {
        type: 'user',
        role: 'reader',
        emailAddress: SERVICE_ACCOUNT_EMAIL,
      },
      sendNotificationEmail: false,
    });

    // Share with user as owner/editor
    await drive.permissions.create({
      fileId: spreadsheetId,
      requestBody: {
        type: 'user',
        role: 'writer',
        emailAddress: userEmail,
      },
      sendNotificationEmail: true,
    });

    // Transfer ownership to user (so they own it)
    // Note: This may fail if the user is not in the same domain, so we wrap in try-catch
    try {
      const permissionsResponse = await drive.permissions.list({
        fileId: spreadsheetId,
        fields: 'permissions(id,emailAddress)',
      });

      const userPermission = permissionsResponse.data.permissions?.find(
        p => p.emailAddress?.toLowerCase() === userEmail.toLowerCase()
      );

      if (userPermission?.id) {
        await drive.permissions.update({
          fileId: spreadsheetId,
          permissionId: userPermission.id,
          transferOwnership: true,
          requestBody: {
            role: 'owner',
          },
        });
      }
    } catch {
      // Ownership transfer failed, user is still an editor which is fine
      console.log('Could not transfer ownership, user remains as editor');
    }

    return {
      spreadsheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
    };
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('Error creating template spreadsheet:', err);
    return {
      spreadsheetId: '',
      spreadsheetUrl: '',
      error: err.message || 'Failed to create spreadsheet',
    };
  }
}

export async function createCreditCardsTemplateSpreadsheet(userEmail: string): Promise<{
  spreadsheetId: string;
  spreadsheetUrl: string;
  error?: string
}> {
  const { sheets, drive } = getGoogleSheetsClientFull();

  try {
    // Create the spreadsheet with template
    const createResponse = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: 'WealthTrack - Credit Cards Tracker',
        },
        sheets: [
          {
            properties: {
              title: 'Credit Cards',
              gridProperties: {
                frozenRowCount: 1,
              },
            },
            data: [
              {
                startRow: 0,
                startColumn: 0,
                rowData: [
                  {
                    values: [
                      { userEnteredValue: { stringValue: 'Card Name' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Last 4' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Status' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Signup Bonus' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'SUB Requirement' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Current Spend' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'SUB Deadline' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Got Bonus' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Annual Fee' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Signup Date' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Annual Fee Date' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Close Date' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Notes' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                    ],
                  },
                  // Sample row with example data
                  {
                    values: [
                      { userEnteredValue: { stringValue: 'Chase Sapphire Preferred' } },
                      { userEnteredValue: { stringValue: '1234' } },
                      { userEnteredValue: { stringValue: 'active' } },
                      { userEnteredValue: { stringValue: '60,000 points' } },
                      { userEnteredValue: { numberValue: 4000 }, userEnteredFormat: { numberFormat: { type: 'CURRENCY' } } },
                      { userEnteredValue: { numberValue: 1500 }, userEnteredFormat: { numberFormat: { type: 'CURRENCY' } } },
                      { userEnteredValue: { stringValue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] } },
                      { userEnteredValue: { stringValue: 'FALSE' } },
                      { userEnteredValue: { numberValue: 95 }, userEnteredFormat: { numberFormat: { type: 'CURRENCY' } } },
                      { userEnteredValue: { stringValue: new Date().toISOString().split('T')[0] } },
                      { userEnteredValue: { stringValue: '' } },
                      { userEnteredValue: { stringValue: '' } },
                      { userEnteredValue: { stringValue: 'Sample card - update with your data' } },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    const spreadsheetId = createResponse.data.spreadsheetId;
    if (!spreadsheetId) {
      throw new Error('Failed to create spreadsheet');
    }

    // Auto-resize columns
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: 0,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: 13,
              },
            },
          },
        ],
      },
    });

    // Share with service account (so it can read later)
    await drive.permissions.create({
      fileId: spreadsheetId,
      requestBody: {
        type: 'user',
        role: 'reader',
        emailAddress: SERVICE_ACCOUNT_EMAIL,
      },
      sendNotificationEmail: false,
    });

    // Share with user as owner/editor
    await drive.permissions.create({
      fileId: spreadsheetId,
      requestBody: {
        type: 'user',
        role: 'writer',
        emailAddress: userEmail,
      },
      sendNotificationEmail: true,
    });

    // Transfer ownership to user
    try {
      const permissionsResponse = await drive.permissions.list({
        fileId: spreadsheetId,
        fields: 'permissions(id,emailAddress)',
      });

      const userPermission = permissionsResponse.data.permissions?.find(
        p => p.emailAddress?.toLowerCase() === userEmail.toLowerCase()
      );

      if (userPermission?.id) {
        await drive.permissions.update({
          fileId: spreadsheetId,
          permissionId: userPermission.id,
          transferOwnership: true,
          requestBody: {
            role: 'owner',
          },
        });
      }
    } catch {
      console.log('Could not transfer ownership, user remains as editor');
    }

    return {
      spreadsheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
    };
  } catch (error: unknown) {
    const err = error as { message?: string; code?: number; errors?: Array<{ reason?: string; domain?: string }> };
    console.error('Error creating credit cards template spreadsheet:', JSON.stringify(err, null, 2));

    // Provide more helpful error message
    let errorMessage = err.message || 'Failed to create spreadsheet';
    if (err.errors && err.errors.length > 0) {
      const reasons = err.errors.map(e => e.reason).join(', ');
      errorMessage = `${errorMessage} (${reasons})`;
    }

    return {
      spreadsheetId: '',
      spreadsheetUrl: '',
      error: errorMessage,
    };
  }
}

export async function fetchCreditCardsSheetData(sheetId: string): Promise<CreditCardSheetRow[]> {
  const sheets = getGoogleSheetsClient();

  // First, get the sheet metadata to find the correct sheet name
  const metadata = await sheets.spreadsheets.get({
    spreadsheetId: sheetId,
    fields: 'sheets.properties.title',
  });

  const sheetNames = metadata.data.sheets?.map(s => s.properties?.title) || [];

  // Try to find 'Credit Cards' sheet, otherwise use the first sheet
  let sheetName = sheetNames.find(name =>
    name?.toLowerCase() === 'credit cards' ||
    name?.toLowerCase() === 'creditcards' ||
    name?.toLowerCase() === 'cards'
  ) || sheetNames[0] || 'Sheet1';

  // Fetch data from the sheet
  // Expected columns: Card Name, Last 4, Status, Signup Bonus, SUB Requirement, Current Spend, SUB Deadline, Got Bonus, Annual Fee, Signup Date, Annual Fee Date, Close Date, Notes
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `'${sheetName}'!A2:M1000`, // Skip header row, quote sheet name to handle spaces
  });

  const rows = response.data.values || [];

  return rows
    .filter((row) => row[0]) // Filter out rows without a card name
    .map((row) => ({
      card_name: row[0] || '',
      last_four: row[1] || '',
      status: parseStatus(row[2]),
      signup_bonus: row[3] || '',
      sub_requirement: parseNumber(row[4]),
      current_spend: parseNumber(row[5]),
      sub_deadline: parseDate(row[6]) || '',
      got_bonus: parseBoolean(row[7]),
      annual_fee: parseNumber(row[8]),
      signup_date: parseDate(row[9]) || '',
      annual_fee_date: parseDate(row[10]) || '',
      close_date: parseDate(row[11]) || '',
      notes: row[12] || '',
    }));
}

function parseStatus(value: string | undefined): CreditCardStatus {
  if (!value) return 'active';
  const normalized = value.toLowerCase().trim();
  if (normalized === 'pending') return 'pending';
  if (normalized === 'closed') return 'closed';
  return 'active';
}

function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.toLowerCase().trim();
  return normalized === 'true' || normalized === 'yes' || normalized === '1';
}

function parseIncomeType(value: string | undefined): ConsultingIncomeType {
  if (!value) return 'consulting';
  const normalized = value.toLowerCase().trim();
  if (normalized === 'freelance') return 'freelance';
  if (normalized === 'part-time' || normalized === 'part time') return 'part-time';
  if (normalized === 'contract') return 'contract';
  if (normalized === 'other') return 'other';
  return 'consulting';
}

export async function createConsultingIncomeTemplateSpreadsheet(userEmail: string): Promise<{
  spreadsheetId: string;
  spreadsheetUrl: string;
  error?: string
}> {
  const { sheets, drive } = getGoogleSheetsClientFull();

  try {
    // Create the spreadsheet with template
    const createResponse = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: 'WealthTrack - Consulting Income Tracker',
        },
        sheets: [
          {
            properties: {
              title: 'Consulting Income',
              gridProperties: {
                frozenRowCount: 1,
              },
            },
            data: [
              {
                startRow: 0,
                startColumn: 0,
                rowData: [
                  {
                    values: [
                      { userEnteredValue: { stringValue: 'Year' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Gross Income' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Tax Rate (%)' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Client/Project' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Income Type' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                      { userEnteredValue: { stringValue: 'Notes' }, userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 } } },
                    ],
                  },
                  // Sample row with example data
                  {
                    values: [
                      { userEnteredValue: { numberValue: new Date().getFullYear() } },
                      { userEnteredValue: { numberValue: 30000 }, userEnteredFormat: { numberFormat: { type: 'CURRENCY' } } },
                      { userEnteredValue: { numberValue: 20 }, userEnteredFormat: { numberFormat: { type: 'NUMBER', pattern: '0.0' } } },
                      { userEnteredValue: { stringValue: 'Example Client' } },
                      { userEnteredValue: { stringValue: 'consulting' } },
                      { userEnteredValue: { stringValue: 'Sample entry - update with your projected consulting income' } },
                    ],
                  },
                  // Second sample row for future year
                  {
                    values: [
                      { userEnteredValue: { numberValue: new Date().getFullYear() + 1 } },
                      { userEnteredValue: { numberValue: 25000 }, userEnteredFormat: { numberFormat: { type: 'CURRENCY' } } },
                      { userEnteredValue: { numberValue: 20 }, userEnteredFormat: { numberFormat: { type: 'NUMBER', pattern: '0.0' } } },
                      { userEnteredValue: { stringValue: 'Example Client' } },
                      { userEnteredValue: { stringValue: 'consulting' } },
                      { userEnteredValue: { stringValue: 'Projected income for next year' } },
                    ],
                  },
                ],
              },
            ],
          },
          // Add a second sheet with instructions
          {
            properties: {
              title: 'Instructions',
            },
            data: [
              {
                startRow: 0,
                startColumn: 0,
                rowData: [
                  { values: [{ userEnteredValue: { stringValue: 'WealthTrack Consulting Income Tracker' }, userEnteredFormat: { textFormat: { bold: true, fontSize: 14 } } }] },
                  { values: [{ userEnteredValue: { stringValue: '' } }] },
                  { values: [{ userEnteredValue: { stringValue: 'This sheet tracks your expected consulting/part-time income for semi-retirement planning.' } }] },
                  { values: [{ userEnteredValue: { stringValue: '' } }] },
                  { values: [{ userEnteredValue: { stringValue: 'Column Definitions:' }, userEnteredFormat: { textFormat: { bold: true } } }] },
                  { values: [{ userEnteredValue: { stringValue: '• Year: The year this income is expected (e.g., 2025, 2026)' } }] },
                  { values: [{ userEnteredValue: { stringValue: '• Gross Income: Total annual income before taxes' } }] },
                  { values: [{ userEnteredValue: { stringValue: '• Tax Rate (%): Your effective tax rate (federal + state + self-employment), typically 20-35%' } }] },
                  { values: [{ userEnteredValue: { stringValue: '• Client/Project: Optional - name of client or project' } }] },
                  { values: [{ userEnteredValue: { stringValue: '• Income Type: consulting, freelance, part-time, contract, or other' } }] },
                  { values: [{ userEnteredValue: { stringValue: '• Notes: Any additional notes about this income' } }] },
                  { values: [{ userEnteredValue: { stringValue: '' } }] },
                  { values: [{ userEnteredValue: { stringValue: 'Tips:' }, userEnteredFormat: { textFormat: { bold: true } } }] },
                  { values: [{ userEnteredValue: { stringValue: '• Add one row per year of expected consulting income' } }] },
                  { values: [{ userEnteredValue: { stringValue: '• Be conservative with estimates - it\'s better to underestimate' } }] },
                  { values: [{ userEnteredValue: { stringValue: '• Update regularly as your plans become clearer' } }] },
                  { values: [{ userEnteredValue: { stringValue: '• The retirement calculator will use the most recent year\'s data as the baseline' } }] },
                ],
              },
            ],
          },
        ],
      },
    });

    const spreadsheetId = createResponse.data.spreadsheetId;
    if (!spreadsheetId) {
      throw new Error('Failed to create spreadsheet');
    }

    // Auto-resize columns
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: 0,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: 6,
              },
            },
          },
        ],
      },
    });

    // Share with service account (so it can read later)
    await drive.permissions.create({
      fileId: spreadsheetId,
      requestBody: {
        type: 'user',
        role: 'reader',
        emailAddress: SERVICE_ACCOUNT_EMAIL,
      },
      sendNotificationEmail: false,
    });

    // Share with user as owner/editor
    await drive.permissions.create({
      fileId: spreadsheetId,
      requestBody: {
        type: 'user',
        role: 'writer',
        emailAddress: userEmail,
      },
      sendNotificationEmail: true,
    });

    // Transfer ownership to user
    try {
      const permissionsResponse = await drive.permissions.list({
        fileId: spreadsheetId,
        fields: 'permissions(id,emailAddress)',
      });

      const userPermission = permissionsResponse.data.permissions?.find(
        p => p.emailAddress?.toLowerCase() === userEmail.toLowerCase()
      );

      if (userPermission?.id) {
        await drive.permissions.update({
          fileId: spreadsheetId,
          permissionId: userPermission.id,
          transferOwnership: true,
          requestBody: {
            role: 'owner',
          },
        });
      }
    } catch {
      console.log('Could not transfer ownership, user remains as editor');
    }

    return {
      spreadsheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
    };
  } catch (error: unknown) {
    const err = error as { message?: string; code?: number; errors?: Array<{ reason?: string; domain?: string }> };
    console.error('Error creating consulting income template spreadsheet:', JSON.stringify(err, null, 2));

    let errorMessage = err.message || 'Failed to create spreadsheet';
    if (err.errors && err.errors.length > 0) {
      const reasons = err.errors.map(e => e.reason).join(', ');
      errorMessage = `${errorMessage} (${reasons})`;
    }

    return {
      spreadsheetId: '',
      spreadsheetUrl: '',
      error: errorMessage,
    };
  }
}

export async function fetchConsultingIncomeSheetData(sheetId: string): Promise<ConsultingIncomeSheetRow[]> {
  const sheets = getGoogleSheetsClient();

  // First, get the sheet metadata to find the correct sheet name
  const metadata = await sheets.spreadsheets.get({
    spreadsheetId: sheetId,
    fields: 'sheets.properties.title',
  });

  const sheetNames = metadata.data.sheets?.map(s => s.properties?.title) || [];

  // Try to find 'Consulting Income' sheet, otherwise use the first sheet
  let sheetName = sheetNames.find(name =>
    name?.toLowerCase() === 'consulting income' ||
    name?.toLowerCase() === 'consultingincome' ||
    name?.toLowerCase() === 'income'
  ) || sheetNames[0] || 'Sheet1';

  // Fetch data from the sheet
  // Expected columns: Year, Gross Income, Tax Rate (%), Client/Project, Income Type, Notes
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `'${sheetName}'!A2:F1000`, // Skip header row, quote sheet name to handle spaces
  });

  const rows = response.data.values || [];

  return rows
    .filter((row) => row[0] && row[1]) // Filter out rows without year or income
    .map((row) => ({
      year: parseInt(row[0]) || new Date().getFullYear(),
      gross_income: parseNumber(row[1]),
      effective_tax_rate: parseNumber(row[2]) / 100, // Convert from percentage to decimal
      client_name: row[3] || undefined,
      income_type: parseIncomeType(row[4]),
      notes: row[5] || undefined,
    }));
}

// Helper to get aggregated consulting income for a specific year range
export function aggregateConsultingIncomeByYear(
  rows: ConsultingIncomeSheetRow[],
  startYear: number,
  endYear: number
): { year: number; totalGrossIncome: number; avgTaxRate: number }[] {
  const yearMap = new Map<number, { total: number; taxSum: number; count: number }>();

  rows.forEach(row => {
    if (row.year >= startYear && row.year <= endYear) {
      const existing = yearMap.get(row.year) || { total: 0, taxSum: 0, count: 0 };
      yearMap.set(row.year, {
        total: existing.total + row.gross_income,
        taxSum: existing.taxSum + row.effective_tax_rate,
        count: existing.count + 1,
      });
    }
  });

  return Array.from(yearMap.entries())
    .map(([year, data]) => ({
      year,
      totalGrossIncome: data.total,
      avgTaxRate: data.taxSum / data.count,
    }))
    .sort((a, b) => a.year - b.year);
}
