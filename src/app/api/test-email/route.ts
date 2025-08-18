// app/api/test-email/route.ts
import { sendEmail } from '~/lib/email-service';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { to } = (await request.json()) as { to: string };

    await sendEmail({
      to,
      subject: 'Test Email',
      text: 'This is a test email from our application',
      html: '<strong>This is a test email from our application</strong>',
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
