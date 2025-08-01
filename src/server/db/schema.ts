// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql, relations } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  text,
  timestamp,
  varchar,
  pgEnum,
  uuid,
  numeric,
  bigint,
} from 'drizzle-orm/pg-core';

export const createTable = pgTableCreator((name) => `opentask_${name}`);
const statusEnum = pgEnum('status', ['ACTIVE', 'SUSPENDED', 'BANNED']);
const walletTypeEnum = pgEnum('wallet_type', ['managed', 'self_custody']);
const rolesEnum = pgEnum('roles', ['CREATOR', 'COMPLETER', 'ADMIN']);
const taskStatusEnum = pgEnum('task_status', [
  'DRAFT',
  'ACTIVE',
  'COMPLETED',
  'CANCELLED',
  'DISPUTED',
]);
const submissionStatusEnum = pgEnum('submission_status', [
  'PENDING_REVIEW',
  'APPROVED',
  'REJECTED',
  'DISPUTED',
]);
const disputeStatusEnum = pgEnum('dispute_status', [
  'OPEN',
  'RESOLVED_APPROVE',
  'RESOLVED_REJECT',
]);
const disputeResolutionEnum = pgEnum('dispute_resolution', [
  'APPROVED',
  'REJECTED',
]);

const notificationTypeEnum = pgEnum('notification_type', [
  'TASK_APPROVED',
  'TASK_REJECTED',
  'TASK_ASSIGNED',
  'PAYMENT_RECEIVED',
  'DISPUTE_CREATED',
  'DISPUTE_RESOLVED',
  'COURSE_COMPLETED',
  'SYSTEM_ANNOUNCEMENT',
]);

const notificationStatusEnum = pgEnum('notification_status', [
  'UNREAD',
  'READ',
  'ARCHIVED',
]);

const withdrawalStatusEnum = pgEnum('withdrawal_status', [
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
]);

const withdrawalMethodEnum = pgEnum('withdrawal_method', [
  'CRYPTO_WALLET',
  'BANK_ACCOUNT',
]);

