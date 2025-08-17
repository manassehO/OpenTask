import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '~/server/db';

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as {
      email?: string;
      password?: string;
    };

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Find user by email
    const userRecord = await db.query.user.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!userRecord) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // Find the email-provider account for that user
    const accountRecord = await db.query.account.findFirst({
      where: (accounts, { and, eq }) =>
        and(
          eq(accounts.userId, userRecord.id),
          eq(accounts.providerId, 'email'),
        ),
    });

    if (!accountRecord?.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // Verify password
    const passwordValid = await bcrypt.compare(
      password,
      accountRecord.password,
    );
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // Return user without exposing account/password fields
    const { /* no password on user */ ...safeUser } = userRecord;
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
