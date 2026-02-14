import type { ParsedCommand } from "./types";
import { commandMap } from "./registry";

export function isCommand(input: string): boolean {
  return /^\/\S/.test(input.trim());
}

export function parseCommand(input: string): ParsedCommand | null {
  const trimmed = input.trim();
  if (!isCommand(trimmed)) return null;

  const spaceIndex = trimmed.indexOf(" ");
  const name = spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex);
  const args = spaceIndex === -1 ? "" : trimmed.slice(spaceIndex + 1).trim();

  const command = commandMap.get(name.toLowerCase());
  if (!command) return null;

  return { name: command.name, args, raw: trimmed };
}
