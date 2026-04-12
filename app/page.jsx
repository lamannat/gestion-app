import Link from "next/link";

export default function Home() {
  return (
    <main style={styles.main}>
      <section style={styles.section}>
        <h1 style={styles.title}>Gestion de consorcios</h1>
        <p style={styles.text}>Ingresa con tu cuenta o registra un usuario nuevo.</p>
        <div style={styles.actions}>
          <Link href="/login" style={styles.button}>
            Iniciar sesion
          </Link>
          <Link href="/register" style={styles.button}>
            Crear cuenta
          </Link>
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
    gap: "20px",
  },
  title: {
    margin: 0,
    fontSize: "32px",
  },
  text: {
    margin: 0,
    color: "#444",
  },
  actions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  button: {
    border: "1px solid #111",
    borderRadius: "6px",
    padding: "10px 14px",
    color: "#111",
    textDecoration: "none",
  },
};
