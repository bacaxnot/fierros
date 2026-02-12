---
name: drizzle
description: >
  Drizzle ORM patterns and best practices for database schemas, queries, and migrations.
  Trigger: When creating/modifying database schemas, writing queries, or managing migrations.
metadata:
  scope: [db]
  auto_invoke:
    - "Creating or modifying database schemas"
    - "Writing database migrations"
    - "Writing Drizzle queries"
---

## Schema Definition

```typescript
import { pgTable, text, integer, timestamp, boolean, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  age: integer("age"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

## Relations

```typescript
import { relations } from "drizzle-orm";

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content"),
  authorId: uuid("author_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
```

## Queries

```typescript
import { eq, and, or, like, desc, asc, sql } from "drizzle-orm";

// Select
const allUsers = await db.select().from(users);
const user = await db.select().from(users).where(eq(users.id, id));

// With conditions
const activeUsers = await db
  .select()
  .from(users)
  .where(and(eq(users.active, true), like(users.name, "%john%")))
  .orderBy(desc(users.createdAt))
  .limit(10);

// Insert
const [newUser] = await db.insert(users).values({ name, email }).returning();

// Update
await db.update(users).set({ name: "New Name" }).where(eq(users.id, id));

// Delete
await db.delete(users).where(eq(users.id, id));
```

## Relational Queries

```typescript
// Using the query API (needs relations defined)
const usersWithPosts = await db.query.users.findMany({
  with: {
    posts: true,
  },
  where: eq(users.active, true),
  orderBy: [desc(users.createdAt)],
  limit: 10,
});

const userWithPosts = await db.query.users.findFirst({
  where: eq(users.id, id),
  with: {
    posts: {
      orderBy: [desc(posts.createdAt)],
      limit: 5,
    },
  },
});
```

## Transactions

```typescript
await db.transaction(async (tx) => {
  const [user] = await tx.insert(users).values({ name, email }).returning();
  await tx.insert(posts).values({ title, authorId: user.id });
});
```

## Migrations

```bash
# Generate migration from schema changes
bun run drizzle-kit generate

# Apply migrations
bun run drizzle-kit migrate

# Open Drizzle Studio
bun run drizzle-kit studio
```

## Config (drizzle.config.ts)

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema/*",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## Type Inference

```typescript
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

type User = InferSelectModel<typeof users>;
type NewUser = InferInsertModel<typeof users>;
```

## Resources

- Docs: `https://orm.drizzle.team/llms.txt`
- Use WebFetch for up-to-date API reference
