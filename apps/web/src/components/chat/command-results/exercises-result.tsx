type Exercise = {
  id: string;
  name: string;
  description: string | null;
  targetMuscles: { muscleGroup: string; involvement: string }[];
};

function formatMuscle(name: string) {
  return name.replace(/_/g, " ");
}

export function ExercisesResult({ data }: { data: unknown }) {
  const items = (data as { data: Exercise[] }).data;

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No exercises found.</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        {items.length} exercise{items.length !== 1 ? "s" : ""}
      </p>
      <ul className="space-y-1">
        {items.map((ex) => (
          <li key={ex.id} className="flex items-baseline gap-2 text-sm">
            <span className="text-muted-foreground">•</span>
            <span>
              {ex.name}
              {ex.targetMuscles.length > 0 && (
                <span className="text-muted-foreground">
                  {" — "}
                  {ex.targetMuscles.map((m) => formatMuscle(m.muscleGroup)).join(", ")}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
