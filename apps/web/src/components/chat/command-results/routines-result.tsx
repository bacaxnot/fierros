"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, Clock, Plus, Search, Trash2 } from "lucide-react";
import { apiDelete, apiGet, apiPatch } from "~/lib/api-client";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

// --- Types ---

type MetricValue = { value: number; unit: string };
type MetricValueRange = { min: MetricValue | null; max: MetricValue | null };

type SetMetric = {
  metricId: string;
  targetRange: MetricValueRange | null;
  targetValue: MetricValue | null;
  lastValue: MetricValue | null;
};

type RoutineSet = {
  order: number;
  exerciseId: string;
  notes: string | null;
  restTime: number | null;
  metrics: SetMetric[];
};

type RoutineBlock = {
  order: number;
  notes: string | null;
  defaultRestTime: number | null;
  sets: RoutineSet[];
};

type Routine = {
  id: string;
  name: string;
  description: string | null;
  blocks: RoutineBlock[];
};

type Exercise = {
  id: string;
  name: string;
  defaultMetrics: string[];
};

type ExerciseMetric = {
  id: string;
  name: string;
  type: string;
};

// --- Helpers ---

function formatRestTime(seconds: number | null): string {
  if (seconds === null) return "\u2014";
  if (seconds >= 60 && seconds % 60 === 0) return `${seconds / 60}m`;
  return `${seconds}s`;
}

function formatMetricsSummary(
  metrics: SetMetric[],
  metricMap: Map<string, ExerciseMetric>,
): string {
  return metrics
    .map((m) => {
      const metric = metricMap.get(m.metricId);
      const name = metric?.name ?? "?";
      if (m.targetValue) {
        return `${m.targetValue.value} ${name}`;
      }
      if (m.targetRange) {
        const parts: string[] = [];
        if (m.targetRange.min) parts.push(String(m.targetRange.min.value));
        if (m.targetRange.max) parts.push(String(m.targetRange.max.value));
        return `${parts.join("-")} ${name}`;
      }
      return name;
    })
    .join(" \u00b7 ");
}

// --- Inline Editable Rest Time ---

function InlineRestTime({
  value,
  onSave,
}: {
  value: number | null;
  onSave: (v: number | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? ""));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function commit() {
    setEditing(false);
    const parsed = parseInt(draft, 10);
    if (draft === "" || isNaN(parsed)) {
      onSave(null);
    } else {
      onSave(parsed);
    }
  }

  if (editing) {
    return (
      <Input
        ref={inputRef}
        type="number"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setDraft(String(value ?? ""));
            setEditing(false);
          }
        }}
        className="h-6 w-16 px-1 text-xs"
        placeholder="sec"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(String(value ?? ""));
        setEditing(true);
      }}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      title="Click to edit rest time"
    >
      <Clock className="size-3" />
      {formatRestTime(value)}
    </button>
  );
}

// --- Delete Confirm Dialog ---

