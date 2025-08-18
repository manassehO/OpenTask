import "dotenv/config";
import { db } from "~/server/db";
import { user, notificationPreferences } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

async function seedNotificationPreferences() {
  console.log("Using database:", process.env.DATABASE_URL);

  // Fetch all users
  const allUsers = await db.query.user.findMany();

  if (allUsers.length === 0) {
    console.error("No users found. Seed users first");
    process.exit(1);
  }

  for (const userItem of allUsers) {
    // Skip if preferences already exist
    const existingPref = await db.query.notificationPreferences.findFirst({
      where: (pref) => eq(pref.userId, userItem.id),
    });
    if (existingPref) continue;

    try {
      await db.insert(notificationPreferences).values({
        preferenceId: randomUUID(),
        userId: userItem.id,
        emailNotifications: Math.random() < 0.9,
        pushNotifications: Math.random() < 0.9,
        taskUpdates: Math.random() < 0.9,
        paymentNotifications: Math.random() < 0.9,
        disputeNotifications: Math.random() < 0.9,
        learningNotifications: Math.random() < 0.9,
        marketingEmails: Math.random() < 0.3,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`Notification preferences created for user ${userItem.id}`);
    } catch (err) {
      console.error(
        `Error creating notification preferences for user ${userItem.id}:`,
        err
      );
    }
  }

  console.log("Notification preferences seeding process finished");
}

seedNotificationPreferences()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Script crashed:", err);
    process.exit(1);
  });
