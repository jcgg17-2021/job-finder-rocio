export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Falta el prompt" });

  const keywords = encodeURIComponent("paralegal bilingual spanish immigration remote");
  const keywordsES = encodeURIComponent("paralegal bilingüe español remoto");

  const vacantes = [
    {
      titulo: "Paralegal Bilingüe - Inmigración",
      empresa: "Buscar en LinkedIn",
      plataforma: "LinkedIn",
      modalidad: "Remoto",
      ubicacion: "Worldwide",
      descripcion: "Resultados en tiempo real de LinkedIn para paralegal bilingüe en inmigración remoto.",
      url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent("bilingual paralegal immigration remote")}&f_WT=2`,
      salario: "Ver en plataforma",
      relevancia: "Alta"
    },
    {
      titulo: "Legal Assistant Bilingüe - Remote",
      empresa: "Buscar en Indeed",
      plataforma: "Indeed",
      modalidad: "Remoto",
      ubicacion: "USA / Worldwide",
      descripcion: "Resultados actuales en Indeed para asistente legal bilingüe español-inglés remoto.",
      url: `https://www.indeed.com/jobs?q=bilingual+paralegal+immigration&l=Remote&sort=date`,
      salario: "Ver en plataforma",
      relevancia: "Alta"
    },
    {
      titulo: "Remote Paralegal - Immigration Law",
      empresa: "Buscar en RemoteOK",
      plataforma: "RemoteOK",
      modalidad: "Remoto",
      ubicacion: "Worldwide",
      descripcion: "Vacantes remotas globales para paralegal en derecho migratorio.",
      url: `https://remoteok.com/remote-paralegal-jobs`,
      salario: "Ver en plataforma",
      relevancia: "Alta"
    },
    {
      titulo: "Bilingual Legal Assistant - Remote",
      empresa: "Buscar en WeWorkRemotely",
      plataforma: "WeWorkRemotely",
      modalidad: "Remoto",
      ubicacion: "Worldwide",
      descripcion: "Posiciones remotas para asistente legal bilingüe en empresas internacionales.",
      url: `https://weworkremotely.com/remote-jobs/search?term=bilingual+legal+paralegal`,
      salario: "Ver en plataforma",
      relevancia: "Alta"
    },
    {
      titulo: "Paralegal / Asistente Legal - Home Office",
      empresa: "Buscar en OCC",
      plataforma: "OCC",
      modalidad: "Home Office",
      ubicacion: "México",
      descripcion: "Vacantes recientes en OCC para paralegal o asistente legal bilingüe en México.",
      url: `https://www.occ.com.mx/empleos/de-paralegal-asistente-legal/?modality=3`,
      salario: "Ver en plataforma",
      relevancia: "Alta"
    },
    {
      titulo: "Asistente Jurídico Bilingüe - Remoto",
      empresa: "Buscar en Computrabajo",
      plataforma: "Computrabajo",
      modalidad: "Home Office",
      ubicacion: "México / LATAM",
      descripcion: "Búsqueda en Computrabajo de puestos jurídicos bilingües en modalidad remota.",
      url: `https://www.computrabajo.com.mx/trabajo-de-asistente-juridico-bilingue?modality=remote`,
      salario: "Ver en plataforma",
      relevancia: "Media"
    },
    {
      titulo: "Remote Legal Jobs - Bilingual Spanish",
      empresa: "Buscar en FlexJobs",
      plataforma: "FlexJobs",
      modalidad: "Remoto",
      ubicacion: "Worldwide",
      descripcion: "FlexJobs especializado en trabajo remoto y flexible para profesionales legales bilingües.",
      url: `https://www.flexjobs.com/jobs/paralegal-bilingual-spanish?remote=true`,
      salario: "Ver en plataforma",
      relevancia: "Alta"
    },
    {
      titulo: "Paralegal - Propiedad Intelectual Remoto",
      empresa: "Buscar en Jobicy",
      plataforma: "Jobicy",
      modalidad: "Remoto",
      ubicacion: "Worldwide",
      descripcion: "Vacantes globales en Jobicy para paralegal en propiedad intelectual y derecho internacional.",
      url: `https://jobicy.com/?s=paralegal+bilingual+legal`,
      salario: "Ver en plataforma",
      relevancia: "Media"
    }
  ];

  // Filtrar por prompt si contiene palabras clave específicas
  let filtradas = vacantes;
  if (prompt.includes("propiedad intelectual") || prompt.includes("patentes")) {
    filtradas = vacantes.map(v => ({
      ...v,
      url: v.plataforma === "LinkedIn" 
        ? "https://www.linkedin.com/jobs/search/?keywords=paralegal+intellectual+property+bilingual+remote&f_WT=2"
        : v.plataforma === "Indeed"
        ? "https://www.indeed.com/jobs?q=paralegal+intellectual+property+bilingual&l=Remote&sort=date"
        : v.url
    }));
  } else if (prompt.includes("México") || prompt.includes("home office")) {
    filtradas = vacantes.filter(v => ["OCC", "Computrabajo", "LinkedIn", "Indeed"].includes(v.plataforma));
  } else if (prompt.includes("pedagog") || prompt.includes("capacitación")) {
    filtradas = vacantes.map(v => ({
      ...v,
      titulo: v.plataforma === "LinkedIn" ? "Instructional Designer / Capacitación Remoto" : v.titulo,
      url: v.plataforma === "LinkedIn"
        ? "https://www.linkedin.com/jobs/search/?keywords=instructional+designer+bilingual+spanish+remote&f_WT=2"
        : v.plataforma === "Indeed"
        ? "https://www.indeed.com/jobs?q=instructional+designer+bilingual+spanish&l=Remote&sort=date"
        : v.url
    }));
  }

  res.status(200).json({ vacantes: filtradas });
}
