"use client";

import { commands } from "~/lib/commands/registry";

type CommandAutocompleteProps = {
  filter: string;
  selectedIndex: number;
  onSelect: (command: string) => void;
};

export function getFilteredCommands(input: string) {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed.startsWith("/")) return [];
  return commands.filter(
    (cmd) =>
      cmd.name.startsWith(trimmed) ||
      cmd.aliases.some((a) => a.startsWith(trimmed)),
  );
}

export function CommandAutocomplete({
  filter,
  selectedIndex,
  onSelect,
}: CommandAutocompleteProps) {
  const filtered = getFilteredCommands(filter);
  if (filtered.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 mb-2 w-64 overflow-hidden rounded-lg border bg-popover shadow-lg">
      {filtered.map((cmd, i) => (
        <button
          key={cmd.name}
          type="button"
          className={`flex w-full items-baseline gap-2 px-3 py-2 text-left text-sm transition-colors ${
            i === selectedIndex
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/50"
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(cmd.name);
          }}
        >
          <code className="font-medium">{cmd.name}</code>
          <span className="truncate text-xs text-muted-foreground">
            {cmd.description}
          </span>
        </button>
      ))}
    </div>
  );
}
