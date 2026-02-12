---
name: {skill-name}
description: >
  {What this skill does}.
  Trigger: {When the AI should load this skill}.
metadata:
  scope: [{scopes}]
  auto_invoke:
    - "{trigger phrase 1}"
    - "{trigger phrase 2}"
---

<!-- Archetype: Choose one and keep relevant sections -->
<!-- PATTERN: technology/framework reference (typescript, hono, react-19) -->
<!-- ARCHITECTURE: project component patterns (dok-core, dok-api, dok-plugin) -->
<!-- WORKFLOW: multi-step processes (spec-driven-dev, skill-creator) -->
<!-- ACTION: single-purpose tasks (dok-commit, dok-pr) -->

## When to Use

- {Condition 1}
- {Condition 2}

## Critical Rules                       <!-- ARCHITECTURE, PATTERN -->

- **Rule 1**: {explanation}
- **Rule 2**: {explanation}

## Project Structure                    <!-- ARCHITECTURE only -->

```
{folder tree showing where code lives}
```

## Workflow                             <!-- WORKFLOW only -->

### Phase 1: {Name}

{what happens, inputs, outputs}

### Phase 2: {Name}

{what happens, inputs, outputs}

## Patterns                             <!-- PATTERN, ARCHITECTURE -->

### {Pattern Name}

```{language}
{minimal example}
```

## Commands                             <!-- All archetypes if applicable -->

```bash
{command}  # {description}
```

## Reference Files                      <!-- When references/ exists -->

| File | Load when |
|------|-----------|
| [file.md](references/file.md) | {condition} |
