import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { user, verification } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { token } = (await request.json()) as { token: string };

    // Validate input
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    // Find verification record
    const verificationRecord = await db.query.verification.findFirst({
      where: (verifications, { eq }) => eq(verifications.value, token),
    });

    if (!verificationRecord || new Date() > verificationRecord.expiresAt) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 },
      );
    }

    // Find user
    const userRecord = await db.query.user.findFirst({
      where: (users, { eq }) => eq(users.email, verificationRecord.identifier),
    });

    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user as verified
    await db
      .update(user)
      .set({
        emailVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userRecord.id));

    // Delete verification record
    await db
      .delete(verification)
      .where(eq(verification.id, verificationRecord.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verification error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
