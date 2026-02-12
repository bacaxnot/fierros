# Workouts

GET /workouts

ListWorkoutsController:
  query: none
  orchestrates: SearchWorkoutsByUser
  responses:
    - 200: WorkoutPrimitives[]

---

PUT /workouts/:id

PutWorkoutController:
  payload:
    - id: string
    - routineId: string
  orchestrates: StartWorkoutFromRoutine
  responses:
    - 201: void
    - 400: DomainError

---

POST /workouts/:id/finish

FinishWorkoutController:
  payload:
    - id: string
  orchestrates: FinishWorkout
  responses:
    - 204: void
    - 400: DomainError

---

DELETE /workouts/:id

DiscardWorkoutController:
  payload:
    - id: string
  orchestrates: DiscardWorkout
  responses:
    - 204: void
    - 400: DomainError
