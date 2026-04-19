"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

export default function ExpensasPage() {
  const [calculo, setCalculo] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    calcular();
  }, []);

  async function calcular() {
    setIsLoading(true);
    setError("");
    try {
      const data = await apiRequest("/api/expensas/calcular");
      setCalculo(data);
    } catch (err) {
      setError(err.message);
      setCalculo(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main style={styles.main}>
      <section style={styles.section}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Expensas</h1>
            <p style={styles.text}>Importes calculados por superficie.</p>
          </div>
          <div style={styles.actions}>
            <button type="button" onClick={calcular} style={styles.button}>Calcular</button>
            <Link href="/home" style={styles.link}>Volver</Link>
          </div>
        </header>

        {isLoading && <p>Cargando...</p>}
        {error && <p style={styles.error}>{error}</p>}
        {calculo && (
          <>
            <div style={styles.summary}>
              <p style={styles.summaryItem}>Total gastos: ${Number(calculo.total_gastos).toFixed(2)}</p>
              <p style={styles.summaryItem}>Superficie total: {Number(calculo.total_superficie).toFixed(2)} m2</p>
            </div>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Unidad</th>
                    <th style={styles.th}>Responsable</th>
                    <th style={styles.th}>Superficie</th>
                    <th style={styles.th}>Porcentaje</th>
                    <th style={styles.th}>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {calculo.expensas.map((item) => (
                    <tr key={item.unidad_id}>
                      <td style={styles.td}>{item.piso} {item.apartamento}</td>
                      <td style={styles.td}>{item.nombre_responsable}</td>
                      <td style={styles.td}>{Number(item.superficie).toFixed(2)} m2</td>
                      <td style={styles.td}>{Number(item.porcentaje).toFixed(4)}%</td>
                      <td style={styles.td}>${Number(item.monto).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

const styles = {
  main: { minHeight: "100vh", padding: "32px", fontFamily: "Arial, sans-serif" },
  section: { width: "100%", maxWidth: "960px", margin: "0 auto", display: "grid", gap: "20px" },
  header: { display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "start", flexWrap: "wrap" },
  title: { margin: 0, fontSize: "32px" },
  text: { margin: "8px 0 0", color: "#444" },
  actions: { display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" },
  button: { border: "1px solid #111", borderRadius: "6px", padding: "10px 14px", background: "#111", color: "#fff" },
  link: { color: "#111" },
  error: { margin: 0, color: "#b00020" },
  summary: { display: "flex", gap: "12px", flexWrap: "wrap" },
  summaryItem: { margin: 0, border: "1px solid #ccc", borderRadius: "6px", padding: "10px 12px" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", borderBottom: "1px solid #ccc", padding: "10px" },
  td: { borderBottom: "1px solid #eee", padding: "10px" },
};
