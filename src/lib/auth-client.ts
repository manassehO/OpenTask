import { emailOTPClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import type { Session, User } from './auth';

export const authClient = createAuthClient({
  plugins: [emailOTPClient()],
  // baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  verifyEmail,
  emailOtp,
} = authClient;

export type { Session, User };
