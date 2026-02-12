# Fierros API - AI Agent Ruleset

> **Skills Reference**:
> - [`fierros-api`](../../.claude/skills/fierros-api/SKILL.md) - API architecture patterns
> - [`spec-driven-dev`](../../.claude/skills/spec-driven-dev/SKILL.md) - Spec-driven development workflow
> - [`hono`](../../.claude/skills/hono/SKILL.md) - Hono framework patterns

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
|--------|-------|
| Compiling specs into code | `spec-driven-dev` |
| Creating Hono routes or middleware | `hono` |
| Creating implementation plans from specs | `spec-driven-dev` |
| Creating or modifying API controllers | `fierros-api` |
| Creating or modifying specifications | `spec-driven-dev` |
| Defining API routes or endpoints | `fierros-api` |
| Designing a new feature or module | `spec-driven-dev` |
| Domain modeling or API contract design | `spec-driven-dev` |
| Generating diffs for specifications | `spec-driven-dev` |
| Implementing diffs or implementation plans | `spec-driven-dev` |
| Working on apps/api code | `fierros-api` |
| Writing TypeScript types/interfaces | `typescript` |

## Critical Rules (NON-NEGOTIABLE)

1. **Hono framework**: All routes use Hono's router
2. **Core use cases via DI**: Controllers resolve core use cases from the DI container
3. **Auth from session**: Extract userId from `c.get("user")` via better-auth session middleware
4. **Zod 4 validation**: Use `@hono/zod-validator` for request validation
5. **Controllers orchestrate**: Controllers call use cases, handle errors, return responses

## Project Structure

```
apps/api/src/
├── routes/
│   └── <resource>/
│       ├── index.ts          # Route definitions
│       └── <resource>.controller.ts
├── middleware/
├── lib/
└── shared/
```

## Specs & Diffs

- Specs: `apps/api/_specs_/routes/<resource>.md`
- Diffs: `apps/api/_diffs_/routes/<resource>/`

## Commands

```bash
cd apps/api && bun run dev          # Development server
cd apps/api && bun run type-check   # Type check
```
