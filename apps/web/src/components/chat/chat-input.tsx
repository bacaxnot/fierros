"use client";

import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { ArrowUp } from "lucide-react";
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
    <div className="border-t bg-background px-4 py-3">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="relative mx-auto flex max-w-2xl items-end gap-2"
      >
        {showAutocomplete && (
          <CommandAutocomplete
            filter={input}
            selectedIndex={selectedIndex}
            onSelect={selectCommand}
          />
        )}
        <Textarea
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about exercises, routines, or workouts..."
          rows={1}
          className="min-h-[40px] max-h-[120px] resize-none"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          <ArrowUp className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
