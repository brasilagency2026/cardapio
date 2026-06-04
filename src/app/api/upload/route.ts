import { NextRequest, NextResponse } from 'next/server';

/**
 * Upload image to Cloudflare R2
 * Requires: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, CLOUDFLARE_R2_BUCKET_NAME
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;

    if (!accountId || !apiToken || !bucketName) {
      return NextResponse.json(
        { error: 'Cloudflare R2 credentials not configured' },
        { status: 500 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
    const r2Url = `https://${bucketName}.r2.io/${filename}`;

    // Upload to Cloudflare R2
    const uploadUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/objects/${filename}`;

    const buffer = await file.arrayBuffer();
    
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': file.type,
      },
      body: buffer,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Cloudflare R2 upload error:', error);
      return NextResponse.json(
        { error: 'Failed to upload file to Cloudflare R2' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: r2Url,
      filename: filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
