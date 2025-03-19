import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../drizzle/migrations";

const expo = openDatabaseSync("db.db", { enableChangeListener: true }); // <-- enable change listeners
export const db = drizzle(expo);

export function useInitMigrations() {
  return useMigrations(db, migrations);
}
