import cron from 'node-cron';
import { sendProfileRemindersJob } from './sendProfileReminders';
import { sendStreakMilestonesJob } from './sendStreakMilestones';

cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Running Profile Reminder Job...');
    await sendProfileRemindersJob();
  } catch (err) {
    console.error('Error in Profile Reminder Job:', err);
  }
});

cron.schedule('0 1 * * *', async () => {
  try {
    console.log('Running Streak Milestone Job...');
    await sendStreakMilestonesJob();
  } catch (err) {
    console.error('Error in Streak Milestone Job:', err);
  }
});

console.log('Cron jobs initialized.');
