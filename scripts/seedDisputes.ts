import "dotenv/config";
import { db } from "~/server/db";
import { user, submissions, disputes } from "~/server/db/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

async function seedDisputes() {
  console.log("Using database:", process.env.DATABASE_URL);

  // Fetch all submissions
  const allSubmissions = await db.query.submissions.findMany();
  if (allSubmissions.length === 0) {
    console.error("No submissions found. Seed submissions first");
    process.exit(1);
  }

  // Fetch all admin users
  const admins = await db.query.user.findMany({
    where: eq(user.role, "ADMIN"),
  });
  if (admins.length === 0) {
    console.error("No admins found. Seed users with role ADMIN first");
    process.exit(1);
  }

  const disputeStatuses = ["OPEN", "DISPUTED", "RESOLVED_APPROVE", "RESOLVED_REJECT"];
  const disputeResolutions = ["APPROVED", "REJECTED"];

  for (const submission of allSubmissions) {
    // 30% chance to create a dispute
    if (Math.random() < 0.3) {
      const status = disputeStatuses[Math.floor(Math.random() * disputeStatuses.length)];
      const resolution = ["RESOLVED_APPROVE", "RESOLVED_REJECT"].includes(status)
        ? disputeResolutions[Math.floor(Math.random() * disputeResolutions.length)]
        : null;

      const resolvedBy = ["RESOLVED_APPROVE", "RESOLVED_REJECT"].includes(status)
        ? admins[Math.floor(Math.random() * admins.length)]
        : null;

      try {
        await db.insert(disputes).values({
          disputeId: randomUUID(),
          submissionId: submission.submissionId,
          completerClaim: `I disagree with the review for submission ${submission.submissionId}`,
          creatorResponse: status !== "OPEN" ? "Creator response goes here" : null,
          adminResolverId: resolvedBy?.id || null,
          status,
          resolution,
          adminNotes: status.startsWith("RESOLVED") ? "Resolved by admin after review" : null,
          flagTxHash: status !== "OPEN" ? `0x${randomUUID().replace(/-/g, '').slice(0, 64)}` : null,
          resolveTxHash: status.startsWith("RESOLVED") ? `0x${randomUUID().replace(/-/g, '').slice(0, 64)}` : null,
          createdAt: new Date(),
          updatedAt: new Date(),
          resolvedAt: new Date(), // must be non-null
          resolvedById: resolvedBy?.id || "system",
        });

        console.log(`Dispute created for submission ${submission.submissionId} [${status}]`);
      } catch (err: any) {
        console.error(`Error creating dispute for submission ${submission.submissionId}:`, err.message);
      }
    }
  }

  console.log("Dispute seeding process finished");
}

seedDisputes()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Script crashed:", err);
    process.exit(1);
  });
