import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
	id: uuid().primaryKey().defaultRandom(),
	title: text().notNull(),
	completed: boolean().notNull().default(false),
	priority: text().notNull().default("medium"),
	created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
