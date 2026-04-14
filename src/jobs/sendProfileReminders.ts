import { and, eq, gte, inArray, isNull, lte, or } from 'drizzle-orm';
import { db } from '~/server/db';
import { notifications, user } from '~/server/db/schema';
import { NotificationsService } from '~/services/notifications';

const PROFILE_REMINDER_TYPE = 'PROFILE_REMINDER';
const REMINDER_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function sendProfileRemindersJob() {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - REMINDER_INTERVAL_MS);

  // Fetch users registered over 24h ago with incomplete profiles
  const usersWithIncompleteProfiles = await db
    .select()
    .from(user)
    .where(
      and(
        lte(user.createdAt, twentyFourHoursAgo),
        or(
          isNull(user.displayName),
          eq(user.displayName, ''),
          isNull(user.image),
          eq(user.image, ''),
          isNull(user.walletAddress),
          eq(user.walletAddress, ''),
        ),
      ),
    );

  if (usersWithIncompleteProfiles.length === 0) {
    console.log('No users with incomplete profiles found.');
    return;
  }

  const userIds = usersWithIncompleteProfiles.map((u) => u.id);

  // 2. Fetch notifications sent in the last 24h for these users
  const recentReminders = await db
    .select()
    .from(notifications)
    .where(
      and(
        inArray(notifications.userId, userIds),
        eq(notifications.type, PROFILE_REMINDER_TYPE),
        gte(notifications.createdAt, twentyFourHoursAgo),
      ),
    );

  const remindedUserIds = new Set(recentReminders.map((n) => n.userId));

  // Filter users who have NOT received reminder in last 24h
  const usersToNotify = usersWithIncompleteProfiles.filter(
    (u) => !remindedUserIds.has(u.id),
  );

  if (usersToNotify.length === 0) {
    console.log(
      'All users have already received a profile reminder in the last 24 hours.',
    );
    return;
  }

  // Send reminders in parallel, handle errors individually
  const results = await Promise.allSettled(
    usersToNotify.map((user) =>
      NotificationsService.sendProfileReminder(user.id),
    ),
  );

  results.forEach((result, idx) => {
    if (result.status === 'rejected') {
      const user = usersToNotify[idx];
      if (user) {
        console.error(
          `Failed to send profile reminder to user ${user.id}:`,
          result.reason,
        );
      }
    }
  });

  console.log(`Sent profile reminders to ${usersToNotify.length} users.`);
}
