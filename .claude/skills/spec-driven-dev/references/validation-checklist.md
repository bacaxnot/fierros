# Validation Checklist

Verify implementation before asking for user confirmation.

## TypeScript Compilation

- [ ] Code compiles without errors
- [ ] No type mismatches
- [ ] All imports resolve

```bash
# Check compilation
bun run type-check
```

## Biome Lint

- [ ] No lint errors: `bun run lint`

## Naming Conventions

### Files
- [ ] kebab-case filenames: `exercise.ts`
- [ ] Correct suffixes: `.usecase.ts`, `.subscriber.ts`
- [ ] Match existing patterns in the folder

### Classes/Types
- [ ] PascalCase: `Exercise`, `CreateExercise`
- [ ] Use cases: `<Action><Entity>`
- [ ] Errors: `<Entity><Issue>Error`
- [ ] Events: `<Entity><Action>DomainEvent`

## Import Paths

### Core Package
- [ ] Relative imports within module
- [ ] Cross-module uses `../../` correctly
- [ ] Shared imports use correct depth
- [ ] DI decorator imported correctly

### API App
- [ ] `@repo/core` for core use case imports
- [ ] `~/` alias for internal imports
- [ ] No hardcoded paths

## Code Patterns

### Core Domain
- [ ] Aggregates have `toPrimitives()` and `fromPrimitives()`
- [ ] IDs extend proper base class
- [ ] Errors extend `DomainError`
- [ ] Repositories are abstract classes
- [ ] Use cases have `@InferDependencies()` decorator

### Core Application
- [ ] Update use cases have `execute(params, payload)` signature
- [ ] Ownership validation before modifications
- [ ] Events emitted after state changes

### API Controllers
- [ ] Zod schemas for validation
- [ ] `factory.createHandlers()` pattern
- [ ] Error handling with DomainError check
- [ ] Correct response helpers (json, created, noContent)

## Dependencies

- [ ] No circular dependencies
- [ ] All required packages imported
- [ ] No unused imports

## Testing

For Core package diffs with test files:

- [ ] All tests pass: `cd packages/core && bun test tests/contexts/<context>/<module>/`
- [ ] Happy tests cover all scenarios from spec's `scenarios:` list
- [ ] Guard tests cover all items from spec's `guards:` list (one test per guard)
- [ ] Validation test covers all items from spec's `validation:` list (single test, multiple asserts)
- [ ] Mothers have `create()` (aggregates/events) or `random()`/`invalidValue()` (VOs)
- [ ] Mocks expose `mock()` from `bun:test` and have `returnOn*` helpers

## Final Checks

- [ ] No console.log statements (unless intentional)
- [ ] No TODO comments left unresolved
- [ ] No commented-out code
- [ ] Code matches diff specifications
