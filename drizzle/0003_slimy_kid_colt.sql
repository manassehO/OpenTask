ALTER TABLE "opentask_submissions" DROP CONSTRAINT "opentask_submissions_task_id_opentask_tasks_task_id_fk";
--> statement-breakpoint
ALTER TABLE "opentask_submissions" DROP CONSTRAINT "opentask_submissions_completer_user_id_opentask_user_id_fk";
--> statement-breakpoint
ALTER TABLE "opentask_submissions" ALTER COLUMN "task_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "opentask_submissions" ALTER COLUMN "completer_user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "opentask_submissions" ALTER COLUMN "completer_user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "opentask_submissions" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "opentask_submissions" ADD COLUMN "data_ref" text;--> statement-breakpoint
ALTER TABLE "opentask_submissions" ADD COLUMN "rejection_reason" text NOT NULL;--> statement-breakpoint
ALTER TABLE "opentask_submissions" ADD COLUMN "approval_tx_hash" varchar(255);--> statement-breakpoint
ALTER TABLE "opentask_submissions" ADD COLUMN "reviewed_at" timestamp;--> statement-breakpoint
ALTER TABLE "opentask_submissions" ADD COLUMN "submitted_at" timestamp NOT NULL;--> statement-breakpoint
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
ALTER TABLE "opentask_submissions" DROP COLUMN IF EXISTS "submission_url";--> statement-breakpoint
ALTER TABLE "opentask_submissions" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "opentask_submissions" DROP COLUMN IF EXISTS "updated_at";