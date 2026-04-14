import { db } from '~/server/db';
import { notifications } from '~/server/db/schema';

export type NotificationType =
  | 'TASK_APPROVED'
  | 'TASK_REJECTED'
  | 'TASK_ASSIGNED'
  | 'TASK_SUBMITTED'
  | 'PAYMENT_RECEIVED'
  | 'DISPUTE_CREATED'
  | 'DISPUTE_RESOLVED'
  | 'COURSE_ENROLLED'
  | 'COURSE_COMPLETED'
  | 'WITHDRAWAL_REQUESTED'
  | 'WITHDRAWAL_COMPLETED'
  | 'WITHDRAWAL_FAILED'
  | 'WELCOME'
  | 'PROFILE_REMINDER'
  | 'STREAK_MILESTONE'
  | 'SYSTEM_ANNOUNCEMENT';

export const createAutoNotification = async ({
  userId,
  type,
  title,
  message,
  relatedTaskId,
  relatedSubmissionId,
  relatedDisputeId,
  metadata,
}: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedTaskId?: string;
  relatedSubmissionId?: string;
  relatedDisputeId?: string;
  metadata?: string;
}) => {
  const [inserted] = await db
    .insert(notifications)
    .values({
      userId,
      type,
      title,
      message,
      relatedTaskId: relatedTaskId,
      relatedSubmissionId: relatedSubmissionId ?? null,
      relatedDisputeId: relatedDisputeId ?? null,
      metadata: metadata ?? null,
      status: 'UNREAD',
      createdAt: new Date(),
    })
    .returning();

  return inserted;
};

// ---------------------------
// High-level notification service
// ---------------------------
export const NotificationsService = {
  async sendWelcome(userId: string) {
    return createAutoNotification({
      // <-- fixed here
      userId,
      type: 'WELCOME',
      title: 'Welcome to OpenTask! 🚀',
      message:
        'Welcome to OpenTask! Complete your profile and start earning from micro-tasks.',
    });
  },

  async sendProfileReminder(userId: string) {
    return createAutoNotification({
      userId,
      type: 'PROFILE_REMINDER',
      title: 'Complete Your Profile',
      message: 'Complete your profile to unlock more earning opportunities!',
    });
  },

  async sendStreakMilestone(userId: string, streakDays: number) {
    return createAutoNotification({
      userId,
      type: 'STREAK_MILESTONE',
      title: 'Streak Milestone! 🔥',
      message: `Amazing! You've reached a ${streakDays}-day streak. Keep it up!`,
    });
  },
};
