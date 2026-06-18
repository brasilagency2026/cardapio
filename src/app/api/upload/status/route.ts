import { NextResponse } from 'next/server';

export async function GET() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  const r2Domain = process.env.CLOUDFLARE_R2_DOMAIN;

  return NextResponse.json({
    configured: {
      accountId: !!accountId,
      apiToken: !!apiToken,
      bucketName: !!bucketName,
      r2Domain: !!r2Domain,
    },
    values: {
      accountId: accountId || 'NOT SET',
      bucketName: bucketName || 'NOT SET',
      r2Domain: r2Domain || `${bucketName}.r2.io`,
    },
    message: !accountId || !apiToken || !bucketName 
      ? 'R2 configuration incomplete. Check .env.local'
      : 'R2 configuration complete',
  });
}
