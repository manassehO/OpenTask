ALTER TABLE "opentask_wallets" DROP CONSTRAINT "opentask_wallets_user_id_opentask_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opentask_wallets" ADD CONSTRAINT "opentask_wallets_user_id_opentask_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."opentask_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
