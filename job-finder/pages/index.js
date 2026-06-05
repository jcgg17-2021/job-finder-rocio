import { useState, useEffect } from "react";
import Head from "next/head";

const CATEGORIAS = [
  { label: "Inmigración EE.UU. 🇺🇸", prompt: "paralegal immigration bilingual spanish removal defense asylum" },
  { label: "Propiedad Intelectual 📄", prompt: "paralegal propiedad intelectual patentes bilingue" },
  { label: "Legal Assistant General ⚖️", prompt: "legal assistant bilingual spanish english remote" },
  { label: "México Home Office 🇲🇽", prompt: "paralegal juridico bilingue México home office" },
  { label: "LATAM / Internacional 🌎", prompt: "paralegal legal bilingual spanish latin america remote" },
  { label: "Pedagogía / Capacitación 🎓", prompt: "instructional designer capacitación pedagog bilingue remote" },
];

const COLUMNAS = [
  { key: "interesante", label: "⭐ Interesante", color: "#4F46E5" },
  { key: "aplicada", label: "📤 Aplicada", color: "#0891B2" },
  { key: "proceso", label: "⚙️ En Proceso", color: "#D97706" },
  { key: "rechazada", label: "❌ Rechazada", color: "#DC2626" },
];

export default function Home() {
  const [tab, setTab] = useState("buscar");
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCarta, setLoadingCarta] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [customQuery, setCustomQuery] = useState("");
  const [error, setError] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [kanban, setKanban] = useState({ interesante: [], aplicada: [], proceso: [], rechazada: [] });
  const [cartas, setCartas] = useState({});
  const [cartaModal, setCartaModal] = useState(null);
  const [sortBy, setSortBy] = useState("match");

  useEffect(() => {
    fetch("/api/search").then(r => r.json()).then(d => {
      setFavoritos(d.favoritos || []);
      setKanban(d.kanban || { interesante: [], aplicada: [], proceso: [], rechazada: [] });
    });
  }, []);

  const search = async (prompt, label) => {
    if (loading) return;
    setLoading(true);
    setVacantes([]);
    setError(null);
    setActiveCategory(label);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "search", data: { prompt } })
      });
      const d = await res.json();
      setVacantes(d.vacantes || []);
    } catch { setError("Error al buscar. Intenta de nuevo."); }
    finally { setLoading(false); }
  };

  const toggleFavorito = async (id) => {
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle_favorito", data: { id } })
    });
    const d = await res.json();
    setFavoritos(d.favoritos || []);
  };

  const moverKanban = async (vacante, columna) => {
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "kanban_move", data: { id: vacante.id, columna, titulo: vacante.titulo, empresa: vacante.empresa, url: vacante.url } })
    });
    const d = await res.json();
    setKanban(d.kanban || {});
  };

  const generarCarta = async (vacante) => {
    if (cartas[vacante.id]) { setCartaModal(cartas[vacante.id]); return; }
    setLoadingCarta(vacante.id);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "carta", data: { vacante } })
      });
      const d = await res.json();
      setCartas(prev => ({ ...prev, [vacante.id]: d.carta }));
      setCartaModal(d.carta);
    } catch { alert("Error generando carta"); }
    finally { setLoadingCarta(null); }
  };

  const vacantesSorted = [...vacantes].sort((a, b) => sortBy === "match" ? b.match - a.match : 0);
  const vacantesFavoritas = vacantes.filter(v => favoritos.includes(v.id));

  const btn = (active, onClick, children, color = "#4F46E5") => (
    <button onClick={onClick} style={{
      padding: "9px 16px", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 500,
      cursor: "pointer", background: active ? color : "#fff", color: active ? "#fff" : "#374151",
      border: `2px solid ${active ? color : "#E5E7EB"}`, transition: "all 0.15s"
    }}>{children}</button>
  );

  return (
    <>
      <Head>
        <title>Job Finder · Rocío Sánchez</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: "100vh", background: "#F7F8FC" }}>

        {/* Header */}
        <div style={{ background: "#fff", borderBottom: "2px solid #E8EAED", padding: "16px 28px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, background: "#4F46E5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔎</div>
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Job Finder · Rocío Sánchez</h1>
              <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>Paralegal Bilingüe · Inmigración & IP · Home Office / Remoto</p>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["buscar", "favoritos", "kanban"].map(t => btn(tab === t, () => setTab(t),
                t === "buscar" ? "🔍 Buscar" : t === "favoritos" ? `⭐ Favoritos (${favoritos.length})` : "📋 Seguimiento"
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>

          {/* TAB BUSCAR */}
          {tab === "buscar" && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Áreas de búsqueda</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {CATEGORIAS.map(cat => btn(activeCategory === cat.label, () => search(cat.prompt, cat.label), cat.label))}
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <input value={customQuery} onChange={e => setCustomQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && customQuery.trim() && search(customQuery, "Personalizada")}
                  placeholder="Búsqueda personalizada..."
                  style={{ flex: 1, padding: "11px 14px", border: "2px solid #E5E7EB", fontFamily: "'Poppins', sans-serif", fontSize: 13, outline: "none", background: "#fff" }} />
                <button onClick={() => customQuery.trim() && search(customQuery, "Personalizada")}
                  style={{ padding: "11px 22px", background: "#4F46E5", color: "#fff", border: "none", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Buscar
                </button>
              </div>

              {loading && (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div style={{ fontSize: 30, display: "inline-block", animation: "spin 1s linear infinite" }}>⚙️</div>
                  <p style={{ color: "#6B7280", fontSize: 14, marginTop: 12 }}>Buscando vacantes...</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </div>
              )}

              {error && <div style={{ background: "#FEF2F2", border: "2px solid #FCA5A5", padding: "14px 18px", color: "#B91C1C", fontSize: 13 }}>⚠️ {error}</div>}

              {!loading && vacantes.length > 0 && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}><strong style={{ color: "#1a1a2e" }}>{vacantes.length} plataformas</strong> · {activeCategory}</p>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                      style={{ padding: "6px 10px", border: "2px solid #E5E7EB", fontFamily: "'Poppins', sans-serif", fontSize: 12, outline: "none" }}>
                      <option value="match">Ordenar por Match %</option>
                      <option value="default">Orden default</option>
                    </select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
                    {vacantesSorted.map(job => (
                      <div key={job.id} style={{ background: "#fff", border: "2px solid #E5E7EB", padding: "18px", transition: "border-color 0.15s", display: "flex", flexDirection: "column", gap: 10 }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "#4F46E5"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "#E5E7EB"}>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 11, padding: "2px 8px", background: "#EEF2FF", color: "#4F46E5", fontWeight: 700 }}>⚡ {job.match}% match</span>
                            <span style={{ fontSize: 11, padding: "2px 8px", background: "#F0FDF4", color: "#16A34A", fontWeight: 600 }}>{job.modalidad}</span>
                          </div>
                          <button onClick={() => toggleFavorito(job.id)}
                            style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: favoritos.includes(job.id) ? "#F59E0B" : "#D1D5DB" }}>
                            ★
                          </button>
                        </div>

                        <div>
                          <h3 style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>{job.titulo}</h3>
                          <p style={{ margin: "0 0 2px", fontSize: 13, color: "#4F46E5", fontWeight: 600 }}>{job.empresa}</p>
                          <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF" }}>📍 {job.ubicacion} · {job.plataforma}</p>
                        </div>

                        <p style={{ margin: 0, fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{job.descripcion}</p>

                        {job.salario !== "Ver en plataforma" && (
                          <p style={{ margin: 0, fontSize: 12, color: "#059669", fontWeight: 600 }}>💰 {job.salario}</p>
                        )}

                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: "auto" }}>
                          <a href={job.url} target="_blank" rel="noopener noreferrer"
                            style={{ padding: "7px 14px", background: "#4F46E5", color: "#fff", textDecoration: "none", fontSize: 12, fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>
                            Ver vacantes →
                          </a>
                          <button onClick={() => moverKanban(job, "interesante")}
                            style={{ padding: "7px 12px", background: "#fff", border: "2px solid #E5E7EB", fontSize: 12, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                            + Seguimiento
                          </button>
                          <button onClick={() => generarCarta(job)} disabled={loadingCarta === job.id}
                            style={{ padding: "7px 12px", background: "#fff", border: "2px solid #E5E7EB", fontSize: 12, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                            {loadingCarta === job.id ? "⏳" : "✉️ Carta"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!loading && !error && vacantes.length === 0 && (
                <div style={{ textAlign: "center", padding: "70px 0", color: "#9CA3AF" }}>
                  <div style={{ fontSize: 44, marginBottom: 14 }}>🔎</div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "#6B7280" }}>Selecciona un área o escribe una búsqueda</p>
                  <p style={{ fontSize: 12 }}>16 plataformas · LinkedIn · Indeed · RemoteOK · Upwork · Workana · OCC y más</p>
                </div>
              )}
            </div>
          )}

          {/* TAB FAVORITOS */}
          {tab === "favoritos" && (
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>⭐ Plataformas Favoritas</h2>
              {favoritos.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#9CA3AF" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
                  <p style={{ fontSize: 14 }}>No tienes favoritas aún. Haz búsquedas y marca con ★</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
                  {vacantes.filter(v => favoritos.includes(v.id)).map(job => (
                    <div key={job.id} style={{ background: "#fff", border: "2px solid #FDE68A", padding: "18px" }}>
                      <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700 }}>{job.titulo}</h3>
                      <p style={{ margin: "0 0 8px", fontSize: 13, color: "#4F46E5", fontWeight: 600 }}>{job.empresa}</p>
                      <div style={{ display: "flex", gap: 6 }}>
                        <a href={job.url} target="_blank" rel="noopener noreferrer"
                          style={{ padding: "7px 14px", background: "#4F46E5", color: "#fff", textDecoration: "none", fontSize: 12, fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>
                          Ver →
                        </a>
                        <button onClick={() => toggleFavorito(job.id)}
                          style={{ padding: "7px 12px", background: "#fff", border: "2px solid #E5E7EB", fontSize: 12, cursor: "pointer", fontFamily: "'Poppins', sans-serif", color: "#DC2626" }}>
                          Quitar ★
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB KANBAN */}
          {tab === "kanban" && (
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📋 Seguimiento de Aplicaciones</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                {COLUMNAS.map(col => (
                  <div key={col.key} style={{ background: "#fff", border: `2px solid ${col.color}`, padding: "14px" }}>
                    <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: col.color }}>{col.label} <span style={{ fontWeight: 400, color: "#9CA3AF" }}>({(kanban[col.key] || []).length})</span></h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {(kanban[col.key] || []).map(v => (
                        <div key={v.id} style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", padding: "10px 12px" }}>
                          <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600 }}>{v.titulo}</p>
                          <p style={{ margin: "0 0 8px", fontSize: 11, color: "#6B7280" }}>{v.empresa}</p>
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {COLUMNAS.filter(c => c.key !== col.key).map(c => (
                              <button key={c.key} onClick={() => moverKanban(v, c.key)}
                                style={{ padding: "3px 8px", fontSize: 10, background: "#fff", border: `1px solid ${c.color}`, color: c.color, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                                → {c.label.split(" ")[1]}
                              </button>
                            ))}
                            <button onClick={() => moverKanban(v, null)}
                              style={{ padding: "3px 8px", fontSize: 10, background: "#fff", border: "1px solid #E5E7EB", color: "#9CA3AF", cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                              Quitar
                            </button>
                          </div>
                        </div>
                      ))}
                      {(kanban[col.key] || []).length === 0 && (
                        <p style={{ fontSize: 12, color: "#D1D5DB", textAlign: "center", padding: "20px 0" }}>Vacío</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal carta */}
      {cartaModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 20 }}>
          <div style={{ background: "#fff", maxWidth: 600, width: "100%", padding: "28px", maxHeight: "80vh", overflowY: "auto", position: "relative" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>✉️ Carta de Presentación</h3>
            <pre style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "'Poppins', sans-serif", color: "#374151" }}>{cartaModal}</pre>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button onClick={() => { navigator.clipboard.writeText(cartaModal); }}
                style={{ padding: "9px 18px", background: "#4F46E5", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                Copiar
              </button>
              <button onClick={() => setCartaModal(null)}
                style={{ padding: "9px 18px", background: "#fff", border: "2px solid #E5E7EB", fontSize: 13, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
