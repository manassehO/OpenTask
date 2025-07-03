import nodemailer, { type Transporter, type SentMessageInfo } from 'nodemailer';

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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
    return await transporter.sendMail({
      from: '"OpenTask" <no-reply@opentask.com>',
      to: email,
      subject,
      html,
    });
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
