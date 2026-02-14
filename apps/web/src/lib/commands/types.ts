import type { ComponentType } from "react";

export type CommandDefinition = {
  name: string;
  aliases: string[];
  description: string;
  args?: string;
  execute: (args: string) => Promise<unknown>;
  serialize: (data: unknown) => string;
  render: ComponentType<{ data: unknown }>;
};

export type ParsedCommand = {
  name: string;
  args: string;
  raw: string;
};
