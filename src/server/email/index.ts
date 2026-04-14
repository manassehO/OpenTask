import { type SentMessageInfo } from 'nodemailer';
import sendEmail from '~/lib/sender';



export async function sendOtp(
  email: string,
  otp: string,
): Promise<SentMessageInfo> {
  const subject = 'Your OpenTask OTP Code';
  const html = `
    <div style="font-family: sans-serif;">
      <h2>OpenTask OTP</h2>
      <p>Your OTP code is: <b>${otp}</b></p>
      <p>This code will expire in 10 minutes.</p>
    </div>
  `;
  try {
    return await sendEmail(email, subject, html);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Failed to send email:', err.message);
      throw err;
    } else {
      console.error('Unknown error sending email');
      throw new Error('Unknown error sending email');
    }
  }
}
