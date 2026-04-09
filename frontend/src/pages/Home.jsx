import { useState, useEffect } from "react";
import { api } from "../services/api.js";
import TaskCard from "../components/TaskCard.jsx";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const newTask = await api.createTask(input.trim());
      setTasks((prev) => [newTask, ...prev]);
      setInput("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(id, done) {
    try {
      const updated = await api.toggleTask(id, done);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "0 16px" }}>
      <h1>Tasks</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}{" "}
          <button onClick={() => setError(null)}>Dismiss</button>
        </p>
      )}

      <form onSubmit={handleAdd} style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New task..."
          style={{ flex: 1, padding: "6px" }}
        />
        <button type="submit">Add</button>
      </form>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
