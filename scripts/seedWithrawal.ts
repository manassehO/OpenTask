import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { withdrawals } from '~/server/db/schema';

const withdrawalMethods = ['CRYPTO_WALLET', 'BANK_ACCOUNT'];
const withdrawalStatuses = [
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
];

async function seedWithdrawals() {
  console.log('Using database:', process.env.DATABASE_URL);

  const allUsers = await db.query.user.findMany();

  if (allUsers.length === 0) {
    console.error('No users found. Seed users first');
    process.exit(1);
  }

  for (const userItem of allUsers) {
    // Skip if user already has withdrawals
    const existing = await db.query.withdrawals.findFirst({
      where: (w) => eq(w.userId, userItem.id),
    });
    if (existing) continue;

    for (let i = 0; i < 2; i++) {
      // create 2 withdrawals per user
      const method =
        withdrawalMethods[Math.floor(Math.random() * withdrawalMethods.length)];
      const status =
        withdrawalStatuses[
          Math.floor(Math.random() * withdrawalStatuses.length)
        ];
      const amount = (Math.floor(Math.random() * 500) + 50).toString(); // 50-550
      const tokenAddress = '0x1234567890abcdef1234567890abcdef12345678';
      const destinationAddress =
        method === 'CRYPTO_WALLET'
          ? `0xWallet${i}${userItem.id.slice(0, 6)}`
          : null;
      const bankAccountDetails =
        method === 'BANK_ACCOUNT'
          ? JSON.stringify({ accountNumber: `12345${i}`, bank: 'Sample Bank' })
          : null;

      try {
        await db.insert(withdrawals).values({
          userId: userItem.id,
          method: method!,
          amount,
          tokenAddress,
          destinationAddress,
          bankAccountDetails,
          status: status!,
          txHash:
            status === 'COMPLETED'
              ? `0xTxHash${i}${userItem.id.slice(0, 6)}`
              : null,
          processingFee: '5', // flat sample fee
          failureReason: status === 'FAILED' ? 'Insufficient balance' : null,
          processedAt: status === 'COMPLETED' ? new Date() : null,
          createdAt: new Date(),
        } as any);

        console.log(
          `Withdrawal created for user ${userItem.id}: ${amount} via ${method} [${status}]`,
        );
      } catch (err) {
        console.error(
          `Error creating withdrawal for user ${userItem.id}:`,
          err,
        );
      }
    }
  }

  console.log('Withdrawals seeding process finished');
}

seedWithdrawals()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Script crashed:', err);
    process.exit(1);
  });