// Better-Auth required tables
export const user = createTable('user', {
  id: text('id').primaryKey(),
  oauth_id: varchar('oauth_id', { length: 128 }),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  displayName: varchar('display_name', { length: 150 }),
  status: statusEnum('status').default('ACTIVE').notNull(), // ACTIVE, SUSPENDED, BANNED
  image: text('image'),
  role: rolesEnum('role').default('COMPLETER').notNull(), // CREATOR, COMPLETER, ADMIN

  walletAddress: varchar('wallet_address', { length: 100 }),
  hashPrivateKey: varchar('hash_private_key', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const session = createTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = createTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const verification = createTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const nonceVerification = createTable('nonce_verification', {
  id: uuid('id').primaryKey().defaultRandom(),
  identifier: text('identifier')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  value: text('value').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const wallets = createTable(
  'wallets',
  {
    walletId: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    starknetAddress: varchar('starknet_address', { length: 100 })
      .notNull()
      .unique(),
    walletType: walletTypeEnum('wallet_type').notNull(),
    isActive: integer('is_active').notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    hashedPrivateKey: text('hashed_private_key').notNull(),
  },
  (table) => ({
    userIdIndex: index('user_id_idx').on(table.userId),
    starknetAddressIndex: index('starknet_address_idx').on(
      table.starknetAddress,
    ),
  }),
);

export const otps = createTable('otps', {
  otpId: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  code: varchar('code').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const tasks = createTable('tasks', {
  id: uuid('task_id').primaryKey().defaultRandom(),
  creatorUserId: text('creator_user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: varchar('title').notNull(),
  description: text('description').notNull(),
  instructions: text('instructions').notNull(),
  category: varchar('category').notNull(),
  rewardAmount: numeric('reward_amount').notNull(),
  rewardTokenAddress: varchar('reward_token_address', {
    length: 100,
  }).notNull(),
  platformFee: numeric('platform_fee', { precision: 20, scale: 0 }),
  approvedCompletions: integer('approved_completions').notNull().default(0),
  inProgressCompletions: integer('in_progress_completions')
    .notNull()
    .default(0),
  requiredCompletions: integer('required_completions').notNull(),
  status: taskStatusEnum('status').default('DRAFT').notNull(),
  fundingTxHash: varchar('funding_tx_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  maxCompletions: integer('max_completions').notNull(),
});

export const onchainEvents = createTable('onchain_events', {
  eventId: uuid('id').primaryKey().defaultRandom(),
  walletAddress: varchar('wallet_address', { length: 100 }).notNull(),
  token: varchar('token', { length: 50 }),
  eventType: varchar('event_type', { length: 50 }),
  amount: varchar('amount', { length: 50 }),
  timestamp: timestamp('timestamp', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const taskClaims = createTable('task_claims', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id')
    .notNull()
    .references(() => tasks.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('in_progress'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const submissions = createTable('submissions', {
  submissionId: uuid('submission_id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').references(() => tasks.id),
  completerUserId: uuid('completer_user_id').references(() => user.id),
  status: submissionStatusEnum('status').notNull(),
  dataRef: text('data_ref'),
  rejectionReason: text('rejection_reason'),
  approvalTxHash: varchar('approval_tx_hash', { length: 255 }),
  reviewedAt: timestamp('reviewed_at'),
  submittedAt: timestamp('submitted_at').notNull(),
});

export const submissionsRelations = relations(submissions, ({ one }) => ({
  task: one(tasks, {
    fields: [submissions.taskId],
    references: [tasks.id],
  }),
  completer: one(user, {
    fields: [submissions.completerUserId],
    references: [user.id],
  }),
}));

export const disputes = createTable('disputes', {
  disputeId: uuid('dispute_id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id')
    .notNull()
    .unique()
    .references(() => submissions.submissionId, { onDelete: 'cascade' }),
  completerClaim: text('completer_claim').notNull(),
  creatorResponse: text('creator_response'),
  adminResolverId: text('admin_resolver_id').references(() => user.id, {
    onDelete: 'set null',
  }),
  status: disputeStatusEnum('status').notNull().default('OPEN'),
  resolution: disputeResolutionEnum('resolution'),
  adminNotes: text('admin_notes'),
  flagTxHash: varchar('flag_tx_hash', { length: 66 }),
  resolveTxHash: varchar('resolve_tx_hash', { length: 66 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const adminLogs = createTable('admin_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  adminId: text('admin_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  targetTable: text('target_table').notNull(),
  targetId: uuid('target_id'),
  message: text('message'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const userBalances = createTable('user_balances', {
  userAddress: varchar('user_address', { length: 100 }).primaryKey(),
  balance: bigint('balance', { mode: 'bigint' }).notNull(),
  token: varchar('token', { length: 100 }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const taskRelations = relations(tasks, ({ one }) => ({
  creator: one(user, {
    fields: [tasks.creatorUserId],
    references: [user.id],
  }),
}));

// Add these fields to the existing user table or create a user_profiles extension
export const userProfiles = createTable('user_profiles', {
  profileId: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' })
    .unique(),
  gender: varchar('gender', { length: 20 }),
  niche: varchar('niche', { length: 100 }), // User's area of expertise/interest
  bio: text('bio'),
  location: varchar('location', { length: 100 }),
  timezone: varchar('timezone', { length: 50 }),
  preferredLanguage: varchar('preferred_language', { length: 10 }).default(
    'en',
  ),
  skillTags: text('skill_tags'), // JSON array of skills
  socialLinks: text('social_links'), // JSON object with social media links
  isProfileComplete: boolean('is_profile_complete').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});
// Learning courses
export const courses = createTable('courses', {
  courseId: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  modules: integer('modules').notNull().default(1),
  duration: varchar('duration', { length: 50 }), // e.g., "10 mins watch"
  rewardAmount: numeric('reward_amount').notNull(),
  rewardTokenAddress: varchar('reward_token_address', {
    length: 100,
  }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  difficulty: varchar('difficulty', { length: 50 }).default('BEGINNER'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

// Learning tutorials
export const tutorials = createTable('tutorials', {
  tutorialId: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  duration: varchar('duration', { length: 50 }), // e.g., "5 mins read"
  rewardAmount: numeric('reward_amount').notNull(),
  rewardTokenAddress: varchar('reward_token_address', {
    length: 100,
  }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  contentUrl: varchar('content_url', { length: 500 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

// User learning progress
export const userLearningProgress = createTable('user_learning_progress', {
  progressId: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').references(() => courses.courseId, {
    onDelete: 'cascade',
  }),
  tutorialId: uuid('tutorial_id').references(() => tutorials.tutorialId, {
    onDelete: 'cascade',
  }),
  progress: integer('progress').default(0).notNull(), // 0-100 percentage
  isCompleted: boolean('is_completed').default(false).notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  enrolledAt: timestamp('enrolled_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  lastAccessedAt: timestamp('last_accessed_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// User notifications
export const notifications = createTable('notifications', {
  notificationId: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  status: notificationStatusEnum('status').default('UNREAD').notNull(),
  relatedTaskId: uuid('related_task_id').references(() => tasks.id),
  relatedSubmissionId: uuid('related_submission_id').references(
    () => submissions.submissionId,
  ),
  relatedDisputeId: uuid('related_dispute_id').references(
    () => disputes.disputeId,
  ),
  metadata: text('metadata'), // JSON string for additional data
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  readAt: timestamp('read_at', { withTimezone: true }),
});

// User notification preferences
export const notificationPreferences = createTable('notification_preferences', {
  preferenceId: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' })
    .unique(),
  emailNotifications: boolean('email_notifications').default(true).notNull(),
  pushNotifications: boolean('push_notifications').default(true).notNull(),
  taskUpdates: boolean('task_updates').default(true).notNull(),
  paymentNotifications: boolean('payment_notifications')
    .default(true)
    .notNull(),
  disputeNotifications: boolean('dispute_notifications')
    .default(true)
    .notNull(),
  learningNotifications: boolean('learning_notifications')
    .default(true)
    .notNull(),
  marketingEmails: boolean('marketing_emails').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

// Withdrawal requests
export const withdrawals = createTable('withdrawals', {
  withdrawalId: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  method: withdrawalMethodEnum('method').notNull(),
  amount: numeric('amount').notNull(),
  tokenAddress: varchar('token_address', { length: 100 }).notNull(),
  destinationAddress: varchar('destination_address', { length: 255 }), // For crypto
  bankAccountDetails: text('bank_account_details'), // JSON for bank details
  status: withdrawalStatusEnum('status').default('PENDING').notNull(),
  txHash: varchar('tx_hash', { length: 255 }),
  processingFee: numeric('processing_fee').default('0'),
  failureReason: text('failure_reason'),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

// User withdrawal methods (saved payment methods)
export const userWithdrawalMethods = createTable('user_withdrawal_methods', {
  methodId: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  method: withdrawalMethodEnum('method').notNull(),
  name: varchar('name', { length: 100 }).notNull(), // User-friendly name
  details: text('details').notNull(), // JSON with method-specific details
  isActive: boolean('is_active').default(true).notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

// User statistics (for dashboard summary cards)
export const userStats = createTable('user_stats', {
  statId: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' })
    .unique(),
  totalEarnings: numeric('total_earnings').default('0').notNull(),
  totalTasksCompleted: integer('total_tasks_completed').default(0).notNull(),
  currentStreak: integer('current_streak').default(0).notNull(),
  longestStreak: integer('longest_streak').default(0).notNull(),
  totalTimeSpent: integer('total_time_spent').default(0).notNull(), // in minutes
  averageRating: numeric('average_rating', { precision: 3, scale: 2 }).default(
    '0',
  ),
  totalCoursesCompleted: integer('total_courses_completed')
    .default(0)
    .notNull(),
  lastActivityAt: timestamp('last_activity_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

// Daily user activity (for streak calculation and analytics)
export const userActivity = createTable(
  'user_activity',
  {
    activityId: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    date: timestamp('date', { withTimezone: true }).notNull(),
    tasksCompleted: integer('tasks_completed').default(0).notNull(),
    earningsAmount: numeric('earnings_amount').default('0').notNull(),
    timeSpent: integer('time_spent').default(0).notNull(), // in minutes
    coursesCompleted: integer('courses_completed').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    userDateIdx: index('user_activity_user_date_idx').on(
      table.userId,
      table.date,
    ),
  }),
);

//relations
export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userLearningProgress),
}));

export const tutorialsRelations = relations(tutorials, ({ many }) => ({
  userProgress: many(userLearningProgress),
}));

export const userLearningProgressRelations = relations(
  userLearningProgress,
  ({ one }) => ({
    user: one(user, {
      fields: [userLearningProgress.userId],
      references: [user.id],
    }),
    course: one(courses, {
      fields: [userLearningProgress.courseId],
      references: [courses.courseId],
    }),
    tutorial: one(tutorials, {
      fields: [userLearningProgress.tutorialId],
      references: [tutorials.tutorialId],
    }),
  }),
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(user, { fields: [notifications.userId], references: [user.id] }),
  task: one(tasks, {
    fields: [notifications.relatedTaskId],
    references: [tasks.id],
  }),
  submission: one(submissions, {
    fields: [notifications.relatedSubmissionId],
    references: [submissions.submissionId],
  }),
  dispute: one(disputes, {
    fields: [notifications.relatedDisputeId],
    references: [disputes.disputeId],
  }),
}));

export const withdrawalsRelations = relations(withdrawals, ({ one }) => ({
  user: one(user, { fields: [withdrawals.userId], references: [user.id] }),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(user, { fields: [userStats.userId], references: [user.id] }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(user, { fields: [userProfiles.userId], references: [user.id] }),
}));
