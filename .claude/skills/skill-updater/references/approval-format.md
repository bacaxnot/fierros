# Approval Format

How to present proposed changes for user approval.

## Standard Presentation

```markdown
# Skill Update: [skill-name]

## Update Type: [Major/Minor/Patch]

[One sentence explaining why this category]

---

## Friction Points Detected

### 1. [Short Title]
**Category:** [Confusion/Missing Info/Incorrect Guidance/Verbosity]
**Evidence:** "[Quote]" or [Paraphrase]
**Impact:** [What went wrong because of this]

### 2. [Short Title]
...

---

## New Patterns Detected

### 1. [Pattern Name]
**Emerged from:** [Brief context]
**Value:** [Why this should be documented]

---

## Proposed Updates

### [File 1: path/to/file.md]

#### Change 1: [Brief description]
**Type:** [Add/Modify/Remove/Restructure]

Current:
> [Existing content or "N/A" if adding]

Proposed:
> [New content]

#### Change 2: [Brief description]
...

### [File 2: path/to/file.md]
...

---

## Summary

| File | Changes | Type |
|------|---------|------|
| SKILL.md | 2 | Minor |
| references/foo.md | 1 | Patch |
| references/bar.md (new) | 1 | Minor |

---

**Options:**
- ✅ Approve all
- 🔢 Approve specific (list numbers)
- 💬 Discuss/iterate
- ❌ Cancel
```

## Compact Format (for Patches)

When all changes are patches, use a shorter format:

```markdown
# Skill Update: [skill-name]

## Update Type: Patch

### Changes

1. **[file.md]** - [One-line description]
   - Current: `[snippet]`
   - Proposed: `[snippet]`

2. **[file.md]** - [One-line description]
   - Add: `[new content]`

**Approve all? (y/n/select numbers)**
```

## After Approval

Once user approves:
1. Apply changes to specified files
2. Summarize what was changed
3. Suggest testing the updated skill

```markdown
## Applied Updates

✅ [file1.md] - [change description]
✅ [file2.md] - [change description]

**Suggestion:** Test the updated skill with a similar task to verify the improvements.
```

## Iteration Format

If user wants to discuss or modify:

```markdown
## Iterating on: [Change X]

Current proposal:
> [content]

Your feedback: [user's comment]

Revised proposal:
> [updated content]

**Accept revision?**
```

## Rejection Handling

If user rejects:
- Acknowledge the rejection
- Ask if they want to explain why (to learn)
- Offer to try a different approach or skip

```markdown
Understood, skipping [change description].

Would you like to:
- Explain why (helps me learn)
- Try a different approach
- Move on to next change
```
