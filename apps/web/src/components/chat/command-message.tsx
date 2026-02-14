import type { MutableRefObject } from "react";
import type { CommandDefinition } from "~/lib/commands/types";
import { commandMap } from "~/lib/commands/registry";

type CommandMessageViewProps = {
  messageId: string;
  command: string;
  commandDataRef: MutableRefObject<Map<string, unknown>>;
};

export function CommandMessageView({ messageId, command, commandDataRef }: CommandMessageViewProps) {
  const data = commandDataRef.current.get(messageId);
  const def = commandMap.get(`/${command}`) as CommandDefinition | undefined;

  if (!data || !def) {
    return (
      <p className="text-sm text-muted-foreground italic">
        Command result unavailable.
      </p>
    );
  }

  const Render = def.render;
  return <Render data={data} />;
}
