import { useState } from "react";
import Head from "next/head";

const CATEGORIES = [
  { label: "Inmigración EE.UU. 🇺🇸", prompt: "vacantes remotas de paralegal o legal assistant especializada en inmigración estadounidense, removal defense, asylum, USCIS, para hispanohablante bilingüe" },
  { label: "Propiedad Intelectual 📄", prompt: "vacantes remotas de paralegal en propiedad intelectual, patentes, marcas, para persona bilingüe español-inglés con experiencia internacional" },
  { label: "Legal Assistant General ⚖️", prompt: "vacantes remotas de legal assistant o coordinadora legal bilingüe español-inglés, para firma de abogados o empresa legal" },
  { label: "México Home Office 🇲🇽", prompt: "vacantes home office en México de asistente legal, paralegal o coordinadora jurídica bilingüe" },
  { label: "LATAM / Internacional 🌎", prompt: "vacantes remotas internacionales para paralegal o asistente legal bilingüe español-inglés en América Latina o para empresas globales" },
  { label: "Pedagogía / Capacitación 🎓", prompt: "vacantes remotas relacionadas con capacitación corporativa, diseño instruccional o coordinación de formación, aprovechando licenciatura en pedagogía y experiencia capacitando personal" },
];

export default function Home() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [customQuery, setCustomQuery] = useState("");
  const [error, setError] = useState(null);

  const search = async (prompt, label) => {
    if (loading) return;
    setLoading(true);
    setResults([]);
    setError(null);
    setActiveCategory(label);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.vacantes || []);
    } catch (err) {
      setError("No se pudo buscar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Buscador de Empleo · Rocío Sánchez</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: "100vh", background: "#F7F8FC" }}>

        {/* Header */}
        <div style={{ background: "#fff", borderBottom: "2px solid #E8EAED", padding: "20px 28px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 42, height: 42, background: "#4F46E5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔎</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Buscador de Empleo · Rocío Sánchez</h1>
              <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>Paralegal Bilingüe · Inmigración & IP · Home Office / Remoto</p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>

          {/* Categories */}
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
            Áreas de búsqueda
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {CATEGORIES.map(cat => (
              <button key={cat.label} onClick={() => search(cat.prompt, cat.label)} disabled={loading}
                style={{
                  padding: "9px 16px", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 500,
                  cursor: loading ? "not-allowed" : "pointer",
                  background: activeCategory === cat.label ? "#4F46E5" : "#fff",
                  color: activeCategory === cat.label ? "#fff" : "#374151",
                  border: `2px solid ${activeCategory === cat.label ? "#4F46E5" : "#E5E7EB"}`,
                  opacity: loading && activeCategory !== cat.label ? 0.5 : 1,
                  transition: "all 0.15s"
                }}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Custom search */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            <input value={customQuery} onChange={e => setCustomQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && customQuery.trim() && search(customQuery, "Búsqueda personalizada")}
              placeholder="Buscar algo específico..."
              style={{ flex: 1, padding: "11px 14px", border: "2px solid #E5E7EB", fontFamily: "'Poppins', sans-serif", fontSize: 13, outline: "none", background: "#fff" }} />
            <button onClick={() => customQuery.trim() && search(customQuery, "Búsqueda personalizada")}
              disabled={loading || !customQuery.trim()}
              style={{ padding: "11px 22px", background: "#4F46E5", color: "#fff", border: "none", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: !customQuery.trim() ? 0.5 : 1 }}>
              Buscar
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 32, marginBottom: 12, display: "inline-block", animation: "spin 1s linear infinite" }}>⚙️</div>
              <p style={{ color: "#6B7280", fontSize: 14 }}>Buscando vacantes para {activeCategory}...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{ background: "#FEF2F2", border: "2px solid #FCA5A5", padding: "14px 18px", color: "#B91C1C", fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <div>
              <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>
                <strong style={{ color: "#1a1a2e" }}>{results.length} vacantes</strong> · <strong>{activeCategory}</strong>
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {results.map((job, i) => (
                  <div key={i} style={{ background: "#fff", border: "2px solid #E5E7EB", padding: "18px 22px", transition: "border-color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#4F46E5"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#E5E7EB"}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                      {job.relevancia === "Alta" && <span style={{ fontSize: 11, padding: "2px 8px", background: "#EEF2FF", color: "#4F46E5", fontWeight: 700 }}>⭐ ALTA RELEVANCIA</span>}
                      <span style={{ fontSize: 11, padding: "2px 8px", background: "#F0FDF4", color: "#16A34A", fontWeight: 600 }}>{job.modalidad}</span>
                      <span style={{ fontSize: 11, padding: "2px 8px", background: "#F3F4F6", color: "#6B7280" }}>{job.plataforma}</span>
                    </div>
                    <h3 style={{ margin: "0 0 3px", fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>{job.titulo}</h3>
                    <p style={{ margin: "0 0 4px", fontSize: 13, color: "#4F46E5", fontWeight: 600 }}>{job.empresa}</p>
                    <p style={{ margin: "0 0 8px", fontSize: 12, color: "#9CA3AF" }}>📍 {job.ubicacion}</p>
                    <p style={{ margin: "0 0 10px", fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{job.descripcion}</p>
                    {job.salario && job.salario !== "No especificado" && (
                      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#059669", fontWeight: 600 }}>💰 {job.salario}</p>
                    )}
                    <a href={job.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-block", padding: "8px 18px", background: "#4F46E5", color: "#fff", textDecoration: "none", fontSize: 12, fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>
                      Ver vacante →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && results.length === 0 && (
            <div style={{ textAlign: "center", padding: "70px 0", color: "#9CA3AF" }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>🔎</div>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#6B7280" }}>Selecciona un área o escribe una búsqueda</p>
              <p style={{ fontSize: 12 }}>LinkedIn · Indeed · RemoteOK · WeWorkRemotely · OCC · Computrabajo · FlexJobs</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
