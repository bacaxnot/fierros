# Exercises

ExerciseTargetMuscle dto
  - muscleGroup: string
  - involvement: string

---

GET /exercises

ListExercisesController:
  query: criteria (filters, orderBy, orderType, pageSize, pageNumber)
  orchestrates: SearchExercisesByCriteria
  injects: userId filter from auth context
  responses:
    - 200: ExercisePrimitives[]

---

PUT /exercises/:id

PutExerciseController:
  payload:
    - id: string
    - name: string
    - description: string | null
    - targetMuscles: ExerciseTargetMuscle[]
    - defaultMetrics: string[]
  orchestrates: CreateExercise
  responses:
    - 201: void
    - 400: DomainError
