import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

export async function GET() {
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: 'รายงาน!A:F', // date, time, name, location, event, imageUrl
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ reports: [] });
    }

    // Skip header row and map to objects
    const reports = rows.slice(1).map((row, index) => ({
      id: index + 1,
      date: row[0] || '',
      time: row[1] || '',
      name: row[2] || '',
      location: row[3] || '',
      event: row[4] || '',
      imageUrl: row[5] || '',
    }));

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
} 