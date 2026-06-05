import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const VACANTES = [
  { id: "1", titulo: "Paralegal / Legal Assistant Bilingüe", empresa: "LinkedIn", plataforma: "LinkedIn", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "La red profesional más grande. Filtra por Remote y ordena por Most Recent.", url: "https://www.linkedin.com/jobs/search/?keywords=paralegal+immigration+bilingual+spanish&f_WT=2", salario: "Ver en plataforma", relevancia: "Alta", match: 95 },
  { id: "2", titulo: "Paralegal / Legal Assistant Remote", empresa: "Indeed", plataforma: "Indeed", modalidad: "Remoto", ubicacion: "USA / Worldwide", descripcion: "Bolsa global con miles de vacantes. Usa Date posted: Last 7 days para ver recientes.", url: "https://www.indeed.com/jobs?q=paralegal+immigration+bilingual&l=Remote", salario: "Ver en plataforma", relevancia: "Alta", match: 92 },
  { id: "3", titulo: "Remote Legal Jobs", empresa: "RemoteOK", plataforma: "RemoteOK", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Portal 100% remoto actualizado diariamente con vacantes legales globales.", url: "https://remoteok.com/remote-legal-jobs", salario: "Ver en plataforma", relevancia: "Alta", match: 88 },
  { id: "4", titulo: "Remote Legal Positions", empresa: "We Work Remotely", plataforma: "WeWorkRemotely", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Una de las bolsas remotas más grandes. Sección Legal & Finance actualizada.", url: "https://weworkremotely.com/remote-jobs/search?term=paralegal+bilingual", salario: "Ver en plataforma", relevancia: "Alta", match: 87 },
  { id: "5", titulo: "Legal / Paralegal Jobs Remote", empresa: "Remotive", plataforma: "Remotive", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Remotive agrega las mejores vacantes remotas globales para perfiles profesionales.", url: "https://remotive.com/remote-jobs/legal", salario: "Ver en plataforma", relevancia: "Alta", match: 85 },
  { id: "6", titulo: "Paralegal Bilingüe - Freelance", empresa: "Workana", plataforma: "Workana", modalidad: "Remoto", ubicacion: "LATAM", descripcion: "Mayor plataforma freelance de LATAM. Proyectos legales en español e inglés.", url: "https://www.workana.com/jobs?category=legal-law", salario: "Por proyecto", relevancia: "Alta", match: 90 },
  { id: "7", titulo: "Legal Assistant - Freelance Global", empresa: "Upwork", plataforma: "Upwork", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Plataforma freelance líder mundial. Proyectos legales bilingües.", url: "https://www.upwork.com/search/jobs/?q=paralegal+immigration+bilingual", salario: "Por proyecto", relevancia: "Alta", match: 89 },
  { id: "8", titulo: "Paralegal / Legal Services", empresa: "Fiverr Pro", plataforma: "Fiverr", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Ofrece servicios legales como freelancer. Redacción y revisión de documentos.", url: "https://www.fiverr.com/search/gigs?query=paralegal+bilingual+legal", salario: "Por proyecto", relevancia: "Media", match: 75 },
  { id: "9", titulo: "Remote Legal Jobs Bilingüe", empresa: "Jobspresso", plataforma: "Jobspresso", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Bolsa curada de trabajo remoto. Vacantes legales verificadas y actualizadas.", url: "https://jobspresso.co/browsejobs/", salario: "Ver en plataforma", relevancia: "Media", match: 78 },
  { id: "10", titulo: "Legal / Paralegal Remote", empresa: "Hireline", plataforma: "Hireline", modalidad: "Remoto", ubicacion: "LATAM / Worldwide", descripcion: "Plataforma LATAM de trabajo remoto con empresas que pagan en USD.", url: "https://hireline.io/mx/empleos-remotos", salario: "USD", relevancia: "Alta", match: 91 },
  { id: "11", titulo: "Legal Jobs Remote LATAM", empresa: "GetOnBoard", plataforma: "GetOnBoard", modalidad: "Remoto", ubicacion: "LATAM", descripcion: "Bolsa profesional LATAM #1. Vacantes remotas con empresas que pagan en USD.", url: "https://www.getonbrd.com/jobs", salario: "USD", relevancia: "Alta", match: 86 },
  { id: "12", titulo: "Paralegal / Asistente Legal", empresa: "OCC Mundial", plataforma: "OCC", modalidad: "Home Office", ubicacion: "México", descripcion: "Bolsa líder en México. Filtra por Home Office para vacantes remotas recientes.", url: "https://www.occ.com.mx/empleos/de-paralegal/", salario: "Ver en plataforma", relevancia: "Alta", match: 88 },
  { id: "13", titulo: "Asistente Legal Bilingüe", empresa: "Computrabajo", plataforma: "Computrabajo", modalidad: "Home Office", ubicacion: "México / LATAM", descripcion: "Mayor bolsa LATAM. Filtra teletrabajo para posiciones remotas.", url: "https://www.computrabajo.com.mx/trabajo-de-asistente-legal", salario: "Ver en plataforma", relevancia: "Media", match: 80 },
  { id: "14", titulo: "Remote Legal Jobs", empresa: "Working Nomads", plataforma: "WorkingNomads", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Curación de las mejores vacantes remotas globales.", url: "https://www.workingnomads.com/jobs?category=legal", salario: "Ver en plataforma", relevancia: "Media", match: 77 },
  { id: "15", titulo: "Paralegal Remote Global", empresa: "Glassdoor", plataforma: "Glassdoor", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Vacantes con salarios reales y reseñas de empresas. Filtra por Remote.", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=paralegal+bilingual&remoteWorkType=1", salario: "Ver en plataforma", relevancia: "Alta", match: 84 },
  { id: "16", titulo: "Legal Freelance Projects", empresa: "PeoplePerHour", plataforma: "PeoplePerHour", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Plataforma freelance europea con proyectos legales internacionales.", url: "https://www.peopleperhour.com/freelance-legal-jobs", salario: "Por proyecto", relevancia: "Media", match: 73 },
];

export default async function handler(req, res) {
  const { method } = req;

  // GET favoritos y kanban
  if (method === "GET") {
    const favoritos = await redis.get("favoritos") || [];
    const kanban = await redis.get("kanban") || { interesante: [], aplicada: [], proceso: [], rechazada: [] };
    return res.status(200).json({ favoritos, kanban });
  }

  // POST búsqueda
  if (method === "POST") {
    const { action, data } = req.body;

    if (action === "search") {
      const { prompt } = data;
      let vacantes = [...VACANTES];
      if (prompt.includes("propiedad intelectual") || prompt.includes("patentes")) {
        vacantes = vacantes.map(v => ({ ...v, url: v.plataforma === "LinkedIn" ? "https://www.linkedin.com/jobs/search/?keywords=paralegal+intellectual+property+bilingual&f_WT=2" : v.url }));
      } else if (prompt.includes("México") || prompt.includes("home office")) {
        vacantes = vacantes.filter(v => ["OCC", "Computrabajo", "LinkedIn", "Indeed", "Workana", "Hireline"].includes(v.plataforma));
      } else if (prompt.includes("pedagog") || prompt.includes("capacitación")) {
        vacantes = vacantes.map(v => ({ ...v, url: v.plataforma === "LinkedIn" ? "https://www.linkedin.com/jobs/search/?keywords=instructional+designer+bilingual+spanish&f_WT=2" : v.url }));
      }
      return res.status(200).json({ vacantes: vacantes.sort((a, b) => b.match - a.match) });
    }

    if (action === "toggle_favorito") {
      const { id } = data;
      let favoritos = await redis.get("favoritos") || [];
      favoritos = favoritos.includes(id) ? favoritos.filter(f => f !== id) : [...favoritos, id];
      await redis.set("favoritos", favoritos);
      return res.status(200).json({ favoritos });
    }

    if (action === "kanban_move") {
      const { id, columna, titulo, empresa, url } = data;
      let kanban = await redis.get("kanban") || { interesante: [], aplicada: [], proceso: [], rechazada: [] };
      Object.keys(kanban).forEach(k => { kanban[k] = kanban[k].filter(v => v.id !== id); });
      if (columna) kanban[columna] = [...(kanban[columna] || []), { id, titulo, empresa, url }];
      await redis.set("kanban", kanban);
      return res.status(200).json({ kanban });
    }

    if (action === "carta") {
      const { vacante } = data;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Escribe una carta de presentación profesional en inglés para Rocío Sánchez aplicando a: "${vacante.titulo}" en "${vacante.empresa}".
Perfil: Paralegal bilingüe español-inglés, 10+ años experiencia, especialista en inmigración EE.UU. y propiedad intelectual, ex New Frontier Immigration Law, Clarke Modet, Hasbro México. TOEIC 920/990.
La carta debe ser concisa (3 párrafos), profesional, personalizada para el puesto. Solo la carta, sin explicaciones.`
          }]
        })
      });
      const ai = await response.json();
      const carta = ai.content?.[0]?.text || "";
      return res.status(200).json({ carta });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
