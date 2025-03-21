import { historyTable } from './schema';
import { createSelectSchema,createInsertSchema,createUpdateSchema } from 'drizzle-valibot';

export const historyTableSelect = createSelectSchema(historyTable)
export const historyTableInsert = createInsertSchema(historyTable)
export const historyTableUpdate = createUpdateSchema(historyTable)

// Export type for TypeScript support
export type HistoryEntry = typeof historyTable.$inferSelect;
export type InsertHistoryEntry = typeof historyTable.$inferInsert;
