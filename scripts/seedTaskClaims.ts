import "dotenv/config";
import { db } from "~/server/db";
import { user, tasks, taskClaims } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

async function seedTaskClaims() {
  console.log("Using database:", process.env.DATABASE_URL);

  // Fetch all users with role 'COMPLETER'
  const completers = await db.query.user.findMany({
    where: eq(user.role, "COMPLETER"),
  });

  if (completers.length === 0) {
    console.error("No completers found. Seed users and set their role first");
    process.exit(1);
  }

  // Fetch all tasks
  const allTasks = await db.query.tasks.findMany();

  for (const t of allTasks) {
    // Shuffle and pick a few completers (up to maxCompletions)
    const shuffled = completers.sort(() => 0.5 - Math.random());
    const numClaims = Math.min(t.maxCompletions, shuffled.length);
    const claimUsers = shuffled.slice(0, numClaims);

    for (const u of claimUsers) {
      try {
        await db.insert(taskClaims).values({
          id: randomUUID(),
          taskId: t.id,
          userId: u.id,
          status: "IN_PROGRESS",
        });

        console.log(`Task claim created: Task ${t.id} by user ${u.email}`);
      } catch (err: any) {
        console.error(`Error creating claim for Task ${t.id} by ${u.email}:`, err.message);
      }
    }
  }

  console.log("Task claims seeding process finished");
}

seedTaskClaims()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Script crashed:", err);
    process.exit(1);
  });
