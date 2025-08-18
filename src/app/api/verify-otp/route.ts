import { NextResponse } from 'next/server';
import { verifyOTPClient } from '~/lib/client-otp';

export async function POST(request: Request) {
  try {
    const { email, otp } = (await request.json()) as {
      email?: string;
      otp?: string;
    };
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 },
      );
    }
    const isValid = await verifyOTPClient(email, otp);
    if (!isValid) {
      return NextResponse.json(
        { valid: false, error: 'Invalid OTP or expired' },
        { status: 401 },
      );
    }
    return NextResponse.json({ valid: true });
  } catch (error: unknown) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to verify OTP',
      },
      { status: 500 },
    );
  }
}
