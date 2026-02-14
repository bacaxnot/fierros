type Routine = {
  id: string;
  name: string;
  description: string | null;
  blocks: { sets: { exerciseId: string }[] }[];
};

export function RoutinesResult({ data }: { data: unknown }) {
  const items = (data as { data: Routine[] }).data;

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No routines found.</p>;
  }

  return (
    <div className="divide-y">
      {items.map((r) => {
        const setCount = r.blocks.reduce((sum, b) => sum + b.sets.length, 0);
        return (
          <div key={r.id} className="flex items-center justify-between py-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm">{r.name}</span>
              {r.description && (
                <span className="text-xs text-muted-foreground">{r.description}</span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {r.blocks.length} block{r.blocks.length !== 1 ? "s" : ""} · {setCount} set{setCount !== 1 ? "s" : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}
