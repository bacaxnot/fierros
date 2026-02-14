import { tool } from "ai";
import { z } from "zod";
import { api } from "~/lib/api";

const metricValueSchema = z.object({
  value: z.number().describe("The numeric value"),
  unit: z.enum(["quantity", "seconds", "milliseconds", "kilograms", "pounds", "meters", "kilometers", "miles"]).describe("The unit of measurement. Use 'quantity' for reps/counts, 'kilograms' or 'pounds' for weight, 'seconds' for duration."),
});

const metricValueRangeSchema = z.object({
  min: metricValueSchema.nullable().describe("Minimum value of the range"),
  max: metricValueSchema.nullable().describe("Maximum value of the range"),
});

const routineSetMetricSchema = z.object({
  metricId: z.string().uuid().describe("The exercise metric ID"),
  targetRange: metricValueRangeSchema.nullable().describe("Target range for this metric"),
  targetValue: metricValueSchema.nullable().describe("Target value for this metric"),
  lastValue: metricValueSchema.nullable().describe("Last recorded value"),
});

const routineSetSchema = z.object({
  order: z.number().describe("Order of the set within the block (0-indexed)"),
  exerciseId: z.string().uuid().describe("The exercise ID for this set"),
  notes: z.string().nullable().describe("Optional notes for the set"),
  restTime: z.number().nullable().describe("Rest time in seconds after this set"),
  metrics: z.array(routineSetMetricSchema).describe("Metrics for this set"),
});

const routineBlockSchema = z.object({
  order: z.number().describe("Order of the block within the routine (0-indexed)"),
  notes: z.string().nullable().describe("Optional notes for the block"),
  defaultRestTime: z.number().nullable().describe("Default rest time in seconds between sets"),
  sets: z.array(routineSetSchema).describe("The sets in this block"),
});

