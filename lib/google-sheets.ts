import { google } from 'googleapis';
import type { SheetRow } from './types';

// Initialize Google Sheets API with service account
function getGoogleSheetsClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return google.sheets({ version: 'v4', auth });
}

export async function fetchSheetData(sheetId: string): Promise<SheetRow[]> {
  const sheets = getGoogleSheetsClient();

  // Fetch data from the first sheet, assuming headers in row 1
  // Expected columns: Date, Stocks, Bonds, Cash, Real Estate, Points Value, Other Assets, Total Debts, Notes
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'A2:I1000', // Skip header row, get up to 1000 rows
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
      other_assets: parseNumber(row[6]),
      total_debts: parseNumber(row[7]),
      notes: row[8] || undefined,
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

export async function getSheetMetadata(sheetId: string) {
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
  } catch {
    return {
      title: null,
      valid: false,
    };
  }
}
