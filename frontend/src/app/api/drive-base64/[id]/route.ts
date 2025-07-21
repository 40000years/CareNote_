import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: fileUrl } = await params;
    // ดึงไฟล์จาก Cloudinary ด้วย url (id คือ url)
    const res = await fetch(fileUrl);
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch file from Cloudinary' }, { status: 500 });
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // พยายามเดา mimeType จาก headers
    const mimeType = res.headers.get('content-type') || 'image/jpeg';
    // แปลงเป็น base64
    const base64 = buffer.toString('base64');
    return NextResponse.json({ base64, mimeType });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch file', details: String(error) }, { status: 500 });
  }
} 