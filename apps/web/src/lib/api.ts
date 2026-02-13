import { config } from "./config";

export function api(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${config("apiUrl")}${path}`, init);
}