function DeleteConfirm({
  title,
  description,
  onConfirm,
  children,
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// --- Add Set Dialog ---

function AddSetDialog({
  open,
  onOpenChange,
  exercises: exerciseList,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercises: Exercise[];
  onSelect: (exercise: Exercise) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? exerciseList.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase()),
      )
    : exerciseList;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add set</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          {filtered.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground text-center">
              No exercises found.
            </p>
          ) : (
            <div className="divide-y">
              {filtered.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => {
                    onSelect(ex);
                    onOpenChange(false);
                    setSearch("");
                  }}
                  className="w-full text-left py-2 px-1 text-sm hover:bg-accent rounded transition-colors"
                >
                  {ex.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Set Row ---

function SetRow({
  set,
  exerciseName,
  metricMap,
  onDelete,
  onRestTimeChange,
}: {
  set: RoutineSet;
  exerciseName: string;
  metricMap: Map<string, ExerciseMetric>;
  onDelete: () => void;
  onRestTimeChange: (v: number | null) => void;
}) {
  const metricsSummary = formatMetricsSummary(set.metrics, metricMap);

  return (
    <div className="group/set flex items-center gap-2 py-1.5 pl-6">
      <span className="text-xs text-muted-foreground w-5 shrink-0">
        {set.order + 1}.
      </span>
      <span className="text-sm flex-1 min-w-0 truncate">{exerciseName}</span>
      {metricsSummary && (
        <span className="text-xs text-muted-foreground shrink-0 hidden sm:inline">
          {metricsSummary}
        </span>
      )}
      <InlineRestTime value={set.restTime} onSave={onRestTimeChange} />
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={onDelete}
        className="opacity-0 group-hover/set:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
      >
        <Trash2 className="size-3" />
      </Button>
    </div>
  );
}

// --- Block View ---

function BlockView({
  block,
  blockIndex,
  exerciseMap,
  metricMap,
  onDeleteBlock,
  onDeleteSet,
  onAddSet,
  onSetRestTimeChange,
  onBlockRestTimeChange,
}: {
  block: RoutineBlock;
  blockIndex: number;
  exerciseMap: Map<string, Exercise>;
  metricMap: Map<string, ExerciseMetric>;
  onDeleteBlock: () => void;
  onDeleteSet: (setIndex: number) => void;
  onAddSet: () => void;
  onSetRestTimeChange: (setIndex: number, v: number | null) => void;
  onBlockRestTimeChange: (v: number | null) => void;
}) {
  return (
    <div className="border rounded-md">
      <div className="flex items-center justify-between px-3 py-2 bg-muted/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">Block {blockIndex + 1}</span>
          {block.notes && (
            <span className="text-xs text-muted-foreground truncate max-w-[150px]">
              {block.notes}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <InlineRestTime
            value={block.defaultRestTime}
            onSave={onBlockRestTimeChange}
          />
          <DeleteConfirm
            title="Delete block?"
            description={`This will remove block ${blockIndex + 1} and all its ${block.sets.length} set(s).`}
            onConfirm={onDeleteBlock}
          >
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3" />
            </Button>
          </DeleteConfirm>
        </div>
      </div>
      <div className="px-2 py-1">
        {block.sets.length === 0 ? (
          <p className="text-xs text-muted-foreground py-2 pl-6">
            No sets in this block.
          </p>
        ) : (
          block.sets.map((set, si) => (
            <SetRow
              key={si}
              set={set}
              exerciseName={exerciseMap.get(set.exerciseId)?.name ?? "Unknown"}
              metricMap={metricMap}
              onDelete={() => onDeleteSet(si)}
              onRestTimeChange={(v) => onSetRestTimeChange(si, v)}
            />
          ))
        )}
        <Button
          variant="ghost"
          size="xs"
          onClick={onAddSet}
          className="mt-1 ml-4 text-muted-foreground"
        >
          <Plus className="size-3" />
          Add set
        </Button>
      </div>
    </div>
  );
}

// --- Routine Card ---

function RoutineCard({
  routine,
  exerciseMap,
  metricMap,
  exercises,
  onDelete,
  onUpdate,
}: {
  routine: Routine;
  exerciseMap: Map<string, Exercise>;
  metricMap: Map<string, ExerciseMetric>;
  exercises: Exercise[];
  onDelete: () => void;
  onUpdate: (updated: Routine) => void;
}) {
  const [open, setOpen] = useState(false);
  const [addSetBlockIndex, setAddSetBlockIndex] = useState<number | null>(null);

  const setCount = routine.blocks.reduce((sum, b) => sum + b.sets.length, 0);

  async function patchBlocks(newBlocks: RoutineBlock[]) {
    // Re-index orders
    const reindexed = newBlocks.map((block, bi) => ({
      ...block,
      order: bi,
      sets: block.sets.map((set, si) => ({ ...set, order: si })),
    }));
    await apiPatch(`/routines/${routine.id}`, { blocks: reindexed });
    onUpdate({ ...routine, blocks: reindexed });
  }

  function handleDeleteBlock(blockIndex: number) {
    const newBlocks = routine.blocks.filter((_, i) => i !== blockIndex);
    patchBlocks(newBlocks);
  }

  function handleDeleteSet(blockIndex: number, setIndex: number) {
    const newBlocks = routine.blocks.map((block, bi) => {
      if (bi !== blockIndex) return block;
      return { ...block, sets: block.sets.filter((_, si) => si !== setIndex) };
    });
    patchBlocks(newBlocks);
  }

  function handleSetRestTimeChange(
    blockIndex: number,
    setIndex: number,
    value: number | null,
  ) {
    const newBlocks = routine.blocks.map((block, bi) => {
      if (bi !== blockIndex) return block;
      return {
        ...block,
        sets: block.sets.map((set, si) => {
          if (si !== setIndex) return set;
          return { ...set, restTime: value };
        }),
      };
    });
    patchBlocks(newBlocks);
  }

  function handleBlockRestTimeChange(blockIndex: number, value: number | null) {
    const newBlocks = routine.blocks.map((block, bi) => {
      if (bi !== blockIndex) return block;
      return { ...block, defaultRestTime: value };
    });
    patchBlocks(newBlocks);
  }

  function handleAddSet(blockIndex: number, exercise: Exercise) {
    const block = routine.blocks[blockIndex];
    const newSet: RoutineSet = {
      order: block.sets.length,
      exerciseId: exercise.id,
      notes: null,
      restTime: block.defaultRestTime,
      metrics: exercise.defaultMetrics.map((metricId) => ({
        metricId,
        targetRange: null,
        targetValue: null,
        lastValue: null,
      })),
    };
    const newBlocks = routine.blocks.map((b, bi) => {
      if (bi !== blockIndex) return b;
      return { ...b, sets: [...b.sets, newSet] };
    });
    patchBlocks(newBlocks);
  }

  return (
    <>
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-2 py-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon-xs" className="shrink-0">
              <ChevronRight
                className={`size-4 transition-transform ${open ? "rotate-90" : ""}`}
              />
            </Button>
          </CollapsibleTrigger>
          <div className="flex-1 min-w-0">
            <CollapsibleTrigger asChild>
              <button type="button" className="text-left w-full">
                <span className="text-sm font-medium">{routine.name}</span>
                {routine.description && (
                  <span className="text-xs text-muted-foreground ml-2">
                    {routine.description}
                  </span>
                )}
              </button>
            </CollapsibleTrigger>
          </div>
          <Badge variant="secondary" className="text-xs shrink-0">
            {routine.blocks.length} block{routine.blocks.length !== 1 ? "s" : ""}{" "}
            · {setCount} set{setCount !== 1 ? "s" : ""}
          </Badge>
          <DeleteConfirm
            title="Delete routine?"
            description={`"${routine.name}" will be permanently deleted.`}
            onConfirm={onDelete}
          >
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-destructive shrink-0"
            >
              <Trash2 className="size-3" />
            </Button>
          </DeleteConfirm>
        </div>
        <CollapsibleContent>
          <div className="space-y-2 pb-2 pl-7">
            {routine.blocks.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No blocks in this routine.
              </p>
            ) : (
              routine.blocks.map((block, bi) => (
                <BlockView
                  key={bi}
                  block={block}
                  blockIndex={bi}
                  exerciseMap={exerciseMap}
                  metricMap={metricMap}
                  onDeleteBlock={() => handleDeleteBlock(bi)}
                  onDeleteSet={(si) => handleDeleteSet(bi, si)}
                  onAddSet={() => setAddSetBlockIndex(bi)}
                  onSetRestTimeChange={(si, v) =>
                    handleSetRestTimeChange(bi, si, v)
                  }
                  onBlockRestTimeChange={(v) =>
                    handleBlockRestTimeChange(bi, v)
                  }
                />
              ))
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
      <AddSetDialog
        open={addSetBlockIndex !== null}
        onOpenChange={(o) => {
          if (!o) setAddSetBlockIndex(null);
        }}
        exercises={exercises}
        onSelect={(ex) => {
          if (addSetBlockIndex !== null) handleAddSet(addSetBlockIndex, ex);
        }}
      />
    </>
  );
}

// --- Main Component ---

export function RoutinesResult({ data }: { data: unknown }) {
  const initialRoutines = (data as { data: Routine[] }).data;
  const [routines, setRoutines] = useState<Routine[]>(initialRoutines);
  const [exerciseMap, setExerciseMap] = useState<Map<string, Exercise>>(
    new Map(),
  );
  const [metricMap, setMetricMap] = useState<Map<string, ExerciseMetric>>(
    new Map(),
  );
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLookups() {
      try {
        const [exRes, metricRes] = await Promise.all([
          apiGet("/exercises?pageSize=200") as Promise<{
            data: Exercise[];
          }>,
          apiGet("/exercise-metrics") as Promise<{
            data: ExerciseMetric[];
          }>,
        ]);

        const exMap = new Map<string, Exercise>();
        for (const ex of exRes.data) exMap.set(ex.id, ex);
        setExerciseMap(exMap);
        setExercises(exRes.data);

        const mMap = new Map<string, ExerciseMetric>();
        for (const m of metricRes.data) mMap.set(m.id, m);
        setMetricMap(mMap);
      } catch {
        // Lookups failed — we'll show IDs instead of names
      } finally {
        setLoading(false);
      }
    }
    fetchLookups();
  }, []);

  if (initialRoutines.length === 0) {
    return <p className="text-sm text-muted-foreground">No routines found.</p>;
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {initialRoutines.map((r) => (
          <div
            key={r.id}
            className="h-10 rounded-md bg-muted/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  async function handleDeleteRoutine(id: string) {
    await apiDelete(`/routines/${id}`);
    setRoutines((prev) => prev.filter((r) => r.id !== id));
  }

  function handleUpdateRoutine(updated: Routine) {
    setRoutines((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r)),
    );
  }

  if (routines.length === 0) {
    return <p className="text-sm text-muted-foreground">No routines found.</p>;
  }

  return (
    <div className="divide-y">
      {routines.map((r) => (
        <RoutineCard
          key={r.id}
          routine={r}
          exerciseMap={exerciseMap}
          metricMap={metricMap}
          exercises={exercises}
          onDelete={() => handleDeleteRoutine(r.id)}
          onUpdate={handleUpdateRoutine}
        />
      ))}
    </div>
  );
}
