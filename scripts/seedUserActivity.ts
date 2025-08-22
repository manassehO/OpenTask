import "dotenv/config";
import { db } from "~/server/db";
import { user, userActivity } from "~/server/db/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

async function seedUserActivity() {
  console.log("Using database:", process.env.DATABASE_URL);

  // Fetch only users with role 'COMPLETER'
  const completers = await db.query.user.findMany({
    where: eq(user.role, "COMPLETER"),
  });

  if (completers.length === 0) {
    console.error("No completers found. Seed users with role COMPLETER first.");
    process.exit(1);
  }

  const today = new Date();

  for (const userItem of completers) {
    // Seed activity for the past 7 days
    for (let i = 0; i < 7; i++) {
      const activityDate = new Date(today);
      activityDate.setDate(today.getDate() - i);

      try {
        await db.insert(userActivity).values({
          activityId: randomUUID(),
          userId: userItem.id,
          date: activityDate,
          tasksCompleted: Math.floor(Math.random() * 5), 
          earningsAmount: (Math.random() * 50).toFixed(2),
          timeSpent: Math.floor(Math.random() * 120),
          coursesCompleted: Math.floor(Math.random() * 2),
          createdAt: new Date(),
        });

        console.log(`Activity created for completer ${userItem.id} on ${activityDate.toDateString()}`);
      } catch (err) {
        console.error(`Error creating activity for completer ${userItem.id}:`, err);
      }
    }
  }

  console.log("User activity seeding process finished");
}

seedUserActivity()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Script crashed:", err);
    process.exit(1);
  });
