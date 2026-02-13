"use client";

import { useRef } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { ArrowUp } from "lucide-react";

type ChatInputProps = {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function ChatInput({ input, isLoading, onInputChange, onSubmit }: ChatInputProps) {
  const formRef = useRef<HTMLFormElement>(null);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  return (
    <div className="border-t bg-background px-4 py-3">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="mx-auto flex max-w-2xl items-end gap-2"
      >
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
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
