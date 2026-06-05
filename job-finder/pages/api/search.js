export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Falta el prompt" });

  const esIP = prompt.includes("propiedad intelectual") || prompt.includes("patentes");
  const esPed = prompt.includes("pedagog") || prompt.includes("capacitación");
  const esMX = prompt.includes("México") || prompt.includes("home office");

  const q = encodeURIComponent(esIP ? "paralegal intellectual property bilingual"
    : esPed ? "instructional designer bilingual spanish"
    : "paralegal immigration bilingual spanish");

  const qES = encodeURIComponent(esIP ? "paralegal propiedad intelectual bilingue"
    : esPed ? "capacitacion instructor bilingue"
    : "paralegal juridico bilingue");

  const vacantes = [
    {
      titulo: "Paralegal / Legal Assistant Bilingüe",
      empresa: "LinkedIn",
      plataforma: "LinkedIn",
      modalidad: "Remoto",
      ubicacion: "Worldwide",
      descripcion: "La red profesional más grande. Filtra por 'Remote' y ordena por 'Most Recent'.",
      url: `https://www.linkedin.com/jobs/search/?keywords=${q}&f_WT=2`,
      salario: "Ver en plataforma",
      relevancia: "Alta"
    },
    {
      titulo: "Paralegal / Legal Assistant Remote",
      empresa: "Indeed",
      plataforma: "Indeed",
      modalidad: "Remoto",
      ubicacion: "USA / Worldwide",
      descripcion: "Bolsa global con miles de vacantes. Usa 'Date posted: Last 7 days' para ver recientes.",
      url: `https://www.indeed.com/jobs?q=${q}&l=Remote`,
      salario: "Ver en plataforma",
      relevancia: "Alta"
    },
    {
      titulo: "Remote Legal Jobs",
      empresa: "RemoteOK",
      plataforma: "RemoteOK",
      modalidad: "Remoto",
      ubicacion: "Worldwide",
      descripcion: "Portal 100% remoto actualizado diariamente con vacantes legales globales.",
      url: `https://remoteok.com/remote-legal-jobs`,
      salario: "Ver en plataforma",
      relevancia: "Alta"
    },
    {
      titulo: "Remote Legal Positions",
      empresa: "We Work Remotely",
      plataforma: "WeWorkRemotely",
      modalidad: "Remoto",
      ubicacion: "Worldwide",
      descripcion: "Una de las bolsas remotas más grandes. Sección Legal & Finance actualizada.",
      url: `https://weworkremotely.com/remote-jobs/search?term=${q}`,
      salario: "Ver en plataforma",
      relevancia: "Alta"
    },
    {
      titulo: "Legal / Paralegal Jobs Remote",
      empresa: "Remotive",
      plataforma: "Remotive",
      modalidad: "Remoto",
      ubicacion: "Worldwide",
      descripcion: "Remotive agrega las mejores vacantes remotas globales para perfiles profesionales.",
      url: `https://remotive.com/remote-jobs/legal`,
      salario: "Ver en plataforma",
      relevancia: "Alta"
    },
    {
      titulo: "Paralegal Bilingüe - Freelance",
      empresa: "Workana",
      plataforma: "Workana",
      modalidad: "Remoto",
      ubicacion: "LATAM",
      descripcion: "Mayor plataforma freelance de LATAM. Proyectos legales en español e inglés.",
      url: `https://www.workana.com/jobs?category=legal-law&language=es`,
      salario: "Por proyecto",
      relevancia: "Alta"
    },
    {
      titulo: "Legal Assistant - Freelance Global",
      empresa: "Upwork",
      plataforma: "Upwork",
      modalidad: "Remoto",
      ubicacion: "Worldwide",
      descripcion: "Plataforma freelance líder mundial. Crea perfil y aplica a proyectos legales bilingües.",
      url: `https://www.upwork.com/search/jobs/?q=${q}`,
      salario: "Por proyecto",
      relevancia: "Alta"
    },
    {
      titulo: "Paralegal / Legal Services",
      empresa: "Fiverr Pro",
      plataforma: "Fiverr",
      modalidad: "Remoto",
      ubicacion: "Worldwide",
      descripcion: "Ofrece servicios legales como freelancer. Ideal para redacción y revisión de documentos.",
      url: `https://www.fiverr.com/search/gigs?query=paralegal+bilingual+legal`,
      salario: "Por proyecto",
      relevancia: "Media"
    },
    {
      titulo: "Remote Legal Jobs - Bilingüe",
      empresa: "Jobspresso",
      plataforma: "Jobspresso",
      modalidad: "Remoto",
      ubicacion: "Worldwide",
      descripcion: "Bolsa curada de trabajo remoto. Vacantes legales verificadas y actualizadas.",
      url: `https://jobspresso.co/browsejobs/#s=${q}`,
      salario: "Ver en plataforma",
      relevancia: "Media"
    },
    {
      titulo: "Legal / Paralegal Remote",
      empresa: "Hireline",
      plataforma: "Hireline",
      modalidad: "Remoto",
      ubicacion: "LATAM / Worldwide",
      descripcion: "Plataforma LATAM de trabajo remoto con empresas internacionales que pagan en USD.",
      url: `https://hireline.io/mx/empleos-remotos?q=${qES}`,
      salario: "USD",
      relevancia: "Alta"
    },
    {
      titulo: "Legal Jobs - Remote LATAM",
      empresa: "GetOnBoard",
      plataforma: "GetOnBoard",
      modalidad: "Remoto",
      ubicacion: "LATAM",
      descripcion: "Bolsa tech y profesional LATAM #1. Vacantes remotas con empresas que pagan en USD.",
      url: `https://www.getonbrd.com/jobs?q=${qES}`,
      salario: "USD",
      relevancia: "Alta"
    },
    {
      titulo: "Paralegal / Asistente Legal",
      empresa: "OCC Mundial",
      plataforma: "OCC",
      modalidad: "Home Office",
      ubicacion: "México",
      descripcion: "Bolsa líder en México. Filtra por Home Office para vacantes remotas recientes.",
      url: `https://www.occ.com.mx/empleos/de-paralegal/?modality=3`,
      salario: "Ver en plataforma",
      relevancia: "Alta"
    },
    {
      titulo: "Asistente Legal Bilingüe",
      empresa: "Computrabajo",
      plataforma: "Computrabajo",
      modalidad: "Home Office",
      ubicacion: "México / LATAM",
      descripcion: "Mayor bolsa LATAM. Filtra teletrabajo para posiciones remotas en México y región.",
      url: `https://www.computrabajo.com.mx/trabajo-de-asistente-legal-bilingue`,
      salario: "Ver en plataforma",
      relevancia: "Media"
    },
    {
      titulo: "Remote Legal Jobs",
      empresa: "Working Nomads",
      plataforma: "WorkingNomads",
      modalidad: "Remoto",
      ubicacion: "Worldwide",
      descripcion: "Curación de las mejores vacantes remotas globales para nómadas digitales.",
      url: `https://www.workingnomads.com/jobs?category=legal`,
      salario: "Ver en plataforma",
      relevancia: "Media"
    },
    {
      titulo: "Paralegal - Remote Global",
      empresa: "Glassdoor",
      plataforma: "Glassdoor",
      modalidad: "Remoto",
      ubicacion: "Worldwide",
      descripcion: "Vacantes con salarios reales y reseñas de empresas. Filtra por Remote.",
      url: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${q}&remoteWorkType=1`,
      salario: "Ver en plataforma",
      relevancia: "Alta"
    },
    {
      titulo: "Legal Freelance Projects",
      empresa: "PeoplePerHour",
      plataforma: "PeoplePerHour",
      modalidad: "Remoto",
      ubicacion: "Worldwide",
      descripcion: "Plataforma freelance europea con proyectos legales internacionales en inglés.",
      url: `https://www.peopleperhour.com/freelance-legal-jobs`,
      salario: "Por proyecto",
      relevancia: "Media"
    }
  ];

  res.status(200).json({ vacantes });
}
