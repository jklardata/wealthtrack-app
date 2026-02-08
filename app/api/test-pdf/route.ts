import { NextResponse } from 'next/server';

/**
 * Test endpoint to verify pdf-parse works in Next.js
 */
export async function GET() {
  try {
    // Test if pdf-parse can be loaded
    const pdf = require('pdf-parse');

    return NextResponse.json({
      success: true,
      message: 'pdf-parse loaded successfully',
      type: typeof pdf,
      hasPdfFunction: typeof pdf === 'function',
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
