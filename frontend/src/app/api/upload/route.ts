import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    // สร้าง formData ใหม่สำหรับ Cloudinary
    const cloudForm = new FormData();
    cloudForm.append('file', new Blob([buffer], { type: file.type }), file.name);
    cloudForm.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    // อัปโหลดไป Cloudinary
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: cloudForm,
    });
    const uploadData = await uploadRes.json();
    if (!uploadData.secure_url) {
      return NextResponse.json({ error: 'Cloudinary upload failed', details: uploadData }, { status: 500 });
    }
    return NextResponse.json({ success: true, url: uploadData.secure_url });
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
} 