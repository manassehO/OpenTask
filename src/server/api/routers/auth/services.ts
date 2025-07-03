import { db } from "~/server/db";
import { user } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { InferModel } from "drizzle-orm";
import bcrypt from "bcryptjs";

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

export async function generateHashedOtp(otp: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(otp, salt);
  return hashedOtp;
}

export async function compareHashedOtp(
  otp: string,
  hashedOtp: string,
): Promise<boolean> {
  return await bcrypt.compare(otp, hashedOtp);
}
