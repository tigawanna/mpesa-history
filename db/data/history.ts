import { eq } from "drizzle-orm";
import { historyTable } from "../schema";
import { DBType } from "../useDrizzle";
import { InsertHistoryEntry } from "../validators";

export function getHistory(db: DBType, searchQuery: string) {
  return db.query.historyTable.findMany({
    where(fields, { like, or }) {
      return or(like(fields.name, `%${searchQuery}%`), like(fields.number, `%${searchQuery}%`));
    },
  });
}

export async function deleteHistory(db: DBType, selected: number[]) {
  if (!selected || selected.length === 0) return;
  let errors: Error[] = [];

  const deletePromises = selected.map((id) =>
    db
      .delete(historyTable)
      .where(eq(historyTable.id, id))
      .catch((error) => {
        errors.push(error);
        return null;
      })
  );

  const results = await Promise.allSettled(deletePromises);

  return {
    results,
    error: errors.length > 0 ? errors : null,
  };
}

export function handleHistoryTableInsert(db: DBType, input: InsertHistoryEntry,id?:number) {
  if(id){
    return db.update(historyTable).set({
      name: input.name,
      number: input.number,
      note: input.note || null,
    }).where(eq(historyTable.id, id))
  }
  return db.insert(historyTable).values({
    name: input.name,
    number: input.number,
    note: input.note || null,
  })

}
