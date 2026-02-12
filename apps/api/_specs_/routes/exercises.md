# Exercises

GET /exercises

ListExercisesController:
  query: criteria (filters, orderBy, orderType, pageSize, pageNumber)
  orchestrates: SearchExercisesByCriteria
  injects: userId filter from auth context
  responses:
    - 200: ExercisePrimitives[]
