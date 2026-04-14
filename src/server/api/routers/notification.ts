import { TRPCError } from '@trpc/server';
import { and, count, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '~/server/api/trpc';
import { notificationPreferences, notifications } from '~/server/db/schema';

export const notificationRouter = createTRPCRouter({
  getNotifications: protectedProcedure
    .input(
      z.object({
        status: z.enum(['UNREAD', 'READ', 'ARCHIVED']).optional(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log(ctx.user);

      // Build where clause
      const whereClause = [eq(notifications.userId, ctx.user.id)];
      if (input.status) {
        console.log('reached here 1');
        whereClause.push(eq(notifications.status, input.status));
      }
      console.log('whereClause:', whereClause);

      // Query notifications
      let notificationsList = [];
      try {
        notificationsList = await ctx.db.query.notifications.findMany({
          where: and(...whereClause),
          orderBy: (notifications, { desc }) => [desc(notifications.createdAt)],
          limit: input.limit,
          offset: input.offset,
        });
      } catch (error) {
        console.error('Error fetching notifications:', error as Error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch notifications',
          cause: error,
        });
      }

      // Count total notifications
      let total = 0;
      try {
        const totalResult = await ctx.db
          .select({ total: count() })
          .from(notifications)
          .where(and(...whereClause));

        total = totalResult[0]?.total ?? 0;
      } catch (error) {
        console.error('Error counting notifications:', error as Error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to count notifications',
          cause: error,
        });
      }

      return {
        success: true,
        notifications: notificationsList,
        pagination: {
          total,
          limit: input.limit,
          offset: input.offset,
        },
      };
    }),

  markAsRead: protectedProcedure
    .input(
      z.object({
        notificationIds: z
          .array(z.string().uuid())
          .min(1, 'Must provide at least one ID'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { notificationIds } = input;

      // Run in a transaction to prevent race conditions
      return await ctx.db.transaction(async (tx) => {
        console.log(notificationIds);

        // Fetch notifications for user and these IDs
        const userNotifications = await tx.query.notifications.findMany({
          where: and(
            inArray(notifications.notificationId, notificationIds),
            eq(notifications.userId, ctx.user.id),
          ),
        });

        if (userNotifications.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No valid notifications found for the user',
          });
        }

        // Filter unread notifications
        const unreadIds = userNotifications
          .filter((n) => n.status !== 'READ')
          .map((n) => n.notificationId);

        if (unreadIds.length === 0) {
          return {
            success: true,
            updatedCount: 0,
            skippedCount: notificationIds.length,
            updatedIds: [],
            message: 'All selected notifications were already read',
          };
        }

        // Bulk update unread notifications
        await tx
          .update(notifications)
          .set({ status: 'READ', readAt: new Date() })
          .where(
            and(
              inArray(notifications.notificationId, unreadIds),
              eq(notifications.userId, ctx.user.id),
            ),
          );

        return {
          success: true,
          updatedCount: unreadIds.length,
          skippedCount: notificationIds.length - unreadIds.length,
          updatedIds: unreadIds, // helpful for frontend UI update
          message: `${unreadIds.length} notifications marked as read`,
        };
      });
    }),

  getNotificationPreferences: protectedProcedure.query(async ({ ctx }) => {
    // Fetch user notification preferences
    const preferences = await ctx.db.query.notificationPreferences.findFirst({
      where: (np, { eq }) => eq(np.userId, ctx.user.id),
    });

    if (!preferences) {
      console.log('create default preference');
      // auto-create a default record if no preference exists
      const defaultPreferences = {
        userId: ctx.user.id,
        emailNotifications: true,
        pushNotifications: true,
        taskUpdates: true,
        paymentNotifications: true,
        disputeNotifications: true,
        learningNotifications: true,
        marketingEmails: false,
      };

      const inserted = await ctx.db
        .insert(notificationPreferences)
        .values(defaultPreferences)
        .returning();

      return {
        success: true,
        preferences: inserted[0],
        message: 'No preference found. Default created',
      };
    }

    return {
      success: true,
      preferences,
    };
  }),

  createNotification: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        type: z.enum([
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
        ]),
        title: z.string().min(1).max(255),
        message: z.string().min(1),
        relatedTaskId: z.string().uuid().optional(),
        metadata: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Ensure the target user exists
      const targetUser = await ctx.db.query.user.findFirst({
        where: (u, { eq }) => eq(u.id, input.userId),
      });

      if (!targetUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `User with ID ${input.userId} does not exist`,
        });
      }

      // Create notification
      const newNotification = await ctx.db
        .insert(notifications)
        .values({
          userId: input.userId,
          type: input.type,
          title: input.title,
          message: input.message,
          relatedTaskId: input.relatedTaskId ?? null,
          metadata: input.metadata ?? null,
          status: 'UNREAD', // default for new notifications
          createdAt: new Date(),
        })
        .returning();

      return {
        success: true,
        notification: newNotification[0],
        message: 'Notification successfully created.',
      };
    }),

  updateNotificationPreferences: protectedProcedure
    .input(
      z.object({
        emailNotifications: z.boolean().optional(),
        pushNotifications: z.boolean().optional(),
        taskUpdates: z.boolean().optional(),
        paymentNotifications: z.boolean().optional(),
        disputeNotifications: z.boolean().optional(),
        learningNotifications: z.boolean().optional(),
        marketingEmails: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const default_notification_preferences = {
        emailNotifications: true,
        pushNotifications: true,
        taskUpdates: true,
        paymentNotifications: true,
        disputeNotifications: true,
        learningNotifications: true,
        marketingEmails: false,
      };
      const userId = ctx.user.id;

      // keep only provided fields
      const updateData = Object.fromEntries(
        Object.entries(input).filter(([_, v]) => v !== undefined),
      );
      console.log(updateData);

      if (Object.keys(updateData).length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No fields to update.',
        });
      }

      // Check if preferences exist
      const existingPreferences = await ctx.db.query.notificationPreferences.findFirst({
        where: (np, { eq }) => eq(np.userId, userId),
      });

      if (existingPreferences) {
        // Update existing preferences
        const updated = await ctx.db
          .update(notificationPreferences)
          .set(updateData)
          .where(eq(notificationPreferences.userId, userId))
          .returning();

        return {
          success: true,
          preferences: updated[0],
          message: 'Notification preferences updated successfully',
        };
      } else {
        // Create new preferences with defaults + updates
        const newPreferences = { ...default_notification_preferences, ...updateData, userId };
        const inserted = await ctx.db
          .insert(notificationPreferences)
          .values(newPreferences)
          .returning();

        return {
          success: true,
          preferences: inserted[0],
          message: 'Notification preferences created successfully',
        };
      }
    }),

  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({ count: count() })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, ctx.user.id),
          eq(notifications.status, 'UNREAD'),
        ),
      );

    return result[0]?.count ?? 0;
  }),

  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    // Update all unread notifications to read
    try {
      const result = await ctx.db
        .update(notifications)
        .set({ status: 'READ', readAt: new Date() })
        .where(
          and(
            eq(notifications.userId, ctx.user.id),
            eq(notifications.status, 'UNREAD'),
          ),
        )
        .returning({ id: notifications.notificationId });

      const updatedCount = result.length;

      return {
        success: true,
        updatedCount,
        message: `Marked ${updatedCount} notifications as read`,
      };
    } catch (error) {
      console.error('Error marking all notifications as read:', error as Error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to mark notifications as read',
        cause: error,
      });
    }
  }),

  deleteNotification: protectedProcedure
    .input(
      z.object({
        notificationId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { notificationId } = input;

      // Delete the notification
      const deleteCount = await ctx.db
        .delete(notifications)
        .where(
          and(
            eq(notifications.notificationId, notificationId),
            eq(notifications.userId, ctx.user.id),
          ),
        )
        .returning({ id: notifications.notificationId });

      if (deleteCount.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Notification not found or you do not have permission to delete it',
        });
      }

      return {
        success: true,
        message: 'Notification deleted successfully',
      };
    }),

  clearAllNotifications: protectedProcedure.mutation(async ({ ctx }) => {
    // Delete all notifications for the user
    const deletedRows = await ctx.db
      .delete(notifications)
      .where(eq(notifications.userId, ctx.user.id))
      .returning({ id: notifications.notificationId });

    const deleteCount = deletedRows.length;

    return {
      success: true,
      message: `Deleted ${deleteCount} notifications successfully`,
    };
  }),
});
