import "dotenv/config";
import { db } from "~/server/db";
import { user, userProfiles } from "~/server/db/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm"; // <- important!

async function seedUserProfiles() {
  console.log("Using database:", process.env.DATABASE_URL);

  // Fetch all users
  const allUsers = await db.query.user.findMany();

  if (allUsers.length === 0) {
    console.error("No users found. Seed users first");
    process.exit(1);
  }

  const genders = ["Male", "Female", "Non-binary", "Other"];
  const niches = ["Marketing", "Design", "Development", "Writing", "Finance", "Education"];
  const languages = ["en", "es", "fr", "de", "zh", "ar"];
  const skillPool = ["React", "Node.js", "Photoshop", "SEO", "Copywriting", "Python", "Illustrator"];
  const locations = ["New York", "London", "Berlin", "Tokyo", "Sydney", "Remote"];
  const timezones = ["UTC", "GMT", "CET", "EST", "PST", "IST"];

  for (const userItem of allUsers) {
    // Skip if user already has a profile
    const existingProfile = await db.query.userProfiles.findFirst({
      where: (profile) => eq(profile.userId, userItem.id), // <- use eq()
    });
    if (existingProfile) continue;

    const gender = genders[Math.floor(Math.random() * genders.length)];
    const niche = niches[Math.floor(Math.random() * niches.length)];
    const bio = `Hi, I'm ${userItem.name || "User"} and I specialize in ${niche}.`;
    const location = locations[Math.floor(Math.random() * locations.length)];
    const timezone = timezones[Math.floor(Math.random() * timezones.length)];
    const preferredLanguage = languages[Math.floor(Math.random() * languages.length)];
    const skillTags = JSON.stringify(
      skillPool.sort(() => 0.5 - Math.random()).slice(0, 3)
    );
    const socialLinks = JSON.stringify({
      twitter: `https://twitter.com/${userItem.id.slice(0, 6)}`,
      linkedin: `https://linkedin.com/in/${userItem.id.slice(0, 6)}`,
    });

    try {
      await db.insert(userProfiles).values({
        profileId: randomUUID(),
        userId: userItem.id,
        gender,
        niche,
        bio,
        location,
        timezone,
        preferredLanguage,
        skillTags,
        socialLinks,
        isProfileComplete: Math.random() < 0.7,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`Profile created for user ${userItem.id}`);
    } catch (err: any) {
      console.error(`Error creating profile for user ${userItem.id}:`, err.message);
    }
  }

  console.log("User profiles seeding process finished");
}

seedUserProfiles()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Script crashed:", err);
    process.exit(1);
  });
