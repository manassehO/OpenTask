import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { emailOTP } from 'better-auth/plugins';
import { createAuthMiddleware } from 'better-auth/api';
// import * as schema from '~/server/db/schema';
import { NotificationsService } from '~/services/notifications';
import { env } from '~/env';
import { db } from '~/server/db';
import { sendOtp } from '~/server/email';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: {
        id: 'uuid',
        email: 'string',
        password: 'string',
        name: 'string',
        role: 'string',
      },
      session: {
        id: 'uuid',
        userId: 'uuid',
        expires: 'date',
      },
    },
  }),

  secret: env.BETTER_AUTH_SECRET,
  basePath: '/api/auth',
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'COMPLETER',
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
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

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 60,
      async sendVerificationOTP({ email, otp }) {
        console.log('Sending verification OTP to', email, otp);
        await sendOtp(email, otp);
      },
    }),
  ],

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith('/sign-up')) {
        const newSession = ctx.context.newSession;
        if (newSession) {
          // Send welcome notification
          await NotificationsService.sendWelcome(newSession.user.id);
        }
      }
    }),
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
