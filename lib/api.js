export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(body?.error || "No se pudo completar la operacion");
  }

  return body;
}
