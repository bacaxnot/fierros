"use client";

import { useRef, useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import {
  CommandAutocomplete,
  getFilteredCommands,
} from "./command-autocomplete";

type ChatInputProps = {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function ChatInput({ input, isLoading, onInputChange, onSubmit }: ChatInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const showAutocomplete = input.trim().startsWith("/") && !input.includes(" ");
  const filtered = showAutocomplete ? getFilteredCommands(input) : [];

  function selectCommand(name: string) {
    onInputChange(name + " ");
    setSelectedIndex(0);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (showAutocomplete && filtered.length > 0) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i <= 0 ? filtered.length - 1 : i - 1));
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i >= filtered.length - 1 ? 0 : i + 1));
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        selectCommand(filtered[selectedIndex].name);
        return;
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        selectCommand(filtered[selectedIndex].name);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onInputChange("");
        setSelectedIndex(0);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  function handleChange(value: string) {
    onInputChange(value);
    setSelectedIndex(0);
  }

  return (
    <div className="pb-4 pt-2">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="relative mx-auto max-w-3xl"
      >
        {showAutocomplete && (
          <CommandAutocomplete
            filter={input}
            selectedIndex={selectedIndex}
            onSelect={selectCommand}
          />
        )}
        <div
          className="rounded-2xl border bg-muted/50 focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] transition-[color,box-shadow]"
          onClick={() => textareaRef.current?.focus()}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            rows={1}
            disabled={isLoading}
            className="block w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 field-sizing-content min-h-[2.5rem] max-h-[10rem]"
          />
          <div className="flex items-center justify-end px-3 pb-3">
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex size-8 items-center justify-center rounded-full bg-foreground text-background transition-opacity disabled:opacity-30"
            >
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
