const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "";

export function apiUrl(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`API path must start with "/": ${path}`);
  }

  if (!rawApiBaseUrl) {
    return path;
  }

  return `${rawApiBaseUrl.replace(/\/$/, "")}${path}`;
}

export function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(apiUrl(path), init);
}
