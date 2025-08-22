import "dotenv/config";
import { db } from "~/server/db";
import { user, tasks, taskClaims, submissions } from "~/server/db/schema";
import { randomUUID } from "crypto";

async function seedSubmissions() {
  console.log("Using database:", process.env.DATABASE_URL);

  // Fetch all task claims that are in progress or completed
  const claims = await db.query.taskClaims.findMany();

  if (claims.length === 0) {
    console.error("No task claims found. Seed task claims first");
    process.exit(1);
  }

  const submissionStatuses = ["PENDING_REVIEW", "APPROVED", "REJECTED", "DISPUTED"];

  for (const claim of claims) {
    try {
      // Randomly decide if this claim will have a submission (optional)
      if (Math.random() < 0.8) { // 80% chance
        const status = submissionStatuses[Math.floor(Math.random() * submissionStatuses.length)];
        const now = new Date();

        await db.insert(submissions).values({
          submissionId: randomUUID(),
          taskId: claim.taskId,
          completerUserId: claim.userId,
          status,
          dataRef: `https://example.com/submission/${randomUUID()}`,
          rejectionReason: status === "REJECTED" ? "Does not meet requirements" : null,
          approvalTxHash: status === "APPROVED" ? `0x${randomUUID().replace(/-/g, '')}` : null,
          reviewedAt: status !== "PENDING_REVIEW" ? now : null,
          submittedAt: now,
        });

        console.log(`Submission created for task ${claim.taskId} by user ${claim.userId} [${status}]`);
      }
    } catch (err: any) {
      console.error(`Error creating submission for task ${claim.taskId} by user ${claim.userId}:`, err.message);
    }
  }

  console.log("Submission seeding process finished");
}

seedSubmissions()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Script crashed:", err);
    process.exit(1);
  });
