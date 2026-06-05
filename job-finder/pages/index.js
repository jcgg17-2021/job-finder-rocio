import { useState, useEffect } from "react";
import Head from "next/head";

const COLUMNAS = [
  { key: "interesante", label: "⭐ Interesante", color: "#4F46E5" },
  { key: "aplicada", label: "📤 Aplicada", color: "#0891B2" },
  { key: "proceso", label: "⚙️ En Proceso", color: "#D97706" },
  { key: "rechazada", label: "❌ Rechazada", color: "#DC2626" },
];

export default function Home() {
  const [tab, setTab] = useState("buscar");
  const [modoTrabajo, setModoTrabajo] = useState("remoto");
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCarta, setLoadingCarta] = useState(null);
  const [error, setError] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [kanban, setKanban] = useState({ interesante: [], aplicada: [], proceso: [], rechazada: [] });
  const [cartas, setCartas] = useState({});
  const [cartaModal, setCartaModal] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/search").then(r => r.json()).then(d => {
      setFavoritos(d.favoritos || []);
      setKanban(d.kanban || { interesante: [], aplicada: [], proceso: [], rechazada: [] });
    });
  }, []);

  const search = async (tipo) => {
    setLoading(true);
    setVacantes([]);
    setError(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "search", data: { tipo } })
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

  const totalKanban = Object.values(kanban).reduce((a, b) => a + b.length, 0);

  const modoColor = { remoto: "#4F46E5", presencial: "#059669", casa: "#D97706" };

  const ModoBtn = ({ modo, emoji, label }) => (
    <button onClick={() => { setModoTrabajo(modo); setVacantes([]); if (modo === "casa") search("casa"); }}
      style={{ padding: "8px 18px", fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer", background: modoTrabajo === modo ? modoColor[modo] : "#fff", color: modoTrabajo === modo ? "#fff" : "#374151", border: `2px solid ${modoTrabajo === modo ? modoColor[modo] : "#E5E7EB"}`, transition: "all 0.15s" }}>
      {emoji} {label}
    </button>
  );

  const NavBtn = ({ t, label }) => (
    <button onClick={() => setTab(t)} style={{ padding: "8px 18px", fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", background: tab === t ? "#4F46E5" : "transparent", color: tab === t ? "#fff" : "#6B7280", border: tab === t ? "2px solid #4F46E5" : "2px solid transparent", transition: "all 0.15s" }}>
      {label}
    </button>
  );

  const modalidadColor = { "Remoto": "#F0FDF4", "Home Office": "#EFF6FF", "Presencial": "#FEF3C7" };
  const modalidadText = { "Remoto": "#16A34A", "Home Office": "#1D4ED8", "Presencial": "#D97706" };

  return (
    <>
      <Head>
        <title>Job Finder · Rocío Sánchez</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: "100vh", background: "#F7F8FC" }}>

        {/* Header */}
        <div style={{ background: "#fff", borderBottom: "2px solid #E8EAED", padding: "14px 28px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 38, height: 38, background: "#4F46E5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔎</div>
              <div style={{ flex: 1 }}>
                <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Job Finder · Rocío Sánchez</h1>
                <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>Paralegal Bilingüe · Legal Assistant · English Teacher · Intérprete · Zona Oriente / Remoto</p>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <NavBtn t="buscar" label="🔍 Buscar" />
                <NavBtn t="favoritos" label={`⭐ Favoritos${favoritos.length > 0 ? ` (${favoritos.length})` : ""}`} />
                <NavBtn t="kanban" label={`📋 Seguimiento${totalKanban > 0 ? ` (${totalKanban})` : ""}`} />
              </div>
            </div>

            {tab === "buscar" && (
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Modalidad:</span>
                <ModoBtn modo="remoto" emoji="🌎" label="Remoto / Home Office" />
                <ModoBtn modo="presencial" emoji="📍" label="Presencial Zona Oriente" />
                <ModoBtn modo="casa" emoji="🏠" label="Cerca de Casa" />
              </div>
            )}
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "22px 20px" }}>

          {/* TAB BUSCAR */}
          {tab === "buscar" && (
            <div>
              {modoTrabajo !== "casa" && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
                    {modoTrabajo === "remoto" ? "Buscar vacantes remotas" : "Buscar vacantes zona oriente"}
                  </p>
                  <button onClick={() => search(modoTrabajo)} disabled={loading}
                    style={{ padding: "12px 28px", background: modoColor[modoTrabajo], color: "#fff", border: "none", fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                    {loading ? "⏳ Buscando..." : modoTrabajo === "remoto" ? "🌎 Ver todas las plataformas remotas" : "📍 Ver empleos zona oriente"}
                  </button>
                </div>
              )}

              {modoTrabajo === "casa" && !loading && vacantes.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🏠</div>
                  <p style={{ fontSize: 14, color: "#6B7280" }}>Cargando empleos cerca de casa...</p>
                </div>
              )}

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
                  <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>
                    <strong style={{ color: "#1a1a2e" }}>{vacantes.length} plataformas</strong> · ordenadas por match con tu perfil
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 14 }}>
                    {vacantes.map(job => (
                      <div key={job.id} style={{ background: "#fff", border: "2px solid #E5E7EB", padding: "16px 18px", transition: "border-color 0.15s", display: "flex", flexDirection: "column", gap: 10 }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "#4F46E5"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "#E5E7EB"}>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 10, padding: "2px 7px", background: "#EEF2FF", color: "#4F46E5", fontWeight: 700 }}>⚡ {job.match}% match</span>
                            <span style={{ fontSize: 10, padding: "2px 7px", background: modalidadColor[job.modalidad] || "#F3F4F6", color: modalidadText[job.modalidad] || "#374151", fontWeight: 600 }}>{job.modalidad}</span>
                          </div>
                          <button onClick={() => toggleFavorito(job.id)}
                            style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: favoritos.includes(job.id) ? "#F59E0B" : "#D1D5DB", lineHeight: 1 }}>★</button>
                        </div>

                        <div>
                          <h3 style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>{job.titulo}</h3>
                          <p style={{ margin: "0 0 2px", fontSize: 12, color: "#4F46E5", fontWeight: 600 }}>{job.empresa}</p>
                          <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF" }}>📍 {job.ubicacion} · {job.plataforma}</p>
                        </div>

                        <p style={{ margin: 0, fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{job.descripcion}</p>

                        {job.salario !== "Ver en plataforma" && job.salario !== "Por proyecto" && (
                          <p style={{ margin: 0, fontSize: 12, color: "#059669", fontWeight: 700 }}>💰 {job.salario}</p>
                        )}
                        {job.salario === "Por proyecto" && (
                          <p style={{ margin: 0, fontSize: 12, color: "#6B7280", fontWeight: 600 }}>💼 {job.salario}</p>
                        )}

                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: "auto", paddingTop: 4 }}>
                          <a href={job.url} target="_blank" rel="noopener noreferrer"
                            style={{ padding: "7px 14px", background: "#4F46E5", color: "#fff", textDecoration: "none", fontSize: 11, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
                            Ver vacantes →
                          </a>
                          <button onClick={() => moverKanban(job, "interesante")}
                            style={{ padding: "7px 10px", background: "#fff", border: "2px solid #E5E7EB", fontSize: 11, cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                            + Seguimiento
                          </button>
                          <button onClick={() => generarCarta(job)} disabled={loadingCarta === job.id}
                            style={{ padding: "7px 10px", background: "#fff", border: "2px solid #E5E7EB", fontSize: 11, cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                            {loadingCarta === job.id ? "⏳" : "✉️ Carta"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!loading && !error && vacantes.length === 0 && modoTrabajo !== "casa" && (
                <div style={{ textAlign: "center", padding: "70px 0", color: "#9CA3AF" }}>
                  <div style={{ fontSize: 44, marginBottom: 14 }}>
                    {modoTrabajo === "remoto" ? "🌎" : "📍"}
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "#6B7280" }}>
                    {modoTrabajo === "remoto" ? "Da clic en el botón para ver todas las plataformas remotas" : "Da clic para ver empleos en zona oriente"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB FAVORITOS */}
          {tab === "favoritos" && (
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>⭐ Plataformas Favoritas</h2>
              {favoritos.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#9CA3AF" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
                  <p style={{ fontSize: 14 }}>No tienes favoritas aún. Busca y marca con ★</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                  {vacantes.filter(v => favoritos.includes(v.id)).map(job => (
                    <div key={job.id} style={{ background: "#fff", border: "2px solid #FDE68A", padding: "16px 18px" }}>
                      <h3 style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 700 }}>{job.titulo}</h3>
                      <p style={{ margin: "0 0 10px", fontSize: 12, color: "#4F46E5", fontWeight: 600 }}>{job.empresa}</p>
                      <div style={{ display: "flex", gap: 6 }}>
                        <a href={job.url} target="_blank" rel="noopener noreferrer"
                          style={{ padding: "6px 14px", background: "#4F46E5", color: "#fff", textDecoration: "none", fontSize: 11, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>Ver →</a>
                        <button onClick={() => toggleFavorito(job.id)}
                          style={{ padding: "6px 10px", background: "#fff", border: "2px solid #FCA5A5", fontSize: 11, cursor: "pointer", fontFamily: "'Poppins', sans-serif", color: "#DC2626", fontWeight: 600 }}>Quitar ★</button>
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
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📋 Seguimiento de Aplicaciones</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {COLUMNAS.map(col => (
                  <div key={col.key} style={{ background: "#fff", border: `2px solid ${col.color}`, padding: "14px" }}>
                    <h3 style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 700, color: col.color }}>
                      {col.label} <span style={{ fontWeight: 400, color: "#9CA3AF" }}>({(kanban[col.key] || []).length})</span>
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {(kanban[col.key] || []).map(v => (
                        <div key={v.id} style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", padding: "10px 12px" }}>
                          <p style={{ margin: "0 0 3px", fontSize: 11, fontWeight: 700 }}>{v.titulo}</p>
                          <p style={{ margin: "0 0 8px", fontSize: 10, color: "#6B7280" }}>{v.empresa}</p>
                          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                            {COLUMNAS.filter(c => c.key !== col.key).map(c => (
                              <button key={c.key} onClick={() => moverKanban(v, c.key)}
                                style={{ padding: "2px 6px", fontSize: 9, background: "#fff", border: `1px solid ${c.color}`, color: c.color, cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
                                {c.label.split(" ")[1]}
                              </button>
                            ))}
                            <button onClick={() => moverKanban(v, null)}
                              style={{ padding: "2px 6px", fontSize: 9, background: "#fff", border: "1px solid #E5E7EB", color: "#9CA3AF", cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                      {(kanban[col.key] || []).length === 0 && (
                        <p style={{ fontSize: 11, color: "#E5E7EB", textAlign: "center", padding: "16px 0" }}>Vacío</p>
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
          <div style={{ background: "#fff", maxWidth: 580, width: "100%", padding: "24px", maxHeight: "80vh", overflowY: "auto" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>✉️ Carta de Presentación</h3>
            <pre style={{ fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "'Poppins', sans-serif", color: "#374151", margin: "0 0 16px" }}>{cartaModal}</pre>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { navigator.clipboard.writeText(cartaModal); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                style={{ padding: "9px 18px", background: copied ? "#059669" : "#4F46E5", color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif", transition: "background 0.2s" }}>
                {copied ? "✓ Copiado" : "Copiar"}
              </button>
              <button onClick={() => setCartaModal(null)}
                style={{ padding: "9px 18px", background: "#fff", border: "2px solid #E5E7EB", fontSize: 12, cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
