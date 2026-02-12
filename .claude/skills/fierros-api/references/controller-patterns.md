# API Controller Patterns

## File Structure

```
apps/api/src/controllers/<resource>/
├── get-<resource>s.ts           # List/search
├── put-<resource>.ts            # Create (upsert)
├── patch-<resource>.ts          # Update
├── delete-<resource>.ts         # Delete
└── post-<action>-<resource>.ts  # Custom action
```

## GET (List/Search)

```typescript
// controllers/routines/get-routines.ts
import { zValidator } from "@hono/zod-validator";
import { container } from "@repo/core/container";
import { SearchRoutinesByUser } from "@repo/core/contexts/training/routines/application/search-routines-by-user.usecase";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { factory } from "~/lib/factory";
import { domainError, internalServerError, json } from "~/lib/http-response";

export const getRoutinesHandlers = factory.createHandlers(async (c) => {
  try {
    const useCase = container.get(SearchRoutinesByUser);
    const user = c.get("user");

    const data = await useCase.execute({ userId: user.id });

    return json(c, { data });
  } catch (error: unknown) {
    if (error instanceof DomainError) {
      return domainError(c, error, 400);
    }
    return internalServerError(c);
  }
});
```

With query params:
```typescript
import { z } from "zod";

const querySchema = z.object({
  routineId: z.string().uuid(),
});

export const getExercisesHandlers = factory.createHandlers(
  zValidator("query", querySchema),
  async (c) => {
    const query = c.req.valid("query");
    // ... use query.routineId
  }
);
```

## PUT (Create)

```typescript
// controllers/routines/put-routine.ts
import { zValidator } from "@hono/zod-validator";
import { container } from "@repo/core/container";
import { CreateRoutine } from "@repo/core/contexts/training/routines/application/create-routine.usecase";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { z } from "zod";
import { factory } from "~/lib/factory";
import { created, domainError, internalServerError } from "~/lib/http-response";

export const putRoutineParamsSchema = z.object({
  id: z.string().uuid(),
});

export const putRoutineBodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  blocks: z.array(z.object({
    exerciseId: z.string().uuid(),
    sets: z.number(),
    reps: z.number(),
  })),
});

export const putRoutineHandlers = factory.createHandlers(
  zValidator("param", putRoutineParamsSchema),
  zValidator("json", putRoutineBodySchema),
  async (c) => {
    try {
      const params = c.req.valid("param");
      const body = c.req.valid("body");
      const user = c.get("user");

      const createRoutine = container.get(CreateRoutine);

      await createRoutine.execute({
        id: params.id,
        userId: user.id,
        ...body,
      });

      return created(c);
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        return domainError(c, error, 400);
      }
      return internalServerError(c);
    }
  },
);
```

## PATCH (Update)

```typescript
// controllers/routines/patch-routine.ts
import { zValidator } from "@hono/zod-validator";
import { container } from "@repo/core/container";
import { UpdateRoutine } from "@repo/core/contexts/training/routines/application/update-routine.usecase";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { z } from "zod";
import { factory } from "~/lib/factory";
import { domainError, internalServerError, noContent } from "~/lib/http-response";

export const patchRoutineParamsSchema = z.object({
  id: z.string().uuid(),
});

export const patchRoutineBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  blocks: z.array(z.object({...})).optional(),
});

export const patchRoutineHandlers = factory.createHandlers(
  zValidator("param", patchRoutineParamsSchema),
  zValidator("json", patchRoutineBodySchema),
  async (c) => {
    try {
      const useCase = container.get(UpdateRoutine);
      const params = c.req.valid("param");
      const body = c.req.valid("json");
      const user = c.get("user");

      await useCase.execute(
        { userId: user.id, routineId: params.id },
        body,
      );

      return noContent(c);
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        return domainError(c, error, 400);
      }
      return internalServerError(c);
    }
  },
);
```

## DELETE

```typescript
// controllers/routines/delete-routine.ts
import { zValidator } from "@hono/zod-validator";
import { container } from "@repo/core/container";
import { DeleteRoutine } from "@repo/core/contexts/training/routines/application/delete-routine.usecase";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { z } from "zod";
import { factory } from "~/lib/factory";
import { domainError, internalServerError, noContent } from "~/lib/http-response";

export const deleteRoutineParamsSchema = z.object({
  id: z.string().uuid(),
});

export const deleteRoutineHandlers = factory.createHandlers(
  zValidator("param", deleteRoutineParamsSchema),
  async (c) => {
    try {
      const useCase = container.get(DeleteRoutine);
      const params = c.req.valid("param");
      const user = c.get("user");

      await useCase.execute({
        userId: user.id,
        routineId: params.id,
      });

      return noContent(c);
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        return domainError(c, error, 400);
      }
      return internalServerError(c);
    }
  },
);
```

## POST (Custom Action)

```typescript
// controllers/workouts/post-finish-workout.ts
export const postFinishWorkoutHandlers = factory.createHandlers(
  zValidator("param", paramsSchema),
  async (c) => {
    try {
      const useCase = container.get(FinishWorkout);
      const params = c.req.valid("param");
      const user = c.get("user");

      await useCase.execute({
        userId: user.id,
        workoutId: params.id,
      });

      return noContent(c);
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        return domainError(c, error, 400);
      }
      return internalServerError(c);
    }
  },
);
```

## Key Imports

```typescript
// Validation
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// DI Container
import { container } from "@repo/core/container";

// Use cases from core
import { CreateX } from "@repo/core/contexts/.../application/create-x.usecase";

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

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| File | `<verb>-<resource>.ts` | `get-routines.ts` |
| Handlers | `<verb><Resource>Handlers` | `getRoutinesHandlers` |
| Schema | `<verb><Resource><Part>Schema` | `putRoutineParamsSchema` |
