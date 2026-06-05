import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const getUSDtoMXN = async () => {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await res.json();
    return data.rates?.MXN || 17.5;
  } catch { return 17.5; }
};

const convertirSalario = (salario, tc) => {
  if (!salario || salario === "Ver en plataforma" || salario === "Por proyecto") return salario;
  const hrMatch = salario.match(/\$([0-9,]+)-([0-9,]+)\/hr/);
  if (hrMatch) {
    const min = Math.round(parseFloat(hrMatch[1].replace(",", "")) * 160 * tc / 1000) * 1000;
    const max = Math.round(parseFloat(hrMatch[2].replace(",", "")) * 160 * tc / 1000) * 1000;
    return `$${min.toLocaleString("es-MX")} - $${max.toLocaleString("es-MX")} MXN/mes`;
  }
  const yrMatch = salario.match(/\$([0-9,]+)-([0-9,]+)\/año/);
  if (yrMatch) {
    const min = Math.round(parseFloat(yrMatch[1].replace(",", "")) * tc / 12 / 1000) * 1000;
    const max = Math.round(parseFloat(yrMatch[2].replace(",", "")) * tc / 12 / 1000) * 1000;
    return `$${min.toLocaleString("es-MX")} - $${max.toLocaleString("es-MX")} MXN/mes`;
  }
  return salario;
};

// Generador de URLs por plataforma
const gj = (q, zona) => `https://www.google.com/search?q=${encodeURIComponent(q + " " + zona)}&ibp=htl;jobs`;
const gjR = (q) => `https://www.google.com/search?q=${encodeURIComponent(q + " remoto")}&ibp=htl;jobs&htichips=employment_type:TELECOMMUTE,date_posted:week`;
const indeed = (q, zona) => `https://www.indeed.com/jobs?q=${encodeURIComponent(q)}&l=${encodeURIComponent(zona + ", Mexico")}&sort=date`;
const indeedR = (q) => `https://www.indeed.com/jobs?q=${encodeURIComponent(q)}&sc=0kf%3Aattr(DSQF7)%3B&sort=date`;
const occ = (q, zona) => `https://www.occ.com.mx/empleos/de-${encodeURIComponent(q.replace(/ /g,"-"))}/?location=${encodeURIComponent(zona)}`;
const occR = (q) => `https://www.occ.com.mx/empleos/de-${encodeURIComponent(q.replace(/ /g,"-"))}/?modality=3`;
const ct = (q, zona) => `https://mx.computrabajo.com/trabajo-de-${encodeURIComponent(q.replace(/ /g,"-"))}?l=${encodeURIComponent(zona + ", Mexico")}`;
const ctR = (q) => `https://mx.computrabajo.com/trabajo-de-${encodeURIComponent(q.replace(/ /g,"-"))}?jt=4`;
const li = (q, zona) => `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(q)}&location=${encodeURIComponent(zona + ", Mexico")}&f_TPR=r604800`;
const liR = (q) => `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(q)}&f_WT=2&sortBy=DD`;

const ZONAS = [
  { key: "iztapalapa", label: "Iztapalapa, CDMX", short: "Iztapalapa" },
  { key: "neza", label: "Nezahualcóyotl, EDOMEX", short: "Nezahualcóyotl" },
  { key: "reyes", label: "Los Reyes La Paz, EDOMEX", short: "Los Reyes La Paz" },
  { key: "texcoco", label: "Texcoco, EDOMEX", short: "Texcoco" },
  { key: "chimal", label: "Chimalhuacán, EDOMEX", short: "Chimalhuacán" },
];

const PUESTOS = [
  { tipo: "paralegal", queries: { gj: "paralegal bilingue", indeed: "paralegal bilingue", occ: "paralegal", ct: "paralegal-bilingue", li: "paralegal bilingual" }, label: "Paralegal" },
  { tipo: "asistente", queries: { gj: "asistente bilingue", indeed: "asistente bilingue ingles", occ: "asistente-bilingue", ct: "asistente-bilingue", li: "asistente bilingual" }, label: "Asistente Bilingüe" },
  { tipo: "teacher", queries: { gj: "maestra ingles", indeed: "maestra ingles", occ: "maestro-ingles", ct: "instructor-ingles", li: "english teacher" }, label: "English Teacher" },
  { tipo: "interprete", queries: { gj: "interprete bilingue", indeed: "interprete bilingue", occ: "interprete-bilingue", ct: "interprete-bilingue", li: "interpreter bilingual" }, label: "Intérprete" },
  { tipo: "atencion", queries: { gj: "ejecutivo bilingue", indeed: "ejecutivo bilingue ingles", occ: "atencion-a-clientes-bilingue", ct: "ejecutivo-bilingue", li: "bilingual customer service" }, label: "Atención Clientes" },
];

