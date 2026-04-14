import { courses, tasks, tutorials } from '@/server/db/schema';
import { TRPCError } from '@trpc/server';
import { and, eq, ilike, inArray, or } from 'drizzle-orm';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

type SearchResultType = 'task' | 'course' | 'tutorial';

interface SearchResult {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  type: SearchResultType;
}

export const searchRouter = createTRPCRouter({
  globalSearch: protectedProcedure
    .input(
      z.object({
        query: z.string().min(1).max(100),
        type: z.enum(['tasks', 'courses', 'tutorials', 'all']).default('all'),
        limit: z.number().min(1).max(50).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { query, type, limit } = input;
      const likeQuery = `%${query}%`;
      const results: SearchResult[] = [];

      if (type === 'tasks' || type === 'all') {
        try {
          const searchableTaskStatuses: ('ACTIVE' | 'COMPLETED')[] = [
            'ACTIVE',
            'COMPLETED',
          ];
          const taskResults = await ctx.db
            .select({
              id: tasks.id,
              title: tasks.title,
              description: tasks.description,
              category: tasks.category,
            })
            .from(tasks)
            .where(
              and(
                or(
                  ilike(tasks.title, likeQuery),
                  ilike(tasks.description, likeQuery),
                  ilike(tasks.category, likeQuery),
                ),
                inArray(tasks.status, searchableTaskStatuses),
              ),
            )
            .limit(limit);

          for (const task of taskResults) {
            results.push({ ...task, type: 'task' });
          }
        } catch (err) {
          console.error('Error fetching tasks:', err as Error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch tasks',
            cause: err,
          });
        }
      }

      if (type === 'courses' || type === 'all') {
        try {
          const courseResults = await ctx.db
            .select({
              id: courses.courseId,
              title: courses.title,
              description: courses.description,
              category: courses.category,
            })
            .from(courses)
            .where(
              and(
                or(
                  ilike(courses.title, likeQuery),
                  ilike(courses.description, likeQuery),
                  ilike(courses.category, likeQuery),
                ),
                eq(courses.isActive, true),
              ),
            )
            .limit(limit);

          for (const course of courseResults) {
            results.push({ ...course, type: 'course' });
          }
        } catch (err) {
          console.error('Error fetching courses:', err as Error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch tasks',
            cause: err,
          });
        }
      }

      if (type === 'tutorials' || type === 'all') {
        try {
          const tutorialResults = await ctx.db
            .select({
              id: tutorials.tutorialId,
              title: tutorials.title,
              description: tutorials.description,
              category: tutorials.category,
            })
            .from(tutorials)
            .where(
              and(
                or(
                  ilike(tutorials.title, likeQuery),
                  ilike(tutorials.description, likeQuery),
                  ilike(tutorials.category, likeQuery),
                ),
                eq(tutorials.isActive, true),
              ),
            )
            .limit(limit);

          for (const tutorial of tutorialResults) {
            results.push({ ...tutorial, type: 'tutorial' });
          }
        } catch (err) {
          console.error('Error fetching tutorials:', err as Error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch tasks',
            cause: err,
          });
        }
      }

      return {
        success: true,
        results,
      };
    }),
});
