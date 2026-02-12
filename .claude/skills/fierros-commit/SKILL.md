---
name: fierros-commit
description: >
  Creates git commits following conventional-commits format for the Fierros monorepo.
  Trigger: When creating commits, after completing code changes, when user asks to commit.
metadata:
  scope: [root]
  auto_invoke:
    - "Committing changes"
    - "Creating a git commit"
---

## Critical Rules

- ALWAYS use conventional-commits: `type(scope): description`
- ALWAYS keep first line under 72 characters
- ALWAYS ask for user confirmation before committing
- NEVER be overly specific (avoid counts, line numbers)
- NEVER use `-n` flag unless user explicitly requests it
- NEVER use `git push --force`
- NEVER proactively offer to commit - wait for explicit request

## Commit Format

```
type(scope): concise description

- Key change 1
- Key change 2
```

### Types

| Type | Use When |
|------|----------|
| `feat` | New feature or functionality |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `chore` | Maintenance, dependencies, configs |
| `refactor` | Code change without feature/fix |
| `test` | Adding or updating tests |
| `perf` | Performance improvement |
| `style` | Formatting, no code change |

### Scopes

| Scope | When |
|-------|------|
| `core` | Changes in `packages/core/` |
| `api` | Changes in `apps/api/` |
| `db` | Changes in `packages/db/` |
| `auth` | Changes in `packages/auth/` |
| `skills` | Changes in `.claude/skills/` |
| *omit* | Multiple scopes or root-level |

## Good vs Bad Examples

```
# GOOD
feat(core): add routine update use case
fix(api): resolve auth session refresh on 401
chore(skills): update fierros-core skill metadata
docs: update monorepo setup guide

# BAD
feat(core): add routine update use case with blocks and sets and metrics
chore(skills): update 5 skill files with metadata blocks
fix(api): fix the bug on line 45 in auth middleware
```

## Workflow

1. **Analyze changes**: `git status && git diff --stat HEAD`
2. **Check recent style**: `git log -3 --oneline`
3. **Draft message**: Choose type + scope, write title < 72 chars, add 2-5 bullets
4. **Present to user**: Show files + proposed message, wait for confirmation
5. **Execute**: `git add <files> && git commit -m "..."`

## Decision Tree

```
Single file changed?
├─ Yes → Title only, may omit body
└─ No → Include body with key changes

Multiple scopes?
├─ Yes → Omit scope: `feat: description`
└─ No → Include scope: `feat(api): description`
```
