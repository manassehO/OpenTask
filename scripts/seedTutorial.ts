import "dotenv/config";
import { db } from "~/server/db";
import { user, tutorials } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

async function seedTutorials() {
  console.log("Using database:", process.env.DATABASE_URL);

  // Fetch all creators
  const creators = await db.query.user.findMany({
    where: eq(user.role, "CREATOR"),
  });

  if (creators.length === 0) {
    console.error("No creators found. Seed users and set their role first");
    process.exit(1);
  }

  const categories = ["Marketing", "Design", "Development", "Writing", "Finance", "Education"];
  const durations = ["5 mins", "10 mins", "15 mins", "30 mins", "1 hour"];
  
  for (const creator of creators) {
    for (let i = 0; i < 3; i++) { // 3 tutorials per creator
      try {
        const title = `Tutorial ${i + 1} by ${creator.email}`;
        const category = categories[Math.floor(Math.random() * categories.length)];
        const duration = durations[Math.floor(Math.random() * durations.length)];
        const rewardAmount = (5 + Math.floor(Math.random() * 50)).toString(); // 5-55
        const imageUrl = `https://picsum.photos/seed/${randomUUID()}/600/400`;
        const contentUrl = `https://example.com/tutorial/${randomUUID()}`;

        await db.insert(tutorials).values({
          tutorialId: randomUUID(),
          title,
          description: `This is a tutorial about ${title}`,
          imageUrl,
          duration,
          rewardAmount,
          rewardTokenAddress: "0x1234567890abcdef1234567890abcdef12345678",
          category,
          contentUrl,
          isActive: Math.random() < 0.8, // 80% chance active
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log(`Tutorial created for ${creator.email}: ${title} [${category}]`);
      } catch (err: any) {
        console.error(`Error creating tutorial for ${creator.email}:`, err.message);
      }
    }
  }

  console.log("Tutorial seeding process finished");
}

seedTutorials()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Script crashed:", err);
    process.exit(1);
  });
