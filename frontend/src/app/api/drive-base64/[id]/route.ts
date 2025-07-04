import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const drive = google.drive({ version: 'v3', auth });
    const { id: fileId } = await params;

    // Get file metadata to know mimeType
    const meta = await drive.files.get({ fileId, fields: 'mimeType' });
    const mimeType = meta.data.mimeType || 'image/jpeg';

    // Download file as buffer
    const { data } = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );
    const buffer = Buffer.from(data as ArrayBuffer);

    // Convert to base64
    const base64 = buffer.toString('base64');
    return NextResponse.json({ base64, mimeType });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
} 