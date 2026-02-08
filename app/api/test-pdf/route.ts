import { NextResponse } from 'next/server';

/**
 * Test endpoint to verify pdfjs-dist works in Next.js serverless
 */
export async function GET() {
  try {
    // Test if pdfjs-dist can be loaded
    const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

    return NextResponse.json({
      success: true,
      message: 'pdfjs-dist loaded successfully',
      type: typeof pdfjsLib,
      hasGetDocument: typeof pdfjsLib.getDocument === 'function',
      version: pdfjsLib.version || 'unknown',
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
