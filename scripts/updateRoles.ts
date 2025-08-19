import "dotenv/config";
import { db } from "~/server/db";
import { user } from "~/server/db/schema";
import { eq } from "drizzle-orm";

async function updateRoles() {
  // Map of email → role
  const roleUpdates = {
    "creator1@gmail.com": "CREATOR",
    "creator2@gmail.com": "CREATOR",
    "admin1@gmail.com": "ADMIN",
  } as const;

  for (const [email, role] of Object.entries(roleUpdates)) {
    try {
      // First check if the user exists
      const existing = await db.query.user.findFirst({
        where: eq(user.email, email),
      });

      if (!existing) {
        console.warn(`No user found with email ${email}, skipped`);
        continue;
      }

      // Update role
      await db.update(user).set({ role }).where(eq(user.email, email));

      console.log(
        `Updated role for ${email} → ${role} (was: ${existing.role})`
      );
    } catch (err: any) {
      console.error(`Failed to update ${email}:`, err.message);
    }
  }

  console.log("Role update complete");
}

updateRoles()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Script crashed:", err);
    process.exit(1);
  });
