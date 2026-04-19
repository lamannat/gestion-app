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
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Inicio</h1>
            {isLoading && <p style={styles.text}>Cargando...</p>}
            {error && <p style={styles.error}>{error}</p>}
            {profile && <p style={styles.text}>Usuario: {profile.user}</p>}
          </div>
          <button type="button" onClick={handleLogout} style={styles.secondaryButton}>
            Cerrar sesion
          </button>
        </div>

        <nav style={styles.actions}>
          <Link href="/gastos" style={styles.button}>
            Gastos
          </Link>
          <Link href="/unidades" style={styles.button}>
            Unidades
          </Link>
          <Link href="/expensas" style={styles.button}>
            Calcular expensas
          </Link>
        </nav>
      </section>
    </main>
  );
}

const styles = {
  main: {
    minHeight: "100vh",
    padding: "32px",
    fontFamily: "Arial, sans-serif",
  },
  section: {
    width: "100%",
    maxWidth: "860px",
    margin: "0 auto",
    display: "grid",
    gap: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "start",
    flexWrap: "wrap",
  },
  title: { margin: 0, fontSize: "32px" },
  text: { margin: "8px 0 0", color: "#444" },
  actions: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },
  button: {
    border: "1px solid #111",
    borderRadius: "6px",
    padding: "14px",
    color: "#fff",
    background: "#111",
    textDecoration: "none",
    textAlign: "center",
  },
  secondaryButton: {
    border: "1px solid #111",
    borderRadius: "6px",
    padding: "10px 14px",
    background: "#fff",
    color: "#111",
  },
  error: { margin: "8px 0 0", color: "#b00020" },
};
