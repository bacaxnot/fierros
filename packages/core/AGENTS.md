# Fierros Core - AI Agent Ruleset

> **Skills Reference**:
> - [`fierros-core`](../../.claude/skills/fierros-core/SKILL.md) - Core DDD architecture patterns
> - [`spec-driven-dev`](../../.claude/skills/spec-driven-dev/SKILL.md) - Spec-driven development workflow
> - [`typescript`](../../.claude/skills/typescript/SKILL.md) - TypeScript patterns

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
|--------|-------|
| Compiling specs into code | `spec-driven-dev` |
| Creating aggregates, value objects, or use cases in core | `fierros-core` |
| Creating implementation plans from specs | `spec-driven-dev` |
| Creating or modifying specifications | `spec-driven-dev` |
| Designing a new feature or module | `spec-driven-dev` |
| Domain modeling or API contract design | `spec-driven-dev` |
| Generating diffs for specifications | `spec-driven-dev` |
| Implementing DDD domain patterns | `fierros-core` |
| Implementing diffs or implementation plans | `spec-driven-dev` |
| Working on packages/core code | `fierros-core` |
| Writing TypeScript types/interfaces | `typescript` |

## Critical Rules (NON-NEGOTIABLE)

1. **DDD architecture**: Aggregates, Value Objects, Use Cases, Domain Events
2. **One aggregate root per module**: Each module in `src/contexts/<context>/<module>/`
3. **DIOD DI**: Use diod container for dependency injection with `@InferDependencies()` decorator
4. **Use case pattern**: `execute(params)` returning domain entities
5. **Event-driven**: Domain events for cross-context communication

## Project Structure

```
packages/core/src/
├── contexts/
│   └── training/
│       ├── exercises/
│       ├── exercise-metrics/
│       ├── routines/
│       ├── workouts/
│       └── users/
├── shared/
│   ├── domain/                # Shared VOs, base classes
│   └── infrastructure/        # DI container, shared adapters
└── tests/
    └── contexts/              # Mirrors src/contexts structure
```

## Naming Conventions

| Element | Pattern | Example |
|---------|---------|---------|
| Aggregate | `kebab-case.ts` | `exercise.ts` |
| Value Object | `PascalCase.ts` | `ExerciseId.ts` |
| Use Case | `kebab-case.usecase.ts` | `create-exercise.usecase.ts` |
| Repository Port | `kebab-case-repository.ts` | `exercise-repository.ts` |
| Domain Event | `kebab-case.event.ts` | `exercise-created.event.ts` |
| Test Mother | `kebab-case.mother.ts` | `exercise.mother.ts` |

## Specs & Diffs

- Specs: `packages/core/_specs_/contexts/<context>/<module>.md`
- Diffs: `packages/core/_diffs_/contexts/<context>/<module>/`

## Commands

```bash
cd packages/core && bun test                              # All tests
cd packages/core && bun test tests/contexts/<ctx>/<mod>/  # Module tests
cd packages/core && bun run type-check                    # Type check
```
