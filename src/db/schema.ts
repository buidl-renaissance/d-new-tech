import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  fid: text('fid').notNull().unique(),
  username: text('username'),
  displayName: text('displayName'),
  pfpUrl: text('pfpUrl'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Farcaster Accounts table
export const farcasterAccounts = sqliteTable('farcaster_accounts', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  fid: text('fid').notNull().unique(),
  username: text('username').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Members table - users who have registered as community members
export const members = sqliteTable('members', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Messages table - community chat messages
export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  content: text('content').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});
