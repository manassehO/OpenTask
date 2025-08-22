import { NextResponse } from 'next/server';
import { sendOTPClient } from '~/lib/client-otp';

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email: string };
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    await sendOTPClient(email);
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    const errorMessage =
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as { message?: unknown }).message === 'string'
        ? (error as { message: string }).message
        : undefined;
    return NextResponse.json(
      { error: errorMessage ?? 'Failed to send OTP' },
      { status: 500 },
    );
  }
}
