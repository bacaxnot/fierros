# Execution Guidelines

Step-by-step process for implementing a diff.

## 1. Parse the Diff

Read the diff file and identify:

- **Requirements**: What needs to be accomplished
- **Folder Structure**: Visual tree with annotations
- **Implementation Details**: Code to write

## 2. Identify Changes

From the folder structure, extract:

| Annotation | Action |
|------------|--------|
| `# NEW` | Create this file |
| `# UPDATE` | Modify existing file |
| `# DELETE` | Remove this file |
| `# NEW: Description` | Create with context |
| `# UPDATE: what` | Modify specific parts |

## 3. Order of Implementation

Follow the diff's implementation order if specified. If not, use this default order:

### Core Package

1. **Domain errors** - `*-error.ts`
2. **Value objects** - Simple VOs first
3. **ID types** - `*-id.ts`
4. **Aggregates** - Entity files
5. **Repository interfaces** - `*-repository.ts`
6. **Domain use cases** - `find-*.usecase.ts`
7. **Application use cases** - Create, Update, Delete, Search
8. **Subscribers** - `*-on-*.subscriber.ts`
9. **Infrastructure** - `drizzle-*-repository.ts`
10. **DI registration** - If applicable

### API App

1. **Controller schemas** - Zod schemas
2. **Controllers** - GET, PUT, PATCH, DELETE, POST
3. **Routes** - Route file
4. **Index registration** - Add to main app

## 4. Implementation Steps

For each file:

### Creating New Files

1. Create parent directories if needed
2. Write the file content from the diff
3. Verify imports resolve correctly
4. Check naming matches conventions

### Modifying Existing Files

1. Read the current file
2. Identify the specific changes from the diff
3. Apply changes carefully
4. Preserve existing functionality
5. Update imports if needed

### Deleting Files

1. Verify no other files import the deleted file
2. Update any imports that referenced it
3. Remove the file

## 5. Import Resolution

Ensure imports follow project conventions:

### Core Package
```typescript
// Relative within module
import { Exercise } from "./exercise";

// Cross-module (same context)
import { RoutineId } from "../../routines/domain/routine-id";

// Shared
import { DomainError } from "../../../../shared/domain/domain-error";

// DI
import { InferDependencies } from "../../../../../di/autoregister";
```

### API App
```typescript
// From core - Fierros API calls core use cases
import { CreateExercise } from "@repo/core/contexts/training/exercises/application/create-exercise.usecase";

// Internal
import { factory } from "~/lib/factory";
import { json, created } from "~/lib/http-response";
```

## 6. Running Validation

After implementation, verify:

```bash
# TypeScript type checking
bun run type-check

# Biome linting
bun run lint

# Or specific package tests
cd packages/core && bun test tests/contexts/<ctx>/<mod>/
```

## 7. Common Pitfalls

| Issue | Solution |
|-------|----------|
| Import path wrong | Check relative path depth |
| Missing export | Explicit imports, no index.ts |
| Type mismatch | Cast to branded types in mapper |
| Validation not called | Add `ensure<Entity>IsValid()` in use case |
| Error not thrown | Error factories return DomainError, must `throw` them |
