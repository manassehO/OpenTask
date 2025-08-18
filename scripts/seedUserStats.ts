import "dotenv/config";
import { db } from "~/server/db";
import { user, userStats } from "~/server/db/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

async function seedUserStats() {
  console.log("Using database:", process.env.DATABASE_URL);

  // Fetch only users with role 'COMPLETER'
  const completers = await db.query.user.findMany({
    where: eq(user.role, "COMPLETER"),
  });

  if (completers.length === 0) {
    console.error("No completers found. Seed users with role COMPLETER first");
    process.exit(1);
  }

  for (const userItem of completers) {
    // Skip if stats already exist for this user
    const existing = await db.query.userStats.findFirst({
      where: eq(userStats.userId, userItem.id),
    });
    if (existing) continue;

    try {
      await db.insert(userStats).values({
        statId: randomUUID(),
        userId: userItem.id,
        totalEarnings: (Math.floor(Math.random() * 5000) / 100).toFixed(2),
        totalTasksCompleted: Math.floor(Math.random() * 50),
        currentStreak: Math.floor(Math.random() * 10),
        longestStreak: Math.floor(Math.random() * 20),
        totalTimeSpent: Math.floor(Math.random() * 2000),
        averageRating: (Math.random() * 5).toFixed(2),
        totalCoursesCompleted: Math.floor(Math.random() * 10),
        lastActivityAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`User stats created for completer ${userItem.id}`);
    } catch (err) {
      console.error(`Error creating stats for completer ${userItem.id}:`, err);
    }
  }

  console.log("User stats seeding process finished");
}

seedUserStats()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Script crashed:", err);
    process.exit(1);
  });
