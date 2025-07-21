import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, time, name, location, event, imageUrl } = body;

    const sheets = google.sheets({ version: 'v4', auth });
    // Append the new report to the sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: 'รายงาน!A:F',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[date, time, name, location, event, imageUrl]],
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Report created successfully',
      data: response.data
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report', details: String(error) },
      { status: 500 }
    );
  }
} 