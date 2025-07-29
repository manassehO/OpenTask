CREATE TABLE IF NOT EXISTS "opentask_user_balances" (
	"user_address" varchar(100) PRIMARY KEY NOT NULL,
	"balance" bigint NOT NULL,
	"token" varchar(100) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
