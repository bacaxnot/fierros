---
name: spec-driven-dev
description: >
  Spec-driven development workflow for Fierros. Design specs, create implementation plans (diffs), and compile into code.
  Trigger: When designing features, creating specs, generating implementation plans, compiling diffs into code, or following the design/diff/compile workflow.
metadata:
  scope: [root, core, api]
  auto_invoke:
    - "Designing a new feature or module"
    - "Creating or modifying specifications"
    - "Creating implementation plans from specs"
    - "Implementing diffs or implementation plans"
    - "Compiling specs into code"
    - "Domain modeling or API contract design"
    - "Generating diffs for specifications"
---

# Spec-Driven Development

Fierros uses a three-phase workflow to go from idea to code:

```
Design  ->  Diff  ->  Compile
(specs)    (plans)   (code)
```

Each phase produces artifacts that feed the next. Load the relevant **package skill** (`fierros-core`, `fierros-api`) for scope-specific patterns and spec syntax.

## Scope Detection

| Scope | Spec Location | Diff Location | Package Skill |
|-------|---------------|---------------|---------------|
| **Core** | `packages/core/_specs_/contexts/<ctx>/<mod>.md` | `packages/core/_diffs_/contexts/<ctx>/<mod>/` | `fierros-core` |
| **API** | `apps/api/_specs_/routes/<resource>.md` | `apps/api/_diffs_/routes/<resource>/` | `fierros-api` |

**Multi-scope**: A feature may require specs in multiple scopes (e.g., core domain + API endpoint).

---

## Phase 1: Design

Create specification files through interactive discussion.

### Process

1. **Understand intent**: What does this feature do? Which scopes does it affect?
2. **Check existing patterns**: Read existing specs in the same context
3. **Iterative design**: Propose structure, ask clarifying questions, refine
4. **Output spec(s)**: Write spec file(s) to the appropriate `_specs_/` directory
5. **Confirm & handoff**: Summarize, get approval, suggest next steps

### Spec Patterns

Each package skill contains its spec pattern in references. Load the relevant one:

| Scope | Spec Pattern Reference |
|-------|----------------------|
| Core | `fierros-core` -> `references/spec-pattern.md` |
| API | `fierros-api` -> `references/spec-pattern.md` |

### Design Principles

- **Interactive first**: Always discuss before outputting. Ask questions.
- **YAGNI**: Only include what's needed now.
- **Specs are contracts**: They define what should exist, not how to implement it.
- **Challenge abstractions**: Before proposing wrappers or orchestrators, ask whether the logic belongs in the primary use case.
- **Proactive trade-off analysis**: When presenting alternatives, give an honest recommendation.

---

## Phase 2: Diff

Compare spec(s) against current codebase and create implementation plans.

### Process

1. **Identify spec(s)**: Which spec to diff? Can process single or multiple specs.
2. **Analyze current code**: Read existing codebase, understand patterns and dependencies.
3. **Generate diff**: Create implementation plan following the [diff format](references/diff-format.md).
4. **Write plan**: Detailed implementation with code, following the package skill's patterns.
5. **Confirm & handoff**: Summarize changes, get approval, suggest next steps.

### Creating the Diff File

```bash
python skills/spec-driven-dev/scripts/create-diff.py <spec-file-path>
# Examples:
python skills/spec-driven-dev/scripts/create-diff.py packages/core/_specs_/contexts/training/exercises.md
python skills/spec-driven-dev/scripts/create-diff.py apps/api/_specs_/routes/exercises.md
```

The script derives everything from the spec path: package, diff directory, and an auto-generated slug.

### Diff Principles

- **Spec is source of truth**: If code exists but isn't in spec, mark it DELETE.
- **Flexible detail level**: Full code for complex changes, pseudocode for simple ones.
- **Overwrite pending**: If a diff exists (not in `done/`), update it silently.
- **Tests first**: When spec includes test sections, generate test files before production code.

### Test Generation (Core Package)

When specs include `happy:`, `guards:`, and `validation:` in use cases:

1. Generate test files FIRST (before production code)
2. Derive mothers from spec entities (aggregate -> `create()`, VOs -> `random()`/`invalidValue()`)
3. Derive mocks from collaborators (repository -> `Mock<Name>`)
4. Use shared test utilities: `MockEventBus`, `StubClock`, `TimestampMother`
5. `test-entry` determines instantiation (default: use case directly; with subscriber name: via subscriber)
6. Test order: happy -> guards -> validation

---

## Phase 3: Compile

Execute implementation plans (diffs), writing actual code.

### Process

1. **Load diff**: Read and understand the diff file.
2. **Implement**: Follow the diff's folder structure and implementation details. Create NEW, modify UPDATE, remove DELETE.
3. **Run tests** (Core): `cd packages/core && bun test tests/contexts/<ctx>/<mod>/`
4. **Validate**: Run the [validation checklist](references/validation-checklist.md).
5. **Confirm & archive**: Get approval, then archive diff to `done/`.

### Archiving

```bash
python3 skills/spec-driven-dev/scripts/archive-diff.py <diff-file-path>
```

### Compile Principles

- **Diff is source of truth**: Follow the plan, don't improvise.
- **Validate against codebase**: Ensure conventions match existing code.
- **Confirm before archiving**: User must approve.
- **Iterative**: If issues found, fix and re-validate.

See [execution-guidelines.md](references/execution-guidelines.md) for implementation order and import resolution per scope.

---

## Adding a New Scope

To extend spec-driven-dev to a new package/app:

1. **Create `_specs_/` and `_diffs_/` directories** in the package
2. **Create a `fierros-{package}` skill** with spec pattern in references and implementation patterns
3. **Add entry to `PACKAGE_MAP`** in `scripts/create-diff.py`
4. **Add scope to tables** in this SKILL.md
5. **Update `execution-guidelines.md`** with implementation order for the scope
6. **Update `validation-checklist.md`** with validation rules for the scope

---

## Reference Files

| File | When to Read |
|------|--------------|
| [diff-format.md](references/diff-format.md) | When creating implementation plans (Phase 2) |
| [execution-guidelines.md](references/execution-guidelines.md) | When implementing diffs (Phase 3) - implementation order, imports |
| [validation-checklist.md](references/validation-checklist.md) | When validating implementation (Phase 3) |

## Example Flow

```
User: "Add a way to pause workouts"

Phase 1 - Design:
  -> Determine scopes: Core (pause method) + API (pause endpoint)
  -> Load fierros-core, read spec-pattern.md
  -> Create packages/core/_specs_/contexts/training/workouts.md (update)
  -> Load fierros-api, read spec-pattern.md
  -> Create apps/api/_specs_/routes/workouts.md (update)

Phase 2 - Diff:
  -> Read specs, analyze current code
  -> Load fierros-core patterns, generate core diff
  -> Load fierros-api patterns, generate API diff

Phase 3 - Compile:
  -> Read core diff, implement domain changes
  -> Run core tests
  -> Read API diff, implement controller changes
  -> Run type-check and lint, validate, archive diffs
```
