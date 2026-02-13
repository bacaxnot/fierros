"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

export function ChatContainer() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  const isLoading = status === "streaming" || status === "submitted";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  }

  return (
    <div className="flex flex-1 flex-col">
      <ChatMessages messages={messages} />
      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={setInput}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
