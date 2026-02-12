# Repository Guidelines

## How to Use This Guide

- Start here for cross-project norms. Fierros is a monorepo with several components.
- Each component has an `AGENTS.md` file with specific guidelines (e.g., `apps/api/AGENTS.md`, `packages/core/AGENTS.md`).
- Component docs override this file when guidance conflicts.

## Available Skills

Use these skills for detailed patterns on-demand:

### Generic Skills (Any Project)
| Skill | Description | URL |
|-------|-------------|-----|
| `typescript` | Const types, flat interfaces, utility types | [SKILL.md](.claude/skills/typescript/SKILL.md) |
| `hono` | Hono web framework patterns | [SKILL.md](.claude/skills/hono/SKILL.md) |
| `drizzle` | Drizzle ORM patterns | [SKILL.md](.claude/skills/drizzle/SKILL.md) |
| `turborepo` | Monorepo task pipelines and caching | [SKILL.md](.claude/skills/turborepo/SKILL.md) |

### Fierros-Specific Skills
| Skill | Description | URL |
|-------|-------------|-----|
| `fierros` | Project overview, component navigation | [SKILL.md](.claude/skills/fierros/SKILL.md) |
| `fierros-core` | Core DDD architecture patterns | [SKILL.md](.claude/skills/fierros-core/SKILL.md) |
| `fierros-api` | API controller and route patterns | [SKILL.md](.claude/skills/fierros-api/SKILL.md) |
| `fierros-commit` | Conventional commit conventions | [SKILL.md](.claude/skills/fierros-commit/SKILL.md) |
| `fierros-pr` | Pull request template and conventions | [SKILL.md](.claude/skills/fierros-pr/SKILL.md) |
| `spec-driven-dev` | Spec-driven development workflow (design/diff/compile) | [SKILL.md](.claude/skills/spec-driven-dev/SKILL.md) |
| `skill-creator` | Create new AI agent skills | [SKILL.md](.claude/skills/skill-creator/SKILL.md) |
| `skill-updater` | Update existing skills from feedback | [SKILL.md](.claude/skills/skill-updater/SKILL.md) |

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
|--------|-------|
| Committing changes | `fierros-commit` |
| Compiling specs into code | `spec-driven-dev` |
| Configuring Turborepo or turbo.json | `turborepo` |
| Create a PR with gh pr create | `fierros-pr` |
| Creating a git commit | `fierros-commit` |
| Creating aggregates, value objects, or use cases in core | `fierros-core` |
| Creating implementation plans from specs | `spec-driven-dev` |
| Creating new skills | `skill-creator` |
| Creating or modifying API controllers | `fierros-api` |
| Creating or modifying specifications | `spec-driven-dev` |
| Defining API routes or endpoints | `fierros-api` |
| Designing a new feature or module | `spec-driven-dev` |
| Domain modeling or API contract design | `spec-driven-dev` |
| General Fierros development questions | `fierros` |
| Generating diffs for specifications | `spec-driven-dev` |
| Implementing DDD domain patterns | `fierros-core` |
| Implementing diffs or implementation plans | `spec-driven-dev` |
| Reviewing PR requirements | `fierros-pr` |
| Updating or improving existing skills | `skill-updater` |
| Working on apps/api code | `fierros-api` |
| Working on packages/core code | `fierros-core` |
| Writing TypeScript types/interfaces | `typescript` |

---

## Project Overview

Fierros is a workout tracking platform for fitness enthusiasts.

| Component | Location | Tech Stack |
|-----------|----------|------------|
| Core | `packages/core/` | TypeScript, DDD, Event-driven |
| API | `apps/api/` | Hono, TypeScript |
| Auth | `packages/auth/` | Better-Auth |
| DB | `packages/db/` | Drizzle ORM |

---

## Spec-Driven Development

The spec-driven workflow is the centerpiece of this project:

1. **Design** - Create specs in `_specs_/` directories
2. **Diff** - Generate implementation plans in `_diffs_/` directories
3. **Compile** - Execute implementation plans into code

Each component has its own `_specs_/` and `_diffs_/` directories. Cross-scope features may require specs in multiple components.

Load the `spec-driven-dev` skill for full workflow guidance.

---

## Commit & Pull Request Guidelines

Follow conventional-commit style: `<type>[scope]: <description>`

**Types:** `feat`, `fix`, `docs`, `chore`, `perf`, `refactor`, `style`, `test`

Before creating a PR:
1. Run all relevant type checks (`bun run type-check`) and tests
2. Run lint (`bun run lint`)
