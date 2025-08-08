import { sql } from "drizzle-orm";
import { pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `it-projects_${name}`);

export const images = createTable(
  "image",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    fileName: d.varchar({ length: 256 }),
    imageName: d.varchar({ length: 256 }),
    imageDescription: d.varchar({ length: 200 }), // Nullable description
    imageUrl: d.varchar({ length: 1024 }).notNull(),
    userId: d.varchar({ length: 64 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d
      .timestamp({ withTimezone: true })
      .$onUpdate(() => new Date()),
  })
);
