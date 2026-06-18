import { NextRequest, NextResponse } from 'next/server';

/**
 * Upload image to Cloudflare R2 OR fallback to data URL
 * 
 * Requires for R2 setup:
 * - CLOUDFLARE_ACCOUNT_ID (Account ID)
 * - CLOUDFLARE_API_TOKEN (API token with R2 permissions)
 * - CLOUDFLARE_R2_BUCKET_NAME (Bucket name)
 * - CLOUDFLARE_R2_DOMAIN (Optional: custom domain, defaults to {bucket}.r2.io)
 * 
 * Fallback: If R2 is not configured, uses data URL (embedded base64)
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
    const r2Domain = process.env.CLOUDFLARE_R2_DOMAIN;

    // Check if R2 is properly configured
    const r2Configured = !!(accountId && apiToken && bucketName);

    if (r2Configured) {
      // Upload to Cloudflare R2
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
      
      // Determine the public URL for the image
      const domain = r2Domain || `${bucketName}.r2.io`;
      const publicUrl = `https://${domain}/${filename}`;

      // Upload to Cloudflare R2 API endpoint
      const uploadUrl = `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${filename}`;

      const buffer = await file.arrayBuffer();
      
      console.log('Uploading to R2:', { uploadUrl, publicUrl, filename, fileSize: file.size });
      
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
        console.error('R2 upload failed:', error, { status: response.status });
        throw new Error(`R2 upload failed: ${response.status}`);
      }

      console.log('R2 upload successful:', { publicUrl });

      return NextResponse.json({
        url: publicUrl,
        filename: filename,
        storage: 'r2',
      });
    } else {
      // Fallback: Use data URL (base64 encoded image)
      console.warn('R2 not configured, using data URL fallback');
      
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;

      return NextResponse.json({
        url: dataUrl,
        filename: file.name,
        storage: 'dataurl',
        warning: 'Images are stored as base64 data URLs. Configure Cloudflare R2 for better performance.',
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
