# Analysis Process

How to explore and analyze a skill to identify issues and improvements.

## Step 1: Understand Current State

Read the skill's files in order:
1. `SKILL.md` - Main definition, workflow, when to use
2. `references/` - Supporting documentation
3. `scripts/` - Automation (if any)

Build a mental model of:
- What the skill does
- How it guides the agent
- What patterns/conventions it establishes

## Step 2: Identify Friction Points

Friction points are places where the skill failed to guide effectively. Look for:

### Confusion Indicators
- Agent asked clarifying questions that the skill should have answered
- Agent made assumptions that needed correction
- Agent misunderstood terminology or structure

### Missing Information
- Concepts referenced but not defined
- Edge cases not covered
- Patterns used but not documented

### Incorrect Guidance
- Instructions that led to wrong outcomes
- Examples that don't match actual usage
- Outdated conventions

### Verbosity Issues
- Repeated explanations (could be consolidated)
- Over-explained obvious things
- Under-explained complex things

## Step 3: Identify New Patterns

Patterns that emerged during usage but aren't documented:

### Naming Conventions
- New naming patterns that worked well
- Consistent prefixes/suffixes discovered

### Structural Patterns
- File organization that proved effective
- Folder structures that emerged

### Process Patterns
- Steps that were added to the workflow
- Decision points that needed explicit guidance

### Integration Patterns
- How this skill connects to others
- Dependencies discovered

## Step 4: Source Evidence

For each finding, note the evidence:
- Quote or paraphrase the relevant exchange
- Note which phase/step of the skill failed
- Identify the specific file/section that needs updating

## Evidence Format

```
Friction: [Brief description]
Evidence: "[Quote from conversation]" or [Paraphrase of what happened]
Location: [File and section that needs updating]
```

## Questions to Ask

When analyzing, consider:
- Did the agent follow the skill's workflow correctly?
- Where did the agent deviate? Why?
- What questions did the user have to answer that the skill should have covered?
- What did the user have to explain that should be in the skill?
- Were there "aha moments" where something clicked that should be explicit?
