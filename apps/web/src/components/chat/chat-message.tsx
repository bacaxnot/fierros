import type { UIMessage } from "@ai-sdk/react";
import { cn } from "~/lib/utils";
import { ToolResult } from "./tool-result";

export function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

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
