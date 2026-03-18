import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { todos } from "./schema";

export const todoSelectSchema = createSelectSchema(todos, {
	created_at: z.union([z.date(), z.string().transform((s) => new Date(s))]),
	updated_at: z.union([z.date(), z.string().transform((s) => new Date(s))]),
});

export const todoInsertSchema = createInsertSchema(todos, {
	created_at: z.union([z.date(), z.string().transform((s) => new Date(s))]),
	updated_at: z.union([z.date(), z.string().transform((s) => new Date(s))]),
});

export type Todo = typeof todoSelectSchema._type;
export type NewTodo = typeof todoInsertSchema._type;
