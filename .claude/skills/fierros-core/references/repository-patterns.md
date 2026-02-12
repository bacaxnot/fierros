# Core Repository Patterns

## File Structure

```
<module>/
├── domain/
│   └── <entity>-repository.ts       # Abstract interface
└── infrastructure/
    └── drizzle-<entity>-repository.ts  # Drizzle implementation
```

## Domain Interface

Abstract class defining the repository contract.

```typescript
// domain/routine-repository.ts
import type { Routine } from "./routine";
import type { RoutineId } from "./routine-id";
import type { UserId } from "../../users/domain/user-id";

export abstract class RoutineRepository {
  abstract save(routine: Routine): Promise<void>;
  abstract search(id: RoutineId): Promise<Routine | null>;
  abstract searchByUserId(userId: UserId): Promise<Routine[]>;
  abstract delete(id: RoutineId): Promise<void>;
}
```

## Drizzle Implementation

Concrete implementation using Drizzle ORM.

```typescript
// infrastructure/drizzle-routine-repository.ts
import { eq } from "@repo/db/orm";
import { db } from "@repo/db";
import { routines } from "@repo/db/schema";

import { Routine } from "../domain/routine";
import type { RoutineId } from "../domain/routine-id";
import { RoutineRepository } from "../domain/routine-repository";
import type { UserId } from "../../users/domain/user-id";

export class DrizzleRoutineRepository extends RoutineRepository {
  async save(routine: Routine): Promise<void> {
    const primitives = routine.toPrimitives();
    const now = new Date();

    await db
      .insert(routines)
      .values({
        id: primitives.id,
        userId: primitives.userId,
        name: primitives.name,
        frequency: primitives.frequency,
        exercises: primitives.exercises,
        isActive: primitives.isActive,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: routines.id,
        set: {
          name: primitives.name,
          frequency: primitives.frequency,
          exercises: primitives.exercises,
          isActive: primitives.isActive,
          updatedAt: now,
        },
      });
  }

  async search(id: RoutineId): Promise<Routine | null> {
    const rows = await db
      .select()
      .from(routines)
      .where(eq(routines.id, id.value))
      .limit(1);

    if (rows.length === 0) return null;

    return this.toAggregate(rows[0]);
  }

  async searchByUserId(userId: UserId): Promise<Routine[]> {
    const rows = await db
      .select()
      .from(routines)
      .where(eq(routines.userId, userId.value));

    return rows.map((row) => this.toAggregate(row));
  }

  async delete(id: RoutineId): Promise<void> {
    await db
      .delete(routines)
      .where(eq(routines.id, id.value));
  }

  private toAggregate(row: typeof routines.$inferSelect): Routine {
    return Routine.fromPrimitives({
      id: row.id,
      userId: row.userId,
      name: row.name,
      frequency: row.frequency,
      exercises: row.exercises,
      isActive: row.isActive,
    });
  }
}
```

## Key Patterns

### Upsert with onConflictDoUpdate

```typescript
await db
  .insert(table)
  .values({ ... })
  .onConflictDoUpdate({
    target: table.id,
    set: { ...fieldsToUpdate, updatedAt: now },
  });
```

### Query with eq()

```typescript
import { eq } from "@repo/db/orm";

const rows = await db
  .select()
  .from(table)
  .where(eq(table.fieldName, value))
  .limit(1);
```

### Multiple conditions

```typescript
import { and, eq } from "@repo/db/orm";

const rows = await db
  .select()
  .from(table)
  .where(and(
    eq(table.userId, userId.value),
    eq(table.isActive, true)
  ));
```

### Delete

```typescript
await db
  .delete(table)
  .where(eq(table.id, id.value));
```

## Aggregate Methods

Repositories expect aggregates to have:

```typescript
// Serialize to primitives
toPrimitives(): EntityPrimitives

// Deserialize from primitives (static factory)
static fromPrimitives(primitives: EntityPrimitives): Entity
```

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Interface | `<Entity>Repository` | `RoutineRepository` |
| Implementation | `Drizzle<Entity>Repository` | `DrizzleRoutineRepository` |
| File (interface) | `<entity>-repository.ts` | `routine-repository.ts` |
| File (impl) | `drizzle-<entity>-repository.ts` | `drizzle-routine-repository.ts` |
