import { type NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { submissions } from '~/server/db/schema';
import { userBalances } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

const WEBHOOK_SECRET = process.env.APIBARA_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature');

    if (!signature || !WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const crypto = await import('crypto');
    const expectedSig = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSig) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { taskId, completer, amount, token, txHash } = JSON.parse(
      rawBody,
    ) as {
      taskId: string;
      completer: string;
      amount: string;
      token: string;
      txHash: string;
    };

    if (!taskId || !completer || !amount || !txHash) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // 1. Update Submissions
    await db
      .update(submissions)
      .set({
        status: 'APPROVED',
        approvalTxHash: txHash,
      })
      .where(eq(submissions.taskId, taskId));

    // 2. Update or insert User Balance
    const existing = await db
      .select()
      .from(userBalances)
      .where(eq(userBalances.userAddress, completer))
      .then((rows) => rows[0]);

    if (existing) {
      const newBalance = BigInt(existing.balance) + BigInt(amount);
      await db
        .update(userBalances)
        .set({
          balance: newBalance,
        })
        .where(eq(userBalances.userAddress, completer));
    } else {
      const balanceValue = BigInt(amount);
      await db.insert(userBalances).values({
        userAddress: completer,
        balance: balanceValue,
        token,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
