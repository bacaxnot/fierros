# Core Module Folder Structure

## Bounded Context Layout

```
packages/core/src/contexts/<bounded-context>/
├── <module-a>/
│   ├── domain/
│   ├── application/
│   └── infrastructure/
├── <module-b>/
│   ├── domain/
│   ├── application/
│   └── infrastructure/
└── shared/
    └── domain/
```

## Module Structure

```
<module>/
├── domain/
│   ├── <entity>.ts                    # Aggregate root
│   ├── <entity>-id.ts                 # ID value object
│   ├── <entity>-<attribute>.ts        # Other value objects
│   ├── <entity>-repository.ts         # Repository interface
│   ├── <entity>-does-not-exist-error.ts
│   ├── find-<entity>.usecase.ts       # Helper use case (domain layer)
│   └── events/
│       ├── <entity>-created.ts
│       ├── <entity>-deleted.ts
│       └── <entity>-<field>-updated.ts
├── application/
│   ├── search-<entities>-by-<criteria>.usecase.ts
│   ├── create-<entity>.usecase.ts
│   ├── update-<entity>.usecase.ts
│   ├── delete-<entity>.usecase.ts
│   └── <action>-on-<event-trigger>.subscriber.ts
└── infrastructure/
    └── <entity>-repository.postgres.ts
```

## Domain Layer (`domain/`)

Contains the core business logic, entities, and interfaces.

| File | Purpose |
|------|---------|
| `<entity>.ts` | Aggregate root with business methods |
| `<entity>-id.ts` | Strongly-typed ID value object |
| `<entity>-repository.ts` | Repository interface (abstract) |
| `find-<entity>.usecase.ts` | Helper for finding entity by ID, throws if not found |
| `*-error.ts` | Domain-specific errors |
| `events/*.ts` | Domain events emitted by the aggregate |

## Application Layer (`application/`)

Contains use cases (commands/queries) and event subscribers.

| File Pattern | Type | Purpose |
|--------------|------|---------|
| `search-*-by-*.usecase.ts` | Query | List/search entities |
| `create-*.usecase.ts` | Command | Create new entity |
| `update-*.usecase.ts` | Command | Modify existing entity |
| `delete-*.usecase.ts` | Command | Remove entity |
| `*-on-*.subscriber.ts` | Subscriber | React to domain events |

## Infrastructure Layer (`infrastructure/`)

Contains concrete implementations of domain interfaces.

| File | Purpose |
|------|---------|
| `<entity>-repository.postgres.ts` | PostgreSQL repository implementation |
| `drizzle-<entity>-repository.ts` | Drizzle ORM implementation |

## Naming Conventions

### Files
- Use kebab-case: `routine.ts`, `workout-repository.ts`
- Suffix with type: `.usecase.ts`, `.subscriber.ts`, `.postgres.ts`

### Classes
- PascalCase: `Routine`, `CreateRoutine`, `FindRoutine`
- Use cases: `<Action><Entity>` -> `CreateRoutine`, `SearchWorkoutsByUser`
- Subscribers: `<Action>On<EventTrigger>` -> `StartWorkoutOnRoutineCreated`

### Events
- Class: `<Entity><Action>DomainEvent` -> `RoutineCreatedDomainEvent`
- eventName: `<app>.<context>.<entity>.<action>` -> `fierros.training.routine.created`