// Generar todas las entradas presenciales
const PRESENCIALES = [];
let pid = 1000;
PUESTOS.forEach(puesto => {
  ZONAS.forEach(zona => {
    // Google Jobs
    PRESENCIALES.push({ id: `p${pid++}`, tipo: puesto.tipo, modalidad: "presencial", titulo: `${puesto.label} · ${zona.short} · Google Jobs`, empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: `Presencial · ${zona.label}`, descripcion: `Búsqueda directa en Google Jobs para ${puesto.label} en ${zona.short}. Verifica la ubicación exacta de cada vacante antes de postularte.`, url: gj(puesto.queries.gj, zona.short), salario: "Ver en plataforma" });
    // Indeed
    PRESENCIALES.push({ id: `p${pid++}`, tipo: puesto.tipo, modalidad: "presencial", titulo: `${puesto.label} · ${zona.short} · Indeed`, empresa: "Indeed", plataforma: "Indeed", ubicacion: `Presencial · ${zona.label}`, descripcion: `Indeed filtrando por ${zona.short}. Ordena por fecha para ver las más recientes. Verifica ubicación antes de postularte.`, url: indeed(puesto.queries.indeed, zona.short), salario: "Ver en plataforma" });
    // OCC
    PRESENCIALES.push({ id: `p${pid++}`, tipo: puesto.tipo, modalidad: "presencial", titulo: `${puesto.label} · ${zona.short} · OCC`, empresa: "OCC Mundial", plataforma: "OCC", ubicacion: `Presencial · ${zona.label}`, descripcion: `OCC filtrando por ${zona.short}. Confirma que la ubicación sea la correcta antes de aplicar.`, url: occ(puesto.queries.occ, zona.short), salario: "Ver en plataforma" });
    // Computrabajo
    PRESENCIALES.push({ id: `p${pid++}`, tipo: puesto.tipo, modalidad: "presencial", titulo: `${puesto.label} · ${zona.short} · Computrabajo`, empresa: "Computrabajo", plataforma: "Computrabajo", ubicacion: `Presencial · ${zona.label}`, descripcion: `Computrabajo filtrando por ${zona.short}. Verifica ubicación exacta antes de postularte.`, url: ct(puesto.queries.ct, zona.short), salario: "Ver en plataforma" });
    // LinkedIn
    PRESENCIALES.push({ id: `p${pid++}`, tipo: puesto.tipo, modalidad: "presencial", titulo: `${puesto.label} · ${zona.short} · LinkedIn`, empresa: "LinkedIn", plataforma: "LinkedIn", ubicacion: `Presencial · ${zona.label}`, descripcion: `LinkedIn filtrando por ${zona.short}, publicadas esta semana. Verifica ubicación antes de postularte.`, url: li(puesto.queries.li, zona.short), salario: "Ver en plataforma" });
  });
});

