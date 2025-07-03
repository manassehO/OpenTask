import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '~/server/db';
import { env } from '~/env';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  secret: env.BETTER_AUTH_SECRET,
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'user',
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (how often to update session)
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: env.GOOGLE_CLIENT_SECRET ?? '',
    },
  },
  trustedOrigins: [
    'http://localhost:3000',
    env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ],
});

// TODO: When Better Auth exposes a new user callback or OAuth success hook,
// call deployAAWallet(user.id) here to trigger AA Wallet creation.


export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
