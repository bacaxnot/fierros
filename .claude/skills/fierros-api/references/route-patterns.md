# API Route Patterns

## File Structure

```
apps/api/src/
├── index.ts                 # Main app, registers all routes
└── routes/
    ├── routines.ts
    ├── exercises.ts
    └── workouts.ts
```

## Route File Pattern

```typescript
// routes/routines.ts
import { Hono } from "hono";
import { deleteRoutineHandlers } from "~/controllers/routines/delete-routine";
import { getRoutinesHandlers } from "~/controllers/routines/get-routines";
import { patchRoutineHandlers } from "~/controllers/routines/patch-routine";
import { putRoutineHandlers } from "~/controllers/routines/put-routine";

export const routinesApp = new Hono()
  .get("/", ...getRoutinesHandlers)
  .put("/:id", ...putRoutineHandlers)
  .patch("/:id", ...patchRoutineHandlers)
  .delete("/:id", ...deleteRoutineHandlers);

export type RoutinesAppType = typeof routinesApp;
```

## With Custom Actions

```typescript
// routes/workouts.ts
import { Hono } from "hono";
import { getWorkoutsHandlers } from "~/controllers/workouts/get-workouts";
import { putWorkoutHandlers } from "~/controllers/workouts/put-workout";
import { postFinishWorkoutHandlers } from "~/controllers/workouts/post-finish-workout";

export const workoutsApp = new Hono()
  .get("/", ...getWorkoutsHandlers)
  .put("/:id", ...putWorkoutHandlers)
  .post("/:id/finish", ...postFinishWorkoutHandlers);

export type WorkoutsAppType = typeof workoutsApp;
```

## Registering Routes in index.ts

```typescript
// index.ts
import { Hono } from "hono";
import { routinesApp } from "~/routes/routines";
import { exercisesApp } from "~/routes/exercises";
import { workoutsApp } from "~/routes/workouts";

const app = new Hono()
  // ... middleware
  .route("/routines", routinesApp)
  .route("/exercises", exercisesApp)
  .route("/workouts", workoutsApp);

export type AppType = typeof app;
```

## Route Patterns

| HTTP Method | Route Pattern | Purpose |
|-------------|---------------|---------|
| GET | `/` | List/search resources |
| PUT | `/:id` | Create resource (idempotent) |
| PATCH | `/:id` | Update resource |
| DELETE | `/:id` | Delete resource |
| POST | `/:id/<action>` | Custom action (finish, discard, etc.) |

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| File | `<resource>.ts` | `routines.ts` |
| App export | `<resource>App` | `routinesApp` |
| Type export | `<Resource>AppType` | `RoutinesAppType` |
| Route path | `/<resource>` | `/routines` |

## Handler Spread Pattern

Handlers are exported as arrays and spread into route definitions:

```typescript
// In controller
export const getRoutinesHandlers = factory.createHandlers(
  validator1,
  validator2,
  async (c) => { ... }
);

// In route
.get("/", ...getRoutinesHandlers)
```

This allows middleware/validators to be composed with the handler.
