This is an expo project to build an app to monitoor my mpesa history 
Am more itersted in capturing name + number pairs i don't care abut the specofics of the transaction

i prefer
- to use typescript
- named functions

using

- react native paper for components and styling
- legend stte for theme/global stste management
- drizzle + expo-sqlite

drizzle sqlite tips

Real
A floating point value, stored as an 8-byte IEEE floating point number.

```ts
import { integer, text, real, blob, sqliteTable } from "drizzle-orm/sqlite-core";
real(); // A floating point value, stored as an 8-byte IEEE floating point number.

// you can customize integer mode to be number, boolean, timestamp, timestamp_ms
integer({ mode: "number" });
integer({ mode: "boolean" });
integer({ mode: "timestamp_ms" });
integer({ mode: "timestamp" }); // Date

// will be inferred as text: "value1" | "value2" | null
text({ enum: ["value1", "value2"] });
text({ mode: "json" });
text({ mode: "json" }).$type<{ foo: string }>();

//A blob of data, stored exactly as it was inpu
//It’s recommended to use text('', { mode: 'json' }) instead of blob('', { mode: 'json' }), because it supports JSON functions:
blob();
blob({ mode: "buffer" });
blob({ mode: "bigint" });
blob({ mode: "json" });
blob({ mode: "json" }).$type<{ foo: string }>();
```

for more context on drizzle + sqlite: https://orm.drizzle.team/docs/column-types/sqlite
