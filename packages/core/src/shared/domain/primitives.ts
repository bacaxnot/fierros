/**
 * Converts an ISO date string to a Date object
 * Use in fromPrimitives() methods when reconstituting aggregates from primitives
 */
export function dateFromPrimitive(isoString: string): Date {
  return new Date(isoString);
}

/**
 * Converts a Date object to an ISO date string
 * Use in toPrimitives() methods when serializing aggregates to primitives
 */
export function dateToPrimitive(date: Date): string {
  return date.toISOString();
}
