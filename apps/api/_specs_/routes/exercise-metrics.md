# Exercise Metrics

GET /exercise-metrics

ListExerciseMetricsController:
  query: none
  orchestrates: SearchAllExerciseMetrics
  responses:
    - 200: ExerciseMetricPrimitives[]
