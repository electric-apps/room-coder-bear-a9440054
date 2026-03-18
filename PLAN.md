# Todo App — Implementation Plan

## App Description
A reactive, real-time todo application built with Electric SQL + TanStack DB. Users can create, complete, prioritize, and delete todos with changes syncing instantly across all connected clients.

## Data Model

### todos
- id: UUID, primary key, defaultRandom()
- title: text, notNull
- completed: boolean, notNull, default(false)
- priority: text (enum: 'low' | 'medium' | 'high'), notNull, default('medium')
- created_at: timestamptz, notNull, defaultNow()
- updated_at: timestamptz, notNull, defaultNow()

## Implementation Tasks
- [x] Phase 1: Write PLAN.md
- [ ] Phase 2: Discover playbook skills and read relevant ones
- [ ] Phase 3: Data model — schema, zod-schemas, migrations, tests
- [ ] Phase 4: Collections & API routes
- [ ] Phase 5: UI components
- [ ] Phase 6: Build, lint & test
- [ ] Phase 7: README.md
- [ ] Phase 8: Deploy & send `@room REVIEW_REQUEST:` (MANDATORY — pipeline stalls without it)

## Design Conventions
- UUID primary keys with defaultRandom()
- timestamp({ withTimezone: true }) for all dates
- snake_case for SQL table/column names
- Foreign keys with onDelete: "cascade" where appropriate
