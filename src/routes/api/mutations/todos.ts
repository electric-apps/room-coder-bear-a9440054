import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { generateTxId, parseDates } from "@/db/utils";
import { todoInsertSchema } from "@/db/zod-schemas";

const uuidSchema = z.string().uuid();
const todoPatchSchema = todoInsertSchema.partial().omit({ id: true });

export const Route = createFileRoute("/api/mutations/todos")({
	component: () => null,
	server: {
		handlers: {
			POST: async ({ request }) => {
				const body = parseDates(await request.json());
				const data = todoInsertSchema.parse(body);
				const result = await db.transaction(async (tx) => {
					const txid = await generateTxId(tx);
					const [row] = await tx.insert(todos).values(data).returning();
					return { txid, row };
				});
				return Response.json(result);
			},
			PATCH: async ({ request }) => {
				const raw = parseDates(await request.json());
				const { id: rawId, ...rest } = raw as { id: unknown } & Record<
					string,
					unknown
				>;
				const id = uuidSchema.parse(rawId);
				const updates = todoPatchSchema.parse(rest);
				const result = await db.transaction(async (tx) => {
					const txid = await generateTxId(tx);
					const [row] = await tx
						.update(todos)
						.set({ ...updates, updated_at: new Date() })
						.where(eq(todos.id, id))
						.returning();
					return { txid, row };
				});
				return Response.json(result);
			},
			DELETE: async ({ request }) => {
				const body = await request.json();
				const id = uuidSchema.parse((body as { id: unknown }).id);
				const result = await db.transaction(async (tx) => {
					const txid = await generateTxId(tx);
					await tx.delete(todos).where(eq(todos.id, id));
					return { txid };
				});
				return Response.json(result);
			},
		},
	},
});
