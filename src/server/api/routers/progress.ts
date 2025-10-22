import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
// import { TRPCError } from '@trpc/server';
import {
  courses,
  tutorials,
  tasks,
  userLearningProgress,
} from '@/server/db/schema';
import { eq, and, isNotNull, count } from 'drizzle-orm';

export const progressRouter = createTRPCRouter({
  getProgressStatus: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // ---- COURSES ----
    const totalCoursesResult = await ctx.db
      .select({ count: count() })
      .from(courses)
      .where(eq(courses.isActive, true));
    const totalCourses = totalCoursesResult[0]?.count ?? 0;

    const completedCoursesResult = await ctx.db
      .select({ count: count() })
      .from(userLearningProgress)
      .where(
        and(
          eq(userLearningProgress.userId, userId),
          eq(userLearningProgress.isCompleted, true),
          isNotNull(userLearningProgress.courseId),
        ),
      );
    const completedCourses = completedCoursesResult[0]?.count ?? 0;

    // ---- TUTORIALS ----
    const totalTutorialsResult = await ctx.db
      .select({ count: count() })
      .from(tutorials)
      .where(eq(tutorials.isActive, true));
    const totalTutorials = totalTutorialsResult[0]?.count ?? 0;

    const completedTutorialsResult = await ctx.db
      .select({ count: count() })
      .from(userLearningProgress)
      .where(
        and(
          eq(userLearningProgress.userId, userId),
          eq(userLearningProgress.isCompleted, true),
          isNotNull(userLearningProgress.tutorialId),
        ),
      );
    const completedTutorials = completedTutorialsResult[0]?.count ?? 0;

    // ---- TASKS ----
    const totalTasksResult = await ctx.db
      .select({ count: count() })
      .from(tasks)
      .where(eq(tasks.status, 'ACTIVE'));
    const totalTasks = totalTasksResult[0]?.count ?? 0;

    const userStat = await ctx.db.query.userStats.findFirst({
      where: (s, { eq }) => eq(s.userId, userId),
    });
    const completedTasks = userStat?.totalTasksCompleted ?? 0;

    // ---- STRUCTURED RESPONSE ----
    const coursesProgress = {
      completed: completedCourses,
      total: totalCourses,
      percentage:
        totalCourses > 0
          ? Math.round((completedCourses / totalCourses) * 100)
          : 0,
    };

    const tutorialsProgress = {
      completed: completedTutorials,
      total: totalTutorials,
      percentage:
        totalTutorials > 0
          ? Math.round((completedTutorials / totalTutorials) * 100)
          : 0,
    };

    const tasksProgress = {
      completed: completedTasks,
      total: totalTasks,
      percentage:
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };

    const overallCompleted =
      coursesProgress.completed +
      tutorialsProgress.completed +
      tasksProgress.completed;
    const overallTotal =
      coursesProgress.total + tutorialsProgress.total + tasksProgress.total;

    const overall = {
      completed: overallCompleted,
      total: overallTotal,
      percentage:
        overallTotal > 0
          ? Math.round((overallCompleted / overallTotal) * 100)
          : 0,
    };

    return {
      courses: coursesProgress,
      tutorials: tutorialsProgress,
      tasks: tasksProgress,
      overall,
    };
  }),
});
