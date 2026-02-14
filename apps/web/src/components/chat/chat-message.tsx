import type { MutableRefObject } from "react";
import type { UIMessage } from "@ai-sdk/react";
import { cn } from "~/lib/utils";
import { ToolResult } from "./tool-result";
import { CommandMessageView } from "./command-message";
import { Loader2 } from "lucide-react";

type Metadata = Record<string, unknown> | undefined;

type ChatMessageProps = {
  message: UIMessage;
  commandDataRef: MutableRefObject<Map<string, unknown>>;
};

export function ChatMessage({ message, commandDataRef }: ChatMessageProps) {
  const isUser = message.role === "user";
  const meta = message.metadata as Metadata;

  if (isUser && meta?.isCommand) {
    return (
      <div className="flex flex-col gap-2 items-end">
        <span className="text-xs text-muted-foreground">You</span>
        <div className="max-w-[85%] rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-mono">
          {(message.parts[0] as { text: string }).text}
        </div>
      </div>
    );
  }

  if (!isUser && meta?.isCommandResult) {
    if (meta.loading) {
      return (
        <div className="flex flex-col gap-2 items-start">
          <span className="text-xs text-muted-foreground">Fierros</span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        </div>
      );
    }

    if (meta.error) {
      return (
        <div className="flex flex-col gap-2 items-start">
          <span className="text-xs text-muted-foreground">Fierros</span>
          <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {(message.parts[0] as { text: string }).text}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2 items-start">
        <span className="text-xs text-muted-foreground">Fierros</span>
        <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2">
          <CommandMessageView
            messageId={message.id}
            command={meta.command as string}
            commandDataRef={commandDataRef}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", isUser ? "items-end" : "items-start")}>
      <span className="text-xs text-muted-foreground">{isUser ? "You" : "Fierros"}</span>
      {message.parts.map((part, i) => {
        if (part.type === "text" && part.text) {
          return (
            <div
              key={i}
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                isUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted",
              )}
            >
              {part.text}
            </div>
          );
        }
        if (part.type.startsWith("tool-")) {
          const toolName = part.type.slice(5);
          if ("output" in part && part.output !== undefined) {
            return (
              <div key={i} className="max-w-[85%]">
                <ToolResult toolName={toolName} result={part.output} />
              </div>
            );
          }
          return (
            <div key={i} className="text-xs text-muted-foreground italic">
              Using {toolName}...
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
