import { randomUUID } from 'crypto';
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { courses, user } from '~/server/db/schema';

async function seedCourses() {
  console.log('Using database:', process.env.DATABASE_URL);

  // Fetch all creators
  const creators = await db.query.user.findMany({
    where: eq(user.role, 'CREATOR'),
  });

  if (creators.length === 0) {
    console.error('No creators found. Seed users and set their role first');
    process.exit(1);
  }

  const categories = [
    'Marketing',
    'Design',
    'Development',
    'Writing',
    'Finance',
    'Education',
  ];
  const difficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  const durations = ['10 mins', '30 mins', '1 hour', '2 hours', 'Half day'];

  for (const creator of creators) {
    for (let i = 0; i < 2; i++) {
      // 2 courses per creator
      try {
        const title = `Course ${i + 1} by ${creator.email}`;
        const category =
          categories[Math.floor(Math.random() * categories.length)];
        const difficulty =
          difficulties[Math.floor(Math.random() * difficulties.length)];
        const duration =
          durations[Math.floor(Math.random() * durations.length)];
        const rewardAmount = (10 + Math.floor(Math.random() * 90)).toString(); // 10-100
        const modules = 1 + Math.floor(Math.random() * 5); // 1-5 modules
        const imageUrl = `https://picsum.photos/seed/${randomUUID()}/600/400`;

        await db.insert(courses).values({
          title,
          description: `This is a detailed description for ${title}.`,
          imageUrl,
          modules,
          duration: duration!,
          rewardAmount,
          rewardTokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
          category: category!,
          difficulty: difficulty!,
          isActive: Math.random() < 0.8, // 80% chance active
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log(
          `Course created for ${creator.email}: ${title} [${difficulty}]`,
        );
      } catch (err: any) {
        console.error(
          `Error creating course for ${creator.email}:`,
          err.message,
        );
      }
    }
  }

  console.log('Course seeding process finished');
}

seedCourses()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Script crashed:', err);
    process.exit(1);
  });
