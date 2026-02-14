import type { CommandDefinition } from "./types";
import { WorkoutsResult } from "~/components/chat/command-results/workouts-result";
import { RoutinesResult } from "~/components/chat/command-results/routines-result";
import { ExercisesResult } from "~/components/chat/command-results/exercises-result";
import { HelpResult } from "~/components/chat/command-results/help-result";

async function fetchBackend(path: string): Promise<unknown> {
  const res = await fetch(`/api/backend${path}`, { credentials: "include" });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

function buildFilterParams(field: string, operator: string, value: string): string {
  return new URLSearchParams({
    "filters[0][field]": field,
    "filters[0][operator]": operator,
    "filters[0][value]": value,
  }).toString();
}

export const commands: CommandDefinition[] = [
  {
    name: "/workouts",
    aliases: ["/w"],
    description: "List your workouts",
    execute: async () => {
      return fetchBackend("/workouts?orderBy=startedAt&orderType=DESC&pageSize=20");
    },
    serialize: (data) => {
      const items = (data as { data: { name: string }[] }).data;
      if (items.length === 0) return "No workouts found.";
      return `Found ${items.length} workout(s): ${items.map((w) => w.name).join(", ")}`;
    },
    render: WorkoutsResult,
  },
  {
    name: "/routines",
    aliases: ["/r"],
    description: "List your routines",
    args: "name",
    execute: async (args) => {
      const query = args
        ? `?${buildFilterParams("name", "contains", args)}`
        : "";
      return fetchBackend(`/routines${query}`);
    },
    serialize: (data) => {
      const items = (data as { data: { name: string }[] }).data;
      if (items.length === 0) return "No routines found.";
      return `Found ${items.length} routine(s): ${items.map((r) => r.name).join(", ")}`;
    },
    render: RoutinesResult,
  },
  {
    name: "/exercises",
    aliases: ["/ex"],
    description: "Search exercises",
    args: "name",
    execute: async (args) => {
      const query = args
        ? `?${buildFilterParams("name", "contains", args)}`
        : "?pageSize=20";
      return fetchBackend(`/exercises${query}`);
    },
    serialize: (data) => {
      const items = (data as { data: { name: string }[] }).data;
      if (items.length === 0) return "No exercises found.";
      return `Found ${items.length} exercise(s): ${items.map((e) => e.name).join(", ")}`;
    },
    render: ExercisesResult,
  },
  {
    name: "/clear",
    aliases: ["/c"],
    description: "Clear chat history",
    execute: async () => null,
    serialize: () => "",
    render: () => null,
  },
  {
    name: "/help",
    aliases: ["/h"],
    description: "Show available commands",
    execute: async () => {
      return commands
        .filter((c) => c.name !== "/help" && c.name !== "/clear")
        .map((c) => ({
          name: c.name,
          aliases: c.aliases,
          description: c.description,
          args: c.args,
        }));
    },
    serialize: (data) => {
      const cmds = data as { name: string; description: string }[];
      return `Available commands: ${cmds.map((c) => `${c.name} — ${c.description}`).join("; ")}`;
    },
    render: HelpResult,
  },
];

export const commandMap = new Map<string, CommandDefinition>();
for (const cmd of commands) {
  commandMap.set(cmd.name, cmd);
  for (const alias of cmd.aliases) {
    commandMap.set(alias, cmd);
  }
}
