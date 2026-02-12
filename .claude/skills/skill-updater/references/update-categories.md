# Update Categories

How to categorize proposed changes to a skill.

## Major Update

Complete skill restructure. The skill's core workflow or organization changes fundamentally.

**Indicators:**
- SKILL.md workflow phases change significantly
- Reference files need to be split, merged, or reorganized
- New concepts introduced that affect multiple sections
- Skill's scope or purpose expands/contracts

**Examples:**
- Splitting a monolithic SKILL.md into multiple reference files
- Adding new phases to the workflow
- Restructuring from flat references to domain-organized
- Changing the skill's primary workflow pattern

**Approval:** Requires explicit user approval for overall direction before detailed changes.

---

## Minor Update

Structural changes to some references. The skill's workflow stays the same, but supporting documentation changes.

**Indicators:**
- One or more reference files need significant edits
- New reference file needed
- Existing reference needs to be split
- Section reorganization within files

**Examples:**
- Adding a new principles section to a reference
- Splitting a growing reference file into focused files
- Adding new examples to clarify usage
- Restructuring sections within a reference for clarity

**Approval:** Present all changes together, user approves as a set or selects specific changes.

---

## Patch Update

Small additions or removals. Targeted fixes that don't change structure.

**Indicators:**
- Adding missing guidance (a sentence, a bullet point)
- Fixing incorrect information
- Adding a small example
- Clarifying ambiguous wording
- Removing outdated content

**Examples:**
- Adding a clarifying sentence to a definition
- Adding a bullet point to a list of conventions
- Fixing a typo or incorrect example
- Adding a "Note:" to highlight an edge case

**Approval:** Can batch multiple patches, user approves quickly.

---

## Categorization Process

1. List all proposed changes
2. For each change, ask:
   - Does this change the workflow? → Major
   - Does this restructure files/sections? → Minor
   - Is this a targeted fix? → Patch
3. If mixed, categorize by the highest level present
4. Present category to user with rationale

## Mixed Updates

When an update has changes at multiple levels:
- Lead with the category of the most significant change
- Group changes by category in the presentation
- Allow user to approve by category

Example:
```
## Update Type: Minor (with patches)

### Minor Changes
1. Add new "Module Principles" section to core-spec-pattern.md

### Patch Changes
1. Fix typo in Gateway example
2. Add clarifying note about naming
```
