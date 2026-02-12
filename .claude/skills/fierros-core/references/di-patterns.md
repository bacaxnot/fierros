# DI Registration Patterns

## DIOD Container Basics

Services are registered in `packages/core/di/` and auto-discovered via `autoregister.ts`.

## Scope

**IMPORTANT**: DIOD defaults to **transient** (new instance per request). Use `.asSingleton()` for stateful services.

### When to Use Singleton

Use `.asSingleton()` when:
- Service holds state (maps, caches, connections)
- Service is shared across multiple consumers
- Service manages external resources

### Registration Patterns

**Simple service (transient - default):**
```typescript
builder.registerAndUse(MyService);
```

**Singleton service:**
```typescript
builder.registerAndUse(MyService).asSingleton();
```

**Abstract class with implementation:**
```typescript
builder.register(AbstractService).use(ConcreteService);
// or as singleton:
builder.register(AbstractService).use(ConcreteService).asSingleton();
```

**Factory registration:**
```typescript
builder.register(MyService).useFactory((container) => {
  const dep = container.get(Dependency);
  return new MyService(dep);
}).asSingleton();
```

## Circular Dependency Prevention

Avoid injecting EventBus into DomainEventSubscribers - the EventBus factory needs all subscribers, creating a cycle.

**Solutions:**
1. Call service directly instead of publishing event
2. Use lazy injection: `() => EventBus` instead of `EventBus`
3. Register problematic subscribers separately after EventBus

## File Location

DI modules go in `packages/core/di/`:
- `shared/` - Shared services (EventBus, gateways, etc.)
- `contexts/<context>/` - Context-specific registrations