export function createTrainingTools(cookie: string) {
  const apiFetch = async (path: string, init?: RequestInit) => {
    const method = init?.method ?? "GET";
    console.log(`[tool] ${method} ${path}`);
    if (init?.body) console.log(`[tool] body:`, init.body);
    const res = await api(path, {
      ...init,
      headers: { "Content-Type": "application/json", cookie, ...init?.headers },
    });
    const text = await res.text();
    console.log(`[tool] ${method} ${path} -> ${res.status}`, text);
    return {
      ok: res.ok,
      status: res.status,
      json: async () => JSON.parse(text),
      text: () => text,
    };
  };

  return {
    searchExercises: tool({
      description:
        "Search for exercises available to the user. Use this to find exercises by name or target muscle before creating routines.",
      inputSchema: z.object({
        name: z.string().optional().describe("Filter exercises by name (partial match)"),
      }),
      execute: async ({ name }) => {
        const params = new URLSearchParams();
        if (name) {
          params.set("filters[0][field]", "name");
          params.set("filters[0][operator]", "contains");
          params.set("filters[0][value]", name);
        }
        const res = await apiFetch(`/exercises?${params.toString()}`);
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          return { error: `Failed to search exercises: ${res.status}`, details: body };
        }
        return await res.json();
      },
    }),

    createExercise: tool({
      description:
        "Create a new custom exercise for the user. Use listExerciseMetrics first to get valid metric IDs for defaultMetrics.",
      inputSchema: z.object({
        name: z.string().describe("Name of the exercise (max 100 chars)"),
        description: z.string().nullable().describe("Description of the exercise (max 1000 chars)"),
        targetMuscles: z.array(z.object({
          muscleGroup: z.enum([
            "chest", "upper_back", "lats", "shoulders", "biceps", "triceps",
            "forearms", "core", "quads", "hamstrings", "glutes", "calves",
            "hip_flexors", "adductors", "abductors",
          ]).describe("The muscle group"),
          involvement: z.enum(["primary", "secondary", "stabilizer"]).describe("How involved this muscle is"),
        })).describe("Target muscles for this exercise"),
        defaultMetrics: z.array(z.string().uuid()).describe("IDs of exercise metrics to track by default"),
      }),
      execute: async ({ name, description, targetMuscles, defaultMetrics }) => {
        const id = crypto.randomUUID();
        const res = await apiFetch(`/exercises/${id}`, {
          method: "PUT",
          body: JSON.stringify({ name, description, targetMuscles, defaultMetrics }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          return { error: `Failed to create exercise: ${res.status}`, details: body };
        }
        return { success: true, id, name };
      },
    }),

    listExerciseMetrics: tool({
      description:
        "List all available exercise metrics (e.g., weight, reps, duration). Use this to understand what metrics can be tracked for exercises when creating routines.",
      inputSchema: z.object({}),
      execute: async () => {
        const res = await apiFetch("/exercise-metrics");
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          return { error: `Failed to list metrics: ${res.status}`, details: body };
        }
        return await res.json();
      },
    }),

    searchRoutines: tool({
      description: "Search for the user's workout routines. Use this to list existing routines or find a specific one by name.",
      inputSchema: z.object({
        name: z.string().optional().describe("Filter routines by name (partial match)"),
      }),
      execute: async ({ name }) => {
        const params = new URLSearchParams();
        if (name) {
          params.set("filters[0][field]", "name");
          params.set("filters[0][operator]", "contains");
          params.set("filters[0][value]", name);
        }
        const res = await apiFetch(`/routines?${params.toString()}`);
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          return { error: `Failed to search routines: ${res.status}`, details: body };
        }
        return await res.json();
      },
    }),

    createRoutine: tool({
      description:
        "Create a new workout routine. Before creating, search for exercises to get valid exercise IDs and list metrics to get valid metric IDs.",
      inputSchema: z.object({
        name: z.string().describe("Name of the routine"),
        description: z.string().nullable().describe("Description of the routine"),
        blocks: z.array(routineBlockSchema).describe("The blocks of the routine, each containing sets of exercises"),
      }),
      execute: async ({ name, description, blocks }) => {
        const id = crypto.randomUUID();
        const res = await apiFetch(`/routines/${id}`, {
          method: "PUT",
          body: JSON.stringify({ name, description, blocks }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          return { error: `Failed to create routine: ${res.status}`, details: body };
        }
        return { success: true, id, name };
      },
    }),

    updateRoutine: tool({
      description: "Update an existing workout routine. Only provide the fields you want to change.",
      inputSchema: z.object({
        routineId: z.string().uuid().describe("The ID of the routine to update"),
        name: z.string().optional().describe("New name for the routine"),
        description: z.string().nullable().optional().describe("New description"),
        blocks: z.array(routineBlockSchema).optional().describe("New blocks configuration"),
      }),
      execute: async ({ routineId, ...body }) => {
        const res = await apiFetch(`/routines/${routineId}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          return { error: `Failed to update routine: ${res.status}`, details: data };
        }
        return { success: true, routineId };
      },
    }),

    deleteRoutine: tool({
      description: "Delete a workout routine permanently.",
      inputSchema: z.object({
        routineId: z.string().uuid().describe("The ID of the routine to delete"),
      }),
      execute: async ({ routineId }) => {
        const res = await apiFetch(`/routines/${routineId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          return { error: `Failed to delete routine: ${res.status}`, details: data };
        }
        return { success: true, routineId };
      },
    }),

    searchWorkouts: tool({
      description: "Search for the user's workouts. Use this to find past or in-progress workouts.",
      inputSchema: z.object({
        routineId: z.string().uuid().optional().describe("Filter workouts by routine ID"),
      }),
      execute: async ({ routineId }) => {
        const params = new URLSearchParams();
        if (routineId) {
          params.set("filters[0][field]", "routineId");
          params.set("filters[0][operator]", "eq");
          params.set("filters[0][value]", routineId);
        }
        const res = await apiFetch(`/workouts?${params.toString()}`);
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          return { error: `Failed to search workouts: ${res.status}`, details: body };
        }
        return await res.json();
      },
    }),

    startWorkout: tool({
      description: "Start a new workout session from a routine.",
      inputSchema: z.object({
        routineId: z.string().uuid().describe("The ID of the routine to start the workout from"),
      }),
      execute: async ({ routineId }) => {
        const id = crypto.randomUUID();
        const res = await apiFetch(`/workouts/${id}`, {
          method: "PUT",
          body: JSON.stringify({ routineId }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          return { error: `Failed to start workout: ${res.status}`, details: data };
        }
        return { success: true, workoutId: id, routineId };
      },
    }),

    finishWorkout: tool({
      description: "Finish an in-progress workout session.",
      inputSchema: z.object({
        workoutId: z.string().uuid().describe("The ID of the workout to finish"),
      }),
      execute: async ({ workoutId }) => {
        const res = await apiFetch(`/workouts/${workoutId}/finish`, {
          method: "POST",
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          return { error: `Failed to finish workout: ${res.status}`, details: data };
        }
        return { success: true, workoutId };
      },
    }),

    discardWorkout: tool({
      description: "Discard (delete) a workout session.",
      inputSchema: z.object({
        workoutId: z.string().uuid().describe("The ID of the workout to discard"),
      }),
      execute: async ({ workoutId }) => {
        const res = await apiFetch(`/workouts/${workoutId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          return { error: `Failed to discard workout: ${res.status}`, details: data };
        }
        return { success: true, workoutId };
      },
    }),
  };
}
