CREATE TABLE IF NOT EXISTS "opentask_admin_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" text NOT NULL,
	"action" text NOT NULL,
	"target_table" text NOT NULL,
	"target_id" uuid,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "opentask_disputes" (
	"dispute_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"completer_claim" text NOT NULL,
	"creator_response" text,
	"admin_resolver_id" text,
	"status" "dispute_status" DEFAULT 'OPEN' NOT NULL,
	"resolution" "dispute_resolution",
	"admin_notes" text,
	"flag_tx_hash" varchar(66),
	"resolve_tx_hash" varchar(66),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "opentask_disputes_submission_id_unique" UNIQUE("submission_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "opentask_user_balances" (
	"user_address" varchar(100) PRIMARY KEY NOT NULL,
	"balance" bigint NOT NULL,
	"token" varchar(100) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "opentask_submissions" ALTER COLUMN "rejection_reason" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "opentask_task_claims" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "opentask_task_claims" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "opentask_tasks" ADD COLUMN "max_completions" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opentask_admin_logs" ADD CONSTRAINT "opentask_admin_logs_admin_id_opentask_user_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."opentask_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opentask_disputes" ADD CONSTRAINT "opentask_disputes_submission_id_opentask_submissions_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."opentask_submissions"("submission_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opentask_disputes" ADD CONSTRAINT "opentask_disputes_admin_resolver_id_opentask_user_id_fk" FOREIGN KEY ("admin_resolver_id") REFERENCES "public"."opentask_user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
