ALTER TABLE "opentask_account" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "opentask_account" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "opentask_account" ALTER COLUMN "userId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "opentask_nonce_verification" ALTER COLUMN "identifier" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "opentask_otps" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "opentask_otps" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "opentask_session" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "opentask_session" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "opentask_session" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "opentask_user" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "opentask_user" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "opentask_verification" ALTER COLUMN "identifier" SET DATA TYPE text;