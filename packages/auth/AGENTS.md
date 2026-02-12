# Fierros Auth - AI Agent Ruleset

> **Skills Reference**:
> No dedicated skill yet. Auth uses better-auth.

## Critical Rules

1. **better-auth**: All authentication handled by better-auth library
2. **Session-based**: Users authenticate via session cookies
3. **API integration**: API middleware extracts user from session via `c.get("user")`
4. **No direct auth logic in API**: Use better-auth's built-in handlers

## Project Structure

```
packages/auth/
├── src/
│   ├── auth.ts           # better-auth instance and configuration
│   ├── client.ts         # Client-side auth helpers
│   └── index.ts          # Exports
└── package.json
```

## Key Patterns

- Auth instance is created in `packages/auth/` and imported by API
- Session middleware validates tokens and populates `c.get("user")`
- User ID is always extracted server-side, never from request body
