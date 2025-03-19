import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../drizzle/migrations";

export const DATABASE_NAME = "db.db";

const expo = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true }); // <-- enable change listeners
export const db = drizzle(expo,{
  logger:{
    logQuery(query, params) {
      console.log("Query: ", query, params);
    },
  }
});

export function useInitMigrations() {
  return useMigrations(db, migrations);
}
