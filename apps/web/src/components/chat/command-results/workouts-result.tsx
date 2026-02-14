"use client";

import { useState } from "react";

type Workout = {
  id: string;
  name: string;
  startedAt: string;
  finishedAt: string | null;
  blocks: { sets: { exerciseId: string }[] }[];
};

type Filter = "all" | "in-progress" | "finished";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in-progress", label: "In Progress" },
  { value: "finished", label: "Finished" },
];

export function WorkoutsResult({ data }: { data: unknown }) {
  const [filter, setFilter] = useState<Filter>("all");
  const items = (data as { data: Workout[] }).data;

  const filtered = items.filter((w) => {
    if (filter === "in-progress") return !w.finishedAt;
    if (filter === "finished") return !!w.finishedAt;
    return true;
  });

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No workouts found.</p>;
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-2.5 py-0.5 text-xs transition-colors ${
              filter === f.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="divide-y">
        {filtered.map((w) => {
          const setCount = w.blocks.reduce((sum, b) => sum + b.sets.length, 0);
          return (
            <div key={w.id} className="flex items-center justify-between py-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm">{w.name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(w.startedAt).toLocaleDateString()} · {setCount} set{setCount !== 1 ? "s" : ""}
                </span>
              </div>
              <span className={`text-xs ${w.finishedAt ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                {w.finishedAt ? "Finished" : "In Progress"}
              </span>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-2 text-sm text-muted-foreground">No {filter} workouts.</p>
        )}
      </div>
    </div>
  );
}
