# Routines

RoutineBlock dto
  - order: number
  - notes: string | null
  - defaultRestTime: number | null
  - sets: RoutineSet[]

RoutineSet dto
  - order: number
  - exerciseId: string
  - restTime: number | null
  - metrics: RoutineSetMetric[]

RoutineSetMetric dto
  - exerciseMetricId: string
  - target: number

---

GET /routines

ListRoutinesController:
  query: criteria (filters, orderBy, orderType, pageSize, pageNumber)
  orchestrates: SearchRoutinesByCriteria
  injects: userId filter from auth context
  responses:
    - 200: RoutinePrimitives[]

---

PUT /routines/:id

PutRoutineController:
  payload:
    - id: string
    - name: string
    - description: string | null
    - blocks: RoutineBlock[]
  orchestrates: CreateRoutine
  responses:
    - 201: void
    - 400: DomainError

---

PATCH /routines/:id

PatchRoutineController:
  payload:
    - id: string
    - name?: string
    - description?: string | null
    - blocks?: RoutineBlock[]
  orchestrates: UpdateRoutine
  responses:
    - 204: void
    - 400: DomainError

---

DELETE /routines/:id

DeleteRoutineController:
  payload:
    - id: string
  orchestrates: DeleteRoutine
  responses:
    - 204: void
    - 400: DomainError
