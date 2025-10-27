import 'dotenv/config';
import { db } from '~/server/db';
import { userWithdrawalMethods } from '~/server/db/schema';
import { randomUUID } from 'crypto';
// import { eq } from "drizzle-orm";

// const withdrawalMethods = ['CRYPTO_WALLET', 'BANK_ACCOUNT'];

async function seedUserWithdrawalMethods() {
  console.log('Using database:', process.env.DATABASE_URL);

  const allUsers = await db.query.user.findMany();

  if (allUsers.length === 0) {
    console.error('No users found. Seed users first');
    process.exit(1);
  }

  for (const userItem of allUsers) {
    // Skip if user already has withdrawal methods
    /* const existing = await db.query.userWithdrawalMethods.findFirst({
      where: eq(userWithdrawalMethods.userId, userItem.id),
    });
    if (existing) continue; */

    // Create 2 methods per user
    for (let i = 0; i < 2; i++) {
      // const method = withdrawalMethods[Math.floor(Math.random() * withdrawalMethods.length)];
      const method = 'BANK_ACCOUNT'; // For testing purposes
      const isDefault = i === 0; // first method is default
      const name =
        method === 'CRYPTO_WALLET'
          ? `Wallet ${i + 1}`
          : `Bank Account ${i + 1}`;
      const details =
        method === 'CRYPTO_WALLET'
          ? JSON.stringify({
              address: `0xWallet${i}${userItem.id.slice(0, 6)}`,
            })
          : JSON.stringify({
              accountNumber: `12345${i}`,
              bankName: 'Sample Bank',
            });

      try {
        await db.insert(userWithdrawalMethods).values({
          methodId: randomUUID(),
          userId: userItem.id,
          method,
          name,
          details,
          isActive: true,
          isDefault,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log(
          `Withdrawal method created for user ${userItem.id}: ${name} [${method}]`,
        );
      } catch (err) {
        console.error(
          `Error creating withdrawal method for user ${userItem.id}:`,
          err,
        );
      }
    }
  }

  console.log('User withdrawal methods seeding process finished');
}

seedUserWithdrawalMethods()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Script crashed:', err);
    process.exit(1);
  });
