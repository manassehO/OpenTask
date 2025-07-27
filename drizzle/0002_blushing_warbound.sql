CREATE TYPE submission_status AS ENUM(
	'PENDING_REVIEW',
	'APPROVED',
	'REJECTED',
  	'DISPUTED'
);

CREATE TABLE IF NOT EXISTS "opentask_submissions" (
	"submission_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"completer_user_id" text NOT NULL,
	"status" "submission_status" DEFAULT 'PENDING_REVIEW' NOT NULL,
	"submission_url" varchar(2048) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "opentask_task_claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
DROP TABLE "opentask_post";--> statement-breakpoint
DROP TABLE "opentask_task";--> statement-breakpoint
ALTER TABLE "opentask_user" ALTER COLUMN "role" SET DEFAULT 'COMPLETER';--> statement-breakpoint
ALTER TABLE "opentask_tasks" ADD COLUMN "platform_fee" numeric(20, 0);--> statement-breakpoint
ALTER TABLE "opentask_tasks" ADD COLUMN "approved_completions" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "opentask_tasks" ADD COLUMN "in_progress_completions" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "opentask_user" ADD COLUMN "wallet_address" varchar(100);--> statement-breakpoint
ALTER TABLE "opentask_user" ADD COLUMN "hash_private_key" varchar(255);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opentask_submissions" ADD CONSTRAINT "opentask_submissions_task_id_opentask_tasks_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."opentask_tasks"("task_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opentask_submissions" ADD CONSTRAINT "opentask_submissions_completer_user_id_opentask_user_id_fk" FOREIGN KEY ("completer_user_id") REFERENCES "public"."opentask_user"("id") ON DELETE cascade ON UPDATE no action;
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
