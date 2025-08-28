import {
  emailOTPClient,
  inferAdditionalFields,
} from 'better-auth/client/plugins';
import { nextCookies } from 'better-auth/next-js';
import { createAuthClient } from 'better-auth/react';
import type { Session, User } from './auth';

export const authClient = createAuthClient({
  fetchOptions: {
    credentials: 'include',
  },
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: 'string',
        },
      },
    }),
    emailOTPClient(),
    nextCookies(),
  ],

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
  forgetPassword,
  resetPassword,
  getAccessToken,
  sendVerificationEmail,
} = authClient;

export type { Session, User };
