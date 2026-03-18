import { createCollection } from "@tanstack/db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { type Todo, todoSelectSchema } from "@/db/zod-schemas";

const shapeUrl =
	typeof window !== "undefined"
		? `${window.location.origin}/api/todos`
		: `http://localhost:${process.env.VITE_PORT ?? 8080}/api/todos`;

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
			const mutation = transaction.mutations[0];
			const response = await fetch("/api/mutations/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(mutation.modified),
			});
			return response.json();
		},
		onUpdate: async ({ transaction }) => {
			const mutation = transaction.mutations[0];
			const response = await fetch("/api/mutations/todos", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(mutation.modified),
			});
			return response.json();
		},
		onDelete: async ({ transaction }) => {
			const mutation = transaction.mutations[0];
			const response = await fetch("/api/mutations/todos", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: mutation.key }),
			});
			return response.json();
		},
	}),
);
