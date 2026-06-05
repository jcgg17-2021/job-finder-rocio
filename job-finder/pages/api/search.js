import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const VACANTES_REMOTO = [
  // LEGAL / PARALEGAL IMMIGRATION
  { id: "1", titulo: "Paralegal Bilingüe - Inmigración EE.UU.", empresa: "LinkedIn", plataforma: "LinkedIn", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Red profesional más grande. Filtra Remote y ordena Most Recent. Ideal para perfiles de removal defense y asylum.", url: "https://www.linkedin.com/jobs/search/?keywords=paralegal+immigration+bilingual+spanish&f_WT=2", salario: "Ver en plataforma", relevancia: "Alta", match: 95 },
  { id: "2", titulo: "Legal Assistant - Immigration Remote", empresa: "Indeed", plataforma: "Indeed", modalidad: "Remoto", ubicacion: "USA / Worldwide", descripcion: "Bolsa global. Filtra Last 7 days y Remote para ver las más recientes. Muchas firmas buscan bilingüe.", url: "https://www.indeed.com/jobs?q=legal+assistant+immigration+bilingual+spanish&l=Remote&sort=date", salario: "$18-28/hr", relevancia: "Alta", match: 95 },
  { id: "3", titulo: "Paralegal - Removal Defense / Asylum", empresa: "Indeed - Especializado", plataforma: "Indeed", modalidad: "Remoto", ubicacion: "USA", descripcion: "Búsqueda específica para removal defense y asylum. Firmas de EE.UU. buscan paralegal bilingüe remoto.", url: "https://www.indeed.com/jobs?q=paralegal+removal+defense+asylum+bilingual&l=Remote&sort=date", salario: "$20-30/hr", relevancia: "Alta", match: 98 },
  { id: "4", titulo: "Immigration Paralegal Bilingual", empresa: "ZipRecruiter", plataforma: "ZipRecruiter", modalidad: "Remoto", ubicacion: "USA / Remote", descripcion: "ZipRecruiter con miles de firmas de inmigración buscando paralegal bilingüe remoto.", url: "https://www.ziprecruiter.com/Jobs/Immigration-Paralegal-Bilingual-Spanish-Remote", salario: "$45,000-65,000/año", relevancia: "Alta", match: 96 },
  { id: "5", titulo: "Paralegal USCIS / EOIR Bilingual", empresa: "Glassdoor", plataforma: "Glassdoor", modalidad: "Remoto", ubicacion: "USA / Worldwide", descripcion: "Vacantes con salarios reales de firmas que trabajan con USCIS y EOIR. Filtra Remote.", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=immigration+paralegal+bilingual+spanish&remoteWorkType=1", salario: "Ver en plataforma", relevancia: "Alta", match: 94 },
  { id: "6", titulo: "Remote Immigration Legal Assistant", empresa: "LinkedIn - Firmas EE.UU.", plataforma: "LinkedIn", modalidad: "Remoto", ubicacion: "USA", descripcion: "Firmas de inmigración en California, Texas, Nueva York buscan legal assistant bilingüe remoto.", url: "https://www.linkedin.com/jobs/search/?keywords=immigration+legal+assistant+bilingual+remote&f_WT=2&f_TPR=r604800", salario: "Ver en plataforma", relevancia: "Alta", match: 97 },

  // LEGAL / PARALEGAL PROPIEDAD INTELECTUAL
  { id: "7", titulo: "Paralegal - Propiedad Intelectual / IP", empresa: "LinkedIn - IP", plataforma: "LinkedIn", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Firmas internacionales de IP buscan paralegal bilingüe con experiencia en patentes y diseños industriales.", url: "https://www.linkedin.com/jobs/search/?keywords=paralegal+intellectual+property+bilingual+spanish&f_WT=2", salario: "Ver en plataforma", relevancia: "Alta", match: 93 },
  { id: "8", titulo: "IP Paralegal Bilingual Remote", empresa: "Indeed - IP", plataforma: "Indeed", modalidad: "Remoto", ubicacion: "USA / Worldwide", descripcion: "Vacantes de paralegal en propiedad intelectual, patentes y marcas para perfil bilingüe.", url: "https://www.indeed.com/jobs?q=IP+paralegal+intellectual+property+bilingual&l=Remote&sort=date", salario: "$50,000-70,000/año", relevancia: "Alta", match: 92 },
  { id: "9", titulo: "Patent Paralegal - International", empresa: "Glassdoor - IP", plataforma: "Glassdoor", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Firmas internacionales de patentes y propiedad intelectual buscan coordinadores bilingües.", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=patent+paralegal+bilingual&remoteWorkType=1", salario: "Ver en plataforma", relevancia: "Alta", match: 90 },

  // ATENCIÓN A CLIENTES BILINGÜE
  { id: "10", titulo: "Customer Success Bilingüe - Remoto", empresa: "LinkedIn - CS", plataforma: "LinkedIn", modalidad: "Remoto", ubicacion: "USA / LATAM", descripcion: "Empresas EE.UU. buscan customer success bilingüe español-inglés. Paga en USD, 100% remoto.", url: "https://www.linkedin.com/jobs/search/?keywords=customer+success+bilingual+spanish+english+remote&f_WT=2", salario: "$40,000-60,000/año", relevancia: "Alta", match: 88 },
  { id: "11", titulo: "Client Services Coordinator Bilingüe", empresa: "Indeed - CS", plataforma: "Indeed", modalidad: "Remoto", ubicacion: "USA / Remote", descripcion: "Coordinadoras de servicio al cliente bilingüe para firmas legales y corporativas en EE.UU.", url: "https://www.indeed.com/jobs?q=client+services+coordinator+bilingual+spanish&l=Remote&sort=date", salario: "$18-25/hr", relevancia: "Alta", match: 87 },
  { id: "12", titulo: "Bilingual Customer Support - Legal", empresa: "ZipRecruiter - CS", plataforma: "ZipRecruiter", modalidad: "Remoto", ubicacion: "USA / Remote", descripcion: "Soporte al cliente bilingüe para firmas legales, tramitación y seguimiento de casos.", url: "https://www.ziprecruiter.com/Jobs/Bilingual-Customer-Support-Spanish-English-Remote", salario: "$16-22/hr", relevancia: "Alta", match: 85 },

  // ENGLISH TEACHER / TUTOR REMOTO
  { id: "13", titulo: "Online English Teacher - Remoto", empresa: "LinkedIn - Teacher", plataforma: "LinkedIn", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Plataformas internacionales buscan maestras de inglés online con perfil bilingüe avanzado.", url: "https://www.linkedin.com/jobs/search/?keywords=online+english+teacher+bilingual+remote&f_WT=2", salario: "$15-30/hr", relevancia: "Alta", match: 85 },
  { id: "14", titulo: "English Tutor / Teacher Online", empresa: "Indeed - Teacher", plataforma: "Indeed", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Vacantes de tutor de inglés online para adultos y corporativos. TOEIC alto es valorado.", url: "https://www.indeed.com/jobs?q=english+teacher+tutor+online+bilingual+spanish&l=Remote&sort=date", salario: "$15-25/hr", relevancia: "Alta", match: 83 },
  { id: "15", titulo: "Corporate English Trainer - Remote", empresa: "Glassdoor - Training", plataforma: "Glassdoor", modalidad: "Remoto", ubicacion: "LATAM / Worldwide", descripcion: "Empresas buscan trainers de inglés corporativo con experiencia en capacitación organizacional.", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=english+corporate+trainer+bilingual&remoteWorkType=1", salario: "$20-35/hr", relevancia: "Alta", match: 86 },
  { id: "16", titulo: "ESL Teacher Online - Español/Inglés", empresa: "RemoteOK - Teacher", plataforma: "RemoteOK", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Plataformas ESL buscan maestras bilingüe español-inglés. Horarios flexibles desde casa.", url: "https://remoteok.com/remote-teacher-jobs", salario: "$15-28/hr", relevancia: "Alta", match: 82 },

  // ASISTENTE BILINGÜE / ADMINISTRATIVA
  { id: "17", titulo: "Asistente Virtual Bilingüe - Remoto", empresa: "LinkedIn - VA", plataforma: "LinkedIn", modalidad: "Remoto", ubicacion: "USA / LATAM", descripcion: "Asistente virtual bilingüe para firmas legales, consultoras y empresas de EE.UU. 100% remoto.", url: "https://www.linkedin.com/jobs/search/?keywords=virtual+assistant+bilingual+spanish+english+legal&f_WT=2", salario: "$15-25/hr", relevancia: "Alta", match: 88 },
  { id: "18", titulo: "Administrative Assistant Bilingüe", empresa: "Indeed - Admin", plataforma: "Indeed", modalidad: "Remoto", ubicacion: "USA / Remote", descripcion: "Asistentes administrativas bilingüe para empresas EE.UU. Manejo de documentos y coordinación.", url: "https://www.indeed.com/jobs?q=administrative+assistant+bilingual+spanish+english&l=Remote&sort=date", salario: "$16-22/hr", relevancia: "Alta", match: 86 },
  { id: "19", titulo: "Executive Assistant Bilingüe", empresa: "Glassdoor - EA", plataforma: "Glassdoor", modalidad: "Remoto", ubicacion: "USA / Worldwide", descripcion: "Asistentes ejecutivas bilingüe para directivos de empresas internacionales. Experiencia en coordinación.", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=executive+assistant+bilingual+spanish+remote&remoteWorkType=1", salario: "$45,000-65,000/año", relevancia: "Alta", match: 87 },
  { id: "20", titulo: "Legal Administrative Assistant Remote", empresa: "ZipRecruiter - Admin", plataforma: "ZipRecruiter", modalidad: "Remoto", ubicacion: "USA / Remote", descripcion: "Asistentes administrativas para firmas legales en EE.UU. Redacción y gestión de expedientes.", url: "https://www.ziprecruiter.com/Jobs/Legal-Administrative-Assistant-Bilingual-Remote", salario: "$18-26/hr", relevancia: "Alta", match: 90 },

  // CAPACITACIÓN / INSTRUCTIONAL DESIGN
  { id: "21", titulo: "Instructional Designer Bilingüe", empresa: "LinkedIn - ID", plataforma: "LinkedIn", modalidad: "Remoto", ubicacion: "LATAM / Worldwide", descripcion: "Diseñadores instruccionales bilingüe para plataformas e-learning y empresas corporativas.", url: "https://www.linkedin.com/jobs/search/?keywords=instructional+designer+bilingual+spanish+english+remote&f_WT=2", salario: "$50,000-75,000/año", relevancia: "Alta", match: 84 },
  { id: "22", titulo: "Training Coordinator Bilingüe Remote", empresa: "Indeed - Training", plataforma: "Indeed", modalidad: "Remoto", ubicacion: "USA / LATAM", descripcion: "Coordinadoras de capacitación bilingüe para empresas multinacionales con oficinas en LATAM.", url: "https://www.indeed.com/jobs?q=training+coordinator+bilingual+spanish+english&l=Remote&sort=date", salario: "$40,000-60,000/año", relevancia: "Alta", match: 83 },

  // FREELANCE GLOBAL
  { id: "23", titulo: "Paralegal / Legal Freelance", empresa: "Upwork", plataforma: "Upwork", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Plataforma freelance líder. Crea perfil con especialidad en immigration law y IP. Clientes de EE.UU.", url: "https://www.upwork.com/search/jobs/?q=paralegal+immigration+bilingual+spanish", salario: "$20-50/hr", relevancia: "Alta", match: 91 },
  { id: "24", titulo: "Legal Translation & Documents", empresa: "Upwork - Traducción", plataforma: "Upwork", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Traducción legal español-inglés, redacción de documentos legales y revisión de contratos.", url: "https://www.upwork.com/search/jobs/?q=legal+translation+spanish+english+paralegal", salario: "$25-60/hr", relevancia: "Alta", match: 90 },
  { id: "25", titulo: "Freelance Legal Projects LATAM", empresa: "Workana", plataforma: "Workana", modalidad: "Remoto", ubicacion: "LATAM", descripcion: "Mayor plataforma freelance LATAM. Proyectos legales, traducción y asistencia administrativa.", url: "https://www.workana.com/jobs?category=legal-law", salario: "Por proyecto", relevancia: "Alta", match: 88 },
  { id: "26", titulo: "Legal Services Freelance", empresa: "PeoplePerHour", plataforma: "PeoplePerHour", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Plataforma freelance europea. Proyectos de paralegal, traducción legal e investigación jurídica.", url: "https://www.peopleperhour.com/freelance-legal-jobs", salario: "Por proyecto", relevancia: "Media", match: 78 },
  { id: "27", titulo: "Virtual Legal Assistant Freelance", empresa: "Fiverr Pro", plataforma: "Fiverr", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Ofrece servicios de asistente legal virtual, redacción de documentos y formularios de inmigración.", url: "https://www.fiverr.com/search/gigs?query=paralegal+bilingual+immigration+legal", salario: "Por proyecto", relevancia: "Media", match: 80 },

  // PORTALES REMOTO ESPECIALIZADOS
  { id: "28", titulo: "Remote Legal Jobs Global", empresa: "RemoteOK", plataforma: "RemoteOK", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Portal 100% remoto. Vacantes legales globales actualizadas diariamente para perfiles bilingüe.", url: "https://remoteok.com/remote-legal-jobs", salario: "Ver en plataforma", relevancia: "Alta", match: 86 },
  { id: "29", titulo: "Remote Legal Positions", empresa: "We Work Remotely", plataforma: "WeWorkRemotely", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Bolsa remota top. Sección Legal & Finance con vacantes internacionales actualizadas.", url: "https://weworkremotely.com/remote-jobs/search?term=paralegal+bilingual+legal", salario: "Ver en plataforma", relevancia: "Alta", match: 85 },
  { id: "30", titulo: "Legal Remote Jobs Curated", empresa: "Remotive", plataforma: "Remotive", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Curación de mejores vacantes remotas. Sección legal para profesionales internacionales.", url: "https://remotive.com/remote-jobs/legal", salario: "Ver en plataforma", relevancia: "Alta", match: 83 },
  { id: "31", titulo: "Remote Legal LATAM USD", empresa: "Hireline", plataforma: "Hireline", modalidad: "Remoto", ubicacion: "LATAM / Worldwide", descripcion: "Plataforma LATAM con empresas que pagan en USD. Legal, admin y bilingüe.", url: "https://hireline.io/mx/empleos-remotos", salario: "USD", relevancia: "Alta", match: 89 },
  { id: "32", titulo: "Legal Jobs Remote - OCC Home Office", empresa: "OCC Mundial", plataforma: "OCC", modalidad: "Home Office", ubicacion: "México", descripcion: "Bolsa líder México. Busca paralegal, asistente legal, coordinadora jurídica en Home Office.", url: "https://www.occ.com.mx/empleos/de-paralegal/?modality=3", salario: "Ver en plataforma", relevancia: "Alta", match: 87 },
  { id: "33", titulo: "Asistente Legal Bilingüe Home Office", empresa: "Computrabajo", plataforma: "Computrabajo", modalidad: "Home Office", ubicacion: "México / LATAM", descripcion: "Mayor bolsa LATAM. Filtra teletrabajo. Asistente legal, coordinadora, bilingüe.", url: "https://www.computrabajo.com.mx/trabajo-de-asistente-legal-bilingue", salario: "Ver en plataforma", relevancia: "Media", match: 80 },
  { id: "34", titulo: "Remote Jobs - Google Jobs", empresa: "Google Jobs", plataforma: "Google", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Google agrega vacantes de TODAS las plataformas. Busca paralegal bilingual remote aquí.", url: "https://www.google.com/search?q=paralegal+bilingual+spanish+remote+job&ibp=htl;jobs&htivrt=jobs&htichips=employment_type:TELECOMMUTE", salario: "Ver en plataforma", relevancia: "Alta", match: 95 },
  { id: "35", titulo: "Legal Jobs Remote - Working Nomads", empresa: "Working Nomads", plataforma: "WorkingNomads", modalidad: "Remoto", ubicacion: "Worldwide", descripcion: "Curación de vacantes remotas globales para nómadas y profesionales independientes.", url: "https://www.workingnomads.com/jobs?category=legal", salario: "Ver en plataforma", relevancia: "Media", match: 76 },
  { id: "36", titulo: "GetOnBoard - Legal LATAM", empresa: "GetOnBoard", plataforma: "GetOnBoard", modalidad: "Remoto", ubicacion: "LATAM", descripcion: "Bolsa LATAM #1 para trabajo remoto con empresas internacionales que pagan en USD.", url: "https://www.getonbrd.com/jobs", salario: "USD", relevancia: "Alta", match: 84 },
];

const VACANTES_PRESENCIAL = [
  { id: "p1", titulo: "English Teacher - Zona Oriente", empresa: "OCC - Oriente", plataforma: "OCC", modalidad: "Presencial", ubicacion: "Texcoco / Los Reyes La Paz / Chimalhuacán", descripcion: "Maestras de inglés en academias y colegios zona oriente EDOMEX y CDMX. Perfil bilingüe avanzado.", url: "https://www.occ.com.mx/empleos/de-maestro-ingles/?location=texcoco", salario: "Ver en plataforma", relevancia: "Alta", match: 90 },
  { id: "p2", titulo: "Asistente Bilingüe - Zona Oriente", empresa: "Computrabajo - Oriente", plataforma: "Computrabajo", modalidad: "Presencial", ubicacion: "Los Reyes La Paz / Iztapalapa / Nezahualcóyotl", descripcion: "Asistentes bilingüe en empresas y despachos zona oriente CDMX y Estado de México.", url: "https://www.computrabajo.com.mx/trabajo-de-asistente-bilingue?l=Iztapalapa%2C+Ciudad+de+M%C3%A9xico", salario: "Ver en plataforma", relevancia: "Alta", match: 87 },
  { id: "p3", titulo: "English Teacher / Instructor Inglés", empresa: "Indeed - Oriente", plataforma: "Indeed", modalidad: "Presencial", ubicacion: "Texcoco / Los Reyes / Iztapalapa", descripcion: "Maestras e instructoras de inglés en academias zona oriente. TOEIC avanzado valorado.", url: "https://www.indeed.com/jobs?q=maestro+ingles+instructor&l=Texcoco%2C+Estado+de+M%C3%A9xico", salario: "Ver en plataforma", relevancia: "Alta", match: 88 },
  { id: "p4", titulo: "Asistente Administrativa Bilingüe", empresa: "LinkedIn - CDMX Oriente", plataforma: "LinkedIn", modalidad: "Presencial", ubicacion: "Iztapalapa / CDMX Oriente", descripcion: "Asistentes administrativas bilingüe en empresas zona oriente CDMX. Coordinación y documentos.", url: "https://www.linkedin.com/jobs/search/?keywords=asistente+administrativa+bilingue&location=Iztapalapa%2C+Mexico+City", salario: "Ver en plataforma", relevancia: "Alta", match: 85 },
  { id: "p5", titulo: "Recepcionista / Asistente Bilingüe", empresa: "OCC - CDMX", plataforma: "OCC", modalidad: "Presencial", ubicacion: "Iztapalapa / CDMX Oriente", descripcion: "Recepcionistas y asistentes bilingüe en despachos, clínicas y empresas zona oriente.", url: "https://www.occ.com.mx/empleos/de-recepcionista-bilingue/?location=iztapalapa", salario: "Ver en plataforma", relevancia: "Alta", match: 83 },
  { id: "p6", titulo: "Coordinadora Administrativa Bilingüe", empresa: "Indeed - Oriente CDMX", plataforma: "Indeed", modalidad: "Presencial", ubicacion: "Nezahualcóyotl / Los Reyes / Texcoco", descripcion: "Coordinadoras y asistentes en empresas de la zona oriente. Perfil bilingüe con experiencia.", url: "https://www.indeed.com/jobs?q=coordinadora+asistente+bilingue&l=Nezahualcoyotl%2C+Estado+de+M%C3%A9xico", salario: "Ver en plataforma", relevancia: "Alta", match: 84 },
  { id: "p7", titulo: "Teacher / Instructor Inglés - Academias", empresa: "Computrabajo - Academias", plataforma: "Computrabajo", modalidad: "Presencial", ubicacion: "Los Reyes La Paz / Chimalhuacán", descripcion: "Instructoras de inglés en academias de idiomas zona oriente EDOMEX. Horarios flexibles.", url: "https://www.computrabajo.com.mx/trabajo-de-instructor-ingles?l=Los+Reyes+la+Paz%2C+Estado+de+M%C3%A9xico", salario: "Ver en plataforma", relevancia: "Alta", match: 86 },
  { id: "p8", titulo: "Asistente Legal / Jurídica Presencial", empresa: "OCC - Legal Oriente", plataforma: "OCC", modalidad: "Presencial", ubicacion: "CDMX Oriente / Texcoco", descripcion: "Asistentes en despachos jurídicos zona oriente CDMX. Experiencia en documentos legales.", url: "https://www.occ.com.mx/empleos/de-asistente-juridica/?location=iztapalapa", salario: "Ver en plataforma", relevancia: "Alta", match: 88 },
  { id: "p9", titulo: "Empleos Locales - Facebook Grupos", empresa: "Facebook Grupos", plataforma: "Facebook", modalidad: "Presencial", ubicacion: "Texcoco / Los Reyes / Iztapalapa", descripcion: "Grupos locales de empleo en Facebook zona oriente. Búsqueda directa en comunidades locales.", url: "https://www.facebook.com/groups/search/results/?q=empleo+bilingue+ingles+texcoco+los+reyes", salario: "Ver en plataforma", relevancia: "Alta", match: 85 },
  { id: "p10", titulo: "Docente Inglés / Coordinadora Educativa", empresa: "Bumeran - Oriente", plataforma: "Bumeran", modalidad: "Presencial", ubicacion: "Texcoco / Los Reyes / Chimalhuacán", descripcion: "Docentes y coordinadoras educativas en instituciones zona oriente Estado de México.", url: "https://www.bumeran.com.mx/empleos-trabajo-de-docente-ingles-estado-de-mexico.html", salario: "Ver en plataforma", relevancia: "Media", match: 80 },
  { id: "p11", titulo: "Asistente RH Bilingüe - Zona Oriente", empresa: "LinkedIn - RH", plataforma: "LinkedIn", modalidad: "Presencial", ubicacion: "CDMX Oriente / Iztapalapa", descripcion: "Asistentes de recursos humanos bilingüe. Experiencia en Hasbro México es valorada.", url: "https://www.linkedin.com/jobs/search/?keywords=asistente+recursos+humanos+bilingue&location=Iztapalapa", salario: "Ver en plataforma", relevancia: "Media", match: 78 },
  { id: "p12", titulo: "Google Jobs - Empleo Zona Oriente", empresa: "Google Jobs", plataforma: "Google", modalidad: "Presencial", ubicacion: "Texcoco / Los Reyes / Iztapalapa", descripcion: "Google agrega vacantes de todas las bolsas. Busca asistente bilingüe o maestra inglés zona oriente.", url: "https://www.google.com/search?q=empleo+asistente+bilingue+maestra+ingles+texcoco+los+reyes+iztapalapa&ibp=htl;jobs", salario: "Ver en plataforma", relevancia: "Alta", match: 92 },
];

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    const favoritos = await redis.get("favoritos") || [];
    const kanban = await redis.get("kanban") || { interesante: [], aplicada: [], proceso: [], rechazada: [] };
    return res.status(200).json({ favoritos, kanban });
  }

  if (method === "POST") {
    const { action, data } = req.body;

    if (action === "search") {
      const { tipo } = data;
      const vacantes = tipo === "presencial" ? VACANTES_PRESENCIAL : VACANTES_REMOTO;
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
Perfil completo:
- Paralegal / Legal Assistant bilingüe español-inglés con 10+ años de experiencia
- Especialista en Derecho Migratorio EE.UU.: Removal Defense, Asylum I-589, Withholding 42B, G-28, E-28, I-360, I-765, USCIS, EOIR
- Especialista en Propiedad Intelectual: patentes, diseños industriales, gestión internacional ante Patent Office
- Empresas: New Frontier Immigration Law (2025-2026), Aguila Immigration Services (2024-2025), ClarkeModet México (2018-2023), Hasbro México RH (2011)
- TOEIC 920/990, Teachers Training Course The Anglo, Gateway Course Utah USA
- Licenciatura en Pedagogía UNAM FES Aragón, Diplomado Capacitación Organizacional UNAM
- Habilidades: redacción legal inglés/español, atención clientes, gestión expedientes, coordinación internacional, capacitación personal, traducción oficial
La carta debe ser concisa (3 párrafos), profesional y personalizada. Solo la carta, sin explicaciones ni encabezados extra.`
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
