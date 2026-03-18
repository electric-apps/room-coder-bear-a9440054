import { createCollection } from "@tanstack/db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { type Todo, todoSelectSchema } from "@/db/zod-schemas";

const shapeUrl =
	typeof window !== "undefined"
		? `${window.location.origin}/api/todos`
		: `http://localhost:${process.env.VITE_PORT ?? 8080}/api/todos`;

async function mutate(
	method: string,
	body: unknown,
): Promise<{ txid: number }> {
	const response = await fetch("/api/mutations/todos", {
		method,
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	if (!response.ok) {
		throw new Error(
			`Mutation failed: ${response.status} ${response.statusText}`,
		);
	}
	return response.json();
}

export const todosCollection = createCollection<Todo>(
	electricCollectionOptions<Todo>({
		id: "todos",
		shapeOptions: {
			url: shapeUrl,
			params: { table: "todos" },
		},
		schema: todoSelectSchema,
		primaryKey: ["id"],
		onInsert: async ({ transaction }) => {
			return mutate("POST", transaction.mutations[0].modified);
		},
		onUpdate: async ({ transaction }) => {
			return mutate("PATCH", transaction.mutations[0].modified);
		},
		onDelete: async ({ transaction }) => {
			return mutate("DELETE", { id: transaction.mutations[0].key });
		},
	}),
);
