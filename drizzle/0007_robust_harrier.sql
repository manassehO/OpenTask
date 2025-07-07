ALTER TABLE "opentask_verification" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "opentask_verification" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "opentask_verification" ALTER COLUMN "identifier" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "opentask_user" ADD COLUMN "password" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opentask_verification" ADD CONSTRAINT "opentask_verification_identifier_opentask_user_id_fk" FOREIGN KEY ("identifier") REFERENCES "public"."opentask_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "opentask_verification" ADD CONSTRAINT "opentask_verification_value_unique" UNIQUE("value");