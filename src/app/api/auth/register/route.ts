import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '~/server/db';
import { account, user } from '~/server/db/schema';

export async function POST(request: Request) {
  try {
    const { email, name, password } = (await request.json()) as {
      email: string;
      name: string;
      password: string;
    };

    // Validate input
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Check if user exists
    const existingUser = await db.query.user.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and account in a transaction
    const [newUser] = await db.transaction(async (tx) => {
      // Create user
      const [userRecord] = await tx
        .insert(user)
        .values({
          id: crypto.randomUUID(),
          email,
          name,
          emailVerified: false,
          status: 'ACTIVE',
          role: 'COMPLETER',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      // Create account
      if (!userRecord) {
        throw new Error('Failed to create user record');
      }
      await tx.insert(account).values({
        id: crypto.randomUUID(),
        accountId: email,
        providerId: 'email',
        userId: userRecord.id,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return [userRecord];
    });

    // Return user without sensitive data
    const { ...safeUser } = newUser;
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
