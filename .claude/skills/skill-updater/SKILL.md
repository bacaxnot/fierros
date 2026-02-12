---
name: skill-updater
description: >
  Analyze and update skills based on usage feedback.
  Trigger: When a skill needs improvements, restructuring, or new patterns after real usage.
metadata:
  scope: [root]
  auto_invoke:
    - "Updating or improving existing skills"
---

# Skill Updater

Analyze skills to identify issues and improvements, then apply approved updates.

## Workflow

### Phase 1: Identify Target Skill

Ask: "Which skill do you want to update?"

Locate the skill at `skills/<skill-name>/` and read:
1. `SKILL.md` - Understand purpose and workflow
2. `references/` - Understand supporting documentation
3. `scripts/` - Understand automation (if any)

### Phase 2: Gather Context

Determine the source of feedback:
- **Conversation context**: Friction points from recent skill usage
- **Direct feedback**: User describes issues or improvements
- **Proactive review**: General skill improvement

Ask clarifying questions if needed.

### Phase 3: Analyze

Follow [analysis-process.md](references/analysis-process.md):
1. Identify friction points (confusion, missing info, incorrect guidance)
2. Identify new patterns that should be documented
3. Source evidence for each finding

### Phase 4: Categorize

Determine update type per [update-categories.md](references/update-categories.md):
- **Major**: Complete skill restructure
- **Minor**: Structural changes to references
- **Patch**: Small additions or removals

### Phase 5: Propose

Format proposed changes per [approval-format.md](references/approval-format.md):
- List friction points with evidence
- List new patterns with value
- Detail each proposed change (current → proposed)
- Provide summary table

### Phase 6: Approve

Present to user for approval:
- Approve all
- Approve specific changes
- Discuss/iterate
- Cancel

Only proceed with approved changes.

### Phase 7: Apply

For each approved change:
1. Read the target file
2. Apply the change
3. Verify the edit

After all changes:
- Summarize what was applied
- Suggest testing the updated skill

## Reference Files

| File | When to Read |
|------|--------------|
| [analysis-process.md](references/analysis-process.md) | When analyzing a skill for issues |
| [update-categories.md](references/update-categories.md) | When categorizing proposed changes |
| [approval-format.md](references/approval-format.md) | When presenting changes for approval |

## Best Practices

For skill design principles, read the `skill-creator` skill when:
- Restructuring a skill (major update)
- Adding new reference files
- Unsure about skill organization

Key principles to remember:
- **Concise is key**: Only add context Claude doesn't already have
- **Progressive disclosure**: Keep SKILL.md lean, details in references
- **No duplication**: Information lives in one place

## Key Principles

1. **Evidence-based**: Every proposed change should trace to observed friction or pattern
2. **User approval**: Never apply changes without explicit approval
3. **Iterative**: Allow user to refine proposals before applying
4. **Minimal changes**: Prefer small, targeted fixes over broad rewrites
5. **Test after**: Suggest testing the skill after updates
