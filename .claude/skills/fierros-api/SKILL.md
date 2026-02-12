---
name: fierros-api
description: >
  API architecture patterns for Fierros. Hono controllers, route registration, Zod validation, and core use case orchestration.
  Trigger: When working on apps/api code, creating controllers, or defining routes.
metadata:
  scope: [root, api]
  auto_invoke:
    - "Working on apps/api code"
    - "Creating or modifying API controllers"
    - "Defining API routes or endpoints"
---

# Fierros API Architecture

## Critical Rules (NON-NEGOTIABLE)

1. **Controllers call core use cases**: Import from `@repo/core` and get via `container.get(UseCaseClass)`
2. **Never define business logic in API**: All domain logic lives in `packages/core`
3. **Zod validation on all inputs**: Use `zValidator` for params, query, and body
4. **DomainError -> 400, unexpected -> 500**: Consistent error handling pattern
5. **userId from auth context**: Always `c.get("user").id`, never from request body

## Project Structure

```
apps/api/src/
├── index.ts                 # Main app, registers all routes
├── routes/
│   ├── routines.ts          # Route file per resource
│   ├── workouts.ts
│   └── exercises.ts
├── controllers/
│   └── <resource>/
│       ├── get-<resources>.ts     # List/search
│       ├── put-<resource>.ts      # Create (upsert)
│       ├── patch-<resource>.ts    # Update
│       ├── delete-<resource>.ts   # Delete
│       └── post-<action>-<resource>.ts  # Custom action
├── lib/
│   ├── factory.ts           # Hono factory with ProtectedVariables
│   └── http-response.ts     # Response helpers
└── middlewares/
    ├── auth-middleware.ts
    └── cors-middleware.ts
```

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Controller file | `<verb>-<resource>.ts` | `get-routines.ts` |
| Handlers export | `<verb><Resource>Handlers` | `getRoutinesHandlers` |
| Schema export | `<verb><Resource><Part>Schema` | `putRoutineParamsSchema` |
| Route file | `<resource>.ts` | `routines.ts` |
| App export | `<resource>App` | `routinesApp` |
| Type export | `<Resource>AppType` | `RoutinesAppType` |

## Reference Files

| File | When to Read |
|------|--------------|
| [spec-pattern.md](references/spec-pattern.md) | API endpoint spec syntax (declarative endpoint format) |
| [controller-patterns.md](references/controller-patterns.md) | GET/PUT/PATCH/DELETE/POST controller templates |
| [route-patterns.md](references/route-patterns.md) | Route registration and handler spread pattern |

## Key Imports

```typescript
// Validation
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// DI Container
import { container } from "@repo/core/container";

// Use cases from core
import { CreateRoutine } from "@repo/core/contexts/training/routines/application/create-routine.usecase";

// Errors
import { DomainError } from "@repo/core/shared/domain/domain-error";

// Factory and responses
import { factory } from "~/lib/factory";
import { created, noContent, json, domainError, internalServerError } from "~/lib/http-response";
```

## Response Helpers

| Helper | Status | Usage |
|--------|--------|-------|
| `json(c, { data })` | 200 | GET responses |
| `created(c)` | 201 | PUT (create) |
| `noContent(c)` | 204 | PATCH, DELETE, POST actions |
| `domainError(c, error, 400)` | 400 | DomainError handling |
| `internalServerError(c)` | 500 | Unexpected errors |

## Route Patterns

| HTTP Method | Route Pattern | Purpose |
|-------------|---------------|---------|
| GET | `/` | List/search resources |
| PUT | `/:id` | Create resource (idempotent) |
| PATCH | `/:id` | Update resource |
| DELETE | `/:id` | Delete resource |
| POST | `/:id/<action>` | Custom action (finish, discard) |

## Handler Spread Pattern

Handlers are arrays spread into route definitions:

```typescript
// In controller - factory.createHandlers returns an array
export const getRoutinesHandlers = factory.createHandlers(
  zValidator("query", querySchema),  // middleware
  async (c) => { ... }              // handler
);

// In route - spread into method
.get("/", ...getRoutinesHandlers)
```

## Controller Template

Every controller follows this pattern:

```typescript
export const <verb><Resource>Handlers = factory.createHandlers(
  zValidator("<type>", schema),  // param, query, json
  async (c) => {
    try {
      const useCase = container.get(UseCaseClass);
      const user = c.get("user");
      // ... extract validated input, call use case
      return <responseHelper>(c);
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        return domainError(c, error, 400);
      }
      return internalServerError(c);
    }
  },
);
```

## Spec Pattern

API specs use a declarative endpoint format. See [spec-pattern.md](references/spec-pattern.md).

Specs location: `apps/api/_specs_/routes/<resource>.md`
Diffs location: `apps/api/_diffs_/routes/<resource>/`

## Commands

```bash
cd apps/api && bun run dev          # Development server
cd apps/api && bun run type-check   # Type check
```
