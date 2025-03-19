import { sql } from "drizzle-orm";
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";


/**
 * Settings table for storing user preferences
 * Focuses on capturing theme preference and last sync timestamp
 */
export const settingsTable = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  theme: text("theme", { enum: ["light", "dark"] }).default("dark"),
  syncEnabled: integer("sync_enabled").default(1),
  lastSync: integer("last_sync", { mode: "timestamp" }),
});
/**
 * History table for storing M-Pesa transaction contacts
 * Focuses on capturing name and phone number pairs
 */
export const historyTable = sqliteTable("history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  number: text("number").notNull(),
  // Optional note/description field
  note: text("description"),
  // Timestamps for record keeping
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`),
});

// Export type for TypeScript support
export type HistoryEntry = typeof historyTable.$inferSelect;
export type NewHistoryEntry = typeof historyTable.$inferInsert;

