CREATE TABLE IF NOT EXISTS "opentask_nonce_verification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" uuid NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "opentask_nonce_verification_value_unique" UNIQUE("value")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opentask_nonce_verification" ADD CONSTRAINT "opentask_nonce_verification_identifier_opentask_user_id_fk" FOREIGN KEY ("identifier") REFERENCES "public"."opentask_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
