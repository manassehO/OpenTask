import "dotenv/config";
import { db } from "~/server/db";
import { user, adminLogs } from "~/server/db/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

async function seedAdminLogs() {
  console.log("Using database:", process.env.DATABASE_URL);

  // Fetch all admins
  const admins = await db.query.user.findMany({
    where: eq(user.role, "ADMIN"),
  });

  if (admins.length === 0) {
    console.error("No admins found. Seed users with role ADMIN first");
    process.exit(1);
  }

  const actions = ["CREATE", "UPDATE", "DELETE", "RESOLVE_DISPUTE", "APPROVE_SUBMISSION"];
  const targetTables = ["tasks", "submissions", "disputes", "users"];

  for (const admin of admins) {
    for (let i = 0; i < 3; i++) {
      const action = actions[Math.floor(Math.random() * actions.length)];
      const targetTable = targetTables[Math.floor(Math.random() * targetTables.length)];
      const targetId = randomUUID(); // could be an actual id in a real scenario
      const message = `Admin ${admin.id} performed ${action} on ${targetTable}`;

      try {
        await db.insert(adminLogs).values({
          id: randomUUID(),
          adminId: admin.id,
          action,
          targetTable,
          targetId,
          message,
          createdAt: new Date(),
        });

        console.log(`Admin log created: ${message}`);
      } catch (err: any) {
        console.error(`Error creating admin log for admin ${admin.id}:`, err.message);
      }
    }
  }

  console.log("Admin log seeding process finished");
}

seedAdminLogs()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Script crashed:", err);
    process.exit(1);
  });
