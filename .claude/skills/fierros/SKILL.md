---
name: fierros
description: >
  Main entry point for Fierros development - project overview, component navigation, architecture.
  Trigger: General Fierros development questions, project overview, understanding the monorepo structure.
metadata:
  scope: [root]
  auto_invoke:
    - "General Fierros development questions"
---

## What is Fierros

Fierros is a workout tracking platform for fitness enthusiasts. It helps users create exercise routines, track workouts, and monitor progress over time.

Currently delivered as a **REST API** backed by PostgreSQL, with plans to expand to mobile and web clients.

## Components

| Component | Stack | Location |
|-----------|-------|----------|
| Core | TypeScript, DDD, Event-driven | `packages/core/` |
| API | Hono, TypeScript | `apps/api/` |
| Auth | Better-Auth | `packages/auth/` |
| DB | Drizzle ORM, PostgreSQL | `packages/db/` |

## How It Connects

```
Client (future mobile/web)
  → API (Hono REST)
    → Core (DDD use cases + domain events)
      → DB (Drizzle ORM)
```

- **API** calls Core use cases via DI container, extracts auth from better-auth session
- **Core** executes domain logic, publishes events to in-memory EventBus
- **DB** persists all aggregates via Drizzle repositories
- **Auth** handles user authentication via better-auth

## Key Domain Concepts

One bounded context: **Training**. Key modules:

| Module | Purpose |
|--------|---------|
| Exercises | Exercise catalog with target muscles and default metrics |
| Exercise Metrics | Reference data for metric types (reps, weight, time, distance) |
| Routines | Workout templates with blocks, sets, and target metrics |
| Workouts | Actual workout sessions started from routines |
| Users | User identity and profile |

## Monorepo

- **Runtime**: Bun
- **Workspaces**: Bun workspaces
- **Build**: Turborepo
- **Language**: TypeScript strict
- **Auth**: better-auth
- **Linter**: Biome
- **Validation**: Zod 4

## Quick Commands

```bash
# Core
cd packages/core && bun test
cd packages/core && bun run type-check

# API
cd apps/api && bun run dev

# DB
cd packages/db && bun run generate     # Migrations
cd packages/db && bun run migrate

# Monorepo
bun run type-check                     # All packages
bun run lint                           # Biome lint
```

## Spec-Driven Development

Load the `spec-driven-dev` skill for the Design → Diff → Compile workflow.

| Scope | Spec Location | Diff Location |
|-------|---------------|---------------|
| Core | `packages/core/_specs_/` | `packages/core/_diffs_/` |
| API | `apps/api/_specs_/` | `apps/api/_diffs_/` |

## Related Skills

- `fierros-core` - Core DDD architecture patterns
- `fierros-api` - API controller and route patterns
- `fierros-commit` - Commit conventions
- `fierros-pr` - PR conventions
- `spec-driven-dev` - Design → Diff → Compile workflow
