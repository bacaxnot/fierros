---
name: fierros-pr
description: >
  Creates Pull Requests for Fierros following project conventions.
  Trigger: When creating PRs, reviewing PR requirements, or using gh pr create.
metadata:
  scope: [root]
  auto_invoke:
    - "Create a PR with gh pr create"
    - "Reviewing PR requirements"
---

## Determine `<base>`

Fierros uses `main` as the only long-lived branch.

```
<base> = main
```

## PR Creation Process

1. **Analyze changes**: `git diff main...HEAD` to understand ALL commits
2. **Determine affected components**: Core, API, Auth, DB
3. **Fill template sections**
4. **Create PR** with `gh pr create --base main`

## PR Template

```markdown
## Summary

- {Bullet point summary of changes}

## Affected Components

- [ ] Core (`packages/core/`)
- [ ] API (`apps/api/`)
- [ ] Auth (`packages/auth/`)
- [ ] DB (`packages/db/`)

## Test Plan

- {How to verify the changes}

## Checklist

- [ ] Type checks pass (`bun run type-check`)
- [ ] Lint passes (`bun run lint`)
- [ ] Tests pass (if applicable)
- [ ] Specs updated (if design changed)
- [ ] No `.env` files or secrets committed
```

## Title Conventions

Follow conventional commits: `type(scope): description`

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `chore:` Maintenance
- `refactor:` Code restructure
- `test:` Tests

## Commands

```bash
# Check current branch
git status
git log main..HEAD --oneline
git diff main...HEAD

# Create PR
gh pr create --base main --title "feat(core): add routine use cases" --body "$(cat <<'EOF'
## Summary

- Add CRUD use cases for routines
- Add domain errors and find helper

## Test Plan

- Run `bun run type-check` in packages/core
- Run `bun test` in packages/core
EOF
)"

# Create draft PR
gh pr create --base main --draft --title "feat: description"
```

## Before Creating PR

1. All type checks pass (`bun run type-check`)
2. Lint passes (`bun run lint`)
3. Tests pass (if applicable)
4. Branch is up to date with `main`
5. Commits are clean (use `fierros-commit` skill)
