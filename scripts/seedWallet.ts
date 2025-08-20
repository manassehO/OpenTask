import "dotenv/config";
import { db } from "~/server/db";
import { user, wallets } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

function fakeStarknetAddress() {
  return "0x" + randomBytes(32).toString("hex");
}

async function seedWallets() {
  console.log("Using database:", process.env.DATABASE_URL);

  const allUsers = await db.query.user.findMany();

  if (allUsers.length === 0) {
    console.error("No users found. Seed users first with BetterAuth");
    process.exit(1);
  }

  for (const u of allUsers) {
    try {
      const existingWallet = await db.query.wallets.findFirst({
        where: eq(wallets.userId, u.id),
      });

      if (existingWallet) {
        console.log(`Wallet already exists for ${u.email}, skipping`);
        continue;
      }

      const address = fakeStarknetAddress();

      await db.insert(wallets).values({
        userId: u.id,
        starknetAddress: address,
        walletType: "managed",
        hashedPrivateKey: "mock-" + randomBytes(16).toString("hex"),
        // isActive defaults to 1
      });

      console.log(`Wallet created for ${u.email}: ${address}`);
    } catch (err: any) {
      console.error(`Error seeding wallet for ${u.email}:`, err.message);
    }
  }

  console.log("Wallet seeding process finished");
}

seedWallets()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Script crashed:", err);
    process.exit(1);
  });
