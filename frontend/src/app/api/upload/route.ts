import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import streamifier from 'streamifier';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const drive = google.drive({ version: 'v3', auth });
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    // ใช้ streamifier เพื่อแปลง buffer เป็น stream
    const stream = streamifier.createReadStream(buffer);
    
    // Upload to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
      },
      media: {
        mimeType: file.type,
        body: stream,
      },
    });

    const fileId = response.data.id;
    const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;

    // ตรวจสอบ permission ก่อน ถ้ายังไม่มี anyone ให้สร้าง
    if (typeof fileId === 'string') {
      const permList = await drive.permissions.list({ fileId });
      const hasAnyone = permList.data.permissions?.some(p => p.type === 'anyone');
      if (!hasAnyone) {
        const permRes = await drive.permissions.create({
          fileId,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });
        console.log('Permission create response:', permRes.data);
      } else {
        console.log('Permission already set to anyone');
      }
      // log permission list อีกครั้ง
      const permListAfter = await drive.permissions.list({ fileId });
      console.log('Permission list after:', permListAfter.data);
    } else {
      throw new Error('Invalid fileId');
    }

    return NextResponse.json({ 
      success: true,
      fileId,
      fileUrl,
      fileName: file.name
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 