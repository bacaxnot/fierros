---
name: fierros-core
description: >
  Core domain architecture patterns for Fierros. DDD with aggregates, value objects, use cases, domain events, and DIOD DI.
  Trigger: When working on packages/core code, domain modeling, or implementing DDD patterns.
metadata:
  scope: [root, core]
  auto_invoke:
    - "Working on packages/core code"
    - "Implementing DDD domain patterns"
    - "Creating aggregates, value objects, or use cases in core"
---

# Fierros Core Architecture

## Critical Rules (NON-NEGOTIABLE)

1. **DDD architecture**: Aggregates, Value Objects, Use Cases, Domain Events
2. **One aggregate root per module**: Each module in `src/contexts/<context>/<module>/`
3. **Functional domain**: Classes for aggregates/VOs, but pure function validators where appropriate
4. **Use case pattern**: `execute(params)` returning domain entities
5. **Event-driven**: Domain events for cross-context communication

## Project Structure

```
packages/core/src/
├── contexts/
│   └── <context>/
│       └── <module>/
│           ├── domain/
│           │   ├── <entity>.ts           # Aggregate root
│           │   ├── <entity>-id.ts        # ID value object
│           │   ├── <entity>-<vo>.ts      # Other value objects
│           │   ├── <entity>-repository.ts # Port (abstract class)
│           │   ├── <entity>-does-not-exist-error.ts
│           │   ├── find-<entity>.usecase.ts # Domain helper
│           │   └── events/
│           │       ├── <entity>-created.ts
│           │       └── <entity>-<field>-updated.ts
│           ├── application/
│           │   ├── search-<entities>-by-<criteria>.usecase.ts
│           │   ├── create-<entity>.usecase.ts
│           │   ├── update-<entity>.usecase.ts
│           │   ├── delete-<entity>.usecase.ts
│           │   └── <action>-on-<event>.subscriber.ts
│           └── infrastructure/
│               └── drizzle-<entity>-repository.ts
├── shared/
│   ├── domain/        # DomainError, AggregateRoot, DomainEvent
│   └── infrastructure/ # DI container, shared adapters
├── di/
│   ├── autoregister.ts
│   ├── shared/
│   └── contexts/
└── tests/
    └── contexts/      # Mirrors src/contexts structure
```

## Naming Conventions

| Element | Pattern | Example |
|---------|---------|---------|
| Aggregate | `kebab-case.ts` | `routine.ts` |
| Value Object | `PascalCase.ts` (ID) or `kebab-case.ts` | `RoutineId.ts` |
| Use Case | `kebab-case.usecase.ts` | `create-routine.usecase.ts` |
| Repository Port | `kebab-case-repository.ts` | `routine-repository.ts` |
| Repository Impl | `drizzle-kebab-case-repository.ts` | `drizzle-routine-repository.ts` |
| Domain Event | `kebab-case.ts` in `events/` | `routine-created.ts` |
| Subscriber | `kebab-case.subscriber.ts` | `start-workout-on-routine-created.subscriber.ts` |
| Test Mother | `kebab-case.mother.ts` | `routine.mother.ts` |
| Mock | `mock-kebab-case-repository.ts` | `mock-routine-repository.ts` |

### Class Names

| Type | Pattern | Example |
|------|---------|---------|
| Use Case | `<Action><Entity>` | `CreateRoutine`, `SearchWorkoutsByUser` |
| Find helper | `Find<Entity>` | `FindRoutine` |
| Subscriber | `<Action>On<Event>` | `StartWorkoutOnRoutineCreated` |
| Event | `<Entity><Action>DomainEvent` | `RoutineCreatedDomainEvent` |
| eventName | `<app>.<context>.<entity>.<action>` | `fierros.training.routine.created` |

## Reference Files

Detailed implementation patterns:

| File | When to Read |
|------|--------------|
| [spec-pattern.md](references/spec-pattern.md) | Core domain spec syntax (pseudolanguage for design phase) |
| [folder-structure.md](references/folder-structure.md) | Module and file organization |
| [use-case-patterns.md](references/use-case-patterns.md) | Find/Search/Create/Update/Delete patterns |
| [domain-events.md](references/domain-events.md) | Events, subscribers, AggregateRoot |
| [repository-patterns.md](references/repository-patterns.md) | Abstract ports and Drizzle implementations |
| [di-patterns.md](references/di-patterns.md) | DIOD container registration |
| [test-patterns.md](references/test-patterns.md) | Mothers, mocks, test structure |

## Spec Pattern

Specs use a pseudolanguage. See [spec-pattern.md](references/spec-pattern.md) for the full spec syntax.

Specs location: `packages/core/_specs_/contexts/<context>/<module>.md`
Diffs location: `packages/core/_diffs_/contexts/<context>/<module>/`

## Commands

```bash
cd packages/core && bun test                              # All tests
cd packages/core && bun test tests/contexts/<ctx>/<mod>/  # Module tests
cd packages/core && bun run type-check                    # Type check
```

## Key Patterns Quick Reference

### Use Case Signatures

```typescript
// Find (domain helper) - throws if not found
class FindRoutine { execute(params: { id: string }): Promise<Routine> }

// Search (query) - returns primitives
class SearchRoutinesByUser { execute(params: { userId: string }): Promise<RoutinePrimitives[]> }

// Create (command) - returns void
class CreateRoutine { execute(payload: CreatePayload): Promise<void> }

// Update (command) - two-part signature: execute(params, payload)
class UpdateRoutine { execute(params: UpdateParams, payload: UpdatePayload): Promise<void> }

// Delete (command)
class DeleteRoutine { execute(params: { userId: string, routineId: string }): Promise<void> }
```

### Domain Error Patterns

| Error | When | Location |
|-------|------|----------|
| `InvalidArgumentError` | Construction-time validation | Constructors, factories |
| `InvalidOperationError` | Runtime state conflicts | Behavior methods |
| `<Entity>DoesNotExistError` | Entity not found | Each module's domain/ |
| `UnauthorizedResourceAccessError` | Ownership check fails | shared/domain/ |

### Aggregate Required Methods

```typescript
belongsTo(userId: string): boolean      // Ownership check
update<Field>(value): void              // Mutation + event emission
toPrimitives(): EntityPrimitives        // Serialization
static fromPrimitives(p): Entity        // Deserialization
```
