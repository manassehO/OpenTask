ALTER TABLE "opentask_account" ALTER COLUMN "userId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "opentask_session" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "opentask_tasks" ALTER COLUMN "creator_user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "opentask_user" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "opentask_user" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "opentask_wallets" ALTER COLUMN "user_id" SET DATA TYPE text;