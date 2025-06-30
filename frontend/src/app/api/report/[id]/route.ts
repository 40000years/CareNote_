import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Get all data first
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: 'รายงาน!A:F',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // Find the report by ID (row number - 1 for header)
    const reportIndex = parseInt(params.id) - 1;
    if (reportIndex < 0 || reportIndex >= rows.length - 1) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    const row = rows[reportIndex + 1]; // +1 to skip header
    const report = {
      id: parseInt(params.id),
      date: row[0] || '',
      time: row[1] || '',
      name: row[2] || '',
      location: row[3] || '',
      event: row[4] || '',
      imageUrl: row[5] || '',
    };

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
} 