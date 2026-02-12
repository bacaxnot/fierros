---
name: turborepo
description: >
  Configure and optimize JavaScript/TypeScript monorepos with Turborepo.
  Trigger: When configuring turbo.json, task pipelines, caching, or troubleshooting Turborepo builds.
metadata:
  scope: [root]
  auto_invoke:
    - "Configuring Turborepo or turbo.json"
---

# Turborepo

Configure and optimize JavaScript/TypeScript monorepos with Turborepo.

## Core Rule

**Always fetch current documentation before answering Turborepo questions.**

Turborepo evolves frequently. Use WebFetch to retrieve the latest documentation before providing guidance.

## Workflow

1. **Fetch current docs**: Use WebFetch on `https://turborepo.dev/llms.txt` with a prompt describing what information is needed
2. **Answer based on current docs**: Use the fetched information to provide accurate, up-to-date guidance

## Example

When a user asks "How do I configure caching in Turborepo?":

1. Fetch: `WebFetch("https://turborepo.dev/llms.txt", "How to configure task caching, including turbo.json configuration and cache outputs")`
2. Provide configuration steps based on the current documentation

## Additional Resources

- Base docs URL: `https://turborepo.dev`
- For deeper topics, the llms.txt may reference specific doc pages to fetch
