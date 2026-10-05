import { useState, useEffect } from "react";
import Head from "next/head";

const EMPRESAS = [
  { key: "todos", label: "🏢 Todas" },
  { key: "Google Jobs", label: "🔍 Google Jobs" },
  { key: "Indeed", label: "🟦 Indeed" },
  { key: "OCC Mundial", label: "🟠 OCC" },
  { key: "Computrabajo", label: "🟡 Computrabajo" },
  { key: "LinkedIn", label: "🔵 LinkedIn" },
  { key: "ZipRecruiter", label: "⚡ ZipRecruiter" },
  { key: "Glassdoor", label: "🟢 Glassdoor" },
  { key: "RemoteOK", label: "🌐 RemoteOK" },
  { key: "Upwork", label: "🟤 Upwork" },
  { key: "Workana", label: "🟣 Workana" },
  { key: "Hireline", label: "💎 Hireline" },
  { key: "WeWorkRemotely", label: "🏠 WeWorkRemotely" },
];

const TIPOS = [
  { key: "todos", label: "🔍 Todos" },
  { key: "paralegal", label: "⚖️ Paralegal / Legal" },
  { key: "asistente", label: "📋 Asistente Bilingüe" },
  { key: "teacher", label: "👩‍🏫 English Teacher" },
  { key: "interprete", label: "🗣️ Intérprete / Traductora" },
  { key: "atencion", label: "📞 Atención a Clientes" },
];

const SUBTYPES = [
  { key: "", label: "🔍 Todos los puestos", tipo: "todos" },
  { key: "Paralegal Inmigración", label: "Paralegal Inmigración", tipo: "paralegal" },
  { key: "Asistente Paralegal Inmigración", label: "Asistente Paralegal Inmigración", tipo: "paralegal" },
  { key: "Immigration Paralegal", label: "Immigration Paralegal", tipo: "paralegal" },
  { key: "Immigration Paralegal Assistant", label: "Immigration Paralegal Assistant", tipo: "paralegal" },
  { key: "Paralegal Propiedad Intelectual", label: "Paralegal Propiedad Intelectual", tipo: "paralegal" },
  { key: "Paralegal Intellectual Property", label: "Paralegal Intellectual Property", tipo: "paralegal" },
  { key: "Asistente Paralegal Propiedad Intelectual", label: "Asistente Paralegal P. Intelectual", tipo: "paralegal" },
  { key: "Paralegal Assistant Intellectual Property", label: "Paralegal Assistant IP", tipo: "paralegal" },
  { key: "Asistente Paralegal Bilingüe", label: "Asistente Paralegal Bilingüe", tipo: "paralegal" },
  { key: "Bilingual Paralegal Assistant", label: "Bilingual Paralegal Assistant", tipo: "paralegal" },
  { key: "Bilingual Legal Assistant", label: "Bilingual Legal Assistant", tipo: "paralegal" },
  { key: "Immigration Paralegal Bilingual", label: "Immigration Paralegal Bilingual", tipo: "paralegal" },
  { key: "HR Assistant Bilingual", label: "HR Assistant Bilingual", tipo: "asistente" },
];



const MODALIDADES = [
  { key: "todos", label: "🌐 Todas" },
  { key: "remoto", label: "🌎 Remoto / Home Office" },
  { key: "presencial", label: "📍 Presencial Zona Oriente" },
];

