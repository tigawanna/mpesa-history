import { drizzle, ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as schema from "@/db/schema";

export function useDrizzle() {
  const currentDb = useSQLiteContext();
  const db = drizzle(currentDb, { schema });
  useDrizzleStudio(currentDb);
  return db;
}

export type DBType = ExpoSQLiteDatabase<typeof schema> & {
    $client: SQLiteDatabase;
}
