import "dotenv/config";
import { db } from "~/server/db";
import { user, tasks } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

async function seedTasks() {
  console.log("Using database:", process.env.DATABASE_URL);

  // Fetch all creators
  const creators = await db.query.user.findMany({
    where: eq(user.role, "CREATOR"),
  });

  if (creators.length === 0) {
    console.error("No creators found. Seed users and set their role first");
    process.exit(1);
  }

  const statuses = ["DRAFT", "ACTIVE", "COMPLETED"];
  const categories = ["General", "Marketing", "Design", "Development"];
  
  for (const creator of creators) {
    for (let i = 0; i < 3; i++) {
      try {
        const title = `Sample Task ${i + 1} by ${creator.email}`;
        const now = new Date();
        const deadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const rewardAmount = (50 + Math.floor(Math.random() * 150)).toString(); // 50-200
        const maxCompletions = 5 + Math.floor(Math.random() * 15); // 5-20

        await db.insert(tasks).values({
          id: randomUUID(),
          creatorUserId: creator.id,
          title,
          description: `Description for ${title}`,
          instructions: "Follow the instructions carefully to complete this task.",
          category,
          rewardAmount,
          rewardTokenAddress: "0x1234567890abcdef1234567890abcdef12345678",
          platformFee: "5",
          requiredCompletions: Math.min(10, maxCompletions),
          maxCompletions,
          deadline,
          image: null,
          status,
          fundingTxHash: "0xmockfundingtxhash",
          tags: JSON.stringify(["test", "sample", "demo"]),
          example: "Example submission text",
          specialRequirements: "Must be original work",
        });

        console.log(`Task created for ${creator.email}: ${title} [${status}]`);
      } catch (err: any) {
        console.error(`Error seeding task for ${creator.email}:`, err.message);
      }
    }
  }

  console.log("Task seeding process finished");
}

seedTasks()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Script crashed:", err);
    process.exit(1);
  });
