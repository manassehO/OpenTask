import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { notifications } from '~/server/db/schema';

const notificationTypes = [
  'TASK_APPROVED',
  'TASK_REJECTED',
  'TASK_ASSIGNED',
  'TASK_SUBMITTED',
  'PAYMENT_RECEIVED',
  'DISPUTE_CREATED',
  'DISPUTE_RESOLVED',
  'COURSE_ENROLLED',
  'COURSE_COMPLETED',
  'WITHDRAWAL_REQUESTED',
  'WITHDRAWAL_COMPLETED',
  'WITHDRAWAL_FAILED',
  'WELCOME',
  'PROFILE_REMINDER',
  'STREAK_MILESTONE',
  'SYSTEM_ANNOUNCEMENT',
];

async function seedNotifications() {
  console.log('Using database:', process.env.DATABASE_URL);

  const allUsers = await db.query.user.findMany();

  if (allUsers.length === 0) {
    console.error('No users found. Seed users first');
    process.exit(1);
  }

  for (const userItem of allUsers) {
    // Optionally skip if notifications already exist
    const existing = await db.query.notifications.findFirst({
      where: (notif) => eq(notif.userId, userItem.id),
    });
    if (existing) continue;

    for (let i = 0; i < 3; i++) {
      // create 3 notifications per user
      const type =
        notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      const title = `Sample ${type!.replace('_', ' ')}`;
      const message = `This is a ${type!.toLowerCase().replace('_', ' ')} notification for ${userItem.name || userItem.email}.`;

      try {
        await db.insert(notifications).values({
          userId: userItem.id,
          type: type!,
          title,
          message,
          status: 'UNREAD',
          relatedTaskId: null,
        } as any);

        console.log(`Notification created for user ${userItem.id}: ${title}`);
      } catch (err) {
        console.error(
          `Error creating notification for user ${userItem.id}:`,
          err,
        );
      }
    }
  }

  console.log('Notifications seeding process finished');
}

seedNotifications()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Script crashed:', err);
    process.exit(1);
  });
