import { container } from "@repo/core/container";
import { SearchAllExerciseMetrics } from "@repo/core/training/exercise-metrics/application/search-all-exercise-metrics.usecase";
import { PopulateExerciseMetrics } from "@repo/core/training/exercise-metrics/application/populate-exercise-metrics.usecase";

const populate = container.get(PopulateExerciseMetrics);
await populate.execute();

const searchAll = container.get(SearchAllExerciseMetrics);
const metrics = await searchAll.execute();

console.log(`${metrics.length} exercise metrics in database`);
process.exit(0);
