CREATE TYPE submission_status AS ENUM(
	'PENDING_REVIEW',
	'APPROVED',
	'REJECTED',
  	'DISPUTED'
);

CREATE TABLE IF NOT EXISTS "opentask_account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"idToken" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "opentask_nonce_verification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "opentask_nonce_verification_value_unique" UNIQUE("value")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "opentask_onchain_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" varchar(100) NOT NULL,
	"token" varchar(50),
	"event_type" varchar(50),
	"amount" varchar(50),
	"timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "opentask_otps" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"code" varchar NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "opentask_otps_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "opentask_session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "opentask_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "opentask_submissions" (
	"submission_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid,
	"completer_user_id" uuid,
	"status" "submission_status" NOT NULL,
	"data_ref" text,
	"rejection_reason" text NOT NULL,
	"approval_tx_hash" varchar(255),
	"reviewed_at" timestamp,
	"submitted_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "opentask_task_claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "opentask_tasks" (
	"task_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_user_id" text NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"instructions" text NOT NULL,
	"category" varchar NOT NULL,
	"reward_amount" numeric NOT NULL,
	"reward_token_address" varchar(100) NOT NULL,
	"platform_fee" numeric(20, 0),
	"approved_completions" integer DEFAULT 0 NOT NULL,
	"in_progress_completions" integer DEFAULT 0 NOT NULL,
	"required_completions" integer NOT NULL,
	"status" "task_status" DEFAULT 'DRAFT' NOT NULL,
	"funding_tx_hash" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"max_completions" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "opentask_user" (
	"id" text PRIMARY KEY NOT NULL,
	"oauth_id" varchar(128),
	"name" text,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"display_name" varchar(150),
	"status" "status" DEFAULT 'ACTIVE' NOT NULL,
	"image" text,
	"role" "roles" DEFAULT 'COMPLETER' NOT NULL,
	"wallet_address" varchar(100),
	"hash_private_key" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "opentask_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "opentask_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "opentask_wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"starknet_address" varchar(100) NOT NULL,
	"wallet_type" "wallet_type" NOT NULL,
	"is_active" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"hashed_private_key" text NOT NULL,
	CONSTRAINT "opentask_wallets_starknet_address_unique" UNIQUE("starknet_address")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opentask_account" ADD CONSTRAINT "opentask_account_user_id_opentask_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."opentask_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opentask_nonce_verification" ADD CONSTRAINT "opentask_nonce_verification_identifier_opentask_user_id_fk" FOREIGN KEY ("identifier") REFERENCES "public"."opentask_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opentask_session" ADD CONSTRAINT "opentask_session_user_id_opentask_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."opentask_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opentask_submissions" ADD CONSTRAINT "opentask_submissions_task_id_opentask_tasks_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."opentask_tasks"("task_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opentask_submissions" ADD CONSTRAINT "opentask_submissions_completer_user_id_opentask_user_id_fk" FOREIGN KEY ("completer_user_id") REFERENCES "public"."opentask_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opentask_task_claims" ADD CONSTRAINT "opentask_task_claims_task_id_opentask_tasks_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."opentask_tasks"("task_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opentask_task_claims" ADD CONSTRAINT "opentask_task_claims_user_id_opentask_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."opentask_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opentask_tasks" ADD CONSTRAINT "opentask_tasks_creator_user_id_opentask_user_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."opentask_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opentask_wallets" ADD CONSTRAINT "opentask_wallets_user_id_opentask_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."opentask_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "opentask_wallets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "starknet_address_idx" ON "opentask_wallets" USING btree ("starknet_address");