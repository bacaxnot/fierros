# Exercises

GET /exercises

ListExercisesController:
  query: none
  orchestrates: SearchExercisesByUser
  responses:
    - 200: ExercisePrimitives[]
