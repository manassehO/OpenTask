import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db/index';
import { disputes } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.APIBARA_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-signature') ?? '';
  const rawBody = await req.text();

  const isValid = verifySignature(rawBody, signature);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  try {
    const body = JSON.parse(rawBody);
    const { taskId, completer, txHash } = body;

    if (!taskId || !completer || !txHash) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await db
      .update(disputes)
      .set({
        status: 'DISPUTED',
        resolveTxHash: txHash,
        updatedAt: new Date(),
      })
      .where(eq(disputes.disputeId, taskId as string));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

function verifySignature(rawBody: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = hmac.update(rawBody).digest('hex');
  return signature === digest;
}
