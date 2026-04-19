"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

const emptyForm = {
  piso: "",
  apartamento: "",
  nombre_responsable: "",
  dni_responsable: "",
  mail_responsable: "",
  tel_responsable: "",
  superficie: "",
};

export default function UnidadesPage() {
  const [unidades, setUnidades] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUnidades();
  }, []);

  async function loadUnidades() {
    setError("");
    try {
      const data = await apiRequest("/api/unidades/");
      setUnidades(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function editUnidad(unidad) {
    setEditingId(unidad.id);
    setForm({
      piso: unidad.piso ?? "",
      apartamento: unidad.apartamento || "",
      nombre_responsable: unidad.nombre_responsable || "",
      dni_responsable: unidad.dni_responsable || "",
      mail_responsable: unidad.mail_responsable || "",
      tel_responsable: unidad.tel_responsable || "",
      superficie: unidad.superficie || "",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await apiRequest(editingId ? `/api/unidades/${editingId}` : "/api/unidades/", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      resetForm();
      await loadUnidades();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteUnidad(id) {
    setError("");
    try {
      await apiRequest(`/api/unidades/${id}`, { method: "DELETE" });
      await loadUnidades();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main style={styles.main}>
      <section style={styles.section}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Unidades</h1>
            <p style={styles.text}>Departamentos y responsables.</p>
          </div>
          <Link href="/home" style={styles.link}>Volver</Link>
        </header>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Piso<input type="number" min="0" value={form.piso} onChange={(event) => updateField("piso", event.target.value)} required style={styles.input} /></label>
          <label style={styles.label}>Apartamento<input value={form.apartamento} onChange={(event) => updateField("apartamento", event.target.value)} required style={styles.input} /></label>
          <label style={styles.label}>Responsable<input value={form.nombre_responsable} onChange={(event) => updateField("nombre_responsable", event.target.value)} required style={styles.input} /></label>
          <label style={styles.label}>DNI<input value={form.dni_responsable} onChange={(event) => updateField("dni_responsable", event.target.value)} required style={styles.input} /></label>
          <label style={styles.label}>Mail<input type="email" value={form.mail_responsable} onChange={(event) => updateField("mail_responsable", event.target.value)} required style={styles.input} /></label>
          <label style={styles.label}>Telefono<input value={form.tel_responsable} onChange={(event) => updateField("tel_responsable", event.target.value)} required style={styles.input} /></label>
          <label style={styles.label}>Superficie<input type="number" min="0.01" step="0.01" value={form.superficie} onChange={(event) => updateField("superficie", event.target.value)} required style={styles.input} /></label>
          <div style={styles.formActions}>
            <button type="submit" style={styles.button}>{editingId ? "Guardar cambios" : "Crear unidad"}</button>
            {editingId && <button type="button" onClick={resetForm} style={styles.secondaryButton}>Cancelar</button>}
          </div>
        </form>

        {error && <p style={styles.error}>{error}</p>}
        {isLoading ? <p>Cargando...</p> : <UnidadesTable unidades={unidades} onEdit={editUnidad} onDelete={deleteUnidad} />}
      </section>
    </main>
  );
}

function UnidadesTable({ unidades, onEdit, onDelete }) {
  if (!unidades.length) {
    return <p>No hay unidades cargadas.</p>;
  }

  return (
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Unidad</th>
            <th style={styles.th}>Responsable</th>
            <th style={styles.th}>Contacto</th>
            <th style={styles.th}>Superficie</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {unidades.map((unidad) => (
            <tr key={unidad.id}>
              <td style={styles.td}>{unidad.piso} {unidad.apartamento}</td>
              <td style={styles.td}>{unidad.nombre_responsable}<br />DNI {unidad.dni_responsable}</td>
              <td style={styles.td}>{unidad.mail_responsable}<br />{unidad.tel_responsable}</td>
              <td style={styles.td}>{Number(unidad.superficie).toFixed(2)} m2</td>
              <td style={styles.tdActions}>
                <button type="button" onClick={() => onEdit(unidad)} style={styles.secondaryButton}>Editar</button>
                <button type="button" onClick={() => onDelete(unidad.id)} style={styles.dangerButton}>Eliminar</button>
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
  section: { width: "100%", maxWidth: "1120px", margin: "0 auto", display: "grid", gap: "20px" },
  header: { display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "start" },
  title: { margin: 0, fontSize: "32px" },
  text: { margin: "8px 0 0", color: "#444" },
  form: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", alignItems: "end" },
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
  td: { borderBottom: "1px solid #eee", padding: "10px", verticalAlign: "top" },
  tdActions: { borderBottom: "1px solid #eee", padding: "10px", display: "flex", gap: "8px", flexWrap: "wrap" },
};
