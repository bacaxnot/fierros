# API Endpoint Spec Pattern

A declarative language for defining REST API endpoints. Focused on contracts, not implementation details.

## File Location

```
apps/api/_specs_/
├── routes/
│   └── <resource>.md          # Endpoint spec
└── shared/
    └── responses.md           # Common patterns
```

---

## Data Transfer Object (dto)

Shared data structures used across endpoints.

```
RoutineBlock dto
  - exerciseId: string
  - sets: number
  - reps: number
  - restSeconds: number | null
  - notes: string | null
```

---

## Endpoint

HTTP endpoint with route, controller, payload/query, orchestration, and responses.

### GET (List/Search)

```
GET /routines

ListRoutinesController:
  query: none
  orchestrates: SearchRoutinesByUser
  responses:
    - 200: RoutinePrimitives[]
```

With query params:
```
GET /exercises

ListExercisesController:
  query:
    - routineId: string
  orchestrates: SearchExercisesByRoutine
  responses:
    - 200: ExercisePrimitives[]
```

### PUT (Create/Upsert)

```
PUT /routines/:id

PutRoutineController:
  payload:
    - id: string
    - name: string
    - description: string | null
    - blocks: RoutineBlock[]
  orchestrates: CreateRoutine
  responses:
    - 201: void
    - 400: DomainError
```

### PATCH (Update)

```
PATCH /routines/:id

PatchRoutineController:
  payload:
    - id: string
    - name?: string
    - description?: string
    - blocks?: RoutineBlock[]
  orchestrates: UpdateRoutine
  responses:
    - 204: void
    - 400: DomainError
```

### DELETE

```
DELETE /routines/:id

DeleteRoutineController:
  payload:
    - id: string
  orchestrates: DeleteRoutine
  responses:
    - 204: void
    - 400: DomainError
```

### POST (Action)

For non-CRUD actions:
```
POST /workouts/:id/finish

FinishWorkoutController:
  payload:
    - id: string
  orchestrates: FinishWorkout
  responses:
    - 204: void
    - 400: DomainError
```

---

## Conventions

| Element | Description |
|---------|-------------|
| `dto` | Shared data structure, defined at top of file |
| `Controller` | Handler name, PascalCase with suffix |
| `query` | GET query params, `none` if empty |
| `payload` | Request body for POST/PUT/PATCH/DELETE |
| `orchestrates` | Use case from core package |
| `responses` | HTTP status codes and return types |
| `?` suffix | Optional field in payload |

---

## Response Types

- `void` - No response body (201 created, 204 no content)
- `TypePrimitives[]` - Array of primitive representations
- `TypePrimitives` - Single primitive representation
- `DomainError` - Domain error response (maps to 400)

---

## Route Params

URL params are extracted from the route:
- `/routines/:id` - `id` comes from URL param
- Payload uses same field name for validation

---

## File Organization

One file per resource/domain:
```
_specs_/routes/
├── routines.md
├── exercises.md
└── workouts.md
```

---

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Controller | `<Action><Resource>Controller` | `ListRoutinesController` |
| Route | kebab-case, plural | `/routines` |
| Param | `:id` in route, `id` in payload | `/:id` |

---

## What NOT to Include

- Implementation steps or behavior descriptions
- Client usage examples
- Notes about edge cases or limitations
- Internal details (just the contract)

Keep specs minimal: route, controller, payload/query, orchestrates, responses.
