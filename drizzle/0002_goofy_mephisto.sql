ALTER TABLE "opentask_account" DROP CONSTRAINT "opentask_account_userId_opentask_user_id_fk";
--> statement-breakpoint
ALTER TABLE "opentask_account" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opentask_account" ADD CONSTRAINT "opentask_account_user_id_opentask_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."opentask_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "opentask_account" DROP COLUMN IF EXISTS "userId";