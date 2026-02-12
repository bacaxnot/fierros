---
name: hono
description: >
  Hono web framework patterns and best practices.
  Trigger: When creating Hono routes, middleware, or API endpoints in apps/api/.
metadata:
  scope: [api]
  auto_invoke:
    - "Creating Hono routes or middleware"
---

## Route Definition

```typescript
import { Hono } from "hono";

const app = new Hono();

// Basic routes
app.get("/users", (c) => c.json({ users: [] }));
app.get("/users/:id", (c) => {
  const id = c.req.param("id");
  return c.json({ id });
});

app.post("/users", async (c) => {
  const body = await c.req.json();
  return c.json({ created: body }, 201);
});
```

## Typed Routes (RPC)

```typescript
import { Hono } from "hono";
import { hc } from "hono/client";

// Server: define typed routes
const app = new Hono()
  .get("/users/:id", (c) => {
    return c.json({ id: c.req.param("id"), name: "Alice" });
  })
  .post("/users", async (c) => {
    const body = await c.req.json<{ name: string }>();
    return c.json({ id: "1", name: body.name }, 201);
  });

// Export type for client
export type AppType = typeof app;

// Client: type-safe calls
const client = hc<AppType>("http://localhost:3000");
const res = await client.users[":id"].$get({ param: { id: "1" } });
const data = await res.json(); // Typed!
```

## Middleware

```typescript
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { bearerAuth } from "hono/bearer-auth";

const app = new Hono();

// Built-in middleware
app.use("*", logger());
app.use("/api/*", cors());

// Custom middleware
app.use("/api/*", async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  c.header("X-Response-Time", `${ms}ms`);
});

// Auth middleware
app.use("/api/protected/*", bearerAuth({ token: "secret" }));
```

## Validators (Zod)

```typescript
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

app.post(
  "/users",
  zValidator("json", createUserSchema),
  (c) => {
    const { name, email } = c.req.valid("json"); // Typed
    return c.json({ name, email }, 201);
  }
);
```

## Error Handling

```typescript
import { HTTPException } from "hono/http-exception";

// Throw HTTP errors
app.get("/users/:id", (c) => {
  const user = findUser(c.req.param("id"));
  if (!user) {
    throw new HTTPException(404, { message: "User not found" });
  }
  return c.json(user);
});

// Global error handler
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  console.error(err);
  return c.json({ error: "Internal Server Error" }, 500);
});
```

## Response Helpers

```typescript
// JSON
c.json({ data: "value" });
c.json({ data: "value" }, 201);

// Text
c.text("Hello");

// HTML
c.html("<h1>Hello</h1>");

// Redirect
c.redirect("/new-path");
c.redirect("/new-path", 301);

// Headers
c.header("X-Custom", "value");

// Status
c.status(204);
return c.body(null);
```

## Grouping Routes

```typescript
const users = new Hono()
  .get("/", (c) => c.json([]))
  .get("/:id", (c) => c.json({ id: c.req.param("id") }))
  .post("/", async (c) => c.json({}, 201));

const app = new Hono()
  .route("/users", users)
  .route("/posts", posts);
```

## Resources

- Docs: `https://hono.dev/llms.txt`
- Use WebFetch for up-to-date API reference
