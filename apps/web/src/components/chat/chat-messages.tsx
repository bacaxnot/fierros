"use client";

import { useEffect, useRef } from "react";
import type { UIMessage } from "@ai-sdk/react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";

export function ChatMessages({ messages }: { messages: UIMessage[] }) {
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
              Ask me to create routines, search exercises, or manage your workouts.
            </p>
          </div>
        )}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
