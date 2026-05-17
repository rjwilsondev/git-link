import {
  sqliteTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  username: text("username").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const repositories = sqliteTable(
  "repositories",
  {
    name: text("name").notNull(),
    description: text("description"),
    ownerUser: text("owner_user").references(() => users.username, {
      onUpdate: "cascade",
    }),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.ownerUser, table.name] }),
    };
  },
);

export type User = typeof users.$inferSelect
export type Repository = typeof repositories.$inferSelect