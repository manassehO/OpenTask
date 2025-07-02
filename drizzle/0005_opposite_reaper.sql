ALTER TABLE "opentask_session" DROP CONSTRAINT "opentask_session_userId_opentask_user_id_fk";
--> statement-breakpoint
ALTER TABLE "opentask_user" ALTER COLUMN "role" SET DATA TYPE roles;--> statement-breakpoint
ALTER TABLE "opentask_user" ALTER COLUMN "role" SET DEFAULT 'CREATOR';--> statement-breakpoint
ALTER TABLE "opentask_account" ADD COLUMN "account_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "opentask_account" ADD COLUMN "provider_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "opentask_account" ADD COLUMN "access_token" text;--> statement-breakpoint
ALTER TABLE "opentask_account" ADD COLUMN "refresh_token" text;--> statement-breakpoint
ALTER TABLE "opentask_account" ADD COLUMN "access_token_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "opentask_account" ADD COLUMN "refresh_token_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "opentask_account" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "opentask_account" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "opentask_session" ADD COLUMN "expires_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "opentask_session" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "opentask_session" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "opentask_session" ADD COLUMN "ip_address" text;--> statement-breakpoint
ALTER TABLE "opentask_session" ADD COLUMN "user_agent" text;--> statement-breakpoint
ALTER TABLE "opentask_session" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "opentask_user" ADD COLUMN "email_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "opentask_user" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "opentask_user" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "opentask_verification" ADD COLUMN "expires_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "opentask_verification" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "opentask_verification" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opentask_session" ADD CONSTRAINT "opentask_session_user_id_opentask_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."opentask_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "opentask_account" DROP COLUMN IF EXISTS "accountId";--> statement-breakpoint
ALTER TABLE "opentask_account" DROP COLUMN IF EXISTS "providerId";--> statement-breakpoint
ALTER TABLE "opentask_account" DROP COLUMN IF EXISTS "accessToken";--> statement-breakpoint
ALTER TABLE "opentask_account" DROP COLUMN IF EXISTS "refreshToken";--> statement-breakpoint
ALTER TABLE "opentask_account" DROP COLUMN IF EXISTS "accessTokenExpiresAt";--> statement-breakpoint
ALTER TABLE "opentask_account" DROP COLUMN IF EXISTS "refreshTokenExpiresAt";--> statement-breakpoint
ALTER TABLE "opentask_account" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
ALTER TABLE "opentask_account" DROP COLUMN IF EXISTS "updatedAt";--> statement-breakpoint
ALTER TABLE "opentask_session" DROP COLUMN IF EXISTS "expiresAt";--> statement-breakpoint
ALTER TABLE "opentask_session" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
ALTER TABLE "opentask_session" DROP COLUMN IF EXISTS "updatedAt";--> statement-breakpoint
ALTER TABLE "opentask_session" DROP COLUMN IF EXISTS "ipAddress";--> statement-breakpoint
ALTER TABLE "opentask_session" DROP COLUMN IF EXISTS "userAgent";--> statement-breakpoint
ALTER TABLE "opentask_session" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
ALTER TABLE "opentask_user" DROP COLUMN IF EXISTS "emailVerified";--> statement-breakpoint
ALTER TABLE "opentask_user" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
ALTER TABLE "opentask_user" DROP COLUMN IF EXISTS "updatedAt";--> statement-breakpoint
ALTER TABLE "opentask_verification" DROP COLUMN IF EXISTS "expiresAt";--> statement-breakpoint
ALTER TABLE "opentask_verification" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
ALTER TABLE "opentask_verification" DROP COLUMN IF EXISTS "updatedAt";