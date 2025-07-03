import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  // Get current user profile
  getProfile: protectedProcedure.query(({ ctx }) => {
    return {
      id: ctx.user.id,
      name: ctx.user.name,
      email: ctx.user.email,
      role: ctx.user.role,
      emailVerified: ctx.user.emailVerified,
      image: ctx.user.image,
      createdAt: ctx.user.createdAt,
    };
  }),

  // Admin-only endpoint
  getAdminData: adminProcedure.query(({ ctx }) => {
    return {
      message: "This is admin-only data",
      adminUser: ctx.user.name,
      secretData: "Super secret admin information",
    };
  }),

  // Check session status
  getSessionStatus: publicProcedure.query(({ ctx }) => {
    return {
      isAuthenticated: !!ctx.user,
      user: ctx.user
        ? {
            id: ctx.user.id,
            name: ctx.user.name,
            email: ctx.user.email,
            role: ctx.user.role,
          }
        : null,
      session: ctx.session
        ? {
            id: ctx.session.id,
            expiresAt: ctx.session.expiresAt,
          }
        : null,
    };
  }),
});
