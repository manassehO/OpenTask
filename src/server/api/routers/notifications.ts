import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { notifications, notificationPreferences } from '~/server/db/schema';
import { eq, and, desc, count, inArray } from 'drizzle-orm';

export const notificationsRouter = createTRPCRouter({
  getUserNotifications: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        status: z.enum(['UNREAD', 'READ', 'ARCHIVED']).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const whereConditions = [eq(notifications.userId, ctx.user.id)];

      if (input.status) {
        whereConditions.push(eq(notifications.status, input.status));
      }

      const userNotifications = await ctx.db
        .select()
        .from(notifications)
        .where(and(...whereConditions))
        .orderBy(desc(notifications.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return userNotifications;
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

  markAsRead: protectedProcedure
    .input(
      z.object({
        notificationIds: z.array(z.string()).optional(),
        markAll: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const whereConditions = [eq(notifications.userId, ctx.user.id)];

      if (
        !input.markAll &&
        input.notificationIds &&
        input.notificationIds.length > 0
      ) {
        whereConditions.push(
          inArray(notifications.notificationId, input.notificationIds),
        );
      }

      if (input.markAll) {
        whereConditions.push(eq(notifications.status, 'UNREAD'));
      }

      await ctx.db
        .update(notifications)
        .set({
          status: 'READ',
          readAt: new Date(),
        })
        .where(and(...whereConditions));

      return { success: true };
    }),

  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    const prefs = await ctx.db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, ctx.user.id))
      .limit(1);

    return prefs[0] ?? null;
  }),

  updatePreferences: protectedProcedure
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
      const existingPrefs = await ctx.db
        .select()
        .from(notificationPreferences)
        .where(eq(notificationPreferences.userId, ctx.user.id))
        .limit(1);

      if (existingPrefs.length > 0) {
        await ctx.db
          .update(notificationPreferences)
          .set({
            ...input,
            updatedAt: new Date(),
          })
          .where(eq(notificationPreferences.userId, ctx.user.id));
      } else {
        await ctx.db.insert(notificationPreferences).values({
          userId: ctx.user.id,
          emailNotifications: input.emailNotifications ?? true,
          pushNotifications: input.pushNotifications ?? true,
          taskUpdates: input.taskUpdates ?? true,
          paymentNotifications: input.paymentNotifications ?? true,
          disputeNotifications: input.disputeNotifications ?? true,
          learningNotifications: input.learningNotifications ?? true,
          marketingEmails: input.marketingEmails ?? false,
        });
      }

      return { success: true };
    }),

  createTestNotification: protectedProcedure
    .input(
      z.object({
        title: z.string().default('Test Notification'),
        message: z.string().default('This is a test notification'),
        type: z
          .enum([
            'TASK_APPROVED',
            'TASK_REJECTED',
            'TASK_ASSIGNED',
            'PAYMENT_RECEIVED',
            'DISPUTE_CREATED',
            'DISPUTE_RESOLVED',
            'COURSE_COMPLETED',
            'SYSTEM_ANNOUNCEMENT',
          ])
          .default('SYSTEM_ANNOUNCEMENT'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(notifications).values({
        userId: ctx.user.id,
        type: input.type,
        title: input.title,
        message: input.message,
        status: 'UNREAD',
      });

      return { success: true };
    }),
});
