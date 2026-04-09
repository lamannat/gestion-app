const BASE_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getTasks: () => request("/tasks"),

  createTask: (title) =>
    request("/tasks", {
      method: "POST",
      body: JSON.stringify({ title }),
    }),

  toggleTask: (id, done) =>
    request(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ done }),
    }),

  deleteTask: (id) =>
    request(`/tasks/${id}`, {
      method: "DELETE",
    }),
};
