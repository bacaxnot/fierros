import { zValidator } from "@hono/zod-validator";
import { db } from "@repo/db";
import { aiSystemPrompts } from "@repo/db/schema";
import { eq } from "@repo/db/orm";
import { z } from "zod";
import { factory } from "~/lib/factory";
import { internalServerError, json } from "~/lib/http-response";

const putSystemPromptBodySchema = z.object({
  content: z.string().min(1),
});

export const putSystemPromptHandlers = factory.createHandlers(
  zValidator("json", putSystemPromptBodySchema),
  async (c) => {
    try {
      const user = c.get("user");
      const { content } = c.req.valid("json");
      const now = new Date().toISOString();

      const existing = await db
        .select({ id: aiSystemPrompts.id })
        .from(aiSystemPrompts)
        .where(eq(aiSystemPrompts.userId, user.id));

      if (existing[0]) {
        await db
          .update(aiSystemPrompts)
          .set({ content, updatedAt: now })
          .where(eq(aiSystemPrompts.id, existing[0].id));
      } else {
        await db.insert(aiSystemPrompts).values({
          id: crypto.randomUUID(),
          userId: user.id,
          content,
          createdAt: now,
          updatedAt: now,
        });
      }

      return json(c, { data: { content } });
    } catch {
      return internalServerError(c);
    }
  },
);
