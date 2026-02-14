"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useState } from "react";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";
import { isCommand, parseCommand } from "~/lib/commands/parser";
import { commandMap } from "~/lib/commands/registry";

export function ChatContainer() {
  const [input, setInput] = useState("");
  const commandDataRef = useRef(new Map<string, unknown>());
  const { messages, setMessages, sendMessage, status } = useChat();

  const isLoading = status === "streaming" || status === "submitted";

  async function executeCommand(raw: string) {
    const parsed = parseCommand(raw);

    if (!parsed) {
      const userMsg = makeMessage("user", raw, { isCommand: true });
      const errMsg = makeMessage(
        "assistant",
        `Unknown command: \`${raw.split(" ")[0]}\`. Type /help to see available commands.`,
        { isCommandResult: true, command: "help", error: true },
      );
      setMessages((prev) => [...prev, userMsg, errMsg]);
      return;
    }

    const def = commandMap.get(parsed.name)!;
    const userMsg = makeMessage("user", parsed.raw, { isCommand: true });
    const loadingMsg = makeMessage("assistant", "Loading...", {
      isCommandResult: true,
      command: parsed.name.slice(1),
      loading: true,
    });

    setMessages((prev) => [...prev, userMsg, loadingMsg]);

    try {
      const data = await def.execute(parsed.args);
      const summary = def.serialize(data);
      commandDataRef.current.set(loadingMsg.id, data);

      const resultMsg = {
        ...loadingMsg,
        parts: [{ type: "text" as const, text: summary }],
        metadata: {
          isCommandResult: true,
          command: parsed.name.slice(1),
        },
      };
      setMessages((prev) =>
        prev.map((m) => (m.id === loadingMsg.id ? resultMsg : m)),
      );
    } catch {
      const errorMsg = {
        ...loadingMsg,
        parts: [{ type: "text" as const, text: "Failed to fetch data. Please try again." }],
        metadata: {
          isCommandResult: true,
          command: parsed.name.slice(1),
          error: true,
        },
      };
      setMessages((prev) =>
        prev.map((m) => (m.id === loadingMsg.id ? errorMsg : m)),
      );
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");

    if (trimmed.toLowerCase() === "/clear" || trimmed.toLowerCase() === "/c") {
      setMessages([]);
      commandDataRef.current.clear();
      return;
    }

    if (isCommand(trimmed)) {
      executeCommand(trimmed);
    } else {
      sendMessage({ text: trimmed });
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <ChatMessages messages={messages} commandDataRef={commandDataRef} />
      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={setInput}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

let msgCounter = 0;

function makeMessage(
  role: "user" | "assistant",
  text: string,
  metadata: Record<string, unknown>,
) {
  return {
    id: `cmd-${Date.now()}-${msgCounter++}`,
    role,
    parts: [{ type: "text" as const, text }],
    metadata,
  };
}
