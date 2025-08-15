import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { and, eq, count, sql, isNotNull } from 'drizzle-orm';
import { courses, tutorials, userLearningProgress } from '~/server/db/schema';
import { clampProgress } from '~/lib/utils';

export const learningRouter = createTRPCRouter({
  getCourses: protectedProcedure
    .input(
      z.object({
        category: z.string().optional(),
        limit: z.number().min(1).max(50).default(10),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { category, limit, offset } = input;

      try {
        const coursesQuery = await ctx.db
          .select({
            courseId: courses.courseId,
            title: courses.title,
            description: courses.description,
            imageUrl: courses.imageUrl,
            modules: courses.modules,
            duration: courses.duration,
            rewardAmount: courses.rewardAmount,
            rewardInEth: courses.rewardTokenAddress,
            rewardInUsd: sql<number>`0`, // TODO: Implement token-to-USD conversion
            category: courses.category,
            difficulty: courses.difficulty,
            isActive: courses.isActive,
          })
          .from(courses)
          .where(
            and(
              eq(courses.isActive, true),
              category ? eq(courses.category, category) : undefined,
            ),
          )
          .limit(limit)
          .offset(offset);

        const totalQuery = await ctx.db
          .select({ count: count() })
          .from(courses)
          .where(
            and(
              eq(courses.isActive, true),
              category ? eq(courses.category, category) : undefined,
            ),
          );
        const [coursesResult, totalResult] = await Promise.all([
          coursesQuery,
          totalQuery,
        ]);

        if (coursesResult.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No courses found matching the criteria',
          });
        }

        return {
          courses: coursesResult.map((course) => ({
            ...course,
            duration:
              course.duration !== null && course.duration !== undefined
                ? course.duration.toString()
                : '',
            difficulty:
              course.difficulty !== null && course.difficulty !== undefined
                ? course.difficulty.toString()
                : '',
            rewardAmount: course.rewardAmount.toString(),
            rewardInEth: course.rewardInEth,
            rewardInUsd: 0, // TODO: Replace with actual conversion
          })),
          total: totalResult[0]?.count ?? 0,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch courses',
          cause: error,
        });
      }
    }),

  getTutorials: protectedProcedure
    .input(
      z.object({
        category: z.string().optional(),
        limit: z.number().min(1).max(50).default(10),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { category, limit, offset } = input;

      try {
        const tutorialQuery = await ctx.db
          .select({
            tutorialId: tutorials.tutorialId,
            title: tutorials.title,
            description: tutorials.description,
            imageUrl: tutorials.imageUrl,
            duration: tutorials.duration,
            rewardAmount: tutorials.rewardAmount,
            rewardInEth: tutorials.rewardTokenAddress,
            rewardInUsd: sql<number>`0`, // TODO: Implement token-to-USD conversion
            category: tutorials.category,
            isActive: tutorials.isActive,
          })
          .from(tutorials)
          .where(
            and(
              eq(tutorials.isActive, true),
              category ? eq(tutorials.category, category) : undefined,
            ),
          )
          .limit(limit)
          .offset(offset);
        const totalQuery = await ctx.db
          .select({ count: count() })
          .from(tutorials)
          .where(
            and(
              eq(tutorials.isActive, true),
              category ? eq(tutorials.category, category) : undefined,
            ),
          );
        const [tutorialResult, totalResult] = await Promise.all([
          tutorialQuery,
          totalQuery,
        ]);

        if (tutorialResult.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No tutorials found matching the criteria',
          });
        }
        return {
          tutorials: tutorialResult.map((tutorial) => ({
            ...tutorial,
            duration:
              tutorial.duration !== null && tutorial.duration !== undefined
                ? tutorial.duration.toString()
                : '',
          })),
          total: totalResult[0]?.count ?? 0,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch tutorials',
          cause: error,
        });
      }
    }),

  getUserLearningProgress: protectedProcedure
    .input(
      z.object({
        type: z.enum(['course', 'tutorial']).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { type } = input;
      const userId = ctx.user.id;

      try {
        const conditions = [eq(userLearningProgress.userId, userId)];
        if (type === 'course') {
          conditions.push(isNotNull(userLearningProgress.courseId));
        } else if (type === 'tutorial') {
          conditions.push(isNotNull(userLearningProgress.tutorialId));
        }

        const progress = await ctx.db
          .select({
            progressId: userLearningProgress.progressId,
            courseId: userLearningProgress.courseId,
            tutorialId: userLearningProgress.tutorialId,
            progress: userLearningProgress.progress,
            isCompleted: userLearningProgress.isCompleted,
            enrolledAt: userLearningProgress.enrolledAt,
            completedAt: userLearningProgress.completedAt,
            lastAccessedAt: userLearningProgress.lastAccessedAt,
          })
          .from(userLearningProgress)
          .where(and(...conditions));

        if (progress.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No learning progress found for this user',
          });
        }

        return {
          progress: progress.map((item) => ({
            ...item,
            progress: clampProgress(item.progress),
            completedAt: item.isCompleted
              ? (item.completedAt ?? undefined)
              : undefined,
            courseId: item.courseId ?? undefined,
            tutorialId: item.tutorialId ?? undefined,
          })),
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch user learning progress',
          cause: error,
        });
      }
    }),

  enrollInCourse: protectedProcedure
    .input(
      z.object({
        courseId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { courseId } = input;
      const userId = ctx.user.id;

      try {
        const course = await ctx.db
          .select({ courseId: courses.courseId })
          .from(courses)
          .where(
            and(eq(courses.courseId, courseId), eq(courses.isActive, true)),
          )
          .limit(1);

        if (!course.length) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Course not found',
          });
        }
        const existingProgress = await ctx.db
          .select({ progressId: userLearningProgress.progressId })
          .from(userLearningProgress)
          .where(
            and(
              eq(userLearningProgress.userId, userId),
              eq(userLearningProgress.courseId, courseId),
            ),
          )
          .limit(1);
        if (existingProgress.length) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Already enrolled in this course',
          });
        }

        const [newProgress] = await ctx.db
          .insert(userLearningProgress)
          .values({
            userId,
            courseId,
            progress: 0,
            isCompleted: false,
            lastAccessedAt: new Date(),
          })
          .returning({
            progressId: userLearningProgress.progressId,
            enrolledAt: userLearningProgress.enrolledAt,
          });

        if (!newProgress) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create learning progress record',
          });
        }

        return {
          success: true,
          progressId: newProgress.progressId,
          enrolledAt: newProgress.enrolledAt,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to enroll in course',
          cause: error,
        });
      }
    }),

  updateProgress: protectedProcedure
    .input(
      z.object({
        courseId: z.string().uuid().optional(),
        tutorialId: z.string().uuid().optional(),
        progress: z.number().min(0).max(100),
        isCompleted: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { courseId, tutorialId, progress, isCompleted } = input;
      const userId = ctx.user.id;

      if (!courseId && !tutorialId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either courseId or tutorialId must be provided',
        });
      }

      try {
        const conditions = [eq(userLearningProgress.userId, userId)];
        if (courseId)
          conditions.push(eq(userLearningProgress.courseId, courseId));
        if (tutorialId)
          conditions.push(eq(userLearningProgress.tutorialId, tutorialId));

        const [existingProgress] = await ctx.db
          .select({ progressId: userLearningProgress.progressId })
          .from(userLearningProgress)
          .where(and(...conditions))
          .limit(1);

        if (!existingProgress) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No progress record found for this content',
          });
        }

        const updateData: {
          progress: number;
          isCompleted?: boolean;
          completedAt?: Date | null;
          lastAccessedAt?: Date;
        } = {
          progress,
          lastAccessedAt: new Date(),
        };

        if (typeof isCompleted !== 'undefined') {
          updateData.isCompleted = isCompleted;
          updateData.completedAt = isCompleted ? new Date() : null;
        }

        const [updatedProgress] = await ctx.db
          .update(userLearningProgress)
          .set(updateData)
          .where(
            eq(userLearningProgress.progressId, existingProgress.progressId),
          )
          .returning({
            progress: userLearningProgress.progress,
            isCompleted: userLearningProgress.isCompleted,
            completedAt: userLearningProgress.completedAt,
            lastAccessedAt: userLearningProgress.lastAccessedAt,
          });

        if (!updatedProgress) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update progress record',
          });
        }

        return {
          success: true,
          progress: clampProgress(updatedProgress.progress),
          isCompleted: updatedProgress.isCompleted,
          completedAt: updatedProgress.completedAt ?? undefined,
          lastAccessedAt: updatedProgress.lastAccessedAt,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update progress',
          cause: error,
        });
      }
    }),
});
