async function request(
  path: string,
  options?: RequestInit,
): Promise<unknown> {
  const res = await fetch(`/api/backend${path}`, {
    credentials: "include",
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

export function apiGet(path: string): Promise<unknown> {
  return request(path);
}

export function apiPatch(
  path: string,
  body: unknown,
): Promise<unknown> {
  return request(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function apiDelete(path: string): Promise<unknown> {
  return request(path, { method: "DELETE" });
}
