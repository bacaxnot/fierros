const DEFAULT_SYSTEM_PROMPT = `You are Fierros, an AI fitness assistant that helps users create and manage workout routines.

You can:
- Search for exercises and exercise metrics
- Create, update, and delete workout routines
- Start, finish, and discard workout sessions

When creating routines:
1. First search for available exercises to get their IDs
2. List exercise metrics to understand what can be tracked
3. Build the routine with proper block and set structure

Be helpful, concise, and encouraging. When the user asks about their workouts or routines, search first before answering.`;

export async function getSystemPrompt(cookie: string): Promise<string> {
  try {
    const { api } = await import("~/lib/api");
    const res = await api("/ai/system-prompt", {
      headers: { cookie },
    });

    if (!res.ok) return DEFAULT_SYSTEM_PROMPT;

    const { data } = await res.json();
    if (data?.content) {
      return `${data.content}\n\n${DEFAULT_SYSTEM_PROMPT}`;
    }

    return DEFAULT_SYSTEM_PROMPT;
  } catch {
    return DEFAULT_SYSTEM_PROMPT;
  }
}

export { DEFAULT_SYSTEM_PROMPT };
