// ~/lib/email-service.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === 'true', // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Simple wrapper
export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  if (!transporter) {
    throw new Error('Mail transporter not configured');
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM ?? '"No Reply" <no-reply@example.com>',
    to,
    subject,
    text,
    html,
  });

  return info;
}
