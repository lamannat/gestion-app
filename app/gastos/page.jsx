"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

const emptyForm = { descripcion: "", monto: "" };

export default function GastosPage() {
  const [gastos, setGastos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGastos();
  }, []);

  async function loadGastos() {
    setError("");
    try {
      const data = await apiRequest("/api/gastos/");
      setGastos(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function editGasto(gasto) {
    setEditingId(gasto.id);
    setForm({ descripcion: gasto.descripcion || "", monto: gasto.monto || "" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await apiRequest(editingId ? `/api/gastos/${editingId}` : "/api/gastos/", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      resetForm();
      await loadGastos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteGasto(id) {
    setError("");
    try {
      await apiRequest(`/api/gastos/${id}`, { method: "DELETE" });
      await loadGastos();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main style={styles.main}>
      <section style={styles.section}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Gastos</h1>
            <p style={styles.text}>Gastos ordinarios del consorcio.</p>
          </div>
          <Link href="/home" style={styles.link}>Volver</Link>
        </header>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Descripcion
            <input
              value={form.descripcion}
              onChange={(event) => updateField("descripcion", event.target.value)}
              required
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Monto
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.monto}
              onChange={(event) => updateField("monto", event.target.value)}
              required
              style={styles.input}
            />
          </label>
          <div style={styles.formActions}>
            <button type="submit" style={styles.button}>
              {editingId ? "Guardar cambios" : "Crear gasto"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={styles.secondaryButton}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        {error && <p style={styles.error}>{error}</p>}
        {isLoading ? <p>Cargando...</p> : <GastosTable gastos={gastos} onEdit={editGasto} onDelete={deleteGasto} />}
      </section>
    </main>
  );
}

function GastosTable({ gastos, onEdit, onDelete }) {
  if (!gastos.length) {
    return <p>No hay gastos cargados.</p>;
  }

  return (
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Descripcion</th>
            <th style={styles.th}>Monto</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {gastos.map((gasto) => (
            <tr key={gasto.id}>
              <td style={styles.td}>{gasto.descripcion}</td>
              <td style={styles.td}>${Number(gasto.monto).toFixed(2)}</td>
              <td style={styles.tdActions}>
                <button type="button" onClick={() => onEdit(gasto)} style={styles.secondaryButton}>Editar</button>
                <button type="button" onClick={() => onDelete(gasto.id)} style={styles.dangerButton}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  main: { minHeight: "100vh", padding: "32px", fontFamily: "Arial, sans-serif" },
  section: { width: "100%", maxWidth: "960px", margin: "0 auto", display: "grid", gap: "20px" },
  header: { display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "start" },
  title: { margin: 0, fontSize: "32px" },
  text: { margin: "8px 0 0", color: "#444" },
  form: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", alignItems: "end" },
  label: { display: "grid", gap: "6px" },
  input: { border: "1px solid #777", borderRadius: "6px", padding: "10px" },
  formActions: { display: "flex", gap: "8px", flexWrap: "wrap" },
  button: { border: "1px solid #111", borderRadius: "6px", padding: "10px 14px", background: "#111", color: "#fff" },
  secondaryButton: { border: "1px solid #111", borderRadius: "6px", padding: "8px 12px", background: "#fff", color: "#111" },
  dangerButton: { border: "1px solid #b00020", borderRadius: "6px", padding: "8px 12px", background: "#b00020", color: "#fff" },
  link: { color: "#111" },
  error: { margin: 0, color: "#b00020" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", borderBottom: "1px solid #ccc", padding: "10px" },
  td: { borderBottom: "1px solid #eee", padding: "10px" },
  tdActions: { borderBottom: "1px solid #eee", padding: "10px", display: "flex", gap: "8px", flexWrap: "wrap" },
};
