# Diff Document Format

Implementation plans use a tree-based structure for clarity.

## Template

```markdown
# <Feature> Implementation Plan

Based on the spec defined in `<path-to-spec>`.

## Requirements

1. **Entity1**: list, create, update, delete
2. **Entity2**: specific operations...

## Folder Structure

```
packages/core/
├── tests/contexts/<context>/
│   └── entity1/
│       ├── domain/
│       │   ├── entity1-mother.ts                    # NEW
│       │   ├── entity1-id-mother.ts                 # NEW
│       │   ├── mock-entity1-repository.ts           # NEW
│       │   └── events/
│       │       └── entity1-created-mother.ts        # NEW
│       └── application/
│           └── create-entity1.test.ts               # NEW
└── src/contexts/<context>/
    └── entity1/
        ├── domain/
        │   ├── entity1.ts                           # NEW
        │   ├── entity1-id.ts                        # NEW
        │   ├── entity1-repository.ts                # NEW
        │   └── events/
        │       └── entity1-created.ts               # NEW
        └── application/
            └── create-entity1.usecase.ts            # NEW
```

**Note:** Tests appear BEFORE production code in both tree and implementation details.

## Implementation Details

### Entity1 Module

#### `entity1/domain/entity1-does-not-exist-error.ts`
```typescript
import { DomainError } from "../../../../shared/domain/domain-error";

export class Entity1DoesNotExistError extends DomainError {
  readonly type = "Entity1DoesNotExistError";
  readonly message: string;

  constructor(public readonly entity1Id: string) {
    super();
    this.message = `The entity1 ${this.entity1Id} does not exist`;
  }
}
```

#### `entity1/domain/entity1.ts`
```typescript
// Production-ready code OR pseudocode depending on complexity
```
```

## Annotations

Use these annotations in the folder structure tree:

| Annotation | Meaning |
|------------|---------|
| `# NEW` | File to be created |
| `# UPDATE` | File to be modified |
| `# DELETE` | File to be removed |
| `# NEW: Description` | New file with context |
| `# UPDATE: what changes` | What's being modified |

**Note:** Only include files with actions (NEW/UPDATE/DELETE). Omit unchanged existing files from the tree.

## Test Files

When the spec includes `happy:`, `guards:`, and `validation:` in use cases, generate test files following [core-test-patterns.md](core-test-patterns.md).

## Detail Level

Adjust based on complexity:

| Complexity | Detail Level |
|------------|--------------|
| **High** (new patterns, many files) | Full production-ready code |
| **Medium** (standard patterns) | Code structure with key parts |
| **Low** (simple changes) | Pseudocode or description |

## Grouping

Group implementation details by module/entity:

```markdown
### Exercises Module

#### `domain/exercise.ts`
...

#### `application/create-exercise.usecase.ts`
...

### Routines Module

#### `domain/routine.ts`
...
```

## Naming

File: `YYYY-MM-DDTHH-MM-SS-<slug>.md`
- Timestamp ensures uniqueness and chronological sorting
- Slug provides human-readable context

Examples:
- `2024-01-15T10-30-00-add-pause-method.md`
- `2024-01-15T14-45-00-initial-implementation.md`
