import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type ToolResultProps = {
  toolName: string;
  result: unknown;
};

export function ToolResult({ toolName, result }: ToolResultProps) {
  const data = result as Record<string, unknown>;

  if (data?.error) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
        {String(data.error)}
      </div>
    );
  }

  if (data?.success) {
    return <SuccessResult toolName={toolName} data={data} />;
  }

  if (data?.data && Array.isArray(data.data)) {
    return <ListResult toolName={toolName} items={data.data} />;
  }

  return null;
}

function SuccessResult({ toolName, data }: { toolName: string; data: Record<string, unknown> }) {
  const labels: Record<string, string> = {
    createRoutine: "Routine created",
    updateRoutine: "Routine updated",
    deleteRoutine: "Routine deleted",
    startWorkout: "Workout started",
    finishWorkout: "Workout finished",
    discardWorkout: "Workout discarded",
  };

  return (
    <div className="rounded-md border border-green-500/50 bg-green-500/10 px-3 py-2 text-sm">
      <span className="font-medium">{labels[toolName] || "Success"}</span>
      {typeof data.name === "string" && <span className="ml-1 text-muted-foreground">— {data.name}</span>}
    </div>
  );
}

function ListResult({ toolName, items }: { toolName: string; items: Record<string, unknown>[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No results found.</p>;
  }

  if (toolName === "searchExercises") {
    return (
      <div className="space-y-2">
        {items.map((ex) => (
          <Card key={String(ex.id)} className="py-2">
            <CardContent className="px-3 py-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{String(ex.name)}</span>
                <div className="flex gap-1">
                  {Array.isArray(ex.targetMuscles) &&
                    ex.targetMuscles.map((m: Record<string, string>, i: number) => (
                      <Badge key={`${m.name}-${i}`} variant="secondary" className="text-xs">
                        {m.name}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (toolName === "searchRoutines") {
    return (
      <div className="space-y-2">
        {items.map((r) => (
          <Card key={String(r.id)} className="py-2">
            <CardHeader className="px-3 py-0">
              <CardTitle className="text-sm">{String(r.name)}</CardTitle>
            </CardHeader>
            {typeof r.description === "string" && (
              <CardContent className="px-3 py-0">
                <p className="text-xs text-muted-foreground">{r.description}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    );
  }

  if (toolName === "listExerciseMetrics") {
    return (
      <div className="flex flex-wrap gap-1">
        {items.map((m) => (
          <Badge key={String(m.id)} variant="outline" className="text-xs">
            {String(m.name)} ({String(m.type)})
          </Badge>
        ))}
      </div>
    );
  }

  if (toolName === "searchWorkouts") {
    return (
      <div className="space-y-2">
        {items.map((w) => (
          <Card key={String(w.id)} className="py-2">
            <CardContent className="px-3 py-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{String(w.name)}</span>
                <Badge variant={w.finishedAt ? "secondary" : "default"} className="text-xs">
                  {w.finishedAt ? "Finished" : "In Progress"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return <pre className="text-xs overflow-auto">{JSON.stringify(items, null, 2)}</pre>;
}
