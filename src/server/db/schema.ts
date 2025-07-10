// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from 'drizzle-orm';
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
} from 'drizzle-orm/pg-core';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `opentask_${name}`);
const statusEnum = pgEnum('status', ['ACTIVE', 'SUSPENDED', 'BANNED']);
const walletTypeEnum = pgEnum('wallet_type', ['managed', 'self_custody']);
const rolesEnum = pgEnum('roles', ['CREATOR', 'COMPLETER', 'ADMIN']);

export const posts = createTable(
  'post',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    name: varchar('name', { length: 256 }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index('name_idx').on(example.name),
  }),
);

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
  role: rolesEnum('role').default('CREATOR').notNull(), // CREATOR, COMPLETER, ADMIN
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
  userId: text('userId')
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
    walletType: walletTypeEnum('wallet_type').notNull(), // managed, self_custody
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
  email: varchar('email').notNull().unique(),
  code: varchar('code').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
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

export const task = createTable('task', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }),
  description: text('description'),
  status: varchar('status', { length: 50 }),
  creatorId: text('creator_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
});
