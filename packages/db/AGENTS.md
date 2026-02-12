# Fierros DB - AI Agent Ruleset

> **Skills Reference**:
> - [`drizzle`](../../.claude/skills/drizzle/SKILL.md) - Drizzle ORM patterns

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
|--------|-------|
| Creating or modifying database schemas | `drizzle` |
| Writing Drizzle queries | `drizzle` |
| Writing database migrations | `drizzle` |

## Critical Rules

1. **Drizzle ORM**: All database interactions through Drizzle
2. **Schema-first**: Define schemas in `src/schema/`, generate migrations
3. **Type-safe queries**: Use Drizzle's query builder, never raw SQL unless necessary

## Project Structure

```
packages/db/
├── src/
│   ├── schema/           # Drizzle table definitions
│   ├── migrations/       # Generated migrations
│   └── index.ts          # DB client export
├── drizzle.config.ts
└── package.json
```

## Commands

```bash
cd packages/db && bun run generate    # Generate migrations
cd packages/db && bun run migrate     # Run migrations
cd packages/db && bun run studio      # Drizzle Studio
```
