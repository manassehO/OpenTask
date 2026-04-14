import { and, eq, gte, inArray } from 'drizzle-orm';
import { db } from '~/server/db';
import { notifications, userStats } from '~/server/db/schema';
import { NotificationsService } from '~/services/notifications';

const STREAK_MILESTONES = [7, 30, 100];
const STREAK_MILESTONE_TYPE = 'STREAK_MILESTONE';
const NOTIFICATION_WINDOW_HOURS = 24;

export async function sendStreakMilestonesJob() {
  const now = new Date();
  const windowStart = new Date(
    now.getTime() - NOTIFICATION_WINDOW_HOURS * 60 * 60 * 1000,
  );

  // Find users with streaks matching milestone values
  const milestoneUsers = await db
    .select()
    .from(userStats)
    .where(inArray(userStats.currentStreak, STREAK_MILESTONES));

  if (milestoneUsers.length === 0) {
    console.log('No users reached streak milestones.');
    return;
  }

  // Extract userIds to check recent notifications
  const userIds = milestoneUsers.map((u) => u.userId);

  // Find notifications sent recently for these users and type
  const recentMilestoneNotifications = await db
    .select()
    .from(notifications)
    .where(
      and(
        inArray(notifications.userId, userIds),
        eq(notifications.type, STREAK_MILESTONE_TYPE),
        gte(notifications.createdAt, windowStart),
      ),
    );

  const recentlyNotifiedUserIds = new Set(
    recentMilestoneNotifications.map((n) => n.userId),
  );

  // Filter users who haven't been notified recently
  const usersToNotify = milestoneUsers.filter(
    (user) => !recentlyNotifiedUserIds.has(user.userId),
  );

  if (usersToNotify.length === 0) {
    console.log(
      'All users have already received streak milestone notifications recently.',
    );
    return;
  }

  // Send notifications in parallel and handle errors individually
  const results = await Promise.allSettled(
    usersToNotify.map((user) =>
      NotificationsService.sendStreakMilestone(user.userId, user.currentStreak),
    ),
  );

  results.forEach((result, idx) => {
    if (result.status === 'rejected') {
      const user = usersToNotify[idx];
      if (user) {
        console.error(
          `Failed to send streak milestone notification to user ${user.userId}:`,
          result.reason,
        );
      }
    }
  });

  console.log(
    `Sent streak milestone notifications to ${usersToNotify.length} users.`,
  );
}
