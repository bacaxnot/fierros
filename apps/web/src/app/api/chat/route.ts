import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { headers } from "next/headers";
import { getSystemPrompt } from "~/lib/ai/system-prompt";
import { createTrainingTools } from "~/lib/ai/tools/training-tools";

export const maxDuration = 30;

export async function POST(req: Request) {
  const headersList = await headers();
  const cookie = headersList.get("cookie");

  if (!cookie) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Validate session
  const { api } = await import("~/lib/api");
  const sessionRes = await api("/auth/get-session", {
    headers: { cookie },
  });

  if (!sessionRes.ok) {
    return new Response("Unauthorized", { status: 401 });
  }

  const session = await sessionRes.json();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const systemPrompt = await getSystemPrompt(cookie);
  const tools = createTrainingTools(cookie);

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
