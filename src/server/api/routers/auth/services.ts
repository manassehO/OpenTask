import { db } from "~/server/db";
import { user } from "~/server/db/schema";
import { signJwt } from "./jwt";
import { eq } from "drizzle-orm";
import type { InferModel } from "drizzle-orm";

type User = InferModel<typeof user>;

export async function findOrCreateUserByEmail(email: string): Promise<User> {
  let createdUser = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  // create new user if user does not exist
  if (!createdUser) {
    const inserted = await db
      .insert(user)
      .values({ email, createdAt: new Date() })
      .returning();
    createdUser = inserted[0];
  }
  if (!createdUser) {
    throw new Error("Failed to find or create user");
  }

  return createdUser;
}

export function generateUserToken(user: User): string {
  return signJwt({ userId: user.id, email: user.email, role: user.role });
}
