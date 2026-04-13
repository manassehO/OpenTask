import { authClient } from './auth-client';

export async function sendOTPClient(email: string) {
  const result = await authClient.emailOtp.sendVerificationOtp({
    email,
    type: 'email-verification',
  });

  if (result.error) {
    throw new Error(result.error.message ?? 'Failed to send OTP');
  }
}

export async function verifyOTPClient(email: string, otp: string) {
  const result = await authClient.emailOtp.verifyEmail({
    email,
    otp,
  });

  return !result.error;
}
