ALTER TABLE "opentask_verification" DROP CONSTRAINT "opentask_verification_value_unique";--> statement-breakpoint
ALTER TABLE "opentask_verification" DROP CONSTRAINT "opentask_verification_identifier_opentask_user_id_fk";
--> statement-breakpoint
ALTER TABLE "opentask_verification" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "opentask_verification" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "opentask_verification" ALTER COLUMN "identifier" SET DATA TYPE text;