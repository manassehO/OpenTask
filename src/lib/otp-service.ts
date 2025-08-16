import { db } from '~/server/db';
import { otps } from '~/server/db/schema';
import { sendEmail } from './email-service';
import { eq } from 'drizzle-orm';

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (email: string) => {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Create or update OTP
  await db
    .insert(otps)
    .values({
      otpId: crypto.randomUUID(),
      email,
      code: otp,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: otps.email,
      set: {
        code: otp,
        expiresAt,
        updatedAt: new Date(),
      },
    });

  // Send email
  await sendEmail({
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
    html: `
      <div></div>
        <h2>OTP Verification</h2>
        <p>Your OTP code is: <strong>${otp}</strong></p>
      </div>
    `,
  });

  return otp;
};

export const verifyOTP = async (email: string, otp: string) => {
  const otpRecord = await db.query.otps.findFirst({
    where: (otps, { eq }) => eq(otps.email, email),
  });

  if (!otpRecord || otpRecord.code !== otp) {
    return false;
  }

  // Check if OTP is expired
  if (new Date() > otpRecord.expiresAt) {
    await db.delete(otps).where(eq(otps.email, email));
    return false;
  }

  // Delete OTP after successful verification
  await db.delete(otps).where(eq(otps.email, email));
  return true;
};

export const getOTP = async (email: string) => {
  const otpRecord = await db.query.otps.findFirst({
    where: (otps, { eq }) => eq(otps.email, email),
  });

  if (!otpRecord) {
    return null;
  }

  // Check if OTP is expired
  if (new Date() > otpRecord.expiresAt) {
    await db.delete(otps).where(eq(otps.email, email));
    return null;
  }

  return otpRecord.code;
};
