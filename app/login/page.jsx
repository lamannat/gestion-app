"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = await apiRequest("/users/login", {
        method: "POST",
        body: JSON.stringify({ user, password }),
      });
      window.localStorage.setItem("userId", data.id);
      router.push("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main style={styles.main}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>Iniciar sesion</h1>
        {error && <p style={styles.error}>{error}</p>}
        <label style={styles.label}>
          Usuario
          <input
            value={user}
            onChange={(event) => setUser(event.target.value)}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Contrasena
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            style={styles.input}
          />
        </label>
        <button type="submit" disabled={isSubmitting} style={styles.button}>
          {isSubmitting ? "Enviando..." : "Enviar"}
        </button>
        <Link href="/" style={styles.link}>
          Volver
        </Link>
      </form>
    </main>
  );
}

const styles = {
  main: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
  form: {
    width: "100%",
    maxWidth: "420px",
    display: "grid",
    gap: "14px",
  },
  title: { margin: 0 },
  label: {
    display: "grid",
    gap: "6px",
  },
  input: {
    border: "1px solid #777",
    borderRadius: "6px",
    padding: "10px",
  },
  button: {
    border: "1px solid #111",
    borderRadius: "6px",
    padding: "10px 14px",
    background: "#111",
    color: "#fff",
  },
  link: { color: "#111" },
  error: {
    margin: 0,
    color: "#b00020",
  },
};
