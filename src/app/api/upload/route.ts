import { NextRequest, NextResponse } from 'next/server';
import { createHmac, createHash } from 'crypto';

// ─── AWS Signature V4 pour Cloudflare R2 ─────────────────────────

function sha256hex(data: string | Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}

function hmacSha256(key: Buffer | string, data: string): Buffer {
  return createHmac('sha256', key).update(data).digest();
}

function getSigningKey(secretKey: string, date: string, region: string, service: string): Buffer {
  const kDate    = hmacSha256(`AWS4${secretKey}`, date);
  const kRegion  = hmacSha256(kDate, region);
  const kService = hmacSha256(kRegion, service);
  const kSigning = hmacSha256(kService, 'aws4_request');
  return kSigning;
}

async function r2PutObject(opts: {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<void> {
  const { accountId, accessKeyId, secretAccessKey, bucketName, key, body, contentType } = opts;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '').slice(0, 15) + 'Z';
  const dateStamp = amzDate.slice(0, 8);
  const region = 'auto';
  const service = 's3';

  const host = `${accountId}.r2.cloudflarestorage.com`;
  const url = `https://${host}/${bucketName}/${key}`;

  const payloadHash = sha256hex(body);
  const canonicalHeaders =
    `content-type:${contentType}\n` +
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;
  const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date';

  const canonicalRequest = [
    'PUT',
    `/${bucketName}/${key}`,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    sha256hex(canonicalRequest),
  ].join('\n');

  const signingKey = getSigningKey(secretAccessKey, dateStamp, region, service);
  const signature = createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  const authorization =
    `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': authorization,
      'Content-Type': contentType,
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': amzDate,
    },
    body,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`R2 ${response.status}: ${err}`);
  }
}

// ─── Route handler ────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande. Máximo 5MB.' }, { status: 400 });
    }

    const accountId       = process.env.CLOUDFLARE_ACCOUNT_ID;
    const accessKeyId     = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
    const bucketName      = process.env.CLOUDFLARE_R2_BUCKET_NAME;
    const r2Domain        = process.env.CLOUDFLARE_R2_DOMAIN;

    const r2Configured = !!(accountId && accessKeyId && secretAccessKey && bucketName);

    if (r2Configured) {
      try {
        const timestamp = Date.now();
        const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
        const key = `uploads/${timestamp}.${ext}`;
        const buffer = Buffer.from(await file.arrayBuffer());

        await r2PutObject({
          accountId: accountId!,
          accessKeyId: accessKeyId!,
          secretAccessKey: secretAccessKey!,
          bucketName: bucketName!,
          key,
          body: buffer,
          contentType: file.type || 'image/jpeg',
        });

        const domain = r2Domain ?? `${bucketName}.r2.dev`;
        const publicUrl = `https://${domain}/${key}`;

        return NextResponse.json({ url: publicUrl, filename: key, storage: 'r2' });
      } catch (r2Error) {
        console.error('R2 upload failed, using base64 fallback:', r2Error);
        // Fallback automático
      }
    }

    // Fallback: base64 data URL
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ url: dataUrl, filename: file.name, storage: 'dataurl' });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
