import { pgTable, serial, boolean, timestamp, integer, date, char } from 'drizzle-orm/pg-core';

export const cycles = pgTable('cycles', {
  id: serial('id').primaryKey(),
  startedAt: timestamp('started_at').defaultNow(),
  endedAt: timestamp('ended_at'),
  isActive: boolean('is_active').default(true),
});

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  cycleId: integer('cycle_id').references(() => cycles.id),
  dayNumber: integer('day_number').notNull(),
  sessionDate: date('session_date').notNull(),
  letters: char('letters', { length: 1 }).array().notNull(),
  gHit: boolean('g_hit').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export type Cycle = typeof cycles.$inferSelect;
export type Session = typeof sessions.$inferSelect;