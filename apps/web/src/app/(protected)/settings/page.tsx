"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

const DEFAULT_HINT =
  "Customize how the AI assistant behaves. For example, you could set a preferred training style, language, or level of detail.";

const EXAMPLES = [
  "Always respond in Spanish.",
  "Focus on powerlifting-style training with low reps and heavy weights.",
  "I'm a beginner — keep suggestions simple and explain exercises in detail.",
  "Prefer supersets and circuit-style training for my routines.",
];

export default function SettingsPage() {
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetch("/api/backend/ai/system-prompt", { credentials: "include" })
      .then((res) => res.json())
      .then(({ data }) => {
        if (data?.content) setContent(data.content);
      })
      .catch(() => {})
      .finally(() => setInitialLoading(false));
  }, []);

  async function handleSave() {
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch("/api/backend/ai/system-prompt", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });
      if (res.ok) setSaved(true);
    } catch {
      // handle error silently
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setContent("");
    setSaved(false);
  }

  if (initialLoading) {
    return (
      <div className="mx-auto w-full max-w-2xl p-4">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>AI Assistant Settings</CardTitle>
          <CardDescription>{DEFAULT_HINT}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="system-prompt">Custom Instructions</Label>
            <Textarea
              id="system-prompt"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setSaved(false);
              }}
              placeholder="Enter your custom instructions for the AI assistant..."
              rows={8}
              className="resize-y"
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Examples:</p>
            <ul className="space-y-1">
              {EXAMPLES.map((ex) => (
                <li key={ex} className="text-xs text-muted-foreground">
                  &bull; {ex}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset} disabled={loading}>
            Reset
          </Button>
          <div className="flex items-center gap-2">
            {saved && <span className="text-sm text-green-600">Saved!</span>}
            <Button onClick={handleSave} disabled={loading || !content.trim()}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
