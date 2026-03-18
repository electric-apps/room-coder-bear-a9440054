# Todo App

A reactive, real-time todo application built with Electric SQL + TanStack DB. Changes sync instantly across all connected clients.

## Features

- Add todos with a title and priority level (low / medium / high)
- Mark todos complete / incomplete with a checkbox
- Delete individual todos
- Clear all completed todos at once
- Filter by All / Active / Completed
- Real-time sync across all browser tabs and clients via Electric SQL

## Getting Started

```bash
pnpm install
pnpm drizzle-kit generate && pnpm drizzle-kit migrate
pnpm dev:start
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Tech Stack

- [Electric SQL](https://electric-sql.com) — Postgres-to-client real-time sync
- [TanStack DB](https://tanstack.com/db) — Reactive collections with optimistic mutations
- [Drizzle ORM](https://orm.drizzle.team) — Schema definitions and migrations
- [TanStack Start](https://tanstack.com/start) — React meta-framework with SSR
- [Radix UI Themes](https://www.radix-ui.com/themes) — Design system

## License

MIT
