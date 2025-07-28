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
  bigint
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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

export const userBalances = createTable('user_balances', {
  userAddress: varchar('user_address', { length: 100 }).primaryKey(),
  balance: bigint('balance', { mode: "bigint" }).notNull(),
  token: varchar('token', { length: 100 }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const submissionsRelations = relations(submissions, ({ one }) => ({
  task: one(tasks, {
    fields: [submissions.taskId],
    references: [tasks.id],
  }),
}));
