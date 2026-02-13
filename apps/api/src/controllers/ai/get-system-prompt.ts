import { db } from "@repo/db";
import { aiSystemPrompts } from "@repo/db/schema";
import { eq } from "@repo/db/orm";
import { factory } from "~/lib/factory";
import { internalServerError, json } from "~/lib/http-response";

export const getSystemPromptHandlers = factory.createHandlers(async (c) => {
  try {
    const user = c.get("user");
    const rows = await db
      .select()
      .from(aiSystemPrompts)
      .where(eq(aiSystemPrompts.userId, user.id));

    const prompt = rows[0];
    return json(c, { data: prompt ? { content: prompt.content } : null });
  } catch {
    return internalServerError(c);
  }
});
