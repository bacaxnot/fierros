# Users Module

Minimal user representation within the training context. User identity and authentication are managed by `packages/auth/` (better-auth). This module only holds the subset of user data needed by the training domain.

---

UserId vo

UserName vo

User ag
  - id: UserId
  - name: UserName

  methods:
    create(data) -> User

UserRepository repository
  - save(user: User) -> void
  - search(id: UserId) -> User | null
