import {
	Box,
	Button,
	Card,
	Checkbox,
	Container,
	Flex,
	Heading,
	Select,
	Text,
	TextField,
} from "@radix-ui/themes";
import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { todosCollection } from "@/db/collections/todos";
import type { Todo } from "@/db/zod-schemas";

export const Route = createFileRoute("/")({
	ssr: false,
	component: TodoPage,
});

type Filter = "all" | "active" | "completed";
type Priority = "low" | "medium" | "high";

const PRIORITY_COLORS: Record<Priority, "green" | "orange" | "red"> = {
	low: "green",
	medium: "orange",
	high: "red",
};

function TodoPage() {
	const [newTitle, setNewTitle] = useState("");
	const [newPriority, setNewPriority] = useState<Priority>("medium");
	const [filter, setFilter] = useState<Filter>("all");

	const { data: todos } = useLiveQuery((q) =>
		q
			.from({ todos: todosCollection })
			.orderBy(({ todos }) => todos.created_at, "desc"),
	);

	const filtered = todos.filter((t) => {
		if (filter === "active") return !t.completed;
		if (filter === "completed") return t.completed;
		return true;
	});

	const activeCount = todos.filter((t) => !t.completed).length;
	const completedCount = todos.filter((t) => t.completed).length;

	const addTodo = () => {
		const title = newTitle.trim();
		if (!title) return;
		todosCollection.insert({
			id: crypto.randomUUID(),
			title,
			completed: false,
			priority: newPriority,
			created_at: new Date(),
			updated_at: new Date(),
		});
		setNewTitle("");
		setNewPriority("medium");
	};

	const toggleTodo = (todo: Todo) => {
		todosCollection.update(todo.id, {
			completed: !todo.completed,
			updated_at: new Date(),
		});
	};

	const deleteTodo = (id: string) => {
		todosCollection.delete(id);
	};

	const clearCompleted = () => {
		for (const t of todos.filter((t) => t.completed)) {
			todosCollection.delete(t.id);
		}
	};

	return (
		<Container size="2" py="6">
			<Flex direction="column" gap="5">
				<Flex align="center" justify="between">
					<Heading size="7">My Todos</Heading>
					<Flex gap="2">
						<Text size="2" color="gray">
							{activeCount} left
						</Text>
						{completedCount > 0 && (
							<Text
								size="2"
								color="gray"
								style={{ cursor: "pointer", textDecoration: "underline" }}
								onClick={clearCompleted}
							>
								Clear {completedCount} done
							</Text>
						)}
					</Flex>
				</Flex>

				{/* Add Todo */}
				<Card>
					<Flex gap="2" align="center">
						<Box flexGrow="1">
							<TextField.Root
								placeholder="What needs to be done?"
								value={newTitle}
								onChange={(e) => setNewTitle(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && addTodo()}
								size="2"
							/>
						</Box>
						<Select.Root
							value={newPriority}
							onValueChange={(v) => setNewPriority(v as Priority)}
							size="2"
						>
							<Select.Trigger />
							<Select.Content>
								<Select.Item value="low">Low</Select.Item>
								<Select.Item value="medium">Medium</Select.Item>
								<Select.Item value="high">High</Select.Item>
							</Select.Content>
						</Select.Root>
						<Button onClick={addTodo} size="2">
							<Plus size={16} />
							Add
						</Button>
					</Flex>
				</Card>

				{/* Filter Tabs */}
				<Flex gap="2">
					{(["all", "active", "completed"] as Filter[]).map((f) => (
						<Button
							key={f}
							variant={filter === f ? "solid" : "ghost"}
							size="1"
							onClick={() => setFilter(f)}
							style={{ textTransform: "capitalize" }}
						>
							{f}
						</Button>
					))}
				</Flex>

				{/* Todo List */}
				<Flex direction="column" gap="2">
					{filtered.length === 0 && (
						<Card>
							<Flex justify="center" py="4">
								<Text color="gray" size="2">
									{filter === "completed"
										? "No completed todos yet"
										: filter === "active"
											? "No active todos — great job!"
											: "Add your first todo above"}
								</Text>
							</Flex>
						</Card>
					)}
					{filtered.map((todo) => (
						<Card key={todo.id}>
							<Flex align="center" gap="3">
								<Checkbox
									checked={todo.completed}
									onCheckedChange={() => toggleTodo(todo)}
								/>
								<Box flexGrow="1">
									<Text
										size="2"
										style={{
											textDecoration: todo.completed ? "line-through" : "none",
											color: todo.completed ? "var(--gray-9)" : "inherit",
										}}
									>
										{todo.title}
									</Text>
								</Box>
								<Text
									size="1"
									color={PRIORITY_COLORS[todo.priority as Priority] ?? "gray"}
									style={{ textTransform: "capitalize" }}
								>
									{todo.priority}
								</Text>
								<Button
									variant="ghost"
									color="red"
									size="1"
									onClick={() => deleteTodo(todo.id)}
								>
									<Trash2 size={14} />
								</Button>
							</Flex>
						</Card>
					))}
				</Flex>
			</Flex>
		</Container>
	);
}
