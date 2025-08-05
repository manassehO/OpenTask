import { z } from "zod";
import { createTRPCRouter, adminProcedure, } from "../trpc";
import { TRPCError } from "@trpc/server";
import { eq, } from 'drizzle-orm';
import { db } from "@/server/db";
import { resolveDispute } from "@/services/starknetSvc";
import { disputes, submissions }from '@/server/db/schema';
import { admin } from "better-auth/plugins";

export const adminRouter = createTRPCRouter({
  resolveDispute: adminProcedure
    .input(
      z.object({
        disputeId: z.string().uuid(),
        outcome: z.enum(["APPROVE", "REJECT"]),
        adminNotes: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { disputeId, outcome, adminNotes } = input;

      // Restrict to admins
      if (ctx.user.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Unauthorized" });
      }

      // Find the dispute (with related task info)
      const [dispute] = await db
  .select({
    disputeId: disputes.disputeId,
    status: disputes.status,
    taskId: submissions.taskId,
    completerUserId: submissions.completerUserId,
  })
  .from(disputes)
  .innerJoin(submissions, eq(disputes.submissionId, submissions.submissionId))
  .where(eq(disputes.disputeId, disputeId));
      if (!dispute) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Dispute not found" });
      }

      if (dispute.status !== "OPEN") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Dispute is not open" });
      }

      // Call Starknet contract
      await resolveDispute({
        taskId: dispute.taskId!,
        completerUserId: dispute.completerUserId!,
        resolution: outcome,
      });

      // Update the dispute record
      await db
        .update(disputes)
        .set({
          status: outcome === "APPROVE" ? "RESOLVED_APPROVE" : "RESOLVED_REJECT",
          resolution: outcome === "APPROVE" ? "APPROVED" : "REJECTED",
          adminNotes,
          resolvedAt: new Date(),
          resolvedById: ctx.user.id,
          
        })
        .where(eq(disputes.disputeId, disputeId));

      return { success: true };
    }),
});