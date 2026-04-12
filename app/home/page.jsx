"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

export default function UserHomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = window.localStorage.getItem("userId");

    if (!userId) {
      router.push("/login");
      return;
    }

    apiRequest(`/user/${userId}`)
      .then(setProfile)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [router]);

  function handleLogout() {
    window.localStorage.removeItem("userId");
    router.push("/");
  }

  return (
    <main style={styles.main}>
      <section style={styles.section}>
        <h1 style={styles.title}>Mi usuario</h1>
        {isLoading && <p>Cargando...</p>}
        {error && <p style={styles.error}>{error}</p>}
        {profile && (
          <dl style={styles.details}>
            <dt>ID</dt>
            <dd>{profile.id}</dd>
            <dt>Usuario</dt>
            <dd>{profile.user}</dd>
          </dl>
        )}
        <div style={styles.actions}>
          <Link href="/" style={styles.link}>
            Inicio
          </Link>
          <button type="button" onClick={handleLogout} style={styles.button}>
            Cerrar sesion
          </button>
        </div>
      </section>
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
  section: {
    width: "100%",
    maxWidth: "520px",
    display: "grid",
    gap: "16px",
  },
  title: { margin: 0 },
  details: {
    display: "grid",
    gridTemplateColumns: "100px 1fr",
    gap: "8px",
    margin: 0,
  },
  actions: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
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
