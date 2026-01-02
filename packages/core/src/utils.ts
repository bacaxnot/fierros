import { validate as uuidValidate, v7 as uuidv7 } from "uuid";

export function generateUuid(): string {
  return uuidv7();
}

export function validateUuid(id: string): boolean {
  return uuidValidate(id);
}