export default function Home() {
  const [tab, setTab] = useState("buscar");
  const [tipo, setTipo] = useState("todos");
  const [modalidad, setModalidad] = useState("todos");
  const [empresa, setEmpresa] = useState("todos");
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [tipoCambio, setTipoCambio] = useState(null);
  const [buscado, setBuscado] = useState(false);
  const [subtype, setSubtype] = useState("");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    fetch("/api/search").then(r => r.json()).then(d => {
      setFavoritos(d.favoritos || []);
    });
  }, []);

  const search = async (t, m) => {
    setLoading(true);
    setVacantes([]);
    setError(null);
    setBuscado(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "search", data: { tipo: t !== undefined ? t : tipo, modalidad: m !== undefined ? m : modalidad } })
      });
      const d = await res.json();
      setVacantes(d.vacantes || []);
      setTipoCambio(d.tipoCambio);
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

  const modalidadColor = { remoto: "#16A34A", presencial: "#D97706" };
  const modalidadBg = { remoto: "#F0FDF4", presencial: "#FEF3C7" };
  const vacantesFiltradas = vacantes
    .filter(v => empresa === "todos" || v.empresa === empresa || v.plataforma === empresa)


    .filter(v => {
      if (!keyword.trim()) return true;
      const kw = keyword.toLowerCase();
      return v.titulo.toLowerCase().includes(kw) || v.descripcion.toLowerCase().includes(kw) || v.ubicacion.toLowerCase().includes(kw);
    });

  const FilterBtn = ({ active, onClick, children, activeColor = "#7C3AED" }) => (
    <button onClick={onClick} style={{
      padding: "7px 14px", fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600,
      cursor: "pointer", transition: "all 0.15s",
      background: active ? activeColor : "#fff",
      color: active ? "#fff" : "#374151",
      border: `2px solid ${active ? activeColor : "#E5E7EB"}`,
    }}>{children}</button>
  );

  return (
    <>
      <Head>
        <title>Job Finder · Rocío Sánchez</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: "100vh", background: "#F7F8FC" }}>

        {/* Mensaje de amor */}
        <div style={{ background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)", padding: "18px 28px", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#fff", lineHeight: 1.8, maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
            💜 <em>Esto lo hice con todo el amor del mundo para ti, Rocío. Cada búsqueda, cada plataforma, cada detalle fue pensado con la esperanza de que encuentres algo que te haga feliz y que esté a la altura de todo lo que eres y de todo lo que vales. Que este pequeño esfuerzo sea el primer paso hacia algo grande para ti.</em> 💜
          </p>
        </div>

        {/* Header */}
        <div style={{ background: "#fff", borderBottom: "2px solid #E8EAED", padding: "14px 28px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔎</div>
              <div style={{ flex: 1 }}>
                <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Job Finder · Rocío Sánchez</h1>
                <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>Paralegal · Asistente Bilingüe · English Teacher · Intérprete · Atención a Clientes</p>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => setTab("buscar")} style={{ padding: "8px 16px", fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", background: tab === "buscar" ? "#7C3AED" : "transparent", color: tab === "buscar" ? "#fff" : "#6B7280", border: tab === "buscar" ? "2px solid #7C3AED" : "2px solid transparent" }}>🔍 Buscar</button>
                <button onClick={() => setTab("favoritos")} style={{ padding: "8px 16px", fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", background: tab === "favoritos" ? "#7C3AED" : "transparent", color: tab === "favoritos" ? "#fff" : "#6B7280", border: tab === "favoritos" ? "2px solid #7C3AED" : "2px solid transparent" }}>⭐ Favoritos {favoritos.length > 0 ? `(${favoritos.length})` : ""}</button>
              </div>
            </div>

            {tab === "buscar" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", minWidth: 80 }}>Puesto:</span>
                  {TIPOS.map(t => (
                    <FilterBtn key={t.key} active={tipo === t.key} onClick={() => setTipo(t.key)}>{t.label}</FilterBtn>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", minWidth: 80 }}>Puesto:</span>
                  {SUBTYPES.map(s => (
                    <FilterBtn key={s.key} active={subtype === s.key} onClick={async () => {
                      setSubtype(s.key);
                      setKeyword(s.key);
                      const t = (s.tipo && s.tipo !== "todos") ? s.tipo : "todos";
                      setTipo(t);
                      setBuscado(true);
                      setLoading(true);
                      setVacantes([]);
                      setError(null);
                      try {
                        const res = await fetch("/api/search", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ action: "search", data: { tipo: t, modalidad } })
                        });
                        const d = await res.json();
                        setVacantes(d.vacantes || []);
                        setTipoCambio(d.tipoCambio);
                      } catch { setError("Error al buscar."); }
                      finally { setLoading(false); }
                    }} activeColor="#9D174D">{s.label}</FilterBtn>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", minWidth: 80 }}>Modalidad:</span>
                  {MODALIDADES.map(m => (
                    <FilterBtn key={m.key} active={modalidad === m.key} onClick={() => setModalidad(m.key)} activeColor={m.key === "presencial" ? "#D97706" : "#7C3AED"}>{m.label}</FilterBtn>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", minWidth: 80 }}>Empresa:</span>
                  {EMPRESAS.map(e => (
                    <FilterBtn key={e.key} active={empresa === e.key} onClick={() => setEmpresa(e.key)} activeColor="#5B21B6">{e.label}</FilterBtn>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    placeholder="🔤 Filtrar por palabra clave... ej: asistente legal bilingüe"
                    style={{ flex: 1, padding: "10px 14px", border: "2px solid #E5E7EB", fontFamily: "'Poppins', sans-serif", fontSize: 13, outline: "none", background: "#fff", maxWidth: 420 }}
                  />
                  {keyword && (
                    <button onClick={() => setKeyword("")} style={{ padding: "10px 14px", background: "#F3F4F6", border: "2px solid #E5E7EB", fontFamily: "'Poppins', sans-serif", fontSize: 12, cursor: "pointer", color: "#6B7280", fontWeight: 600 }}>✕ Limpiar</button>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button onClick={() => search()} disabled={loading} style={{ padding: "10px 28px", background: "#7C3AED", color: "#fff", border: "none", fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                    {loading ? "⏳ Buscando..." : "Buscar →"}
                  </button>
                  {tipoCambio && (
                    <span style={{ fontSize: 11, color: "#059669", fontWeight: 700, background: "#F0FDF4", padding: "4px 10px", border: "1px solid #BBF7D0" }}>
                      💵 $1 USD = ${tipoCambio.toFixed(2)} MXN hoy
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "22px 20px" }}>

          {tab === "buscar" && (
            <div>
              {loading && (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div style={{ fontSize: 30, display: "inline-block", animation: "spin 1s linear infinite" }}>⚙️</div>
                  <p style={{ color: "#6B7280", fontSize: 14, marginTop: 12 }}>Buscando vacantes...</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </div>
              )}

              {error && <div style={{ background: "#FEF2F2", border: "2px solid #FCA5A5", padding: "14px 18px", color: "#B91C1C", fontSize: 13 }}>⚠️ {error}</div>}

              {!loading && vacantesFiltradas.length > 0 && (
                <div>
                  <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>
                    <strong style={{ color: "#1a1a2e" }}>{vacantesFiltradas.length} resultados</strong> encontrados
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 14 }}>
                    {vacantesFiltradas.map(job => (
                      <div key={job.id} style={{ background: "#fff", border: "2px solid #E5E7EB", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10, transition: "border-color 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "#7C3AED"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "#E5E7EB"}>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 10, padding: "2px 7px", background: modalidadBg[job.modalidad] || "#F3F4F6", color: modalidadColor[job.modalidad] || "#374151", fontWeight: 700 }}>
                              {job.modalidad === "remoto" ? "🌎 Remoto" : "📍 Presencial"}
                            </span>
                            <span style={{ fontSize: 10, padding: "2px 7px", background: "#F3F4F6", color: "#6B7280", fontWeight: 500 }}>{job.plataforma}</span>
                          </div>
                          <button onClick={() => toggleFavorito(job.id)}
                            style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: favoritos.includes(job.id) ? "#F59E0B" : "#D1D5DB", lineHeight: 1, padding: 0 }}>★</button>
                        </div>

                        <div>
                          <h3 style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>{job.titulo}</h3>
                          <p style={{ margin: "0 0 2px", fontSize: 12, color: "#7C3AED", fontWeight: 600 }}>{job.empresa}</p>
                          <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF" }}>📍 {job.ubicacion}</p>
                        </div>

                        <p style={{ margin: 0, fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{job.descripcion}</p>

                        {job.salarioMXN && job.salarioMXN !== "Ver en plataforma" && job.salarioMXN !== "Por proyecto" && (
                          <p style={{ margin: 0, fontSize: 12, color: "#059669", fontWeight: 700 }}>💰 {job.salarioMXN}</p>
                        )}
                        {job.salarioMXN === "Por proyecto" && (
                          <p style={{ margin: 0, fontSize: 12, color: "#6B7280", fontWeight: 600 }}>💼 Por proyecto</p>
                        )}

                        <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "8px 16px", background: "#7C3AED", color: "#fff", textDecoration: "none", fontSize: 11, fontWeight: 700, fontFamily: "'Poppins', sans-serif", marginTop: "auto" }}>
                          Ver vacantes →
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!loading && !error && buscado && vacantesFiltradas.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#9CA3AF" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                  <p style={{ fontSize: 14, color: "#6B7280" }}>No hay vacantes para esa combinación. Prueba con otros filtros.</p>
                </div>
              )}

              {!loading && !buscado && (
                <div style={{ textAlign: "center", padding: "70px 0", color: "#9CA3AF" }}>
                  <div style={{ fontSize: 44, marginBottom: 14 }}>🔎</div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "#6B7280" }}>Selecciona el tipo de puesto y modalidad, luego da clic en Buscar</p>
                  <p style={{ fontSize: 12 }}>LinkedIn · Indeed · OCC · Computrabajo · ZipRecruiter · Glassdoor · RemoteOK · Upwork · Workana · Google Jobs</p>
                </div>
              )}
            </div>
          )}

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
                  {vacantes.filter(v => favoritos.includes(v.id)).length > 0
                    ? vacantes.filter(v => favoritos.includes(v.id)).map(job => (
                      <div key={job.id} style={{ background: "#fff", border: "2px solid #FDE68A", padding: "16px 18px" }}>
                        <h3 style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 700 }}>{job.titulo}</h3>
                        <p style={{ margin: "0 0 4px", fontSize: 12, color: "#7C3AED", fontWeight: 600 }}>{job.empresa}</p>
                        <p style={{ margin: "0 0 10px", fontSize: 11, color: "#9CA3AF" }}>📍 {job.ubicacion}</p>
                        <div style={{ display: "flex", gap: 6 }}>
                          <a href={job.url} target="_blank" rel="noopener noreferrer"
                            style={{ padding: "6px 14px", background: "#7C3AED", color: "#fff", textDecoration: "none", fontSize: 11, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>Ver →</a>
                          <button onClick={() => toggleFavorito(job.id)}
                            style={{ padding: "6px 10px", background: "#fff", border: "2px solid #FCA5A5", fontSize: 11, cursor: "pointer", fontFamily: "'Poppins', sans-serif", color: "#DC2626", fontWeight: 600 }}>Quitar ★</button>
                        </div>
                      </div>
                    ))
                    : (
                      <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px 0", color: "#9CA3AF" }}>
                        <p style={{ fontSize: 13 }}>Haz una búsqueda primero para ver tus favoritas aquí.</p>
                      </div>
                    )
                  }
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
