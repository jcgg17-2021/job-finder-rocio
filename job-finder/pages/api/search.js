export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Falta el prompt" });

  const esIP = prompt.includes("propiedad intelectual") || prompt.includes("patentes");
  const esMX = prompt.includes("México") || prompt.includes("home office");
  const esPed = prompt.includes("pedagog") || prompt.includes("capacitación");

  const termino = esIP
    ? "paralegal+intellectual+property+bilingual"
    : esPed
    ? "instructional+designer+bilingual+spanish"
    : "paralegal+immigration+bilingual+spanish";

  const terminoES = esIP
    ? "paralegal+propiedad+intelectual+bilingue"
    : esPed
    ? "capacitacion+corporativa+bilingue+remoto"
    : "paralegal+juridico+bilingue+remoto";

  const vacantes = [
    {
      titulo: esIP ? "Paralegal IP Bilingüe - Remoto" : esPed ? "Instructional Designer Bilingüe" : "Paralegal Inmigración Bilingüe",
      empresa: "LinkedIn Jobs",
      plataforma: "LinkedIn",
      modalidad: "Remoto",
      ubicacion: "Worldwide",
      descripcion: "Resultados en tiempo real ordenados por fecha en LinkedIn. Filtra por 'Remote' y 'Most Recent'.",
      url: `https://www.linkedin.com/jobs/search/?keywords=${termino.replace(/\+/g, "%20")}&f_WT=2&sortBy=DD`,
      salario: "Ver en plataforma",
      relevancia: "Alta"
    },
    {
      titulo: esIP ? "IP Paralegal Remote" : esPed ? "Training Coordinator Remote" : "Immigration Paralegal Remote",
      empresa: "Indeed",
      plataforma: "Indeed",
      modalidad: "Remoto",
      ubicacion: "USA / Worldwide",
      descripcion: "Vacantes ordenadas por fecha más reciente en Indeed. Clic en 'Date posted' para filtrar.",
      url: `https://www.indeed.com/jobs?q=${termino}&sc=0kf%3Aattr(DSQF7)%3B&sort=date`,
      salario: "Ver en plataforma",
      relevancia: "Alta"
    },
    {
      titulo: "Remote Paralegal / Legal Jobs",
      empresa: "RemoteOK",
      plataforma: "RemoteOK",
      modalidad: "Remoto",
      ubicacion: "Worldwide",
      descripcion: "Portal especializado en trabajo 100% remoto. Resultados globales para perfiles legales.",
      url: `https://remoteok.com/remote-legal-jobs`,
      salario: "Ver en plataforma",
      relevancia: "Alta"
    },
    {
      titulo: "Remote Legal / Paralegal Positions",
      empresa: "We Work Remotely",
      plataforma: "WeWorkRemotely",
      modalidad: "Remoto",
      ubicacion: "Worldwide",
      descripcion: "Una de las bolsas de trabajo remoto más grandes del mundo. Sección Legal & Finance.",
      url: `https://weworkremotely.com/categories/remote-legal-jobs`,
      salario: "Ver en plataforma",
      relevancia: "Alta"
    },
    {
      titulo: esPed ? "Capacitación / E-Learning Remoto" : "Paralegal / Asistente Legal",
      empresa: "OCC Mundial",
      plataforma: "OCC",
      modalidad: "Home Office",
      ubicacion: "México",
      descripcion: "Bolsa de trabajo líder en México. Filtra por 'Home Office' para ver vacantes remotas recientes.",
      url: `https://www.occ.com.mx/empleos/de-${esPed ? "capacitacion-instructor" : "paralegal-asistente-juridico"}/?modality=3&sort=date`,
      salario: "Ver en plataforma",
      relevancia: "Alta"
    },
    {
      titulo: "Asistente Legal Bilingüe - Remoto",
      empresa: "Computrabajo México",
      plataforma: "Computrabajo",
      modalidad: "Home Office",
      ubicacion: "México / LATAM",
      descripcion: "Bolsa de empleo LATAM con filtro de teletrabajo. Resultados en México y resto de la región.",
      url: `https://www.computrabajo.com.mx/trabajo-de-${esPed ? "instructor-capacitacion" : "asistente-juridico-bilingue"}`,
      salario: "Ver en plataforma",
      relevancia: "Media"
    },
    {
      titulo: "Remote Legal Jobs - Bilingual",
      empresa: "Jobicy",
      plataforma: "Jobicy",
      modalidad: "Remoto",
      ubicacion: "Worldwide",
      descripcion: "Jobicy agrega vacantes remotas globales. Búsqueda directa para perfiles legales bilingües.",
      url: `https://jobicy.com/?s=${termino.replace(/\+/g, "+")}`,
      salario: "Ver en plataforma",
      relevancia: "Media"
    },
    {
      titulo: "Flexible Remote Legal Positions",
      empresa: "FlexJobs",
      plataforma: "FlexJobs",
      modalidad: "Remoto",
      ubicacion: "Worldwide",
      descripcion: "Especializado en trabajo flexible y remoto. Requiere cuenta gratuita para ver detalles.",
      url: `https://www.flexjobs.com/search?search=${termino}&location=remote`,
      salario: "Ver en plataforma",
      relevancia: "Media"
    }
  ];

  res.status(200).json({ vacantes });
}
