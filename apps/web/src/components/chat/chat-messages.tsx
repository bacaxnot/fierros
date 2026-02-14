"use client";

import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import type { UIMessage } from "@ai-sdk/react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";

type ChatMessagesProps = {
  messages: UIMessage[];
  commandDataRef: MutableRefObject<Map<string, unknown>>;
};

export function ChatMessages({ messages, commandDataRef }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="mx-auto max-w-2xl space-y-4 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <h2 className="text-lg font-semibold">Welcome to Fierros</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ask me anything or type{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">/</code>{" "}
              for commands.
            </p>
          </div>
        )}
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            commandDataRef={commandDataRef}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