const VACANTES_REMOTO = [
  // PARALEGAL REMOTO
  { id: "r1", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal Inmigración Bilingüe · LinkedIn", empresa: "LinkedIn", plataforma: "LinkedIn", ubicacion: "Remoto · Worldwide", descripcion: "Firmas EE.UU. buscan paralegal bilingüe. Filtra Remote y Most Recent para ver las más nuevas.", url: liR("paralegal immigration bilingual spanish"), salario: "$45,000-65,000/año" },
  { id: "r2", tipo: "paralegal", modalidad: "remoto", titulo: "Legal Assistant Immigration Remote · Indeed", empresa: "Indeed", plataforma: "Indeed", ubicacion: "Remoto · USA", descripcion: "Filtro Remote activo. Ordena Last 7 days para ver las más recientes.", url: indeedR("legal assistant immigration bilingual spanish"), salario: "$18-28/hr" },
  { id: "r3", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal Removal Defense / Asylum · Indeed", empresa: "Indeed", plataforma: "Indeed", ubicacion: "Remoto · USA", descripcion: "Búsqueda específica removal defense y asylum con filtro remoto.", url: indeedR("paralegal removal defense asylum bilingual"), salario: "$20-30/hr" },
  { id: "r4", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal USCIS Bilingual · ZipRecruiter", empresa: "ZipRecruiter", plataforma: "ZipRecruiter", ubicacion: "Remoto · USA", descripcion: "Miles de firmas de inmigración EE.UU. buscando paralegal bilingüe remoto.", url: "https://www.ziprecruiter.com/Jobs/Immigration-Paralegal-Bilingual-Spanish-Remote", salario: "$45,000-65,000/año" },
  { id: "r5", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal IP Propiedad Intelectual · LinkedIn", empresa: "LinkedIn", plataforma: "LinkedIn", ubicacion: "Remoto · Worldwide", descripcion: "Firmas internacionales de IP buscan paralegal bilingüe con experiencia en patentes.", url: liR("paralegal intellectual property bilingual spanish"), salario: "$50,000-70,000/año" },
  { id: "r6", tipo: "paralegal", modalidad: "remoto", titulo: "Patent Paralegal Bilingual · Indeed", empresa: "Indeed", plataforma: "Indeed", ubicacion: "Remoto · USA / Worldwide", descripcion: "Paralegal en propiedad intelectual, patentes y marcas. Filtro Remote activo.", url: indeedR("IP paralegal intellectual property bilingual"), salario: "$50,000-70,000/año" },
  { id: "r7", tipo: "paralegal", modalidad: "remoto", titulo: "Legal Jobs Remote · RemoteOK", empresa: "RemoteOK", plataforma: "RemoteOK", ubicacion: "Remoto · Worldwide", descripcion: "Portal 100% remoto. Sección legal actualizada diariamente con vacantes verificadas.", url: "https://remoteok.com/remote-legal-jobs", salario: "Ver en plataforma" },
  { id: "r8", tipo: "paralegal", modalidad: "remoto", titulo: "Legal Positions · WeWorkRemotely", empresa: "WeWorkRemotely", plataforma: "WeWorkRemotely", ubicacion: "Remoto · Worldwide", descripcion: "Bolsa remota top. Sección Legal con vacantes internacionales verificadas.", url: "https://weworkremotely.com/remote-jobs/search?term=paralegal+bilingual+legal", salario: "Ver en plataforma" },
  { id: "r9", tipo: "paralegal", modalidad: "remoto", titulo: "Legal Paralegal Freelance · Upwork", empresa: "Upwork", plataforma: "Upwork", ubicacion: "Remoto · Worldwide", descripcion: "Plataforma freelance líder. Proyectos immigration law y IP para clientes EE.UU.", url: "https://www.upwork.com/search/jobs/?q=paralegal+immigration+bilingual+spanish&sort=recency", salario: "$25-50/hr" },
  { id: "r10", tipo: "paralegal", modalidad: "remoto", titulo: "Legal Freelance LATAM · Workana", empresa: "Workana", plataforma: "Workana", ubicacion: "Remoto · LATAM", descripcion: "Mayor plataforma freelance LATAM. Proyectos legales y traducción en español e inglés.", url: "https://www.workana.com/jobs?category=legal-law", salario: "Por proyecto" },
  { id: "r11", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal Home Office · OCC", empresa: "OCC Mundial", plataforma: "OCC", ubicacion: "Remoto · México", descripcion: "Bolsa líder México. Paralegal y asistente legal en Home Office.", url: occR("paralegal"), salario: "Ver en plataforma" },
  { id: "r12", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal Teletrabajo · Computrabajo", empresa: "Computrabajo", plataforma: "Computrabajo", ubicacion: "Remoto · México / LATAM", descripcion: "Computrabajo filtrando teletrabajo para paralegal y asistente legal bilingüe.", url: ctR("paralegal-bilingue"), salario: "Ver en plataforma" },
  { id: "r13", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal Bilingüe Remote · Google Jobs", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Remoto · México / USA", descripcion: "Google agrega vacantes de todas las bolsas con filtro remoto activado.", url: gjR("paralegal bilingue"), salario: "Ver en plataforma" },
  { id: "r14", tipo: "paralegal", modalidad: "remoto", titulo: "Paralegal EE.UU. Remote · Google Jobs", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Remoto · USA", descripcion: "Vacantes de firmas de inmigración EE.UU. buscando paralegal bilingüe remoto.", url: gjR("paralegal immigration bilingual"), salario: "Ver en plataforma" },
  { id: "r15", tipo: "paralegal", modalidad: "remoto", titulo: "Propiedad Intelectual Remote · Google Jobs", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Remoto · Worldwide", descripcion: "Vacantes remotas de propiedad intelectual y patentes para perfil bilingüe.", url: gjR("paralegal propiedad intelectual"), salario: "Ver en plataforma" },

  // ASISTENTE BILINGÜE REMOTO
  { id: "r20", tipo: "asistente", modalidad: "remoto", titulo: "Virtual Assistant Bilingüe · LinkedIn", empresa: "LinkedIn", plataforma: "LinkedIn", ubicacion: "Remoto · USA / LATAM", descripcion: "Asistente virtual bilingüe para firmas y empresas EE.UU. 100% remoto desde México.", url: liR("virtual assistant bilingual spanish english"), salario: "$15-25/hr" },
  { id: "r21", tipo: "asistente", modalidad: "remoto", titulo: "Administrative Assistant Bilingüe · Indeed", empresa: "Indeed", plataforma: "Indeed", ubicacion: "Remoto · USA", descripcion: "Asistentes administrativas bilingüe para empresas EE.UU. Filtro Remote activo.", url: indeedR("administrative assistant bilingual spanish english"), salario: "$16-22/hr" },
  { id: "r22", tipo: "asistente", modalidad: "remoto", titulo: "Executive Assistant Bilingüe · Glassdoor", empresa: "Glassdoor", plataforma: "Glassdoor", ubicacion: "Remoto · USA / Worldwide", descripcion: "Asistentes ejecutivas bilingüe para directivos de empresas internacionales.", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=executive+assistant+bilingual+spanish+remote&remoteWorkType=1&sortBy=date_desc", salario: "$45,000-65,000/año" },
  { id: "r23", tipo: "asistente", modalidad: "remoto", titulo: "Operations Coordinator Bilingüe · ZipRecruiter", empresa: "ZipRecruiter", plataforma: "ZipRecruiter", ubicacion: "Remoto · USA", descripcion: "Coordinadoras de operaciones bilingüe para empresas con equipos en LATAM.", url: "https://www.ziprecruiter.com/Jobs/Operations-Coordinator-Bilingual-Spanish-Remote", salario: "$45,000-60,000/año" },
  { id: "r24", tipo: "asistente", modalidad: "remoto", titulo: "Asistente Bilingüe Home Office · OCC", empresa: "OCC Mundial", plataforma: "OCC", ubicacion: "Remoto · México", descripcion: "Bolsa líder México. Asistente bilingüe en Home Office. Solo resultados remotos.", url: occR("asistente-bilingue"), salario: "Ver en plataforma" },
  { id: "r25", tipo: "asistente", modalidad: "remoto", titulo: "Asistente Bilingüe Teletrabajo · Computrabajo", empresa: "Computrabajo", plataforma: "Computrabajo", ubicacion: "Remoto · México / LATAM", descripcion: "Asistente bilingüe en teletrabajo. Solo resultados remotos.", url: ctR("asistente-bilingue"), salario: "Ver en plataforma" },
  { id: "r26", tipo: "asistente", modalidad: "remoto", titulo: "Bilingual Coordinator · Hireline", empresa: "Hireline", plataforma: "Hireline", ubicacion: "Remoto · LATAM / Worldwide", descripcion: "Plataforma LATAM especializada en trabajo 100% remoto con empresas que pagan en USD.", url: "https://hireline.io/mx/empleos-remotos?q=bilingue+asistente", salario: "USD" },
  { id: "r27", tipo: "asistente", modalidad: "remoto", titulo: "Asistente Bilingüe Remote · Google Jobs", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Remoto · México / USA", descripcion: "Google agrega vacantes de todas las bolsas con filtro remoto. Asistente bilingüe home office.", url: gjR("asistente bilingue ingles"), salario: "Ver en plataforma" },

  // ENGLISH TEACHER REMOTO
  { id: "r30", tipo: "teacher", modalidad: "remoto", titulo: "Online English Teacher · LinkedIn", empresa: "LinkedIn", plataforma: "LinkedIn", ubicacion: "Remoto · Worldwide", descripcion: "Plataformas de inglés online buscan maestras bilingüe. TOEIC 920 es diferenciador enorme.", url: liR("online english teacher bilingual remote"), salario: "$15-30/hr" },
  { id: "r31", tipo: "teacher", modalidad: "remoto", titulo: "English Tutor / Teacher Online · Indeed", empresa: "Indeed", plataforma: "Indeed", ubicacion: "Remoto · Worldwide", descripcion: "Tutor de inglés online para adultos y corporativos. Filtro Remote activo.", url: indeedR("english teacher tutor online bilingual spanish"), salario: "$15-25/hr" },
  { id: "r32", tipo: "teacher", modalidad: "remoto", titulo: "Corporate English Trainer · Glassdoor", empresa: "Glassdoor", plataforma: "Glassdoor", ubicacion: "Remoto · LATAM / Worldwide", descripcion: "Trainers de inglés corporativo con experiencia en capacitación. Filtro remoto activo.", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=english+corporate+trainer+bilingual+remote&remoteWorkType=1&sortBy=date_desc", salario: "$20-35/hr" },
  { id: "r33", tipo: "teacher", modalidad: "remoto", titulo: "ESL Teacher Online · RemoteOK", empresa: "RemoteOK", plataforma: "RemoteOK", ubicacion: "Remoto · Worldwide", descripcion: "Plataformas ESL buscan maestras bilingüe. Portal 100% remoto con vacantes verificadas.", url: "https://remoteok.com/remote-teacher-jobs", salario: "$15-28/hr" },
  { id: "r34", tipo: "teacher", modalidad: "remoto", titulo: "English Teacher Home Office · OCC", empresa: "OCC Mundial", plataforma: "OCC", ubicacion: "Remoto · México", descripcion: "Maestras de inglés en modalidad Home Office en México. Solo resultados remotos.", url: occR("maestro-ingles"), salario: "Ver en plataforma" },
  { id: "r35", tipo: "teacher", modalidad: "remoto", titulo: "English Teacher Teletrabajo · Computrabajo", empresa: "Computrabajo", plataforma: "Computrabajo", ubicacion: "Remoto · México / LATAM", descripcion: "Maestras de inglés en teletrabajo. Solo resultados remotos.", url: ctR("maestro-ingles"), salario: "Ver en plataforma" },
  { id: "r36", tipo: "teacher", modalidad: "remoto", titulo: "English Teacher Online · Google Jobs", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Remoto · México / Worldwide", descripcion: "Google Jobs con filtro remoto para maestras de inglés online.", url: gjR("maestra ingles online"), salario: "Ver en plataforma" },

  // INTÉRPRETE REMOTO
  { id: "r40", tipo: "interprete", modalidad: "remoto", titulo: "Legal Translator Spanish-English · LinkedIn", empresa: "LinkedIn", plataforma: "LinkedIn", ubicacion: "Remoto · Worldwide", descripcion: "Traductoras legales español-inglés para firmas y organismos internacionales.", url: liR("legal translator spanish english remote"), salario: "$25-50/hr" },
  { id: "r41", tipo: "interprete", modalidad: "remoto", titulo: "Legal Translation · Upwork", empresa: "Upwork", plataforma: "Upwork", ubicacion: "Remoto · Worldwide", descripcion: "Proyectos de traducción legal español-inglés para clientes EE.UU.", url: "https://www.upwork.com/search/jobs/?q=legal+translation+spanish+english&sort=recency", salario: "$25-60/hr" },
  { id: "r42", tipo: "interprete", modalidad: "remoto", titulo: "Remote Interpreter Bilingual · Indeed", empresa: "Indeed", plataforma: "Indeed", ubicacion: "Remoto · USA", descripcion: "Intérpretes bilingüe para sesiones legales vía videollamada. Filtro Remote activo.", url: indeedR("interpreter bilingual spanish english remote"), salario: "$18-35/hr" },
  { id: "r43", tipo: "interprete", modalidad: "remoto", titulo: "Intérprete Home Office · OCC", empresa: "OCC Mundial", plataforma: "OCC", ubicacion: "Remoto · México", descripcion: "Intérprete bilingüe en Home Office México. Solo resultados remotos.", url: occR("interprete-bilingue"), salario: "Ver en plataforma" },
  { id: "r44", tipo: "interprete", modalidad: "remoto", titulo: "Traductora Teletrabajo · Computrabajo", empresa: "Computrabajo", plataforma: "Computrabajo", ubicacion: "Remoto · México / LATAM", descripcion: "Traductoras e intérpretes bilingüe en teletrabajo. Solo resultados remotos.", url: ctR("interprete-bilingue"), salario: "Ver en plataforma" },
  { id: "r45", tipo: "interprete", modalidad: "remoto", titulo: "Intérprete Bilingüe Remote · Google Jobs", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Remoto · México / USA", descripcion: "Google Jobs con filtro remoto para intérpretes y traductores bilingüe.", url: gjR("interprete traductor bilingue"), salario: "Ver en plataforma" },

  // ATENCIÓN A CLIENTES REMOTO
  { id: "r50", tipo: "atencion", modalidad: "remoto", titulo: "Customer Success Bilingüe · LinkedIn", empresa: "LinkedIn", plataforma: "LinkedIn", ubicacion: "Remoto · USA / LATAM", descripcion: "Empresas EE.UU. buscan customer success bilingüe. Paga en USD, 100% remoto.", url: liR("customer success bilingual spanish english remote"), salario: "$40,000-60,000/año" },
  { id: "r51", tipo: "atencion", modalidad: "remoto", titulo: "Client Services Coordinator Bilingüe · Indeed", empresa: "Indeed", plataforma: "Indeed", ubicacion: "Remoto · USA", descripcion: "Coordinadoras de servicio al cliente bilingüe para firmas legales y corporativas EE.UU.", url: indeedR("client services coordinator bilingual spanish"), salario: "$18-25/hr" },
  { id: "r52", tipo: "atencion", modalidad: "remoto", titulo: "Bilingual Customer Support · ZipRecruiter", empresa: "ZipRecruiter", plataforma: "ZipRecruiter", ubicacion: "Remoto · USA", descripcion: "Soporte al cliente bilingüe para empresas EE.UU. Atención en español e inglés.", url: "https://www.ziprecruiter.com/Jobs/Bilingual-Customer-Support-Spanish-English-Remote", salario: "$16-22/hr" },
  { id: "r53", tipo: "atencion", modalidad: "remoto", titulo: "Atención Clientes Bilingüe Home Office · OCC", empresa: "OCC Mundial", plataforma: "OCC", ubicacion: "Remoto · México", descripcion: "Atención a clientes bilingüe en Home Office México. Solo resultados de modalidad remota.", url: occR("atencion-a-clientes-bilingue"), salario: "Ver en plataforma" },
  { id: "r54", tipo: "atencion", modalidad: "remoto", titulo: "Ejecutivo Bilingüe Teletrabajo · Computrabajo", empresa: "Computrabajo", plataforma: "Computrabajo", ubicacion: "Remoto · México / LATAM", descripcion: "Ejecutivos bilingüe en atención a clientes modalidad teletrabajo.", url: ctR("ejecutivo-bilingue"), salario: "Ver en plataforma" },
  { id: "r55", tipo: "atencion", modalidad: "remoto", titulo: "Atención Clientes Bilingüe Remote · Google Jobs", empresa: "Google Jobs", plataforma: "Google Jobs", ubicacion: "Remoto · México / USA", descripcion: "Google Jobs filtrando atención a clientes bilingüe remota. Vacantes actualizadas.", url: gjR("atencion clientes bilingue ingles"), salario: "Ver en plataforma" },
];

const VACANTES = [...VACANTES_REMOTO, ...PRESENCIALES];

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    const favoritos = await redis.get("favoritos") || [];
    return res.status(200).json({ favoritos });
  }

  if (method === "POST") {
    const { action, data } = req.body;

    if (action === "search") {
      const { tipo, modalidad } = data;
      const tc = await getUSDtoMXN();
      let vacantes = VACANTES;
      if (tipo && tipo !== "todos") vacantes = vacantes.filter(v => v.tipo === tipo);
      if (modalidad && modalidad !== "todos") vacantes = vacantes.filter(v => v.modalidad === modalidad);
      const resultado = vacantes.map(v => ({ ...v, salarioMXN: convertirSalario(v.salario, tc) }));
      return res.status(200).json({ vacantes: resultado, tipoCambio: tc });
    }

    if (action === "toggle_favorito") {
      const { id } = data;
      let favoritos = await redis.get("favoritos") || [];
      favoritos = favoritos.includes(id) ? favoritos.filter(f => f !== id) : [...favoritos, id];
      await redis.set("favoritos", favoritos);
      return res.status(200).json({ favoritos });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
