import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from '~/server/api/trpc';
import { user } from '~/server/db/schema';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { type InferModel } from 'drizzle-orm';

type User = InferModel<typeof user>;

const updateProfileSelfSchema = z
  .object({
    name: z.string().min(1).optional(),
    displayName: z.string().min(1).max(150).optional(),
    image: z.string().url().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

const updateProfileAdminSchema = z
  .object({
    name: z.string().min(1).optional(),
    displayName: z.string().min(1).max(150).optional(),
    status: z.enum(['ACTIVE', 'SUSPENDED', 'BANNED']).optional(),
    image: z.string().url().optional(),
    role: z.enum(['CREATOR', 'COMPLETER', 'ADMIN']).optional(),
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: 'At least one field must be provided in addition to userId',
  });

export const profileRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const foundUser = await ctx.db.query.user.findFirst({
      where: (u, { eq }) => eq(u.id, ctx.user.id),
    });

    if (!foundUser) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User profile not found',
      });
    }

    return {
      success: true,
      user: {
        id: foundUser.id,
        name: foundUser.name ?? '',
        email: foundUser.email,
        emailVerified: foundUser.emailVerified,
        displayName: foundUser.displayName ?? '',
        status: foundUser.status,
        image: foundUser.image ?? '',
        createdAt: foundUser.createdAt,
        updatedAt: foundUser.updatedAt,
        role: foundUser.role,
      },
    };
  }),

  updateProfile: protectedProcedure
    .input(updateProfileSelfSchema)
    .mutation(async ({ ctx, input }) => {
      const forbiddenFields = [
        'email',
        'status',
        'role',
        'updatedAt',
        'createdAt',
      ];
      for (const field of forbiddenFields) {
        if (field in input) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: `You are not allowed to update the field: ${field}`,
          });
        }
      }

      const userId = ctx.user.id;

      const foundUser = await ctx.db.query.user.findFirst({
        where: (u, { eq }) => eq(u.id, userId),
      });

      if (!foundUser) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      const dataToUpdate: Record<string, unknown> = {
        updatedAt: new Date(),
        ...(input.name && { name: input.name }),
        ...(input.displayName && { displayName: input.displayName }),
        ...(input.image && { image: input.image }),
      };

      const result: User[] = await ctx.db
        .update(user)
        .set(dataToUpdate)
        .where(eq(user.id, userId))
        .returning();

      if (result.length === 0) {
        console.error('No rows updated');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update profile',
        });
      }

      const updatedUser: User = result[0];
      return {
        success: true,
        user: {
          id: updatedUser.id,
          name: updatedUser.name ?? '',
          email: updatedUser.email,
          emailVerified: updatedUser.emailVerified,
          displayName: updatedUser.displayName ?? '',
          status: updatedUser.status,
          image: updatedUser.image ?? '',
          role: updatedUser.role,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
      };
    }),

  updateProfileAdmin: adminProcedure
    .input(updateProfileAdminSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId, ...fields } = input;
      const foundUser: User | null = await ctx.db.query.user.findFirst({
        where: (u, { eq }) => eq(u.id, userId as string),
      });

      if (!foundUser) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      const dataToUpdate: Record<string, unknown> = {
        updatedAt: new Date(),
        ...(fields.name && { name: fields.name }),
        ...(fields.displayName && { displayName: fields.displayName }),
        ...(fields.status && { status: fields.status }),
        ...(fields.image && { image: fields.image }),
        ...(fields.role && { role: fields.role }),
      };

      const result: User[] = await ctx.db
        .update(user)
        .set(dataToUpdate)
        .where(eq(user.id, userId as string))
        .returning();

      if (result.length === 0) {
        console.error('No rows updated');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update profile',
        });
      }

      const updatedUser = result[0] as typeof user;

      return {
        success: true,
        user: {
          id: updatedUser.id,
          name: updatedUser.name ?? '',
          email: updatedUser.email,
          emailVerified: updatedUser.emailVerified,
          displayName: updatedUser.displayName ?? '',
          status: updatedUser.status,
          image: updatedUser.image ?? '',
          role: updatedUser.role,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
      };
    }),
});
